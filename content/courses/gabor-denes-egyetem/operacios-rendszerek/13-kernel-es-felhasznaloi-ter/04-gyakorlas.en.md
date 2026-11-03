---
title: Practice – Kernel and User Space
summary: Kernel discovery in the Ubuntu VM, review questions and a summary worksheet.
minutes: 25
kind: practice
---

## Kernel discovery

```bash
uname -a                               # kernel name, version, architecture
lsmod | grep -i vbox                   # the VirtualBox guest additions modules
sudo dmesg | grep -i -m5 virtualbox    # what the kernel said about the virtual hardware
ps -eo pid,user,comm | head -15        # [kthreadd] and the other kernel threads
cat /proc/sys/kernel/hostname          # the host name from the kernel
```

Questions: How many modules starting with `vbox` are loaded? Who is the process with PID 2 (`ps -p 2 -o comm`)? (It is `kthreadd`, the "parent" of kernel threads.)

## Review questions

<details>
<summary>1. Why can a faulty driver be more dangerous than a faulty application?</summary>

Because the driver runs in kernel mode with full access to memory and hardware. Its bug can overwrite kernel data and stop the whole system. An application's bug only stops the application.

</details>

<details>
<summary>2. Why does part of the Windows graphics subsystem run in kernel mode if that is risky?</summary>

For performance: in kernel mode drawing needs fewer mode switches and messages. This is the typical compromise of a hybrid kernel between speed and reliability.

</details>

<details>
<summary>3. What is the difference between /proc/cpuinfo and an ordinary text file?</summary>

/proc/cpuinfo takes no space on disk: when you open it, the kernel generates its contents at that moment from current data.

</details>

<details>
<summary>4. Why must the machine be rebooted after a kernel update, but after a browser update only the browser?</summary>

Because the running kernel cannot be replaced on the fly (the new kernel is loaded only at boot), while the browser is a user process that can simply be restarted with the new version.

</details>

## Summary worksheet

```quiz required
? Which kernel type does Windows NT (Windows 10/11) belong to?
- monolithic
- microkernel
+ hybrid
- exokernel
! Modular structure, but many services in kernel mode.

? The correctness of which kernel has been proven mathematically?
= seL4
! A microkernel of the L4 family.

? What is the file extension of Linux kernel modules?
= .ko
= ko
! kernel object

? What is the kernel's stop due to a fatal error called on Linux?
= kernel panic
= panic
! On Windows: blue screen (BSOD).

? Which file is the Windows kernel?
+ ntoskrnl.exe
- explorer.exe
- winlogon.exe
- svchost.exe
! C:\Windows\System32\ntoskrnl.exe

? In which folder can Linux kernel parameters (sysctl) be tuned?
= /proc/sys
! e.g. /proc/sys/vm/swappiness
```
