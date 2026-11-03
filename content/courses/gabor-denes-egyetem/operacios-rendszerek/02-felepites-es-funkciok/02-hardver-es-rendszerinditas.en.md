---
title: Hardware and Booting
summary: Processor, memory, buses and interrupts – and what happens from power-on to login.
minutes: 20
---

## What you will learn

- which **hardware components** the OS works with (processor, memory hierarchy, peripherals),
- what an **interrupt** is and why it is the OS's "alarm clock",
- how the computer **boots**: firmware → boot loader → kernel → first process.

## Main parts of a computer

- **Processor (CPU)**: executes instructions. Important registers: the **program counter** (PC – address of the next instruction), the **stack pointer** (SP) and the **status register** (holding the mode bit: kernel or user mode).
- **Memory**: where running programs and their data live.
- **Peripherals**: disk, keyboard, network card, display – each has a **controller**.
- **Buses** connect them.

### The memory hierarchy

| Level             | Typical size  | Access time      |
| ----------------- | ------------- | ---------------- |
| registers         | < 1 KB        | < 1 ns           |
| cache (L1–L3)     | 1–64 MB       | 1–10 ns          |
| main memory (RAM) | 8–64 GB       | ~100 ns          |
| SSD               | 0.5–4 TB      | ~0.1 ms (100,000 ns) |
| HDD               | 1–20 TB       | ~10 ms           |

The lower we go, the bigger and cheaper but **slower** the storage. One of the OS's main tasks is to keep frequently used data on the faster levels.

## Interrupts

An **interrupt** is a signal to the processor that something needs attention. The CPU then **suspends** its current work, saves its state, runs the appropriate **interrupt handler** (part of the OS), and then continues where it left off.

| Kind                      | Who triggers it?              | Example                                  |
| ------------------------- | ----------------------------- | ---------------------------------------- |
| **hardware** interrupt    | a device                      | you pressed a key, a network packet arrived, the timer expired |
| **exception**             | an error in the running instruction | division by zero, invalid memory address |
| **software** interrupt (_trap_) | deliberately by the program | system call (e.g. it wants to read a file) |

The **timer** interrupt is especially important: it regularly gives control back to the OS, so even a program stuck in an infinite loop cannot "take" the machine.

## Booting

```text
power on
  → firmware (UEFI): hardware test (POST), finding the boot device
  → boot loader: GRUB (Linux) / Windows Boot Manager
  → loading and starting the kernel: hardware detection, drivers
  → first user process: systemd (PID 1) / smss.exe, wininit.exe
  → services, login screen
```

1. The **firmware** (today **UEFI**, formerly BIOS) is a program on the motherboard; it checks the hardware and finds the **EFI system partition**.
2. The **boot loader** loads the kernel into memory. With Secure Boot it also checks the signature.
3. The **kernel** initialises memory management and the scheduler, and loads the drivers.
4. The **first process** starts: on Linux **systemd** (process ID: **1**), which starts the other services.

In the Ubuntu VM you can see how long booting took:

```bash
systemd-analyze          # total boot time
systemd-analyze blame | head   # the slowest services
ps -p 1 -o pid,comm      # who is process 1?
```

## Summary

- Of the CPU's registers, the program counter and the status register (mode bit) matter most to the OS.
- The memory hierarchy: register → cache → RAM → SSD → HDD; lower is bigger but slower.
- An interrupt suspends the CPU; kinds: hardware, exception, software (trap).
- Boot: UEFI → boot loader → kernel → first process (systemd on Linux, PID 1).

## Lesson exercise

```quiz required
? Which register holds the address of the next instruction to execute?
+ program counter (PC)
- stack pointer (SP)
- accumulator
- status register
! Program Counter – also called instruction pointer (IP).

? Which interrupt ensures that even a program stuck in an infinite loop cannot hold the processor forever?
- keyboard interrupt
+ timer interrupt
- division by zero exception
- disk interrupt
! The timer regularly gives control back to the OS.

? What is the process ID (PID) of systemd on Linux?
= 1
! It is the first user process; everything else descends from it.

? What kind of interrupt is a division by zero?
- hardware interrupt
+ exception
- system call
- timer interrupt
! It is triggered by an error in the running instruction.

? Roughly how many times slower is an SSD access (~100,000 ns) than a RAM access (~100 ns)?
= 1000
! 100,000 / 100 = 1000.
```
