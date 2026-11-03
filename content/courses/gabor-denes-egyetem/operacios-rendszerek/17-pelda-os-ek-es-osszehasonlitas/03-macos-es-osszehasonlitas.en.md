---
title: macOS and a Comparison of the Three Systems
summary: macOS from the inside (XNU, launchd, QoS classes, memory compression, APFS, SIP, Gatekeeper, Rosetta 2), then a big table comparing Linux, Windows and macOS.
minutes: 25
---

## What you will learn

- how **macOS** implements the main concepts of the course,
- the most important differences between Linux, Windows and macOS in a **comparison table**,
- which system is the best choice for what.

## macOS from the inside

We do not install macOS in VirtualBox: its licence only allows it to run on Apple hardware. The concepts, however, are the same.

- **Kernel**: **XNU** – the **Mach** microkernel (threads, scheduling, virtual memory, message passing) and the **BSD** layer (processes, POSIX system calls, file systems, networking) in one address space, as a hybrid kernel; the C++ driver framework is **IOKit**.
- **Boot**: on an Apple Silicon Mac the **iBoot** boot loader verifies and loads the kernel, which starts **launchd** with **PID 1** – the counterpart of systemd: it starts and supervises services.
- **Scheduling**: priority-based, preemptive; programs use **QoS classes** to indicate how urgent their work is (_user-interactive_, _user-initiated_, _utility_, _background_). On Apple Silicon processors the system uses this to decide whether a thread goes to the fast **performance cores** (P) or the economical **efficiency cores** (E) (topic 10: heterogeneous multiprocessor scheduling).
- **Memory**: demand paging (with 16 KiB pages on Apple Silicon), **memory compression** (since 2013), and swap files created as needed.
- **File system**: **APFS** (since 2017): copy-on-write, with built-in **snapshots** (Time Machine backups build on them) and encryption; case-insensitive by default.
- **Security**: Unix permissions and ACLs, `sudo`; **SIP** (_System Integrity Protection_) protects system files even from root, the system volume is **sealed and signed**; **Gatekeeper** only lets signed programs checked by Apple (_notarized_) run; App Store programs run in a **sandbox**.
- **Software**: App Store, `.dmg` disk images, and from the command line the community **Homebrew** package manager (`brew install git`).
- **Rosetta 2**: **translates** Intel (x86-64) programs into ARM instructions before running them – a relative of the binary translation in topic 16.

## The big comparison

| | **Linux (Ubuntu)** | **Windows 11** | **macOS** |
| --- | --- | --- | --- |
| kernel | monolithic, with modules | hybrid (NT) | hybrid (XNU: Mach + BSD) |
| licence | open (GPLv2) | closed | closed (the Darwin base is open) |
| first process | `systemd` (PID 1) | System (PID 4), `smss.exe` | `launchd` (PID 1) |
| process creation | `fork()` + `exec()` | `CreateProcess` | `fork()` + `exec()`, `posix_spawn` |
| scheduler | EEVDF, nice −20…19 | 32 priority levels, boosts | priorities + QoS classes, P/E cores |
| memory | overcommit + OOM killer, swap | commit limit, `pagefile.sys`, compression | compression, dynamic swap |
| file system | ext4 (Btrfs) | NTFS | APFS |
| path | `/home/anna/doc.txt` | `C:\Users\Anna\doc.txt` | `/Users/anna/doc.txt` |
| letter case | case-sensitive | not | not by default |
| permissions | `rwx` + AppArmor/SELinux | ACLs + UAC | `rwx` + ACLs + SIP, sandbox |
| settings | text files (`/etc`) | registry | `.plist` files |
| package manager | `apt`, Snap, Flatpak | `winget`, Microsoft Store | App Store, Homebrew |
| typical use | servers, cloud, development, embedded | office and home desktop, gaming | creative work, Apple development |

## Which one when?

- **Linux**: servers, cloud, containers, programming, reviving old machines – and it is free. As a computer engineer you will certainly work with it.
- **Windows**: most desktop programs and games, corporate environments (Active Directory, Office), some engineering software is Windows-only.
- **macOS**: iOS/macOS development (Xcode), video and music work, a Unix-based terminal on ready-made hardware.

The good news: the concepts learned in this course (process, thread, scheduling, paging, file system, permissions) **are the same in all three systems** – only the names and commands differ. Once you understand one, you learn the others quickly.

## Summary

- macOS: XNU (Mach + BSD, IOKit), launchd, QoS classes and P/E cores, memory compression, APFS, SIP, Gatekeeper, Homebrew, Rosetta 2.
- The three systems solve the same tasks with different tools; the table is also a good summary for the exam.

## Exercise

```quiz required
? Which process supervises services and gets PID 1 on macOS?
= launchd
! The counterpart of Linux's systemd.

? Which system does NOT overcommit memory but uses a commit limit instead?
- Linux
+ Windows
- macOS
- all three overcommit
! On Windows, commit limit = RAM + page file.

? What is Rosetta 2 for on macOS?
+ it translates Intel (x86-64) programs into ARM instructions
- it scans for viruses
- it encrypts the disk
- it runs Windows programs
! It is needed on Apple Silicon processors.

? Which system distinguishes upper and lower case in file names by default?
+ Linux
- Windows
- macOS
- none of them
! On Linux Doc.txt and doc.txt are two separate files.
```
