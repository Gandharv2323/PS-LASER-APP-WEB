# Security Policy — PS LASER Website

This repository is public. It is the source for the static marketing/
information site deployed at
`https://gandharv2323.github.io/PS-LASER-APP-WEB/` (the same content the
PS LASER mobile app links to for its Privacy Policy and Terms of Use — see
`src/pages/privacy.astro` / `terms.astro`).

Last reviewed: 2026-08-28.

## Scope

This is a static Astro site with **no backend, no database, no user
accounts, and no data collection of its own** — it does not run any server
code beyond GitHub Pages' own static hosting, and the deploy pipeline
(`.github/workflows/website-deploy.yml`) only builds and publishes static
HTML/CSS/JS. There is no login, no API, and no user-submitted data anywhere
on this site.

**In scope for a report:**
- This repository's source (`src/`, `astro.config.mjs`, dependencies).
- The GitHub Pages deploy workflow itself
  (`.github/workflows/website-deploy.yml`) — e.g. a workflow-injection or
  secret-exposure risk in the CI configuration.
- The deployed site's own headers/config, to the extent they originate from
  this repository (not from GitHub Pages' own platform).

**Out of scope:**
- The PS LASER mobile app itself, or its backend (Cloudflare Worker,
  Firestore) — that's a separate repository
  (`Gandharv2323/PS-Laser-IOS`), with its own `SECURITY.md`.
- GitHub Pages' own platform/infrastructure — report that to GitHub.
- Anything requiring a finding on a page's *content* rather than the code
  serving it (e.g., "this privacy policy should say X") — that's a product/
  legal matter, not a security report; use the contact below instead.

## Reporting a vulnerability

**Preferred: GitHub Private Vulnerability Reporting** — this repository's
*Security* tab → *Report a vulnerability*.

**Fallback:** pslaser24@gmail.com (mark the subject "SECURITY").

Given this site's minimal attack surface (static content only), realistic
reports here are mostly supply-chain (a compromised npm dependency) or
CI/CD (a workflow misconfiguration that could leak the `GITHUB_TOKEN` or
let an untrusted PR alter the deployed output) — both are exactly what
Dependabot, Dependency Review, and CodeQL (below) exist to catch
automatically.

## Automated security tooling on this repository

- **Dependabot** (`.github/dependabot.yml`) — automated PRs for vulnerable/
  outdated npm dependencies and GitHub Actions.
- **Dependency review** (`.github/workflows/dependency-review.yml`) — blocks
  a pull request introducing a dependency with a known vulnerability.
- **CodeQL** (`.github/workflows/codeql.yml`) — static analysis on this
  repo's JavaScript/TypeScript (Astro components/config).

The following require a one-time toggle in this repository's *Settings* →
*Code security* page (not file-based): **Private Vulnerability Reporting**,
**Secret Scanning + Push Protection**, and **Branch Protection** on the
default branch (`main`).
