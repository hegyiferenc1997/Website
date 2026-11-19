---
title: Practice – Applications and System Software
summary: Review questions and a summary worksheet on software, licences and installation.
minutes: 18
kind: practice
---

## Review questions

<details>
<summary>1. Classify these: Android, printer driver, Spotify, antivirus, UEFI!</summary>

System software: Android (OS), printer driver, UEFI (firmware). Utility: antivirus. Application: Spotify.

</details>

<details>
<summary>2. You want to build an open-source library into a company's closed-source product. What do you check first?</summary>

Its licence. With MIT or Apache 2.0 keeping the copyright notice is enough; with GPL the distributed product would also have to be released under GPL, with source code.

</details>

<details>
<summary>3. Why is installing with a package manager better than with a downloaded installer?</summary>

It comes from a trusted repository, handles dependencies, and one command updates every program (`winget upgrade --all`, `sudo apt upgrade`).

</details>

Try it (in Windows PowerShell):

```powershell
winget list            # installed programs
winget upgrade         # what can be updated?
```

## Summary worksheet

```quiz required
? Which of these is **firmware**?
- Windows 11
+ the motherboard's UEFI
- Excel
- Chrome
! Firmware is a low-level program built into a device.

? What is the command of Windows's own package manager?
= winget
! Windows Package Manager.

? Which version change means **only a bug fix**?
+ 2.4.1 → 2.4.2
- 2.4.2 → 2.5.0
- 2.5.0 → 3.0.0
- 1.9.9 → 2.0.0
! The third number is the patch number.

? Which is a **permissive** open licence?
+ MIT
- GPL
- EULA
- shareware
! MIT allows almost anything; you only keep the copyright notice.

? Which software is open source?
- Photoshop
- Windows
+ Firefox
- Adobe Reader
! Firefox's code is public (Mozilla Public License).

? What is Python's package manager called?
= pip
! pip install requests
```
