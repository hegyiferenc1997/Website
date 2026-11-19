---
title: Practice – Types of Operating Systems
summary: Review questions, a classification task and a summary worksheet.
minutes: 20
kind: practice
---

## Classification task

Classify the following systems (desktop / server / mobile / embedded / real-time; open / closed):

1. your phone's OS,
2. the servers of the university's student portal,
3. your home Wi-Fi router,
4. a car's anti-lock braking system (ABS),
5. your lab machine's Ubuntu,
6. a smartwatch.

<details>
<summary>Suggested solution</summary>

1. mobile – Android (open base, Linux kernel) or iOS (closed);
2. server – typically Linux or Windows Server;
3. embedded – often embedded Linux (e.g. OpenWrt-based);
4. embedded, hard real-time RTOS;
5. desktop, open source, multi-user;
6. embedded/mobile – Wear OS (Linux-based) or watchOS (XNU); simpler ones run an RTOS.

</details>

## Review questions

<details>
<summary>1. Why does the vast majority of the cloud and supercomputers run on Linux?</summary>

Because it is free (no per-machine licence fee across thousands of machines), open source (adaptable to the hardware and the task), stable, easy to automate, and runs on a great many architectures.

</details>

<details>
<summary>2. Why is a fast but unpredictable OS not enough for an airbag?</summary>

Because for a hard real-time task what counts is not the average but the worst-case response time. If the signal is late even once (e.g. because of a background task), it leads to disaster.

</details>

<details>
<summary>3. From the user's point of view, what is the difference between a network and a distributed system?</summary>

In a network system the user knows and specifies which machine's resource they use (e.g. the address of a shared folder). A distributed system hides the machine boundaries and looks like a single unit.

</details>

## Summary worksheet

```quiz required
? Which Linux distribution belongs to the Red Hat family?
- Ubuntu
- Linux Mint
+ Fedora
- Manjaro
! Its package manager: dnf (.rpm).

? Which kernel does iOS use?
= XNU
! The same as macOS.

? In which year did the first version of Windows NT appear?
= 1993
! Windows NT 3.1.

? Which licence allows you to build the code into a closed product without releasing source code?
- GPL
+ MIT
- neither
- AGPL
! MIT and BSD are permissive licences.

? What does "free" mean in "free software"?
+ freedom (to run, study, modify, distribute)
- mandatory zero price
- ad-supported distribution
- a limited trial version
! "Free as in freedom, not as in free beer."

? Which operating system runs on every machine of the TOP500 supercomputer list?
= Linux
! On all 500 machines since 2017.
```
