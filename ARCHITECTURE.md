# Indie Flow — Architecture

## Runtime
- Railway web service: Astro SSR with Node adapter, HTML pages and same-origin REST endpoints.
- Railway PostgreSQL: venues, events, edit requests, action logs, rolling request limits.
- No Instagram/LLM API calls; admins register shows or import JSON and approve each event.

## Request flow
```
Visitor → /, /events/:id → GET /api/events and /api/calendar → published events
Admin → /admin/login → signed HttpOnly cookie → /admin and /api/admin/* → PostgreSQL
JSON import → validation → pending review → approved events
```

## Repository boundaries
- `src/lib/events.ts`: public reads, date/distance estimates
- `src/lib/validation.ts`: Zod validation for all write inputs
- `src/lib/auth.ts`: HMAC admin sessions and Origin controls
- `src/lib/rate-limit.ts`: shared PostgreSQL rate limits and HMAC address hashing
- `src/pages/api/`: REST and admin mutations
- `sql/001_init.sql`, `sql/002_security.sql`: idempotent schemas
- `scripts/migrate.mjs`: startup schema setup

## Deployment
Configure Railway variables: `DATABASE_URL`, `ADMIN_PASSWORD` (16+ random characters),
`SESSION_SECRET` (32+ random characters), `PUBLIC_SITE_URL` (HTTPS URL).
Start command `npm run db:migrate && npm run start`; health check `/api/health`.
Back up DB before modifying tables. See [security checklist](docs/SECURITY.md).

## Known limits
- Walking time is an approximation from straight-line distance and assumes 75m/min.
- Initial service area is Hongdae and its neighboring districts.
- English is only a partial UI translation; event content is not translated automatically.
- Single shared admin account, no MFA and no individual session revocation.
- IP rate limiting can be shared behind a proxy; verify on Railway.
- No paid ads, automatic scraping, Instagram integrations, file uploads or AI generation.
