---
title: "Living-off-the-Land Credential Theft in a Hybrid AD Environment"
date: 2025-10-22
tags:
  - credential-theft
  - lolbas
  - active-directory
  - incident-response
  - windows
summary: >
  Post-incident analysis of a credential theft campaign using only LOLBins across a hybrid
  Active Directory environment, covering detection gaps, telemetry improvements, and the Sigma
  rules deployed to catch this tradecraft.
links: []
featured: false
draft: false
---

**MITRE ATT&CK:** T1003.001, T1059.001, T1078, T1021.002, T1570, T1070.001 · **TLP:** white

## Adversary Behavior

The attacker had valid domain credentials from an earlier phishing campaign. Initial access
was via RDP from a residential IP. No malware was introduced — the entire operation was
conducted using native Windows utilities.

### Phase 1: Reconnaissance (T+0 to T+4h)

Using WMI and built-in commands, the attacker mapped the environment:

```powershell
# Observed commands (reconstructed from PowerShell history and WMI activity)
Get-ADUser -Filter * -Properties * | Select Name, SamAccountName, MemberOf
Get-ADGroupMember -Identity "Domain Admins"
wmic /node:10.0.1.x process list brief
```

**Detection status:** MISSED. No alert fired for this reconnaissance activity. WMI queries
from a domain-joined workstation to domain controllers are common and the queries blended
into normal admin traffic.

### Phase 2: Lateral Movement (T+4h to T+16h)

The attacker used Pass-the-Hash with stolen credentials to move laterally via SMB:

```
# PSExec-style execution via built-in features
net use \\TARGET\ADMIN$ /user:DOMAIN\USERNAME *
schtasks /create /s TARGET /tn "Windows Update" /tr "powershell.exe -ep bypass -c ..."
```

**Detection status:** DETECTED-WITH-GAPS. Sentinel alerted on the scheduled task creation
(T1053.005) but with a 6-hour delay due to ingestion lag on Windows Security events from
the affected systems.

### Phase 3: Credential Dumping (T+16h to T+18h)

LSASS was targeted using a renamed copy of ProcDump dropped via the established SMB share:

```cmd
# ProcDump renamed to avoid name-based detection
copy sysinternals_update.exe \\TARGET\C$\Windows\Temp\
sysinternals_update.exe -accepteula -ma lsass.exe lsass.dmp
```

**Detection status:** DETECTED. The LSASS handle open (EventID 10 from Sysmon) triggered
a high-fidelity Sigma rule and generated an alert. This was the first high-confidence
detection in the 18-hour window.

## Telemetry Analysis

### What Fired

- **Sysmon Event ID 10:** `GrantedAccess 0x1FFFFF` to lsass.exe from a renamed binary
- **Sentinel Scheduled Analytics:** Scheduled task creation from a non-admin workstation

### What Didn't Fire (Gaps)

1. **WMI remote queries** — No baselining of normal WMI usage patterns; no alert for
   unexpected WMI targets
2. **SMB lateral movement** — `IPC$` and `ADMIN$` share access was not monitored
3. **Pass-the-Hash indicators** — EventID 4624 LogonType 3 with NTLM was present but
   not correlated with the expected account location

## Detection Design

Based on gap analysis, three new Sigma rules were authored and deployed:

### Rule 1: Suspicious WMI Remote Query from Non-Admin Host

```yaml
title: Remote WMI Query from Non-Admin Workstation
status: test
logsource:
  product: windows
  service: sysmon
detection:
  selection:
    EventID: 3
    DestinationPort: 135
    Initiated: "true"
  filter_expected_admins:
    SourceIp|cidr:
      - "10.0.0.0/24"  # Mgmt network
  condition: selection and not filter_expected_admins
level: medium
```

### Rule 2: ADMIN$ / IPC$ Share Access from Unexpected Source

```yaml
title: Suspicious Admin Share Access
logsource:
  product: windows
  service: security
detection:
  selection:
    EventID: 5140
    ShareName|contains:
      - 'ADMIN$'
      - 'IPC$'
    SubjectLogonId|startswith: '0x'
  filter_expected:
    IpAddress|cidr: "10.0.0.0/24"
  condition: selection and not filter_expected
level: high
```

## Coverage Gaps Identified

| Gap | Priority | Status |
|---|---|---|
| WMI remote query monitoring | High | Addressed |
| SMB admin share baselining | High | Addressed |
| NTLM lateral movement correlation | Critical | In Progress |
| Scheduled task from unexpected host | Medium | Addressed (pre-existing) |
| ProcDump renamed binary detection | High | Addressed (pre-existing) |

## Remediation and Improvements

1. **Deployed Sysmon v15** with updated config covering EventID 3 (network connections)
   on all Windows endpoints, replacing patchy WMI auditing
2. **Enabled SMB share access auditing** (EventID 5140) and built correlation rule for
   unexpected ADMIN$ access
3. **Established WMI baseline** — profiled normal WMI destinations by workstation class
   for 30 days, then deployed anomaly-based alert
4. **Reduced alert ingestion lag** — moved high-priority Windows Security events to a
   dedicated DCR with 5-minute target ingestion SLA vs the previous 15-minute default
5. **Patched Pass-the-Hash path** — implemented LAPS on all workstations and segmented
   admin accounts to prevent cross-workstation NTLM relay
