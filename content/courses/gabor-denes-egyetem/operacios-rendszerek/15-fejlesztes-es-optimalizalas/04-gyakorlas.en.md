---
title: Practice – Development and Optimisation
summary: A measuring exercise on your virtual machine, review questions and a summary worksheet with Amdahl's law.
minutes: 25
kind: practice
---

## Measuring exercise on your virtual machine

Start the Ubuntu virtual machine you installed in topic 1 and do the following steps:

1. `uptime` – note the load average and compare it with the number of cores of the VM (`nproc`).
2. `systemd-analyze` and `systemd-analyze blame | head` – how long did booting take, and what was the slowest?
3. `free -h` – how much **used**, **buff/cache** and **available** memory is there?
4. In another terminal, create load: `yes > /dev/null` (Ctrl + C stops it), and watch the output of `top`. Which column grows?
5. On the Windows 11 VM open the **Startup apps** tab of Task Manager: which programs have "High" impact?

<details>
<summary>What to look for</summary>

- On a 2-core VM a load average of about 2.0 means full utilisation.
- `yes` loads one core to 100%; in `top` the `us` (user time) grows and the load average slowly rises by 1.
- Boot time in a VM also depends on the speed of the virtual disk; a VM stored on an SSD starts faster.

</details>

## Review questions

<details>
<summary>1. Why does a new kernel feature appear in the -rc releases before the stable version?</summary>

Because after the merge window there are weeks of testing and bug fixing only. Many people try the release candidate (rc) versions, so bugs are found before the stable release.

</details>

<details>
<summary>2. Why is it not worth switching everything off "blindly" on a slow machine?</summary>

Because it may not be the bottleneck, and you might switch off an important feature (e.g. security updates, the antivirus). Measure first, then change things in a targeted way, one at a time.

</details>

<details>
<summary>3. 50% of a program is serial. Is it worth buying a 64-core machine for it?</summary>

Not really: according to Amdahl's law the upper limit of the speed-up is 1 / 0.5 = 2, and even 64 cores give only about 1.97x. The serial part must be reduced first.

</details>

## Summary worksheet

```quiz required
? 90% of a program is parallelisable. According to Amdahl's law, what speed-up do 9 cores give?
= 5
! 1 / (0.1 + 0.9/9) = 1 / (0.1 + 0.1) = 5.

? What is the theoretical maximum speed-up of the same program?
= 10
! 1 / (1 − 0.9) = 10.

? On a 2-core machine the load average is 2.0. What does this mean?
+ both cores are fully busy, but nobody is waiting
- the machine is overloaded twice over
- the machine is half loaded
- the machine has stopped
! The load average must be compared with the number of cores.

? What is the default Linux swappiness value on Ubuntu?
= 60
! It can be set between 0 and 200.

? Which one is NOT needed to maintain an SSD?
+ defragmentation
- TRIM
- firmware updates
- enough free space
! Fragmentation does not slow an SSD down; unnecessary writes only wear it.
```
