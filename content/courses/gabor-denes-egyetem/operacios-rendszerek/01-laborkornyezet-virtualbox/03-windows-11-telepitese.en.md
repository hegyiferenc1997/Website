---
title: Installing Windows 11 in VirtualBox
summary: TPM 2.0, UEFI and Secure Boot in the virtual machine, downloading the ISO, the installer and the first setup step by step.
minutes: 40
---

## What you will learn

- what the **hardware requirements** of Windows 11 are (TPM 2.0, UEFI, Secure Boot) and how VirtualBox meets them,
- where to download the installer **legally** and which **licence** you can use,
- how to go through the **installer** and the **first setup** (OOBE).

## Windows 11 requirements

| Requirement   | Minimum                   | In VirtualBox                       |
| ------------- | ------------------------- | ----------------------------------- |
| processor     | 64-bit, 2 cores, 1 GHz    | **2** (better 4) virtual processors |
| memory        | 4 GB                      | **4096 MB** (8192 MB recommended)   |
| storage       | 64 GB                     | **80 GB** dynamic VDI               |
| firmware      | **UEFI**, **Secure Boot** | _Enable EFI_ + _Secure Boot_        |
| security chip | **TPM 2.0**               | virtual (emulated) **TPM v2.0**     |

- **UEFI** is the successor of the old BIOS, the firmware that starts the machine.
- **Secure Boot**: only a digitally signed boot loader may start – so malware cannot insert itself before the system boots.
- **TPM** (_Trusted Platform Module_): a security chip that guards cryptographic keys (used e.g. by BitLocker encryption or Windows Hello).

Since VirtualBox 7 all three are **provided in software** – so you need no tricks or registry hacks.

## 1. Downloading the ISO

1. Open **microsoft.com/software-download/windows11**.
2. Scroll to **Download Windows 11 Disk Image (ISO) for x64 devices** → choose **Windows 11 (multi-edition ISO for x64 devices)** → **Download Now**.
3. Choose the **language** → **Confirm** → **64-bit Download**. The link is valid for 24 hours; the file is about 7 GB.

### Licence – which key?

- **University licence**: many universities give their students a free Windows 11 Education key (e.g. through Microsoft's education programme, _Azure Dev Tools for Teaching_). Ask your department or IT help desk.
- **Without a key**: in the installer you can choose _I don't have a product key_. The system still works, only unactivated: a watermark appears and personalisation (wallpaper, colours) is disabled. Plenty for learning.
- **Evaluation**: after registering on the Microsoft Evaluation Center you can download a 90-day **Windows 11 Enterprise** evaluation.

## 2. Creating the virtual machine

VirtualBox Manager → **New**:

| Field          | Value                                       |
| -------------- | ------------------------------------------- |
| Name           | `Windows11`                                 |
| ISO Image      | the downloaded `Win11_…_x64.iso`            |
| Type / Version | **Microsoft Windows / Windows 11 (64-bit)** |

Tick **Skip Unattended Installation** (see the tip below).

**Hardware**: memory **4096 MB** (with a 16 GB host, **8192 MB**), processors **2–4**, and **Enable EFI (special OSes only)** must be ticked. **Hard disk**: **80 GB**, VDI, dynamic. **Finish**.

Before starting, **check** the settings (**Settings → System → Motherboard**):

- **TPM**: **v2.0**,
- **Enable EFI**: ticked,
- **Enable Secure Boot**: ticked.

The **Windows 11 (64-bit)** profile sets these automatically, but if you created the machine in an older VirtualBox or by hand, add them here. On the **Display** tab video memory should be **128 MB** or more.

> **Tip – unattended installation:** if you do not skip it, VirtualBox asks for the user name, password and edition in advance and installs Windows by itself with a local account. Convenient, but you do not see the steps and it sometimes gets stuck – so it is worth doing it by hand first.

## 3. The installer

1. **Start**. You see: _Press any key to boot from CD or DVD…_ – **press a key immediately** (you have a few seconds).
   - If you missed it and a black **UEFI Shell** or _Boot Manager_ screen appears: **Machine → Reset**, and this time press a key in time.
2. **Language, time and currency format** → Next. **Keyboard** → Next.
3. **Install Windows 11**, and tick that you accept everything will be deleted – again only the **virtual disk**.
4. **Product key**: enter the university key or click **I don't have a product key**.
5. **Edition**: **Windows 11 Pro** (or the one you have a key for, e.g. Education). → Licence terms: **Accept**.
6. **Where to install**: _Drive 0 Unallocated Space_ (80 GB) → **Next** → **Install**.
7. Copying, then several reboots. **Do not press a key now** at the _Press any key_ message, otherwise the installation starts again.

**"This PC can't run Windows 11"** message? It almost always means TPM 2.0, Secure Boot or 4 GB RAM is missing. Stop the machine (**Machine → ACPI Shutdown** or close → _Power off_), add the settings and start again.

## 4. First setup (OOBE)

The _Out-Of-Box Experience_ is the wizard that runs on Windows' first start:

1. **Country/region** and **keyboard layout**; second layout: _Skip_.
2. **Network**: connects automatically thanks to NAT. Windows may then look for updates (a few minutes).
3. **Device name**: e.g. `WIN11-OS` → restarts.
4. **Account**: the first setup of Windows 11 Home and Pro needs a **Microsoft account and internet**. Microsoft removed the earlier loopholes (local account without network) in 2025, so it is simpler to use a free Microsoft account (on Pro: _Set up for personal use_).
5. Create a **PIN** – you will sign in to the guest with it.
6. **Privacy settings**: you can safely turn off optional diagnostics, location and advertising ID → **Accept**.
7. The desktop appears. Run the updates in **Settings → Windows Update**.

If you want a local account later: **Settings → Accounts → Your info → Sign in with a local account instead** (if your version still offers it).

## Summary

- Windows 11 needs **TPM 2.0**, **UEFI + Secure Boot**, 4 GB RAM and 64 GB storage; VirtualBox 7 emulates all of these.
- Download the ISO from Microsoft's site; it can be installed without a key (unactivated), and universities often provide Education keys.
- On first boot press a key quickly at _Press any key_, but not at later reboots.
- OOBE needs a Microsoft account; the requirements error is fixed by correcting the VM settings.

## Lesson exercise

```quiz required
? Which TPM version does Windows 11 need? (number)
= 2.0
= 2
! In VirtualBox: Settings → System → Motherboard → TPM: v2.0.

? What does Secure Boot provide?
- Faster boot from SSD.
+ Only a digitally signed boot loader may start.
- It encrypts the hard disk.
- It turns off the internet during installation.
! So malware cannot insert itself before the operating system starts.

? How many GB of storage is the Windows 11 minimum?
= 64
! In the lesson we create an 80 GB dynamic disk.

? After starting, a black UEFI Shell screen appeared. What should you do?
- Delete the virtual machine.
- Turn off the TPM.
+ Reset the machine and press a key in time at the "Press any key" message.
- Switch the network to bridged.
! It boots from the installer disc only if you press a key within a few seconds.

? What does the "This PC can't run Windows 11" message mean during installation in VirtualBox?
+ One of the requirements (TPM 2.0, Secure Boot, 4 GB RAM) is not set in the VM.
- The host processor is too old, there is no fix.
- The downloaded ISO is fake.
- The host has run out of memory.
! Stop the VM, add the setting and start again.
```
