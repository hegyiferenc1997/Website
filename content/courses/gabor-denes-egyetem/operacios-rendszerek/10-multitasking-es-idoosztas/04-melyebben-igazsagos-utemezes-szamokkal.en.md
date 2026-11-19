---
title: Deeper – Fair Scheduling and Multi-Core Speedup in Numbers
summary: Cooperative versus preemptive multitasking with a simulator, the trade-off between quantum and context switch in a table, CFS virtual runtime and nice weights calculated, priority inversion (Mars Pathfinder), and Amdahl's law – why a program doesn't get 8 times faster on 8 cores.
minutes: 40
---

## What you will learn in this lesson

- to see with a **simulator** why a cooperative multitasking system "froze" because of a single bad program,
- to see the quantum-size trade-off **in a table** (overhead versus waiting),
- to calculate exactly what CPU share the Linux scheduler gives based on the **nice value**,
- to understand **priority inversion**, which forced a Mars probe to keep rebooting,
- to estimate with **Amdahl's law** how much more cores speed things up.

## 1. Cooperative versus preemptive – with a simulator

In cooperative multitasking the process **gives back** the CPU itself (e.g. Windows 3.1, old Mac OS). If a program computes for a long time and doesn't yield, everyone else waits. Let's simulate three tasks: a long computation (100 ms), and two interactive tasks (music player, mouse handling) that voluntarily yield every 1 ms.

```python run
# Cooperative scheduling: a task runs until it gives up the CPU itself
def cooperative(tasks):
    t, remaining, first = 0, {}, {}
    queue = []
    for name, burst, yields in tasks:
        remaining[name] = burst
        queue.append((name, yields))
    while queue:
        name, yields = queue.pop(0)
        first.setdefault(name, t)                  # when it first got the CPU
        run = remaining[name] if yields is None else min(yields, remaining[name])
        t += run
        remaining[name] -= run
        if remaining[name] > 0:
            queue.append((name, yields))
    return first

# Preemptive: nobody may run longer than q ms (Round Robin)
def preemptive(tasks, q):
    t, remaining, first = 0, {}, {}
    queue = []
    for name, burst, _ in tasks:
        remaining[name] = burst
        queue.append(name)
    while queue:
        name = queue.pop(0)
        first.setdefault(name, t)
        run = min(q, remaining[name])
        t += run
        remaining[name] -= run
        if remaining[name] > 0:
            queue.append(name)
    return first

tasks = [("compute", 100, None), ("music", 3, 1), ("mouse", 2, 1)]   # None = never yields
print("Cooperative – time of first run (ms):", cooperative(tasks))
print("Preemptive q=4 – time of first run (ms):", preemptive(tasks, 4))
```

In cooperative mode the music first plays after **100 ms** – the user sees a "frozen" machine. With preemptive scheduling the timer interrupt takes the CPU away from the computation after **4 ms**, so music and mouse get their turn right away. That's why every modern desktop and server OS is preemptive.

**Analogy:** a cooperative system is like a meeting where everyone talks as long as they like – a single chatterbox can paralyse it. A preemptive system has a moderator (the timer) who takes the microphone away after 4 minutes.

## 2. The quantum trade-off in a table

In the base lesson you saw two formulas: the **overhead** s / (q + s), and the longest wait between two runs. If we include the switching time too, for n processes this is **(n − 1) · (q + s)**. Let's see how the two develop for 10 processes with a 0.1 ms context switch (direct + hidden cost together):

```python run
# Overhead and longest wait as a function of the quantum
n = 10        # number of competing processes
s = 0.1       # time of one context switch (ms)

print(f"{'q (ms)':>8} {'overhead':>9} {'max wait (ms)':>15}")
for q in [0.1, 0.5, 1, 4, 10, 50, 200]:
    overhead = s / (q + s) * 100
    wait = (n - 1) * (q + s)
    print(f"{q:>8} {overhead:>8.1f}% {wait:>15.1f}")
```

The result traces out the trade-off:

- **q = 0.1 ms**: **half** of the CPU time goes on switching;
- **q = 200 ms**: the overhead is negligible, but a process may wait **1.8 seconds** – unbearable for typing (we notice delays above roughly 100 ms);
- **q = 4–10 ms**: 1–2% overhead, 40–90 ms wait – that's why real systems' quanta lie in this range.

