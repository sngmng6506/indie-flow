import type { APIRoute } from 'astro';
import { getCounts, isDate, seoulDate } from '../../lib/events';
import { fail,json } from '../../lib/http';
export const GET: APIRoute = async ({url}) => {
  const from=url.searchParams.get('from')||seoulDate(), days=Number(url.searchParams.get('days')||'7');
  if(!isDate(from)) return fail('INVALID_DATE','올바른 날짜를 입력하세요.');
  if(!Number.isInteger(days)||days<1||days>31) return fail('INVALID_RANGE','1~31일을 선택하세요.');
  const found=await getCounts(from,days);
  const byDate=new Map(found.map(x=>[x.date,x.count]));
  return json({days:Array.from({length:days},(_,i)=>{const d=new Date(from+'T00:00:00Z');d.setUTCDate(d.getUTCDate()+i);const date=d.toISOString().slice(0,10);return {date,count:byDate.get(date)||0};})});
};
