---
title: Protection Mechanisms
summary: Updates, firewall, antivirus, disk encryption (BitLocker, LUKS), ASLR and DEP, Secure Boot and TPM – and how to turn them on.
minutes: 25
---

## What you will learn

- why **updates** are the most important protection, and what a **firewall** and an **antivirus** do,
- how **disk encryption** protects (BitLocker, LUKS, FileVault),
- which built-in protections the kernel and hardware provide (**ASLR**, **DEP/NX**, **Secure Boot**, **TPM**, sandbox).

## Updates

Most attacks exploit **known, already fixed** bugs. If the fix is out but you have not installed it, you leave the door open. So:

```bash
sudo apt update && sudo apt upgrade     # Ubuntu
sudo systemctl status unattended-upgrades   # automatic security updates
```

On Windows: **Settings → Windows Update**. LTS releases (Ubuntu 26.04 LTS) and supported Windows versions get fixes for **years** – an outdated system (e.g. Windows 10 since October 2025) does not.

## Firewall

A **firewall** **allows or blocks** network traffic based on rules (e.g. "incoming connections only to port 22"). The principle: whatever is not explicitly allowed is blocked.

```bash
sudo ufw status                 # Ubuntu's "Uncomplicated Firewall"
sudo ufw enable
sudo ufw allow 22/tcp           # allow SSH
```

On Windows: **Windows Defender Firewall** (on by default), in PowerShell `Get-NetFirewallProfile`.

## Antivirus

An **antivirus** searches based on known malware **patterns** (signatures) and suspicious **behaviour**. On Windows the built-in **Microsoft Defender** is enough for most users. Antivirus is used less often on Linux desktops (smaller target, permission model, software coming from the package manager); on servers ClamAV is common.

## Disk encryption

If your laptop is stolen, the password login does not protect you: with the disk removed, **anyone can read it**. **Full disk encryption** prevents this.

| System   | Tool          | Note                                                           |
| -------- | ------------- | -------------------------------------------------------------- |
| Windows  | **BitLocker** (Pro, Education) / device encryption (Home) | the **TPM** guards the key; save the recovery key! |
| Linux    | **LUKS**      | the Ubuntu installer offers it ("Advanced features → encryption") |
| macOS    | **FileVault** | turn on: System Settings → Privacy & Security                  |

## Built-in protections in the kernel and hardware

- **ASLR** (_Address Space Layout Randomization_): the program's stack, heap and libraries are placed at **different addresses** on every start – the attacker cannot know in advance where to jump.
- **DEP / NX bit** (_Data Execution Prevention_): data areas (stack, heap) are **not executable**. Malicious code written via a buffer overflow therefore does not start.
- **Secure Boot**: only a **signed** boot loader and kernel may start (we enabled it for the Windows 11 VM).
- **TPM**: guards cryptographic keys and measures the boot process – if someone changes the boot loader, the BitLocker key is not released.
- **Sandbox**: the program runs in an isolated environment with restricted rights (browser tabs, mobile apps, Windows Sandbox, on Linux AppArmor/SELinux profiles, Flatpak, Snap).

```bash
cat /proc/sys/kernel/randomize_va_space   # 2 = full ASLR enabled
sudo aa-status | head                     # AppArmor profiles on Ubuntu
```

## Summary

- Updates are the most important protection; the firewall filters network traffic, the antivirus filters malware.
- Full disk encryption: BitLocker (with TPM), LUKS, FileVault – protects against theft.
- Kernel and hardware protections: ASLR (random addresses), DEP/NX (data not executable), Secure Boot, TPM, sandbox.

## Lesson exercise

```quiz required
? Which protection makes the stack and heap areas non-executable?
- ASLR
+ DEP / NX bit
- Secure Boot
- firewall
! So code written via a buffer overflow does not start.

? What does ASLR do?
+ It places the program's parts at different memory addresses on every start.
- It encrypts the disk.
- It blocks incoming network traffic.
- It signs the boot loader.
! The attacker cannot know the addresses in advance.

? What is the name of Linux full disk encryption (abbreviation)?
= LUKS
! Linux Unified Key Setup.

? Which command enables Ubuntu's simple firewall?
= sudo ufw enable
! ufw = Uncomplicated Firewall.

? What does full disk encryption protect?
- the running system from viruses
+ the data if the machine is stolen or the disk is removed
- network traffic
- passwords from phishing
! Without the key the disk contents are unreadable.
```
