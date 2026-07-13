import { defineMdastPlugin } from 'satteri';

/* Compatibility layer for the markdown files migrated from mkdocs-material.
   Handles, without rewriting the docs themselves:
     - relative `.md` links -> absolute directory URLs (mkdocs use_directory_urls)
     - external links -> target="_blank" rel="noopener"
     - relative image paths -> /images/... served from public/
     - `#only-light` / `#only-dark` image fragments -> theme-scoped classes
     - attribute lists `{ .md-button }`, `{ width="400" }` -> classes/attrs
     - icon shortcodes `:octicons-*:` etc. -> stripped
     - `> [!tip] Title` blockquote callouts -> styled admonition asides
     - `<div class="grid cards" markdown>` -> plain div (list styled via CSS)

   Each node's `data` has a single writer: the link/image visitors merge any
   trailing `{ ... }` attribute list themselves (visitors see a pre-pass
   snapshot, so two writers to the same property clobber each other). The
   text visitor only rewrites text values. */

/* Keep in sync with `site` in astro.config.mjs */
const SITE_ORIGIN = 'https://fluxcd.control-plane.io';
const ICON_RE = /:(?:octicons|material|fontawesome)-[a-z0-9-]+(?:\/[a-z0-9-]+)*:/g;
/* Attr lists made only of .classes and key="value" pairs, e.g. { .lg .middle } */
const ATTR_LIST_RE = /\{(?:\s*(?:[.#][\w-]+|[\w-]+="[^"]*"))+\s*\}/g;
const LEAD_ATTR_RE = /^\{([^}]*)\}[ \t]?/;
const CALLOUT_RE = /^\[!(\w+)\][ \t]*([^\n]*)(?:\n([\s\S]*))?$/;

function mdLinkToUrl(url, fileURL) {
  if (/^(?:[a-z]+:)?\/\//i.test(url) || url.startsWith('/') || url.startsWith('#')) return null;
  const m = url.match(/^([^#?]*\.md)(#.*)?$/);
  if (!m) return null;
  const [, path, hash = ''] = m;
  let target;
  if (fileURL) {
    const resolved = new URL(path, fileURL).pathname;
    const idx = resolved.lastIndexOf('/docs/');
    if (idx !== -1) target = resolved.slice(idx + '/docs'.length);
  }
  /* Fallback: pages live at directory URLs, one level deeper than their file */
  target ??= `../${path}`;
  return target.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '/') + hash;
}

function parseAttrList(body) {
  const props = {};
  const classes = [];
  let matched = false;
  for (const token of body.trim().split(/\s+(?=[.#]|[\w-]+=)/)) {
    const cls = token.match(/^\.([\w-]+)$/);
    const attr = token.match(/^([\w-]+)="([^"]*)"$/);
    if (cls) {
      classes.push(cls[1]);
      matched = true;
    } else if (attr) {
      props[attr[1]] = attr[2];
      matched = true;
    } else {
      return null;
    }
  }
  if (!matched) return null;
  if (classes.length > 0) props.className = classes;
  return props;
}

/* Attr list in the text node right after `node`, e.g. [x](y){ .md-button } */
function trailingAttrs(node, ctx) {
  const parent = ctx.parent(node);
  const idx = ctx.indexOf(node);
  if (!parent || idx === undefined) return null;
  const next = parent.children[idx + 1];
  if (next?.type !== 'text') return null;
  const lead = next.value.match(LEAD_ATTR_RE);
  return lead ? parseAttrList(lead[1]) : null;
}

function mergeProps(target, props) {
  for (const [key, val] of Object.entries(props)) {
    target[key] = key === 'className' ? [...(target.className ?? []), ...val] : val;
  }
  return target;
}

export default defineMdastPlugin({
  name: 'mkdocs-compat',

  link(node, ctx) {
    const props = {};
    if (/^https?:\/\//i.test(node.url) && !node.url.startsWith(SITE_ORIGIN)) {
      props.target = '_blank';
      props.rel = 'noopener';
    } else {
      const rewritten = mdLinkToUrl(node.url, ctx.fileURL);
      if (rewritten) ctx.setProperty(node, 'url', rewritten);
    }
    const attrs = trailingAttrs(node, ctx);
    if (attrs) mergeProps(props, attrs);
    if (Object.keys(props).length > 0) {
      ctx.setProperty(node, 'data', {
        ...node.data,
        hProperties: mergeProps({ ...node.data?.hProperties }, props),
      });
    }
  },

  image(node, ctx) {
    let url = node.url;
    const props = {};
    const theme = url.match(/#only-(light|dark)$/);
    if (theme) {
      url = url.slice(0, -theme[0].length);
      props.className = [`only-${theme[1]}`];
    }
    /* Docs reference diagrams as ../images/...; serve them from public/images */
    const img = url.match(/^(?:\.\.\/)+(images\/.+)$/);
    if (img) url = `/${img[1]}`;
    if (url !== node.url) ctx.setProperty(node, 'url', url);
    const attrs = trailingAttrs(node, ctx);
    if (attrs) mergeProps(props, attrs);
    if (Object.keys(props).length > 0) {
      ctx.setProperty(node, 'data', {
        ...node.data,
        hProperties: mergeProps({ ...node.data?.hProperties }, props),
      });
    }
  },

  text(node, ctx) {
    let value = node.value;

    /* Attr list applying to the previous sibling: the link/image visitors
       merge it into their own node; here we only trim the text (and handle
       strong, which has no other data writer). */
    const lead = value.match(LEAD_ATTR_RE);
    if (lead) {
      const props = parseAttrList(lead[1]);
      const idx = ctx.indexOf(node);
      const parent = ctx.parent(node);
      const prev = idx !== undefined && idx > 0 ? parent?.children[idx - 1] : undefined;
      if (props && prev && ['link', 'image', 'strong'].includes(prev.type)) {
        if (prev.type === 'strong') {
          ctx.setProperty(prev, 'data', {
            ...prev.data,
            hProperties: mergeProps({ ...prev.data?.hProperties }, props),
          });
        }
        value = value.slice(lead[0].length);
      }
    }

    /* Icon shortcodes and orphaned attr lists render as plain text otherwise */
    value = value.replace(ICON_RE, '').replace(ATTR_LIST_RE, '');
    if (value !== node.value) {
      ctx.setProperty(node, 'value', value.replace(/^[ \t]+/, ''));
    }
  },

  blockquote(node, ctx) {
    const first = node.children?.[0];
    if (first?.type !== 'paragraph') return;
    const head = first.children?.[0];
    if (head?.type !== 'text') return;
    const m = head.value.match(CALLOUT_RE);
    if (!m) return;
    const [, kind, rawTitle, rest] = m;
    const type = kind.toLowerCase();
    const title = rawTitle.trim() || type.charAt(0).toUpperCase() + type.slice(1);

    const body = [];
    const tail = [...first.children.slice(1)];
    if (rest || tail.length > 0) {
      const children = rest ? [{ type: 'text', value: rest }, ...tail] : tail;
      body.push({ type: 'paragraph', children });
    }
    body.push(...node.children.slice(1));

    ctx.replaceNode(node, {
      type: 'blockquote',
      data: { hName: 'aside', hProperties: { className: ['admonition', type] } },
      children: [
        {
          type: 'paragraph',
          data: { hName: 'p', hProperties: { className: ['admonition-title'] } },
          children: [{ type: 'text', value: title }],
        },
        ...body,
      ],
    });
  },

  html(node, ctx) {
    /* mkdocs md_in_html marker attribute is meaningless here */
    if (node.value.includes(' markdown')) {
      ctx.setProperty(node, 'value', node.value.replace(/<div([^>]*?) markdown(="[^"]*")?>/g, '<div$1>'));
    }
  },
});
