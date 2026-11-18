import type { APIRoute } from 'astro';
import { db } from '../../lib/db';
import { json, fail } from '../../lib/http';
export const GET: APIRoute = async () => {
  try { await db()`SELECT 1`; return json({ok:true}); }
  catch { return fail('SERVICE_UNAVAILABLE','Database unavailable',503); }
};
