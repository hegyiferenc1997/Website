---
title: Practice – the Lab Environment
summary: Checklist for the finished lab, review questions and a summary worksheet.
minutes: 20
kind: practice
---

## Checklist: is the lab ready?

- [ ] Task Manager shows **Virtualization: Enabled**.
- [ ] **VirtualBox 7.2** is installed.
- [ ] The **Ubuntu-OS** machine runs, updated (`sudo apt update && sudo apt upgrade`), with Guest Additions.
- [ ] The **Windows11** machine runs (TPM 2.0, Secure Boot), updated, with Guest Additions.
- [ ] Both machines have a **"Clean install"** snapshot.
- [ ] A **shared folder** works between the host and the guests.

Try these in the Ubuntu terminal – they come up in the following topics too:

```bash
uname -a        # kernel name and version
free -h         # how much memory the guest got
nproc           # how many processor cores it sees
df -h /         # how much space is on the root file system
```

On Windows 11 in PowerShell:

```powershell
Get-ComputerInfo -Property OsName, OsVersion
Get-Tpm          # as administrator: TpmPresent = True
Confirm-SecureBootUEFI   # as administrator: True
```

## Review questions

Try to answer in your head first, only then open the answer!

<details>
<summary>1. Why is it better to experiment in a virtual machine than on your own computer?</summary>

Because the guest is isolated from the host: if you break it, you delete it or restore a snapshot, and your own system and files stay untouched.

</details>

<details>
<summary>2. What is the difference between NAT and bridged network mode?</summary>

With NAT the guest reaches the internet behind the host, using its address, and is invisible from outside. In bridged mode it gets its own IP address on the local network, so other machines can reach it.

</details>

<details>
<summary>3. Why does Windows 11 need TPM 2.0 and Secure Boot, and where does VirtualBox get them from?</summary>

Microsoft requires them for security: Secure Boot only starts a signed boot loader, the TPM guards keys (BitLocker, Windows Hello). VirtualBox 7 emulates both in software (Motherboard tab: TPM v2.0, EFI, Secure Boot).

</details>

<details>
<summary>4. Why did we skip the unattended installation?</summary>

To see and understand the installer's steps (language, disk, account) and not get an automatically created user. Later, once it is familiar, unattended mode is faster.

</details>

<details>
<summary>5. What does it mean if the dynamically allocated 40 GB VDI file is only 12 GB on the host?</summary>

That the guest has written only about 12 GB to its disk so far. The file grows with use, up to 40 GB.

</details>

## Summary worksheet

```quiz required
? What do we call the program that runs virtual machines (e.g. VirtualBox)?
= hypervisor
= virtual machine monitor
= vmm
! Hypervisor (Virtual Machine Monitor).

? On Ubuntu, which command installs the updates after refreshing the package list?
- sudo apt update
+ sudo apt upgrade
- sudo apt search
- sudo apt purge
! First apt update, then apt upgrade.

? How many MB of memory do we give the Windows 11 VM by default in the lesson?
= 4096
! 4 GB is the minimum; on a 16 GB host 8192 MB is recommended.

? Which VirtualBox menu item loads the Guest Additions installer disc?
+ Devices → Insert Guest Additions CD image
- File → Import Appliance
- Machine → Clone
- Help → Check for Updates
! Devices → Insert Guest Additions CD image.

? What should you do if the VM does not start with the "VT-x is not available" error?
- Reinstall VirtualBox.
- Give the VM more memory.
+ Enable virtualization in the computer's BIOS/UEFI settings.
- Set the network to NAT.
! Intel: Virtualization Technology, AMD: SVM Mode → Enabled.

? The VM has frozen and does not respond. Which shutdown mode is the last resort?
- Proper shutdown in the guest
- Save the machine state
+ Power off (pulling the cable)
- Taking a snapshot
! Powering off may lose data, so only as a last resort.
```
