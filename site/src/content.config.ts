import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

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
    /* hide: [toc] removes the on-page table of contents; nothing else is supported */
    hide: z.array(z.enum(['toc'])).optional(),
  }),
});

export const collections = { docs };
