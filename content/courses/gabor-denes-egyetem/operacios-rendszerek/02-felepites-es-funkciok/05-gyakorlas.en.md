---
title: Practice – Structure and Functions
summary: Review questions and a summary worksheet on the structure of operating systems.
minutes: 45
kind: practice
---

## Review questions

Try to answer in your head first, only then open the answer!

<details>
<summary>1. Give an example of the OS acting as a resource manager and one of it acting as an extended machine!</summary>

Resource manager: the browser and the music player get the processor in turns, and both get separate memory areas. Extended machine: programs open files by name instead of addressing disk blocks.

</details>

<details>
<summary>2. Why is the timer interrupt needed in a multitasking system?</summary>

Because without it, a program that never makes a system call (e.g. runs in an infinite loop) would never give control back to the OS, and the other programs could not run.

</details>

<details>
<summary>3. List the steps of booting on Linux!</summary>

Power on → UEFI firmware (POST, boot device) → GRUB boot loader → loading and initialising the kernel → systemd (PID 1) starts the services → login screen.

</details>

<details>
<summary>4. Why does it speed up the machine if the OS keeps frequently used data in RAM?</summary>

Because RAM access is orders of magnitude faster than SSD or HDD access (about 100 ns versus 0.1–10 ms).

</details>

Try it in the Ubuntu VM:

```bash
cat /proc/cpuinfo | grep "model name" | head -1   # which processor the guest sees
cat /proc/meminfo | head -3                        # memory
systemd-analyze                                    # boot time
```

## Summary worksheet

```quiz required
? What is today's successor of the old BIOS that starts the computer?
= UEFI
! Unified Extensible Firmware Interface.

? Which Linux boot loader is the most common (Ubuntu uses it too)?
+ GRUB
- NTLDR
- systemd
- POST
! GRand Unified Bootloader.

? Which is the fastest storage in the memory hierarchy?
+ register
- L3 cache
- RAM
- SSD
! Registers are inside the processor, accessible in under 1 ns.

? Which kind of interrupt does a program trigger deliberately when it asks for an OS service?
- hardware interrupt
- exception
+ software interrupt (trap, system call)
- timer interrupt
! System calls get their own topic.

? Which system is the intellectual ancestor of today's Linux and macOS (1970s, Bell Labs)?
= UNIX
! Ken Thompson and Dennis Ritchie, 1969–1973.

? Roughly how many nanoseconds is the RAM access time according to the lesson's table?
= 100
! Register < 1 ns, RAM ~100 ns, SSD ~100,000 ns.
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **Polling or interrupt?** A device signals `events` events per second. With polling the CPU checks the device `polls` times a second, at 1 µs each; with interrupts the cost is 5 µs per event. Write the `better_method(events, polls)` function, which returns `"polling"` or `"interrupt"` – whichever costs less CPU time (on a tie, the interrupt)!

```python starter
def better_method(events, polls):
    return "polling"
```

<details>
<summary>Solution</summary>

```python solution
def better_method(events, polls):
    polling_us = polls * 1            # every check costs 1 µs, event or not
    irq_us = events * 5               # every event is an interrupt, 5 µs
    return "polling" if polling_us < irq_us else "interrupt"
```

</details>

```python test
assert better_method(10, 1000) == "interrupt"          # rare event: a waste to keep checking
assert better_method(100000, 100000) == "polling"      # very frequent events
assert better_method(200, 1000) == "interrupt"
print("All checks passed!")
```

**2.** **Without DMA and with DMA.** For a 1 MB (1,048,576-byte) transfer, without DMA the CPU performs one operation for every **4 bytes** (0.01 µs each); with DMA it's only burdened by the set-up (2 µs) and one interrupt at the end (5 µs). Write the `cpu_time_us(nbytes, dma)` function, which returns the CPU load in µs!

```python starter
def cpu_time_us(nbytes, dma):
    return 0
```

<details>
<summary>Solution</summary>

```python solution
def cpu_time_us(nbytes, dma):
    if dma:
        return 2 + 5                  # set-up + completion interrupt
    return nbytes / 4 * 0.01          # every 4 bytes is one CPU operation
```

</details>

```python test
assert cpu_time_us(1048576, True) == 7
assert round(cpu_time_us(1048576, False), 2) == 2621.44
assert round(cpu_time_us(400, False), 2) == 1.0
print("All checks passed!")
```

**3.** **Which storage, how long?** Write the `level(ns)` function, which tells from an access time (in nanoseconds) which storage level it's typical of: below 1 ns `"register"`, below 10 ns `"cache"`, below 1000 ns `"RAM"`, below 1,000,000 ns `"SSD"`, otherwise `"hard disk"`.

```python starter
def level(ns):
    return "RAM"
```

<details>
<summary>Solution</summary>

```python solution
def level(ns):
    # the limits in order, from the fastest
    for limit, name in [(1, "register"), (10, "cache"), (1000, "RAM"), (1_000_000, "SSD")]:
        if ns < limit:
            return name
    return "hard disk"
```

</details>

```python test
assert level(0.3) == "register"
assert level(4) == "cache"
assert level(80) == "RAM"
assert level(100_000) == "SSD"
assert level(8_000_000) == "hard disk"
print("All checks passed!")
```

### Quick check questions

```quiz
? What starts the operating system first after the machine is switched on?
- the kernel starts itself
+ the motherboard firmware (UEFI/BIOS), which loads the boot loader
- the user's first program
! UEFI → boot loader (e.g. GRUB, Windows Boot Manager) → kernel.

? What is an interrupt?
+ a device's signal to the CPU asking for attention; the CPU suspends what it's doing and runs the handler
- a program crashing
- a power cut
! Afterwards the CPU continues where it left off.

? Which is NOT a basic task of the operating system?
- managing resources (CPU, memory, devices)
- isolating processes from each other
+ formatting spreadsheets
- managing files
! That's an application's (a spreadsheet's) job.

? What is the advantage of DMA?
- it raises the processor's clock speed
+ the device copies data into memory without the CPU, which can do something else meanwhile
- it encrypts the data
! Direct Memory Access.

? Which is the fastest storage level?
+ the CPU registers
- RAM
- the SSD
- the cache
! Register < cache < RAM < SSD < hard disk.
```
