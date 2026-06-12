# Engineering Guide — Studyseed Admin Dashboard

> **Authoritative reference** for engineers and AI agents who maintain, extend, or
> refactor this codebase. Documents the **current state** as of 2026-06.

| Set | Location | Purpose |
| --- | --- | --- |
| **Engineering Guide** (this) | `docs/engineering-guide/` | Current-state patterns, conventions, ecosystem |
| Feature walkthroughs | `docs/01`–`05` | End-to-end flows (auth, users, questions, API) |
| Improvements log | `docs/improvements/` | Dated tech-debt and security register |
| Action plans | `docs/plans/` | Phased remediation plans |

If a statement here conflicts with `docs/01`–`05`, **this guide wins**.

---

## How to read this guide

| # | Document | Read it when you need to… |
| --- | --- | --- |
| — | [Executive Summary](#executive-summary) (below) | Get the 5-minute overview |
| 01 | [Architecture & Module Structure](./01-architecture-and-structure.md) | Understand providers, routing, where code lives |
| 02 | [State Management](./02-state-management.md) | Touch contexts, React Query, or form state |
| 03 | [Components & Data Flow](./03-components-and-data-flow.md) | Build/modify UI or trace a user flow |
| 04 | [API & Data Layer](./04-api-and-data-layer.md) | Add/change a Route Handler or Mongoose model |
| 05 | [Styling & UI](./05-styling-and-ui.md) | Work with Tailwind, shadcn, or design tokens |
| 06 | [Testing](./06-testing.md) | Write or debug a test |
| 07 | [Conventions & Anti-Patterns](./07-conventions-and-pitfalls.md) | Generate or review _any_ code (AI agents start here) |
| 08 | [Ecosystem Integration](./08-ecosystem-integration.md) | Understand relationship to GES client/server |

**AI agents:** read [07 — Conventions & Anti-Patterns](./07-conventions-and-pitfalls.md)
**before generating code.**

---

## Executive Summary

### What this project is

The Studyseed Admin Dashboard is an **internal Next.js full-stack app** for
managing the SSGLP (Studyseed Gamified Learning Programme). Admins authenticate
with email/password, then create learner accounts and edit quiz questions stored
in MongoDB.

- **Stack:** Next.js 15 + React 19 + TypeScript 5, Tailwind v4, shadcn/ui,
  TanStack React Query, Mongoose 8.
- **Auth:** JWT in httpOnly cookie (12h), middleware-protected `/manage/*`.
- **Database:** Direct MongoDB access — parallel to `ges-programme-server`.

### Key architectural decisions

| Decision | Rationale |
| --- | --- |
| Direct MongoDB (not via Express server) | Simpler admin CRUD; shares DB with game server |
| Next.js Route Handlers as BFF | Co-located API + UI; no separate backend deploy |
| React Context for question editing state | Complex multi-step selection (course→topic→module→question) |
| Zod on forms, not on all API routes | Forms validated; server routes mostly trust client |
| shadcn/ui | Accessible Radix primitives + Tailwind; copy-paste ownership |
| MACKLE as admin-only course | Content exists in DB but server/client not yet updated |

### Health check commands

```bash
npm run lint     # next lint
npm test         # jest
npm run build    # next build (typecheck included)
```

CI (`.github/workflows/unit-tests.yml`) runs `jest` on push. Lint and build are
not yet in CI — see [improvements/04-testing-and-docs.md](../improvements/04-testing-and-docs.md).

### Current verified status (2026-06)

- **Build:** passes (`next build`).
- **Tests:** minimal — hello-world + basic Register test.
- **Lint:** passes (`next lint`).
- **Security:** known gaps documented in improvements register.
