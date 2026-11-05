---
title: "Enterprise Sigma Detection Pipeline"
date: 2025-09-10
tags:
  - sigma
  - siem
  - automation
  - pipeline
  - ci-cd
summary: >
  End-to-end Sigma rule management system: version-controlled rules, automated conversion to
  Elastic/Sentinel/Splunk formats, CI/CD validation with pySigma, and a coverage dashboard
  mapped to MITRE ATT&CK.
links:
  - label: GitHub Repo
    url: https://github.com/ankitbose/sigma-pipeline
featured: true
draft: false
---

**Tech stack:** Python, Sigma/pySigma, Elastic SIEM, Microsoft Sentinel, GitHub Actions, KQL, ESQL
**MITRE ATT&CK:** T1059.001, T1003.001, T1547.001

## Problem Statement

Managing detection rules across multiple SIEM platforms is painful. Rules written for Splunk
don't translate to Sentinel's KQL. Rules written in KQL don't port to Elastic's ESQL. When
a new threat actor TTP emerges, updating the same detection logic across three platforms takes
days and introduces drift.

The goal was a single detection rule source of truth that generates platform-specific queries
automatically, validates rule quality before deployment, and provides visibility into coverage
against MITRE ATT&CK.

## Architecture

The pipeline consists of four stages:

### Stage 1: Rule Authoring

All rules are written in [Sigma format](https://github.com/SigmaHQ/sigma) and stored in a
Git repository. Rules are organized by MITRE ATT&CK tactic, then technique:

```
rules/
├── initial-access/
│   ├── T1566.001-spearphishing-attachment.yml
│   └── T1566.002-spearphishing-link.yml
├── execution/
│   ├── T1059.001-powershell-encoded-command.yml
│   └── T1059.001-powershell-downgrade.yml
├── persistence/
│   └── T1547.001-registry-run-key.yml
...
```

### Stage 2: CI/CD Validation (GitHub Actions)

Every pull request triggers a validation workflow:

```yaml
# .github/workflows/validate-rules.yml
name: Validate Sigma Rules

on:
  pull_request:
    paths:
      - 'rules/**'

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.12'

      - name: Install pySigma
        run: pip install pysigma pysigma-backend-elasticsearch pysigma-backend-microsoft365defender

      - name: Lint Sigma rules
        run: python scripts/validate_rules.py rules/

      - name: Convert to Elastic ESQL
        run: python scripts/convert.py rules/ --backend elasticsearch --output dist/elastic/

      - name: Convert to Sentinel KQL
        run: python scripts/convert.py rules/ --backend microsoft365defender --output dist/sentinel/
```

### Stage 3: Coverage Dashboard

A Python script reads all rule frontmatter, extracts MITRE technique tags, and generates a
coverage report as a JSON artifact:

```python
import yaml
import json
from pathlib import Path

def extract_coverage(rules_dir: str) -> dict:
    coverage = {}
    for rule_file in Path(rules_dir).rglob("*.yml"):
        with open(rule_file) as f:
            rule = yaml.safe_load(f)
        tags = rule.get("tags", [])
        for tag in tags:
            if tag.startswith("attack.t"):
                technique_id = tag.split("attack.t")[1].upper()
                technique_id = f"T{technique_id}"
                coverage[technique_id] = coverage.get(technique_id, 0) + 1
    return coverage

if __name__ == "__main__":
    coverage = extract_coverage("rules/")
    with open("dist/coverage.json", "w") as f:
        json.dump(coverage, f, indent=2)
    print(f"Coverage: {len(coverage)} techniques with at least 1 rule")
```

### Stage 4: Deployment

Validated rules are deployed to production SIEMs via API calls. Elastic uses the Detection
Engine API; Sentinel uses the Azure REST API for Scheduled Analytics Rules.

## Results

| Metric | Value |
|---|---|
| Total rules in pipeline | 147 |
| MITRE techniques covered | 63 |
| Tactics with >50% coverage | 6/12 |
| Avg deployment time (commit → live) | 45 minutes |
| False positive rate (30-day avg) | 2.3% |

## Lessons Learned

**pySigma backend quality varies.** Some backends are community-maintained and produce
suboptimal output. Always review the converted query before deploying.

**Sigma condition syntax has edge cases.** The `1 of them` and `all of them` modifiers behave
differently across backends. Test conversions against sample logs before trusting them.

**Coverage dashboards can create false confidence.** A rule tagged `attack.t1059.001` may only
catch one specific variation of PowerShell abuse. Coverage tracking should reflect detection
breadth, not just presence.
