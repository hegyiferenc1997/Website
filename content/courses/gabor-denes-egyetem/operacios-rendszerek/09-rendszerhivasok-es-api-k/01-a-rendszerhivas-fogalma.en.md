---
title: What Is a System Call?
summary: How a program asks the kernel for a service, what happens during the trap, and why a system call is expensive.
minutes: 20
---

## What you will learn

- what a **system call** is and why a program cannot access the hardware directly,
- in which **steps** control passes from the program into the kernel and back,
- how to **observe** system calls (`strace`).

## Why do we need system calls?

User programs run in **user mode**: they cannot read the disk directly, send a network packet or touch other processes' memory. This is the basis of **protection**. If a program needs something like that, it has to **ask the kernel** – this is a **system call**: a call of a service provided by the kernel, through a controlled entry point.

Example: when a Python program does `print("hi")`, eventually a `write` system call reaches the kernel, which puts the text into the terminal.

## Steps of a system call

```text
user mode                                kernel mode
─────────                                ───────────
1. the program calls the write() library function
2. the library puts into registers:
   - the system call number (write = 1 on x86-64 Linux)
   - the parameters (file descriptor, buffer address, length)
3. executes the special instruction (syscall / trap) ──► 4. the CPU switches to kernel mode
                                                          and looks up handler no. 1
                                                          in the system call table
                                                       5. the kernel CHECKS the parameters
                                                          (is the descriptor valid, is the buffer your memory)
                                                       6. does the work
7. the program continues with the return value  ◄──   switches back to user mode
   (e.g. number of bytes written, or −1 on error)
```

Key points:

- the program **cannot jump** to an arbitrary kernel address – it can only enter through the system call table;
- the kernel **never trusts** the parameters; it checks everything;
- on error the return value signals the problem; in C the `errno` variable tells the reason (e.g. `ENOENT` = no such file).

## What does it cost?

Because of the mode switch, the checks and the caches, a system call is **many times more expensive** than an ordinary function call (roughly a hundred nanoseconds versus a few ns). That is why libraries **buffer**: `printf` does not call `write` for every character, but collects them and writes them at once.

## Observing: strace

In the Ubuntu VM `strace` prints all system calls of a program:

```bash
sudo apt install -y strace
strace -c ls > /dev/null        # summary: how many of each call
strace -e trace=openat,read,write cat /etc/hostname
```

In the output of the second command you see `cat` open (`openat`), read (`read`) and print (`write`) the file. On Windows a similar tool is **Process Monitor** (Sysinternals).

## Summary

- A system call is a controlled call of a kernel service from a user program.
- Steps: parameters and call number into registers → `syscall` instruction → kernel mode → checks → work → back.
- It is more expensive than a function call, so libraries buffer; it can be observed with `strace`.

## Lesson exercise

```quiz required
? Why can a user program not read directly from the disk?
+ Because it runs in user mode, and only the kernel may access the hardware.
- Because the disk is not switched on.
- Because programs do not know the disk's address.
- Because only the BIOS may read the disk.
! The system call is the controlled entry point into the kernel.

? With which x86-64 instruction does a Linux program enter the kernel for a system call?
= syscall
! Formerly the int 0x80 software interrupt.

? What is the kernel's first job after receiving a system call?
- It executes the request immediately.
+ It checks the parameters (e.g. the file descriptor and the buffer address).
- It restarts the program.
- It writes the request into the log.
! The kernel never trusts the user program.

? Which Linux tool prints all system calls of a program?
= strace
! strace -c ls – summary.

? Why does printf collect the text before writing it out at once?
+ Because system calls are expensive, so fewer write calls are needed.
- Because the terminal only accepts whole lines.
- Because the kernel cannot write a single character.
- Because the text stays encrypted that way.
! Buffering: one larger write instead of many small ones.
```
