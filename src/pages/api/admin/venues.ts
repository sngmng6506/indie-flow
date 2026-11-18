import type { APIRoute } from 'astro';
import { db } from '../../../lib/db';
import { checkAdminWrite,formText } from '../../../lib/http';
import { venueInput,optionalNumber } from '../../../lib/validation';
export const POST: APIRoute = async ctx => {
  const error=checkAdminWrite(ctx);if(error)return error;
  const f=await ctx.request.formData();
  const parsed=venueInput.safeParse(Object.fromEntries(['name','address','lat','lng','instagram'].map(k=>[k,formText(f,k)])));
  if(!parsed.success)return new Response('Invalid venue data',{status:400});
  const v=parsed.data;
  await db()`INSERT INTO venues(name,address,lat,lng,instagram) VALUES(${v.name},${v.address},${optionalNumber(v.lat)},${optionalNumber(v.lng)},${v.instagram})`;
  return ctx.redirect('/admin?message=venue',303);
};
