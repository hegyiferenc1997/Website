---
title: Deeper – Performance Analysis with a Method
summary: The USE method (utilisation, saturation, errors) as a checklist, how the kernel calculates the load average (simulator), why waiting time explodes above 80–90% utilisation (queueing theory), the average versus the 99th percentile, Little's law, correct measurement (warm-up, median), and finding the bad change by halving (git bisect).
minutes: 45
---

## What you will learn in this lesson

- a proven **method** (USE), so that with a slow system you go through a list instead of guessing,
- how the kernel **calculates** the load average, and why the 15-minute value is "slow",
- why a disk or server that is 90% utilised has a **ten times** slower response time than an idle one,
- why the **average** lies, and what the **99th percentile** shows,
- **Little's law**, which tells you how many requests are in the system at once,
- how to measure **correctly**, and how to find the change that broke something by **halving**.

## 1. The USE method: a checklist against slowness

The method of performance engineer Brendan Gregg: for **every resource** (CPU, memory, disk, network), check **three** things:

| Letter | Meaning         | Question                                        |
| ------ | --------------- | ----------------------------------------------- |
| **U**  | **Utilisation** | What percentage of the time was it busy?        |
| **S**  | **Saturation**  | Is there a queue, is anyone waiting for it?     |
| **E**  | **Errors**      | Are there errors (retransmissions, I/O errors)? |

| Resource | Utilisation            | Saturation                           | Errors                        |
| -------- | ---------------------- | ------------------------------------ | ----------------------------- |
| CPU      | `top`: %us + %sy       | `vmstat`: **r** > number of cores    | rare (`dmesg`: MCE errors)    |
| memory   | `free`: used / total   | `vmstat`: **si/so** (paging) > 0     | `dmesg`: OOM killer           |
| disk     | `iostat -x`: **%util** | `iostat -x`: **aqu-sz** (queue size) | `dmesg`: I/O error            |
| network  | `sar -n DEV`: kbit/s   | `ss -ti`: retransmits, drops         | `ip -s link`: errors, dropped |

