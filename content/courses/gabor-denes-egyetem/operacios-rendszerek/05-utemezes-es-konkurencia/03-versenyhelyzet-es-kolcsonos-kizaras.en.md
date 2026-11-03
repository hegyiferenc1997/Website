---
title: Race Conditions and Mutual Exclusion
summary: Why two threads incrementing the same variable give a wrong result, and how mutexes and semaphores protect it.
minutes: 25
---

## What you will learn

- what a **race condition** and a **critical section** are,
- which **conditions** a good solution must satisfy,
- how a **mutex** and a **semaphore** work, and what the **producer–consumer** problem is.

## The race condition

Two threads increment the same `counter` variable. At the processor level `counter++` is **three** steps:

```text
1. load:   R ← counter
2. add:    R ← R + 1
3. store:  counter ← R
```

If the scheduler switches at a bad moment, an increment is **lost**:

| Time | Thread 1              | Thread 2              | counter  |
| ---- | --------------------- | --------------------- | -------- |
| 1    | load (R = 5)          |                       | 5        |
| 2    |                       | load (R = 5)          | 5        |
| 3    | add, store (6)        |                       | 6        |
| 4    |                       | add, store (6)        | **6** (7 would be correct) |

We speak of a **race condition** when the result depends on the **order of execution** of the threads. These bugs are sneaky: they show up rarely and randomly.

```c
// Two threads increment a million times each – without protection the result is rarely 2000000.
#include <pthread.h>
#include <stdio.h>

long counter = 0;

void *increment(void *arg) {
    for (int i = 0; i < 1000000; i++) counter++;   // critical section, unprotected!
    return NULL;
}

int main(void) {
    pthread_t a, b;
    pthread_create(&a, NULL, increment, NULL);
    pthread_create(&b, NULL, increment, NULL);
    pthread_join(a, NULL);
    pthread_join(b, NULL);
    printf("%ld\n", counter);   // e.g. 1338204
    return 0;
}
```

## The critical section

The **critical section** is the part of the code that accesses shared data. Conditions of a good solution:

1. **mutual exclusion**: at most **one** thread can be in the critical section at a time,
2. **progress**: if nobody is inside, one of those wanting to enter gets in within a reasonable time,
3. **bounded waiting**: nobody waits forever (no starvation).

## Mutex

A **mutex** (_mutual exclusion_) is a lock: `lock()` – if free, takes it; if taken, the thread **waits**. `unlock()` – releases it.

```c
pthread_mutex_t lock = PTHREAD_MUTEX_INITIALIZER;

void *increment(void *arg) {
    for (int i = 0; i < 1000000; i++) {
        pthread_mutex_lock(&lock);     // enter the critical section
        counter++;
        pthread_mutex_unlock(&lock);   // leave
    }
    return NULL;
}
```

Now the result is always **2000000**. The price of locking is slowdown, so the critical section should be **as short as possible**.

## Semaphore

A **semaphore** (Dijkstra, 1965) is an integer counter with two **atomic** (indivisible) operations:

- **`wait()`** (P, _down_): decrements the value; if it would become negative (no free resource), the thread **blocks**.
- **`signal()`** (V, _up_): increments the value and, if someone is waiting, **wakes up** one.

Its initial value is the number of resources: for a car park with 3 spaces `S = 3`. The fourth car's `wait()` already makes it wait. A semaphore with initial value 1 (**binary**) works like a mutex.

## The producer–consumer problem

A **producer** puts items into a finite **buffer** of size N, the **consumer** takes them out (e.g. a downloader and a player). Three semaphores are needed:

- `empty = N` – how many free slots there are,
- `full = 0` – how many items there are,
- `mutex = 1` – only one at a time may handle the buffer.

```text
producer:                   consumer:
  wait(empty)                 wait(full)
  wait(mutex)                 wait(mutex)
  item into buffer            item out of buffer
  signal(mutex)               signal(mutex)
  signal(full)                signal(empty)
```

If the buffer is full, the producer waits at `wait(empty)`; if it is empty, the consumer waits at `wait(full)`.

## Summary

- Race condition: the result depends on the order of execution; caused by non-atomic operations on shared data.
- Conditions of the critical section: mutual exclusion, progress, bounded waiting.
- Mutex: a lock (lock/unlock); semaphore: a counter with wait/signal operations.
- The producer–consumer problem is solved with two counting semaphores and one mutex semaphore.

## Lesson exercise

```quiz required
? What do we call the bug where the result depends on the order of execution of the threads?
= race condition
= race
! Typically non-atomic operations on shared data.

? The value of counter is 10. Two threads execute `counter++` at the same time without protection, in the bad order shown in the table. What will its value be?
= 11
! Both threads load 10 and store 11 – one increment is lost.

? Which condition says that at most one thread may be in the critical section at a time?
+ mutual exclusion
- progress
- bounded waiting
- aging
! Mutual exclusion – hence the name mutex.

? A semaphore has initial value 3. Five threads call `wait()` one after another (nobody calls `signal()`). How many threads block?
= 2
! The first three get in, the fourth and fifth wait.

? In the producer–consumer solution, what is the initial value of the `full` semaphore?
+ 0
- 1
- N
- −1
! Initially there are no items in the buffer.
```
