---
title: Windows from the Inside
summary: The concepts learned in Windows – NT architecture and HAL, booting, 32 priority levels, the page file and commit limit, NTFS and ACLs, the registry, UAC, winget and WSL.
minutes: 25
---

## What you will learn

- how the **Windows NT** architecture is built,
- how Windows schedules, manages memory, stores files and protects itself,
- what the **registry**, **UAC**, **winget** and **WSL** are.

## The NT architecture

Windows has a **hybrid kernel** (topic 13). Its layers from the bottom up:

- **HAL** (_Hardware Abstraction Layer_, `hal.dll`): hides the differences between hardware (interrupt controller, timers);
- the **kernel** and the **Executive** (both in `ntoskrnl.exe`): scheduling, object manager, memory manager, I/O manager, process manager, Security Reference Monitor;
- **drivers** (`.sys`) and the graphics part (`win32k.sys`) – also in kernel mode;
- in user mode `ntdll.dll` (the gateway to system calls, topic 9), the **Win32 API** (`kernel32.dll`, `user32.dll`), system processes and services.

## Booting

UEFI → **Windows Boot Manager** (`bootmgfw.efi`) → `winload.efi` → the **kernel** (`ntoskrnl.exe`) → `smss.exe` (session manager) → `csrss.exe`, `wininit.exe` → `services.exe` (services), `lsass.exe` (sign-in, passwords) → `winlogon.exe` → after sign-in `explorer.exe` (desktop, taskbar). The kernel's own threads run in the **System** process, whose PID is always **4**.

## Processes, threads and scheduling

Windows creates a process with a single call (`CreateProcess`, there is no `fork`), and the **unit of scheduling is the thread**. The scheduler is **priority-based and preemptive** and uses **32 priority levels**:

- **16–31**: real-time levels,
- **1–15**: variable levels – the system temporarily raises (_boosts_) e.g. the threads of the foreground window or threads that were waiting for I/O,
- **0**: the system thread that zeroes memory pages.

Within one level scheduling is round robin. In Task Manager's **Details** tab: right click → **Set priority**.

## Memory

Demand paging with 4 KiB pages. The page file is `C:\pagefile.sys`. Unlike Linux, Windows does **not overcommit**: the **commit limit** = RAM + page file, and it never promises programs more memory than that – when it runs out, the allocation fails with an error. Since Windows 10 it also **compresses** rarely used pages in memory before writing them to disk.

## File system

**NTFS**: a journaling file system with **drive letters** (`C:\`, `D:\`), backslashes and case-insensitive file names. Permissions are described by **access control lists** (**ACLs**): each file has entries saying which user or group may do what (read, write, modify, full control) – more fine-grained than Unix `rwx` permissions.

## The registry

The settings of Windows and programs are kept in a hierarchical database, the **registry**, instead of the text files in Linux's `/etc`. Its main branches: **HKEY_LOCAL_MACHINE** (machine-wide) and **HKEY_CURRENT_USER** (the signed-in user's). Its editor is `regedit` – be careful, a wrong change can make the system unbootable.

```powershell
Get-ItemProperty 'HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion' | Select-Object ProductName, DisplayVersion
```

## Security

- **UAC** (User Account Control): even an administrator works with limited rights, and the system asks for confirmation for system-wide operations – this corresponds to Linux's `sudo`.
- **Microsoft Defender** antivirus and firewall, **BitLocker** disk encryption.
- **TPM 2.0** and **Secure Boot** – which is why you had to enable them for the Windows 11 VM (topic 1). **VBS** (virtualisation-based security) uses the hypervisor from topic 16 to protect the kernel.

## Installing software and WSL

Install from the **Microsoft Store**, from an installer (`.exe`, `.msi`), or from the command line with the **winget** package manager:

```powershell
winget search vscode
winget install Microsoft.VisualStudioCode
winget upgrade --all
```

**WSL 2** (_Windows Subsystem for Linux_) runs a real Linux kernel in a lightweight Hyper-V virtual machine: after `wsl --install` an Ubuntu terminal runs alongside Windows.

## Summary

- NT: HAL → kernel + Executive (`ntoskrnl.exe`) → drivers; in user mode `ntdll.dll`, Win32 API.
- Boot: Boot Manager → winload → kernel → smss → services, lsass, winlogon → explorer; the System process has PID 4.
- `CreateProcess`, the thread is the unit of scheduling, 32 priority levels (16–31 real-time, boosts).
- `pagefile.sys`, no overcommit (commit limit), memory compression; NTFS + ACLs; registry; UAC, Defender, BitLocker, TPM; winget, WSL 2.

## Exercise

```quiz required
? How many priority levels does the Windows scheduler use?
= 32
! 0–31: 16–31 are real-time, 1–15 variable.

? What is the PID of the Windows System process?
= 4
! The kernel's own threads run in it.

? How does Windows calculate the commit limit?
+ as the sum of physical RAM and the page file size
- as twice the RAM
- as the page file size only
- unlimited, like overcommit on Linux
! It never promises programs more memory than that.

? What corresponds to Linux's sudo command on Windows?
+ UAC (User Account Control)
- BitLocker
- winget
- regedit
! It asks for confirmation for system-wide operations.
```
