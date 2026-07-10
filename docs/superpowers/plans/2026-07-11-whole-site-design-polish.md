# Whole-Site Design Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Modernize the BetterDasmariñas site to a premium, cohesive finish by building one design system (tokens + primitives) and sweeping it across every surface — without changing identity, content, or layout.

**Architecture:** Refined design language lives in `src/index.css` (`@theme` tokens + a few utilities) and the `src/components/ui/` primitives. Each surface then adopts the tokens/primitives, replacing ad-hoc Tailwind classes. Pure visual refinement.

**Tech Stack:** React 19, TypeScript, Vite 7, Tailwind CSS v4 (`@theme`), `@bettergov/kapwa` design system, `lucide-react`, `cn()` = `clsx` + `tailwind-merge`.

## Global Constraints

- **Keep the butterfly / Paru-Paro theme** — hero butterflies (`Hero.tsx`) and decorations untouched.
- **Keep the blue + orange palette hues** — only shade usage/application may change. Tokens already defined in `src/index.css` (`--color-primary-*`, `--color-secondary-*`, `--color-accent-*`).
- **Keep all content and layout structure** — same sections, same order, same info. No restructuring, no added/removed sections.
- **Light mode only** — no dark mode.
- **Preserve all `prefers-reduced-motion` guards** in `src/index.css`.
- **No dependency changes** — there is no test runner in this project and we are NOT adding one. Verification is `npm run build` (`tsc -b && vite build`) + `npm run lint` + visual check via dev server.
- **`cn()` uses `tailwind-merge`** — later utility classes win, so passing e.g. `mb-0` in `className` overrides a primitive's default.
- Code style: single quotes, 2-space indent, trailing commas (ES5), 80-char width (Prettier enforces on commit via `lint-staged`).

**Verification note (applies to every task):** This is visual/CSS work with no unit-test framework. "Verify" steps run `npm run build` and `npm run lint`, and — for tasks that change rendered output — a dev-server visual check (`npm run dev`, open `http://localhost:5173`). Where a step states an expected rendered class string, confirm it by reading the component output / DOM in the browser devtools. Do NOT add a test runner.

---

### Task 1: Design tokens & utilities in `index.css`

**Files:**

- Modify: `src/index.css` (inside existing `@theme { ... }` block, after the color ramps ~line 87, and add utilities after line 115)

**Interfaces:**

- Produces: CSS custom properties + utility classes consumed by all later tasks:
  - `--radius-sm: 0.5rem; --radius-md: 0.75rem; --radius-lg: 1rem;`
  - `--shadow-sm`, `--shadow-md`, `--shadow-lg` (soft, layered, low-alpha)
  - `--ease-emphasized: cubic-bezier(0.16, 1, 0.3, 1);`
  - `--duration-fast: 150ms; --duration-base: 250ms; --duration-slow: 400ms;`
  - Utility classes `.shadow-soft-sm/.shadow-soft-md/.shadow-soft-lg` and `.card-surface`

- [ ] **Step 1: Add elevation, radius, and motion tokens to the `@theme` block**

In `src/index.css`, inside the existing `@theme { ... }` (after the `--color-gray-900` line, before `--animate-fade-in`), add:

```css
/* Elevation — soft, layered, low-alpha */
--shadow-soft-sm:
  0 1px 2px rgba(16, 24, 40, 0.04), 0 1px 3px rgba(16, 24, 40, 0.06);
--shadow-soft-md:
  0 2px 4px rgba(16, 24, 40, 0.04), 0 6px 16px rgba(16, 24, 40, 0.08);
--shadow-soft-lg:
  0 4px 8px rgba(16, 24, 40, 0.04), 0 16px 32px rgba(16, 24, 40, 0.1);

/* Radius scale */
--radius-sm: 0.5rem;
--radius-md: 0.75rem;
--radius-lg: 1rem;

/* Motion */
--ease-emphasized: cubic-bezier(0.16, 1, 0.3, 1);
--duration-fast: 150ms;
--duration-base: 250ms;
--duration-slow: 400ms;
```

