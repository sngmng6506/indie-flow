import {test} from 'node:test';
import assert from 'node:assert/strict';
import {extractEvents,dedupe,seoulLocal,jsonLdBlocks} from '../scripts/collect-events-lib';
const source={name:'언플러그드 홍대',venue:'언플러그드 홍대',url:'https://www.unplugged-hongdae.com/concert'};
test('extracts explicitly zoned event with venue and safe URL',()=>{
  const html='<script type="application/ld+json">'+JSON.stringify({'@context':'https://schema.org','@type':'MusicEvent',name:'Sample show',startDate:'2026-11-25T19:00:00+09:00',location:{name:'언플러그드 홍대'},url:'https://example.com/show',offers:{price:'25,000',url:'https://example.com/ticket'}})+'</script>';
  const events=extractEvents(html,source);
  assert.equal(events.length,1);
  assert.equal(events[0].startsAt,'2026-11-25T19:00');
  assert.equal(events[0].doorPrice,25000);
  assert.equal(events[0].ticketUrl,'https://example.com/ticket');
  assert.equal(dedupe([...events,...events]).length,1);
});
test('rejects timezone-free, unrelated venue and malformed data',()=>{
  const html='<script type="application/ld+json">'+JSON.stringify({'@graph':[
    {'@type':'MusicEvent',name:'Unknown time',startDate:'2026-11-25T19:00',location:{name:'언플러그드 홍대'}},
    {'@type':'MusicEvent',name:'Different venue',startDate:'2026-11-25T19:00:00+09:00',location:{name:'서울 올림픽공원'}}
  ]})+'</script>';
  assert.equal(extractEvents(html,source).length,0);
  assert.equal(seoulLocal('2026-11-25T19:00'),null);
  assert.equal(jsonLdBlocks('<script type="application/ld+json">{invalid}</script>').length,0);
});

test('JSON-LD script parsing accepts mixed quotes, whitespace and line breaks',()=>{
  const block = {'@context':'https://schema.org','@type':'MusicEvent',name:'Autumn Show',startDate:'2026-11-25T10:00:00Z',location:{name:'언플러그드 홍대'}};
  const html = '<script data-test="1" TYPE = \x27application/ld+json\x27>\n'+JSON.stringify(block)+'\n</script  >';
  const events = extractEvents(html,source);
  assert.equal(events.length,1);
  assert.equal(events[0].startsAt,'2026-11-25T19:00');
  assert.equal(jsonLdBlocks('<script type="text/javascript">{"name":"untrusted"}</script>').length,0);
});
test('timezone offset conversion and whitespace-insensitive deduplication',()=>{
  assert.equal(seoulLocal('2026-12-01T00:30:00+00:00'),'2026-12-01T09:30');
  assert.equal(seoulLocal('2026-12-01T00:30:00'),null);
  const base = {title:'2026 Indie Show',venue:'롤링홀',startsAt:'2026-12-01T20:00',sourceUrl:'https://example.com',sourceName:'src',lineup:'',summary:'',doorPrice:null,advancePrice:null,ticketUrl:'',previewUrl:'',posterUrl:''};
  assert.equal(dedupe([base,{...base,title:'2026  Indie    Show'}]).length,1);
});
