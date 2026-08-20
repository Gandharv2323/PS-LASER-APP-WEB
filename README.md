# PS Laser — Official Website

Built with [Astro](https://astro.build) — a static, editorial site covering the real PS
Laser app (Orders, Production, Delivery, AI Chat, etc.) plus the legal/compliance pages
required for Play Store and App Store submission (`/privacy`, `/terms`, `/support`,
`/delete-account`, `/copyright`, `/contact`).

Content is grounded directly in an audit of the actual Flutter app + Cloudflare Worker
backend (github.com/Gandharv2323/PS-Laser-IOS). Nothing here describes a feature that
doesn't exist in the real app.

**This is a dedicated, website-only repository.** It contains no Flutter application code,
no backend/Worker code, and no Firebase config — only the Astro site and the files needed
to build and deploy it. The site was originally developed inside the Flutter app's own
monorepo and was moved here so GitHub Pages could serve it from its own repository.

**Deploy target: GitHub Pages**, project site at `https://gandharv2323.github.io/PS-LASER-APP-WEB/`,
via GitHub Actions (`.github/workflows/website-deploy.yml`, the official `withastro/action`).

## Develop

```bash
npm install
npm run dev       # http://localhost:4321/PS-LASER-APP-WEB/  (note the base path — see below)
```

## Build & verify

```bash
npm run build      # static output to dist/
npx astro check    # typecheck
npm run preview    # serve dist/ locally the same way it'll be requested in production
```

## Base path — read this before adding a new internal link

This site is deployed as a GitHub Pages **project** site (not a `<user>.github.io` user/org
site), so it's served under a repo-name sub-path:
`https://gandharv2323.github.io/PS-LASER-APP-WEB/`, not the domain root. `astro.config.mjs`
sets `site`/`base` accordingly, but **Astro does not rewrite raw hardcoded hrefs itself** —
only its own generated asset and sitemap URLs respect `base` automatically.

Every internal link in this project must go through `src/lib/base.ts`'s `withBase()`:

```astro
---
import { withBase } from '../lib/base';
---
<a href={withBase('/privacy')}>Privacy Policy</a>
```

Never write `href="/privacy"` directly — it will 404 once deployed (it would point at
`gandharv2323.github.io/privacy`, not `gandharv2323.github.io/PS-LASER-APP-WEB/privacy`).
`mailto:`/`tel:`/`#fragment` links don't need this.

## Deploy

Deployment is automatic via GitHub Actions on every push to `main` (this repo's default
branch) — see `.github/workflows/website-deploy.yml`. It also supports manual triggering:
GitHub → Actions tab → "Deploy website to GitHub Pages" → Run workflow.

**One-time setup required before this actually publishes anything:** on this repo, go to
**Settings → Pages → Build and deployment → Source** and select **"GitHub Actions"** (it is
not enabled by default on a new repo). Until that's set, a workflow run will build the site
successfully but fail at the final "Deploy to GitHub Pages" step.

## Regenerating icons/OG image

`public/favicon-32.png`, `public/apple-touch-icon.png`, `public/icon-512.png`, and
`public/og-image.png` were generated from the real PS Laser app icon
(`assets/ps.png` in the Flutter app's own repo). See `scripts/gen-icons.mjs`'s own comment
for how to regenerate them if the source art ever changes — it requires copying that one
source file in from the Flutter repo first, since this repo doesn't carry Flutter assets.

## What's intentionally NOT here yet

- Real screenshots on `/app` — none exist yet; placeholder frames are used instead (clearly
  labeled "Screenshot coming soon"). Drop real screenshots into the relevant
  `ShowcasePlaceholder` usages once captured.
- Actual Play Store / App Store download links — none published yet.
- A working in-app account-deletion flow — `/delete-account` honestly discloses this is
  currently a manual, email-based request process. See `STORE-DATA-SAFETY.md`'s "Known gap"
  section for exactly what's needed to fix this (that fix lives in the Flutter app's repo,
  not here).
