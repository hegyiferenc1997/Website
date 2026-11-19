---
title: Deeper – Scheduling and Concurrency with a Simulator
summary: Your own scheduler simulator with arrival times (FCFS, SJF, Round Robin) and a Gantt chart, all possible interleavings of a lost update, checking the banker's algorithm's safety with a program, and trying out the Linux scheduler with nice values on the virtual machine.
minutes: 45
---

## What you will learn in this lesson

- how to compute the result of scheduling algorithms even when processes **arrive at different times**,
- how a simple program shows **in how many ways** a race condition can go wrong,
- how the **banker's algorithm** decides whether a request can be granted,
- how to influence the Linux scheduler with the **nice** value, and how to see its effect.

## 1. Scheduling with arrival times

In the basic lesson everyone arrived at once (at 0). In reality processes come **at different times**, and the scheduler can only choose from those that have already arrived. This is our common example:

| Process | Arrival (ms) | CPU burst (ms) |
| ------- | ------------ | -------------- |
| P1      | 0            | 7              |
| P2      | 2            | 4              |
| P3      | 4            | 1              |
| P4      | 5            | 4              |

A reminder of the metrics:

- **turnaround time** = completion − arrival (how much time passed until the process "finished"),
- **waiting time** = turnaround time − burst (how long it stood in the ready queue).

### By hand: FCFS

FCFS runs in arrival order: P1 0–7, P2 7–11, P3 11–12, P4 12–16.

| Process | Completion | Turnaround    | Waiting    |
| ------- | ---------- | ------------- | ---------- |
| P1      | 7          | 7 − 0 = 7     | 7 − 7 = 0  |
| P2      | 11         | 11 − 2 = 9    | 9 − 4 = 5  |
| P3      | 12         | 12 − 4 = 8    | 8 − 1 = 7  |
| P4      | 16         | 16 − 5 = 11   | 11 − 4 = 7 |

Average waiting: (0 + 5 + 7 + 7) / 4 = **4.75 ms**. Poor P3, which only wanted 1 ms, had to wait 7 ms – this is the **convoy effect**: short processes get stuck behind a long one.

### With a program: all three algorithms

Calculating by hand is error-prone and boring. Here's a small simulator that draws a Gantt chart too. Run it, then change the processes or the quantum!

```python run
# Scheduler simulator with arrival times: FCFS, SJF (non-preemptive) and Round Robin.
from collections import deque

PROCESSES = [("P1", 0, 7), ("P2", 2, 4), ("P3", 4, 1), ("P4", 5, 4)]   # name, arrival, burst

def fcfs(ps):
    time, gantt = 0, []
    for name, arr, burst in sorted(ps, key=lambda p: p[1]):
        time = max(time, arr)                # if nobody's there, the CPU idles
        gantt.append((time, time + burst, name))
        time += burst
    return gantt

def sjf(ps):
    time, gantt, left = 0, [], list(ps)
    while left:
        arrived = [p for p in left if p[1] <= time]
        if not arrived:                      # idle period: jump to the next arrival
            time = min(p[1] for p in left)
            continue
        p = min(arrived, key=lambda p: (p[2], p[1]))    # shortest burst, ties: the earlier one
        left.remove(p)
        gantt.append((time, time + p[2], p[0]))
        time += p[2]
    return gantt

def round_robin(ps, quantum):
    time, gantt, queue = 0, [], deque()
    remaining = {n: b for n, _, b in ps}
    arrivals = sorted(ps, key=lambda p: p[1])
    i = 0
    def admit():                             # those who have arrived so far join the queue
        nonlocal i
        while i < len(arrivals) and arrivals[i][1] <= time:
            queue.append(arrivals[i][0])
            i += 1
    admit()
    while queue or i < len(arrivals):
        if not queue:
            time = arrivals[i][1]
            admit()
        name = queue.popleft()
        run = min(quantum, remaining[name])
        gantt.append((time, time + run, name))
        time += run
        remaining[name] -= run
        admit()                              # newcomers line up before the returning one
        if remaining[name] > 0:
            queue.append(name)
    return gantt

def evaluate(title, gantt):
    print(title)
    print("  " + " ".join(f"[{s}–{e} {n}]" for s, e, n in gantt))
    completion = {n: e for _, e, n in gantt}  # end of the last slice
    waiting = [completion[n] - arr - burst for n, arr, burst in PROCESSES]
    print(f"  average waiting: {sum(waiting) / len(waiting):.2f} ms\n")

evaluate("FCFS", fcfs(PROCESSES))
evaluate("SJF", sjf(PROCESSES))
evaluate("Round Robin, quantum = 2", round_robin(PROCESSES, 2))
```

