---
title: The Tasks of an Operating System
summary: What the OS does, and how Windows, macOS, Linux, Android and iOS differ.
minutes: 14
---

## What you will learn

- what an **operating system** is and what its main **tasks** are,
- what the **kernel** and the **user interface** are,
- which operating systems are common today and how they differ.

## What is an operating system?

The **operating system (OS)** is the base software between the hardware and the applications. Without it every program would have to handle the disk, the keyboard and the network itself. Its most important, always-running part is the **kernel**.

## Main tasks

| Task                   | What it means in practice                                             |
| ---------------------- | --------------------------------------------------------------------- |
| **process management** | several programs run “at once”, taking turns on the processor         |
| **memory management**  | every program gets its own memory area and can't write into another's |
| **file management**    | we see files and folders on the disk, not raw blocks                  |
| **device management**  | handles the printer, camera and network card through drivers          |
| **user management**    | accounts, passwords, permissions                                      |
| **user interface**     | graphical (GUI) or command-line (CLI) control                         |

## User interface: GUI and CLI

- **GUI** (Graphical User Interface): windows, icons, mouse, touch. Easy to learn.
- **CLI** (Command Line Interface): text commands (PowerShell, Terminal, bash). Fast, scriptable; most servers are managed this way.

## Today's systems

| System     | Vendor / origin                          | Typical area                          | Licence                          |
| ---------- | ---------------------------------------- | ------------------------------------- | -------------------------------- |
| Windows 11 | Microsoft                                | desktops, offices, gaming             | commercial                       |
| macOS      | Apple (UNIX-based)                       | Macs, creative work                   | commercial (with Apple hardware) |
| Linux      | open community (Ubuntu, Fedora, Debian…) | servers, cloud, development, embedded | open (GPL)                       |
| Android    | Google (Linux kernel)                    | smartphones, tablets                  | mostly open                      |
| iOS        | Apple                                    | iPhone                                | commercial                       |

Most web servers and the cloud run on Linux, Windows is the most common on desktops, and Android on phones.

Operating systems have their own course in the curriculum; here we look at the basics for users and operators.

## Summary

- The OS is the base software between hardware and programs; its core is the kernel.
- Its tasks: process, memory, file, device and user management, user interface.
- GUI = graphical, CLI = command-line interface.

## Exercise

```quiz required
? What is the always-running core of the operating system called?
= kernel
! The kernel handles the hardware directly.

? Which OS task makes sure a program can't write into another program's memory?
- file management
+ memory management
- device management
- user interface
! Every process gets its own protected memory area.

? Which operating system is built on the Linux kernel?
- iOS
- Windows 11
+ Android
- macOS
! Android's kernel is Linux.

? What does the abbreviation CLI stand for?
= Command Line Interface
! An interface controlled with text commands.
```