## 3. The secret of CFS and EEVDF: virtual runtime

The Linux scheduler gives every task a **weight** based on its nice value, and divides the real runtime by this weight – this is the **virtual runtime** (_vruntime_). The task with the smallest vruntime always gets the CPU. A task with a larger weight has a slower-"ticking" clock, so it can run more.

Some values from the kernel's weight table (`sched_prio_to_weight`):

| nice | weight |
| ---- | ------ |
| −5   | 3121   |
| 0    | 1024   |
| 1    | 820    |
| 5    | 335    |
| 10   | 110    |

The ratio of two neighbouring levels is always about **1.25**. That's why the "one level ≈ 10%" rule from the base lesson holds: of two competing tasks, the nice 0 one gets **1024 / (1024 + 820) ≈ 55.5%**, the nice 1 one 44.5% – a difference of about 10 percentage points.

```python run
# Simplified CFS simulation: the task with the smallest vruntime runs for 1 ms
WEIGHT = {-5: 3121, 0: 1024, 1: 820, 5: 335, 10: 110}

def cfs(tasks, total_ms):
    vruntime = {name: 0.0 for name in tasks}
    ran = {name: 0 for name in tasks}
    for _ in range(total_ms):
        name = min(vruntime, key=lambda n: (vruntime[n], n))   # the one that "ran" least
        ran[name] += 1
        vruntime[name] += 1 * 1024 / WEIGHT[tasks[name]]      # big weight → slow clock
    for name, ms in ran.items():
        print(f"  {name:<10} nice {tasks[name]:>3}: {ms:>4} ms ({ms / total_ms:.1%})")

print("nice 0 versus nice 5:")
cfs({"browser": 0, "backup": 5}, 1000)
print("nice 0 versus nice 10:")
cfs({"browser": 0, "compile": 10}, 1000)
print("three tasks:")
cfs({"game": -5, "browser": 0, "backup": 10}, 1000)
```

The simulation reproduces the weight ratios exactly: nice 0 versus 5 → about **75% / 25%** (1024 / 1359), nice 0 versus 10 → about **90% / 10%**. So weight isn't a question of "who runs first" but a **ratio**: the nice 10 backup still progresses, just more slowly – it doesn't starve.

**Analogy:** in a restaurant the waiter always brings a bite to the guest who has "eaten least". For a heavier guest every bite "counts as less", so they get served more often.

## 4. Priority inversion – when the important task waits for a less important one

In 1997 NASA's **Mars Pathfinder** probe kept **rebooting** on Mars. The cause was a classic scheduling trap:

1. A **low**-priority task (L) acquired a lock (a shared data bus).
2. A **high**-priority task (H) requested the same lock – it had to wait for L.
3. Meanwhile a **medium**-priority, long-running task (M) became ready. Since M is more important than L, it **preempted** L.
4. L couldn't run, so it didn't release the lock; H was therefore waiting for **M** – even though H is the most important! A watchdog timer noticed that H wasn't running and reset the system.

The solution is **priority inheritance**: while L holds a lock requested by H, it temporarily **inherits H's priority**, so M can't preempt it. NASA's engineers fixed the bug from Earth by flipping a configuration switch. Linux's `PTHREAD_PRIO_INHERIT` locks and Windows' priority boosts handle the same problem.

```python run
# Priority inversion: when does H finally run without and with inheritance?
# L: runs from 0 ms, takes the lock at 1 ms, needs 3 more ms holding the lock
# H: arrives at 2 ms, needs the lock; M: arrives at 3 ms, computes for 20 ms (no lock)
def simulate(inheritance):
    l_left_with_lock = 3 - 1        # by 2 ms L has run 1 ms with the lock
    t = 2                           # H has just arrived and blocked
    m_left = 20
    while l_left_with_lock > 0:
        if t >= 3 and m_left > 0 and not inheritance:
            m_left -= 1             # M preempts L (M > L)
        else:
            l_left_with_lock -= 1   # L runs (with inheritance, at H's priority)
        t += 1
    return t                        # L releases the lock, H runs immediately

print("H starts at this ms without inheritance:", simulate(False))
print("H starts at this ms with inheritance:   ", simulate(True))
```

