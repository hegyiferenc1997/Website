---
title: Installing Ubuntu 26.04 LTS in VirtualBox
summary: Download, verification, creating the virtual machine and the Ubuntu installer screen by screen.
minutes: 35
---

## What you will learn

- why **Ubuntu Desktop 26.04 LTS** is the best first Linux,
- how to download and **verify** the installer ISO,
- how to create the **virtual machine** and go through the **installer**.

## Why Ubuntu LTS?

- **Beginner-friendly**: graphical installer, many languages, lots of programs in one click (App Center).
- **LTS** = _Long Term Support_: 5 years of free security updates (even longer with free Ubuntu Pro). 26.04 ("Resolute Raccoon") was released in April 2026; with the **26.04.1** point release it is mature.
- **Huge community**: there is a guide for almost every problem, and most teaching material is made for Ubuntu.

If somewhere the older **24.04 LTS** is required, the steps are the same.

## 1. Downloading and verifying the ISO

1. Open **ubuntu.com/download/desktop** and download **Ubuntu 26.04.1 LTS** (about 6 GB, file name: `ubuntu-26.04.1-desktop-amd64.iso`).
2. On the same page, the _Verify your download_ / **SHA256SUMS** link gives the file's **checksum**.
3. Compute the checksum of your download in PowerShell and compare:

```powershell
# We are in the Downloads folder; the Hash value must match the one in SHA256SUMS.
cd $HOME\Downloads
Get-FileHash .\ubuntu-26.04.1-desktop-amd64.iso -Algorithm SHA256
```

If the value differs, the download is corrupted (or came from an untrusted source) – download it again. This is **hash verification**; we return to it in the security topic.

## 2. Creating the virtual machine

In the VirtualBox Manager: **New**.

**Virtual machine name and operating system**

| Field           | Value                                         |
| --------------- | --------------------------------------------- |
| Name            | `Ubuntu-OS`                                   |
| Folder          | keep the default machine folder               |
| ISO Image       | browse to the downloaded `ubuntu-26.04.1-desktop-amd64.iso` |
| Type / Version  | VirtualBox detects it: **Linux / Ubuntu (64-bit)** |

Tick **Skip Unattended Installation**. This way you go through the installer yourself – you learn the most from it, and you do not get a preconfigured (`vboxuser`) user.

**Hardware**

| Setting       | Value                                          |
| ------------- | ---------------------------------------------- |
| Base Memory   | **4096 MB** (if the host has 16 GB: 6144–8192 MB) |
| Processors    | **2** (with 8+ cores: 4)                       |
| EFI           | can stay off (not required for Ubuntu)         |

**Virtual hard disk**

- **Create a Virtual Hard Disk Now**, size: **40 GB** (25 GB is the minimum, but updates need room).
- File type: **VDI**, and do **not** tick _Pre-allocate Full Size_: the file is then only as big as what the guest really uses (a **dynamically allocated** disk).

**Finish**. Before starting, open the machine's **Settings**:

- **Display → Screen**: video memory **128 MB**, graphics controller **VMSVGA**, 3D acceleration off.
- **General → Advanced**: shared clipboard and drag'n'drop: **Bidirectional** (works after Guest Additions).
- **Network**: keep **NAT** – this gives the guest internet access.

## 3. The installer

Select the machine → **Start**. In the GRUB menu keep **Try or Install Ubuntu** (Enter, or wait).

1. **Language**: English (or your language) → Next.
2. **Accessibility**: if not needed, Next.
3. **Keyboard layout**: choose yours (e.g. **English (US)** or **Hungarian**). You can test it in the text box.
4. **Internet connection**: _Wired connection_ – it already works thanks to NAT.
5. **Install Ubuntu** (not try).
6. **Type of installation**: **Interactive installation**.
7. **Applications**: **Default selection** (browser and basic tools). Ticking _third-party software_ (drivers, codecs) is optional.
8. **Disk setup**: **Erase disk and install Ubuntu**. Relax: this only erases the **40 GB virtual disk**, not the files on your host!
9. **Create your account**:
   - full name (e.g. `Anna Kiss`), computer name (e.g. `ubuntu-os`),
   - **username**: lowercase, no accents or spaces (e.g. `anna`),
   - password – remember it, `sudo` commands need it too.
10. **Time zone**: yours (e.g. **Budapest**).
11. **Review** → **Install**. 10–20 minutes.
12. **Restart now**. If the _Please remove the installation medium_ message appears, press **Enter** – VirtualBox ejects the virtual disc by itself.

## 4. First login and update

After logging in, a welcome wizard guides you (Ubuntu Pro, data collection – you can safely turn the latter off). Then open a **terminal** (**Ctrl + Alt + T**) and update the system:

```bash
# Refresh the package list, then upgrade every package (asks for your password).
sudo apt update
sudo apt upgrade -y
# Which version is running? (release information)
lsb_release -a
```

If the window is small and does not follow resizing: that is normal; installing the **Guest Additions** fixes it (lesson 4).

## Summary

- Ubuntu 26.04.1 LTS is a beginner-friendly distribution supported for 5 years.
- We verify the downloaded ISO with a **SHA256** checksum (`Get-FileHash`).
- Suggested VM: 4 GB RAM, 2 processors, 40 GB dynamic VDI, unattended installation skipped.
- "Erase disk" only applies to the virtual disk; after installing run `sudo apt update && sudo apt upgrade`.

## Lesson exercise

```quiz required
? What does LTS mean for Ubuntu versions?
- Linux Terminal Server
+ Long Term Support
- Latest Test System
- Light Text Shell
! LTS releases get free updates for 5 years.

? Which PowerShell command computes the SHA256 checksum of a file?
= Get-FileHash
! Get-FileHash <file> -Algorithm SHA256

? How many GB virtual disk does the lesson suggest for Ubuntu?
= 40
! 25 GB is the minimum, but updates need room too.

? What happens if you choose "Erase disk and install Ubuntu" in the installer?
- The host (laptop) files are deleted.
+ Only the virtual machine's own virtual disk is erased.
- VirtualBox uninstalls itself.
- Nothing, it is just a test.
! The guest only sees its own virtual disk.

? Which command refreshes the package list on Ubuntu?
+ sudo apt update
- sudo apt remove
- apt list --upgradable --delete
- sudo reboot
! apt update refreshes the list, apt upgrade installs the updates.
```
