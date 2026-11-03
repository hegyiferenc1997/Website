---
title: Guest Additions, Sharing and Snapshots
summary: Full screen, shared clipboard and folder, snapshots, network modes and fixing common errors.
minutes: 30
---

## What you will learn

- what the **Guest Additions** provide and how to install them on Ubuntu and Windows,
- how to use the **shared clipboard** and a **shared folder**,
- what a **snapshot** is good for, which **network mode** is for what, and how to fix common errors.

## What are the Guest Additions?

The Guest Additions are **drivers and services** installed into the guest that make it "aware" that it runs in a virtual machine. With them:

- the screen **resizes automatically** with the window, full screen works,
- the mouse moves freely in and out (no right Ctrl needed),
- the **shared clipboard**, **drag and drop** and **shared folders** work,
- the guest clock stays in sync with the host.

## Installing on Ubuntu

1. Open a terminal in the guest and install the packages needed for compiling (the additions build a kernel module):

```bash
sudo apt update
sudo apt install -y build-essential gcc make perl bzip2
```

2. In the VM window's menu: **Devices → Insert Guest Additions CD image…**
3. The disc appears in the file manager. Run the installer from the terminal:

```bash
# The asterisk stands for the exact version number (e.g. VBox_GAs_7.2.10).
cd /media/$USER/VBox_GAs_*
sudo ./VBoxLinuxAdditions.run
# To access shared folders you must be a member of the vboxsf group.
sudo usermod -aG vboxsf $USER
sudo reboot
```

## Installing on Windows 11

1. **Devices → Insert Guest Additions CD image…**
2. Open **File Explorer** → **This PC** → **CD Drive (VirtualBox Guest Additions)**.
3. Run **VBoxWindowsAdditions.exe** → **Next** → **Next** → **Install**.
4. Allow the installation of Oracle's driver (**Install**).
5. **Reboot now** → **Finish**.

## Clipboard, drag and drop, shared folder

- **Shared clipboard**: **Devices → Shared Clipboard → Bidirectional**. Text copied on the host can then be pasted in the guest.
- **Drag and drop**: **Devices → Drag and Drop → Bidirectional** – you can drag files into the window.
- **Shared folder**: **Devices → Shared Folders → Settings** → **+** icon:
  - **Folder Path**: a folder on the host, e.g. `C:\Users\anna\OS-lab`,
  - **Folder Name**: `OS-lab`,
  - tick **Auto-mount** and **Make Permanent**.

In the guest the folder appears here:

| Guest      | Where do you see it?                               |
| ---------- | -------------------------------------------------- |
| Ubuntu     | `/media/sf_OS-lab`                                 |
| Windows 11 | as a network drive, e.g. `Z:` (`\\VBOXSVR\OS-lab`) |

## Snapshots

A **snapshot** saves the complete state of the virtual machine (disk, settings, even memory) at a given moment. If you break something later, you **restore** it with one click.

1. In the VirtualBox Manager, the menu next to the machine's name → **Snapshots**.
2. **Take** → name: `Clean install`, description: date, what is installed.
3. Restore: select the snapshot → **Restore**.

Good habit: take a snapshot **before every bigger experiment** (e.g. before trying the kernel module or permission exercises). A snapshot is not a backup: if the virtual disk file is lost, the snapshots go with it.

## Network modes

| Mode                 | What does it do?                                                            | When is it good?                      |
| -------------------- | --------------------------------------------------------------------------- | ------------------------------------- |
| **NAT** (default)    | the guest reaches the internet, invisible from outside                      | almost always                         |
| **Bridged**          | the guest gets its own IP address on the local network, like a real machine | testing a server from another machine |
| **Host-only**        | only the host and the guests see each other, no internet                    | isolated tests                        |
| **Internal network** | only guests among themselves                                                | networking lab exercises              |

## Shutting down the machine

- **Properly**: _Shut down_ inside the guest (Ubuntu: top-right menu; Windows: Start → Power). This is the safest.
- **Save the machine state**: close the window → _Save the machine state_ – like hibernation, next time you continue where you left off.
- **Power off**: like pulling the power cable; only if the guest has frozen.

## Common errors and fixes

| Error                                         | Fix                                                                        |
| --------------------------------------------- | -------------------------------------------------------------------------- |
| _VT-x is not available_ / _AMD-V is disabled_ | enable virtualization in BIOS/UEFI (lesson 1)                              |
| very slow, green turtle                       | Hyper-V: `bcdedit /set hypervisorlaunchtype off`, reboot                   |
| black screen with a Windows guest             | Display: controller **VBoxSVGA**, 3D acceleration off, 128 MB video memory |
| UEFI Shell at boot                            | no ISO attached, or _Press any key_ was missed → **Machine → Reset**       |
| "This PC can't run Windows 11"                | TPM 2.0, EFI, Secure Boot, 4 GB RAM (lesson 3)                             |
| the shared folder does not open on Ubuntu     | `sudo usermod -aG vboxsf $USER`, then reboot                               |
| the host ran out of space                     | delete old snapshots, or move the machine folder to a bigger drive         |

## Summary

- The Guest Additions provide automatic resizing, the shared clipboard and shared folders.
- `VBoxLinuxAdditions.run` installs them on Ubuntu, `VBoxWindowsAdditions.exe` on Windows.
- A snapshot is a quick restore point, not a full backup.
- NAT is enough for most tasks; bridged mode makes the guest a full member of the local network.

## Lesson exercise

```quiz required
? Which file installs the Guest Additions on an Ubuntu guest?
= VBoxLinuxAdditions.run
= ./VBoxLinuxAdditions.run
! From the inserted CD, run it with sudo.

? Which group must you be a member of on Ubuntu to access shared folders?
= vboxsf
! sudo usermod -aG vboxsf $USER

? Where does an auto-mounted shared folder named "OS-lab" appear on Ubuntu?
- /home/OS-lab
+ /media/sf_OS-lab
- /mnt/c/OS-lab
- /etc/OS-lab
! Auto-mounted folders get the sf_ prefix.

? In which network mode does the guest get its own IP address on the local network?
- NAT
+ Bridged
- Host-only
- Internal network
! In bridged mode the guest looks like another real machine.

? Which statement about snapshots is true?
- It is a full backup stored on a separate drive.
+ It is a restore point; if the virtual disk file is lost, it is lost too.
- It only saves the memory contents.
- It only works with Windows guests.
! So keep important files on the host as well, via the shared folder.
```
