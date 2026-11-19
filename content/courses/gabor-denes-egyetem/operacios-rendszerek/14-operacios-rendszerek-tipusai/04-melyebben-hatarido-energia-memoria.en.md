---
title: Deeper – Deadlines, Batteries and Memory: the Calculations of Special-Purpose Systems
summary: Real-time schedulability – the utilisation test, the Rate Monotonic bound (69%), Rate Monotonic and EDF scheduling with a simulator; the battery life of an embedded system with sleep mode; and how Android decides which background app to kill when memory runs low.
minutes: 40
---

## What you will learn in this lesson

- how to decide **by calculation** whether a real-time system will meet every deadline,
- how **Rate Monotonic** and **EDF** scheduling differ, and when one fails where the other doesn't,
- how the **battery life** of an embedded device is calculated, and why the processor is almost always asleep,
- how a mobile OS chooses which **background app** to kill when memory runs out.

A desktop OS optimises for the **average** user experience. Special-purpose systems have a different "currency": for a real-time system it's the **deadline**, for an embedded one **energy**, for a mobile one **memory** and battery. Let's look at all three in numbers!

## 1. Real time: do we meet every deadline?

In a real-time system tasks are typically **periodic**: for example, an engine controller reads a sensor every 5 ms. Each task is described by two numbers:

- **C** – the worst-case execution time,
- **T** – the period (which is also the deadline: it must finish before its next release).

The **utilisation**: U = Σ C / T. If U > 1 (100%), it certainly **doesn't** fit – there's more work than time.

### Rate Monotonic scheduling and the 69% bound

**Rate Monotonic** (RM) scheduling is a simple **fixed**-priority rule: the task with the shorter period gets **higher priority**. In 1973 Liu and Layland proved that for n tasks every deadline is **guaranteed** to be met under RM if

**U ≤ n · (2^(1/n) − 1)**

```python run
# The safe utilisation bound of Rate Monotonic for n tasks
import math

for n in [1, 2, 3, 4, 5, 10, 100]:
    bound = n * (2 ** (1 / n) - 1)
    print(f"n = {n:>3}: U ≤ {bound:.3f} ({bound:.1%})")
print(f"n → ∞:   U ≤ ln 2 = {math.log(2):.3f}")
```

For many tasks the bound approaches **ln 2 ≈ 69.3%**. If utilisation is below this, we can sleep soundly with RM; above it, it may still work, but it has to be **checked separately**.

### EDF – always the most urgent

**EDF** (_Earliest Deadline First_) uses **dynamic** priorities: the task whose deadline is **nearest** always runs. On a single core it is **optimal**: every deadline is met as long as **U ≤ 1**.

Let's simulate two tasks: A (C = 2, T = 5) and B (C = 4, T = 7). Utilisation is 2/5 + 4/7 ≈ **97%** – above the RM bound for two tasks (82.8%), but below 100%.

```python run
# Simulating Rate Monotonic and EDF scheduling in 1 ms steps
def schedule(tasks, rule, length):
    remaining = {n: 0 for n, _, _ in tasks}
    deadline = {n: 0 for n, _, _ in tasks}
    timeline, missed = "", []
    for t in range(length):
        for name, C, T in tasks:
            if t % T == 0:                            # a new instance is released
                if remaining[name] > 0:
                    missed.append(f"{name} at {t} ms")    # the previous one didn't finish!
                remaining[name], deadline[name] = C, t + T
        ready = [x for x in tasks if remaining[x[0]] > 0]
        if not ready:
            timeline += "."                           # idle CPU
            continue
        if rule == "RM":
            run = min(ready, key=lambda x: x[2])      # shorter period = higher priority
        else:
            run = min(ready, key=lambda x: (deadline[x[0]], x[2]))   # nearest deadline
        remaining[run[0]] -= 1
        timeline += run[0]
    return timeline, missed

tasks = [("A", 2, 5), ("B", 4, 7)]
U = sum(C / T for _, C, T in tasks)
print(f"utilisation: {U:.1%}\n")
for rule in ["RM", "EDF"]:
    line, miss = schedule(tasks, rule, 35)
    print(f"{rule:>3}: {line}")
    print(f"     missed deadlines: {miss if miss else 'none'}")
```

Read the timeline (each character is 1 ms): under RM, A, released again at 5 ms, **preempts** B because A's period is shorter – and B doesn't finish by 7 ms. Under EDF, at 5 ms B's deadline (7) is nearer than A's new deadline (10), so B keeps running, and every deadline is met.

So why is RM still often used? Because it's **simple** and **predictable**: under overload it's always the lowest-priority task that's late (we know this in advance), whereas under EDF any task can miss its deadline when overloaded, even in a chain reaction.

**Analogy:** RM is the student who always starts with the homework for the most frequent class (3 hours a week). EDF is the one who always does what's due tomorrow. If there's enough time, the EDF student gets more done; if not, it's harder to predict what they'll leave out.

## 2. Embedded system: how long does the battery last?

A wireless thermometer runs on a coin cell (CR2032, about **220 mAh**). The microcontroller wakes once a second, measures, sends the data, then goes into **deep sleep**. The average current is the average weighted by the time shares:

**I_avg = (active time share) · I_active + (sleep time share) · I_sleep**

