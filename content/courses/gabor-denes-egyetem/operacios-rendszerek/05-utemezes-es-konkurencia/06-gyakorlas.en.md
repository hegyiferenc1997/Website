---
title: Practice – Scheduling and Concurrency
summary: Review questions and a calculation-based summary worksheet on scheduling, semaphores and deadlock.
minutes: 55
kind: practice
---

## Review questions

<details>
<summary>1. Why can pure SJF not be used in practice?</summary>

Because the length of the next CPU burst is not known in advance. It can be estimated (e.g. with an exponential average of previous bursts), but not known exactly.

</details>

<details>
<summary>2. What happens with Round Robin if the quantum is larger than the longest burst?</summary>

Every process finishes within a single quantum and is never interrupted, so scheduling becomes exactly FCFS.

</details>

<details>
<summary>3. Why is a plain `if (free) free = false;` not enough for locking?</summary>

Because testing and setting are two separate steps: two threads may both see that it is free at the same time, and both enter. An atomic hardware instruction (e.g. test-and-set, compare-and-swap) or a mutex provided by the OS is needed.

</details>

<details>
<summary>4. What is the difference between deadlock and starvation?</summary>

In a deadlock none of the participants progresses; they wait for each other in a cycle. With starvation the system progresses, only one (low-priority) process never gets its turn.

</details>

<details>
<summary>5. How does allowing at most four philosophers to sit down at a time break the deadlock?</summary>

With four philosophers and five forks at least one of them surely gets both forks, eats and returns them – so circular wait cannot form.

</details>

## Summary worksheet

Three processes arrive at 0 ms in this order: **P1 = 4 ms**, **P2 = 8 ms**, **P3 = 2 ms**.

```quiz required
? What is the total waiting time (ms) with FCFS?
= 16
! Waiting: P1 = 0, P2 = 4, P3 = 12 → 16.

? What is the total waiting time (ms) with SJF?
= 8
! Order: P3 (0–2), P1 (2–6), P2 (6–14). Waiting: 0 + 2 + 6 = 8.

? What is the total waiting time (ms) with Round Robin, q = 4 ms?
= 14
! P1 0–4, P2 4–8, P3 8–10, P2 10–14. Waiting: P1 = 0, P2 = 14 − 8 = 6, P3 = 10 − 2 = 8 → 14.

? A semaphore has initial value 2. Four threads call `wait()`, then one thread calls `signal()`. How many threads are blocked afterwards?
= 1
! Two get in, two wait; signal wakes one of them.

? Which is NOT a necessary condition of deadlock?
- mutual exclusion
- hold and wait
- circular wait
+ preemptive scheduling
! The fourth condition is "no preemption".

? Which scheduling gives the smallest average waiting time if the bursts are known and everyone arrives at once?
+ SJF
- FCFS
- Round Robin
- priority, with random priorities
! It can be proven that SJF is optimal for average waiting.
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **FCFS and SJF average waiting.** Every process arrives at 0 ms. Write the `avg_waiting(bursts, sjf=False)` function: with FCFS they run in the given order, with SJF in increasing order of burst; return the average waiting time!

```python starter
def avg_waiting(bursts, sjf=False):
    return 0
```

<details>
<summary>Solution</summary>

```python solution
def avg_waiting(bursts, sjf=False):
    order = sorted(bursts) if sjf else list(bursts)
    time, total = 0, 0
    for burst in order:
        total += time                 # it waited this long before its turn
        time += burst
    return total / len(order)
```

</details>

```python test
assert avg_waiting([4, 8, 2]) == 16 / 3
assert avg_waiting([4, 8, 2], sjf=True) == 8 / 3
assert avg_waiting([24, 3, 3]) == 17
assert avg_waiting([24, 3, 3], sjf=True) == 3
print("All checks passed!")
```

**2.** **Round Robin completion times.** Write the `rr_completion(bursts, q)` function: the processes arrive at 0 ms in the given order, Round Robin scheduling with quantum q (ignore the switching time). Return the completion times in the processes' original order!

```python starter
def rr_completion(bursts, q):
    return [0] * len(bursts)
```

<details>
<summary>Solution</summary>

```python solution
from collections import deque

def rr_completion(bursts, q):
    remaining = list(bursts)
    queue = deque(range(len(bursts)))
    end = [0] * len(bursts)
    time = 0
    while queue:
        i = queue.popleft()
        run = min(q, remaining[i])
        time += run
        remaining[i] -= run
        if remaining[i] > 0:
            queue.append(i)            # back to the end of the queue
        else:
            end[i] = time
    return end
```

</details>

```python test
assert rr_completion([4, 8, 2], 4) == [4, 14, 10]
assert rr_completion([5, 3], 2) == [8, 7]
assert rr_completion([3], 10) == [3]
print("All checks passed!")
```

**3.** **Banker's algorithm – is the state safe?** Write the `safe(free, max_need, held)` function for a single resource type: `free` is the number of free instances, the lists give each process's maximum need and current allocation. The state is safe if there's an order in which every process can get the missing part, run, and release what it holds.

```python starter
def safe(free, max_need, held):
    return True
```

<details>
<summary>Solution</summary>

In the first example: P2 is missing 2 (3 free) → runs, 5 free; P1 is missing 5 → runs, 10 free; finally P3 too. In the second, 2 are free: P2 runs (4 free), but P1 and P3 are each missing 5 → we're stuck.

```python solution
def safe(free, max_need, held):
    done = [False] * len(held)
    progress = True
    while progress:
        progress = False
        for i in range(len(held)):
            if not done[i] and max_need[i] - held[i] <= free:
                free += held[i]              # it runs and returns what it held
                done[i] = True
                progress = True
    return all(done)
```

</details>

```python test
assert safe(3, [10, 4, 9], [5, 2, 2]) is True
assert safe(2, [10, 4, 9], [5, 2, 3]) is False
assert safe(0, [2, 2], [2, 2]) is True
print("All checks passed!")
```

### Quick check questions

```quiz
? Which scheduling can cause starvation if short processes keep arriving?
+ SJF
- FCFS
- Round Robin
! The long process never gets its turn; aging helps.

? What is a critical section?
+ the part of the code that accesses shared data and that only one thread may run at a time
- the slowest part of the program
- the kernel's start-up code
! A mutex or semaphore protects it.

? A binary semaphore (mutex) has value 1. A thread calls wait(). What will its value be?
= 0
! The next wait() will block.

? Which method prevents deadlock by ruling out circular wait?
+ every thread acquires the locks in the same fixed order
- every thread acquires them in random order
- we start more threads
! If everyone asks for lock A first, then B, no cycle can form.

? What does the "hold and wait" deadlock condition mean?
- the process waits actively, in a loop
+ the process already holds a resource and waits for another meanwhile
- the process never gets a resource
! The four conditions: mutual exclusion, hold and wait, no preemption, circular wait.
```
