import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const seed = JSON.parse(readFileSync(new URL('../data/verified-shows-2026-nov-dec.json', import.meta.url), 'utf8'));

test('real concerts seed is source-linked and limited to November–December 2026', () => {
  assert.equal(seed.verifiedOn, '2026-11-22');
  assert.equal(seed.events.length, 18);
  const venueNames = new Set(seed.venues.map((v: {name:string}) => v.name));
  const keys = new Set<string>();
  let nov = 0, dec = 0;
  for (const e of seed.events) {
    assert.ok(venueNames.has(e.venue));
    assert.match(e.startsAt, /^2026-(11|12)-\d{2}T(?:[01]\d|2[0-3]):[0-5]\d$/);
    const date = new Date(e.startsAt + ':00+09:00');
    assert.ok(Number.isFinite(date.valueOf()));
    const seoulDate = new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).format(date);
    assert.equal(seoulDate,e.startsAt.slice(0,10));
    assert.equal(new URL(e.sourceUrl).protocol,'https:');
    if(e.ticketUrl) assert.equal(new URL(e.ticketUrl).protocol,'https:');
    for (const p of [e.advancePrice,e.doorPrice]) assert.ok(p === null || (Number.isSafeInteger(p) && p >= 0));
    assert.ok(!('posterUrl' in e));
    const key=[e.venue,e.startsAt,e.title].join('|');
    assert.ok(!keys.has(key));
    keys.add(key);
    if(e.startsAt.startsWith('2026-11')) nov++; else dec++;
  }
  assert.equal(nov,8);
  assert.equal(dec,10);
});
