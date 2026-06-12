# 02 — Data Model Sync

**Last reviewed:** 2026-06-12

Tracks drift between this dashboard and the GES ecosystem repos.

## 🔴 streak_choice question type

| Repo | Status |
| --- | --- |
| ges-programme-server | `StreakChoiceType` in `src/types/question.ts` |
| ges-programme-client | Renderer + Zod schema + answer checker |
| **admin dashboard** | **Not present** |

**Impact:** Questions with `question_style: "streak_choice"` in MongoDB cannot
be viewed or edited in the admin UI. Client quiz runner handles them; admin is blind.

**Fix:**
1. Add `StreakChoiceType` + `StreakChoiceRound` to `lib/questionTypes.ts`.
2. Add Zod schema to `lib/questionSchema.ts`.
3. Create `StreakChoiceForm.tsx` + renderer case.
4. Add to `QuestionEditor` switch.

---

## 🟠 MACKLE course — admin-only

| Repo | Status |
| --- | --- |
| admin dashboard | `Course.MACKLE`, `mackle_literacy` collection |
| ges-programme-server | No MACKLE enum or collection |
| ges-programme-client | No MACKLE course constant |

**Impact:** MACKLE content can be authored in admin but is unreachable in the
game until server and client are updated.

**Fix:** Add MACKLE to server `Course` enum, question models, and read routes;
add to client `constants/courses.ts` and game map.

---

## 🟠 userid unique index

| Repo | Enforcement |
| --- | --- |
| ges-programme-server | `unique: true` on `userid` in Mongoose schema |
| admin dashboard | Application-level check only in create route |

**Impact:** Race condition or direct DB insert could create duplicate userids.

**Fix:** Add `unique: true` to `User.ts` schema; handle `11000` duplicate key error.

---

## 🟠 Progress initialization divergence

| Repo | Approach |
| --- | --- |
| admin dashboard | `initializeProgress()` called client-side in create form |
| ges-programme-server | Mongoose pre-save hook |

Both produce similar shapes but are maintained separately.

**Fix:** Share initialization logic (npm package or copy-paste test) or delegate
user creation to server API.

---

## 🟡 matching question fields

Server and admin both have `options`, `answers`, `correct_answer` for matching
type. Client Zod schema may only validate `correct_answer`. Verify all three
repos agree on required fields.

---

## 🟡 dummy question type

Present in all three repos. Admin shows view-only (not editable). Consistent.

---

## Sync checklist (copy for PRs)

When changing question or user schema:

- [ ] `studyseed-admin-dashboard` — types, schemas, forms
- [ ] `ges-programme-server` — `src/types/question.ts`, models, routes
- [ ] `ges-programme-client` — `schemas/`, checkers, renderers
- [ ] Test on shared dev MongoDB
- [ ] Update CHANGELOG in each repo