- [ ] **Step 2: Add shadow + surface utility classes**

After the `@theme inline { ... }` block (after line ~115), add:

```css
/* ── Elevation utilities ─────────────────────────────────────── */
.shadow-soft-sm {
  box-shadow: var(--shadow-soft-sm);
}
.shadow-soft-md {
  box-shadow: var(--shadow-soft-md);
}
.shadow-soft-lg {
  box-shadow: var(--shadow-soft-lg);
}

/* Standard card surface — white bg, hairline border, soft elevation */
.card-surface {
  background-color: #ffffff;
  border: 1px solid var(--color-gray-200);
  box-shadow: var(--shadow-soft-md);
}
```

- [ ] **Step 3: Verify build + lint**

Run: `npm run build && npm run lint`
Expected: both succeed, no errors. (Tailwind v4 compiles `@theme` tokens; new utility classes are plain CSS.)

- [ ] **Step 4: Commit**

```bash
git add src/index.css
git commit -m "feat(design): add elevation, radius, and motion tokens"
```

---

### Task 2: Refine `Section` primitive (+ bug fix)

**Files:**

- Modify: `src/components/ui/Section.tsx`

**Interfaces:**

- Consumes: `cn` from `../../lib/utils`.
- Produces: `Section` component with props
  `{ children, className?, innerClassName?, id?, spacing?: 'compact'|'default'|'spacious', surface?: 'white'|'muted' }`.
  Default `spacing='default'`, `surface='white'`. Inner container is always `max-w-7xl mx-auto px-4 sm:px-6`.

- [ ] **Step 1: Rewrite `Section.tsx`**

Replace the entire file with:

```tsx
import { cn } from '../../lib/utils';

type SectionProps = {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  id?: string;
  spacing?: 'compact' | 'default' | 'spacious';
  surface?: 'white' | 'muted';
};

const spacingMap = {
  compact: 'py-10 md:py-12',
  default: 'py-12 md:py-16 lg:py-20',
  spacious: 'py-16 md:py-20 lg:py-24',
};

const surfaceMap = {
  white: 'bg-white',
  muted: 'bg-gray-50',
};

export default function Section({
  children,
  className,
  innerClassName,
  id,
  spacing = 'default',
  surface = 'white',
}: SectionProps) {
  return (
    <section
      className={cn(spacingMap[spacing], surfaceMap[surface], className)}
      id={id}
    >
      <div className={cn('max-w-7xl mx-auto px-4 sm:px-6', innerClassName)}>
        {children}
      </div>
    </section>
  );
}
```

Why: the old file applied `className` to BOTH the `<section>` and the inner
`<div>` (bug — a passed `bg-*` would land on both). Now `className` styles the
section, `innerClassName` the container. Backward compatible for existing callers
that pass layout utilities intended for the section.

- [ ] **Step 2: Check existing callers still render correctly**

Run: `git grep -n "<Section" -- src` to list callers. For each, confirm any
`className` previously relied on landing on the inner `<div>` (e.g. grid/flex on
the content) is moved to `innerClassName`. Most callers pass section-level
utilities (background, spacing) and need no change.

- [ ] **Step 3: Verify build + lint + visual**

Run: `npm run build && npm run lint`
Then `npm run dev`, open `http://localhost:5173`, confirm sections that use
`<Section>` keep their spacing/background and inner content is centered at
`max-w-7xl`.

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/Section.tsx
git commit -m "refactor(ui): add Section spacing/surface variants, fix duplicated className"
```

---

### Task 3: Refine `Heading` primitive

**Files:**

- Modify: `src/components/ui/Heading.tsx`

**Interfaces:**

- Consumes: `cn` from `../../lib/utils`.
- Produces: `Heading` component with props
  `{ level?: 1..6, children, className?, eyebrow?: string, spacing?: boolean }`.
  Default `spacing=true` (keeps existing `mb-4`), `eyebrow` optional.

- [ ] **Step 1: Rewrite `Heading.tsx`**

Replace the entire file with:

```tsx
import React from 'react';
import { cn } from '../../lib/utils';

