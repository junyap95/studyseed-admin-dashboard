# 04 — Testing & Documentation

**Last reviewed:** 2026-06-12

## 🔴 Minimal test coverage

Only 2 test files exist:

| File | What it tests |
| --- | --- |
| `helloWorldtest.test.ts` | Smoke |
| `register/tests/Register.test.tsx` | Register render |

**Not tested:** middleware, auth routes, user CRUD, question editors, Zod
schemas, `updateQuestion`, `initializeProgress`.

See [engineering-guide/06-testing.md](../engineering-guide/06-testing.md) for
recommended priorities.

---

## 🟠 CI only runs tests

**File:** `.github/workflows/unit-tests.yml`

Does not run `npm run lint` or `npm run build`.

**Fix:** Add lint + build steps to match ges-programme-client CI rigor.

---

## 🟠 No typecheck script

Unlike ges-programme-client (`npm run typecheck`), this repo relies on
`next build` for type checking. No standalone `tsc --noEmit` script.

**Fix:** Add `"typecheck": "tsc --noEmit"` to `package.json`.

---

## 🟡 No pre-commit hooks

ges-programme-client uses Husky + lint-staged. This repo has none.

**Fix:** Add Husky with lint on staged files (optional, lower priority).

---

## 🟡 Documentation was missing (addressed 2026-06-12)

Prior state:
- README was default Next.js boilerplate with wrong port (3000 vs 8000).
- No `.env.example`.
- No architecture or API docs.

**Addressed:** Full `docs/` tree added mirroring ges-programme-client structure.

**Remaining:** Keep docs updated when adding features (especially question types).

---

## 🟡 No MSW or API mocks

ges-programme-client uses MSW for integration tests. Admin dashboard has no
mock layer for Route Handler testing.

**Fix:** Add MSW handlers or jest mocks for `/api/*` in component tests.
