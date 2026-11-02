---
title: Debugging and Measurement
summary: The steps of systematic debugging, typical faults; logic probe and pulser, logic analyser (triggering, protocol decoding), oscilloscope; bit rate, signal frequency, sample rate, memory depth, bit depth and the eye diagram.
minutes: 40
---

## What you will learn

- how to debug a digital circuit **systematically**,
- what the **typical faults** are,
- what the **logic probe**, the **pulser**, the **logic analyser** and the **oscilloscope** are for,
- how **bit rate**, **signal frequency**, **sample rate** and **memory depth** are related,
- what the **eye diagram** shows.

## Systematic debugging

If a design that works in simulation does not work in reality, do not guess – go step by step:

1. **Power:** is the supply voltage present on every IC (with a multimeter), is the ground good?
2. **Clock:** is it running, are its frequency and signal level correct?
3. **Reset:** is it released, is it at the right level?
4. **Inputs:** do the signals you expect arrive? (Floating input? Wrong pin assignment?)
5. **Halving:** moving along the signal path, always measuring in the middle of the faulty section, you quickly locate the faulty stage.

**Typical faults:**

- **stuck-at signal:** a wire is always 0 or always 1 (short to ground/supply, faulty output);
- **open circuit** or bad solder joint, missing wire;
- **floating input:** an unconnected CMOS input that toggles randomly (a pull-up/pull-down resistor is needed);
- **bus contention:** two outputs drive one wire at once (a three-state control error);
- **level mismatch:** a 5 V signal on a 3.3 V input, wrong logic levels;
- **timing fault:** setup/hold violation, bouncing button, unsynchronised signal, hazard.

## Logic probe and pulser

The **logic probe** is a pen-shaped hand-held instrument: touched to a point, it shows with **LEDs** whether there is a logic **high**, **low**, **intermediate** (invalid, e.g. floating) or **changing** (pulsing) level. Fast and cheap, but it sees only one point at a time and records nothing.

The **logic pulser** is its pair: it injects short pulses into a node (even in-circuit, briefly overriding the driving output), so you can check with the probe whether the pulse travels along the chain. (E.g. the GPG-2A pulser for TTL and CMOS circuits, powered from 5–15 V.)

## Logic analyser

The **logic analyser** watches **many digital lines** at once (8, 16, 32 or more), **records** the changes and shows them on a **timing diagram**.

- **Triggering:** you can specify a pattern or event that starts the recording, e.g. “when the D0–D3 lines are 1010”. This lets you catch the moment of a rare fault.
- **Timing faults:** race conditions, setup/hold violations and bad clocking become visible.
- **Protocol decoding:** the software turns the recorded bits into **I²C**, **SPI**, **UART**, **CAN** or (at a simpler level) **USB** messages – e.g. it shows which byte went to which address.
- Types: stand-alone hardware (e.g. Tektronix), **USB** (connects to a PC, e.g. Saleae Logic), or **built into an oscilloscope** (MSO – mixed-signal oscilloscope).

| feature           | logic probe | logic analyser           |
| ----------------- | ----------- | ------------------------ |
| number of inputs  | 1           | many (8–100+)            |
| display           | LED (H/L)   | timing diagram, decoding |
| recording         | no          | yes                      |
| protocol decoding | no          | yes (with software)      |

**Inside an FPGA** you can also use a built-in logic analyser (Vivado ILA, Quartus SignalTap): it records internal signals into the FPGA's own memory and displays them on the PC via JTAG – so they need not be routed out to pins.

The **oscilloscope**, by contrast, shows the **real voltage waveform** on a few channels: signal levels, rise time, overshoot, noise, interference – so it is needed for analogue-like problems (levels, signal integrity).

## Bit rate, signal frequency, sampling

When measuring high-speed signals, these quantities are closely related:

**Bit rate and bit time:** the bit time is the reciprocal of the bit rate.

- 500 Mb/s → 1 bit = **2 ns**; 1 Gb/s → 1 bit = **1 ns**; 9600 bit/s (UART) → 1 bit ≈ **104 μs**.

**Signal frequency:** a 1 Gb/s digital signal is not a 1 GHz sine wave. The fastest change is the 1010… pattern, one period of which is two bits, so the dominant frequency is about **half the bit rate**: 1 Gb/s → ≈ 500 MHz, 500 Mb/s → ≈ 250 MHz. (Sharp edges also contain much higher harmonics.)