interface HeadingProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  className?: string;
  eyebrow?: string;
  spacing?: boolean;
}

const headingStyles = {
  1: 'text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight',
  2: 'text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight leading-tight',
  3: 'text-xl md:text-2xl lg:text-3xl font-bold tracking-tight leading-snug',
  4: 'text-lg md:text-xl lg:text-2xl font-bold leading-snug',
  5: 'text-base md:text-lg lg:text-xl font-semibold leading-snug',
  6: 'text-sm md:text-base lg:text-lg font-semibold leading-snug',
};

export function Heading({
  level = 1,
  children,
  className,
  eyebrow,
  spacing = true,
}: HeadingProps) {
  const combinedClasses = cn(
    headingStyles[level],
    spacing && 'mb-4',
    className
  );

  const HeadingTag = `h${level}`;
  const heading = React.createElement(
    HeadingTag,
    { className: combinedClasses },
    children
  );

  if (!eyebrow) return heading;

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-primary-600 mb-2">
        {eyebrow}
      </p>
      {heading}
    </div>
  );
}
```

Why: replaces `leading-relaxed` (~1.6, too loose for display type) with
`leading-tight`/`leading-snug`, adds `tracking-tight` on large headings, makes
the bottom margin opt-out (`spacing={false}`), and adds an optional eyebrow.
Sizes are unchanged, so layout is preserved.

- [ ] **Step 2: Verify build + lint + visual**

Run: `npm run build && npm run lint`
Then `npm run dev`; confirm headings read tighter (less line gap) and existing
`<Heading>` callers keep their sizes and spacing.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/Heading.tsx
git commit -m "refactor(ui): tighten Heading leading, add eyebrow + opt-in margin"
```

---

### Task 4: Refine `Text` primitive (+ bug fix)

**Files:**

- Modify: `src/components/ui/Text.tsx`
- Check callers: `src/components/home/GovernmentActivitySection.tsx`, `src/pages/Document.tsx`, `src/pages/Services.tsx`, `src/pages/Government.tsx`, `src/components/home/ServicesSection.tsx`

**Interfaces:**

- Consumes: `cn` from `../../lib/utils`.
- Produces: `Text` with props `{ size?: 'sm'|'md'|'lg', transform?: 'none'|'uppercase'|'lowercase', className?, children }`. Renders a `<p>` with a real font-size class. No forced `mb-2`/`max-w-lg`.

- [ ] **Step 1: Rewrite `Text.tsx`**

Replace the entire file with:

```tsx
import { cn } from '../../lib/utils';

const sizeMap = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

const transformClasses = {
  none: '',
  uppercase: 'uppercase',
  lowercase: 'lowercase',
};

export function Text({
  size = 'md',
  transform = 'none',
  className = '',
  children,
}: {
  size?: 'sm' | 'md' | 'lg';
  transform?: 'none' | 'uppercase' | 'lowercase';
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <p className={cn(sizeMap[size], transformClasses[transform], className)}>
      {children}
    </p>
  );
}
```

Why: the old default `size="md"` produced the class `text-md`, which is NOT a
Tailwind font-size (no size was applied). `sizeMap` maps `md → text-base`. Also
removes the opinionated `mb-2 max-w-lg` defaults that broke some layouts.

- [ ] **Step 2: Restore spacing/width at call sites that relied on it**

Run: `git grep -n "<Text" -- src` (5 files listed above). For each `<Text>`,
if it visually needs the old bottom margin or max width, add `className="mb-2"`
and/or `className="max-w-lg"` explicitly. When unsure, check the rendering in the
dev server before/after.

- [ ] **Step 3: Verify build + lint + visual**

