![Unit Tests](https://github.com/junyap95/studyseed-admin-dashboard/actions/workflows/unit-tests.yml/badge.svg)

# Studyseed Admin Dashboard

Internal admin tool for the **Studyseed Gamified Learning Programme (SSGLP)**.
Administrators create learner accounts and edit quiz questions stored in MongoDB.
Learners and questions are consumed at runtime by
[ges-programme-client](https://github.com/junyap95/ges-programme-client) via
[ges-programme-server](https://github.com/junyap95/ges-programme-server).

**Version:** 1.2.0

## Features

- Admin login (email + password, JWT cookie)
- Create learner accounts with auto-generated user IDs
- Paginated user search and delete
- Edit quiz questions across GES, GES2, GLP, and MACKLE courses

## Documentation

Full documentation lives in [`docs/`](./docs/README.md):

| Doc | Contents |
| --- | --- |
| [Engineering Guide](./docs/engineering-guide/README.md) | Authoritative patterns and conventions — **start here** |
| [Architecture](./docs/01-architecture.md) | Stack, routing, directory layout |
| [Auth & Routing](./docs/02-auth-and-routing.md) | JWT, middleware, session flow |
| [User Management](./docs/03-user-management.md) | Create, list, delete learners |
| [Question Management](./docs/04-question-management.md) | Edit quiz content |
| [Data & API](./docs/05-data-and-api.md) | MongoDB collections, API reference |
| [Improvements](./docs/improvements/README.md) | Tech debt and security register |
| [Action Plans](./docs/plans/README.md) | Phased remediation plans |

## Getting Started

```bash
npm install
cp .env.example .env.local   # set MONGODB_URI and JWT_SECRET
npm run dev                  # http://localhost:8000
```

Requires a MongoDB instance shared with `ges-programme-server`.

### Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Dev server on port **8000** (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Production server |
| `npm run lint` | ESLint |
| `npm test` | Jest unit tests |

## Ecosystem

```
studyseed-admin-dashboard  ──►  MongoDB  ◄──  ges-programme-server  ◄──  ges-programme-client
     (admin writes)              (shared)         (game API)              (student app)
```

## Releasing a New Version

Releases use [`commit-and-tag-version`](https://github.com/absolute-version/commit-and-tag-version)
with [Conventional Commits](https://www.conventionalcommits.org/).

1. Ensure `main` is up to date and all changes are committed.
2. Run `npm run release` (or `npm run release -- --release-as patch`).
3. Push: `git push --follow-tags origin main`

See [CHANGELOG.md](./CHANGELOG.md) for version history.