Without inheritance the most important task starts at **24 ms** (it waits out M's whole 20 ms), with inheritance at **4 ms**.

## 5. Amdahl's law – why doesn't it get 8 times faster on 8 cores?

More cores only speed up the part that can be **parallelised**. If a fraction **p** of the program's runtime is parallelisable and we have **n** cores, the speedup is:

**S(n) = 1 / ((1 − p) + p / n)**

```python run
# Amdahl's law: speedup as a function of the number of cores
def speedup(p, n):
    return 1 / ((1 - p) + p / n)

for p in [0.5, 0.9, 0.99]:
    row = ", ".join(f"{n} cores: {speedup(p, n):5.2f}×" for n in [2, 4, 8, 16])
    print(f"p = {p:.0%}  →  {row}  | limit: {1 / (1 - p):.0f}×")
```

If **90%** of a program is parallelisable, the speedup on 8 cores is only about **4.7×**, and even with infinitely many cores it's no more than **10×** – the remaining 10% serial part becomes the bottleneck. That's why people say the serial part "dominates".

**Analogy:** when cooking lunch, 4 cooks can chop vegetables at once (the parallel part), but the soup still simmers for 30 minutes no matter how many stand by the pot (the serial part).

On top of that, in reality the cores **share** memory bandwidth and the common cache, wait for each other because of locks, and migrating tasks means a cold cache – so the practical speedup is often even smaller than Amdahl's estimate.

## 6. Try it on your own machine

```bash
# Ubuntu VM: two CPU hogs compete on one core with different nice values
taskset -c 0 nice -n 0 sh -c 'while :; do :; done' &
taskset -c 0 nice -n 5 sh -c 'while :; do :; done' &
top -b -n 2 -d 2 | grep -E 'PID| sh$'     # %CPU: about 75% and 25%
kill %1 %2                                  # clean up after yourself!
```

`taskset -c 0` forces both onto the same core – otherwise they'd run on separate cores and wouldn't compete. You can try nice 10 the same way: it will be about 90% / 10%.

## Summary

- In cooperative multitasking a program that doesn't yield stalls everyone; in preemptive scheduling the **timer** takes the CPU away.
- The quantum is a trade-off: small quantum → large overhead, large quantum → slow response; the typical 4–10 ms keeps both acceptable.
- Linux turns the nice value into a **weight** (nice 0 = 1024, ~1.25× per level) and always runs the task with the smallest **virtual runtime** – so CPU time is shared in proportion to the weights.
- **Priority inversion:** a high-priority task indirectly waits for a medium one because of a lock; the solution is **priority inheritance**.
- **Amdahl's law:** S(n) = 1 / ((1 − p) + p / n); the serial part limits the speedup (p = 90% → at most 10×).

## Lesson exercise

```quiz required
? Two tasks compete on one core under the Linux scheduler: the nice 0 one has weight 1024, the nice 5 one 335. What percentage of CPU does the nice 0 task get, rounded?
= 75
= 75%
! 1024 / (1024 + 335) ≈ 0.753.

? 90% of a program is parallelisable. What is the maximum speedup achievable with any number of cores?
= 10
= 10×
! 1 / (1 − 0.9) = 10.

? 50% of a program is parallelisable. What is the speedup on 2 cores? (two decimal places)
= 1.33
= 1,33
! 1 / (0.5 + 0.5 / 2) = 1 / 0.75 ≈ 1.33.

? Why did the whole system "freeze" under cooperative multitasking if one program got stuck in an infinite loop?
- because the infinite loop erases memory
+ because the program never gave back control, and there was no timer to take it away
- because cooperative systems don't know about processes
! In preemptive scheduling the timer interrupt takes the CPU away.

? A low-priority task holds a lock that a high-priority task is waiting for, while a medium-priority task preempts the low one. What is the phenomenon called and what is its usual solution?
- deadlock, with the banker's algorithm
+ priority inversion, with priority inheritance
- starvation, with aging
! This is what happened to Mars Pathfinder in 1997.

? 10 processes alternate, q = 4 ms, one switch takes 0.1 ms. At most how many ms pass between two runs of a process? (one decimal place)
= 36.9
= 36,9
! (n − 1) · (q + s) = 9 · 4.1 = 36.9 ms.
```
