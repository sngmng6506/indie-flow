import postgres from 'postgres';
import { readFile } from 'node:fs/promises';

const url = process.env.DATABASE_URL;
if (!url) throw new Error('DATABASE_URL is required');
const seed = JSON.parse(await readFile(new URL('../data/verified-shows-2026-nov-dec.json', import.meta.url), 'utf8'));
if (!Array.isArray(seed.venues) || !Array.isArray(seed.events)) throw new Error('Invalid seed format');
const names = new Set(seed.venues.map(v => v.name));
const keys = new Set();
for (const event of seed.events) {
  if (!names.has(event.venue)) throw new Error('Unknown venue: ' + event.venue);
  if (!/^2026-(11|12)-\d{2}T(?:[01]\d|2[0-3]):[0-5]\d$/.test(event.startsAt)) throw new Error('Invalid time: ' + event.startsAt);
  const date = new Date(event.startsAt + ':00+09:00');
  if (Number.isNaN(date.valueOf()) || new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit'
  }).format(date) !== event.startsAt.slice(0, 10)) throw new Error('Invalid Seoul date: ' + event.startsAt);
  if (typeof event.title !== 'string' || event.title.length > 180 || typeof event.lineup !== 'string' || event.lineup.length > 1000) throw new Error('Invalid text field');
  const key = [event.venue, event.startsAt, event.title].join('|');
  if (keys.has(key)) throw new Error('Duplicate event: ' + key);
  keys.add(key);
  for (const raw of [event.sourceUrl, event.ticketUrl].filter(Boolean)) {
    if (new URL(raw).protocol !== 'https:') throw new Error('HTTPS source URL required');
  }
  for (const price of [event.advancePrice, event.doorPrice]) {
    if (price !== null && (!Number.isSafeInteger(price) || price < 0)) throw new Error('Invalid price');
  }
}

const sql = postgres(url, { max: 1, idle_timeout: 20, connect_timeout: 10 });
try {
  await sql.begin(async tx => {
    await tx`CREATE TABLE IF NOT EXISTS verified_seed_batches (
      batch_key text PRIMARY KEY,
      applied_at timestamptz NOT NULL DEFAULT now()
    )`;
    // Only seed once: admin edits, hides and deletions must survive restarts.
    await tx`SELECT pg_advisory_xact_lock(hashtext(${seed.batchId}))`;
    const applied = await tx`SELECT batch_key FROM verified_seed_batches WHERE batch_key = ${seed.batchId}`;
    if (applied.length) {
      console.log('Verified events already seeded:', seed.batchId);
      return;
    }
    const venueIds = new Map();
    for (const venue of seed.venues) {
      const existing = await tx`SELECT id FROM venues WHERE name = ${venue.name} ORDER BY id LIMIT 1`;
      const id = existing.length ? existing[0].id :
        (await tx`INSERT INTO venues(name,address,lat,lng)
          VALUES(${venue.name},${venue.address},${venue.lat},${venue.lng}) RETURNING id`)[0].id;
      // Preserve admin-supplied coordinates, but fill previously missing ones.
      await tx`UPDATE venues SET lat = COALESCE(lat, ${venue.lat}), lng = COALESCE(lng, ${venue.lng}) WHERE id = ${id}`;
      venueIds.set(venue.name, id);
    }
    let inserted = 0;
    for (const event of seed.events) {
      const result = await tx`INSERT INTO events (
        venue_id, title, starts_at, door_price, advance_price, ticket_url,
        source_url, source_name, summary, lineup, poster_url, poster_approved, status, checked_at
      ) VALUES (
        ${venueIds.get(event.venue)}, ${event.title},
        ${new Date(event.startsAt + ':00+09:00').toISOString()},
        ${event.doorPrice}, ${event.advancePrice}, ${event.ticketUrl || null},
        ${event.sourceUrl}, ${event.sourceName}, '', ${event.lineup},
        NULL, false, 'published', now()
      ) ON CONFLICT (venue_id, starts_at, title) DO NOTHING RETURNING id`;
      inserted += result.length;
    }
    await tx`INSERT INTO verified_seed_batches(batch_key) VALUES (${seed.batchId})`;
    console.log('Verified events inserted:', inserted, '/', seed.events.length);
  });
} finally {
  await sql.end();
}
