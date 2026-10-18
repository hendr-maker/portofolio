# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## What this is

Personal portfolio for Hendra Rukmana: a single-page highlight reel of projects in the sibling folders of `../`. Next.js 16 App Router + React 19 + Tailwind v4 + shadcn/ui (`base-nova` style on Base UI, lucide icons), TypeScript strict, **static export** (`output: "export"` → `out/`). pnpm.

## Commands

```bash
pnpm dev                                          # http://localhost:3000
pnpm exec next typegen && pnpm exec tsc --noEmit  # route types (PageProps<...>) are generated, run typegen first
pnpm lint
pnpm build                                        # static site in out/
pnpm e2e                                          # build + Playwright (installed Chrome, desktop + 390px mobile)
pnpm exec playwright test -g "404"                # single test (needs an existing out/)
```

Definition of done: typegen + tsc, lint, and `pnpm e2e` all green.

## Architecture

- `lib/projects.ts`: **all project data**. Each project is a case study (`context`, `role`, `solution`, `features`, `impact`, `stack`, optional `client`) plus a `view` with any of `app` (sidebar app with screens made of blocks: stats, table, bars, kanban, form, timeline, progress), `api` (Swagger-style explorer), `flow` (workflow diagram), `cli` (console). Backend-only projects use `api`/`flow`/`cli` instead of `app`. Groups: `current` (case studies), `earlier` (client work, **generic sector names only**), `personal`. `moreWork` lists small engagements without detail pages.
- `lib/content.ts`: profile, experience, skills, UI labels, `seo`, and URL helpers: `pagePath(lang, slug?)` (always ends with `/`), `href()` (adds `basePath`), `abs()` (absolute URL with `siteUrl`). Every user-facing string is `{ en, id }`.
- `components/views.tsx` renders the views and the card `Preview` (app thumbnails show only the first 2 blocks). It is plain server markup on purpose: no client components (no shadcn Table/Progress), so nothing is hydrated or serialized twice into the RSC payload. Import `cn` from the `cn` package directly; `Portfolio.tsx` (home), `ProjectDetail.tsx` (detail, metadata, tabs for each view), `SiteShell.tsx` (header/footer).
- Internal links are plain `<a href={href(pagePath(...))}>`, not `next/link`. Next 16.4's export writes segment prefetch files as `__next.x/__PAGE__.txt` while the client requests `__next.x.__PAGE__.txt`, so `<Link>` prefetches 404. A static multi-page site doesn't need client routing.
- Language: `pnpm build` runs `scripts/set-lang.mjs` after `next build` to rewrite `<html lang>` to `id` under `out/id/`, because there is one root layout. An inline script in `app/layout.tsx` sends a first visit to the English home with an Indonesian browser (`navigator.language`) to `/id/`. A click on any `a[hreflang]` toggle is saved in `localStorage.lang` and always wins. Project pages are never redirected.
- Security: production pages carry a CSP `<meta>` (static hosting can't send headers; `'unsafe-inline'` is needed for Next's inline bootstrap) and a referrer policy. JSON-LD goes through `ldJson()`, which escapes `<`.
- Layout: only global config (`next.config.ts`, `playwright.config.ts`) lives at the root; code goes in `app/`, `components/`, `lib/`, tests in `e2e/`.
- Routes: `/`, `/projects/[slug]/`, `/id/`, `/id/projects/[slug]/` (`generateStaticParams`, `dynamicParams = false`), plus `not-found.tsx` (becomes `404.html`), `error.tsx` and `global-error.tsx`. Error UIs never render `error.message` or stacks.
- SEO: snippet copy in `seo` (titles ≤60, descriptions 150–160 chars). All canonical/hreflang/OG URLs are built with `abs()`. The OG image is a static `public/og.png` via `ogImage`. A page-level `openGraph` drops a file-based `opengraph-image`, which is also emitted without an extension. JSON-LD is one `@graph`: `Person` + `WebSite` (home), `CreativeWork` + `BreadcrumbList` (detail). `sitemap.ts`/`robots.ts` are `force-static`.
- Skills: items in `skillIcons` (`lib/skill-icons.ts`, server-only: never import it from `lib/content.ts`, which client `app/error.tsx` bundles) render as a brand-colored logo (near-black/white brands fall back to currentColor) via `<use>` into the static sprite `app/skill-icons.svg/route.ts`, so SVG paths aren't repeated in HTML + RSC payload. Icons: `simple-icons`, plus `@iconify-json/devicon-plain` for the Microsoft/Amazon marks simple-icons dropped. Names show as a hover tooltip (`sr-only` on mobile); the rest stay text pills.
- Styling: shadcn semantic tokens in `app/globals.css`; dark mode follows `prefers-color-scheme`. Animations are plain CSS (`.hero-grid`, `.hero-glow`, `.reveal`, `.pulse-dot`, `.grow-bar`, plus `tw-animate-css`), all disabled under `prefers-reduced-motion`. `buttonVariants()` doesn't merge conflicting classes; use `cn(buttonVariants(...), "...")`.

## Deploy (GitHub Pages)

`.github/workflows/deploy.yml` builds on push to `main`. `actions/configure-pages` supplies `NEXT_PUBLIC_BASE_PATH` (empty for a `<user>.github.io` repo, `/<repo>` otherwise) and `NEXT_PUBLIC_SITE_URL`, and `next.config.ts` reads the base path. `trailingSlash: true` emits `x/index.html`, so Pages resolves every route. `public/.nojekyll` keeps `_next/` from being stripped. Repo settings: Pages source must be "GitHub Actions"; free Pages needs a public repo.

## Constraints

- Static export: don't use features that need a server (route handlers, `cookies()`/`headers()`, ISR, middleware, `next/image` optimization). `cacheComponents`/PPR break `output: "export"` and were removed on purpose.
- **Confidentiality:** employer projects appear under generic product names only, and earlier clients under generic sector names. Never put internal codenames, client names, hostnames, IPs, tenant/vendor details, screenshots or secrets into content, code comments or docs (this repo is public). The e2e test enforces it with a blocklist in the gitignored `e2e/forbidden.local.txt` (one regex term per line); keep that file local.
- Claims must be sourced from the project repos or `../rewriter/CV-DRAFT-EN.md` / `CV-DRAFT-EN.detailed.bak.md`. Never use figures marked `[EST]`; don't invent metrics. View data (screens, numbers in mockups) is illustrative and must stay obviously fake.
- Phone number and email are deliberately omitted from the public site; contact is GitHub + LinkedIn only.
