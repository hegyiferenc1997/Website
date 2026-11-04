---
title: Groups of Software
summary: System software, applications, utilities, drivers and firmware – who does what?
minutes: 14
---

## What you will learn

- the difference between **hardware** and **software**,
- what **system software** and **applications** are,
- what a **driver**, **firmware** and a **utility** are.

## Hardware and software

**Hardware** is the physical part of the computer: processor, memory, disk, display. **Software** is the set of programs and their data; it tells the hardware what to do.

## The layers

```text
┌──────────────────────────────────────────────┐
│ applications: browser, Word, Spotify, games  │
├──────────────────────────────────────────────┤
│ utilities: archiver, antivirus, backup       │
├──────────────────────────────────────────────┤
│ operating system + drivers                   │  ← system software
├──────────────────────────────────────────────┤
│ firmware (UEFI, disk and router controllers) │
├──────────────────────────────────────────────┤
│ hardware                                     │
└──────────────────────────────────────────────┘
```

**System software** – needed to run the machine; the user rarely “uses” it directly:

- **operating system** (Windows, macOS, Linux, Android, iOS),
- **driver**: teaches the OS how to talk to a given device (graphics card, printer),
- **firmware**: a low-level program “burnt into” the device, e.g. the motherboard's **UEFI**, which starts the machine when it is switched on.

**Utility** – helps maintain the system: archiver (7-Zip), antivirus, disk cleanup, backup tool.

**Application** – solves a user's task:

| Category        | Examples                             |
| --------------- | ------------------------------------ |
| office          | Word, Excel, PowerPoint, LibreOffice |
| browser         | Chrome, Firefox, Edge, Safari        |
| communication   | Teams, Slack, Discord, e-mail client |
| graphics, media | GIMP, Photoshop, Figma, VLC          |
| development     | VS Code, PyCharm, Git                |
| enterprise      | SAP (ERP), Salesforce (CRM)          |

## Desktop, web and mobile apps

- **desktop (native)**: must be installed, runs directly on the OS (e.g. VS Code),
- **web**: runs in the browser, no installation (e.g. Gmail, Google Docs),
- **mobile**: installed from an app store (App Store, Google Play).

## Summary

- Hardware = the physical part; software = programs and data.
- System software: OS, drivers, firmware. Utility: maintenance. Application: a user's task.
- An application can be desktop, web or mobile.

## Exercise

```quiz required
? Which of these is **system software**?
- Excel
- Spotify
+ a graphics card driver
- Figma
! A driver is part of the OS and handles hardware.

? What is the low-level program built into a device called that, e.g. on a motherboard, starts the machine at power-on?
= firmware
= UEFI
! On today's motherboards it is the UEFI.

? Which one is a **utility**?
- Word
+ the 7-Zip archiver
- Chrome
- Discord
! Utilities help maintain the system.

? Which application runs in the browser, without installation?
- VS Code
- VLC
+ Google Docs
- 7-Zip
! A web application.
```
