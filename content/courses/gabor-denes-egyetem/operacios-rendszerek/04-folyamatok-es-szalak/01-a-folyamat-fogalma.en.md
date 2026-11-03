---
title: The Process and Its States
summary: Program versus process, the parts of the address space, the PCB and the five-state model.
minutes: 20
---

## What you will learn

- the difference between a **program** and a **process**,
- what parts a process's **address space** has and what the **PCB** stores,
- which **states** a process can be in and what triggers the transitions.

## Program and process

- A **program** is a **passive** file on disk (e.g. `/usr/bin/python3` or `notepad.exe`): instructions and data.
- A **process** is a **running instance** of a program: it has its own memory, register state and open files, and the OS gives it a unique identifier, the **PID**.

Several processes can run from the same program: if you open three Notepads, that is three processes from the same `notepad.exe`.

## The process address space

Each process sees its own **address space** (memory area), as if it were alone on the machine:

```text
high addr ┌──────────────────────┐
          │ stack                │ ← function calls, local variables; grows down
          │          ↓           │
          │                      │
          │          ↑           │
          │ heap                 │ ← dynamic allocation (malloc, new, Python objects); grows up
          ├──────────────────────┤
          │ data (data, bss)     │ ← global and static variables
          ├──────────────────────┤
          │ code (text)          │ ← the program's instructions, read-only
low addr  └──────────────────────┘
```

## The process control block (PCB)

The **PCB** (_Process Control Block_) is the kernel data structure in which the OS **records everything** about a process:

| Field           | Example                                          |
| --------------- | ------------------------------------------------ |
| identifiers     | PID, parent's PID (PPID), user                   |
| state           | running, ready, waiting                          |
| registers       | program counter, stack pointer …                 |
| scheduling data | priority, CPU time used so far                   |
| memory          | location of the page table, address space limits |
| resources       | open files, network connections                  |

On Linux the PCB is called `task_struct`. A process's data is also visible in the `/proc/<PID>/` folder:

```bash
echo $$                   # PID of your own shell
cat /proc/$$/status | head -10
```

## The five-state model

```text
           admitted            scheduler dispatch
   NEW ──────────────► READY ─────────────────────► RUNNING ──────► TERMINATED
                       ▲  ◄──────────────────────   │   exit
                       │   time slice expired       │
                       │                            │ waits for I/O or event
                       └──────── WAITING ◄──────────┘
                         I/O done / event occurred
```

- **New**: being created.
- **Ready**: has everything, only waits for the processor.
- **Running**: currently on the CPU. Only **one** process can run on a core at a time.
- **Waiting / blocked**: waits for something (disk, key, network) – a processor would not help.
- **Terminated**: finished, the OS frees its resources.

Important: after the event, a waiting process does **not** run again directly but goes to the **ready** queue.

## Summary

- A program is a passive file, a process is its running instance with its own PID and address space.
- Parts of the address space: code, data, heap, stack.
- The PCB stores the process's state, registers, scheduling and memory data.
- States: new, ready, running, waiting, terminated.

## Lesson exercise

```quiz required
? What do we call a running instance of a program?
= process
! The program is the passive file on disk.

? In which part of the address space are a function's local variables?
+ stack
- heap
- code (text)
- data
! The stack grows and shrinks with function calls.

? What does the abbreviation PCB stand for?
- Program Code Buffer
+ Process Control Block
- Processor Cache Bank
- Primary Control Bus
! The kernel records the process's data in it.

? A process has finished waiting for a disk read. Which state does it go to?
- running
+ ready
- new
- terminated
! The scheduler will select it to run later.

? On a 4-core processor, at most how many processes can be in the "running" state at the same time?
= 4
! One per core.
```
