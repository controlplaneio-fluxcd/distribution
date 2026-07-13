import { getCollection } from 'astro:content';

export interface Release {
  version: string;
  major: number;
  minor: number;
  href: string;
}

/* Every releases/release-v*.md at the repo root becomes an entry here,
   sorted newest first. Feeds the home hero pill and the docs sidebar
   Versions list, so a new release markdown needs no site edits. */
export async function getReleases(): Promise<Release[]> {
  const entries = await getCollection('docs', ({ id }) => id.startsWith('releases/release-v'));
  return entries
    .map(({ id }) => {
      const version = id.replace('releases/release-', '');
      const [major = 0, minor = 0] = version.slice(1).split('.').map(Number);
      return { version, major, minor, href: `/releases/release-${version}/` };
    })
    .sort((a, b) => b.major - a.major || b.minor - a.minor);
}
