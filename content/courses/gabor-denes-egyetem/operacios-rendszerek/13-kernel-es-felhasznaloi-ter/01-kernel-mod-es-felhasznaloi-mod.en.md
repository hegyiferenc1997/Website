---
title: Kernel Mode and User Mode
summary: The mode bit, protection rings, privileged instructions, and how the address space is split between the kernel and programs.
minutes: 20
---

## What you will learn

- the difference between **kernel mode** and **user mode**,
- what **protection rings** are and which instructions are **privileged**,
- how the **address space** is split between the kernel and user space, and when the CPU switches modes.

## Two modes

The processor uses a **mode bit** to signal with which rights the currently executing code runs:

| Aspect                   | **Kernel mode** (supervisor)              | **User mode**                            |
| ------------------------ | ----------------------------------------- | ---------------------------------------- |
| who runs this way?       | the kernel, device drivers                | every application, the shell, the browser |
| hardware access          | directly                                  | **only** via system calls                |
| privileged instructions  | allowed                                   | **forbidden** (raise an exception)       |
| memory                   | reaches everything                        | only its own address space               |
| effect of a bug          | the whole system may stop (kernel panic, BSOD) | only the program stops              |

**Privileged instructions** include: disabling interrupts, setting the timer, loading the page table address, accessing I/O ports, halting the machine. If a user program tries one, the CPU raises an **exception** and the kernel stops the program.

## Protection rings

x86 processors know four **rings**, from 0 (most rights) to 3 (fewest):

```text
        ┌───────────────────────────┐
        │ Ring 3: applications      │
        │   ┌───────────────────┐   │
        │   │ Ring 2, 1 (rarely) │   │
        │   │   ┌───────────┐   │   │
        │   │   │ Ring 0:   │   │   │
        │   │   │ kernel    │   │   │
        │   │   └───────────┘   │   │
        │   └───────────────────┘   │
        └───────────────────────────┘
```

Today's systems practically use only **0** (kernel) and **3** (user). For virtualization processors got an additional level (often called "ring −1") – the hypervisor runs there. On ARM processors the same are called **exception levels** (EL0–EL3).

## When does the CPU switch modes?

- **user → kernel**: on a system call (`syscall`), an interrupt (timer, device), an exception (page fault, division by zero);
- **kernel → user**: at the end of handling, with a special return instruction (e.g. `sysret`, `iret`).

A program can **never** switch to kernel mode by itself – it can only come in through the controlled entry points.

## Kernel and user space in memory

Every process's address space has two parts: the **lower** part is the program's own area (**user space**), the kernel is mapped into the **upper** part (**kernel space**). The kernel-space pages are marked **"supervisor only"** in the page table, so they cannot be accessed from user mode. (Since the 2018 Meltdown vulnerability, kernels also hide this part more strictly from user mode.)

When this course speaks of "user space", it means all software running **outside** the kernel: the shell, libraries, services, the graphical interface and the applications.

```bash
ps -eo pid,comm | grep "\[" | head    # on Linux, [bracketed] names are kernel threads
cat /proc/$$/status | grep -i ctxt   # how many times your shell switched
```

## Summary

- Kernel mode: full access; user mode: only its own memory, hardware only via system calls.
- A privileged instruction in user mode → exception → the kernel stops the program.
- x86 rings: 0 = kernel, 3 = application; the hypervisor runs on an even more privileged level.
- Mode switch: system call, interrupt, exception; kernel space is not accessible from user mode.

## Lesson exercise

```quiz required
? In which protection ring does the kernel run on an x86 processor?
= 0
= ring 0
! Applications run in ring 3.

? What happens if a user-mode program tries to execute a privileged instruction?
- The CPU executes it, but slower.
+ The CPU raises an exception and the kernel stops the program.
- The program switches to kernel mode automatically.
- The machine reboots.
! This is the basis of hardware protection.

? Which case does NOT cause a switch from user mode to kernel mode?
- a system call
- a timer interrupt
- a page fault
+ an ordinary function call within the program
! The program's own functions run in user mode.

? In which ring do applications run on x86?
= 3
! 0 = kernel, 3 = user.
```
