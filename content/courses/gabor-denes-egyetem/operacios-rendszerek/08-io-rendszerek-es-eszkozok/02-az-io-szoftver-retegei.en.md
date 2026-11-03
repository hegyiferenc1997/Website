---
title: The Layers of I/O Software
summary: Drivers, the device-independent layer, buffering, caching, spooling, blocking, non-blocking and asynchronous I/O.
minutes: 20
---

## What you will learn

- which **layers** the OS's I/O software consists of and the role of the **device driver**,
- what **buffering**, **caching** and **spooling** are for,
- the difference between **blocking**, **non-blocking** and **asynchronous** I/O.

## The layers

```text
user program:              printf("hello"), opening a file
  ↓
user libraries:            C library (libc), buffered stdio
  ↓
device-independent layer:  uniform naming (/dev/sda), permissions, buffers, cache, error handling
  ↓
device driver:             the commands of the specific device
  ↓
interrupt handler
  ↓
hardware (controller, device)
```

## The device driver

A **device driver** is the part of the OS that handles a **specific device type**: it knows the controller's registers and commands. Towards the OS it provides a **uniform interface** (e.g. "read a block"), so the file system does not need to know whether it is a SATA SSD or a USB stick.

- Usually written by the **manufacturer** (graphics card, Wi-Fi, printer).
- Runs in **kernel mode** – a faulty driver can crash the whole system. Many Windows "blue screen" (BSOD) crashes come from faulty drivers.

Where do you see them?

```bash
lsmod | head            # Linux: loaded kernel modules (many of them drivers)
lspci -k | head -20     # which driver handles which PCI device
```

On Windows: **Device Manager** (Win + X → Device Manager) – a yellow exclamation mark shows a missing or faulty driver.

## Buffering, caching, spooling

- **Buffering**: data is collected temporarily in a memory area. Reasons: producer and consumer speeds differ (video downloaded from the network), or sizes differ (the program writes byte by byte, the disk works in blocks). With **double buffering** one buffer is filled while the other is emptied – so there are no stalls.
- **Cache**: copies of frequently read disk blocks are kept in RAM. That is why the **second** start of a program is faster. On Linux the "buff/cache" column of `free -h` shows it – this is **not wasted** memory, it is freed immediately when needed.
- **Spooling**: a device that can serve only one user at a time (a printer) gets a **queue** on disk in front of it. Everyone can "print" at once; the print spooler service passes on the jobs one by one.

## Blocking, non-blocking, asynchronous

| Kind             | What does the call do?                                            | Example                                 |
| ---------------- | ----------------------------------------------------------------- | --------------------------------------- |
| **blocking**     | the process **waits** (waiting state) until the I/O is done       | `input()` in Python, `read()`           |
| **non-blocking** | **returns immediately** with whatever is available (even nothing) | network socket in non-blocking mode     |
| **asynchronous** | starts the I/O, returns immediately and **notifies later**        | `async`/`await`, io_uring, Windows IOCP |

Blocking is the simplest to program; a busy web server, however, serves thousands of connections on a single thread with asynchronous I/O.

## Summary

- Layers: program → library → device-independent layer → driver → interrupt handler → hardware.
- The driver provides a uniform interface to the device; it runs in kernel mode, and its bugs can cause crashes.
- Buffer: bridging speed and size differences; cache: frequent data in RAM; spool: a queue in front of the printer.
- Blocking: waits; non-blocking: returns immediately; asynchronous: notifies later.

## Lesson exercise

```quiz required
? Which software layer knows the registers and commands of a specific device?
- the user library
- the device-independent layer
+ the device driver
- the shell
! It provides a uniform interface towards the OS.

? Which technique puts a queue on disk in front of a printer?
+ spooling
- caching
- DMA
- paging
! Simultaneous Peripheral Operations On-Line.

? Why is the second start of a program faster?
- Because the program got smaller.
+ Because its files stayed in the disk cache (RAM).
- Because the disk warmed up.
- Because the OS turned off protection.
! The cache keeps frequently read blocks in memory.

? In which Windows tool do you see missing drivers (yellow exclamation mark)?
= Device Manager
= devmgmt.msc
! Win + X → Device Manager.

? With which kind of I/O does the operation start, the call returns immediately and the program is notified later?
- blocking
- non-blocking
+ asynchronous
- polling
! E.g. async/await, io_uring.
```
