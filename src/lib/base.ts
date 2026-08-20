// GitHub Pages serves this site as a project page under a repo-name
// sub-path (see astro.config.mjs's `base`) — Astro only prefixes `base`
// onto URLs it generates itself (its own asset/sitemap output);
// hand-written hrefs in .astro templates are NOT rewritten automatically.
// Every internal link in this project routes through withBase() so it
// resolves correctly both locally (base = '/PS-LASER-APP-WEB') and if this
// project is ever moved to a root-domain deploy (base = '/').
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL; // already trailingSlash-normalized by Astro
  const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
}
