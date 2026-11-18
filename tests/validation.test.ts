import { test } from 'node:test';
import assert from 'node:assert/strict';
import {eventInput,fromSeoulLocal,safeReturnPath} from '../src/lib/validation';
import {isDate,walkMinutes,hongdae} from '../src/lib/events';
test('date validation rejects invalid calendar day',()=>{assert.equal(isDate('2026-02-30'),false);assert.equal(isDate('2026-11-19'),true);});
test('walking time at same coordinates is zero',()=>{assert.equal(walkMinutes(hongdae,hongdae),0);});
test('untrusted redirect path is rejected',()=>{assert.equal(safeReturnPath('//evil.com'),'/admin');});
test('Seoul local time converts to UTC',()=>{assert.equal(fromSeoulLocal('2026-11-19T20:00'),'2026-11-19T11:00:00.000Z');});
test('event schema disallows javascript URLs',()=>{
  const sample={venueId:'1',title:'Test show',startsAt:'2026-11-19T20:00',ticketUrl:'javascript:alert(1)',sourceUrl:'https://example.com/post',previewUrl:'',posterUrl:'',status:'draft'};
  assert.equal(eventInput.safeParse(sample).success,false);
  assert.equal(eventInput.safeParse({...sample,ticketUrl:''}).success,true);
});
