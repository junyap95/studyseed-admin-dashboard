# 01 — Architecture & Module Structure

## App shell

```
src/app/layout.tsx
  QueryProvider
    AuthProvider
      QuestionsProvider
        NavBar (global)
        {children}  ← page content
        Analytics + Toaster
```

`QuestionsProvider` wraps the entire app even though question state is only
needed on `/manage/questions`. This is acceptable at current scale but could be
scoped to a layout group later.

## File placement rules

| What | Where |
| --- | --- |
| Page route | `src/app/<route>/page.tsx` |
| Page-specific components | `src/app/<route>/components/` |
| API Route Handler | `src/app/api/<name>/route.ts` |
| Shared UI components | `src/components/` |
| shadcn primitives | `src/components/ui/` |
| React Context | `src/context/` |
| Mongoose models | `src/Models/` |
| Zod schemas + TS types | `src/lib/` |
| Enums (paths, courses) | `src/enums/` |
| Constants | `src/constants/` |
| Middleware | `src/middleware.ts` |

## Next.js App Router conventions

- **Server Components** by default; `"use client"` only where needed (forms,
  contexts, interactive UI).
- Route Handlers export named HTTP method functions (`GET`, `POST`, `PUT`,
  `DELETE`).
- `page.tsx` files are thin — delegate to components in `components/` subfolder.

## Middleware scope

```typescript
export const config = {
  matcher: ["/manage/:path*", "/login"],
};
```

Everything else (`/`, `/register`, `/api/*`) is unprotected at the middleware
layer. API routes implement their own auth checks (inconsistently — see
security docs).

## Import aliases

`tsconfig.json` maps `@/*` → `src/*`. Always use `@/` for internal imports.

## Models directory naming

`src/Models/` uses PascalCase (legacy convention). New files should follow
existing pattern for consistency, not introduce `src/models/`.
