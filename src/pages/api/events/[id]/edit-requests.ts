import type { APIRoute } from 'astro';
import { db } from '../../../../lib/db';
import { editRequestInput } from '../../../../lib/validation';
import { fail,json,idFromParam } from '../../../../lib/http';
import { sameOrigin } from '../../../../lib/auth';
import { rateLimit } from '../../../../lib/rate-limit';
export const POST: APIRoute = async ctx => {
  if(!sameOrigin(ctx.request)) return fail('INVALID_ORIGIN','잘못된 요청입니다.',403);
  if(Number(ctx.request.headers.get('content-length')||0)>2048) return fail('PAYLOAD_TOO_LARGE','요청 크기를 초과했습니다.',413);
  const id=idFromParam(ctx.params.id);if(!id)return fail('EVENT_NOT_FOUND','공연이 없습니다.',404);
  if(!await rateLimit(ctx,'edit-request',10,3600))return fail('RATE_LIMITED','요청이 많습니다. 잠시 후 다시 시도하세요.',429);
  let data;try{data=editRequestInput.parse(await ctx.request.json());}catch{return fail('INVALID_INPUT','올바른 수정 내용을 입력하세요.');}
  const rows=await db()`INSERT INTO edit_requests(event_id,field,note)
    SELECT id,${data.field},${data.note} FROM events WHERE id=${id} AND status='published' RETURNING id`;
  if(!rows.length)return fail('EVENT_NOT_FOUND','공연이 없습니다.',404);
  return json({id:String(rows[0].id)},201);
};
