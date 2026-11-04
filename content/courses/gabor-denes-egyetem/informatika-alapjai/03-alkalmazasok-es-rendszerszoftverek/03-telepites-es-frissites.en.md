---
title: Installing, Updating, Package Managers
summary: How a program gets onto the machine, why updates matter, and what winget and apt are for.
minutes: 15
---

## What you will learn

- what happens when a program is **installed**,
- why **updates** matter and what a **version number** means,
- how to install software with a **package manager** (winget, apt, Homebrew).

## What happens during installation?

The installer (`.exe` or `.msi` on Windows, `.dmg`/`.pkg` on macOS, `.deb`/`.rpm` on Linux) usually:

1. copies the program's files (e.g. `C:\Program Files\…`),
2. installs the required **dependencies** (libraries, runtime),
3. writes settings (on Windows into the **Registry**),
4. creates shortcuts and file associations.

**Only install from trusted sources** (the vendor's site, an official app store). “Download sites” often bundle malware into the installer.

## Version numbers and updates

Most software uses **semantic versioning**: `MAJOR.MINOR.PATCH`, e.g. `3.14.2`.

| Step              | Meaning                           |
| ----------------- | --------------------------------- |
| `3.14.2 → 3.14.3` | bug fix, nothing breaks           |
| `3.14.3 → 3.15.0` | new feature, backwards compatible |
| `3.15.0 → 4.0.0`  | big change, old things may break  |

An update is not just new features: most updates fix **security bugs**. Old, unpatched software is one of the most common entry points for attackers. Many products also offer an **LTS** (Long Term Support) version: it is patched for years, so servers and companies prefer it.

## Package managers

A **package manager** finds, downloads, installs and updates programs with their dependencies, from a trusted repository, with one command.

```powershell
# Windows: winget
winget search vscode
winget install Microsoft.VisualStudioCode
winget upgrade --all
```

```bash
# Ubuntu/Debian: apt
sudo apt update              # refresh the package list
sudo apt install git         # install
sudo apt upgrade             # upgrade every package
```

On macOS there is **Homebrew** (`brew install git`), and programming languages have their own package managers: `pip` for Python, `npm`/`pnpm` for JavaScript.

## Uninstalling

Remove a program with the system's own tool (Windows: Settings → Apps; `winget uninstall`; Linux: `sudo apt remove`), not by deleting its folder, because settings and shortcuts stay behind.

## Summary

- The installer copies files and dependencies and writes settings.
- Semantic version: MAJOR.MINOR.PATCH; updates matter mainly for security.
- Package managers: winget (Windows), apt (Debian/Ubuntu), Homebrew (macOS), pip/npm (languages).

## Exercise

```quiz required
? Which command installs `git` on Ubuntu?
- winget install git
+ sudo apt install git
- pip install git
- brew get git
! On Ubuntu the package manager is apt.

? In semantic versioning, which number increases when a change is **not backwards compatible**?
+ the major version (first)
- the minor version (second)
- the patch number (third)
- none of them
! E.g. 3.15.0 → 4.0.0.

? What does the abbreviation LTS stand for?
= Long Term Support
! It receives fixes for years.

? What is the most important purpose of updates?
- new icons
+ fixing security bugs
- slowing the program down
- extending the licence
! Unpatched software is a common attack point.
```
