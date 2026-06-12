# Phase 2 — Schema Sync & Features

**Goal:** Align admin dashboard with ges-programme-server/client; add missing
question type support.  
**Risk:** Medium (touches game data contracts).  
**Estimated effort:** 3–5 days.  
**Depends on:** Phase 1 security fixes.

## Checklist

### 2.1 Add streak_choice support

Reference implementations:
- Server: `ges-programme-server-1/src/types/question.ts` (`StreakChoiceType`)
- Client: `ges-programme-client/src/QuizRunnerComponents/QuizRenderer/StreakChoiceQuestion/`

- [ ] Add types to `lib/questionTypes.ts`
- [ ] Add Zod schema to `lib/questionSchema.ts`
- [ ] Create `StreakChoiceForm.tsx`
- [ ] Add renderer + editor cases
- [ ] Test edit round-trip on dev MongoDB
- [ ] Verify client quiz still scores correctly

### 2.2 MACKLE course — ecosystem decision

**Option A:** Promote MACKLE to server + client (recommended if content is live).  
**Option B:** Remove MACKLE from admin until game stack is ready.

If Option A:
- [ ] Add `MACKLE` to server `Course` enum + question models
- [ ] Add server read routes for `mackle_literacy`
- [ ] Add MACKLE to client `constants/courses.ts` + game map tiles

### 2.3 User schema hardening

- [ ] Add `unique: true` on `userid` in `Models/User.ts`
- [ ] Handle duplicate key error (`11000`) in create route
- [ ] Align progress init with server pre-save hook (shared test or extracted util)

### 2.4 Server-side Zod on write routes

- [ ] Validate `create-new-user` body (already partial — ensure full schema)
- [ ] Validate `update-question` body with `questionSchema`
- [ ] Return `400` with Zod error details on failure

### 2.5 Question management gaps (product decision)

Current: edit-only. Consider:
- [ ] Create new question within module
- [ ] Delete question
- [ ] Create new module

Scope each feature with stakeholders before implementing.

## Verification

- [ ] Edit each question type including `streak_choice` on dev DB
- [ ] Create user → login on ges-programme-client with same userid
- [ ] Run affected quizzes on client after admin edit
- [ ] Cross-repo PR checklist in [improvements/02-data-model-sync.md](../improvements/02-data-model-sync.md)

## Out of scope

- Full audit log for question edits.
- Role-based admin permissions.
