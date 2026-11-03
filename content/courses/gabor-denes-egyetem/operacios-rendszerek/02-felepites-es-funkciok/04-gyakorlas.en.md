---
title: Practice – Structure and Functions
summary: Review questions and a summary worksheet on the structure of operating systems.
minutes: 20
kind: practice
---

## Review questions

Try to answer in your head first, only then open the answer!

<details>
<summary>1. Give an example of the OS acting as a resource manager and one of it acting as an extended machine!</summary>

Resource manager: the browser and the music player get the processor in turns, and both get separate memory areas. Extended machine: programs open files by name instead of addressing disk blocks.

</details>

<details>
<summary>2. Why is the timer interrupt needed in a multitasking system?</summary>

Because without it, a program that never makes a system call (e.g. runs in an infinite loop) would never give control back to the OS, and the other programs could not run.

</details>

<details>
<summary>3. List the steps of booting on Linux!</summary>

Power on → UEFI firmware (POST, boot device) → GRUB boot loader → loading and initialising the kernel → systemd (PID 1) starts the services → login screen.

</details>

<details>
<summary>4. Why does it speed up the machine if the OS keeps frequently used data in RAM?</summary>

Because RAM access is orders of magnitude faster than SSD or HDD access (about 100 ns versus 0.1–10 ms).

</details>

Try it in the Ubuntu VM:

```bash
cat /proc/cpuinfo | grep "model name" | head -1   # which processor the guest sees
cat /proc/meminfo | head -3                        # memory
systemd-analyze                                    # boot time
```

## Summary worksheet

```quiz required
? What is today's successor of the old BIOS that starts the computer?
= UEFI
! Unified Extensible Firmware Interface.

? Which Linux boot loader is the most common (Ubuntu uses it too)?
+ GRUB
- NTLDR
- systemd
- POST
! GRand Unified Bootloader.

? Which is the fastest storage in the memory hierarchy?
+ register
- L3 cache
- RAM
- SSD
! Registers are inside the processor, accessible in under 1 ns.

? Which kind of interrupt does a program trigger deliberately when it asks for an OS service?
- hardware interrupt
- exception
+ software interrupt (trap, system call)
- timer interrupt
! System calls get their own topic.

? Which system is the intellectual ancestor of today's Linux and macOS (1970s, Bell Labs)?
= UNIX
! Ken Thompson and Dennis Ritchie, 1969–1973.

? Roughly how many nanoseconds is the RAM access time according to the lesson's table?
= 100
! Register < 1 ns, RAM ~100 ns, SSD ~100,000 ns.
```