```python run
# Battery life: how much does sleep matter?
CAPACITY_MAH = 220           # CR2032 coin cell

def lifetime(active_ms_per_s, i_active_ma, i_sleep_ma):
    share = active_ms_per_s / 1000                   # share of active time
    avg = share * i_active_ma + (1 - share) * i_sleep_ma
    hours = CAPACITY_MAH / avg
    return avg, hours

cases = [
    ("always awake",                 1000, 5.0, 0.0),
    ("10 ms/s active, light sleep",    10, 5.0, 0.5),
    ("10 ms/s active, deep sleep",     10, 5.0, 0.002),
    ("2 ms/s active, deep sleep",       2, 5.0, 0.002),
]
for name, active, ia, isl in cases:
    avg, hours = lifetime(active, ia, isl)
    print(f"{name:<30} avg {avg * 1000:8.1f} µA → {hours:8.0f} hours ≈ {hours / 24:6.0f} days")
```

Always awake, the coin cell is flat in **2 days**; with well-written sleep it lasts **more than half a year**. That's why one of the most important features of embedded OSes (FreeRTOS, Zephyr) is **tickless** mode: when there's nothing to do, they don't wake the processor on every timer tick, only when the next task is due. The same principle is at work in your laptop and phone.

## 3. Mobile OS: whom do we kill when memory runs low?

A phone has no swap in the usual sense (the flash memory would wear out, and it would be slow), so when RAM runs low, Android **kills** background apps. The decision is based on an **importance score** (on Linux `oom_score_adj`, between −1000 and +1000): the higher it is, the sooner the app is sacrificed.

| Category                      | Example                        | Score (approx.) |
| ----------------------------- | ------------------------------ | --------------- |
| foreground app                | what you're using right now    | 0               |
| visible / perceptible         | music player in the background | 100–200         |
| service                       | synchronisation                | around 500      |
| previously used (cached)      | the game you opened yesterday  | 900–999         |

```python run
# Simplified decision of Android's low-memory killer (lmkd)
apps = [
    # (name, memory MB, oom_score_adj)
    ("Maps (foreground)",      450,   0),
    ("Music player",           120, 200),
    ("Cloud sync",              80, 500),
    ("Browser (10 min ago)",   600, 900),
    ("Game (yesterday)",       900, 950),
    ("Photo editor (last week)", 300, 999),
]
free_mb = 200
needed_mb = 1000                     # the camera app asks for this much

print(f"free: {free_mb} MB, needed: {needed_mb} MB")
for name, mem, score in sorted(apps, key=lambda a: (-a[2], -a[1])):
    if free_mb >= needed_mb:
        break
    free_mb += mem
    print(f"  killed: {name:<28} (score {score:>3}) +{mem} MB → free: {free_mb} MB")
print("the camera can start" if free_mb >= needed_mb else "not enough memory!")
```

It sacrifices the least recently used apps first, and doesn't touch the foreground app until the very end. That's why a mobile app must **save its state** when it goes into the background: if the system kills it and you switch back later, it should continue as if nothing had happened. On Linux the kernel's **OOM killer** does the same when memory runs out:

```bash
cat /proc/$$/oom_score_adj     # your shell's score adjustment (usually 0)
cat /proc/$$/oom_score         # the actual score (including memory usage)
```

## Summary

- Real-time task: C (worst-case execution time) and T (period); utilisation U = Σ C/T, with U > 1 it certainly doesn't fit.
- **Rate Monotonic**: shorter period = higher priority; guaranteed to work if U ≤ n(2^(1/n) − 1), which for many tasks is **~69%**.
- **EDF**: the nearest deadline always runs; on one core it meets every deadline up to U ≤ 100%, but is less predictable under overload.
- In an embedded system the average current determines lifetime: **deep sleep** and **tickless** mode turn days into months.
- When memory is short, a mobile OS kills the **least important** (least recently used) apps – that's why an app must save its state.

## Lesson exercise

```quiz required
? Three periodic tasks: (C=1, T=4), (C=2, T=8), (C=1, T=10). What is the utilisation in percent?
= 60
= 60%
! 1/4 + 2/8 + 1/10 = 0.25 + 0.25 + 0.1 = 0.6.

? Two tasks have a total utilisation of 90%. The Rate Monotonic bound for two tasks is 82.8%. What can we say?
- every deadline is guaranteed under RM
+ it isn't guaranteed under RM and must be checked separately – but with EDF it certainly works on one core
- it can't work with any scheduler
! EDF is optimal on one core up to U ≤ 100%.

? Which scheduling always runs the task whose deadline is nearest?
- Rate Monotonic
+ EDF
- Round Robin
- FCFS
! Earliest Deadline First.

? A sensor is active 1% of the time (4 mA) and sleeps 99% (0.01 mA). What is the average current in mA? (four decimal places)
= 0.0499
= 0,0499
! 0.01 · 4 + 0.99 · 0.01 = 0.04 + 0.0099 = 0.0499 mA.

? Memory runs low on an Android phone. Which app does the system kill first?
- the maps app in the foreground
- the music player playing in the background
+ the photo editor opened last week and not used since
! The one with the highest oom_score_adj (least important) goes first.
```
