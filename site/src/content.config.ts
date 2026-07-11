import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/* The docs collection reads the markdown files kept at the repo root /docs.
   The home, distribution and pricing pages are native Astro pages. */
const docs = defineCollection({
  loader: glob({
    base: '../docs',
    pattern: ['**/*.md', '!index.md', '!distribution/index.md', '!pricing/**', '!theme/**'],
    /* Keep the exact mkdocs URL paths — the default id slugifies away dots
       (release-v2.9 would become release-v29) */
    generateId: ({ entry }) => entry.replace(/\.md$/, ''),
  }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    /* mkdocs-material style: hide "toc" or "navigation" on a page */
    hide: z.array(z.string()).optional(),
  }),
});

export const collections = { docs };
