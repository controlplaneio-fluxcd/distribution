import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const docsSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  /* hide: [toc] removes the on-page table of contents; nothing else is supported */
  hide: z.array(z.enum(['toc'])).optional(),
});

/* Both collections read markdown kept outside site/: /docs and the release
   notes in /releases (shared with the GitHub release process). Each gets its
   own narrow base — a single base of '..' would make the dev watcher ingest
   site/.astro and node_modules. The home, distribution and pricing pages are
   native Astro pages. */
const docs = defineCollection({
  loader: glob({
    base: '../docs',
    pattern: ['**/*.md', '!index.md', '!distribution/index.md', '!pricing/**', '!theme/**'],
    /* Keep the exact mkdocs URL paths — the default id slugifies away dots
       (release-v2.9 would become release-v29) */
    generateId: ({ entry }) => entry.replace(/\.md$/, ''),
  }),
  schema: docsSchema,
});

/* Ids carry the releases/ prefix so the URLs match the docs collection style */
const releases = defineCollection({
  loader: glob({
    base: '../releases',
    pattern: ['*.md'],
    generateId: ({ entry }) => `releases/${entry.replace(/\.md$/, '')}`,
  }),
  schema: docsSchema,
});

export const collections = { docs, releases };
