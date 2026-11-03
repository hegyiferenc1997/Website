---
title: Practice – I/O Systems
summary: Review questions, device discovery in the VM and a summary worksheet with disk scheduling.
minutes: 25
kind: practice
---

## Device discovery

In the Ubuntu VM:

```bash
lsblk -d -o NAME,ROTA,SIZE,MODEL   # ROTA=1: rotating disk, 0: SSD (in a VM according to VirtualBox settings)
ls -l /dev/sda /dev/tty0           # first letter: b = block device, c = character device
free -h                            # buff/cache: the disk cache
```

In the Windows 11 VM open **Device Manager** and find the **VirtualBox Graphics Adapter** and **VirtualBox Guest Additions** devices. In PowerShell: `Get-PnpDevice -PresentOnly | Select-Object -First 10 Class, FriendlyName`.

## Review questions

<details>
<summary>1. Why is polling bad for a slow device such as the keyboard?</summary>

Because the CPU would almost constantly read the status register while the user presses only a few keys per second. With interrupts the CPU can do other work meanwhile.

</details>

<details>
<summary>2. Why does a device driver run in kernel mode, and what is the danger?</summary>

Because it has to access the hardware registers and interrupts directly, which is only possible in kernel mode. The danger: a faulty driver takes down the whole kernel (blue screen on Windows, kernel panic on Linux).

</details>

<details>
<summary>3. Why is it fine if Linux shows little free memory because of "buff/cache"?</summary>

Because the data in the cache are copies; the kernel can drop them any time a program needs memory. Empty RAM is unused RAM – the cache speeds up disk operations.

</details>

<details>
<summary>4. When is SCAN better than SSTF?</summary>

When requests keep arriving near the head: SSTF can then starve distant requests, while SCAN is guaranteed to reach everywhere within one round trip.

</details>

## Summary worksheet

Cylinders 0–99, the head is at cylinder **40**. Requests: `10, 22, 20, 2, 40, 6, 38`.

```quiz required
? What is the total head movement with FCFS?
= 166
! 30 + 12 + 2 + 18 + 38 + 34 + 32 = 166.

? What is the total head movement with SSTF?
= 38
! 40 → 40 → 38 → 22 → 20 → 10 → 6 → 2: 0 + 2 + 16 + 2 + 10 + 4 + 4 = 38.

? Which first letter in `ls -l` output shows that a device file is a block device?
= b
! A character device is shown by c.

? Which technique copies data between the device and memory without the CPU's involvement?
+ DMA
- polling
- spooling
- buffering
! Direct Memory Access.

? What is the essence of double buffering?
- All data is written to disk twice.
+ One buffer is filled while the other is emptied.
- We write to two different disks at once.
- The buffer is twice the size of RAM.
! So the producer and consumer do not make each other wait.

? Which Linux I/O scheduler is the common choice on NVMe SSDs?
+ none
- SSTF
- SCAN
- FCFS
! An SSD has no head movement, ordering is pointless.
```
