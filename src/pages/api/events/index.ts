import type { APIRoute } from 'astro';
import { getEvents, hongdae, isDate, publicEvent, seoulDate, walkMinutes } from '../../../lib/events';
import { db } from '../../../lib/db';
import { fail, json } from '../../../lib/http';
export const GET: APIRoute = async ({url}) => {
  const date = url.searchParams.get('date') || seoulDate();
  if (!isDate(date)) return fail('INVALID_DATE','올바른 날짜를 입력하세요.');
  const walk = url.searchParams.get('walk') || '15';
  if (!['10','15','20','30','all'].includes(walk)) return fail('INVALID_WALK','올바른 걷는 시간을 선택하세요.');
  const cafe = url.searchParams.get('cafe');
  if (cafe) return fail('CAFE_NOT_FOUND','카페 QR은 아직 제공되지 않습니다.',404);
  const lat = Number(url.searchParams.get('lat')), lng = Number(url.searchParams.get('lng'));
  const hasCoords = url.searchParams.has('lat') && url.searchParams.has('lng') && Number.isFinite(lat) && Number.isFinite(lng) && lat>=-90 && lat<=90 && lng>=-180 && lng<=180;
  const near = hasCoords && walkMinutes(hongdae,{lat,lng})<=30;
  const origin = near?{lat,lng,name:'내 위치'}:hongdae;
  const events = (await getEvents(date)).map(e=>publicEvent(e,origin));
  const visible = events.filter(e=>walk==='all' || e.walkMinutes===null || e.walkMinutes<=Number(walk));
  return json({origin:{type:near?'user':'station',name:origin.name},fartherCount:events.length-visible.length,events:visible});
};
