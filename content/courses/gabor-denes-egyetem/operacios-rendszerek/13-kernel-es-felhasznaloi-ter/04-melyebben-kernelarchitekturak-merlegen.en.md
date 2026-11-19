---
title: Deeper – Kernel Architectures on the Scales
summary: A tiny CPU simulator with a mode bit and privileged instructions, the cost of monolithic and microkernels in numbers (mode switches, messages), reliability and the size of the trusted computing base, the top and bottom halves of interrupts, and why a 10 Gbit/s network card couldn't cope with one interrupt per packet.
minutes: 40
---

## What you will learn in this lesson

- to see on a **tiny CPU simulator** how the mode bit and privileged instructions protect the system,
- to compare the cost of a monolithic kernel and a microkernel **in numbers**,
- to calculate how system **reliability** depends on kernel size and drivers,
- to understand the **top and bottom halves** of interrupt handling,
- to calculate why a fast network card needs **interrupt coalescing**.

## 1. The mode bit in a tiny CPU simulator

Let's build a toy CPU that executes instructions. It has a **mode bit** (kernel/user), and certain instructions are **privileged**. If a user program tries one, the CPU raises an **exception**, and control passes to the kernel – exactly as you learned in the base lesson.

```python run
# Toy CPU with a mode bit: a privileged instruction in user mode raises an exception
PRIVILEGED = {"CLI", "TIMER", "HALT", "OUT"}          # disable interrupts, timer, halt, I/O

class CPU:
    def __init__(self):
        self.mode = "kernel"                          # kernel mode at start-up
        self.log = []

    def execute(self, program, who):
        for instr in program:
            if instr in PRIVILEGED and self.mode == "user":
                self.exception(who, instr)
                return
            if instr == "SYSCALL":
                self.log.append(f"{who}: SYSCALL → kernel mode, the kernel does it with checks")
                self.mode = "kernel"
                self.log.append("kernel: writes to the screen (OUT), then back to user mode")
                self.mode = "user"
            else:
                self.log.append(f"{who}: {instr} ({self.mode} mode)")

    def exception(self, who, instr):
        self.mode = "kernel"
        self.log.append(f"!!! EXCEPTION: {who} tried a privileged instruction ({instr}) "
                        f"→ kernel mode, the kernel terminates the program")

cpu = CPU()
cpu.execute(["TIMER"], "kernel")                       # the kernel sets the timer
cpu.mode = "user"                                      # hands control to a program
cpu.execute(["ADD", "SYSCALL", "ADD"], "good_program")
cpu.mode = "user"
cpu.execute(["ADD", "CLI", "ADD"], "bad_program")      # wants to disable interrupts
print("\n".join(cpu.log))
```

Notice: the bad program's second `ADD` **never** runs. If the CPU allowed `CLI` (disabling interrupts), the program could switch off the timer and never give back control – we'd be back to the "freezes" of cooperative multitasking.

## 2. What does a microkernel cost? – let's calculate!

Let's read a piece of a file. In a **monolithic** kernel this is one system call: 2 mode switches (in and out), and the file system and disk driver reach each other with ordinary function calls. In a **microkernel** the application sends a message to the file system server, which sends one to the disk driver server, and the replies going back are messages too – each message is a trip through the kernel.

```python run
# Cost of a file read with a monolithic kernel and a microkernel (simplified model)
MODE_SWITCH_US = 0.1    # one entry to or exit from the kernel (µs)
FUNCTION_CALL_US = 0.005
CONTEXT_US = 0.5        # switch to another process (server), including cache effects
WORK_US = 2.0           # the actual file system and driver work

# Monolithic: 1 system call (2 mode switches) + 2 function calls + work
mono = 2 * MODE_SWITCH_US + 2 * FUNCTION_CALL_US + WORK_US

# Microkernel: app → FS → driver → FS → app = 4 messages,
# each: 2 mode switches + 1 context switch to the receiving server
messages = 4
micro = messages * (2 * MODE_SWITCH_US + CONTEXT_US) + WORK_US

print(f"monolithic:  {mono:.2f} µs / read")
print(f"microkernel: {micro:.2f} µs / read ({micro / mono:.1f}×)")
for reads in [1_000, 1_000_000]:
    print(f"{reads:>9} reads: monolithic {reads * mono / 1000:8.1f} ms, "
          f"microkernel {reads * micro / 1000:8.1f} ms")
```

