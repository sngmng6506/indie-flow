import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import type { AstroCookies } from 'astro';

const cookieName = 'indie_admin';
const maxAge = 60 * 60 * 12;
function secret() {
  const value = process.env.SESSION_SECRET;
  if (!value || value.length < 32) throw new Error('SESSION_SECRET must contain at least 32 characters');
  return value;
}
function sign(value: string) {
  return createHmac('sha256', secret()).update(value).digest('hex');
}
export function sameSecret(input: string) {
  const value = process.env.ADMIN_PASSWORD;
  if (!value || value.length < 16) throw new Error('ADMIN_PASSWORD must contain at least 16 characters');
  const a = createHmac('sha256', secret()).update(input).digest();
  const b = createHmac('sha256', secret()).update(value).digest();
  return timingSafeEqual(a, b);
}
export function signIn(cookies: AstroCookies) {
  const value = String(Date.now() + maxAge * 1000) + '.' + randomBytes(12).toString('hex');
  cookies.set(cookieName, value + '.' + sign(value), {
    httpOnly: true, sameSite: 'strict', secure: (import.meta.env?.PROD ?? (process.env.NODE_ENV === 'production')), path: '/', maxAge
  });
}
export function signOut(cookies: AstroCookies) {
  cookies.delete(cookieName, { path: '/' });
}
export function isAdmin(cookies: AstroCookies) {
  const token = cookies.get(cookieName)?.value;
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  const value = parts[0] + '.' + parts[1];
  if (!/^\d+$/.test(parts[0]) || Number(parts[0]) < Date.now()) return false;
  const expected = sign(value);
  const actual = parts[2];
  return actual.length === expected.length && timingSafeEqual(Buffer.from(actual), Buffer.from(expected));
}
export function sameOrigin(request: Request) {
  const origin = request.headers.get('origin');
  if (!origin) return false;
  try {
    const expected = new URL(request.url);
    const received = new URL(origin);
    return expected.protocol === received.protocol && expected.host === received.host;
  } catch { return false; }
}
