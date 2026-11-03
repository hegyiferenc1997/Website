---
title: Multiprocessor Scheduling in Practice
summary: Multi-core scheduling, load balancing and affinity, the Linux CFS/EEVDF scheduler and the nice value, Windows priorities.
minutes: 25
---

## What you will learn

- which problems come up when scheduling **several cores** (load balancing, **affinity**),
- how **Linux** schedules (CFS, EEVDF) and what the **nice** value is for,
- how **Windows** priorities work, and what a **real-time** priority is.

## More cores, more problems

- **Symmetric multiprocessing** (SMP): every core is equal and schedules for itself. This is the norm today.
- **Per-core run queues**: every core has its own ready queue – so there is no shared queue to fight over (faster without locking).
- **Load balancing**: if one core's queue is full and another's is empty, the kernel **migrates** tasks (_push_ / _pull migration_).
- **Processor affinity**: a thread should preferably stay **on the same core**, because its cache is "warm" there. So load balancing and affinity work against each other – the scheduler balances.
- **Hybrid processors**: today's Intel and ARM chips have **performance** (P) and **efficiency** (E) cores; the scheduler puts background tasks on the E cores.

```bash
nproc                    # how many logical processors there are
taskset -cp $$           # your shell's affinity: which cores it may run on
htop                     # per-core load (sudo apt install htop)
```

## The Linux scheduler

Between 2007 and 2023 Linux used **CFS** (_Completely Fair Scheduler_): it computes every task's **virtual runtime** (_vruntime_), and the task that has **run the least** always gets the CPU. So in the long run everyone gets a fair share. Since kernel 6.6 its successor **EEVDF** (_Earliest Eligible Virtual Deadline First_) schedules; it keeps the same fairness but gives short, interactive tasks better latency.

### The nice value

The **nice** value ranges from −20 (highest priority) to +19 (lowest), **0** by default. The name comes from a "nice" process letting the others go first.

```bash
nice -n 10 tar czf backup.tgz ~/lab     # start with a lower priority
ps -o pid,ni,cmd                         # NI column: the nice value
renice -n 5 -p <PID>                     # change a running process's nice value
sudo renice -n -5 -p <PID>               # RAISING priority works only for root
```

One nice level of difference means roughly **10%** more or less CPU time compared to a competing process.

## The Windows scheduler

Windows uses **priority-based, preemptive** scheduling with **32 levels** (0–31):

- **1–15**: variable (dynamic) priorities for ordinary programs; Windows temporarily **boosts** the priority of the foreground window or of a thread just returning from an I/O wait, so the machine responds well;
- **16–31**: **real-time** priorities – these always preempt the ordinary ones;
- **0**: the system thread that zeroes memory pages.

On the **Details** tab of Task Manager, the right-click **Set priority** menu offers classes: _Low_, _Below normal_, _Normal_, _Above normal_, _High_, _Realtime_. _Realtime_ is dangerous: a runaway program can take the CPU even from the system.

```powershell
Get-Process | Select-Object -First 5 Name, PriorityClass
# As administrator: (Get-Process notepad).PriorityClass = "BelowNormal"
```

## Real-time scheduling in brief

In a **real-time** system what counts is not the average but that a task finishes **by its deadline** (e.g. an airbag, an industrial robot). On Linux the `SCHED_FIFO` and `SCHED_RR` real-time scheduling classes always preempt normal tasks. We return to this in the topic on types of operating systems.

## Summary

- Multi-core scheduling: per-core queues, load balancing, affinity; hybrid P/E cores.
- Linux: CFS, then EEVDF – the task that has run least gets the CPU; nice −20…+19, default 0.
- Windows: 32 priority levels, 16–31 real-time, the foreground gets a dynamic boost.

## Lesson exercise

```quiz required
? What is the default nice value on Linux?
= 0
! Range: −20 (highest) … +19 (lowest priority).

? Which nice value means the lowest priority?
- −20
- 0
- 10
+ 19
! The "nicer" the process, the more it lets the others go first.

? What does processor affinity mean?
+ A thread should preferably run on the same core, because its cache is warm there.
- The strongest core always belongs to the system.
- Every thread runs on every core at once.
- The cores sleep in turns.
! Load balancing, in contrast, sometimes migrates tasks.

? How many priority levels does the Windows scheduler use?
= 32
! 0–31; 16–31 is the real-time range.

? What is the scheduler used since Linux kernel 6.6, the successor of CFS, called? (abbreviation)
= EEVDF
! Earliest Eligible Virtual Deadline First.
```
