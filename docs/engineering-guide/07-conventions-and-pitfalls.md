# 07 — Conventions & Anti-Patterns

> **AI agents: read this before generating code.**

## Golden rules

1. **Server data → React Query.** UI selection state → Context. Form fields → react-hook-form.
2. **All API paths** in `DashboardAPIPath` enum (add new entries when creating routes).
3. **All page paths** in `DashboardPagePath` enum — always absolute (`/manage/...`).
4. **Always `await verifyAuthToken(token)`** — it returns a Promise.
5. **Validate with Zod** on both forms and (recommended) API route bodies.
6. **Use `@/` import alias** — no relative `../../` chains across modules.
7. **Mongoose:** call `connectToMongoDB()` at the start of every Route Handler.
8. **Credentials:** client `fetch` to API routes must include `credentials: "include"`.
9. **Query key consistency** — invalidate the same key shape used in `useQuery`.
10. **Green gates before push:** `npm run lint`, `npm test`, `npm run build`.

## Naming

| Kind | Convention | Example |
| --- | --- | --- |
| React components | PascalCase file + export | `CreateUserForm.tsx` |
| Route Handlers | `route.ts` in folder | `api/login/route.ts` |
| Context | `XContext.tsx` + `XProvider` + `useX()` | `AuthContext.tsx` |
| Enums | `*.enum.ts` | `apiPaths.enum.ts` |
| Mongoose models | PascalCase in `Models/` | `User.ts` |
| Zod schemas | camelCase + `Schema` suffix | `questionSchema.ts` |

## Patterns to follow

### Adding a new API route

1. Create `src/app/api/<name>/route.ts`.
2. Add path to `DashboardAPIPath` enum.
3. Call `connectToMongoDB()`.
4. Use `await verifyAuthToken(token)` for protected routes.
5. Validate body with Zod `safeParse`.
6. Return structured `NextResponse.json({ ... }, { status })`.

### Adding a new question type

1. Add interface to `lib/questionTypes.ts`.
2. Add Zod sub-schema to `lib/questionSchema.ts`.
3. Add read-only case to `QuestionRenderer.tsx`.
4. Create `<Type>Form.tsx` with react-hook-form.
5. Add case to `QuestionEditor.tsx` switch.
6. **Also update** `ges-programme-server` and `ges-programme-client` (see doc 08).

### Adding a new manage page

1. Create `src/app/manage/<name>/page.tsx`.
2. Add path to `DashboardPagePath`.
3. Add NavBar link if user-facing.
4. Middleware auto-protects `/manage/*` — no extra config needed.

## Anti-patterns (never reintroduce)

| Anti-pattern | Why |
| --- | --- |
| Checking cookie exists without verifying JWT | Expired/invalid tokens pass |
| `verifyAuthToken(token)` without `await` | Silent auth bypass |
| Public admin registration in production | Anyone can create admin accounts |
| Returning password hash in login response | Credential leak |
| Unprotected migration endpoints | Data corruption risk |
| Invalidating wrong React Query key | Stale UI after mutations |
| Relative hrefs in NavBar (`href="create-user"`) | Path nesting bug |
| Inline styles on new pages | Inconsistent with Tailwind/shadcn |
| Direct MongoDB writes without validation | Corrupts game client data |
| Adding `streak_choice` only in one repo | Schema drift breaks quizzes |

## Error handling

Current pattern: `NextResponse.json({ error }, { status })` in catch blocks.

Avoid returning raw `Error` objects — they may serialize poorly. Prefer:

```typescript
return NextResponse.json({ message: "Human-readable error" }, { status: 500 });
```

## Security checklist for new features

- [ ] Route behind middleware or explicit JWT verify?
- [ ] Body validated with Zod?
- [ ] No secrets in response body?
- [ ] No unauthenticated write endpoints?
- [ ] Query invalidation key matches?