The results: FCFS **4.75**, SJF **4.00**, Round Robin (q = 2) **5.00** ms average waiting.

What do we learn from this?

- **SJF** gives the best average waiting – but it would have to know the burst lengths in advance, which in reality can only be estimated.
- **Round Robin**'s average is the worst here, yet desktop systems use it (or refinements of it): P2 gets its **first** turn within 2 ms, i.e. the **response time** is small. With an interactive program (word processor, browser) the user feels this, not the average waiting.
- **There's no algorithm that's best at everything**: whichever wins on one metric loses on another. This is one of the most important lessons of scheduling.

## 2. In how many ways can it go wrong? – the lost update

Two threads increment the same counter at the same time. `counter++` is really **three steps**: read (into a register), increment, write back. The scheduler can switch between the threads after any step.

Instead of experimenting with real threads (where the bug is rare and hard to reproduce), the program goes through **all possible interleavings** and counts which gives what final result:

```python run
# Two threads, both: read → increment → write back. Trying all possible interleavings.
from itertools import combinations

STEPS = ["read", "increment", "write"]

def run(order):
    """The order tells which thread takes the next step (A or B)."""
    shared = 0                               # the counter in shared memory
    reg = {"A": 0, "B": 0}                   # the threads' own registers
    pos = {"A": 0, "B": 0}                   # which step the thread is at
    for thread in order:
        step = STEPS[pos[thread]]
        if step == "read":
            reg[thread] = shared
        elif step == "increment":
            reg[thread] += 1
        else:
            shared = reg[thread]
        pos[thread] += 1
    return shared

results = {}
for a_slots in combinations(range(6), 3):   # where thread A steps among the 6 steps
    order = ["A" if i in a_slots else "B" for i in range(6)]
    v = run(order)
    results.setdefault(v, []).append("".join(order))

for v, orders in sorted(results.items()):
    print(f"final result {v}: {len(orders):2} interleavings, e.g. {orders[0]}")
```

Of the 20 possible interleavings, **only 2** give the correct 2: when one thread finishes **completely** before the other reads. In the other 18 cases **an update is lost**. On a real machine the switch usually doesn't happen at exactly the wrong place, so the bug only shows up rarely – and that's exactly what makes it dangerous: it passes the tests, then one day in production the result is wrong.

A **mutex** achieves exactly that the three steps run as an **indivisible** block: then only the two "serial" interleavings remain.

## 3. The banker's algorithm with a program

In the basic lesson we checked by hand whether a state is **safe** (12 units, P0 10/5, P1 4/2, P2 9/2). The program does the same, and also tells whether a new request can be granted: it "hands it over" temporarily and checks whether the state stays safe.

```python run
# Banker's algorithm with one resource type: is the state safe, can the request be granted?
TOTAL = 12
MAXIMUM = {"P0": 10, "P1": 4, "P2": 9}
HOLDS = {"P0": 5, "P1": 2, "P2": 2}

def safe(holds):
    free = TOTAL - sum(holds.values())
    done, order = set(), []
    while len(done) < len(holds):
        for p in holds:
            if p not in done and MAXIMUM[p] - holds[p] <= free:
                free += holds[p]             # p runs and gives back everything
                done.add(p)
                order.append(p)
                break
        else:
            return None                      # nobody can proceed: not safe
    return order

print("Current state, safe order:", safe(HOLDS))

def request(p, n):
    trial = dict(HOLDS)
    trial[p] += n
    order = safe(trial)
    answer = f"can be granted, order: {order}" if order else "can NOT be granted (not safe)"
    print(f"{p} asks for {n} more units → {answer}")

request("P1", 2)
request("P2", 1)
request("P0", 1)
```

