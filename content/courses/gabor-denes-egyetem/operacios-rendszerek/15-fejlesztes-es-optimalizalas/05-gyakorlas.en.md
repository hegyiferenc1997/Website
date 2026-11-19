---
title: Practice – Development and Optimisation
summary: A measuring exercise on your virtual machine, review questions and a summary worksheet with Amdahl's law.
minutes: 50
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

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **Calculating the load average.** The kernel updates every 5 seconds: new = old · e^(−5/P) + n · (1 − e^(−5/P)). Write the `load_avg(samples, P=60)` function: the `samples` list holds the running/runnable process counts measured every 5 seconds, the initial value is 0. Return the final value rounded to two decimals!

```python starter
def load_avg(samples, P=60):
    return sum(samples) / len(samples)
```

<details>
<summary>Solution</summary>

```python solution
import math

def load_avg(samples, P=60):
    e = math.exp(-5 / P)
    avg = 0.0
    for n in samples:
        avg = avg * e + n * (1 - e)          # exponentially damped average
    return round(avg, 2)
```

</details>

```python test
assert load_avg([4] * 12) == 2.53                # 1 minute, 4 processes
assert load_avg([4] * 60) == 3.97                # 5 minutes
assert load_avg([4] * 12, P=900) == 0.26         # the 15-minute value reacts slowly
assert load_avg([0] * 10) == 0.0
print("All checks passed!")
```

**2.** **A server's queueing model.** `lam` requests arrive per second, serving one takes `S` seconds. Write the `server(lam, S)` function: utilisation U = lam · S; if U ≥ 1, return `None` (the queue grows without bound). Otherwise the response time is R = S / (1 − U), and by Little's law the number of requests in the system is L = lam · R. Return the triple `(U, R, L)`, each rounded to three decimals!

```python starter
def server(lam, S):
    return (0, S, 0)
```

<details>
<summary>Solution</summary>

Notice: from 50 to 90 requests/s (1.8 times the traffic) the response time grows from 20 ms to 100 ms – fivefold. That's the "hockey stick" curve.

```python solution
def server(lam, S):
    U = lam * S
    if U >= 1:
        return None                          # more work arrives than can be done
    R = S / (1 - U)                          # M/M/1 response time
    L = lam * R                              # Little's law
    return (round(U, 3), round(R, 3), round(L, 3))
```

</details>

```python test
assert server(50, 0.01) == (0.5, 0.02, 1.0)
assert server(90, 0.01) == (0.9, 0.1, 9.0)
assert server(120, 0.01) is None
print("All checks passed!")
```

**3.** **Percentile.** Write the `percentile(data, p)` function using the "nearest rank" method: sort the data, and return the ⌈p/100 · n⌉-th element (numbered from 1)!

```python starter
def percentile(data, p):
    return sum(data) / len(data)
```

<details>
<summary>Solution</summary>

```python solution
import math

def percentile(data, p):
    ordered = sorted(data)
    rank = max(1, math.ceil(p / 100 * len(ordered)))     # rank numbered from 1
    return ordered[rank - 1]
```

</details>

```python test
times = [12, 15, 11, 300, 14, 13, 16, 12, 18, 450]
assert percentile(times, 50) == 14
assert percentile(times, 90) == 300
assert percentile(times, 100) == 450
assert percentile([5], 99) == 5
print("All checks passed!")
```

### Quick check questions

```quiz
? Which are the four main resources we look at in performance monitoring?
+ CPU, memory, disk, network
- CPU, monitor, keyboard, mouse
- RAM, ROM, BIOS, UEFI
! The slowest (first to fill up) is the bottleneck.

? I/O wait (wa) is high while CPU usage is low. What is probably the bottleneck?
+ the disk
- the processor
- the network card
! The CPU is waiting for the disk.

? On a 4-core machine the load average is 8.0. What does this mean?
+ double overload: on average one process waits beside every running one
- the machine is half loaded
- the machine is idle
! The load average is compared with the number of cores.

? Why is it not a problem on Linux if free shows hardly any "free" memory?
+ because the kernel uses unused memory as disk cache and frees it immediately when needed
- because Linux uses no memory
- because swap is always enough
! The "available" column is what matters, not "free".

? What should you do before optimising?
+ measure, and change only one thing at a time
- change as many settings as possible at once
- buy new hardware
! If you can't measure it, you can't know whether it improved.
```
