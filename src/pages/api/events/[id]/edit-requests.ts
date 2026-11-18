import type { APIRoute } from 'astro';
import { db } from '../../../../lib/db';
import { editRequestInput } from '../../../../lib/validation';
import { fail,json,idFromParam } from '../../../../lib/http';
import { sameOrigin } from '../../../../lib/auth';
export const POST: APIRoute = async ({params,request}) => {
  if(!sameOrigin(request)) return fail('INVALID_ORIGIN','잘못된 요청입니다.',403);
  const id=idFromParam(params.id); if(!id) return fail('EVENT_NOT_FOUND','공연이 없습니다.',404);
  let data;try {data=editRequestInput.parse(await request.json());}catch{return fail('INVALID_INPUT','올바른 수정 내용을 입력하세요.');}
  const rows=await db()`INSERT INTO edit_requests(event_id,field,note)
    SELECT id,${data.field},${data.note} FROM events WHERE id=${id} AND status='published'
    RETURNING id`;
  if(!rows.length) return fail('EVENT_NOT_FOUND','공연이 없습니다.',404);
  return json({id:String(rows[0].id)},201);
};
