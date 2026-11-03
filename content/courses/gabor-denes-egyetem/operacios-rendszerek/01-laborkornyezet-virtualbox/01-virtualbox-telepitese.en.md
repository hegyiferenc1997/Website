---
title: Virtual Machines and Installing VirtualBox
summary: What a virtual machine is, what your computer needs, and how to install VirtualBox 7.2 step by step.
minutes: 25
---

## What you will learn

- what a **virtual machine**, the **host** and the **guest** system are,
- what **hardware** the lab needs and how to check **hardware virtualization**,
- how to **install VirtualBox** on Windows (and briefly on macOS and Linux).

> This topic is the course's **lab environment**. You can try many commands of the following topics on the Ubuntu and Windows 11 machines installed here – without touching your own computer's system.

## Why a virtual machine?

A **virtual machine** (VM) is a computer "assembled" from software: it has a processor, memory, a disk and a network card, but all of these are provided from the real machine's resources by a program called the **hypervisor**.

| Term             | Meaning                                                    | In our lab                         |
| ---------------- | ---------------------------------------------------------- | ---------------------------------- |
| **host**         | the real computer and the operating system running on it   | your laptop with Windows 11        |
| **guest**        | the operating system running inside the virtual machine    | Ubuntu or Windows 11               |
| **hypervisor**   | the program that runs the virtual machines                 | Oracle VirtualBox 7.2              |
| **ISO file**     | an image of an installation disc in a single file          | `ubuntu-26.04.1-desktop-amd64.iso` |
| **virtual disk** | a big file on the host that the guest sees as a hard drive | `Ubuntu-OS.vdi`                    |

Advantages for a student:

- **you cannot break anything**: if the guest gets ruined, you delete it or restore a snapshot,
- **several systems at once**: use Linux next to Windows without rebooting,
- the same environment as in the lab – you can run your assignments at home the same way.

**VirtualBox** is free, open source (GPLv3), runs on Windows, macOS and Linux, and has a huge number of tutorials – that is why we choose it.

## What does your host need?

| Resource     | Minimum (one VM at a time)        | Recommended          |
| ------------ | --------------------------------- | -------------------- |
| processor    | 64-bit, 4 cores, **VT-x / AMD-V** | 6–8 cores            |
| memory (RAM) | 8 GB                              | **16 GB** or more    |
| free disk    | 60 GB                             | **150 GB on an SSD** |
| system       | Windows 10/11, macOS, Linux       | Windows 11 64-bit    |

Rule of thumb: give the guest **at most half of the RAM and the CPU cores**, otherwise the host slows down.

### Checking hardware virtualization

Modern processors have an extension that makes virtual machines fast: **VT-x** (_Intel Virtualization Technology_) on Intel, **AMD-V** (_SVM Mode_) on AMD. On Windows, check whether it is on:

1. Press **Ctrl + Shift + Esc** (Task Manager).
2. **Performance** tab → **CPU**.
3. Bottom right: **Virtualization: Enabled**.

If it says **Disabled**, turn it on in the computer's **BIOS/UEFI settings**: while rebooting press the vendor's key (often **F2**, **Del**, **F10** or **Esc**), look for _Intel Virtualization Technology_ or _SVM Mode_, set it to **Enabled** and save (**F10**).

### Hyper-V and the "turtle" icon

On Windows, Microsoft's own hypervisor **Hyper-V** may also hold VT-x (it is used e.g. by **WSL 2**, **Docker Desktop** or the **Memory integrity** feature). VirtualBox still starts, but runs slower: a **green turtle** icon at the bottom of the VM window shows this. If it is annoyingly slow, you can disable Hyper-V from starting in an administrator PowerShell:

```powershell
# Run as administrator, then restart the computer.
bcdedit /set hypervisorlaunchtype off
# Turn it back on (e.g. if you use WSL 2 or Docker):
bcdedit /set hypervisorlaunchtype auto
```

As a beginner it is enough to remember: **turtle = works, only slower**.

## Installing VirtualBox on Windows

1. Open **virtualbox.org** → **Downloads** → **Windows hosts**. The downloaded file is called e.g. `VirtualBox-7.2.x-…-Win.exe`.
2. If the installer warns that the **Microsoft Visual C++ Redistributable** is missing, download it from Microsoft's site (x64 version), install it, then restart the VirtualBox installer.
3. Start the installer → **Next**. Keep the default components.
4. Warning: **Network Interfaces** – the network drops for a few seconds during installation. **Yes**.
5. If a message about missing **Python Core / win32api** appears, just click **Yes** – it is only needed for developer add-ons.
6. **Install**, then answer Windows' question (install device software from Oracle) with **Install**.
7. **Finish** – the **VirtualBox Manager**, the interface for managing machines, starts.

The **Extension Pack** is a separately downloadable add-on (e.g. remote desktop, disk encryption); the course **does not need it**. Its licence is free for personal and educational use, paid for business use.

### On a macOS or Linux host

- **macOS**: on the download page choose the _macOS / Intel hosts_ or _macOS / Apple Silicon hosts_ package. On Apple Silicon (M1–M4) only **ARM64** guests run: download Ubuntu's **arm64** ISO; Windows 11 ARM is still limited on this platform.
- **Linux** (e.g. an Ubuntu host): install Oracle's `.deb` package, then add yourself to the `vboxusers` group and log out and back in:

```bash
sudo apt install ./virtualbox-7.2_*.deb
sudo usermod -aG vboxusers $USER
```

## First start

Your virtual machines will appear on the left of the **VirtualBox Manager**, with the important buttons on top: **New**, **Settings**, **Start**. It is worth checking the **Default Machine Folder** in **File → Preferences → General**: virtual disks go there, so it should be on a large, fast (SSD) drive.

The **Host key** is the **right Ctrl** by default: if the guest has "captured" the mouse and keyboard, press right Ctrl to get them back.

## Summary

- A virtual machine is a "software computer" provided by the hypervisor; the host is the real system, the guest is the virtual one.
- It needs a 64-bit processor with **VT-x / AMD-V** enabled; 16 GB RAM and an SSD are recommended.
- The green turtle caused by Hyper-V means a slower but working mode.
- VirtualBox 7.2 can be downloaded from virtualbox.org; the Extension Pack is not needed for the lab.

## Lesson exercise

```quiz required
? What do we call the operating system running inside a virtual machine?
- host
+ guest
- hypervisor
- kernel
! The real machine is the host, the system inside the VM is the guest.

? What is the name of Intel's hardware virtualization extension? (abbreviation)
= VT-x
= vtx
! Intel Virtualization Technology – AMD-V on AMD.

? On a laptop with 16 GB RAM, how many GB of memory should you give a VM at most, by the rule of thumb?
= 8
! The guest gets at most half of the RAM.

? What does the green turtle icon at the bottom of the VM window mean?
- The virtual machine is infected.
- The disk is full.
+ VirtualBox runs through Hyper-V, in a slower mode.
- There is no internet connection.
! Hyper-V holds VT-x; it works, only slower.

? Which key gives the mouse back from the guest by default?
+ right Ctrl
- left Alt
- Windows key
- Esc
! This is the default Host key.
```
