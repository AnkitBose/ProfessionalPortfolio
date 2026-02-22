# Deployment Guide

## 1. Repository Prerequisites
- Repository name must be `ProfessionalPortfolio`
- Default branch should be `main`
- Workflows must be enabled in repository settings

## 2. GitHub Pages Setup
1. Open repository Settings.
2. Go to `Pages`.
3. Under Source, choose `GitHub Actions`.
4. Ensure `.github/workflows/deploy.yml` is present in `main`.
5. Push to `main` to trigger deployment.

The deployed URL should be:
`https://AnkitBose.github.io/ProfessionalPortfolio/`

## 3. Base Path
This project is configured with:
- `site = "https://AnkitBose.github.io"`
- `base = "/ProfessionalPortfolio/"`

Do not change this unless the repository name or hosting target changes.

## 4. Cloudflare Web Analytics (Optional)
Disabled by default.

To enable:
1. In Cloudflare Web Analytics, create a token for this site.
2. In GitHub repository settings, add Actions variables/secrets:
   - `PUBLIC_ENABLE_CF_ANALYTICS=true`
   - `PUBLIC_CF_ANALYTICS_TOKEN=<your token>`
3. Re-run deploy workflow.

If not configured, no analytics script is loaded.

## 5. GA4 (Optional, Disabled by Default)
If you later choose GA4, add environment variables:
- `PUBLIC_ENABLE_GA4=true`
- `PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXX`

Then implement GA4 script loading with explicit privacy review before enabling.

## 6. Make npm audit Blocking Later
Current CI keeps dependency audit visible but non-blocking.

To make blocking:
- Edit `.github/workflows/ci.yml`
- Remove `continue-on-error: true` from the audit step.

## 7. Custom Domain (Future)
For future custom domain:
1. Add `CNAME` in `public/`.
2. Update `astro.config.mjs` site URL.
3. Update canonical URL in `src/config/site.ts`.
4. Re-deploy.



