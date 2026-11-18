import type { APIRoute } from 'astro';
import { sameOrigin, sameSecret, signIn } from '../../../lib/auth';
import { formText } from '../../../lib/http';
import { clearRateLimit, rateLimit } from '../../../lib/rate-limit';
export const POST: APIRoute = async ctx => {
  if (!sameOrigin(ctx.request)) return new Response('Forbidden',{status:403});
  if (Number(ctx.request.headers.get('content-length')||0)>4096) return new Response('Payload too large',{status:413});
  if (!await rateLimit(ctx,'admin-login',10,900)) return new Response('Too many login attempts',{status:429,headers:{'Retry-After':'900'}});
  let data: FormData;
  try { data=await ctx.request.formData(); } catch { return new Response('Invalid form',{status:400}); }
  const pass=formText(data,'password');
  if (pass.length>256) return new Response('Invalid password',{status:400});
  if (!sameSecret(pass)) return ctx.redirect('/admin/login?error=1',303);
  await clearRateLimit(ctx,'admin-login');
  signIn(ctx.cookies);
  return ctx.redirect('/admin',303);
};
