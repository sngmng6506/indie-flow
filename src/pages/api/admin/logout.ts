import type { APIRoute } from 'astro';
import { sameOrigin,signOut } from '../../../lib/auth';
export const POST: APIRoute = ({request,cookies,redirect}) => {
  if(!sameOrigin(request)) return new Response('Forbidden',{status:403});
  signOut(cookies);return redirect('/admin/login',303);
};
