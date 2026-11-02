---
title: The Real Pulse and the Clock
summary: Rise and fall time, period, frequency, duty cycle and propagation delay – with calculations.
minutes: 20
---

## What you will learn

- why a real digital signal is **not a perfect square wave**,
- the meaning of **rise time**, **fall time**, **period**, **frequency** and **duty cycle**,
- what **propagation delay** is and how delays add up,
- what the **clock** is for.

## Ideal and real square waves

We often draw a digital signal as a perfect square wave that jumps from 0 to 1 **instantly**. In reality every circuit has **stray capacitance and inductance**, and charge carriers need time to move, so transitions take a **finite time**.

```text
 ideal:       ┌─────┐     ┌─────
              │     │     │
         ─────┘     └─────┘

 real:          ╱‾‾‾‾╲      ╱‾‾‾
               ╱      ╲    ╱
         ─────╱        ╲──╱
             tr        tf
```

## Pulse parameters

| Parameter   | Symbol        | Meaning                                           |
| ----------- | ------------- | ------------------------------------------------- |
| rise time   | t<sub>r</sub> | time to rise from **10% to 90%** of the amplitude |
| fall time   | t<sub>f</sub> | time to fall from **90% to 10%**                  |
| pulse width | t<sub>H</sub> | time spent high (measured between the 50% points) |
| period      | T             | duration of one full cycle (low–high–low)         |
| frequency   | f             | repetitions per second: **f = 1 / T**             |
| duty cycle  | D             | **D = t<sub>H</sub> / T**, as a percentage        |

### Units at a glance

| prefix | factor          | time example | frequency example         |
| ------ | --------------- | ------------ | ------------------------- |
| milli  | 10<sup>−3</sup> | 1 ms         | 1 kHz = 10<sup>3</sup> Hz |
| micro  | 10<sup>−6</sup> | 1 µs         | 1 MHz = 10<sup>6</sup> Hz |
| nano   | 10<sup>−9</sup> | 1 ns         | 1 GHz = 10<sup>9</sup> Hz |

**Worked examples**

1. T = 20 ns → f = 1 / (20 · 10<sup>−9</sup> s) = 50 · 10<sup>6</sup> Hz = **50 MHz**.
2. f = 100 MHz → T = 1 / 10<sup>8</sup> s = **10 ns**.
3. t<sub>H</sub> = 3 µs, T = 12 µs → D = 3 / 12 = **25%**.

You can compute the same in Python:

```python run
# Period, frequency and duty cycle
T = 20e-9          # period: 20 ns
f = 1 / T          # frequency in Hz
print(f"f = {f / 1e6:.0f} MHz")

t_high = 3e-6      # time spent high: 3 µs
T2 = 12e-6         # period: 12 µs
print(f"duty cycle = {t_high / T2 * 100:.0f} %")
```

## Propagation delay

Every gate has a **propagation delay** (t<sub>pd</sub>): after an input changes, the output follows only after this time. There are two values: t<sub>PLH</sub> (output 0→1) and t<sub>PHL</sub> (output 1→0); t<sub>pd</sub> is their average.

For gates connected in series the delays **add up**: if a signal passes through 4 gates of 8 ns each, the total delay is **32 ns**. The longest path is the **critical path**: it limits how fast the circuit can run. Paths of different lengths also cause **hazards** (topic 4).

## The clock

The **clock** (CLK) is a regular square wave, usually with 50% duty cycle, that sets the pace of **synchronous** circuits: storage elements take a new value only at a specific moment of the clock (usually its **rising edge**). The clock period of a 3 GHz processor is about **0.33 ns** – in that time even light travels only ~10 cm!

The clock period cannot be shorter than the delay of the critical path, otherwise the storage elements would capture an old, "half-finished" value.

## Summary

- Real transitions take finite time: t<sub>r</sub> (10%→90%), t<sub>f</sub> (90%→10%).
- f = 1 / T, D = t<sub>H</sub> / T.
- Delays of gates in series add up; the longest path is the critical path.
- The clock sets the pace of synchronous circuits.

## Lesson exercise

```quiz required
? A clock has a period of 40 ns. What is its frequency in MHz?
= 25
= 25 MHz
! f = 1 / T = 1 / (40 · 10<sup>−9</sup> s).

? A signal is high for 5 µs and its period is 20 µs. What is the duty cycle in percent?
= 25
= 25%
= 25 %
! D = t<sub>H</sub> / T · 100%.

? A signal passes through 3 gates in series, each with 12 ns delay. What is the total delay in ns?
= 36
= 36 ns
! Delays of gates in series add up.

? How is rise time usually defined?
- the time between the 0% and 100% levels
+ the time between the 10% and 90% levels
- the time between the 50% points
- the time spent high
! The outer 10% are excluded because of noise and rounding of the edges.

? What is the period of a 200 MHz clock in ns?
= 5
= 5 ns
! T = 1 / f.
```
