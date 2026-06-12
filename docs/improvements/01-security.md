# 01 — Security

**Last reviewed:** 2026-06-12

## 🔴 Public admin registration

**File:** `src/app/api/register/route.ts`  
**Issue:** Anyone can create an admin account. No auth, no invite token, no env
flag to disable in production.

**Risk:** Full admin access to user data and quiz content.

**Fix:** Remove public registration in production; gate behind env flag
(`ALLOW_ADMIN_REGISTER=true` for dev only) or invite-only flow.

---

## 🔴 Unprotected migration endpoint

**File:** `src/app/api/migrate-users-avatars/route.ts`  
**Issue:** `POST` with no authentication. Bulk-updates all users.

**Risk:** Data corruption if endpoint is reachable in production.

**Fix:** Delete after migration complete, or protect with admin JWT + one-time
secret header.

---

## 🔴 Incomplete JWT verification on API routes

Several routes check `cookies.authToken` exists but never verify the JWT:

| Route | File |
| --- | --- |
| `POST /api/create-new-user` | `api/create-new-user/route.ts` |
| `DELETE /api/delete-user` | `api/delete-user/route.ts` |
| `PUT /api/update-question` | `api/update-question/route.ts` |

**Risk:** Expired or tampered cookies may still allow writes if the cookie
string is non-empty.

**Fix:** Extract shared `requireAuth(request)` that awaits `verifyAuthToken`
and use on every protected route.

---

## 🔴 Missing `await` on verifyAuthToken

**File:** `src/app/api/get-paginated-users/route.ts` line 35

```typescript
const decoded = verifyAuthToken(token);  // returns Promise, not payload
```

**Risk:** Auth check is effectively a no-op; route proceeds without validation.

**Fix:** `const decoded = await verifyAuthToken(token);`

---

## 🟠 Login response leaks password hash

**File:** `src/app/api/login/route.ts`

Returns full `adminUser` document including bcrypt `password` hash in JSON body.

**Fix:** Strip password before response:

```typescript
const { password: _, ...safeAdmin } = adminUser;
return NextResponse.json({ message, adminUser: safeAdmin });
```

---

## 🟠 JWT secret encoding

**File:** `src/lib/auth.ts`

```typescript
export const secret = new TextEncoder().encode(JSON.stringify(process.env.JWT_SECRET));
```

`JSON.stringify` wraps the secret in quotes, changing the effective key material.
Works as long as sign and verify use the same encoding, but is non-standard.

**Fix:** Use `new TextEncoder().encode(process.env.JWT_SECRET!)` directly.

---

## 🟠 No rate limiting on login

**File:** `src/app/api/login/route.ts`

No brute-force protection on email/password attempts.

**Fix:** Add rate limiting middleware or exponential backoff per IP/email.

---

## 🟡 Middleware does not cover API routes

`/api/*` routes are outside middleware matcher. Each route must self-protect.
A missed check on a new route = unprotected endpoint.

**Fix:** Consider adding `/api/:path*` to middleware matcher with allowlist for
`/api/login` and `/api/logout`.

---

## 🟡 localStorage admin profile

Admin display info stored in `localStorage` (`admin-profile`). Not a secret but
survives logout incompletely if logout flow fails partway.

**Fix:** Clear on 401 in AuthContext (already done); consider not storing profile
in localStorage at all — fetch from `/api/auth` response instead.
