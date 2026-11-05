---
title: "Detecting PowerShell Downgrade Attacks via ETW and Event ID 400"
date: 2025-11-14
tags:
  - powershell
  - detection-engineering
  - defense-evasion
  - windows
  - sigma
  - etw
summary: >
  PowerShell version 2 remains available on most Windows systems and can bypass ScriptBlock
  logging (Event ID 4104); this details a detection approach using Windows PowerShell event
  logs and ETW to catch downgrade attempts at scale.
links: []
featured: true
draft: false
---

**MITRE ATT&CK:** T1059.001, T1562.001 · **TLP:** white

## Background

PowerShell's Script Block Logging feature (enabled via Group Policy or registry) records all
script block content to Event ID 4104 in the `Microsoft-Windows-PowerShell/Operational` log.
This is an invaluable data source for detecting obfuscated or malicious PowerShell activity.

However, PowerShell version 2 — which remains installed by default on most Windows systems for
backward compatibility — predates Script Block Logging. Adversaries who invoke `powershell.exe`
with the `-Version 2` flag effectively drop back to a logging-blind execution context.

This is a well-documented evasion technique referenced in [T1562.001](https://attack.mitre.org/techniques/T1562/001/)
and exploited in real-world campaigns. The question is: can we detect it reliably?

## Telemetry Analysis

When PowerShell version 2 starts, the Windows PowerShell `Classic` event log records Event ID 400
with the `EngineVersion` field populated with a `2.x` value:

```
Log: Windows PowerShell
Event ID: 400
EngineVersion: 2.0
HostName: ConsoleHost
```

This event fires at PowerShell engine startup and is present on all Windows versions. Crucially,
it fires *even when* Script Block Logging is not active, giving us a telemetry path that doesn't
depend on the advanced logging that the attacker is trying to bypass.

## Detection Design

```yaml
title: Suspicious PowerShell Downgrade Attack
id: b3e2a5f4-1c3d-4a89-9f72-d84ea6c91b23
status: stable
description: >
  Detects invocation of PowerShell version 2 via -Version 2 flag,
  which bypasses ScriptBlock logging. Adversaries use this to execute
  scripts without triggering 4104 event logging.
references:
  - https://attack.mitre.org/techniques/T1059/001/
  - https://attack.mitre.org/techniques/T1562/001/
author: Ankit Bose
date: 2025-11-14
logsource:
  product: windows
  service: powershell-classic
detection:
  selection:
    EventID: 400
    EngineVersion|startswith: '2.'
  filter_legitimate:
    HostApplication|contains:
      - 'wsmprovhost'
      - 'sqlps.exe'
  condition: selection and not filter_legitimate
falsepositives:
  - Legacy automation scripts that explicitly target PowerShell v2
  - SCCM/ConfigMgr using PowerShell v2 for compatibility
level: high
tags:
  - attack.defense_evasion
  - attack.t1562.001
  - attack.execution
  - attack.t1059.001
```

## Coverage Gaps and Limitations

This detection has two meaningful limitations:

1. **PowerShell 2 must be installed.** On Windows 10+ with PowerShell 2 removed via `Disable-WindowsOptionalFeature -Online -FeatureName MicrosoftWindowsPowerShellV2Root`, this technique fails silently. Tracking removal status across the fleet is important context.

2. **False positive surface.** Legacy SCCM scripts, some SQL tooling, and older automation frameworks may invoke PS v2 legitimately. The filter in the rule above covers the most common cases, but local tuning is required.

## Validation Results

Tested against 4,200 endpoints in a mixed Windows 10/11 environment over 30 days:

| Metric | Value |
|---|---|
| True positives | 14 |
| False positives (pre-filter) | 127 |
| False positives (post-filter) | 3 |
| Rule fidelity | 82% |
| Mean time to alert | < 90 seconds |

## Recommendations

- Enable Windows PowerShell Classic event log collection on all Windows endpoints
- Remove PowerShell v2 where not required via `DISM /Online /Disable-Feature /FeatureName:MicrosoftWindowsPowerShellV2Root`
- Pair with T1059.001 detections monitoring for `-EncodedCommand` and `-NonInteractive -WindowStyle Hidden` patterns
