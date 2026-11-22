import {test} from 'node:test';
import assert from 'node:assert/strict';
import {filterByWalk,parseWalkFilter,resolveOrigin,hongdae,isDate,publicEvent,walkMinutes,eventPriceLabel} from '../src/lib/events';

test('distance filtering excludes unknown distances except for all',()=>{
  const items=[{walkMinutes:5},{walkMinutes:16},{walkMinutes:null}];
  assert.deepEqual(filterByWalk(items,'15'),[items[0]]);
  assert.deepEqual(filterByWalk(items,'all'),items);
});
test('walking filter only accepts supported values',()=>{
  assert.equal(parseWalkFilter('20'),'20');
  assert.equal(parseWalkFilter('invalid'),'15');
  assert.equal(parseWalkFilter(null),'15');
});
test('location validation rejects missing, malformed and remote coordinates',()=>{
  for(const [lat,lng] of [[null,null],['',''],['NaN','127'],['91','127'],['37.5','0']]){
    const result=resolveOrigin(lat,lng);
    assert.equal(result.near,false);
    assert.deepEqual(result.origin,hongdae);
  }
  assert.equal(resolveOrigin(String(hongdae.lat),String(hongdae.lng)).near,true);
});

test('date parsing rejects invalid calendar dates',()=>{
  assert.equal(isDate('2026-11-21'),true);
  assert.equal(isDate('2026-02-30'),false);
  assert.equal(isDate('2026-13-01'),false);
  assert.equal(isDate('2026-11-21T10:00'),false);
});
test('public event hides unapproved posters and handles missing venue coordinates',()=>{
  const event={id:1,venue_id:2,title:'Test show',starts_at:'2026-11-21T10:00:00Z',venue_name:'Test venue',lat:null,lng:null,poster_url:'https://example.com/poster.jpg',poster_approved:false,summary:'',door_price:10000};
  const result=publicEvent(event);
  assert.equal(result.walkMinutes,null);
  assert.equal(result.poster,null);
  assert.equal(filterByWalk([result],'15').length,0);
  assert.equal(filterByWalk([result],'all').length,1);
});
test('distance calculation is stable for same location and nearby venue',()=>{
  assert.equal(walkMinutes(hongdae,hongdae),0);
  assert.equal(resolveOrigin(String(hongdae.lat),String(hongdae.lng)).near,true);
});

test('list price prioritizes verified advance prices, including free registration',()=>{
  assert.equal(eventPriceLabel({advancePrice:55000,doorPrice:null}),'예매 55,000원');
  assert.equal(eventPriceLabel({advancePrice:0,doorPrice:null}),'무료 · 사전 신청');
  assert.equal(eventPriceLabel({advancePrice:null,doorPrice:10000}),'현장 10,000원');
  assert.equal(eventPriceLabel({advancePrice:null,doorPrice:null}),'가격 미공지');
});
