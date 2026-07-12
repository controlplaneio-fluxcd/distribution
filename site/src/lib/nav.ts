export interface NavLink {
  title: string;
  href: string;
  external?: boolean;
  description?: string;
  /* 24x24 stroke path rendered in the dropdown item tile */
  icon?: string;
}

export interface NavGroup {
  label?: string;
  items: NavLink[];
}

export interface NavMenu {
  title: string;
  groups: NavGroup[];
  /* Right-hand panel column: demo CTA, ControlPlane brand or Flux Operator card */
  aside?: 'demo' | 'brand' | 'operator';
}

export interface NavSection {
  title: string;
  items: NavLink[];
}

export const contactUrl = 'https://control-plane.io/contact/?inquiry=fluxcd';
export const githubUrl = 'https://github.com/controlplaneio-fluxcd/distribution';

/* Top navigation: two levels, Isovalent-style dropdown panels */
export const mainNav: NavMenu[] = [
  {
    title: 'Product',
    aside: 'demo',
    groups: [
      {
        items: [
          {
            title: 'Enterprise Distribution',
            href: '/distribution/',
            description: 'Harden your GitOps pipelines with zero-CVE Flux, built for regulated environments.',
            icon: 'M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3zm-3 9l2.2 2.2 4.3-4.6',
          },
          {
            title: 'Enterprise Addons',
            href: '/addons/',
            description: 'Give your teams full visibility over Flux, from live dashboards to AI assistants.',
            icon: 'M3.5 3.5h7v7h-7zM13.5 3.5h7v7h-7zM3.5 13.5h7v7h-7zM13.5 13.5h7v7h-7z',
          },
          {
            title: 'Pricing',
            href: '/pricing/',
            description: 'Predictable yearly plans that scale with your clusters, backed by 24/7 support.',
            icon: 'M20.6 13.4l-7.2 7.2a2 2 0 01-2.8 0L3 13V3h10l7.6 7.6a2 2 0 010 2.8zM7.5 7.5h.01',
          },
        ],
      },
    ],
  },
  {
    title: 'Resources',
    aside: 'operator',
    groups: [
      {
        items: [
          {
            title: 'Enterprise Documentation',
            href: '/distribution/overview/',
            icon: 'M4 19.5A2.5 2.5 0 016.5 17H20V3H6.5A2.5 2.5 0 004 5.5v14zm0 0A2.5 2.5 0 006.5 22H20',
          },
          {
            title: 'Flux Architecture',
            href: '/guides/flux-architecture/',
            icon: 'M12 2l9 5-9 5-9-5 9-5zm-9 10l9 5 9-5m-18 5l9 5 9-5',
          },
          {
            title: 'D1 Reference Architecture',
            href: '/guides/d1-architecture-reference/',
            icon: 'M6 3v12m12-9a3 3 0 11-6 0 3 3 0 016 0zM9 18a3 3 0 11-6 0 3 3 0 016 0zm9-9a9 9 0 01-9 9',
          },
          {
            title: 'D2 Reference Architecture',
            href: '/guides/d2-architecture-reference/',
            icon: 'M3 3h6v6H3zm12 12h6v6h-6zM6 9v3a3 3 0 003 3h6',
          },
        ],
      },
    ],
  },
  {
    title: 'Company',
    aside: 'brand',
    groups: [
      {
        items: [
          {
            title: 'About ControlPlane',
            href: 'https://control-plane.io/about/',
            external: true,
            icon: 'M6 22V4a2 2 0 012-2h8a2 2 0 012 2v18M10 8h.01M14 8h.01M10 12h.01M14 12h.01M10 16h.01M14 16h.01M2 22h20',
          },
          {
            title: 'Working Here',
            href: 'https://control-plane.io/working-here/',
            external: true,
            icon: 'M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2m16-18a4 4 0 010 7.75M22 21v-2a4 4 0 00-3-3.87M13 7a4 4 0 11-8 0 4 4 0 018 0z',
          },
          {
            title: 'Careers',
            href: 'https://control-plane.io/working-here/',
            external: true,
            icon: 'M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2M4 7h16a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V9a2 2 0 012-2z',
          },
          {
            title: 'Contact',
            href: 'https://control-plane.io/contact/',
            external: true,
            icon: 'M4 5h16a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1zm0 2l8 6 8-6',
          },
        ],
      },
    ],
  },
];

/* Docs sidebar, mirroring the mkdocs.yml nav tree */
export const docsNav: NavSection[] = [
  {
    title: 'Flux Distribution',
    items: [
      { title: 'Overview', href: '/distribution/overview/' },
      { title: 'Installation', href: '/distribution/install/' },
      { title: 'Upgrade', href: '/distribution/upgrade/' },
      { title: 'Security', href: '/distribution/security/' },
    ],
  },
  {
    title: 'Flux Addons',
    items: [
      { title: 'Dex IdP', href: '/addons/dex/' },
      { title: 'Local MCP Server', href: '/addons/mcp-stdio/' },
    ],
  },
  {
    title: 'Guides',
    items: [
      { title: 'Flux Architecture Overview', href: '/guides/flux-architecture/' },
      { title: 'D1 Reference Architecture', href: '/guides/d1-architecture-reference/' },
      { title: 'D2 Reference Architecture', href: '/guides/d2-architecture-reference/' },
      { title: 'Flux Multitenant Policies', href: '/guides/flux-policies/' },
      { title: 'Generic Helm Chart Pattern', href: '/guides/flux-generic-helm-chart/' },
      { title: 'Flux CLI Quick Reference', href: '/guides/flux-cli-quick-reference/' },
    ],
  },
  {
    title: 'Marketplaces',
    items: [{ title: 'AWS Marketplace', href: '/marketplace/aws/' }],
  },
  {
    title: 'Versions',
    items: [
      { title: 'Release v2.9', href: '/releases/release-v2.9/' },
      { title: 'Release v2.8', href: '/releases/release-v2.8/' },
      { title: 'Release v2.7', href: '/releases/release-v2.7/' },
      { title: 'Release v2.6', href: '/releases/release-v2.6/' },
      { title: 'Release v2.5', href: '/releases/release-v2.5/' },
      { title: 'Release v2.4', href: '/releases/release-v2.4/' },
      { title: 'Release v2.3', href: '/releases/release-v2.3/' },
      { title: 'Release v2.2', href: '/releases/release-v2.2/' },
    ],
  },
];
