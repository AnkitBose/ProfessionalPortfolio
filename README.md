# Secure Portfolio Website - Ankit Bose

A static, security-first personal portfolio built with Astro, Tailwind CSS, and TypeScript.

## Profile
- Name: Ankit Bose
- Role: Cyber Security Manager @ PwC Canada
- GitHub: https://github.com/AnkitBose
- LinkedIn: https://www.linkedin.com/in/ankit-bose-497a808a/
- Deployment URL: https://AnkitBose.github.io/Portfolio/

## Stack
- Astro (static output)
- Tailwind CSS
- TypeScript
- Astro content collections for Projects and Labs
- GitHub Actions CI + GitHub Pages deploy

## Local Setup
```bash
npm install
npm run dev
```

## Scripts
```bash
npm run lint
npm run typecheck
npm run build
npm run preview
npm run security:audit
npm run content:validate
```

## Content Management
- Projects markdown: `src/content/projects`
- Labs markdown: `src/content/labs`
- Content schema: `src/content/config.ts`
- Raw HTML is blocked by `scripts/validate-markdown-no-html.mjs`

## Security Highlights
- No contact form and no public email by default
- Optional email reveal is config-gated and disabled by default
- No third-party scripts loaded unless explicitly configured
- Lockfile + `npm ci` in CI
- Non-blocking dependency audit in CI (can be made blocking)

## Analytics Configuration
Cloudflare analytics is disabled by default.

Set environment variables for deploy if needed:
- `PUBLIC_ENABLE_CF_ANALYTICS=true`
- `PUBLIC_CF_ANALYTICS_TOKEN=<token>`

GA4 remains optional and disabled by default.

## GitHub Pages
This project is configured for project pages with base path `/Portfolio/`.

See `DEPLOYMENT.md` for exact setup steps.


## Quick Start Guide
See GET_STARTED.md for local setup, GitHub Pages, analytics, and post-deploy checklist.

