---
title: Threads
summary: What a thread is, what threads in a process share, user-level and kernel-level threads, threading models.
minutes: 20
---

## What you will learn

- what a **thread** is and how it differs from a process,
- what threads **share** and what is **private** to each,
- what **user-level** and **kernel-level** threads are and which **threading models** exist.

## Why do we need threads?

A browser has to download a page, draw images and respond to clicks at the same time. If all this happened in a single line of execution, the window would "freeze" during a slow download. The solution: **several threads** inside one process, running **in parallel** (or in turns).

A **thread** is the smallest unit of execution the OS can schedule. A process has at least one thread (the main thread).

## What do threads share?

| Shared (belongs to the process)         | Private (per thread)                  |
| --------------------------------------- | ------------------------------------- |
| code (text)                             | program counter (PC)                  |
| global data, heap                       | registers                             |
| open files, network connections         | **stack**                             |
| address space, permissions              | state (running, ready, waiting)       |

Advantages over separate processes:

- **faster creation and switching** – no new address space has to be built,
- **easy data sharing** – they all see the same memory,
- **multi-core use** – threads can run on separate cores.

Drawback: since memory is shared, if two threads write to the same place at the same time a **race condition** can occur – covered in the next topic. And if one thread crashes (e.g. invalid memory address), **the whole process** stops.

## User-level and kernel-level threads

- **User-level threads**: managed by a library inside the process; the kernel **does not know about them** (it only sees one process). Switching is very fast, but if one thread makes a blocking system call, **all of them** stop, and they cannot run on several cores.
- **Kernel-level threads**: the kernel knows and schedules each one. Blocking one does not stop the others, and they use several cores. On Linux and Windows, program threads are kernel threads.

## Threading models

| Model         | Description                                            | Example                       |
| ------------- | ------------------------------------------------------ | ----------------------------- |
| **many-to-one** (N:1) | many user threads on a single kernel thread    | old "green thread" libraries  |
| **one-to-one** (1:1)  | one kernel thread for every user thread        | Linux (pthreads), Windows     |
| **many-to-many** (N:M)| many user threads on fewer kernel threads      | Go goroutines, Java virtual threads |

## Threads in practice

```c
// Two threads run the same function (POSIX threads).
#include <pthread.h>
#include <stdio.h>

void *work(void *arg) {
    printf("Thread %ld is working\n", (long)arg);
    return NULL;
}

int main(void) {
    pthread_t t1, t2;
    pthread_create(&t1, NULL, work, (void *)1);
    pthread_create(&t2, NULL, work, (void *)2);
    pthread_join(t1, NULL);   // wait for both
    pthread_join(t2, NULL);
    return 0;
}
```

Compile in the Ubuntu VM: `gcc threads.c -o threads -pthread && ./threads`. The order of the two lines may change from run to run – the scheduler decides.

You can see a process's threads like this:

```bash
ps -eLf | head      # every thread on its own line (LWP = thread ID)
top -H              # shows CPU usage per thread
```

## Summary

- A thread is the smallest schedulable unit of execution; a process can have several.
- Threads share code, heap and files; the PC, registers and stack are private.
- Kernel threads can run on several cores and block independently.
- Models: N:1, 1:1 (Linux, Windows), N:M (Go, Java virtual threads).

## Lesson exercise

```quiz required
? Which is private to every thread (not shared with the process's other threads)?
- the heap
- the open files
+ the stack
- the program code
! The stack, the registers and the program counter are per thread.

? What happens to the other threads if a user-level (N:1) thread makes a blocking system call?
+ All of them stop, because the kernel sees only one unit of execution.
- Nothing, they keep running.
- They move to another process.
- The kernel starts new threads instead.
! That is why today's systems use kernel threads (1:1).

? Which threading model does Linux's pthreads library use? (e.g. 1:1)
= 1:1
! One user thread = one kernel thread.

? Which C function creates a new POSIX thread?
= pthread_create
! pthread_join waits for it to finish.
```
