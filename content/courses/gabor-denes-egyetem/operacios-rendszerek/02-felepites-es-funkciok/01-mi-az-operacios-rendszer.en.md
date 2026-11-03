---
title: What Is an Operating System?
summary: The two faces of the OS – resource manager and extended machine – and the main milestones of its history.
minutes: 15
---

## What you will learn

- what an **operating system** (OS) is and where it sits between the hardware and the programs,
- what it means that the OS is a **resource manager** and an **extended (abstract) machine**,
- which **eras** operating systems went through.

## The definition

An **operating system** is the software that **manages the computer's hardware** and **provides services** to user programs. Without it, every program would have to know by itself how to read a disk or talk to a network card.

```text
┌──────────────────────────────────────────┐
│   user                                   │
├──────────────────────────────────────────┤
│   applications (browser, VS Code, game)  │
├──────────────────────────────────────────┤
│   system programs (shell, file manager)  │
├──────────────────────────────────────────┤
│   OPERATING SYSTEM (kernel)              │
├──────────────────────────────────────────┤
│   hardware (CPU, memory, disk, network)  │
└──────────────────────────────────────────┘
```

The most important part of the OS, always in memory, is the **kernel**. The rest (shell, utilities, graphical interface) is built on the kernel.

## The two faces of the OS

**1. Extended machine (abstraction).** Hardware is complicated and ugly: an SSD has to be handled in blocks, through registers. Instead the OS offers nice, simple concepts: **file**, **process**, **socket**, **window**. The programmer writes "open `notes.txt`" and does not need to know where it is on the disk.

**2. Resource manager.** Many programs run on a machine at the same time, and all of them ask for CPU time, memory, disk and network. The OS **shares and protects** these:

- **time multiplexing**: programs get the processor in turns (scheduling),
- **space multiplexing**: memory and disk are divided into parts,
- **protection**: one program cannot write into another one's memory.

## A short history

| Era       | Characteristic                                                           | Example                         |
| --------- | ------------------------------------------------------------------------ | ------------------------------- |
| 1940s–50s | no OS, the program is loaded with switches and punched cards             | ENIAC                           |
| 1950s–60s | **batch** processing: jobs run one after another                         | IBM 7094, FMS                   |
| 1960s     | **multiprogramming** and **time-sharing**: many programs, many terminals | IBM OS/360, CTSS, MULTICS       |
| 1970s     | **UNIX** (written in C, portable)                                        | UNIX, later BSD                 |
| 1980s     | personal computers, graphical interface                                  | MS-DOS, Mac OS, Windows         |
| 1990s     | open source, networking, 32 bits                                         | **Linux** (1991), Windows NT    |
| 2000s–    | mobile, virtualization, cloud, multi-core processors                     | Android, iOS, Windows 11, macOS |

Today's Linux and macOS are the intellectual heirs of UNIX; Windows comes from the Windows NT line.

## Summary

- The OS manages the hardware and provides services to programs; its most important part is the **kernel**.
- Two faces: **extended machine** (abstractions: file, process) and **resource manager** (sharing, protection).
- Main steps: batch → multiprogramming and time-sharing → UNIX → PC and GUI → Linux, NT → mobile and cloud.

## Lesson exercise

```quiz required
? What is the most important part of the operating system, always in memory, called?
= kernel
! The kernel manages the hardware directly.

? Which is an example of the OS's "extended machine" role?
- It gives CPU time to programs in turns.
+ It shows files and folders instead of disk blocks.
- It prevents a program from writing into another one's memory.
- It prints the error message.
! Abstraction: a simple concept instead of complicated hardware.

? In which year did the first version of the Linux kernel appear?
= 1991
! Linus Torvalds, Helsinki, 1991.

? What is time multiplexing in resource management?
+ Programs get the processor in turns, one after another.
- Memory is divided between the programs.
- Files are copied into several folders.
- Users take turns sitting at the machine.
! Space multiplexing is dividing memory and disk.
```