Run: `npm run build && npm run lint`
Then `npm run dev`; open the Services, Government, and home pages that use
`<Text>` and confirm paragraphs now have a proper font size and spacing looks
intentional.

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/Text.tsx src/components/home/GovernmentActivitySection.tsx src/pages/Document.tsx src/pages/Services.tsx src/pages/Government.tsx src/components/home/ServicesSection.tsx
git commit -m "fix(ui): map Text size to real font-size class, drop forced margins"
```

---

### Task 5: Add `Card` primitive

**Files:**

- Create: `src/components/ui/Card.tsx`

**Interfaces:**

- Consumes: `cn` from `../../lib/utils`.
- Produces: default-exported `Card` with props
  `{ children, className?, as?: 'div'|'article', interactive?: boolean, padding?: 'none'|'sm'|'md'|'lg' }`.
  Base = `.card-surface` (Task 1) + `rounded-[var(--radius-lg)]`. `interactive` adds hover elevation + border transition.

- [ ] **Step 1: Create `Card.tsx`**

```tsx
import React from 'react';
import { cn } from '../../lib/utils';

type CardProps = {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'article';
  interactive?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
};

const paddingMap = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export default function Card({
  children,
  className,
  as = 'div',
  interactive = false,
  padding = 'md',
}: CardProps) {
  return React.createElement(
    as,
    {
      className: cn(
        'card-surface rounded-[var(--radius-lg)]',
        paddingMap[padding],
        interactive &&
          'transition-shadow duration-[var(--duration-base)] ease-[var(--ease-emphasized)] hover:shadow-soft-lg',
        className
      ),
    },
    children
  );
}
```

- [ ] **Step 2: Verify build + lint**

Run: `npm run build && npm run lint`
Expected: succeeds. (Component unused so far — no visual change yet.)

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/Card.tsx
git commit -m "feat(ui): add Card primitive"
```

---

### Task 6: Add `Badge` primitive

**Files:**

- Create: `src/components/ui/Badge.tsx`

**Interfaces:**

- Consumes: `cn` from `../../lib/utils`.
- Produces: named-exported `Badge` with props
  `{ children, className?, tone?: 'primary'|'success'|'warning'|'neutral', dot?: boolean }`.
  Renders an inline pill.

- [ ] **Step 1: Create `Badge.tsx`**

```tsx
import { cn } from '../../lib/utils';

type BadgeProps = {
  children: React.ReactNode;
  className?: string;
  tone?: 'primary' | 'success' | 'warning' | 'neutral';
  dot?: boolean;
};

const toneMap = {
  primary: 'bg-primary-50 text-primary-700',
  success: 'bg-success-50 text-success-700',
  warning: 'bg-warning-50 text-warning-700',
  neutral: 'bg-gray-100 text-gray-700',
};

const dotMap = {
  primary: 'bg-primary-500',
  success: 'bg-success-500',
  warning: 'bg-warning-500',
  neutral: 'bg-gray-400',
};

export function Badge({
  children,
  className,
  tone = 'neutral',
  dot = false,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold',
        toneMap[tone],
        className
      )}
    >
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full', dotMap[tone])} />}
      {children}
    </span>
  );
}
```

- [ ] **Step 2: Verify build + lint**

Run: `npm run build && npm run lint`
Expected: succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/Badge.tsx
git commit -m "feat(ui): add Badge primitive"
```

---

### Task 7: Add `Button` primitive

**Files:**

- Create: `src/components/ui/Button.tsx`

**Interfaces:**

- Consumes: `cn` from `../../lib/utils`.
- Produces: default-exported `Button` with props extending
  `React.ButtonHTMLAttributes<HTMLButtonElement>` plus
  `{ variant?: 'primary'|'secondary'|'ghost'|'outline', size?: 'sm'|'md'|'lg' }`.
  Exports `buttonClasses(variant, size)` so links (`<Link>`/`<a>`) can reuse the same styles.

- [ ] **Step 1: Create `Button.tsx`**

```tsx
import React from 'react';
import { cn } from '../../lib/utils';

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline';
type Size = 'sm' | 'md' | 'lg';

