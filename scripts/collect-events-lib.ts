// Conservative, dependency-free JSON-LD event extractor.
// Only exact dated events with a verified venue mapping are importable.
export const SOURCES = [
  {id:'unplugged',name:'언플러그드 홍대',url:'https://www.unplugged-hongdae.com/concert',venue:'언플러그드 홍대'},
  {id:'rollinghall',name:'롤링홀',url:'https://www.rollinghall.co.kr/default/index.php',venue:'롤링홀'},
] as const;
export type Candidate={title:string;startsAt:string;sourceUrl:string;sourceName:string;venue:string;lineup:string;summary:string;doorPrice:number|null;advancePrice:number|null;ticketUrl:string;previewUrl:string;posterUrl:string};
const text=(v:unknown)=>typeof v==='string'?v.trim():'';
const safeUrl=(v:unknown)=>{try{const u=new URL(text(v));return u.protocol==='https:'?u.toString():'';}catch{return '';}};
export function jsonLdBlocks(html:string):unknown[]{
  const out:unknown[]=[];
  const re=/<script\\b([^>]*)>([\\s\\S]*?)<\\/script\\s*>/gi;
  for(const match of html.matchAll(re)){
    if(!/\\btype\\s*=\\s*["']application\\/ld\\+json["']/i.test(match[1]))continue;
    try{out.push(JSON.parse(match[2]));}catch{}
  }
  return out;
}
function nodes(value:unknown):Record<string,unknown>[]{
  if(Array.isArray(value))return value.flatMap(nodes);
  if(!value||typeof value!=='object')return [];
  const v=value as Record<string,unknown>;
  return [v,...nodes(v['@graph'])];
}
function name(value:unknown):string{
  if(typeof value==='string')return value.trim();
  if(Array.isArray(value))return value.map(name).filter(Boolean).join(', ');
  if(value&&typeof value==='object')return text((value as Record<string,unknown>).name);
  return '';
}
function price(value:unknown):number|null{
  const v=typeof value==='number'?value:typeof value==='string'?Number(value.replace(/,/g,'')):NaN;
  return Number.isSafeInteger(v)&&v>=0?v:null;
}
export function seoulLocal(value:unknown):string|null{
  const raw=text(value);
  // Accept explicit timezone offsets or UTC only. Ambiguous local times require review.
  if(!/^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}(?::\\d{2}(?:\\.\\d+)?)?(?:Z|[+-]\\d{2}:\\d{2})$/.test(raw))return null;
  const date=new Date(raw);
  if(Number.isNaN(date.valueOf()))return null;
  const parts=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(date);
  const field=(key:string)=>parts.find(p=>p.type===key)?.value||'';
  return `${field('year')}-${field('month')}-${field('day')}T${field('hour')}:${field('minute')}`;
}
export function extractEvents(html:string,source:{name:string;url:string;venue:string}):Candidate[]{
  const result:Candidate[]=[];
  for(const block of jsonLdBlocks(html))for(const item of nodes(block)){
    const types=Array.isArray(item['@type'])?item['@type']:[item['@type']];
    if(!types.some(t=>typeof t==='string'&&/^(MusicEvent|Event)$/.test(t)))continue;
    const title=text(item.name),startsAt=seoulLocal(item.startDate);
    if(title.length<2||title.length>180||!startsAt)continue;
    const location=name(item.location);
    // Reject events explicitly assigned to another venue.
    if(location&&!location.includes(source.venue)&&!source.venue.includes(location))continue;
    const sourceUrl=safeUrl(item.url)||source.url;
    const offers=Array.isArray(item.offers)?item.offers[0]:item.offers;
    const offer=offers&&typeof offers==='object'?offers as Record<string,unknown>:{};
    const ticketUrl=safeUrl(offer.url);
    const doorPrice=price(offer.price);
    result.push({
      title,startsAt,sourceUrl,sourceName:source.name,venue:source.venue,
      lineup:name(item.performer).slice(0,1000),summary:text(item.description).replace(/<[^>]*>/g,' ').slice(0,500),
      doorPrice,advancePrice:null,ticketUrl,previewUrl:'',posterUrl:''
    });
  }
  return result;
}
export function dedupe(events:Candidate[]):Candidate[]{
  const seen=new Set<string>();
  return events.filter(e=>{
    const key=[e.venue,e.startsAt,e.title.normalize('NFKC').replace(/\\s+/g,'').toLowerCase()].join('|');
    if(seen.has(key))return false;
    seen.add(key);return true;
  });
}
