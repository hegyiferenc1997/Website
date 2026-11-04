---
title: Software Licences
summary: Commercial, freeware, open source and subscription software; GPL, MIT and friends.
minutes: 15
---

## What you will learn

- what a **licence** is, and why you don't “buy” software,
- the main licence types: **commercial**, **freeware**, **shareware**, **open source**, **subscription (SaaS)**,
- the difference between the **GPL** and the **MIT** licence.

## What is a licence?

When you buy software you usually get a **right to use** it, not the program itself. The **licence** (end-user licence agreement, EULA) says what you may do: on how many machines you may install it, whether you may use it at a company, modify it or pass it on.

## Licence types

| Type                | Price                  | Source code            | Example                                      |
| ------------------- | ---------------------- | ---------------------- | -------------------------------------------- |
| commercial (closed) | paid                   | not visible            | Windows, Photoshop                           |
| freeware            | free                   | not visible            | Zoom basic, Adobe Reader                     |
| shareware / trial   | free to try, then paid | not visible            | WinRAR, 30-day trials                        |
| open source         | usually free           | **public, modifiable** | Linux, Firefox, VS Code (Code – OSS), Python |
| subscription (SaaS) | monthly/yearly fee     | not visible            | Microsoft 365, Adobe Creative Cloud          |

**Freeware** is free but not open: you can't see or modify its code. **Open source** software has code that anyone can access.

## Open licences: permissive and copyleft

- **Permissive** licences (**MIT**, **Apache 2.0**, BSD): you can do almost anything with the code, even build it into a closed product; you only have to keep the copyright notice.
- **Copyleft** licences (**GPL**): if you distribute a modified version, you must release it **under the same licence, with source code**. The Linux kernel is GPL.

## Why does this matter for an engineer?

When you build an open-source library into a company product, its licence decides what you must comply with. Building a GPL library into a closed product can be a legal risk; an MIT one usually is not.

Using **pirated** (unlicensed) software is illegal and often contains malware too.

## Summary

- A licence grants a right to use, not ownership.
- Freeware = free but closed; open source = public, modifiable code.
- MIT/Apache: permissive; GPL: copyleft, modifications must also be released openly.

## Exercise

```quiz required
? What is typical of **freeware**?
+ It is free, but its source code is not available.
- It is paid, but its source code is public.
- It can only be used for 30 days.
- Anyone may modify and redistribute it.
! Freeware is not the same as open source.

? Which licence is **copyleft**, i.e. a modified version must also be released openly?
- MIT
- Apache 2.0
+ GPL
- BSD
! GNU General Public License.

? Under which licence is the Linux kernel released?
= GPL
= GPLv2
= GPL-2.0
! The Linux kernel is GPLv2.

? Which one is **subscription** software (SaaS)?
- 7-Zip
- Linux
+ Microsoft 365
- Firefox
! It is used for a monthly or yearly fee.
```
