# Get Started

## 1. Local development
```bash
npm install
npm run dev
```

## 2. Quality and build checks
```bash
npm run lint
npm run typecheck
npm run build
npm run preview
npm run security:audit
```

## 3. Project pages deployment target
This project is configured for GitHub project pages:
- Repository: `AnkitBose/ProfessionalPortfolio`
- Base path: `/ProfessionalPortfolio/`
- URL: `https://AnkitBose.github.io/ProfessionalPortfolio/`

## 4. GitHub setup (Actions + Pages)
1. Push this code to the `main` branch.
2. In GitHub: `Settings` -> `Actions` -> `General`, ensure workflows are enabled.
3. In GitHub: `Settings` -> `Pages`, set Source to `GitHub Actions`.
4. Confirm workflows exist:
   - `.github/workflows/ci.yml`
   - `.github/workflows/deploy.yml`
5. Push to `main` (or run deploy workflow manually).

## 5. Optional analytics enablement
Cloudflare analytics is disabled by default.

To enable later:
- `PUBLIC_ENABLE_CF_ANALYTICS=true`
- `PUBLIC_CF_ANALYTICS_TOKEN=<token>`

Then re-run deploy.

GA4 is optional and remains disabled by default.

## 6. Post-deploy checklist
1. Verify route loading under `/ProfessionalPortfolio/`:
   - `/`, `/about`, `/projects`, `/labs`, `/resume`, `/contact`
2. Replace `public/resume.pdf` with your real resume.
3. Replace `public/social-card.png` with a branded OG image.
4. Confirm SEO output:
   - canonical, OpenGraph, Twitter cards, JSON-LD, sitemap, robots
5. Review `npm audit` results and decide whether to make audit blocking in CI.
6. Replace placeholder Projects/Labs markdown content with production-ready entries.



