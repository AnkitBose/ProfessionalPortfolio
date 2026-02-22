---
title: Microsoft Sentinel Detection Engineering CI/CD System (Azure DevOps)
date: 2025-11-12
tags:
  - sentinel
  - kql
  - ci-cd
  - azure-devops
summary: Enterprise detection delivery framework for Microsoft Sentinel using validation-first CI and artifact-based CD with approvals and version traceability.
links:
  - label: GitHub Repository Placeholder
    url: https://github.com/AnkitBose/ProfessionalPortfolio
featured: true
---

## Problem
Detection content often fails at scale because rule quality and deployment controls are inconsistent across teams.

## Approach
I designed a CI/CD framework in Azure DevOps for Sentinel content where pull requests trigger validation gates before any deployment artifact is produced.

## Highlights
- KQL validation stage with syntax and schema-aware checks.
- ARM-TTK checks for template quality and policy alignment.
- Non-ASCII and formatting checks to prevent encoding drift.
- Artifact-based CD with explicit approval gates between environments.
- Semantic version tagging for release traceability.
- Sigma conversion concept layer to accelerate cross-platform rule authoring.

## Outcome
The system reduces defective detection promotions and improves confidence in release quality under team scale.

