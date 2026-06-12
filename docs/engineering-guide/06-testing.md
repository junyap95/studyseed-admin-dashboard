# 06 — Testing

## Current state

| File | Coverage |
| --- | --- |
| `helloWorldtest.test.ts` | Smoke test |
| `src/app/register/tests/Register.test.tsx` | Basic Register component render |

**No tests** for: auth flow, API routes, question editors, user CRUD, middleware.

## Tooling

| Tool | Config |
| --- | --- |
| Jest 29 | `jest.config.ts` |
| next/jest | Transforms Next.js imports |
| Testing Library | `jest.setup.ts` imports `@testing-library/jest-dom` |
| jsdom | Test environment |

```bash
npm test          # watch mode
npm test -- --ci  # CI mode (used in GitHub Actions)
```

## Recommended test priorities

### Phase 1 — Unit (fast, high value)

| Target | What to test |
| --- | --- |
| `lib/auth.ts` | sign + verify round-trip |
| `lib/helperFunctions.ts` | `initializeProgress`, `generateRandomLetters` |
| `lib/questionSchema.ts` | Zod rejects invalid question payloads per type |
| `updateQuestion.ts` | `getCollection` mapping for all course/topic combos |

### Phase 2 — API routes

Use Next.js test utilities or supertest against Route Handlers:

| Route | Cases |
| --- | --- |
| `POST /api/login` | valid creds, wrong password, missing admin |
| `POST /api/create-new-user` | valid user, duplicate userid, no cookie |
| `PUT /api/update-question` | valid update, missing cookie |

Mock Mongoose models with `jest.mock`.

### Phase 3 — Integration

| Flow | Tool |
| --- | --- |
| Login → manage hub | RTL + MSW or mocked fetch |
| Edit MCQ → save | RTL + mocked mutation |

## CI gap

`.github/workflows/unit-tests.yml` only runs `jest`. Recommend adding:

```yaml
- run: npm run lint
- run: npm run build
```

## Conventions (when writing tests)

- Colocate tests: `Component.test.tsx` next to component, or `tests/` subfolder.
- Mirror ges-programme-client: no `userEvent.setup()` if using user-event v14
  (this project uses v14 — direct `userEvent.click()` is fine).
- Mock `fetch` for client components that call API routes.
