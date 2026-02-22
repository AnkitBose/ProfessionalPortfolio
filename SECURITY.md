# Security Policy

## Supported Scope
This repository hosts a static portfolio site and supporting content.

## Reporting a Security Issue
Please report potential vulnerabilities privately via LinkedIn message:
- https://www.linkedin.com/in/ankit-bose-497a808a/

Include:
- reproduction steps
- impact assessment
- affected file(s) or dependency

## Dependency Management
- Dependencies are pinned in `package.json` and lockfile-managed with npm.
- CI runs `npm audit` for visibility.
- Review and update dependencies on a regular cadence.

## Third-Party Embed and Script Policy
- No third-party scripts are loaded by default.
- Cloudflare analytics is optional and config-gated.
- Any future embeds must be reviewed for privacy and supply-chain risk.

## Markdown and Content Safety
- Raw HTML is not allowed in markdown content collections.
- Validation script fails builds on disallowed markup patterns.

## Contact Surface Rationale
No public contact form is implemented. This avoids backend attack surface, spam abuse handling, and unnecessary data processing.

## Inline Script Exception
Inline executable scripts are avoided. JSON-LD metadata scripts are included for SEO only and do not execute application logic.
