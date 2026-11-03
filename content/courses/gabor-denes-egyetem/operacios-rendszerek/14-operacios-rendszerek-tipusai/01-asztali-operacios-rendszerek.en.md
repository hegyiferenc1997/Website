---
title: Desktop Operating Systems
summary: The history, structure, licence and typical use of Windows, Linux distributions and macOS.
minutes: 20
---

## What you will learn

- where **Windows**, **Linux** and **macOS** come from and what they offer,
- what a **Linux distribution** is and which are the best known,
- under which **licence** they are available and who uses them for what.

## Windows

- **Vendor**: Microsoft. The first Windows (1985) was still a graphical interface on top of MS-DOS; today's Windows comes from the **Windows NT** (1993) line designed by Dave Cutler's team.
- **Kernel**: hybrid (`ntoskrnl.exe`), file system **NTFS**.
- **Licence**: closed source, commercial (Home, Pro, Education, Enterprise editions).
- **Strengths**: the largest desktop market share, a huge range of programs and games, office and enterprise environments (Active Directory, Office).
- **Current**: **Windows 11** (free support for Windows 10 ended in October 2025).

## Linux

- **Birth**: 1991, started by the Finnish student **Linus Torvalds** as a hobby project. Strictly speaking "Linux" is only the **kernel**; the full system is put together with the tools of the **GNU** project (shell, C compiler, basic commands) – that is why it is sometimes called GNU/Linux.
- **Kernel**: monolithic, with modules; file system typically **ext4**.
- **Licence**: open source, **GPLv2** – anyone may use, modify and distribute it for free.
- **Strengths**: servers, cloud, supercomputers (all 500 machines of the TOP500 list run Linux), development, embedded devices, Android.

### Distributions

A **distribution** is a curated package of kernel + basic programs + package manager + graphical interface + settings.

| Family  | Distributions                  | Package manager | Recommended for?                                   |
| ------- | ------------------------------ | --------------- | -------------------------------------------------- |
| Debian  | **Ubuntu**, Debian, Linux Mint | `apt` (.deb)    | beginners, desktop, server                         |
| Red Hat | Fedora, RHEL, Rocky, AlmaLinux | `dnf` (.rpm)    | enterprise servers, developers                     |
| Arch    | Arch Linux, Manjaro            | `pacman`        | advanced users who configure everything themselves |
| SUSE    | openSUSE, SLES                 | `zypper`        | enterprise environments                            |

## macOS

- **Vendor**: Apple. It evolved from **NeXTSTEP** (Steve Jobs's company NeXT) and appeared in 2001 as Mac OS X.
- **Kernel**: **XNU** (hybrid: Mach + BSD), part of the open-source **Darwin** base system; file system **APFS**.
- **UNIX**: officially a **UNIX 03** certified system – that is why the terminal feels so at home (`zsh`, `ls`, `ssh`).
- **Licence**: closed (the Darwin base is open), and legally runs only on **Apple hardware**.
- **Strengths**: tight hardware–software integration, graphics, video, music, iOS development (Xcode runs only on macOS).

## Summary

- Windows: Microsoft, NT line, hybrid kernel, NTFS, closed; the most widespread on the desktop.
- Linux: Torvalds 1991, monolithic kernel, GPLv2; distributions (Ubuntu, Fedora, Arch); rules servers and the cloud.
- macOS: Apple, from NeXTSTEP, XNU kernel, APFS, UNIX certified, only on Apple hardware.

## Lesson exercise

```quiz required
? Under which licence is the Linux kernel available?
- MIT
+ GPLv2
- closed, commercial
- Apache 2.0
! GNU General Public License, version 2.

? Which package manager does Ubuntu use?
= apt
! It belongs to the Debian family (.deb packages).

? From which system did macOS evolve?
+ NeXTSTEP
- MS-DOS
- MINIX
- Windows NT
! The system of Steve Jobs's company NeXT.

? What is the name of the macOS file system?
= APFS
! Apple File System.

? Which system is today's Windows (10/11) based on?
- MS-DOS
+ Windows NT
- UNIX
- OS/2
! The NT line started in 1993.
```
