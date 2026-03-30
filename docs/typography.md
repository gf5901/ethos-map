# Typography guidelines

EthosMap follows patterns common to modern product UIs (similar in spirit to Stripe’s dashboard typography: a **single sans family**, **16px body**, **modular scale**, and **strong hierarchy** without decorative excess). Anthropic-style documentation sites similarly lean on **system fonts**, **comfortable line length** for reading, and **clear heading levels**.

These rules complement Tailwind’s default type scale (`text-xs` … `text-9xl`); prefer the **semantic roles** below so the UI stays consistent as the app grows.

## Principles

1. **System-first sans** — Use the project’s `--font-sans` stack (no extra font downloads unless we add `next/font` later). Keeps load fast and rendering crisp on each OS.
2. **16px (`1rem`) base** — Body copy and primary UI text default to `text-base` where appropriate; do not shrink global body text for density.
3. **Line height** — Use Tailwind defaults (`leading-*` / size-linked line heights). For long paragraphs, prefer `leading-relaxed` (`1.625`).
4. **Reading width** — Long prose should stay near **~65 characters** per line: use `max-w-prose` (or `max-w-[65ch]`) on article-like blocks.
5. **Headings** — Titles use **semibold** (`font-semibold`), not ultra-bold. Large headings use **tight tracking** (`tracking-tight`) for a polished product look.
6. **Labels / meta** — Section and field labels use the shared **`text-label`** utility (uppercase, small, semibold, wide tracking). Pair with muted color tokens (`text-slate-500`, etc.) as needed.
7. **Uppercase** — Reserve for **labels and badges**, not sentences of body copy.

## Role → Tailwind mapping

| Role | Typical classes | Notes |
|------|-----------------|--------|
| App chrome / nav title | `text-lg font-semibold tracking-tight` | Header brand |
| Page title | `text-3xl font-semibold tracking-tight` | Primary H1 |
| Section title | `text-lg` or `text-xl font-semibold` | H2 / panels |
| Card / node title | `text-sm font-semibold leading-snug` | Dense UI |
| Body | `text-sm` or `text-base leading-relaxed` | Descriptions; `text-base` for emphasis |
| Secondary body | `text-sm text-slate-600` + `dark:` | Supporting copy |
| Label / overline | `text-label` + color | Shared utility in `globals.css` |
| Badge / chip | `text-[10px] font-medium` or `text-xs font-medium` | Only when space is tight |

## Implementation

- **Theme tokens**: `src/app/globals.css` — `@theme` overrides for `--font-sans` and related typography tokens.
- **Utilities**: `text-label` — composite utility for overlines and field labels.
- **Global**: `body` uses `font-sans antialiased` from the root layout.

When in doubt, match **sibling components** (see `.cursor/rules/styling-tailwind.mdc`).
