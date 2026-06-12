# Improvements, Tech Debt & Optimisations

Living record of gaps, tech debt, and optimisation opportunities in the
Studyseed Admin Dashboard. Add new dated entries rather than rewriting history.

**Last reviewed:** 2026-06-12

## Severity legend

| Level | Meaning |
| --- | --- |
| 🔴 High | Correctness/security risk, or blocks scaling/maintenance |
| 🟠 Medium | Notable debt or bug risk; schedule soon |
| 🟡 Low | Polish, hygiene, minor optimisation |

## Documents

| Doc | Area |
| --- | --- |
| [01 — Security](./01-security.md) | Auth, JWT, public endpoints, credential leaks |
| [02 — Data Model Sync](./02-data-model-sync.md) | Drift vs ges-programme-server/client |
| [03 — Code Quality](./03-code-quality.md) | Bugs, dead code, UX inconsistencies |
| [04 — Testing & Docs](./04-testing-and-docs.md) | Test coverage, CI, documentation gaps |

## Top priorities (snapshot 2026-06-12)

1. 🔴 **Public admin registration** — `/api/register` has no auth (doc 01).
2. 🔴 **Unprotected migration endpoint** — `/api/migrate-users-avatars` (doc 01).
3. 🔴 **Incomplete JWT verification** — several routes check cookie presence only (doc 01).
4. 🔴 **Missing `await` on `verifyAuthToken`** in `get-paginated-users` (doc 01).
5. 🔴 **`streak_choice` not supported** — schema drift with server/client (doc 02).
6. 🟠 **Login response leaks password hash** (doc 01).
7. 🟠 **Query key mismatch** on create-user invalidation (doc 03).
8. 🟠 **Minimal test coverage** — 2 test files (doc 04).
9. 🟡 **Unused Emotion dependencies** (doc 03).
10. 🟡 **README port mismatch** — said 3000, app uses 8000 (fixed in docs update).
