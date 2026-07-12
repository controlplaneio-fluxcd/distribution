export interface NavLink {
  title: string;
  href: string;
  external?: boolean;
  description?: string;
}

export interface NavMenu {
  title: string;
  items: NavLink[];
}

export interface NavSection {
  title: string;
  items: NavLink[];
}

export const contactUrl = 'https://control-plane.io/contact/?inquiry=fluxcd';
export const githubUrl = 'https://github.com/controlplaneio-fluxcd/distribution';

/* Top navigation: two levels, Isovalent-style dropdown menus */
export const mainNav: NavMenu[] = [
  {
    title: 'Product',
    items: [
      {
        title: 'Enterprise Distribution',
        href: '/distribution/',
        description: 'Hardened, FIPS-compliant Flux controllers with zero CVEs',
      },
      {
        title: 'Enterprise Addons',
        href: '/addons/',
        description: 'Flux Web UI, MCP Server and Dex single sign-on',
      },
      {
        title: 'Pricing',
        href: '/pricing/',
        description: 'Subscription plans and enterprise support services',
      },
    ],
  },
  {
    title: 'Resources',
    items: [
      { title: 'Enterprise Distribution Docs', href: '/distribution/overview/' },
      { title: 'Flux Architecture', href: '/guides/flux-architecture/' },
      { title: 'D1 Reference Architecture', href: '/guides/d1-architecture-reference/' },
      { title: 'D2 Reference Architecture', href: '/guides/d2-architecture-reference/' },
      { title: 'Flux Operator Docs', href: 'https://fluxoperator.dev/docs/guides/install/', external: true },
      { title: 'Flux Web UI Docs', href: 'https://fluxoperator.dev/docs/web-ui/standalone-install/', external: true },
      { title: 'Flux Schema Catalog', href: 'https://schemas.fluxoperator.dev/', external: true },
    ],
  },
  {
    title: 'Company',
    items: [
      { title: 'About ControlPlane', href: 'https://control-plane.io/about/', external: true },
      { title: 'Working Here', href: 'https://control-plane.io/working-here/', external: true },
      { title: 'Careers', href: 'https://control-plane.io/working-here/', external: true },
      { title: 'Contact', href: 'https://control-plane.io/contact/', external: true },
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
