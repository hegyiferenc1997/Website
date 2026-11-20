---
title: Practice – I/O Systems
summary: Review questions, device discovery in the VM and a summary worksheet with disk scheduling.
minutes: 50
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

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **Hard disk access time.** The average access time = seek time + average rotational latency (time of half a revolution) + transfer time. Write the `access_ms(rpm, seek_ms, transfer_ms)` function (rounded to two decimals)!

```python starter
def access_ms(rpm, seek_ms, transfer_ms):
    return seek_ms
```

<details>
<summary>Solution</summary>

```python solution
def access_ms(rpm, seek_ms, transfer_ms):
    revolution_ms = 60_000 / rpm              # time of one full revolution
    return round(seek_ms + revolution_ms / 2 + transfer_ms, 2)
```

</details>

```python test
assert access_ms(7200, 9, 0.1) == 13.27
assert access_ms(5400, 12, 0) == 17.56
assert access_ms(15000, 3.5, 0.05) == 5.55
print("All checks passed!")
```

**2.** **SSTF disk scheduling.** SSTF always serves the request **closest** to the head's current position. Write the `sstf(head, requests)` function, which returns the head's total movement (in tracks)!

```python starter
def sstf(head, requests):
    return 0
```

<details>
<summary>Solution</summary>

```python solution
def sstf(head, requests):
    left = list(requests)
    path = 0
    while left:
        nxt = min(left, key=lambda s: abs(s - head))   # the closest request
        path += abs(nxt - head)
        head = nxt
        left.remove(nxt)
    return path
```

</details>

```python test
assert sstf(53, [98, 183, 37, 122, 14, 124, 65, 67]) == 236
assert sstf(50, [40, 60]) == 30
assert sstf(10, []) == 0
print("All checks passed!")
```

**3.** **Throughput from IOPS.** Write the `mb_per_s(iops, block_kb)` function: if a device performs `iops` operations per second, each of `block_kb` KB, what is the throughput in MB/s (1 MB = 1024 KB, one decimal)?

```python starter
def mb_per_s(iops, block_kb):
    return iops
```

<details>
<summary>Solution</summary>

The same hard disk is ridiculously slow for small random reads (0.3 MB/s), but manages 200 MB/s for large sequential blocks – it's the seek and rotation time that hurts.

```python solution
def mb_per_s(iops, block_kb):
    return round(iops * block_kb / 1024, 1)
```

</details>

```python test
assert mb_per_s(76, 4) == 0.3          # hard disk, random 4 KB reads
assert mb_per_s(100000, 4) == 390.6    # NVMe SSD
assert mb_per_s(200, 1024) == 200.0    # hard disk, large sequential blocks
print("All checks passed!")
```

### Quick check questions

```quiz
? Why is disk scheduling (SSTF, SCAN) unnecessary for an SSD?
+ because there's no moving head: every block has nearly the same access time
- because the SSD accepts only one request at a time
- because the BIOS schedules the SSD
! On Linux the scheduler for SSDs is often none or mq-deadline.

? What is the difference between a block device and a character device?
+ a block device is accessed in fixed-size blocks in any order (disk); a character device is a byte stream (keyboard, serial port)
- a block device is slower
- a character device stores only text
! ls -l /dev: the b or c at the start of the line shows it.

? What is buffering in I/O for?
+ to smooth out the speed difference between fast and slow devices, and to do fewer, larger operations
- to encrypt data
- to hide errors
! E.g. writes to disk go into memory first.

? What does a device driver do?
+ it translates the OS's general requests into the device's own "language"
- it speeds up the processor
- it supplies power to the device
! This way the OS reaches different devices through a uniform interface.

? Which disk scheduler behaves like a lift: it goes all the way in one direction, then turns back?
- FCFS
- SSTF
+ SCAN
! LOOK is smarter in that it only goes as far as the last request.
```
