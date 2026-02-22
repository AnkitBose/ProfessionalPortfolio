# Threat Model

## Context
Static portfolio site hosted via GitHub Pages. No backend runtime, no authentication, no form processing.

## Threats and Mitigations

### 1. Supply-chain compromise
- Threat: compromised npm dependency or malicious transitive package.
- Mitigations:
  - pinned dependencies and lockfile
  - `npm ci` in CI for deterministic installs
  - visible dependency audit checks

### 2. Malicious third-party scripts
- Threat: script compromise, tracking abuse, injected malware.
- Mitigations:
  - no third-party scripts by default
  - analytics script is optional and config-gated
  - policy documented in `SECURITY.md`

### 3. Repository compromise
- Threat: unauthorized code changes deployed to production.
- Mitigations:
  - CI validation before deploy
  - branch protection recommended
  - review workflows and least-privilege GitHub permissions

### 4. Phishing / impersonation through contact links
- Threat: malicious redirection or fake contact endpoints.
- Mitigations:
  - explicit canonical LinkedIn and GitHub URLs
  - no form endpoint and no unverified contact channels

### 5. Content injection via markdown
- Threat: raw HTML/script in markdown rendered client-side.
- Mitigations:
  - markdown validation script blocks HTML tags
  - typed content schema and static rendering

### 6. Broken access control
- Threat: unauthorized data access.
- Applicability: not applicable (no auth-protected resources).

### 7. XSS risks
- Threat: DOM/script injection through dynamic input.
- Mitigations:
  - no user input handling
  - no dangerous HTML rendering patterns
  - minimal client-side JS and controlled rendering

## Future Hardening
- Optional Cloudflare WAF/fronting
- Add security headers at CDN layer
- Add SLSA/provenance checks for build integrity
