import type { APIRoute } from 'astro';
import { sameOrigin, sameSecret, signIn } from '../../../lib/auth';
import { formText } from '../../../lib/http';
export const POST: APIRoute = async ({request,cookies,redirect}) => {
  if(!sameOrigin(request)) return new Response('Forbidden',{status:403});
  const data=await request.formData();
  const pass=formText(data,'password');
  if(!sameSecret(pass)) return redirect('/admin/login?error=1',303);
  signIn(cookies);return redirect('/admin',303);
};
