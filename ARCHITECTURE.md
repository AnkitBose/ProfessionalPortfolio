# Architecture

## Overview
The site is a static Astro application with markdown content collections for Projects and Labs. Dynamic routes are pre-rendered at build time.

## Key Components
- `src/layouts/BaseLayout.astro`: global shell, metadata, optional analytics injection
- `src/content/config.ts`: typed content schemas
- `src/pages/projects/[slug].astro` and `src/pages/labs/[slug].astro`: static route generation from content collections
- React islands:
  - `ThemeToggle.tsx`
  - `TagFilter.tsx`
  - `ContactCta.tsx` (optional)

## Security Architecture
- No server-side runtime and no user input processing
- No forms/backends reduces abuse and injection exposure
- Markdown validator blocks raw HTML tags in content files
- Third-party scripts are disabled unless config enables them

## Build and Deploy
- Build output: `dist/`
- Base path: `/Portfolio/`
- CI validates lint/typecheck/build and runs visible non-blocking dependency audit
- Deploy workflow publishes artifact to GitHub Pages
