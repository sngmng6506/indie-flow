import postgres from 'postgres';
import { readFile } from 'node:fs/promises';

const url = process.env.DATABASE_URL;
if (!url) throw new Error('DATABASE_URL is required');
const seed = JSON.parse(await readFile(new URL('../data/verified-shows-2026-nov-dec-extra.json', import.meta.url), 'utf8'));
const approvedSource = 'https://hasniugmmldebxwzulig.supabase.co/storage/v1/object/public/event-images/';
const names = new Set(seed.venues.map(v => v.name));
const keys = new Set();
const verifyDate = (date) => {
  if (!/^2026-(11|12)-\d{2}T(?:[01]\d|2[0-3]):[0-5]\d$/.test(date)) throw new Error('Invalid time: ' + date);
  const parsed = new Date(date + ':00+09:00');
  const actual = new Intl.DateTimeFormat('en-CA', {timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).format(parsed);
  if (!Number.isFinite(parsed.valueOf()) || actual !== date.slice(0,10)) throw new Error('Invalid Seoul calendar date');
  return parsed.toISOString();
};
for (const event of [...seed.events, ...seed.posterUpdates]) {
  if (!names.has(event.venue)) throw new Error('Unknown venue: ' + event.venue);
  verifyDate(event.startsAt);
  if (typeof event.title !== 'string' || event.title.length < 2 || event.title.length > 180) throw new Error('Invalid title');
  const key = [event.venue,event.title,event.startsAt].join('|');
  if (keys.has(key)) throw new Error('Duplicate event: ' + key);
  keys.add(key);
  const image = new URL(event.posterUrl);
  if (!event.posterUrl.startsWith(approvedSource) || image.protocol !== 'https:' || !image.pathname.endsWith('.webp')) throw new Error('Unverified poster URL');
  if (event.sourceUrl && !event.sourceUrl.startsWith('https://www.indiego.co.kr/events/')) throw new Error('Unsupported source URL');
  if (event.lineup && event.lineup.length > 1000) throw new Error('Lineup too long');
  for (const value of [event.advancePrice, event.doorPrice]) {
    if (value !== undefined && value !== null && (!Number.isSafeInteger(value) || value < 0)) throw new Error('Invalid ticket price');
  }
}

const sql = postgres(url, {max:1,idle_timeout:20,connect_timeout:10});
try {
  await sql.begin(async tx => {
    // Same marker table as the first verified seed; the transaction is applied once.
    await tx`CREATE TABLE IF NOT EXISTS verified_seed_batches (batch_key text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())`;
    await tx`SELECT pg_advisory_xact_lock(hashtext(${seed.batchId}))`;
    const applied = await tx`SELECT batch_key FROM verified_seed_batches WHERE batch_key=${seed.batchId}`;
    if (applied.length) { console.log('Extended concerts already loaded:',seed.batchId); return; }
    const venueIds = new Map();
    for (const venue of seed.venues) {
      const existing = await tx`SELECT id FROM venues WHERE name=${venue.name} ORDER BY id LIMIT 1`;
      const id = existing.length ? existing[0].id :
        (await tx`INSERT INTO venues(name,address,lat,lng) VALUES(${venue.name},${venue.address},${venue.lat},${venue.lng}) RETURNING id`)[0].id;
      venueIds.set(venue.name,id);
    }
    let added = 0, images = 0;
    for (const event of seed.events) {
      const startsAt = verifyDate(event.startsAt);
      const inserted = await tx`INSERT INTO events (
        venue_id,title,starts_at,advance_price,door_price,ticket_url,source_url,source_name,
        lineup,summary,poster_url,poster_approved,status,checked_at
      ) VALUES (
        ${venueIds.get(event.venue)},${event.title},${startsAt},
        ${event.advancePrice},${event.doorPrice},NULL,${event.sourceUrl},${event.sourceName},
        ${event.lineup},'',${event.posterUrl},true,'published',now()
      ) ON CONFLICT (venue_id,starts_at,title) DO NOTHING RETURNING id`;
      added += inserted.length;
      // Enrich a pre-existing published listing, never resurrect a hidden listing.
      if (!inserted.length) {
        const result = await tx`UPDATE events SET poster_url=${event.posterUrl},poster_approved=true,updated_at=now()
          WHERE venue_id=${venueIds.get(event.venue)} AND title=${event.title} AND starts_at=${startsAt}
            AND status='published' AND (poster_url IS NULL OR poster_url='') RETURNING id`;
        images += result.length;
      }
    }
    for (const item of seed.posterUpdates) {
      const result = await tx`UPDATE events SET poster_url=${item.posterUrl},poster_approved=true,updated_at=now()
        WHERE venue_id=${venueIds.get(item.venue)} AND title=${item.title} AND starts_at=${verifyDate(item.startsAt)}
          AND status='published' AND (poster_url IS NULL OR poster_url='') RETURNING id`;
      images += result.length;
    }
    await tx`INSERT INTO verified_seed_batches(batch_key) VALUES(${seed.batchId})`;
    console.log('Extended verified shows added:',added,'Existing posters updated:',images);
  });
} finally {
  await sql.end();
}
