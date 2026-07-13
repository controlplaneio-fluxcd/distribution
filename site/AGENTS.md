# AGENTS.md

Guidance for AI coding agents working on this Astro site. The site is the
public website for ControlPlane Enterprise for Flux CD, published at
https://fluxcd.control-plane.io on GitHub Pages.

## Commands

Run all npm/npx commands from the `site/` directory.

```sh
npm install          # Node >= 20 required
npm run dev          # dev server on http://localhost:4321
npx astro check      # type-check .astro/.ts files
npm run build        # astro build + pagefind index over dist/
```

Verification bar: `npx astro check && npm run build` must finish with
**0 errors, 0 warnings, 0 hints**. Hints count as failures; fix everything
before reporting a change as done.

## Layout

- `src/pages/index.astro`, `distribution/`, `addons/`, `pricing/` — native
  Astro marketing pages.
- `src/pages/[...slug].astro` — renders the docs collection.
- `src/content.config.ts` — the `docs` collection reads markdown from the
  repo-root `../docs` directory (releases, guides, addons, marketplace).
  Entry ids keep the exact mkdocs URL paths, including dots (`release-v2.9`).
- `src/lib/nav.ts` — header/footer/docs-sidebar navigation data plus
  `contactUrl`. The docs sidebar Versions list is maintained by hand and must
  be extended when a new `docs/releases/release-v*.md` lands. Only the home
  page hero pill derives the latest release automatically (from the
  collection, sorted by major/minor).
- `src/lib/satteri-mkdocs-compat.mjs` — markdown compat layer for mkdocs
  syntax used in `docs/` (attr lists, admonitions). Its `SITE_ORIGIN` must
  stay in sync with `site` in `astro.config.mjs`.
- `src/layouts/BaseLayout.astro` (marketing) and `DocsLayout.astro` (docs).
- `src/components/` — `Header`, `Footer`, `Search` (pagefind), `ThemeToggle`,
  and the shared marketing pieces: `ProductHero` (navy product hero),
  `CtaBand` (navy CTA section), `HeroShapes` (floating Flux-triangle motifs
  for navy surfaces).
- `src/styles/global.css` — design tokens and the shared marketing shell.
- `og-templates/` — HTML template used to produce the static OG image.

## Conventions

### Theming and no-JS resilience

- Marketing pages pass `forcedTheme="light"` to BaseLayout; docs pages keep
  the light/dark toggle.
- The inline head script in BaseLayout adds a `js` class to `<html>` before
  applying the theme. Anything that only works with JavaScript needs a
  `html:not(.js)` CSS fallback (see the mobile nav in Header.astro and the
  sidebar in DocsLayout.astro). Light-theme tokens are duplicated on the bare
  `:root` so pages render styled even when no script runs.
- Respect `prefers-reduced-motion` for any animation.

### CSS

- Use the tokens in `global.css` (`--navy-950/900/800`, `--navy-line`,
  `--brand`, `--brand-light`, `--shadow-navy`, `--text-display`, `--text-h2`,
  `--section-pad`, ...) instead of hardcoding values.
- The editorial row shell (`.rows`, `.row`, `.flip`, `.points`, `.row-lead`,
  `.row-more`, `.hero-button`, `.hero-link`) lives in `global.css` and is
  shared by the marketing pages; page-local `<style>` blocks only carry
  overrides. Note that Astro scoped selectors compile with a
  `[data-astro-cid-*]` attribute, so a scoped rule beats a global single-class
  rule even inside media queries.

### Copy

- No em dashes, no exclamation marks, no ellipsis abuse, and no
  "Not just X, but Y" constructions anywhere in rendered copy.
- British spelling for "organisations".
- Do not overstate claims: ControlPlane employs several of the Flux core
  maintainers, not all of them. Customers are described by segment
  (financial services, Fortune 500, government), never by name or logo.
- Each hard product claim (CVE SLA, FIPS, SLSA, CRA, etc.) lives in exactly
  one section per page; do not repeat the same proof point across sections.

### Code style

- Comments state constraints the code cannot show (sync requirements,
  workarounds, browser quirks). No narration of what the next line does.
- TypeScript strictness is enforced by `astro check`; type optional data
  explicitly (e.g. `| undefined`) and guard conditional renders.

## Deployment

`.github/workflows/docs.yaml` builds the site and publishes to GitHub Pages,
but only on `docs*` branches and `v*` tags. Feature branches do not publish.
`public/CNAME` pins the custom domain.
