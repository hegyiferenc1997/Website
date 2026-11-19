---
title: Deeper – The Dialogue Between Hardware and the OS
summary: The three roles of the OS (resource manager, "extended machine", referee), the memory hierarchy on a human scale, polling versus interrupts with numbers, DMA, and investigating a boot on the virtual machine.
minutes: 40
---

## What you will learn in this lesson

- the **three roles** of the operating system, each with an everyday analogy,
- why it matters so much **which storage level** the data is on – converted to a human time scale,
- when **polling** and when **interrupt-driven** device handling is better – with numbers,
- what **DMA** is for,
- how to **trace** the steps of a boot and the interrupts of a device on the lab machine.

## 1. The three roles of the OS

The same program can be looked at in three ways:

| Role                      | What does it do?                                                     | Analogy                                              |
| ------------------------- | -------------------------------------------------------------------- | ---------------------------------------------------- |
| **resource manager**      | shares processor time, memory and disk between programs             | a restaurant's head waiter: who gets which table, when |
| **extended machine** (abstraction) | turns complex hardware into simple concepts: file, process, socket | a car's steering wheel and pedals: you needn't know how fuel injection works |
| **referee** (protection)  | enforces the rules: one program mustn't write into another's memory | a football referee: whoever breaks the rules is sent off |

Let's look at abstraction with an example. When a program writes:

```python
open("notes.txt", "w").write("Hello")
```

behind the scenes the OS: finds the directory in the file system, allocates a free block, decides which **disk sector** the data goes to, instructs the disk controller, waits for the interrupt, updates the metadata (size, modification time), and checks whether the program has the right to write there at all. The program sees **none of this** – just a file.

## 2. The memory hierarchy on a human scale

In the previous lesson you saw the table: register < 1 ns, RAM ~100 ns, SSD ~0.1 ms, HDD ~10 ms. But a nanosecond is unimaginably short, so let's convert: **what if 1 ns lasted 1 second?**

```python run
# Access times of the storage levels, converted: 1 ns → 1 second.
levels = [
    ("L1 cache", 1),
    ("L3 cache", 10),
    ("RAM", 100),
    ("SSD read", 100_000),
    ("HDD read", 10_000_000),
    ("network Budapest–New York (round trip)", 100_000_000),
]

def human(sec):
    """Seconds in a readable form."""
    for unit, length in [("years", 365 * 86400), ("days", 86400), ("hours", 3600), ("minutes", 60)]:
        if sec >= length:
            return f"{sec / length:.1f} {unit}"
    return f"{sec:.0f} seconds"

for name, ns in levels:
    print(f"{name:42} {ns:>12,} ns  →  {human(ns)}")
```

If the processor felt an L1 access as one second, it would "wait" **almost two minutes** for RAM, **more than a day** for an SSD read, and **almost four months** for a hard disk. That's why the OS (and the processor) works so hard to have the needed data on the faster level **in advance**: caches, the page cache, read-ahead.

## 3. Polling or interrupts? – let's calculate!

How does the OS find out that a device (keyboard, network card) has something to say? There are two methods:

- **Polling**: the processor regularly asks the device: "anything new?" Analogy: going out to the letterbox every 5 minutes to check for post.
- **Interrupt**: the device speaks up when there's something. Analogy: the postman rings the bell.

At first sight interrupts are always better – but no! Every interrupt has a **cost**: the processor has to save its state, run the handler, then restore it (a few microseconds). Let's compute what percentage of the processor the two methods take at different event rates!

```python run
# Polling versus interrupts: what percentage of processor time goes on device handling?
poll_cost_us = 1                  # time of one "anything new?" check (µs)
poll_period_us = 100              # how often we check (µs)
interrupt_cost_us = 5             # time to handle one interrupt (µs)

# The cost of polling doesn't depend on how many events come: we keep asking.
polling_cpu = 100 * poll_cost_us / poll_period_us

for name, events_per_s in [("keyboard", 10), ("mouse", 200), ("slow network", 10_000),
                           ("10 Gbit/s network", 800_000)]:
    interrupt_cpu = 100 * events_per_s * interrupt_cost_us / 1_000_000
    better = "interrupt" if interrupt_cpu < polling_cpu else "polling"
    print(f"{name:18} {events_per_s:>8} events/s | interrupt: {interrupt_cpu:7.3f}% | "
          f"polling: {polling_cpu:.1f}% | better: {better}")
```

