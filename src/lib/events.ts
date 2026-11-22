import { db } from './db';
export async function getVenues() {
  return db()`SELECT id, name, address, lat, lng, instagram FROM venues ORDER BY name`;
}
export async function getEvent(id: number, admin = false) {
  const rows = await db()`SELECT e.*, v.name AS venue_name, v.address AS venue_address, v.lat, v.lng
    FROM events e JOIN venues v ON v.id=e.venue_id
    WHERE e.id=${id} AND (${admin} OR e.status='published') LIMIT 1`;
  return rows[0] ?? null;
}
export async function getEvents(date: string, admin = false) {
  return db()`SELECT e.*, v.name AS venue_name, v.address AS venue_address, v.lat, v.lng
    FROM events e JOIN venues v ON v.id=e.venue_id
    WHERE (${admin} OR e.status='published')
    AND (${admin} OR (e.starts_at >= now() AND (e.starts_at AT TIME ZONE 'Asia/Seoul')::date = ${date}::date))
    ORDER BY e.starts_at ASC LIMIT 500`;
}
export async function getCounts(from: string, days = 14) {
  return db()`SELECT (starts_at AT TIME ZONE 'Asia/Seoul')::date::text AS date, count(*)::int AS count
    FROM events WHERE status='published' AND starts_at >= now()
    AND (starts_at AT TIME ZONE 'Asia/Seoul')::date >= ${from}::date
    AND (starts_at AT TIME ZONE 'Asia/Seoul')::date < (${from}::date + ${days}::int)
    GROUP BY 1 ORDER BY 1`;
}
export function seoulDate(date = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).format(date);
}
export function offsetDate(date: string, days: number) {
  const parsed = new Date(date + 'T00:00:00Z');
  parsed.setUTCDate(parsed.getUTCDate() + days);
  return parsed.toISOString().slice(0, 10);
}
export function isDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(new Date(value + 'T00:00:00Z').valueOf())
    && new Date(value + 'T00:00:00Z').toISOString().slice(0,10) === value;
}
export function walkMinutes(a: {lat:number,lng:number}, b: {lat:number,lng:number}) {
  const rad = Math.PI/180;
  const y = (b.lat-a.lat)*111195;
  const x = (b.lng-a.lng)*111195*Math.cos((a.lat+b.lat)/2*rad);
  return Math.ceil(Math.hypot(x,y)/75);
}
export const hongdae = {lat:37.5572,lng:126.9245,name:'홍대입구역'};
export function publicEvent(e: any, origin = hongdae) {
  const hasLocation = e.lat !== null && e.lng !== null;
  return {
    id: String(e.id), title:e.title, startsAt:e.starts_at, venue:{id:String(e.venue_id),name:e.venue_name},
    walkMinutes:hasLocation?walkMinutes(origin,{lat:Number(e.lat),lng:Number(e.lng)}):null,
    summary:e.summary, doorPrice:e.door_price??null, advancePrice:e.advance_price??null,
    poster:e.poster_approved && e.poster_url?{url:e.poster_url,alt:`${e.title} · ${e.venue_name} 포스터`}:null
  };
}

export function eventPriceLabel(event: {advancePrice: number | null;doorPrice: number | null}, en = false) {
  if (event.advancePrice !== null) {
    const value = Number(event.advancePrice);
    if (value === 0) return en ? 'Free · registration required' : '무료 · 사전 신청';
    return en ? `Advance ${value.toLocaleString('ko-KR')} KRW` : `예매 ${value.toLocaleString('ko-KR')}원`;
  }
  if (event.doorPrice !== null) {
    const value = Number(event.doorPrice);
    if (value === 0) return en ? 'Free entry' : '무료 입장';
    return en ? `Door ${value.toLocaleString('ko-KR')} KRW` : `현장 ${value.toLocaleString('ko-KR')}원`;
  }
  return en ? 'Price not listed' : '가격 미공지';
}

export type WalkFilter = '10' | '15' | '20' | '30' | 'all';
export function parseWalkFilter(value: string | null): WalkFilter {
  return value === '10' || value === '15' || value === '20' || value === '30' || value === 'all' ? value : '15';
}
export function filterByWalk<T extends {walkMinutes: number | null}>(events: T[], walk: WalkFilter): T[] {
  return walk === 'all' ? events : events.filter(event => event.walkMinutes === null || event.walkMinutes <= Number(walk));
}
export function resolveOrigin(latValue: string | null, lngValue: string | null) {
  if (latValue === null || lngValue === null || latValue.trim() === '' || lngValue.trim() === '') return {origin:hongdae,near:false};
  const lat=Number(latValue),lng=Number(lngValue);
  const valid=Number.isFinite(lat)&&Number.isFinite(lng)&&lat>=-90&&lat<=90&&lng>=-180&&lng<=180;
  const near=valid&&walkMinutes(hongdae,{lat,lng})<=30;
  return {origin:near?{lat,lng,name:'내 위치'}:hongdae,near};
}
