import { createHmac } from 'node:crypto';
import type { APIContext } from 'astro';
import { db } from './db';

// Never trust caller-provided X-Forwarded-For. Use the adapter-derived address.
function identity(ctx: APIContext) {
  let address = '';
  try { address = ctx.clientAddress; } catch { address = ''; }
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error('SESSION_SECRET is required');
  return createHmac('sha256', secret).update(address || 'unknown').digest('hex');
}
type Scope = 'admin-login' | 'edit-request' | 'activity-log';
export async function rateLimit(ctx: APIContext, scope: Scope, max: number, durationSeconds: number): Promise<boolean> {
  const key = identity(ctx);
  const rows = await db()`
    INSERT INTO request_rate_limits (scope,identity_hash,window_start,attempts)
    VALUES (${scope},${key},now(),1)
    ON CONFLICT (scope,identity_hash) DO UPDATE SET
      attempts = CASE WHEN request_rate_limits.window_start <= now() - (${durationSeconds}::int * interval '1 second')
        THEN 1 ELSE request_rate_limits.attempts + 1 END,
      window_start = CASE WHEN request_rate_limits.window_start <= now() - (${durationSeconds}::int * interval '1 second')
        THEN now() ELSE request_rate_limits.window_start END
    RETURNING attempts
  `;
  return Number(rows[0].attempts) <= max;
}
export async function clearRateLimit(ctx: APIContext, scope: Scope) {
  await db()`DELETE FROM request_rate_limits WHERE scope=${scope} AND identity_hash=${identity(ctx)}`;
}
