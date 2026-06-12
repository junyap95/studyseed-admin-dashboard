# 04 — API & Data Layer

## Route Handler pattern

Every API route follows this skeleton:

```typescript
export async function POST(request: Request) {
  await connectToMongoDB();

  // 1. Auth check (cookie / JWT)
  // 2. Parse + validate body
  // 3. Mongoose operation
  // 4. Return NextResponse.json(...)
}
```

## Auth helper usage

**Always `await` async auth functions:**

```typescript
// Correct
const decoded = await verifyAuthToken(token);

// Bug (current code in get-paginated-users)
const decoded = verifyAuthToken(token);  // returns Promise, not payload
```

Recommended: extract a shared `requireAuth(request)` helper that:

1. Parses cookie.
2. Awaits `verifyAuthToken`.
3. Returns decoded payload or throws `401`.

## MongoDB connection

`connectToMongoDB()` in `src/lib/mongodb.ts`:

- Must be called before any Mongoose operation.
- Safe to call on every request (cached after first connect).

## Question update mechanics

`updateQuestion()` uses positional operators with `arrayFilters`:

```typescript
Collection.updateOne(
  {},  // matches the single document in each collection
  { $set: setObject },
  {
    arrayFilters: [
      { "u.module_id": module_id },
      { "q.question_number": question_number },
    ],
  },
);
```

`setObject` keys look like `modules.$[u].questions.$[q].question_text`.

**Limitation:** Only updates existing questions — cannot create new ones or
change `question_number` / `module_id`.

## Recommended additions

| Addition | Why |
| --- | --- |
| Server-side Zod on PUT routes | Prevent malformed writes to production DB |
| Shared `requireAuth()` middleware | Consistent JWT validation |
| `ApiError` class + structured errors | Match ges-programme-client pattern |
| Rate limiting on `/api/login` | Brute-force protection |

## networkFunctions.ts

Currently exports only `updateQuestionFn`. Other API calls use inline `fetch()`
in components/contexts. When adding new shared calls, centralize here and add
the path to `DashboardAPIPath` enum.

## Environment

| Variable | Used in |
| --- | --- |
| `MONGODB_URI` | `lib/mongodb.ts` |
| `JWT_SECRET` | `lib/auth.ts` |
| `NODE_ENV` | Cookie `secure` flag in login route |

Never commit `.env.local`. Use `.env.example` as template.
