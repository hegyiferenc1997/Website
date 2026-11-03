---
title: Kernel Architectures
summary: Monolithic kernel, microkernel, hybrid kernel and exokernel – their pros and cons and the real systems (Linux, Windows NT, macOS, MINIX, seL4).
minutes: 25
---

## What you will learn

- which main **kernel architectures** exist,
- their pros and cons in terms of **speed**, **reliability** and **extensibility**,
- which current system belongs to which type, and what the famous **Tanenbaum–Torvalds debate** was.

## Monolithic kernel

In a **monolithic** kernel almost **every** OS service – scheduler, memory management, file systems, network stack, drivers – runs as **one big program**, in kernel mode, in a shared address space.

```text
user space:         [ applications ]  [ shell ]  [ libraries ]
──────────────────────── system calls ───────────────────────────
kernel mode:        [ scheduler | memory | file system | network | drivers ]  ← one program
──────────────────────────────────────────────────────────────────
hardware
```

- **Advantage**: **fast** – the parts reach each other with ordinary function calls.
- **Drawback**: a faulty driver takes down **the whole kernel**; large, complex code.
- **Examples**: **Linux**, classic UNIXes, FreeBSD.

Linux makes this flexible with **loadable modules**: drivers can be loaded and removed at run time – but once loaded they run in kernel mode just the same (next lesson).

## Microkernel

A **microkernel** keeps only the bare essentials in kernel mode: **processes/threads**, **memory address spaces**, **message passing** (IPC), basic scheduling. Everything else – file system, drivers, networking – is a **user-mode server process**, and they communicate via messages.

```text
user space:    [ application ] ⇄ [ file system server ] ⇄ [ disk driver ] ⇄ [ network ]
                                   ↑↓ messages through the kernel ↑↓
kernel mode:   [ microkernel: IPC, scheduling, address spaces ]
```

- **Advantage**: **reliable and secure** – if a driver crashes it can be restarted and the system keeps running; a small kernel is easier to verify (the correctness of the **seL4** microkernel has been proven mathematically).
- **Drawback**: **slower** – every request needs several messages and mode switches.
- **Examples**: **MINIX 3**, **QNX** (cars, industrial systems), **seL4**, the L4 family.

## Hybrid kernel

A **hybrid** kernel has a microkernel-like, modular structure, but for performance it still runs many services (file system, parts of graphics, drivers) in **kernel mode**.

- **Windows NT** (Windows 10/11): the kernel (`ntoskrnl.exe`) consists of the microkernel-like core and the **Executive** above it, all in kernel mode; the **HAL** (hardware abstraction layer) hides hardware differences.
- **macOS / iOS – XNU**: the **Mach** microkernel and the **BSD** UNIX layer in a single kernel-mode program, plus the **IOKit** driver framework.

## Exokernel and unikernel (for interest)

- **Exokernel**: the kernel only **allocates** the hardware safely; abstractions (file, process) are provided to programs by libraries. Mainly a research direction.
- **Unikernel**: the application and the OS parts it needs are compiled into a **single** special program that runs directly on the hypervisor – for tiny, fast services in the cloud.

## The Tanenbaum–Torvalds debate

In 1992 **Andrew S. Tanenbaum** (the author of MINIX) wrote on Usenet: "Linux is obsolete", because it is monolithic and the future belongs to microkernels. **Linus Torvalds** replied that a monolithic kernel is simpler and faster and works better in practice. Both turned out partly right: Linux dominates servers and Android, while microkernels won where reliability matters most (QNX in cars; a version of MINIX runs in the built-in management engine (Intel ME) of Intel processors made since 2015).

## Comparison

| Aspect          | Monolithic    | Microkernel    | Hybrid                  |
| --------------- | ------------- | -------------- | ----------------------- |
| speed           | **high**      | lower          | high                    |
| reliability     | one driver bug stops everything | **high** | medium        |
| kernel size     | large         | **small**      | large                   |
| example         | Linux, FreeBSD | MINIX 3, QNX, seL4 | Windows NT, macOS XNU |

## Summary

- Monolithic: everything in kernel mode, fast, but one bug stops everything (Linux).
- Microkernel: only IPC, scheduling and address spaces in the kernel, the rest are user-mode servers – reliable but slower (MINIX, QNX, seL4).
- Hybrid: modular, but many services in kernel mode (Windows NT, macOS XNU).

## Lesson exercise

```quiz required
? What type of kernel is Linux?
+ monolithic (with loadable modules)
- microkernel
- hybrid
- exokernel
! Every service runs in kernel mode, in a shared address space.

? In which kernel type do the file system and drivers run as user-mode server processes?
- monolithic
+ microkernel
- hybrid
- unikernel
! E.g. MINIX 3, QNX.

? What is the main drawback of a microkernel?
- less reliable
+ slower, because requests need several messages and mode switches
- the kernel is too large
- it does not support drivers
! In exchange a driver crash does not stop the system.

? Around which microkernel is macOS's XNU kernel built?
= Mach
! Besides Mach it also contains a BSD UNIX layer.

? Who wrote MINIX and debated with Linus Torvalds in 1992?
+ Andrew S. Tanenbaum
- Dennis Ritchie
- Richard Stallman
- Dave Cutler
! "Linux is obsolete" – he wrote on Usenet.
```
