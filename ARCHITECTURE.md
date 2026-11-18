# Indie Flow — Architecture

## Scope
- Railway Node.js service: Astro SSR pages, admin HTML forms, REST endpoints.
- Railway PostgreSQL: durable venues/events, correction requests, anonymous action logs.
- Excluded: Instagram Graph API, LLM inference, paid advertising, QR integration, automatic scraping.
- Data enters through admin forms. Only `published` events are served publicly; posters require `poster_approved`.

## Runtime
```
Visitor -> Astro SSR (/) -> PostgreSQL
        -> /events/:id -> PostgreSQL
        -> /api/events, /api/calendar -> PostgreSQL
Operator -> /admin/login -> HMAC-signed HttpOnly cookie
         -> /admin -> /api/admin/* -> PostgreSQL
Future ingest adapter -> validation -> operator review -> events
```

## Code boundaries
- `src/lib/db.ts`: pooled PostgreSQL connection
- `src/lib/events.ts`: public reads, date/distance rules
- `src/lib/validation.ts`: Zod input schemas
- `src/lib/auth.ts`: signed admin session, origin checking
- `src/pages/api`: request boundary, permission and validation
- `src/pages/admin`: protected operator UI
- `sql/001_init.sql`: idempotent baseline schema
- `scripts/migrate.mjs`: deployment schema bootstrap

## Deliberate decisions
- One Railway web service and one PostgreSQL service: minimal moving parts and resource cost.
- SQL tagged templates via postgres.js rather than an extra ORM: explicit queries and easy audits for a small data model.
- Single admin password from Railway secret variables: acceptable for one operator only; migrate to identity-provider or account model before adding venue accounts.
- No new infrastructure for media: only use external poster URLs when licensing/permission is confirmed.
- Search bots should not index draft data or admin pages.
- API keys and any future extraction workers belong server-side.

## Deployment
1. Configure Railway PostgreSQL and `DATABASE_URL` using the database's internal connection variable.
2. Set `ADMIN_PASSWORD` (16+ characters), `SESSION_SECRET` (independent random 32+ characters), `PUBLIC_SITE_URL` (canonical https:// domain).
3. Attach repository; use Node 22+, `npm run build` and `npm run db:migrate && npm run start`. Bind Railway `PORT` via standalone Node adapter.
4. Health endpoint: `/api/health`. Confirm successful database query before allowing traffic.
5. For rollback, redeploy previous commit; schema migration 001 is additive/idempotent. Back up PostgreSQL before changing schema or deleting data.

## Known limits
- Approximate walking minutes use straight-line distance and 75m/min; do not advertise them as actual routes.
- Admin password is shared, with no audit by person or multi-user roles.
- Business Discovery/Instagram PoC and automated moderation remain unimplemented.
- Public event dates are rendered in Korean; English is currently a lightweight list UI translation, not localized event content.
- No persistent rate limiter or import worker yet; before broad public launch add abuse protection to correction requests and logging.
