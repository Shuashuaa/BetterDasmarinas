# Whole-Site Design Polish — Design Spec

**Date:** 2026-07-11
**Status:** Approved (design), pending implementation plan
**Type:** Visual polish / modernization (not a redesign)

## Goal

Modernize the BetterDasmariñas site to a premium, cohesive finish without
changing its identity, content, or layout. Establish one design system
(tokens + primitives), then sweep it across every surface.

## Guardrails (hard constraints)

- **Keep the butterfly / Paru-Paro theme** — hero butterflies and decorations stay.
- **Keep the blue + orange palette** — hues unchanged; only shade usage and
  application may be refined.
- **Keep all content and layout structure** — same sections, same order, same
  information. Visual refinement only; no restructuring, no new/removed sections.
- **Light mode only** — the existing `ThemeSelector` controls typography themes,
  not dark mode. Dark mode is out of scope.
- **Preserve accessibility** — all `prefers-reduced-motion` guards remain intact.

## Non-Goals (YAGNI)

- No dark mode.
- No new pages or features.
- No content rewrites.
- No dependency changes or framework migration.
- No unrelated refactors beyond what the polish touches.

## Approach

Approach A — **design tokens + primitives first, then per-surface adoption**.
One refined design language lives in `src/index.css` (`@theme`) and the `ui/`
primitives, so improvements propagate and stay consistent. Every surface then
adopts the tokens/primitives, replacing ad-hoc Tailwind classes.

## Design Dimensions

All four dimensions are in scope: typography & spacing, color & depth, motion &
interaction, layout & components.

### 1. Tokens (`src/index.css` `@theme`)

- **Typography**
  - Headings currently use `leading-relaxed` (~1.6) — too loose for display
    type. Move to `leading-tight` / `leading-snug` by level.
  - Decouple bottom margin from the `Heading` component (baked-in `mb-4` on
    every level fights layouts). Margin becomes opt-in.
  - Keep the Kapwa sans/mono font stack.
- **Spacing / rhythm**
  - Section vertical padding scale: major sections `py-16 md:py-20 lg:py-24`;
    a compact variant for dense areas.
  - Unify the content container to `max-w-7xl` (Hero already uses this; some
    sections use Tailwind `container`).
- **Elevation**
  - Soft, layered shadow tokens (sm / md / lg) using low-alpha ambient + key
    shadows. Replace heavy `shadow-2xl` usages (e.g. Hero search card).
- **Radius**
  - Standardize: sm 8px / md 12px / lg 16px. Cards use lg. Replaces the current
    mix of `rounded-lg` / `rounded-xl` / `rounded-2xl`.
- **Motion**
  - Duration/easing tokens (150 / 250 / 400 ms; `cubic-bezier(.16,1,.3,1)`).
    Reuse the existing `.reveal` / `.reveal-stagger` utilities. All
    reduced-motion guards preserved.
- **Color usage**
  - Map ad-hoc `blue-600` / raw grays to the existing `primary` / `gray`
    token ramps. Define surface tokens (page `gray-50` vs card `white`) and a
    consistent border token. Palette hues unchanged.

### 2. Primitives (`src/components/ui/`)

- **Section** — add spacing variants and an optional alternating background
  (`white` ↔ `gray-50`) so stacked sections gain rhythm.
  - **Bug fix:** `className` is currently applied to both the `<section>` and the
    inner `<div>` (`Section.tsx:12-13`). Split into distinct `className` /
    inner-class handling so a passed background/utility isn't duplicated.
- **Heading** — tighter leading, opt-in margin, optional eyebrow/kicker prop.
- **Text** — **Bug fix:** default `size="md"` renders the class `text-md`, which
  is not a Tailwind font-size (no size is applied today). Replace with a proper
  size map (`sm`/`base`/`lg`). Drop the forced `max-w-lg` and `mb-2` defaults
  (too opinionated; they break some layouts).
- **New primitives** — `Card`, `Badge`/`Pill`, `Button`, to unify repeated
  ad-hoc styles (Hero CTAs, status pills, category tiles, project modal).

### 3. Surface Adoption (sweep order)

1. Shared chrome: `Navbar`, `Footer`
2. `Hero`
3. Home sections: `CityGlanceSection`, `HistorySection`, `ServicesSection`,
   `GovernmentActivitySection`, `LeadershipSection`, `ContactSection`
   (and `RisingDasmarinasSection` if wired in)
4. Listings: Services, Government
5. `Document` viewer

Each surface swaps ad-hoc classes for tokens/primitives and applies alternating
section backgrounds for rhythm. No content or structural changes.

## Components / Files Touched (anticipated)

- `src/index.css` — token definitions, shadow/radius/motion utilities.
- `src/components/ui/Section.tsx`, `Heading.tsx`, `Text.tsx` — refine + bug fixes.
- `src/components/ui/Card.tsx`, `Badge.tsx`, `Button.tsx` — new primitives.
- `src/components/layout/Navbar.tsx`, `Footer.tsx` — adopt tokens/primitives.
- `src/components/sections/Hero.tsx` — adopt tokens (butterflies untouched).
- `src/components/home/*.tsx` — adopt tokens/primitives.
- Services / Government listing pages and `src/pages/Document.tsx` — adopt tokens.

## Testing / Verification

- `npm run build` (TypeScript check + Vite build) passes clean.
- `npm run lint` passes clean.
- Drive the dev server (run skill) on the home page and at least one inner page
  (a Services or Government document) to confirm the polish reads correctly.
- Confirm `prefers-reduced-motion` still disables the butterfly/hero/reveal
  animations.
- Manual visual check that palette hues, butterfly theme, and section
  content/order are unchanged.

## Risks & Mitigations

- **Regression from primitive bug fixes** (Text/Section) — these change rendered
  output. Mitigation: sweep call sites when adjusting the primitive; verify each
  affected surface visually.
- **Inconsistent adoption** — mitigated by doing tokens/primitives first and
  sweeping in a fixed order.
- **Scope creep toward redesign** — mitigated by the guardrails; any change that
  alters content, structure, hue identity, or the butterfly theme is out of scope.

## Open Questions

None. Guardrails and scope confirmed with the user.
