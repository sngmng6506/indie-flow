import type { APIRoute } from 'astro';
import {db} from '../../../lib/db';
import {checkAdminWrite,formText} from '../../../lib/http';
export const POST: APIRoute = async ctx => {
  const error=checkAdminWrite(ctx);if(error)return error;
  const id=Number(formText(await ctx.request.formData(),'id'));
  if(!Number.isSafeInteger(id)||id<=0)return new Response('Invalid id',{status:400});
  await db()`UPDATE edit_requests SET resolved=true WHERE id=${id}`;
  return ctx.redirect('/admin?message=resolved',303);
};
