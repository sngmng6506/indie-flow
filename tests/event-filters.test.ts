import {test} from 'node:test';
import assert from 'node:assert/strict';
import {filterByWalk,parseWalkFilter,resolveOrigin,hongdae} from '../src/lib/events';

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
