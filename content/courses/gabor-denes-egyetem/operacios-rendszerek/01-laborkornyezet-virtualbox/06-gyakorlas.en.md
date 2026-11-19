---
title: Practice – the Lab Environment
summary: Checklist for the finished lab, review questions and a summary worksheet.
minutes: 45
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

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **How much RAM can you give the VM?** Write the `vm_ram(host_gb)` function: the host must keep **half** of the RAM, but **at least 4 GB**; you can give the rest to the VM (0 instead of a negative value).

```python starter
def vm_ram(host_gb):
    # the host keeps at least half, but minimum 4 GB
    return host_gb
```

<details>
<summary>Solution</summary>

```python solution
def vm_ram(host_gb):
    # the host keeps at least half, but minimum 4 GB
    keep = max(host_gb / 2, 4)
    return max(host_gb - keep, 0)
```

</details>

```python test
assert vm_ram(16) == 8
assert vm_ram(6) == 2
assert vm_ram(4) == 0
assert vm_ram(32) == 16
print("All checks passed!")
```

**2.** **GB or GiB?** Disk manufacturers use base-10 units (1 GB = 10⁹ bytes), Windows and VirtualBox often base-2 units (1 GiB = 2³⁰ bytes). Write the `gb_to_gib(gb)` function, which returns how many GiB a disk of a given GB size is, rounded to two decimals!

```python starter
def gb_to_gib(gb):
    return gb
```

<details>
<summary>Solution</summary>

That's why a "1 TB" disk shows up as only about 931 GB in Windows: no space is lost, the unit is just different.

```python solution
def gb_to_gib(gb):
    nbytes = gb * 10**9          # the manufacturer's base-10 gigabyte
    return round(nbytes / 2**30, 2)
```

</details>

```python test
assert gb_to_gib(1000) == 931.32       # a "1 TB" disk
assert gb_to_gib(500) == 465.66
assert gb_to_gib(1) == 0.93
print("All checks passed!")
```

**3.** **Do they fit at once?** Write the `fits(vm_rams, host_gb)` function: true if the sum of the RAM of the VMs running at the same time, plus the **4 GB** reserved for the host, is at most the host's RAM.

```python starter
def fits(vm_rams, host_gb):
    return True
```

<details>
<summary>Solution</summary>

```python solution
def fits(vm_rams, host_gb):
    return sum(vm_rams) + 4 <= host_gb
```

</details>

```python test
assert fits([4, 4], 16) is True
assert fits([8, 4], 16) is True
assert fits([8, 6], 16) is False
assert fits([], 4) is True
print("All checks passed!")
```

### Quick check questions

```quiz
? In which network mode does the VM get its own IP address from the home router, so other machines on the network can reach it?
- NAT
+ bridged
- host-only
! Behind NAT the VM gets the private address 10.0.2.15 and can't be reached directly from outside.

? What is a snapshot for in VirtualBox?
+ saving a given state of the VM that you can return to later
- taking a picture of the VM's screen
- moving the VM to another machine
! It's always worth taking a snapshot before experimenting.

? Your machine has 8 logical processors. At most how many vCPUs is it sensible to give a VM so the host stays usable?
- 8
+ 4
- 16
! Rule of thumb: at most half of the logical processors.

? What is the advantage of a dynamically allocated virtual disk over a fixed-size one?
+ it takes up only as much space on the host as the data actually on it
- it's always faster
- it can never fill up
! A fixed-size disk can be slightly faster, but reserves the full size immediately.

? What do the VirtualBox Guest Additions install in the guest system?
- a second operating system
+ drivers: better graphics, shared clipboard, shared folders
- an antivirus
! On Linux the vboxguest kernel module is part of it.
```
