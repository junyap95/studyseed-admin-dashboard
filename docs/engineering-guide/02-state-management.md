# 02 — State Management

## Layering

| Concern | Tool | Location |
| --- | --- | --- |
| Server/async data | TanStack React Query | Pages, contexts, forms |
| Auth UI flag | React Context | `AuthContext` |
| Question editing UI | React Context | `QuestionsContext` |
| Form field state | react-hook-form | Per-form components |
| Ephemeral client cache | usehooks-ts `useLocalStorage` | `admin-profile`, `new-users` |

No Redux, Zustand, or Jotai.

## React Query patterns

### Query keys in use

| Key | Used by | Data |
| --- | --- | --- |
| `["questions-by-course-topic", topic, course]` | `QuestionsContext` | Questions payload |
| `["all-users", searchTerm, page]` | `users-overview/page.tsx` | Paginated users |

### Mutations

| Mutation | Invalidates | File |
| --- | --- | --- |
| Create user | `["users"]` ⚠️ wrong key | `CreateUserForm.tsx` |
| Delete user | `["all-users"]` | `UserTable.tsx` |
| Update question | `["questions-by-course-topic", topic, course]` | `QuestionsContext` |

Fix the create-user invalidation key when touching that file.

### Defaults

```typescript
// QuestionsContext
staleTime: 1000 * 60 * 5,       // 5 minutes
placeholderData: keepPreviousData,
enabled: !!selectedCourse && !!selectedTopic,
```

## AuthContext

Minimal — only `isAuthenticated`, `setIsAuthenticated`, `isLoading`.

- Does **not** store JWT or admin profile.
- On mount: `GET /api/auth` with `credentials: "include"`.
- On 401: clears `localStorage`.

Admin profile for NavBar comes from `localStorage` key `admin-profile`, set on
login success in `Login.tsx`.

## QuestionsContext

The most complex state layer. Holds:

| State | Type | Purpose |
| --- | --- | --- |
| `selectedCourse` | `Course \| undefined` | Active course filter |
| `selectedTopic` | `Topic` | Active topic (default: LITERACY) |
| `selectedModuleId` | `string \| undefined` | Active module |
| `editingQuestion` | `Question \| null` | Question being edited |
| `questions` | `QuestionsPayload \| undefined` | From React Query |
| `modules` | `Record<string, Question[]>` | Derived from questions |

Exposes `handleUpdateQuestion(updates)` which builds the API payload and calls
the update mutation.

### Selection callbacks bug

```typescript
const selectTopic = useCallback((topic: Topic | undefined) => {
  if (topic) setSelectedTopic(topic);  // undefined never clears
}, []);
```

Same pattern for `selectModule`. Fix when adding "clear selection" UX.

## Form state

Each question editor form is independent:

```typescript
useForm<ZodQuestionSchema>({
  resolver: zodResolver(questionSubSchema),
  defaultValues: questionData,
  mode: "onChange",
});
```

Forms do not share state — editing is one question at a time.