const variantMap: Record<Variant, string> = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700',
  secondary: 'bg-secondary-500 text-white hover:bg-secondary-600',
  ghost: 'text-primary-700 hover:bg-primary-50',
  outline: 'border-2 border-current text-primary-700 hover:bg-primary-50',
};

const sizeMap: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
};

export function buttonClasses(variant: Variant = 'primary', size: Size = 'md') {
  return cn(
    'inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] font-bold transition-colors duration-[var(--duration-fast)] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
    variantMap[variant],
    sizeMap[size]
  );
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

export default function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button className={cn(buttonClasses(variant, size), className)} {...props}>
      {children}
    </button>
  );
}
```

- [ ] **Step 2: Verify build + lint**

Run: `npm run build && npm run lint`
Expected: succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/Button.tsx
git commit -m "feat(ui): add Button primitive + buttonClasses helper"
```

---

### Task 8: Sweep shared chrome — `Navbar` + `Footer`

**Files:**

- Modify: `src/components/layout/Navbar.tsx`
- Modify: `src/components/layout/Footer.tsx`

**Interfaces:**

- Consumes: tokens/utilities from Task 1; optionally `buttonClasses` (Task 7), `Badge` (Task 6).

**Mapping to apply (this and later sweep tasks use the same rules):**

- Ad-hoc shadows (`shadow`, `shadow-md`, `shadow-lg`, `shadow-2xl`) → `shadow-soft-sm/md/lg`.
- Card-like containers → `.card-surface` + `rounded-[var(--radius-lg)]`, or the `Card` primitive.
- Radius `rounded-lg`/`rounded-xl`/`rounded-2xl` on cards → `rounded-[var(--radius-lg)]`; small controls → `rounded-[var(--radius-md)]`.
- Raw `blue-*` used as brand → `primary-*`. Keep intentional non-brand accent colors.
- Button/CTA markup duplicating styles → `buttonClasses(...)` or `<Button>`.
- Status/label pills → `<Badge>`.
- Do NOT change structure, text, links, or the palette hues.

- [ ] **Step 1: Read and sweep `Navbar.tsx`**

Run: `git grep -n "shadow\|rounded\|blue-\|bg-white" -- src/components/layout/Navbar.tsx`
Apply the mapping above. Preserve all links, routes, mobile menu behavior, and i18n.

- [ ] **Step 2: Read and sweep `Footer.tsx`**

Same mapping. Preserve the visit counter, cost banner, Facebook link, and copyright.

- [ ] **Step 3: Verify build + lint + visual**

Run: `npm run build && npm run lint`
Then `npm run dev`; confirm the navbar and footer look cleaner (softer shadows,
consistent radii) with identical content, links, and responsive behavior.

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/Navbar.tsx src/components/layout/Footer.tsx
git commit -m "style(chrome): adopt design tokens in Navbar and Footer"
```

---

### Task 9: Sweep `Hero`

**Files:**

- Modify: `src/components/sections/Hero.tsx`

**Interfaces:**

- Consumes: tokens (Task 1), `buttonClasses` (Task 7), `Badge` (Task 6).

- [ ] **Step 1: Apply the mapping — DO NOT touch the butterflies**

Leave untouched: the `HeroButterfly` component, all `hero-butterfly*` SVGs/markup,
and the `VITE_BUTTERFLIES_ENABLED` block (lines ~149-181, ~321-583). Apply:

- Search card `shadow-2xl` (line ~631) → `shadow-soft-lg`; `rounded-2xl` → `rounded-[var(--radius-lg)]`.
- Two CTA links (lines ~605-618) → use `buttonClasses('secondary'/'outline', 'md')` via `className` (keep them as `<Link>`/`<a>`), OR keep bespoke but standardize radius to `rounded-[var(--radius-md)]`.
- "Rising" status pills (lines ~758-761) and project-modal status (line ~813-815) → `<Badge tone dot>`.
- Category tiles (lines ~688-708): radius → `rounded-[var(--radius-md)]`; hover uses `primary-*` (already does).
- Project modal container `rounded-2xl shadow-2xl` (line ~788) → `rounded-[var(--radius-lg)] shadow-soft-lg`; CTA button → `buttonClasses('primary','md')`.

- [ ] **Step 2: Verify build + lint + visual + motion**

Run: `npm run build && npm run lint`
Then `npm run dev`; confirm: butterflies still animate and fly away on hover;
the hero gradient/background parallax is unchanged; search + dropdown still work;
"What's Rising" cards and modal still open. Toggle OS "reduce motion" and confirm
animations stop.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/Hero.tsx
git commit -m "style(hero): adopt tokens for shadows, radii, badges, buttons"
```

