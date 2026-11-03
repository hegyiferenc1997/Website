---
title: Graphical User Interfaces
summary: Windows, desktop environments, X11 and Wayland, and how Windows and macOS draw the screen.
minutes: 15
---

## What you will learn

- what a **graphical user interface** (GUI) and the **WIMP** principle are,
- the difference between a **window manager**, a **display server** and a **desktop environment**,
- how the graphical interfaces of Linux, Windows and macOS differ.

## GUI and WIMP

A **GUI** (_Graphical User Interface_) offers **visual elements** instead of typed commands. Its basic principle is **WIMP**: _Windows_, _Icons_, _Menus_, _Pointer_. It was developed by Xerox PARC researchers in the 1970s and made popular by the Apple Macintosh (1984) and Windows.

| Aspect         | CLI                                | GUI                       |
| -------------- | ---------------------------------- | ------------------------- |
| learning       | harder, you must know the commands | easier, "discoverable"    |
| speed          | faster in practised hands          | many clicks               |
| automation     | easy (scripts)                     | hard                      |
| resource needs | small                              | larger (graphics, memory) |

Today's systems have both, and they **complement each other**. Touch (mobile) interfaces and voice control are also user interfaces.

## The graphical "layers" of Linux

On Linux, graphics consist of several replaceable parts:

```text
applications (Firefox, Files)
  ↓
desktop environment: GNOME, KDE Plasma, Xfce   ← panels, menus, settings, own programs
  ↓
compositor / window manager                    ← where the window is, its frame, overlaps
  ↓
display protocol: Wayland (new) or X11 (old)
  ↓
kernel: DRM/KMS graphics driver → graphics card
```

- **X11** (X Window System, 1987): network-based, old, with many security weaknesses (any program can "eavesdrop" on the keyboard).
- **Wayland**: the modern successor; simpler, more secure, used by Ubuntu by default.
- **Desktop environment**: Ubuntu uses **GNOME**; Kubuntu uses **KDE Plasma**, Xubuntu the lightweight **Xfce**.

In the Ubuntu VM:

```bash
echo $XDG_SESSION_TYPE     # wayland or x11
echo $XDG_CURRENT_DESKTOP  # e.g. ubuntu:GNOME
```

## Windows and macOS

- **Windows**: graphics are an integral part of the system. The **Desktop Window Manager** (`dwm.exe`) is the compositor, **Explorer** (`explorer.exe`) provides the taskbar and the Start menu. If Explorer freezes, it can be restarted in Task Manager – the system keeps running.
- **macOS**: the **Quartz Compositor** draws, **Finder** is the file manager, the **Dock** is the application bar.

## Summary

- The basic principle of a GUI is WIMP: windows, icons, menus, pointer.
- On Linux graphics are layered: display protocol (X11/Wayland) → compositor → desktop environment (GNOME, KDE, Xfce).
- On Windows `dwm.exe` and `explorer.exe`, on macOS Quartz and Finder provide the interface.

## Lesson exercise

```quiz required
? What does the P stand for in the acronym WIMP?
- Program
+ Pointer
- Process
- Panel
! Windows, Icons, Menus, Pointer.

? Which modern Linux display protocol replaces X11?
= Wayland
! Ubuntu uses Wayland by default.

? Which desktop environment does Ubuntu use by default?
+ GNOME
- KDE Plasma
- Xfce
- Aqua
! Kubuntu uses KDE, Xubuntu uses Xfce.

? Which Windows process provides the taskbar and the Start menu?
- dwm.exe
+ explorer.exe
- svchost.exe
- wininit.exe
! dwm.exe is the compositor, explorer.exe is Explorer.
```
