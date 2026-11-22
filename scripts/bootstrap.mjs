// A single boot path for local, Railway, and dashboard-configured `npm run start`.
// Import each module in order: migrations and seed scripts complete before HTTP starts.
// Seed batches are idempotent and preserve admin edits on subsequent launches.
await import('./migrate.mjs');
await import('./seed-verified-2026.mjs');
await import('./seed-extended-2026.mjs');
await import('../dist/server/entry.mjs');
