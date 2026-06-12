# Phase 1 — Security Quick Fixes

**Goal:** Close critical auth gaps without architectural changes.  
**Risk:** Low–medium (targeted file changes).  
**Estimated effort:** 1–2 days.

## Checklist

### 1.1 Shared auth helper

- [ ] Create `src/lib/requireAuth.ts`:
  - Parse `authToken` cookie.
  - `await verifyAuthToken(token)`.
  - Return decoded payload or throw/return 401 response.
- [ ] Use in all protected Route Handlers.

### 1.2 Fix missing await

- [ ] `get-paginated-users/route.ts` — `await verifyAuthToken(token)`.

### 1.3 Strip password from login response

- [ ] `login/route.ts` — omit `password` from `adminUser` in JSON body.

### 1.4 Gate admin registration

- [ ] Add `ALLOW_ADMIN_REGISTER` env var (default `false`).
- [ ] Return `403` from `/api/register` when disabled.
- [ ] Hide `/register` link in production UI.

### 1.5 Remove or protect migration endpoint

- [ ] Delete `migrate-users-avatars` route if migration is complete, OR
- [ ] Require admin JWT + `MIGRATION_SECRET` header.

### 1.6 Fix JWT secret encoding

- [ ] Change to `new TextEncoder().encode(process.env.JWT_SECRET!)`.
- [ ] **Note:** Existing tokens invalidate — deploy during low-traffic window
  or accept forced re-login.

### 1.7 Login status code

- [ ] Change successful login from `201` to `200`.

## Verification

```bash
# Manual checks after changes
curl -X POST http://localhost:8000/api/register          # expect 403 in prod mode
curl http://localhost:8000/api/migrate-users-avatars     # expect 401/404
curl http://localhost:8000/api/get-paginated-users      # expect 401 without cookie

npm run build
npm test
```

## Out of scope (Phase 2+)

- Rate limiting on login.
- Middleware coverage for `/api/*`.
- Routing writes through ges-programme-server.