---

### Task 10: Sweep home sections

**Files:**

- Modify: `src/components/home/CityGlanceSection.tsx`
- Modify: `src/components/home/HistorySection.tsx`
- Modify: `src/components/home/ServicesSection.tsx`
- Modify: `src/components/home/GovernmentActivitySection.tsx`
- Modify: `src/components/home/LeadershipSection.tsx`
- Modify: `src/components/home/ContactSection.tsx`

**Interfaces:**

- Consumes: `Section`/`Heading`/`Text` (Tasks 2-4), `Card` (Task 5), `Badge` (Task 6), `buttonClasses` (Task 7), tokens (Task 1).

- [ ] **Step 1: Establish section background rhythm**

For each section that renders its own `<section>`/wrapper, alternate the
background between white and `bg-gray-50` down the page so stacked sections read
with rhythm (e.g. CityGlance white → History muted → Services white →
GovernmentActivity muted → Leadership white → Contact muted). If a section uses
`<Section>`, pass `surface="muted"` where appropriate; otherwise set the wrapper
`bg-*` class. Do not reorder sections.

- [ ] **Step 2: Apply the card/shadow/radius/badge/button mapping per file**

For each file, run `git grep -n "shadow\|rounded\|<Text\|blue-" -- <file>` and
apply the Task 8 mapping. Convert bespoke card containers to `Card`, status/label
pills to `Badge`, and CTA markup to `buttonClasses`. Keep all content, images,
icons, `.reveal`/`.reveal-stagger` scroll animations, and the History section's
butterfly/cocoon decorations (`history-card-butterfly`, `history-card-cocoon`).

- [ ] **Step 3: Verify build + lint + visual (after each file, or in one pass)**

Run: `npm run build && npm run lint`
Then `npm run dev`; scroll the whole home page. Confirm: alternating backgrounds
read cleanly; cards share one shadow/radius language; scroll reveals still fire;
History decorations still animate; no content moved or disappeared.

- [ ] **Step 4: Commit**

```bash
git add src/components/home/
git commit -m "style(home): adopt tokens, cards, and section rhythm across home sections"
```

---

### Task 11: Sweep Services + Government listings

**Files:**

- Modify: `src/pages/Services.tsx`
- Modify: `src/pages/Government.tsx`

**Interfaces:**

- Consumes: `Section`/`Heading`/`Text`, `Card`, `Badge`, `buttonClasses`, tokens.

- [ ] **Step 1: Apply the mapping to both pages**

For each, run `git grep -n "shadow\|rounded\|<Text\|blue-\|grid" -- <file>` and
apply the Task 8 mapping. Category/page cards → `Card` with `interactive` for
hover elevation. Keep the category grid layout, breadcrumbs, search wiring, and
`VITE_GOVERNMENT_NAME` usage. Ensure any `<Text>` that lost `mb-2`/`max-w-lg`
gets it back explicitly where needed (see Task 4).

- [ ] **Step 2: Verify build + lint + visual**

Run: `npm run build && npm run lint`
Then `npm run dev`; open `/services` and `/government`; confirm the card grids
look consistent with the home cards, hover elevation is subtle, and navigation
into a category still works.

- [ ] **Step 3: Commit**

```bash
git add src/pages/Services.tsx src/pages/Government.tsx
git commit -m "style(pages): adopt tokens and Card in Services and Government listings"
```