In this model the microkernel is about **2.2 times** slower for a tiny read. Reality is more nuanced: researchers of the L4 family showed that with clever design message passing can be squeezed down to a few hundred nanoseconds, and if the actual work is large (e.g. reading big blocks), the overhead's share is negligible. That's why we say a microkernel **can be slower**, not that it is necessarily slow.

## 3. Reliability: the size of the trusted computing base

The **trusted computing base** (_TCB_) is the code in which a single bug can endanger the security or operation of the **whole system**. In a monolithic kernel this is the **entire** kernel – including all drivers. Research shows that a significant share of kernel bugs lies precisely in the **drivers**: many people write them, for many kinds of hardware, and fewer people test them.

Let's estimate! Suppose there are on average **0.5 hidden bugs** per 1000 lines of code (a realistic order of magnitude for carefully tested code):

```python run
# Estimating hidden bugs from the size of code running in kernel mode
BUGS_PER_THOUSAND_LINES = 0.5

systems = [
    ("seL4 microkernel",                 10_000),        # formally proven
    ("MINIX 3 kernel",                   15_000),
    ("Linux: core only (no drivers)", 3_000_000),
    ("Linux: full (all drivers)",    40_000_000),
]
for name, lines in systems:
    print(f"{name:<32} {lines:>12,} lines → ~{lines / 1000 * BUGS_PER_THOUSAND_LINES:>9,.0f} hidden bugs")

# 20 loaded drivers, each with a 1% chance of crashing in a month
p_ok = 0.99 ** 20
print(f"\nmonolithic: {p_ok:.1%} chance of no kernel crash in a month")
print("microkernel: the driver crashes but restarts – the system keeps running")
```

(Linux is better than the raw number suggests: on a given machine only the few hundred modules needed for its hardware are loaded, not all 40 million lines.)

What makes **seL4** special is that the correctness of its roughly 10,000 lines has been **mathematically proven**: the code does exactly what the specification says, with no buffer overflows or null-pointer bugs. For 40 million lines this is unthinkable today. **MINIX 3** watches its drivers with a "reincarnation server", and restarts a crashed driver within a few milliseconds.

**Analogy:** a monolithic kernel is a big open-plan office: communication is fast (you just call over), but if someone starts a fire, the whole floor burns down. A microkernel is separate offices with fireproof walls: you have to send a message (slower), but a fire only affects one room.

## 4. Interrupts: top half and bottom half

When a device requests an interrupt, the kernel immediately suspends what it was doing. While the interrupt handler runs, **other interrupts are often disabled** – so it must be very short. The kernel therefore splits the work in two:

| Part                          | When does it run?                    | What does it do?                                                       |
| ----------------------------- | ------------------------------------ | ---------------------------------------------------------------------- |
| **top half**                  | immediately, at the interrupt        | acknowledges the device, saves the data, schedules the rest – µs       |
| **bottom half**               | a little later, in interruptible mode | the actual processing (e.g. the network packet through the TCP/IP stack) |

On Linux the bottom half is called a **softirq**, **tasklet** or **workqueue**; on Windows a **DPC** (_Deferred Procedure Call_).

**Analogy:** the receptionist (top half) picks up the phone, notes who called and why, then hangs up – they don't sort the matter out on the spot, because meanwhile other calls are waiting. The matter is handled (bottom half) later in the background.

