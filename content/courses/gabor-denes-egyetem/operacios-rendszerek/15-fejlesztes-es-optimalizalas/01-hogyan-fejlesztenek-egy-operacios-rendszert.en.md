---
title: How Is an Operating System Developed?
summary: The Linux kernel development process, the Windows release cadence, programming languages (C, Rust) and testing.
minutes: 20
---

## What you will learn

- how a new **Linux kernel** is made: maintainers, mailing lists, the **merge window**, rc releases,
- how **Windows** and **Ubuntu** are developed and updated,
- in which **languages** operating systems are written and how they are **tested**.

## Developing the Linux kernel

Linux is one of the largest collaborative software projects in the world: a single release typically contains changes from **more than a thousand** developers (companies and volunteers), and the source is tens of millions of lines.

The process:

1. Developers send **patches** by e-mail to the **mailing list** of the subsystem concerned (e.g. networking, USB, file systems).
2. The subsystem's **maintainer** reviews them, asks for fixes, then takes them into their own **git** branch.
3. At the start of a new version a two-week **merge window** opens: Linus Torvalds pulls in the subsystems' changes.
4. After that an **rc** (_release candidate_) comes every week (`-rc1`, `-rc2` …); now **only bug fixes** may go in.
5. The final version usually appears after `-rc7` or `-rc8` – about **9–10 weeks** in total.

The **stable** branch maintainers keep fixing released versions for months, and the yearly **LTS** kernels for years. Distributions (Ubuntu, Fedora) choose from these and ship them with their own fixes.

> The **git** version control system was also written by Linus Torvalds, in 2005, precisely for kernel development.

## The release cadence of Windows and Ubuntu

| System      | Rhythm                                                                                                                                                                                       |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Windows** | one larger feature update a year (e.g. 24H2, 25H2), monthly security fixes: **"Patch Tuesday"** on the **second Tuesday** of every month; early testing in the **Windows Insider** programme |
| **Ubuntu**  | **April and October**: a new release (YY.MM, e.g. 26.04); an **LTS** **every two years** (April of even years); interim releases are supported for 9 months                                  |

## Programming languages

- **C**: the main language of kernels (Linux, Windows NT, XNU) – close to the hardware, fast, and gives precise control over memory.
- **Assembly**: processor-specific code of the lowest parts (boot, interrupt handlers, context switch).
- **Rust**: since 2022 (kernel 6.1) drivers can be written in it in Linux too, and Rust code is also going into the Windows kernel. Its advantage is **memory safety**: the compiler prevents typical bugs (use after free, buffer overflow) that cause most security holes.
- **C++**, **Objective-C**, **Swift**: in user space and in some driver frameworks (macOS IOKit).

## Testing

An OS bug has enormous impact, so multi-level testing is needed:

- **automatic tests** for every change (Linux: KernelCI, kselftest; fuzzing with syzkaller, which hunts for crashes with random system calls),
- **regression tests**: a fix must not break something else,
- **pre-releases** for volunteer testers (rc kernels, Windows Insider, Ubuntu beta),
- **staged rollout**: first only a small share of machines gets the update.

The July 2024 **CrowdStrike incident** – a faulty kernel driver update of a security product took down about 8.5 million Windows machines worldwide with a blue screen – showed why staged rollouts matter and why kernel-mode code is risky.

## Summary

- Linux: patches on mailing lists → maintainer → two-week merge window → weekly rcs → final version every ~9–10 weeks; stable and LTS branches.
- Windows: yearly feature update, monthly Patch Tuesday (2nd Tuesday); Ubuntu: April/October, LTS every two years.
- Languages: C and assembly, more and more Rust for memory safety.
- Testing: automatic tests, fuzzing, pre-releases, staged rollout.

## Lesson exercise

```quiz required
? How many weeks does the Linux kernel merge window last?
= 2
= two
! After that only bug fixes may go in.

? What does rc stand for in kernel versions (e.g. 7.1-rc3)?
+ release candidate
- root controller
- remote copy
- real-time core
! One comes every week until the version is stable enough.

? On which Tuesday of the month does Microsoft release the monthly security fixes? (number)
= 2
= second
! Patch Tuesday.

? In which memory-safe language can Linux drivers be written since 2022?
= Rust
! Since kernel 6.1.

? Who wrote the git version control system?
+ Linus Torvalds
- Bill Gates
- Andrew Tanenbaum
- Guido van Rossum
! In 2005, for kernel development.
```
