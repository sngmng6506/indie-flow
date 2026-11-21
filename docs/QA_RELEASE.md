# Release verification — Indie Flow

## Automated checks

Run locally before deployment (Node 22–24, PostgreSQL available for integration tests):

```bash
npm ci
npm run check
npm test
npm run build
```

These commands have **not** been executed by the GitHub connector. A successful commit does not mean a successful build or deployment.

## Manual browser regression (Korean and English, 390px mobile + desktop)

1. Open `/?lang=ko` and `/?lang=en`. Confirm 14-day strip, price, show cards, empty state, and 10/15/20/30/all distance filters.
2. With a venue missing coordinates, verify it is excluded from limited-distance lists but included in **All**.
3. Grant location access near Hongdae: distances and visible cards update **without navigation**. Verify `lat` and `lng` do not appear in the browser URL or outgoing application requests. Switch dates/languages; the location selection should persist within the tab only.
4. Deny location access, disable geolocation, and try a location outside the 30-minute supported area; verify the Hongik Univ. Station fallback.
5. Open a show in English; verify English labels, back link, date, directions, ticket action, and correction-request success/failure feedback.
6. Confirm an approved poster displays and an unapproved poster does not. Check source and ticket links use HTTPS.
7. Check responsive card visibility and empty-state visibility; `[hidden]` must override card display styles.

## Admin and security regression

1. Unauthenticated `/admin` redirects to login; admin write APIs reject unauthenticated and cross-origin requests.
2. Wrong password is rejected; repeated failures reach HTTP 429. Correct password signs in; logout invalidates cookie.
3. Create a venue and event, edit it, approve publication, and confirm the public list/detail/API display the event.
4. Verify admin event pagination with more than 50 events, state filters, global counts, and no repeated/missing rows.
5. Verify correction-request pagination with more than 20 pending requests; mark a request resolved and confirm count changes.
6. Submit invalid and oversized payloads, duplicate events, malformed URLs, and invalid IDs. Verify controlled errors and no unhandled 500.
7. Inspect response headers (CSP, X-Frame-Options, nosniff), cookie Secure/HttpOnly/SameSite flags, and absence of sensitive data in public HTML.
8. Confirm `/api/health` returns `{"ok":true}` and DB connection is healthy. Check backup/restore, Railway environment variables, deployment logs, and HTTPS.

## Limitations

- Visitor geolocation is used locally in the public homepage, stored in `sessionStorage` for the tab, and not included in homepage navigation URLs. The legacy public events API still accepts optional location query parameters for compatibility; API clients should avoid passing precise coordinates in URLs.
- Straight-line walking estimates are not real walking routes.
- Automated browser E2E and live Railway smoke tests require an environment with network access, dependencies, and a configured test database.
