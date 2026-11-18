import type { APIRoute } from 'astro';
import { randomBytes } from 'node:crypto';
import { db } from '../../lib/db';
import { sameOrigin } from '../../lib/auth';
import { eventLogInput } from '../../lib/validation';
import { fail } from '../../lib/http';
import { rateLimit } from '../../lib/rate-limit';
export const POST: APIRoute = async ctx => {
  if(!sameOrigin(ctx.request))return fail('INVALID_ORIGIN','잘못된 요청입니다.',403);
  if(Number(ctx.request.headers.get('content-length')||0)>2048)return fail('PAYLOAD_TOO_LARGE','요청 크기를 초과했습니다.',413);
  if(!await rateLimit(ctx,'activity-log',120,3600))return fail('RATE_LIMITED','요청이 너무 많습니다.',429);
  let data;try{data=eventLogInput.parse(await ctx.request.json());}catch{return fail('INVALID_TYPE','올바른 이벤트가 아닙니다.');}
  let session=ctx.cookies.get('indie_session')?.value;
  if(!session||!/^[a-f0-9]{32}$/.test(session)){
    session=randomBytes(16).toString('hex');
    ctx.cookies.set('indie_session',session,{httpOnly:true,sameSite:'lax',secure:import.meta.env.PROD,path:'/',maxAge:60*60*24*30});
  }
  await db()`INSERT INTO activity_logs(session_id,type,event_id,cafe,placement,value)
    VALUES(${session},${data.type},${data.eventId??null},${data.cafe??null},${data.placement??null},${data.value??null})`;
  return new Response(null,{status:204});
};
