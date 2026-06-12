# 05 — Styling & UI

## Stack

- **Tailwind CSS v4** — configured via `postcss.config.mjs` and `globals.css`.
- **shadcn/ui** — Radix primitives + `class-variance-authority` + `tailwind-merge`.
- **lucide-react** — icons.
- **Inter** font via `next/font/google`.

## Design tokens

Studyseed brand colors defined in `src/app/globals.css`:

| Token | Value | Usage |
| --- | --- | --- |
| Studyseed blue | `#3380fc` | Primary actions, links |
| Studyseed orange | `#f58439` | Accents |

shadcn CSS variables (`--background`, `--foreground`, `--primary`, etc.) follow
the default shadcn theme with Tailwind v4 `@theme` integration.

## Class name helper

```typescript
// src/lib/utils.ts
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

Use `cn()` for conditional classes on shadcn components.

## Component styling conventions

- shadcn primitives: Tailwind utility classes in component files.
- Page layouts: Tailwind in `page.tsx` or component files.
- **No CSS modules** — unlike ges-programme-client.
- **No Emotion** — `@emotion/*` packages are installed but unused (remove in cleanup).

## Dark mode

`next-themes` is a dependency and `sonner.tsx` references `useTheme`, but no
`ThemeProvider` exists in `layout.tsx`. Dark mode is **not active**. Either wire
it up or remove the dependency.

## ImageKit assets

Shared CDN with game client: `ik.imagekit.io/jbyap95`. Question `image` fields
store ImageKit paths/URLs edited in question forms.

## Responsive design

No mobile hard-block (unlike ges-programme-client). Admin UI is desktop-oriented
but not explicitly blocked on small screens.