**Sample rate** (Sa/s – samples per second): in theory at least **twice** the highest frequency (sampling theorem, topic 8), in practice **4–10 times**, so that the edges and the waveform are clearly visible. For a logic analyser the rule is: at least 4 samples per bit.

**Memory depth** (record length): the number of samples the instrument's memory can hold. The time that can be recorded:

**record time = memory depth / sample rate**

E.g. 10 MSa of memory and 1 GSa/s sampling → **10 μs**. If you want to see a longer time, or use more channels, you need more memory (or a lower sample rate).

**Bit depth:** for a logic analyser one sample has as many bits as there are channels (8 channels = 8 bits/sample); for an oscilloscope it is the ADC resolution (e.g. 8, 12 bits; 12 bits = 4096 levels).

**Two examples:**

- **UART, 9600 bit/s**, 10 MSa/s sampling: ≈ 1040 samples per bit – more than enough; with 10 M samples of memory **1 s** can be recorded, which means many bytes.
- **100 Mb/s Ethernet**, 100 MSa/s sampling: bit time 10 ns, so **only 1 sample per bit** – the edges are not visible, the waveform cannot be interpreted. At least 400 MSa/s would be needed.

## The eye diagram

The real signal is always distorted. In an **eye diagram** many consecutive bits are drawn **on top of each other**, one bit time wide; the opening of the resulting “eye” shows how stable the signal is:

- **eye height** (vertical opening): the difference between the logic 1 and 0 levels – a smaller eye indicates noise or interference;
- **eye width** (horizontal opening): how long the bit is valid – a wider eye means more timing margin;
- **jitter:** the horizontal spread of the transitions; with too much jitter, 0 and 1 blur together;
- **noise margin:** how much noise the signal can still tolerate without error;
- **rise and fall time:** the steepness of the transitions – faster edges give a cleaner eye.

A good eye diagram needs fast sampling, enough analogue bandwidth and plenty of memory (so that rare faults also show up).

```python run
# Basic measurement calculations: bit time, signal frequency, samples/bit, record time
def measure(bit_rate, sample_rate, memory):
    bit_time = 1 / bit_rate
    return {
        "bit time (ns)": round(bit_time * 1e9, 1),
        "signal frequency (MHz)": bit_rate / 2 / 1e6,
        "samples/bit": round(sample_rate * bit_time, 1),
        "record time (s)": memory / sample_rate,
    }

print("UART 9600 bit/s, 10 MSa/s, 10 MSa:", measure(9600, 10e6, 10e6))
print("Ethernet 100 Mb/s, 100 MSa/s:     ", measure(100e6, 100e6, 10e6))
print("1 Gb/s, 1 GSa/s, 10 MSa:          ", measure(1e9, 1e9, 10e6))
```

## Summary

- Debugging order: power → clock → reset → inputs → halving; typical faults: stuck-at signal, open circuit, floating input, bus contention, level and timing faults.
- Logic probe: one point, LEDs; pulser: injects pulses; logic analyser: many channels, recording, trigger, protocol decoding; oscilloscope: real voltage waveform.
- Bit time = 1/bit rate; signal frequency ≈ bit rate/2; sampling 4–10× in practice; record time = memory depth / sample rate.
- Eye diagram: eye height, eye width, jitter, noise margin, edge steepness.

## Lesson exercise

```quiz required
? What is the bit time in ns for a 500 Mb/s signal?
= 2

? Approximately what is the dominant signal frequency of a 1 Gb/s digital signal in MHz?
= 500
! In the fastest 1010… pattern one period is two bits.

? A logic analyser has 10 MSa of memory and a sample rate of 1 GSa/s. How many μs can it record?
= 10
! 10,000,000 samples / 1,000,000,000 samples/s.

? A 100 Mb/s signal is sampled at 100 MSa/s. How many samples fall on one bit?
= 1
! That is too few: the edges are not visible, at least 4 samples/bit would be needed.

? A sensor on an I²C bus does not respond. With which instrument can you most easily see which address the microcontroller sends?
- logic probe
+ logic analyser with protocol decoding
- multimeter
- logic pulser

? What does a small eye height in the eye diagram indicate?
- That the signal is very clean.
+ That the difference between the logic 1 and 0 levels is small; the signal is affected by noise or interference.
- That the sample rate is too high.
- That the bit rate is too low.

? An unconnected input of a CMOS gate toggles randomly. What is this fault, and what is the solution?
- Bus contention – a three-state driver is needed.
+ Floating input – its level must be fixed with a pull-up or pull-down resistor.
- Metastability – a higher clock is needed.
- Open circuit – the gate must be replaced.
```
