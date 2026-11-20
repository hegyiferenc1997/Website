---
title: Deeper – Operations in Numbers
summary: How many servers a given traffic needs, and why a server slows down well before 100% (queueing), how likely data loss is in a RAID 5 array during a rebuild, why the 95th percentile is the right measure of response time, and how many backups a rotation scheme keeps – with small programs and an interactive chart.
minutes: 50
---

## What you will learn in this lesson

- how to **size** a service for the expected traffic,
- why a server slows down **dramatically** when its load goes above 80–90%,
- how much RAID really **protects**, and when it isn't enough,
- how to **measure** response time (with percentiles instead of the average), and how to plan a **backup** scheme.

## 1. Sizing: how many servers do we need?

A university course registration system gets sudden heavy traffic in the first minute of registration. If we know how many requests arrive per second and how much one server can handle, we can compute the number of machines needed – **with reserve**:

```python run
# Sizing: how many servers for peak traffic, with headroom and allowing for one machine failing
from math import ceil

students = 12_000
active_share = 0.4                  # this many are clicking in the peak minute
requests_per_person_min = 6         # requests per minute from an active user
server_capacity = 150               # requests/second a server handles comfortably
target_utilisation = 0.7            # we don't want to load it to 100% (see the next section)

peak = students * active_share * requests_per_person_min / 60
needed = ceil(peak / (server_capacity * target_utilisation))
print(f"peak traffic: {peak:.0f} requests/s")
print(f"servers needed at 70% utilisation: {needed}")
print(f"+1 spare (N+1), in case a machine fails: {needed + 1}")
```

The **N+1** principle means the system can handle the peak even if one machine fails (or is under maintenance). In the cloud the number of machines can also grow **automatically** with load (autoscaling) – you still need the calculation above to know what limits to set and what it will cost.

## 2. Why does a server slow down before 100%?

A server is like a checkout in a shop: if requests arrive at random, a **queue** forms even when there's spare capacity on average. According to the simplest model of queueing theory, the average response time is:

$$T = \frac{S}{1 - \rho}$$

where $S$ is the service time of one request and $\rho$ the utilisation (between 0 and 1).

```plot
title: Average response time (ms) as a function of server utilisation (%)
x: 0, 98
y: 0, 500
param: s = 20, 5, 50, 5
f: s/(1 - x/100) # T = S / (1 − ρ), S = s ms
dash: 100 # 100 ms: slower than this feels sluggish to the user
```

```python run
# Response time as a function of utilisation: T = S / (1 - ρ)
S = 20                                       # ms to serve one request
for rho in [0.5, 0.7, 0.8, 0.9, 0.95, 0.99]:
    print(f"{rho:4.0%} utilisation: average response time {S / (1 - rho):6.0f} ms")
```

At 50% the response time is twice the service time, at 90% ten times, at 99% a hundred times. That's why we don't plan for 100% utilisation: **the curve shoots up at the end**, and even a small increase in traffic causes a dramatic slowdown. It works the same way for a cashier, a call centre and a motorway.

## 3. How much does RAID protect?

In the basic lesson we saw that RAID 5 survives one disk failing. But when a disk fails, the array must be **rebuilt** – with big disks this can take a day or two, and meanwhile **every** remaining disk has to be read through. If a second disk fails in the meantime, all data is lost:

```python run
# Chance of data loss during a RAID rebuild (simple model, independent failures)
from math import comb

afr = 0.02                                   # a disk's annual failure rate (2%)
rebuild_days = 2                             # how long the rebuild takes

def second_failure(remaining_disks, tolerance):
    p_day = afr / 365 * rebuild_days         # chance of one disk failing during the rebuild
    # chance that at least "tolerance" further disks fail too
    return sum(comb(remaining_disks, k) * p_day**k * (1 - p_day)**(remaining_disks - k) for k in range(tolerance, remaining_disks + 1))

for name, disks, tolerance in [("RAID 5, 4 disks", 4, 1), ("RAID 5, 12 disks", 12, 1), ("RAID 6, 12 disks", 12, 2)]:
    p = second_failure(disks - 1, tolerance)
    print(f"{name:<17} chance of data loss during rebuild: {p:.5%}")
```

According to the model, the risk grows with the number of disks (with 12 disks almost four times that with 4), and **RAID 6** (two disks may fail) is orders of magnitude safer. In reality the risk is **higher** than the model shows: disks bought from the same batch at the same time often age together, and the rebuild load itself raises the chance of failure – assuming independent failures is optimistic here. And most importantly: **RAID is not a backup** – it doesn't protect against accidental deletion or ransomware.

