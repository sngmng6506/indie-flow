import type { APIRoute } from 'astro';
import { getEvents, filterByWalk, isDate, parseWalkFilter, publicEvent, resolveOrigin, seoulDate } from '../../../lib/events';
import { db } from '../../../lib/db';
import { fail, json } from '../../../lib/http';
export const GET: APIRoute = async ({url}) => {
  const date = url.searchParams.get('date') || seoulDate();
  if (!isDate(date)) return fail('INVALID_DATE','올바른 날짜를 입력하세요.');
  const requestedWalk=url.searchParams.get('walk');
  if(requestedWalk && !['10','15','20','30','all'].includes(requestedWalk)) return fail('INVALID_WALK','올바른 걷는 시간을 선택하세요.');
  const walk=parseWalkFilter(requestedWalk);
  const cafe = url.searchParams.get('cafe');
  if (cafe) return fail('CAFE_NOT_FOUND','카페 QR은 아직 제공되지 않습니다.',404);
  const {origin,near}=resolveOrigin(url.searchParams.get('lat'),url.searchParams.get('lng'));
  const events=(await getEvents(date)).map(e=>publicEvent(e,origin));
  const visible=filterByWalk(events,walk);
  return json({origin:{type:near?'user':'station',name:origin.name},fartherCount:events.length-visible.length,events:visible});
};
