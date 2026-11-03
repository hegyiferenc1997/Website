---
title: Optimisation and Tuning
summary: Startup programs, services, caching, swappiness, power plans, SSDs and updates – plus Amdahl's law, which tells you what more cores are worth.
minutes: 25
---

## What you will learn

- which **simple tuning steps** speed up a Windows or Linux system,
- what the **cache** and **swappiness** do,
- how to use **Amdahl's law** to calculate how much more processor cores help.

## The golden rule

As the previous lesson said: **measure first**, find the bottleneck, change **one thing at a time**, then measure again. The steps below are the most common, low-risk tuning steps.

## Startup programs and services

Every program started at boot uses memory and CPU time and slows down sign-in.

- **Windows**: Task Manager → **Startup apps** tab: disable unnecessary programs (updater helpers, chat apps). Only change services (`services.msc`) if you know exactly what they do.
- **Linux**: background services are managed by `systemd`:

```bash
systemd-analyze                 # how long booting took
systemd-analyze blame | head    # which service slowed it down the most
systemctl list-unit-files --state=enabled   # what starts automatically
sudo systemctl disable --now cups           # e.g. turn off the printing service if you have no printer
```

## Cache: free memory is good for nothing

On Linux, `free -h` often shows little **free** but a lot of **buff/cache** memory. This is **not a problem**: the kernel keeps recently read files in memory (the **page cache**), so the next read does not come from disk. When a program needs memory, the cache is released immediately. The important column is **available**. On Windows the **SuperFetch / SysMain** service and "Cached" memory do the same.

## Swap and swappiness

**Swappiness** (0–200, **60** by default on Ubuntu) controls how willingly the kernel moves pages to swap instead of dropping cache. On a desktop with little RAM a lower value (e.g. 10–20) often gives a smoother interface.

```bash
cat /proc/sys/vm/swappiness            # current value
sudo sysctl vm.swappiness=20           # temporary change (until reboot)
echo 'vm.swappiness=20' | sudo tee /etc/sysctl.d/99-swappiness.conf   # permanent
```

## Power plans, SSDs, updates

- **Power plan**: on a laptop, "Battery saver" mode throttles the CPU clock. On Windows: Settings → System → Power → **Power mode**; from PowerShell:

```powershell
powercfg /list                 # list the power schemes
powercfg /setactive SCHEME_MIN # "High performance" scheme
```

  On Linux `powerprofilesctl` (Ubuntu: Settings → Power) switches between the _power-saver_, _balanced_ and _performance_ profiles.
- **SSD**: the biggest single speed-up for an old machine is replacing the hard disk with an SSD. The system keeps it healthy with weekly **TRIM** (`fstrim.timer` on Linux, "Optimise Drives" on Windows); an SSD does **not** need defragmenting.
- **Updates**: kernel and driver updates often bring performance improvements as well as security fixes.
- **In a virtual machine**: give the VM enough RAM and 2+ cores, install the **Guest Additions** and enable 3D acceleration (see topic 1).

## Amdahl's law

More cores only speed up the **parallelisable** part of a program. If a fraction **p** of the run time is parallelisable, the speed-up with **n** cores is:

**S(n) = 1 / ((1 − p) + p / n)**

When n is very large the p/n term disappears, so the **upper limit is 1 / (1 − p)**: the serial part always remains. Try it:

```python run
# Amdahl's law: how much faster does a program get with n cores if a fraction p of its run time is parallelisable?
def speedup(p, n):
    return 1 / ((1 - p) + p / n)

p = 0.8                      # 80% of the program is parallelisable
for n in [1, 2, 4, 8, 16, 1000]:
    print(f"{n:5} cores: {speedup(p, n):.2f}x speed-up")
print("theoretical upper limit:", round(1 / (1 - p), 2))
```

With an 80% parallel part, even 16 cores give only a **4x** speed-up, and infinitely many cores at most **5x**. That is why reducing the serial part matters, not just adding cores.

## Summary

- Measure before tuning; change one thing at a time.
- Disable unnecessary startup programs and services; `systemd-analyze blame`.
- Cached memory is useful, **available** is what counts; swappiness controls swap use.
- Power plan, SSD + TRIM, updates, Guest Additions in a VM.
- Amdahl: S(n) = 1 / ((1 − p) + p/n), upper limit 1/(1 − p).

## Exercise

```quiz required
? 75% of a program's run time is parallelisable (p = 0.75). According to Amdahl's law, what speed-up do 3 cores give?
= 2
! 1 / (0.25 + 0.75/3) = 1 / (0.25 + 0.25) = 2.

? What is the largest possible speed-up for the same program, with any number of cores?
= 4
! 1 / (1 − 0.75) = 1 / 0.25 = 4.

? The output of free -h shows little free but a lot of buff/cache memory. What does this mean?
- the machine is out of memory and must be upgraded immediately
+ the kernel keeps files in cache and releases it immediately when needed
- a program has a memory leak
- the swap is broken
! The available column shows how much memory is really available.

? Which command shows on Linux which service slowed booting down the most?
+ systemd-analyze blame
- free -h
- df -h
- uname -r
! systemd measures the start-up time of every service.
```
