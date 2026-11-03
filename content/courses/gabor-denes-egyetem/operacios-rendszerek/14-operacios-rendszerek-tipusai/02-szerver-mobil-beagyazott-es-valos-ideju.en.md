---
title: Server, Mobile, Embedded and Real-Time Systems
summary: Windows Server and Linux on servers, the structure of Android and iOS, embedded systems and RTOS, hard and soft real time.
minutes: 25
---

## What you will learn

- what is typical of **server** operating systems,
- how **Android** and **iOS** are built,
- what **embedded** and **real-time** OSes (RTOS) are, and the difference between **hard** and **soft** real time.

## Server operating systems

A server runs for months or years without stopping, serves many users at once, and typically has **no** graphical interface – it is managed remotely, over SSH or a web interface.

| System                    | Where is it strong?                                              |
| ------------------------- | ---------------------------------------------------------------- |
| **Linux** (Ubuntu Server, RHEL, Debian) | web servers, cloud, containers – the vast majority of machines in the cloud |
| **Windows Server**        | enterprise networks: Active Directory, file sharing, Exchange, .NET applications |
| **FreeBSD**               | network devices, firewalls, streaming (e.g. Netflix's content servers) |

Typical of servers: **long support** (LTS), stability rather than the newest features, remote management, automation (scripts, Ansible).

## Mobile operating systems

- **Android** (Google): built on the **Linux kernel**, above it the hardware abstraction layer (HAL), native libraries, the **ART** runtime (for apps' Kotlin/Java code) and the application framework. Every app runs as a **separate Linux user** in its own sandbox. Open-source base (AOSP), the most widespread OS in the world.
- **iOS / iPadOS** (Apple): built on the same **XNU** kernel and Darwin base as macOS. Closed; apps can only be installed from the App Store (in the EU also from alternative stores), with a strict sandbox.

Mobile specifics: **energy saving** (the OS aggressively suspends background processes), touch screen, sensors, a permission system (camera, location, contacts), memory management tuned for little RAM (the OS may kill an app in the background).

## Embedded systems

An **embedded** system is part of a larger device and does **one job**: washing machine, router, smartwatch, a car's engine controller, smart thermostat. Characteristics: little memory and performance, low power, often runs for years without rebooting.

- on larger devices **embedded Linux** (routers: OpenWrt; smart TVs; Raspberry Pi),
- on microcontrollers a small **RTOS**: **FreeRTOS**, **Zephyr**, or no OS at all ("bare metal", one endless loop).

## Real-time systems

With a **real-time** OS (RTOS) the point is not average speed but **predictability**: a task must finish **by its deadline**.

| Kind                    | If it misses the deadline…                 | Example                                  |
| ----------------------- | ------------------------------------------ | ---------------------------------------- |
| **hard** real time      | **disaster** – the result is worthless or dangerous | airbag, ABS, pacemaker, flight control |
| **soft** real time      | quality degrades, but not fatally          | video playback, online games, VoIP       |

Their tools: **priority-based, preemptive** scheduling, a guaranteed worst-case response time, **priority inheritance** (so a low-priority task holding a lock does not hold up a high-priority one – exactly the bug of the 1997 Mars Pathfinder). General-purpose Linux with **PREEMPT_RT** (part of the mainline kernel since 2024) is suitable for soft and, in many cases, even hard real-time tasks.

## Summary

- Server: stable, long-supported, without a graphical interface; Linux dominates, Windows Server in enterprises too.
- Android: Linux kernel + ART + per-app sandbox; iOS: XNU kernel, closed system.
- Embedded: one job, few resources (embedded Linux, FreeRTOS, Zephyr).
- Real time: deadlines; hard (disaster) and soft (quality loss).

## Lesson exercise

```quiz required
? Which kernel is Android built on?
+ Linux
- XNU
- Windows NT
- MINIX
! Above it the ART runtime and the application framework.

? Which kind of real time does a car's airbag control belong to?
+ hard real time
- soft real time
- batch
- interactive
! Missing the deadline is a disaster.

? Which kind of real time does video playback belong to?
- hard real time
+ soft real time
- neither, it is batch processing
- distributed
! A late frame only degrades quality.

? Name a widespread open-source RTOS for microcontrollers!
= FreeRTOS
= Zephyr
! E.g. FreeRTOS or Zephyr.

? What caused the 1997 Mars Pathfinder software bug?
- it ran out of memory
+ priority inversion (a low-priority task held the lock)
- a virus
- too small a disk
! The fix was turning on priority inheritance.
```
