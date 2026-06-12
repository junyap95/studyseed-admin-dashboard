# 03 — Code Quality

**Last reviewed:** 2026-06-12

## 🟠 Query key mismatch on create user

**File:** `src/app/manage/create-user/components/CreateUserForm.tsx`

On success, invalidates `["users"]` but users overview uses
`["all-users", searchTerm, page]`.

**Fix:** Invalidate `["all-users"]` (prefix match) or align keys across app.
Consider extracting to `lib/queryKeys.ts` like ges-programme-client.

---

## 🟠 QuestionsContext selection callbacks

**File:** `src/context/QuestionsContext.tsx`

`selectTopic(undefined)` and `selectModule(undefined)` never clear state because
of `if (topic)` / `if (module)` guards.

**Fix:** Always call setter; handle `undefined` explicitly to reset.

---

## 🟠 Duplicate client-side filtering

**File:** `src/app/manage/users-overview/page.tsx`

Server already filters by `searchTerm`; page may apply additional client filter.
Redundant and can cause pagination count mismatches.

**Fix:** Remove client-side filter; trust server response.

---

## 🟡 Stale TODO

**File:** `src/app/manage/questions/page.tsx`

Comment references creating an API route that already exists (`/api/get-questions`).

**Fix:** Remove TODO.

---

## 🟡 Register page styling

**File:** `src/app/register/components/Register.tsx`

Uses inline styles while rest of app uses Tailwind + shadcn.

**Fix:** Refactor to match login page patterns.

---

## 🟡 Unused dependencies

| Package | Status |
| --- | --- |
| `@emotion/react` | No imports in `src/` |
| `@emotion/styled` | No imports |
| `@emotion/cache` | No imports |
| `cmdk` | No direct imports (shadcn leftover?) |
| `next-themes` | Imported in sonner only; no ThemeProvider |

**Fix:** `npm uninstall` unused packages after verification.

---

## 🟡 Unused API endpoint

`GET /api/get-all-users` — not referenced by any UI component.

**Fix:** Remove or wire to a feature (export all users).

---

## 🟡 Incomplete apiPaths enum

`DashboardAPIPath` missing: `logout`, `auth`, `register`, `get-all-users`,
`migrate-users-avatars`.

**Fix:** Add all paths or document intentional omissions.

---

## 🟡 networkFunctions.ts underused

Only `updateQuestionFn` exported. Other fetches are inline in components.

**Fix:** Either centralize all API calls or document that inline fetch is
intentional for this smaller app.

---

## 🟡 Login returns 201 for success

**File:** `src/app/api/login/route.ts`

HTTP 201 (Created) is semantically wrong for login. Should be 200.

**Fix:** Change status to 200.