An interesting result: if **P2 asks for just 1** unit, the banker **doesn't give it**, even though there are 3 free units! Afterwards only 2 would remain free: P1 could still finish (free 4), but then there wouldn't be enough for either P0 (5) or P2 (6) – if both asked for their maximum, a **deadlock** could occur. So the banker looks ahead: it doesn't check whether there's enough now, but whether everyone can finish **in the worst case**.

## 4. The Linux scheduler in practice: nice

Linux handles general-purpose processes with a scheduler (**EEVDF**, the successor of the earlier CFS) that shares processor time "fairly" – weighted by the **nice** value. Nice can be between −20 (most important) and 19 (least important), 0 by default. One step means roughly a **1.25×** difference in the time received.

Try it in the Ubuntu VM! We start two programs that fully occupy the processor, forced onto **the same core** (`taskset -c 0`), one of them "nicely" (nice 10):

```bash
taskset -c 0 yes > /dev/null &              # program 1, nice 0
taskset -c 0 nice -n 10 yes > /dev/null &   # program 2, nice 10
top                                         # watch the %CPU column (quit: q)
```

In the `top` output the first `yes` gets about **90%**, the second about **10%** of the processor (10 steps ≈ 1.25¹⁰ ≈ 9× ratio). Change it on the fly:

```bash
renice -n 0 -p $(pgrep -n yes)    # make the second nice 0 too → about 50–50%
killall yes                       # clean up at the end!
```

An ordinary user can only **increase** the nice value (make their program nicer); only the administrator can decrease it (gain an advantage) (`sudo renice -n -5 …`) – otherwise everyone would make their own program the most important.

On Windows, right-click → **Set priority** (Low … Realtime) on Task Manager's **Details** page corresponds to this; in PowerShell: `(Get-Process notepad).PriorityClass = 'BelowNormal'`.

## Summary

- With arrival times the scheduler can only choose from those that have arrived; **waiting = completion − arrival − burst**.
- In the example: FCFS 4.75, SJF 4.00, RR (q = 2) 5.00 ms average waiting – but RR has the best response time. No algorithm wins at everything.
- Of the 20 interleavings of two threads' `counter++`, only 2 are correct: that's why mutual exclusion is needed.
- The **banker** only grants if afterwards there's still an order in which everyone can finish – it may say no even when resources are free right now.
- On Linux the **nice** value weights processor time; it can be tried out vividly with `taskset`, `top` and `renice`.

## Exercise

```quiz required
? FCFS scheduling, P1 arrives at 0 (burst 7), P2 arrives at 2 (burst 4). What is P2's waiting time (ms)?
= 5
! P2 starts at 7 and finishes at 11: 11 − 2 − 4 = 5.

? In the lesson's common example, which algorithm gave the smallest average waiting time?
- FCFS
+ SJF
- Round Robin (q = 2)
! 4.00 ms – but it would require knowing the burst lengths in advance.

? Why do desktop systems still use Round Robin-like scheduling?
- because its average waiting is always the smallest
+ because its response time is small: every process gets a turn soon
- because it doesn't need a timer interrupt
! For interactive programs the response time is what matters.

? Two threads execute the three-step (read, increment, write back) counter++ at the same time. Of the 20 possible interleavings, how many give the correct result?
= 2
! Only the two "serial" interleavings, when one thread finishes completely before the other reads.

? There are 12 units, P0 holds 5 (max 10), P1 holds 2 (max 4), P2 holds 2 (max 9). P2 asks for 1 more unit. What does the banker decide?
- grants it, because there are 3 free units
+ refuses it, because afterwards the state wouldn't be safe
! Afterwards only P1 could surely finish, P0 and P2 couldn't.

? On Linux, which value means the least important (nicest) process?
- nice −20
- nice 0
+ nice 19
! The larger the nice value, the less processor time the process gets.
```