## 4. Measuring response time: why isn't the average enough?

A website's average response time is 120 ms – sounds good. But what if 5% of requests take 2 seconds? Those users experience "the site is slow". That's why operators watch **percentiles**: **p95** is the value below which 95% of requests fall.

```python run
# Response times: mean, median, p95 and p99 from a log
import random
from statistics import mean, quantiles

random.seed(9)
times = [random.gauss(80, 15) for _ in range(950)] + [random.uniform(800, 2500) for _ in range(50)]   # 5% slow requests
q = quantiles(times, n=100)                 # 99 cut points: q[49] is the median, q[94] the p95
print(f"mean:   {mean(times):6.0f} ms")
print(f"median: {q[49]:6.0f} ms")
print(f"p95:    {q[94]:6.0f} ms")
print(f"p99:    {q[98]:6.0f} ms")

# alert rule: if p95 goes above a limit
limit = 500
print("ALERT: p95 above the limit!" if q[94] > limit else "ok")
```

The average (about 160 ms) hides that every twentieth request takes seconds; p95 and p99 show it. From a **monitoring** viewpoint, alerts are therefore built on percentiles, and service levels (SLA/SLO) are often phrased this way too: "95% of requests under 300 ms."

## 5. Backup scheme: how many backups should we keep?

A common rotation scheme is **grandfather–father–son** (GFS): a backup is made daily, of which the last 7 days are kept; 4 of the weekly backups; 12 of the monthly ones. That way there's a backup going back a year, yet 365 copies needn't be stored:

```python run
# Grandfather–father–son backup scheme: how many backups, and how far back can we go?
daily, weekly, monthly = 7, 4, 12
print(f"stored backups: {daily + weekly + monthly} (instead of 365 daily backups)")
print(f"restore: any day of the last {daily} days, weekly for {weekly} weeks, monthly for {monthly} months")

# if an error (e.g. silent data corruption) is only noticed after some time:
for days in [3, 20, 60, 400]:
    if days <= daily:
        answer = "from a daily backup, exactly"
    elif days <= weekly * 7:
        answer = "from a weekly backup (at most 1 week of data lost)"
    elif days <= monthly * 30:
        answer = "from a monthly backup (at most 1 month of data lost)"
    else:
        answer = "NO backup that old"
    print(f"error {days:>3} days ago → {answer}")
```

And the most important rule, which many skip: **backups must be test-restored regularly.** With a never-tested backup, you only find out on the day of disaster that it's incomplete or unreadable.

| Viewpoint      | What do they watch out for in operations?                               |
| -------------- | ----------------------------------------------------------------------- |
| **operator**   | capacity, utilisation, p95 response time, alerts, backups               |
| **developer**  | efficient code (shorter service time), logging, a health-check endpoint |
| **user**       | a fast, always available service – the background doesn't interest them |
| **management** | cost versus risk: how much reserve and redundancy is worth it           |

## Summary

- For sizing you need the peak traffic, server capacity and target utilisation; the N+1 principle survives one machine failing.
- Response time grows as $S/(1-\rho)$: at 90% utilisation it's ten times the service time – so we don't plan for 100%.
- RAID 5 is vulnerable during a rebuild, RAID 6 is much safer; but RAID is not a backup.
- Measure response time with percentiles (p95, p99); besides a backup scheme (e.g. GFS), test restores are a must.

## Lesson exercise

```quiz required
? At peak, 840 requests arrive per second, a server handles 150 requests/s, and we'd load it to at most 70%. How many servers are needed (without a spare)?
= 8
! $840 / (150 \cdot 0.7) = 840 / 105 = 8$.

? Serving a request takes 10 ms. What is the average response time at 80% utilisation (ms)?
= 50
! $10 / (1 - 0.8) = 50$ ms.

? What does it mean that the p95 response time is 300 ms?
- the average response time is 300 ms
+ 95% of requests are faster than 300 ms
- 95% of requests are slower than 300 ms
- the server runs at 95% utilisation
! The percentile also shows the slow requests that the average hides.

? How many backups does a rotation scheme keeping 7 daily + 4 weekly + 12 monthly backups store?
= 23
! $7 + 4 + 12 = 23$.

? Why doesn't RAID replace backups?
- because RAID is slow
+ because it immediately applies an accidental deletion or ransomware encryption to every disk
- because RAID only works with two disks
- because RAID is more expensive
! RAID protects against disk failure, not against losing data.
```