```bash
cat /proc/interrupts | head -15   # number of interrupts per core and per device
cat /proc/softirqs                # the bottom halves: NET_RX, TIMER, BLOCK …
watch -n1 'grep -E "NET_RX|TIMER" /proc/softirqs'   # live (quit: Ctrl+C)
```

## 5. Why couldn't a network card cope with one interrupt per packet?

A **10 Gbit/s** network card at full load receives hundreds of thousands of packets per second. If every packet raised a separate interrupt:

```python run
# One interrupt per packet on a 10 Gbit/s card
BANDWIDTH = 10e9               # bit/s
FRAME = 1538                   # bytes on the wire (1500 MTU + headers + gap)
INTERRUPT_US = 2.0             # cost of handling one interrupt (µs)

packets_per_s = BANDWIDTH / 8 / FRAME
print(f"packets per second: {packets_per_s:,.0f}")
print(f"with one interrupt per packet: {packets_per_s * INTERRUPT_US / 1e6:.2f} s of CPU time "
      f"needed EVERY SECOND → impossible")

for coalesce in [16, 64, 256]:
    irqs = packets_per_s / coalesce
    cpu = irqs * INTERRUPT_US / 1e6
    print(f"{coalesce:>4} packets / interrupt: {irqs:>9,.0f} interrupts/s – {cpu:.1%} CPU")
```

With one interrupt per packet, **1.6 seconds** of CPU time would be needed every second – the machine would drown in handling interrupts (_interrupt storm_, "livelock"). The solutions:

- **interrupt coalescing**: the card signals only after every N packets or after a short time;
- **NAPI** (Linux): under heavy traffic the kernel switches off interrupts and pulls in packets by **polling**; when traffic drops, it switches them back on;
- **multiple receive queues** (RSS): the card distributes packets among the cores.

This is a nice example that the **interrupt versus polling** decision from the I/O topic isn't black and white: under light load interrupts are more efficient, under heavy load polling is.

## Summary

- Because of the **mode bit** and **privileged instructions**, a user program can't disable interrupts or reset the timer – if it tries, the CPU raises an exception.
- In a microkernel a request takes several **messages** (and mode and context switches), so it **can be slower**, but a driver bug doesn't bring down the system.
- The smaller the **trusted computing base**, the fewer hidden bugs it contains; seL4's 10,000 lines are mathematically proven.
- The **top half** of interrupt handling is quick and short; processing happens in the **bottom half** (softirq, DPC).
- Under heavy traffic one interrupt per packet would choke the CPU: **coalescing**, **NAPI** (polling) and multiple queues help.

## Lesson exercise

```quiz required
? A system call involves 2 mode switches. How many mode switches are needed in a microkernel if a request consists of 4 messages and each message needs 2 mode switches?
= 8
! 4 · 2 = 8 – four times the monolithic kernel's 2.

? What happens if a program running in user mode tries to execute the privileged instruction that disables interrupts?
- the CPU executes it, but only for that program
+ the CPU raises an exception, control passes to the kernel, which usually terminates the program
- the CPU ignores it, and the program keeps running
! That's why a program can't "steal" the CPU.

? 20 drivers run in kernel mode, each independently with a 1% chance of crashing in a month. What is the percentage chance that there is not a single driver crash in a month? (rounded to a whole number)
= 82
= 82%
! 0.99²⁰ ≈ 0.818.

? What is the job of the top half of an interrupt handler?
+ to quickly acknowledge the device, save the data, and schedule further processing
- to do the whole processing, however long it takes
- to schedule user programs
! Processing happens in the bottom half (softirq, DPC).

? Why does Linux use polling (NAPI) instead of interrupts under heavy network traffic?
- because polling uses less power under light traffic
+ because with one interrupt per packet the CPU would drown in handling interrupts
- because network cards can't request interrupts
! At 10 Gbit/s, ~800,000 packets/s.

? Which kernel's correctness has been mathematically proven?
- Linux
- Windows NT
+ seL4
- XNU
! About 10,000 lines – formal verification.
```
