import type { APIContext } from 'astro';
import { isAdmin, sameOrigin } from './auth';
export const fail = (code:string, message:string, status=400) =>
  new Response(JSON.stringify({error:{code,message}}),{status,headers:{'content-type':'application/json; charset=utf-8'}});
export const json = (value:unknown, status=200) =>
  new Response(JSON.stringify(value),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}});
export function checkAdminWrite(ctx: APIContext) {
  if (!isAdmin(ctx.cookies)) return fail('UNAUTHORIZED','관리자 로그인이 필요합니다.',401);
  if (!sameOrigin(ctx.request)) return fail('INVALID_ORIGIN','잘못된 요청 출처입니다.',403);
  return null;
}
export function formText(data: FormData,key:string) { return String(data.get(key)??''); }
export function idFromParam(value:string|undefined) { const n=Number(value); return Number.isSafeInteger(n)&&n>0?n:null; }