The lesson:

- **Rare events** (keyboard, mouse): interrupts are a negligible load, while polling wastes time continuously.
- **Very frequent events** (fast network): 800,000 interrupts per second would take **400%** of the processor – meaning the machine would only handle interrupts and have no time for real work. This is called **interrupt livelock**.

That's why Linux's network subsystem (**NAPI**) uses a **mixed** method: at low traffic it works with interrupts, but at high traffic it switches off the card's interrupts and processes many packets at once by **polling**. A good engineering solution is often not "either-or" but adapts to the situation.

## 4. DMA – so the processor doesn't have to carry things

If a 1 GB file has to be read from disk into memory, the processor could copy it byte by byte – but then it would have no time for anything else. Instead, the **DMA controller** (_Direct Memory Access_) does the copying:

1. The processor sets it up: "from here, this much, to there" – and returns to its work.
2. The DMA controller copies the data over the bus directly into memory.
3. At the end it signals with **a single interrupt**: done.

**Analogy:** the boss (processor) doesn't carry the boxes up from the warehouse personally, but hires a porter (DMA) and only looks over when the porter says they've finished.

## 5. Investigating on the lab machine

### Traces of a boot

Start the Ubuntu virtual machine and look at what happened during boot:

```bash
systemd-analyze critical-chain     # which services were on the "critical path" (waited for each other)
cat /proc/cmdline                  # with what parameters the boot loader started the kernel
ls /boot                           # the kernel (vmlinuz-…) and initrd files
journalctl -b -p warning           # warnings and errors of the current boot
sudo dmesg | head -30              # the kernel's first messages: detected hardware
lsblk                              # disks and partitions (including the EFI system partition)
```

On Windows 11: **Win + R → `msinfo32`**: here you see the *BIOS Mode: UEFI* and *Secure Boot State: On* lines. And on Task Manager's **Startup apps** page (top right corner) there's *Last BIOS time*, i.e. how long the firmware phase took.

### Interrupts live

Linux counts how many interrupts each device has raised. Run:

```bash
watch -n 1 "grep -E 'i8042|timer|eth|enp' /proc/interrupts"
```

Meanwhile move the mouse and type in the VM window: the numbers in the `i8042` (keyboard and mouse controller) line will grow. If you download a big file meanwhile (`wget`), the network card's line jumps. Exit: **Ctrl + C**.

## Summary

- The OS is at the same time a **resource manager**, an **abstraction-providing "extended machine"** and a **rule-enforcing referee**.
- If 1 ns were 1 second, RAM would be ~2 minutes, an SSD ~1 day, an HDD ~4 months – that's why frequently used data must be kept on the fast levels.
- **Interrupts** are better for rare events, **polling** for very frequent events; Linux NAPI combines the two.
- **DMA** copies data instead of the processor, signalling with one interrupt at the end.
- `systemd-analyze`, `journalctl -b`, `dmesg` and `/proc/interrupts` show what happens inside the machine.

## Exercise

```quiz required
? In which of its roles does the OS "send off" a program that tries to write into another program's memory?
- resource manager
- extended machine
+ referee (protection)
! Protection enforces the rules between programs.

? If 1 ns corresponded to 1 second, how many seconds would a 100 ns RAM access take?
= 100
! 100 ns → 100 s, a little more than a minute and a half.

? A device is polled every 10 µs, and one poll takes 1 µs. What percentage of processor time goes on this?
= 10
! 1 / 10 = 0.1 → 10%.

? Handling an interrupt takes 5 µs, and 1000 interrupts arrive per second. What percentage of processor time does it take?
= 0.5
= 0,5
! 1000 × 5 µs = 5 ms per second = 0.5%.

? What does Linux's network subsystem (NAPI) do at very high traffic?
- asks for even more interrupts
+ switches off the card's interrupts and processes the packets by polling
- drops all packets
! This way it avoids interrupt livelock.

? Which file on Linux shows how many interrupts each device has raised?
= /proc/interrupts
! You can also watch it refreshed every second with the watch command.
```
