import type { APIRoute } from 'astro';
import { db } from '../../../lib/db';
import { checkAdminWrite,formText } from '../../../lib/http';
import { eventInput,fromSeoulLocal,optionalNumber } from '../../../lib/validation';
export const POST: APIRoute = async ctx => {
  const error=checkAdminWrite(ctx);if(error)return error;
  if(Number(ctx.request.headers.get('content-length')||0)>16384)return new Response('Payload too large',{status:413});
  const f=await ctx.request.formData();
  const obj=Object.fromEntries(['venueId','title','startsAt','doorsOpenAt','doorPrice','advancePrice','ticketUrl','sourceUrl','sourceName','summary','lineup','previewUrl','posterUrl','status'].map(k=>[k,formText(f,k)]));
  const parsed=eventInput.safeParse({...obj,posterApproved:f.get('posterApproved')==='on'});
  if(!parsed.success)return new Response(JSON.stringify({error:'INVALID_INPUT',details:parsed.error.issues}),{status:400,headers:{'content-type':'application/json'}});
  const v=parsed.data;
  const idRaw=formText(f,'id');
  const id=idRaw?Number(idRaw):null;
  if(id!==null&&(!Number.isSafeInteger(id)||id<=0))return new Response('Invalid id',{status:400});
  const starts=fromSeoulLocal(v.startsAt),doors=fromSeoulLocal(v.doorsOpenAt);
  try {
    if(id){
      const rows=await db()`UPDATE events SET venue_id=${v.venueId},title=${v.title},starts_at=${starts},doors_open_at=${doors},door_price=${optionalNumber(v.doorPrice)},advance_price=${optionalNumber(v.advancePrice)},ticket_url=${v.ticketUrl},source_url=${v.sourceUrl},source_name=${v.sourceName},summary=${v.summary},lineup=${v.lineup},preview_url=${v.previewUrl},poster_url=${v.posterUrl},poster_approved=${v.posterApproved},status=${v.status},checked_at=CASE WHEN ${v.status}='published' THEN now() ELSE checked_at END,updated_at=now() WHERE id=${id} RETURNING id`;
      if(!rows.length)return new Response('Not found',{status:404});
    } else {
      await db()`INSERT INTO events(venue_id,title,starts_at,doors_open_at,door_price,advance_price,ticket_url,source_url,source_name,summary,lineup,preview_url,poster_url,poster_approved,status,checked_at)
      VALUES(${v.venueId},${v.title},${starts},${doors},${optionalNumber(v.doorPrice)},${optionalNumber(v.advancePrice)},${v.ticketUrl},${v.sourceUrl},${v.sourceName},${v.summary},${v.lineup},${v.previewUrl},${v.posterUrl},${v.posterApproved},${v.status},CASE WHEN ${v.status}='published' THEN now() ELSE NULL END)`;
    }
  } catch(e) {
    if(e && typeof e==='object' && 'code' in e && (e.code==='23505'||e.code==='23503'))return new Response('Duplicate event or unknown venue',{status:409});
    throw e;
  }
  return ctx.redirect('/admin?message=saved',303);
};
