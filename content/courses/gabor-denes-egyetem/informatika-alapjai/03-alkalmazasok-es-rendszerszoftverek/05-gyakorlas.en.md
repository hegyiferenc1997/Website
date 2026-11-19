---
title: Practice – Applications and System Software
summary: Review questions and a summary worksheet on software, licences and installation.
minutes: 43
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

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **Comparing versions.** Write the `newer(a, b)` function, which returns `True` if version `a` (e.g. `"1.10.0"`) is newer than `b`! Compare the versions part by part, as numbers.

```python starter
def newer(a, b):
    return a > b
```

<details>
<summary>Solution</summary>

```python solution
def newer(a, b):
    def numbers(v):
        return tuple(int(x) for x in v.split("."))   # "1.10.0" → (1, 10, 0)
    return numbers(a) > numbers(b)
```

</details>

```python test
assert newer("1.10.0", "1.9.3") is True
assert newer("2.0.0", "10.0.0") is False
assert newer("3.14.1", "3.14.0") is True
assert newer("1.0.0", "1.0.0") is False
print("All checks passed!")
```

**2.** **Type of update.** Write the `update_type(old, new)` function, which returns `"major"`, `"minor"` or `"patch"` depending on which part of the semantic version grew (the first differing part from the left decides)! If the two versions are equal, return `"none"`.

```python starter
def update_type(old, new):
    return "patch"
```

<details>
<summary>Solution</summary>

```python solution
def update_type(old, new):
    o = [int(x) for x in old.split(".")]
    n = [int(x) for x in new.split(".")]
    for name, a, b in zip(["major", "minor", "patch"], o, n):
        if b != a:                       # the first differing part decides
            return name
    return "none"
```

</details>

```python test
assert update_type("2.4.1", "2.4.2") == "patch"
assert update_type("2.4.2", "2.5.0") == "minor"
assert update_type("2.5.0", "3.0.0") == "major"
assert update_type("1.0.0", "1.0.0") == "none"
print("All checks passed!")
```

**3.** **Dependency risk.** Write the `risk(packages, p)` function, which gives the chance that a bug is found in at least one package if each one independently has a bug with probability `p` (to 3 decimals)!

```python starter
def risk(packages, p):
    return round(packages * p, 3)
```

<details>
<summary>Solution</summary>

```python solution
def risk(packages, p):
    return round(1 - (1 - p) ** packages, 3)   # 1 − the chance that none has one
```

</details>

```python test
assert risk(1, 0.01) == 0.01
assert risk(100, 0.01) == 0.634
assert risk(200, 0.01) == 0.866
assert risk(10, 0) == 0.0
print("All checks passed!")
```

### Quick check questions

```quiz
? Which licence is copyleft?
- MIT
- BSD
- Apache-2.0
+ GPL
! Modifications of GPL code must be passed on under the same licence.

? In how many years does a one-off licence of 1,500,000 HUF pay back compared with a 25,000 HUF monthly subscription (years, whole number)?
= 5
! $1\,500\,000 / (25\,000 \cdot 12) = 5$ years.

? What are `winget` or `apt` for?
- virus scanning
+ installing, updating and removing programs as a package manager
- compressing files
- configuring the network
! A package manager installs from an official source and updates everything with one command.

? What is firmware?
+ low-level software embedded in a device's hardware
- an office application
- an antivirus program
- a web browser
! E.g. the BIOS/UEFI or a router's software.
```
