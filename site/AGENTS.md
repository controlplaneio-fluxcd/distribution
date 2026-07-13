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
  repo root: `../docs` (guides, addons, marketplace) plus the release notes
  in `../releases`, which are shared with the GitHub release process.
  Entry ids keep the exact mkdocs URL paths, including dots (`release-v2.9`).
- `src/lib/nav.ts` — header/footer/docs-sidebar navigation data plus
  `contactUrl`.
- `src/lib/releases.ts` — lists the release notes from the collection,
  newest first. Feeds the home hero pill and the docs sidebar Versions
  list, so a new `releases/release-v*.md` shows up with no site edits.
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

## Adding a new guide

1. Create `docs/guides/<slug>.md` (repo root, not under `site/`) with the
   frontmatter the collection schema requires:

   ```yaml
   ---
   title: Flux Something Guide
   description: One-line summary used for meta tags and search
   ---
   ```

   Start the body with a single `#` H1. mkdocs syntax (admonitions,
   `{ .md-button }` attr lists) is supported via the compat plugin.
   Optional `hide: [toc]` removes the on-page table of contents.
2. The page is published automatically at `/guides/<slug>/` and indexed by
   pagefind; no route or config changes needed.
3. Add a sidebar entry to the Guides section of `docsNav` in
   `src/lib/nav.ts`. The sidebar is hand-curated on purpose: pick the title
   and position deliberately. Only the Versions list is generated.
4. Images: add the file to `site/public/images/` and reference it as
   `../images/<file>.png`; the mkdocs compat plugin rewrites that to
   `/images/...` at build time. GitHub's markdown preview will not
   resolve these paths; only the published site renders them.
5. Verify with `npx astro check && npm run build` and check the page and
   its sidebar entry in the built output.

## Deployment

`.github/workflows/docs.yaml` builds the site and publishes to GitHub Pages,
but only on `docs*` branches and `v*` tags. Feature branches do not publish.
`public/CNAME` pins the custom domain.
