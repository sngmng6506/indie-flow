import type { APIRoute } from 'astro';
import { z } from 'zod';
import { db } from '../../../lib/db';
import { checkAdminWrite, fail, json } from '../../../lib/http';
import { eventInput, fromSeoulLocal, optionalNumber } from '../../../lib/validation';
const incoming = z.array(eventInput.omit({status:true,posterApproved:true}).extend({
  ticketUrl: eventInput.shape.ticketUrl.optional().default(''),
  previewUrl: eventInput.shape.previewUrl.optional().default(''),
  posterUrl: eventInput.shape.posterUrl.optional().default(''),
  sourceName: z.string().max(120).default(''),
  summary: z.string().max(500).default(''),
  lineup: z.string().max(1000).default('')
})).min(1).max(100);
export const POST: APIRoute = async ctx => {
  const error=checkAdminWrite(ctx);if(error)return error;
  if(Number(ctx.request.headers.get('content-length')||0)>1_000_000)return fail('PAYLOAD_TOO_LARGE','최대 1MB까지 가져올 수 있습니다.',413);
  const raw=await ctx.request.text();
  if(raw.length>1_000_000)return fail('PAYLOAD_TOO_LARGE','최대 1MB까지 가져올 수 있습니다.',413);
  let parsed;
  try {parsed=incoming.parse(JSON.parse(raw));}
  catch {return fail('INVALID_IMPORT','공연 JSON 형식 또는 필수값이 잘못됐습니다.',400);}
  try {
    const inserted=await db().begin(async tx=>{
      let count=0;
      for(const v of parsed){
        const rows=await tx`INSERT INTO events(venue_id,title,starts_at,doors_open_at,door_price,advance_price,ticket_url,source_url,source_name,summary,lineup,preview_url,poster_url,poster_approved,status)
        VALUES(${v.venueId},${v.title},${fromSeoulLocal(v.startsAt)},${fromSeoulLocal(v.doorsOpenAt)},${optionalNumber(v.doorPrice)},${optionalNumber(v.advancePrice)},${v.ticketUrl},${v.sourceUrl},${v.sourceName},${v.summary},${v.lineup},${v.previewUrl},${v.posterUrl},false,'pending')
        ON CONFLICT(venue_id,starts_at,title) DO NOTHING RETURNING id`;
        count+=rows.length;
      }
      return count;
    });
    return json({inserted,skipped:parsed.length-inserted},201);
  } catch(e) {
    if(e&&typeof e==='object'&&'code' in e&&e.code==='23503')return fail('UNKNOWN_VENUE','공연장 ID를 먼저 등록하세요.',409);
    throw e;
  }
};