---

### Task 12: Sweep `Document` viewer

**Files:**

- Modify: `src/pages/Document.tsx`

**Interfaces:**

- Consumes: `Section`/`Heading`/`Text`, `Card`, tokens. Uses `@tailwindcss/typography` `prose` classes for markdown.

- [ ] **Step 1: Apply the mapping + refine prose**

Run: `git grep -n "shadow\|rounded\|<Text\|blue-\|prose" -- src/pages/Document.tsx`.
Apply the Task 8 mapping to card/container/shadow/radius. For the markdown body,
ensure a consistent `prose` setup (e.g. `prose prose-gray max-w-none` with
`prose-headings:tracking-tight prose-a:text-primary-600`), matching the tightened
heading language. Keep breadcrumbs, the companion-JSON interpolation output, the
sticky table styling (`.sticky-table` in `index.css`), and all content.

- [ ] **Step 2: Verify build + lint + visual**

Run: `npm run build && npm run lint`
Then `npm run dev`; open a government document (e.g.
`/government/reports-and-statistics/infrastructure-projects`) and a service
document; confirm markdown renders with tidy typography, links are primary-blue,
tables still scroll with a sticky first column, and interpolated values appear.

- [ ] **Step 3: Commit**

```bash
git add src/pages/Document.tsx
git commit -m "style(document): adopt tokens and refine prose typography"
```

---

### Task 13: Final verification pass

**Files:** none (verification only)

- [ ] **Step 1: Full build + lint**

Run: `npm run build && npm run lint`
Expected: both clean.

- [ ] **Step 2: Cross-surface visual review**

`npm run dev`; walk: Home (all sections) → `/services` → a service document →
`/government` → the infrastructure-projects document. Confirm one consistent
shadow/radius/typography language across all of them.

- [ ] **Step 3: Guardrail audit**

Confirm, explicitly: butterfly theme intact (hero + history decorations animate);
blue+orange hues unchanged; every section's content and order unchanged; no dark
mode introduced; `prefers-reduced-motion` still disables animations (toggle OS
setting and re-check the hero).

- [ ] **Step 4: Confirm no stray diffs**

Run: `git status` and `git diff --stat main` — review the file list matches the
tasks above (tokens, primitives, chrome, hero, home, pages). Nothing unrelated.

- [ ] **Step 5: (Do not push)** Leave commits local for the user to review, per
      their standing instruction to check before pushing.

---

## Self-Review

**Spec coverage:**

- Tokens (type/spacing/elevation/radius/motion/color) → Task 1 (elevation/radius/motion) + Tasks 2-3 (type/spacing in primitives) + sweep tasks (color usage). ✓
- Primitives Section/Heading/Text (+ 2 bug fixes) → Tasks 2, 3, 4. ✓
- New Card/Badge/Button → Tasks 5, 6, 7. ✓
- Surface adoption order (chrome → hero → home → listings → document) → Tasks 8-12. ✓
- Verification (build/lint/visual/reduced-motion) → every task + Task 13. ✓
- Guardrails (theme, palette hues, structure, light-only, motion) → Global Constraints + Task 13 audit. ✓

**Placeholder scan:** No TBD/TODO. Sweep tasks (8-12) intentionally instruct the
implementer to read each file and apply an explicit, enumerated mapping rather
than pre-writing 15 files of diffs blind — the mapping rules and exact target
classes are concrete. Token/primitive tasks contain complete code.

**Type consistency:** `buttonClasses(variant, size)` defined in Task 7, consumed
by Tasks 8-11. `Card` (default export), `Badge` (named export), `Button` (default
export) — import styles are consistent with each task's usage. `Section` props
`spacing`/`surface`/`innerClassName` defined in Task 2, used in Task 10. `Heading`
`eyebrow`/`spacing` defined in Task 3. `Text` `sizeMap` (`md → text-base`) defined
in Task 4, callers updated in Tasks 4/11.
