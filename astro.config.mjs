// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
//
// Deploy target: GitHub Pages, as a project site off THIS repo
// (github.com/Gandharv2323/PS-LASER-APP-WEB — a dedicated, website-only
// repo; the site was originally developed inside the Flutter app's own
// monorepo, github.com/Gandharv2323/PS-Laser-IOS, then moved here).
// GitHub Pages project sites are served at https://<user>.github.io/<repo>/
// — `site` is the user/org's Pages domain, `base` is the repo-name
// sub-path everything actually lives under. Every hand-written internal
// href in this project goes through src/lib/base.ts's withBase() to stay
// correct under that sub-path — Astro does not rewrite raw hrefs itself,
// only its own generated asset and sitemap URLs respect `base`
// automatically.
export default defineConfig({
  site: 'https://gandharv2323.github.io',
  base: '/PS-LASER-APP-WEB',
  integrations: [sitemap()],
  compressHTML: true,
});
