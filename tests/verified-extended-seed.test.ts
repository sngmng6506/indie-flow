import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const original = JSON.parse(readFileSync(new URL('../data/verified-shows-2026-nov-dec.json',import.meta.url),'utf8'));
const extra = JSON.parse(readFileSync(new URL('../data/verified-shows-2026-nov-dec-extra.json',import.meta.url),'utf8'));
const imagePrefix = 'https://hasniugmmldebxwzulig.supabase.co/storage/v1/object/public/event-images/';
const key = (e:{venue:string,title:string,startsAt:string}) => [e.venue,e.title,e.startsAt].join('|');

test('added Hongdae shows are unique, source-linked and in Nov/Dec 2026',()=>{
  assert.equal(extra.events.length,22);
  assert.equal(extra.posterUpdates.length,17);
  const venues = new Set(extra.venues.map((v:{name:string})=>v.name));
  const initial = new Set(original.events.map(key));
  const added = new Set<string>();
  const mapped = new Set<string>();
  for(const e of [...extra.events,...extra.posterUpdates]){
    assert.ok(venues.has(e.venue));
    assert.match(e.startsAt,/^2026-(11|12)-\d{2}T(?:[01]\d|2[0-3]):[0-5]\d$/);
    const dt = new Date(e.startsAt+':00+09:00');
    assert.ok(Number.isFinite(dt.valueOf()));
    const localDate = new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).format(dt);
    assert.equal(localDate,e.startsAt.slice(0,10));
    assert.ok(e.posterUrl.startsWith(imagePrefix));
    assert.equal(new URL(e.posterUrl).protocol,'https:');
    assert.ok(!mapped.has(key(e)));
    mapped.add(key(e));
  }
  for(const e of extra.events){
    assert.ok(!initial.has(key(e)));
    assert.ok(!added.has(key(e)));
    added.add(key(e));
    assert.ok(e.sourceUrl.startsWith('https://www.indiego.co.kr/events/'));
    assert.ok(e.lineup.length <= 1000);
    for(const value of [e.advancePrice,e.doorPrice])assert.ok(value===null||(Number.isSafeInteger(value)&&value>=0));
  }
  for(const e of extra.posterUpdates)assert.ok(initial.has(key(e)));
  assert.equal(extra.events.filter((e:{startsAt:string})=>e.startsAt.startsWith('2026-11')).length,7);
  assert.equal(extra.events.filter((e:{startsAt:string})=>e.startsAt.startsWith('2026-12')).length,15);
});
