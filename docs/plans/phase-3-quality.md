# Phase 3 — Quality, Testing & CI

**Goal:** Sustainable maintenance matching ges-programme-client standards.  
**Risk:** Low (additive changes).  
**Estimated effort:** 2–3 days.  
**Can run in parallel** with Phase 2 for non-overlapping files.

## Checklist

### 3.1 Testing

- [ ] Add `lib/queryKeys.ts` and unit tests for key factories
- [ ] Test `initializeProgress`, `generateRandomLetters`
- [ ] Test Zod `questionSchema` per type (valid + invalid payloads)
- [ ] Test `requireAuth` helper (from Phase 1)
- [ ] API route tests with mocked Mongoose (login, create-user, update-question)
- [ ] Component test: `CreateUserForm` submit flow (mocked fetch)

### 3.2 CI expansion

Update `.github/workflows/unit-tests.yml`:

```yaml
- run: npm run lint
- run: npm run build
- run: npm test -- --ci
```

### 3.3 package.json scripts

- [ ] Add `"typecheck": "tsc --noEmit"`

### 3.4 Code cleanup

- [ ] Fix query key invalidation in `CreateUserForm`
- [ ] Fix `QuestionsContext` selection clear bug
- [ ] Remove stale TODO in questions page
- [ ] Uninstall unused Emotion packages
- [ ] Remove or document `get-all-users` endpoint
- [ ] Complete `DashboardAPIPath` enum
- [ ] Refactor Register page to Tailwind/shadcn

### 3.5 Optional: Husky pre-commit

Mirror ges-programme-client:

- [ ] `husky` + `lint-staged` for ESLint on staged `src/**`
- [ ] `prepare` script in package.json

### 3.6 Documentation maintenance

- [ ] Link `docs/` from README (done in README update)
- [ ] Update engineering guide when patterns change
- [ ] Add decision log section if major choices made (e.g. MACKLE promotion)

## Verification

```bash
npm run typecheck   # after adding script
npm run lint
npm test -- --ci
npm run build
```

Target: **>60% coverage** on `lib/` and `api/` (aspirational; set concrete
threshold once baseline exists).

## Out of scope

- E2E tests with Playwright (consider if admin grows significantly).
- CRA-style MSW integration tests (optional future work).
