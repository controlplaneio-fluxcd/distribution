import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import sitemap from '@astrojs/sitemap';
import mkdocsCompat from './src/lib/satteri-mkdocs-compat.mjs';

/* Redirects preserved from mkdocs.yml plugins.redirects.redirect_maps.
   The Flux Operator and MCP Server docs moved to fluxoperator.dev. */
const redirects = {
  '/operator': 'https://fluxoperator.dev/',
  '/operator/install': 'https://fluxoperator.dev/docs/guides/install/',
  '/operator/flux-config': 'https://fluxoperator.dev/docs/instance/controllers/',
  '/operator/flux-sync': 'https://fluxoperator.dev/docs/instance/sync/',
  '/operator/flux-kustomize': 'https://fluxoperator.dev/docs/instance/customization/',
  '/operator/flux-sharding': 'https://fluxoperator.dev/docs/instance/sharding/',
  '/operator/monitoring': 'https://fluxoperator.dev/docs/instance/monitoring/',
  '/operator/flux-bootstrap-migration': 'https://fluxoperator.dev/docs/guides/migration/',
  '/operator/fluxinstance': 'https://fluxoperator.dev/docs/crd/fluxinstance/',
  '/operator/fluxreport': 'https://fluxoperator.dev/docs/crd/fluxreport/',
  '/operator/resourceset': 'https://fluxoperator.dev/docs/crd/resourceset/',
  '/operator/resourcesetinputprovider': 'https://fluxoperator.dev/docs/crd/resourcesetinputprovider/',
  '/operator/cli': 'https://fluxoperator.dev/docs/guides/cli/',
  '/operator/resourcesets/introduction': 'https://fluxoperator.dev/docs/resourcesets/introduction/',
  '/operator/resourcesets/app-definition': 'https://fluxoperator.dev/docs/resourcesets/app-definition/',
  '/operator/resourcesets/time-based-delivery': 'https://fluxoperator.dev/docs/resourcesets/time-based-delivery/',
  '/operator/resourcesets/image-automation': 'https://fluxoperator.dev/docs/resourcesets/image-automation/',
  '/operator/resourcesets/github-pull-requests': 'https://fluxoperator.dev/docs/resourcesets/github-pull-requests/',
  '/operator/resourcesets/gitlab-merge-requests': 'https://fluxoperator.dev/docs/resourcesets/gitlab-merge-requests/',
  '/mcp': 'https://fluxoperator.dev/mcp-server/',
  '/mcp/install': 'https://fluxoperator.dev/docs/mcp/install/',
  '/mcp/config': 'https://fluxoperator.dev/docs/mcp/config/',
  '/mcp/prompt-engineering': 'https://fluxoperator.dev/docs/mcp/prompting/',
  '/mcp/instructions': 'https://fluxoperator.dev/docs/mcp/instructions/',
  '/mcp/config-api': 'https://fluxoperator.dev/docs/mcp/config/',
  '/mcp/tools': 'https://fluxoperator.dev/docs/mcp/tools/',
  '/mcp/prompts': 'https://fluxoperator.dev/docs/mcp/prompts/',
};

export default defineConfig({
  site: 'https://fluxcd.control-plane.io',
  trailingSlash: 'ignore',
  redirects,
  integrations: [sitemap()],
  markdown: {
    processor: satteri({
      mdastPlugins: [mkdocsCompat],
      /* Smart punctuation would rewrite mkdocs attr lists ({ .md-button--primary },
         { width="400" }) before the compat plugin can parse them */
      features: { smartPunctuation: false },
    }),
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    },
  },
});
