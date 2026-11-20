---
title: Practice – Multitasking and Time-Sharing
summary: An experiment with the nice value and cores, review questions and a summary worksheet.
minutes: 50
kind: practice
---

## Experiment: who gets more CPU?

Set the Ubuntu VM to **1 processor** (Settings → System → Processor), so the two processes surely compete.

```bash
# Two endless busy loops: one normal, the other with nice 19.
sh -c 'while :; do :; done' &
nice -n 19 sh -c 'while :; do :; done' &
top                     # watch the %CPU and NI columns, then q
kill %1 %2              # stop both
```

The normal process gets most of the CPU time, the "nice" one only the rest. Afterwards restore the number of processors.

## Review questions

<details>
<summary>1. Why is a 0.01 ms quantum not worth choosing if a context switch takes 0.005 ms?</summary>

Because efficiency would be q / (q + s) = 0.01 / 0.015 ≈ 67%: a third of the CPU time would go just to switching.

</details>

<details>
<summary>2. What is the difference between the goals of multiprogramming and time-sharing?</summary>

Multiprogramming increases CPU utilisation (it should not stand idle during I/O). Time-sharing reduces response time, so many interactive users feel they use the machine alone.

</details>

<details>
<summary>3. Why does Windows boost the priority of the foreground window's threads?</summary>

So that the program the user is currently using reacts quickly to clicks and typing, even if compute-heavy tasks run in the background.

</details>

<details>
<summary>4. Why is it not always good for the kernel to migrate a thread to the least loaded core?</summary>

Because the cache and TLB are cold on the new core, so the thread runs slower for a while. If the load difference is small, it is better to leave it on its original core (affinity).

</details>

## Summary worksheet

```quiz required
? The quantum is 19 ms, a context switch takes 1 ms. What is the efficiency in percent?
= 95
= 95%
! 19 / 20 = 95%.

? 4 processes alternate, q = 25 ms. At most how many ms pass between two runs of a process?
= 75
! (4 − 1) · 25 = 75 ms.

? Which command starts a program with lower priority on Linux?
+ nice -n 10 program
- kill -9 program
- sudo program
- top program
! For running processes: renice.

? Which kind of multitasking does every modern desktop operating system use?
- cooperative
+ preemptive
- batch
- single-tasking
! The OS can take the CPU away with the help of the timer.

? Which Windows priority class is the most dangerous because it can take the CPU even from the system?
+ Realtime
- High
- Normal
- Low
! Levels 16–31 always preempt ordinary threads.

? What do we call it when several tasks make progress in a period but run alternately on one core?
= concurrency
! Parallelism is truly simultaneous running on several cores.
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **Overhead and waiting.** Write the `quantum_analysis(n, q, s)` function, which returns a pair: the overhead in percent (s / (q + s) · 100, rounded to one decimal) and the longest wait between two runs ((n − 1) · (q + s), one decimal).

```python starter
def quantum_analysis(n, q, s):
    return (0, 0)
```

<details>
<summary>Solution</summary>

```python solution
def quantum_analysis(n, q, s):
    overhead = round(s / (q + s) * 100, 1)
    wait = round((n - 1) * (q + s), 1)
    return (overhead, wait)
```

</details>

```python test
assert quantum_analysis(5, 4, 1) == (20.0, 20.0)
assert quantum_analysis(10, 10, 0.1) == (1.0, 90.9)
assert quantum_analysis(1, 20, 0) == (0.0, 0.0)
print("All checks passed!")
```

**2.** **CPU share from nice values.** The Linux scheduler turns the nice value into a weight: roughly **weight = 1024 / 1.25^nice**. Write the `shares(nice_values)` function, which returns what percentage of the CPU tasks competing on one core get (rounded to whole numbers)!

```python starter
def shares(nice_values):
    return [100 // len(nice_values)] * len(nice_values)
```

<details>
<summary>Solution</summary>

```python solution
def shares(nice_values):
    weights = [1024 / 1.25 ** n for n in nice_values]
    total = sum(weights)
    return [round(100 * w / total) for w in weights]
```

</details>

```python test
assert shares([0, 0]) == [50, 50]
assert shares([0, 1]) == [56, 44]
assert shares([0, 5]) == [75, 25]
assert shares([0, 10]) == [90, 10]
print("All checks passed!")
```

**3.** **Load balancing across cores.** Write the `finish(tasks, cores)` function: starting **with the longest**, each task (run times in ms) is always put on the least loaded core. Return when the last core finishes (ms)!

```python starter
def finish(tasks, cores):
    return sum(tasks)
```

<details>
<summary>Solution</summary>

This is the greedy "longest first" (LPT) method. The second example shows the limit: no distribution speeds up a 10 ms task – a task runs on only one core at a time.

```python solution
def finish(tasks, cores):
    load = [0] * cores
    for t in sorted(tasks, reverse=True):          # start with the longest
        i = load.index(min(load))                  # the least loaded core
        load[i] += t
    return max(load)
```

</details>

```python test
assert finish([5, 5, 4, 4, 3, 3], 3) == 8
assert finish([10, 1, 1, 1], 2) == 10
assert finish([2, 2, 2, 2], 4) == 2
assert finish([7, 3], 1) == 10
print("All checks passed!")
```

### Quick check questions

```quiz
? What is the difference between parallelism and concurrency?
+ parallelism: several tasks really run at once on several cores; concurrency: several tasks progress interleaved, even on one core
- there's no difference
- concurrency exists only on networks
! There can be concurrency on one core, but not parallelism.

? What is processor affinity?
+ a thread should preferably run on the same core, because its cache is "warm" there
- raising the processor's clock speed
- the processor's temperature control
! On Linux it can be set with the taskset command.

? Which nice value means the highest priority on Linux?
= -20
! The range is −20 (highest) … +19 (lowest).

? Why isn't it a good idea to set a program to "Realtime" priority in Windows Task Manager?
+ because a runaway program can take the CPU away from the rest of the system too
- because it makes the program slower
- because this only works on Linux
! Realtime levels always preempt ordinary ones.

? What is a voluntary context switch?
+ when the process itself waits (e.g. for I/O) and gives up the CPU
- when its time slice expires
- when the user closes the program
! A nonvoluntary switch happens when the time slice expires.
```
