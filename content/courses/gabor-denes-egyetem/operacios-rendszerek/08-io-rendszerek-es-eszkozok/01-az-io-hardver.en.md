---
title: I/O Hardware
summary: Device types, controllers and their registers, ports and memory-mapped I/O, polling, interrupts and DMA.
minutes: 20
---

## What you will learn

- which **device types** the OS distinguishes,
- what a **device controller** is and how the processor "talks" to it (**ports**, **memory-mapped I/O**),
- the difference between **polling**, **interrupt-driven** I/O and **DMA**.

## Device types

| Type                 | Characteristic                              | Example                      |
| -------------------- | ------------------------------------------- | ---------------------------- |
| **block** device     | readable in fixed-size blocks, in any order | SSD, HDD, USB stick          |
| **character** device | byte stream, sequential only                | keyboard, mouse, serial port |
| **network** device   | sends and receives packets                  | Ethernet, Wi-Fi              |

The difference in speed is enormous: a keyboard delivers ~10 bytes/s, an NVMe SSD 7 GB/s – the OS has to handle both well.

## The device controller

Every device has a **controller** – a small piece of electronics (often with its own processor) that speaks the device's "language". The CPU writes and reads the controller's **registers**:

- **status register** – ready or busy, was there an error,
- **command register** – what to do (e.g. "read block 1000"),
- **data register(s)** – the data being moved.

The registers can be accessed in two ways:

- **I/O ports**: a separate address space and separate instructions (`in`, `out` on x86),
- **memory-mapped I/O**: the registers appear in part of the memory address space and can be controlled with ordinary memory writes. Today's devices (PCIe, graphics card) mostly work this way.

## How does the CPU learn that the device is ready?

### 1. Polling

The CPU reads the status register **again and again** in a loop until the device is ready.

```text
while (status == busy) { nothing }   ← busy waiting
data ← data register
```

Simple, but **wasteful**: the CPU does nothing useful meanwhile. Only worth it for very fast devices or very short waits.

### 2. Interrupt-driven I/O

The CPU issues the command and **does something else**. When the device is ready it sends an **interrupt**; the kernel's interrupt handler takes the data and puts the waiting process into the **ready** state.

Drawback: an interrupt for every byte/word – for a fast disk this would mean millions per second.

### 3. DMA (direct memory access)

The **DMA controller** (_Direct Memory Access_) **copies** the data between the device and memory **by itself**, instead of the CPU. The CPU only says: "copy 64 KB from block 1000 of the disk to memory address X", and receives a **single** interrupt at the end.

```text
polling:    CPU ─ asks, asks, asks … ─ data
interrupt:  CPU ─ command ─ (other work) ─ IRQ ─ 1 word ─ (other work) ─ IRQ ─ 1 word …
DMA:        CPU ─ command ─ (other work …………………………………………) ─ IRQ: 64 KB done
```

Every high-speed device (disk, network, audio, video) uses DMA.

```bash
cat /proc/interrupts | head    # how many interrupts each device has raised so far
lspci                          # list of PCI(e) devices (controllers)
lsusb                          # USB devices
```

## Summary

- Device types: block, character, network.
- The CPU communicates with the controller's registers, via I/O ports or memory-mapped.
- Polling: busy waiting; interrupt: the device signals when ready; DMA: the controller copies by itself, one interrupt at the end.

## Lesson exercise

```quiz required
? What type of device is a keyboard?
- block
+ character
- network
- memory-mapped
! It delivers a byte stream, readable only sequentially.

? What does the abbreviation DMA stand for?
= Direct Memory Access
! The controller copies into memory without the CPU.

? With which method does the CPU do busy waiting?
+ polling
- interrupt-driven I/O
- DMA
- spooling
! It keeps reading the status register.

? A 64 KB block is read with DMA. How many interrupts does the CPU receive at the end of the transfer?
= 1
! A single interrupt arrives at the end of the whole transfer.

? Which Linux command lists the PCI(e) devices?
= lspci
! For USB devices: lsusb.
```
