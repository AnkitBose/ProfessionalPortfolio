# Product Requirements Document (PRD)

## Product
Security-first portfolio website for Ankit Bose.

## Goals
1. Position for recruiters, industry authority, and founder-ready credibility.
2. Demonstrate engineering depth in detection systems, CI/CD, and lab architecture.
3. Maintain low attack surface with static-first design and minimal client-side code.

## Audience
- Recruiters and hiring managers
- Security engineering leaders
- Technical peers and collaborators

## Scope
### In scope
- Home, About, Projects, Labs, Resume, Contact, and 404 pages
- Markdown-driven project and lab entries
- Secure static deployment to GitHub Pages

### Out of scope
- Backend services
- Contact forms
- Public blog engine

## Success Criteria
- Build/lint/typecheck pass in CI
- Deploys correctly at `/Portfolio/`
- No public email by default
- Content pipeline rejects markdown raw HTML
- SEO and metadata configured
