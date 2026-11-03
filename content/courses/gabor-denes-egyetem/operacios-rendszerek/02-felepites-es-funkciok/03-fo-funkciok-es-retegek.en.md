---
title: Main Functions and Layers of the Operating System
summary: Process, memory, file, I/O and security management – and how the OS is built up.
minutes: 20
---

## What you will learn

- what the **main functions** (subsystems) of the OS are and what each does,
- how an operating system is built up in **layers**,
- where you meet these functions in everyday life.

## The main functions

| Subsystem                     | Task                                                         | Where do you see it?      |
| ----------------------------- | ------------------------------------------------------------ | ------------------------- |
| **process management**        | starting, stopping, scheduling and connecting programs       | Task Manager, `ps`, `top` |
| **memory management**         | allocating, reclaiming and protecting memory, virtual memory | "memory usage 63%"        |
| **file management**           | files, folders, permissions, file systems                    | File Explorer, `ls`, `cd` |
| **I/O and device management** | drivers, buffering, print queue                              | Device Manager, `lsusb`   |
| **network management**        | protocols (TCP/IP), network interfaces                       | Wi-Fi icon, `ip addr`     |
| **protection and security**   | users, permissions, authentication, logging                  | login, UAC, `sudo`        |
| **user interface**            | command line and graphical interface                         | desktop, terminal         |

The following topics of the course go through these one by one – this lesson is the "map".

## Layers

An OS is often described as **layers**: each layer uses only the services of the layer below it.

```text
6. user programs
5. user interface (shell, GUI)
4. file system
3. I/O management, buffers
2. memory management (virtual memory)
1. process management, scheduling, interrupts
0. hardware
```

This model (from Dijkstra's THE system, 1968) makes the structure easy to understand: the file system does not need to know how the processor is scheduled, it just uses the memory and I/O layers.

Real systems are not this strictly layered. Today's main kernel designs (**monolithic**, **microkernel**, **hybrid**) get their own topic with the kernel and user space.

## Services from a program's point of view

When you run a simple `python notes.py`, the OS:

1. **loads** the Python interpreter into memory (memory management),
2. creates a new **process** and gives it time on the processor (process management),
3. opens the `notes.py` **file** and checks whether you have the right to it (file management, protection),
4. sends the output of `print` to the **terminal** (I/O),
5. at the end of the program **frees** the memory and closes the files.

## Summary

- Main functions: process, memory, file, I/O, network and security management, plus the user interface.
- In the layered model each layer builds only on the one below.
- Running a program uses almost every subsystem of the OS.

## Lesson exercise

```quiz required
? Which subsystem manages virtual memory?
- process management
+ memory management
- file management
- network management
! Memory management allocates, protects and (virtually) extends memory.

? Which subsystem decides which program gets the processor next?
+ process management (scheduler)
- file management
- I/O management
- user interface
! The scheduler is part of process management.

? In the layered model, which layer is at the bottom (level 0)?
= hardware
! Scheduling, memory management etc. build on it.

? Who designed the layered THE operating system in 1968?
- Linus Torvalds
- Bill Gates
+ Edsger W. Dijkstra
- Ken Thompson
! The Dutch Dijkstra at Eindhoven University of Technology.
```
