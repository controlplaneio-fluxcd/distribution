import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/* The docs collection reads the markdown files kept at the repo root: /docs
   plus the release notes in /releases (shared with the GitHub release process).
   The home, distribution and pricing pages are native Astro pages. */
const docs = defineCollection({
  loader: glob({
    base: '..',
    pattern: [
      'docs/**/*.md',
      'releases/*.md',
      '!docs/index.md',
      '!docs/distribution/index.md',
      '!docs/pricing/**',
      '!docs/theme/**',
    ],
    /* Strip the docs/ prefix and keep the exact mkdocs URL paths — the default
       id slugifies away dots (release-v2.9 would become release-v29) */
    generateId: ({ entry }) => entry.replace(/^docs\//, '').replace(/\.md$/, ''),
  }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    /* hide: [toc] removes the on-page table of contents; nothing else is supported */
    hide: z.array(z.enum(['toc'])).optional(),
  }),
});

export const collections = { docs };