The point: **saturation** is often more important than utilisation. A CPU working at 100% may still be fine (if nobody's waiting for it), but if 20 processes are queuing, users feel the slowness.

**Analogy:** a doctor doesn't guess either, but goes through things systematically: temperature, blood pressure, pulse. The USE method is the list of the system's "vital signs".

## 2. How does the kernel calculate the load average?

The load average isn't a simple arithmetic mean but an **exponentially damped moving average**: the kernel updates it **every 5 seconds**, and the weight of old values fades gradually:

**new = old · e^(−5/P) + n · (1 − e^(−5/P))**,

where n is the number of running or runnable processes, and P is 60, 300 or 900 seconds (1, 5, 15 minutes).

```python run
# Simulating the load average: 4 processes work for 5 minutes, then silence
import math

avg = {60: 0.0, 300: 0.0, 900: 0.0}               # 1, 5, 15 minute average
moments = {60, 300, 360, 600, 900, 1800}          # print at these seconds

for sec in range(0, 1800, 5):
    n = 4 if sec < 300 else 0                     # 4 processes run in the first 5 minutes
    for P in avg:
        e = math.exp(-5 / P)
        avg[P] = avg[P] * e + n * (1 - e)
    if sec + 5 in moments:
        print(f"minute {(sec + 5) // 60:>2}: load average: "
              f"{avg[60]:.2f}, {avg[300]:.2f}, {avg[900]:.2f}")
```

Notice:

- After 1 minute of load, the 1-minute value is only **2.53** – not 4! Because of the damping it takes time to "catch up" with reality.
- 5 minutes after the load stops, the 1-minute value is already 0, but the 15-minute one is still **0.81**.

A lesson for troubleshooting: if `uptime` shows **1 min > 5 min > 15 min** (e.g. 3.9, 2.5, 1.1), the load is **rising now**; if the other way round (0.0, 0.9, 0.8), it's **over** – maybe you started investigating too late.

## 3. Why does waiting explode above 90%? – queueing

Imagine the canteen with a single till. If the cashier is busy 50% of the time, you rarely have to wait. At 90% there's almost always someone ahead of you. According to the simplest queueing model (M/M/1), the average **response time** is:

**R = S / (1 − U)**,

where S is the service time (e.g. a disk operation, 1 ms) and U is the utilisation.

```python run
# Response time as a function of utilisation (M/M/1 queueing model)
S_MS = 1.0                                         # service time of one request (ms)

print(f"{'utilisation':>12} {'response':>10} {'of which waiting':>17}")
for U in [0.10, 0.50, 0.70, 0.80, 0.90, 0.95, 0.99]:
    R = S_MS / (1 - U)
    print(f"{U:>11.0%} {R:>8.1f} ms {R - S_MS:>15.1f} ms {'#' * min(int(R), 50)}")
```

The curve isn't a straight line but a **hockey stick**: at 50% the response time doubles, at 90% it's **ten times**, at 99% **a hundred times**. That's why administrators don't want a server at 100%: above a sustained 70–80% users already feel the slowdown, even though "there's still headroom". The same happens on the motorway: at 90% capacity a single braking car causes a jam.

## 4. The average lies – percentiles

Response times of a web server's 1000 requests: 950 requests are fast (10–30 ms), 50 are very slow (200–500 ms, e.g. because they had to wait for the disk).

```python run
# Average, median and high percentiles of the same data set
fast = [10 + (i * 7) % 21 for i in range(950)]           # 10–30 ms
slow = [200 + (i * 37) % 301 for i in range(50)]         # 200–500 ms
times = sorted(fast + slow)

def percentile(ordered, p):
    # the smallest value at or below which p percent of the requests lie
    index = max(0, int(len(ordered) * p / 100 + 0.5) - 1)
    return ordered[index]

print(f"average: {sum(times) / len(times):6.1f} ms")
for p in [50, 90, 95, 99, 100]:
    print(f"p{p:<3}:    {percentile(times, p):6} ms")
```

The **average** (about 34 ms) describes neither group: fast requests take 10–30 ms, slow ones over 200 ms. The **median** (p50) is the typical user's experience, but **p99** shows what every **hundredth** request goes through – here almost half a second. Loading a web page involves many requests: if a page makes 100 requests, at least one is almost certain to fall into the slowest 1%. That's why serious systems use **p99** (or p99.9) as the metric, not the average.

## 5. Little's law

A simple but surprisingly general relationship for any queueing system:

**L = λ · W**

- **L** – how many requests are in the system **at once** on average,
- **λ** – how many requests **arrive** per second,
- **W** – how long a request stays inside on average.

Example: **200** requests per second arrive at a server, each taking **50 ms** on average → L = 200 · 0.05 = **10** requests in progress at once. If the server can work on at most 8 threads, requests **queue up**, and the response time jumps. The law holds for the canteen too: if 6 students arrive per minute and everyone spends 5 minutes in the queue and at the till, on average 30 people are inside.

## 6. Correct measurement: warm-up, repetition, median

The first run is almost always **slower**: the program and data aren't in the cache yet, the page table and TLB are cold, and the CPU frequency is still ramping up. Therefore:

1. do a **warm-up** run that you don't count,
2. **repeat** many times,
3. use the **median** (or the minimum), not a single measurement – a background process can spoil any single run.

```python run
# A correct microbenchmark: warm-up, repetition, median – comparing two solutions
import timeit, statistics

def concat_plus(n=2000):
    s = ""
    for i in range(n):
        s += str(i)
    return s

def concat_join(n=2000):
    return "".join(str(i) for i in range(n))

for fn in [concat_plus, concat_join]:
    fn()                                           # warm-up
    runs = timeit.repeat(fn, number=50, repeat=7)
    ms = [r / 50 * 1000 for r in runs]             # time of one call in ms
    print(f"{fn.__name__:<12} median {statistics.median(ms):.3f} ms "
          f"(min {min(ms):.3f}, max {max(ms):.3f})")
```

The spread between min and max shows how "noisy" the measurement is. If two solutions' results lie within the noise, you can't say one is faster.

## 7. Which change broke it? – halving

A common situation in kernel development: kernel 6.11 was still fast, 6.12 is slow, and there are **10,000** changes (_commits_) between them. Which one is the culprit? Trying them all is hopeless – but with **halving** (binary search) a few steps suffice: you try the middle one; if it's already slow, the bug is in the first half, if it's still fast, in the second half.

```python run
# Binary search for the bad commit: how many test builds are needed?
import math

def bisect(num_commits, bad):
    good, broken = 0, num_commits                  # commit 0 is still good, the last is bad
    steps = 0
    while broken - good > 1:
        mid = (good + broken) // 2
        steps += 1
        if mid >= bad:                             # test: is the middle already slow?
            broken = mid
        else:
            good = mid
    return broken, steps

found, steps = bisect(10_000, bad=6_789)
print(f"the bad commit: {found}, {steps} tests were needed")
print(f"in theory: log2(10000) ≈ {math.log2(10_000):.1f} → at most {math.ceil(math.log2(10_000))} tests")
```

Out of 10,000 changes the bad one is found in **at most 14 tests** (13 were enough here)! The `git bisect` command automates exactly this: you mark the good and the bad version, and git always checks out the middle one for testing. Linux kernel developers regularly find performance regressions this way.

```bash
git bisect start
git bisect bad                 # the current version is bad
git bisect good v6.11          # this one was still good
# … at every step: build, measure, then "git bisect good" or "git bisect bad"
git bisect reset               # at the end, back to the original state
```

## Summary

- **USE method**: utilisation, saturation, errors for every resource – saturation (queue length) is often more important than utilisation.
- The load average is an **exponentially damped** moving average; the order of the 1/5/15-minute values shows whether load is rising or falling.
- Queueing: **R = S / (1 − U)** – at 90% utilisation the response time is ten times higher.
- The average hides the rare, very slow requests; **p99** shows the worst 1%.
- **Little's law**: L = λ · W (requests inside at once = arrival rate × time spent inside).
- Correct measurement: warm-up, repetition, median; the bad change can be found by **halving** (git bisect) in log₂(n) steps.

## Lesson exercise

```quiz required
? A disk's service time is 2 ms and its utilisation is 80%. What is the average response time in ms according to the M/M/1 model?
= 10
= 10 ms
! R = S / (1 − U) = 2 / 0.2 = 10 ms.

? 100 requests per second arrive at a server, each taking 0.3 seconds on average. On average, how many requests are in progress at once?
= 30
! Little's law: L = λ · W = 100 · 0.3 = 30.

? uptime shows: load average: 0.10, 1.80, 2.40. What does this indicate?
- the load is rising now
+ the load ended recently, there's hardly any now
- the machine is completely overloaded right now
! The 1-minute value is the smallest – the peak is in the past.

? Which metric shows how long the worst 1% of requests take?
- the average
- the median
+ the 99th percentile (p99)
- the minimum
! The median (p50) shows the typical case, p99 the rare, slow ones.

? You're looking for the bad commit among 1000 with git bisect. At most how many tests are needed?
= 10
! log₂(1000) ≈ 9.97 → 10 tests.

? In the USE method, what does saturation mean?
- what percentage of the time the resource is busy
+ whether there is a queue, whether anyone is waiting for the resource
- how many errors occurred
! E.g. vmstat's r column is larger than the number of cores.
```
