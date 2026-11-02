---
title: Logic Levels and Noise Margin
summary: How voltage becomes 0 and 1: input and output levels, the forbidden zone, noise margin, positive and negative logic.
minutes: 15
---

## What you will learn

- what logic **HIGH** and **LOW** mean,
- what the datasheet values **V<sub>IH</sub>, V<sub>IL</sub>, V<sub>OH</sub>, V<sub>OL</sub>** stand for,
- how to calculate the **noise margin**,
- what **positive** and **negative logic** are.

## Voltage ranges, not single values

In a real circuit "0" and "1" are not exact voltages but **ranges**. Between them lies a **forbidden (undefined) zone**: if an input falls there, we cannot tell what the gate "sees".

The **threshold voltage** (V<sub>T</sub>) is the level at which the gate's output switches from one state to the other. Its exact value differs by circuit and technology, so the **datasheet** is always the reference.

| Symbol           | Name                | Meaning                                                        |
| ---------------- | ------------------- | -------------------------------------------------------------- |
| V<sub>OH</sub>   | Output High Voltage | the output is **not lower** than this when driving 1 (guaranteed min.) |
| V<sub>OL</sub>   | Output Low Voltage  | the output is **not higher** than this when driving 0 (guaranteed max.) |
| V<sub>IH</sub>   | Input High Voltage  | an input at or **above** this is surely 1                        |
| V<sub>IL</sub>   | Input Low Voltage   | an input at or **below** this is surely 0                        |

## Typical values

| Family             | V<sub>CC</sub> | V<sub>IL</sub> (max) | V<sub>IH</sub> (min) | V<sub>OL</sub> (max) | V<sub>OH</sub> (min) |
| ------------------ | -------------- | -------------------- | -------------------- | -------------------- | -------------------- |
| TTL (74LS)         | 5 V            | 0.8 V                | 2.0 V                | 0.4 V                | 2.4 V                |
| CMOS (74HC, 5 V)   | 5 V            | 1.5 V                | 3.5 V                | 0.1 V                | 4.4 V                |
| LVCMOS (3.3 V)     | 3.3 V          | 0.8 V                | 2.0 V                | 0.4 V                | 2.4 V                |

## Noise margin

The noise margin tells **how much noise** can be added to the signal between two gates while the receiver still decides correctly.

- **high-level noise margin:** NM<sub>H</sub> = V<sub>OH</sub> − V<sub>IH</sub>
- **low-level noise margin:** NM<sub>L</sub> = V<sub>IL</sub> − V<sub>OL</sub>

**Example (TTL):** NM<sub>H</sub> = 2.4 V − 2.0 V = **0.4 V**, NM<sub>L</sub> = 0.8 V − 0.4 V = **0.4 V**.

```text
  output (driver)            input (receiver)
  5 V ┐                       5 V ┐
      │ surely 1                  │ surely 1
 2.4 V┤ VOH ──┐ NMH=0.4V    2.0 V ┤ VIH
      │       └────────────┘      │ forbidden zone
 0.4 V┤ VOL ──┐ NML=0.4V    0.8 V ┤ VIL
      │ surely 0└──────────┘      │ surely 0
  0 V ┘                       0 V ┘
```

The larger the noise margin, the more **robust** the connection. That is why different families (e.g. a 3.3 V and a 5 V device) should only be connected through **level shifting** – more on this in the TTL and CMOS lesson.

## Positive and negative logic

- **Positive logic:** the higher voltage means **1** (the usual convention).
- **Negative logic:** the lower voltage means 1.

The same circuit implements a **different function** under the two interpretations: a positive-logic AND gate behaves as an OR gate in negative logic (the physical counterpart of De Morgan's law, see topic 3). "Active-low" signals (e.g. RESET̅, CS̅) are marked with an overline or an `_n` / `#` suffix.

## Summary

- 0 and 1 are voltage ranges with a forbidden zone between them.
- V<sub>OH</sub>, V<sub>OL</sub> are the guaranteed output limits; V<sub>IH</sub>, V<sub>IL</sub> the input limits.
- Noise margin: NM<sub>H</sub> = V<sub>OH</sub> − V<sub>IH</sub>, NM<sub>L</sub> = V<sub>IL</sub> − V<sub>OL</sub>.
- In positive logic, HIGH is 1.

## Lesson exercise

```quiz required
? A family has V<sub>OH</sub> = 2.7 V and V<sub>IH</sub> = 2.0 V. What is the **high-level noise margin** (NM<sub>H</sub>) in volts?
= 0.7
= 0.7 V
= 0,7
! NM<sub>H</sub> = V<sub>OH</sub> − V<sub>IH</sub>.

? For the same family V<sub>IL</sub> = 0.8 V and V<sub>OL</sub> = 0.5 V. What is the **low-level noise margin** (NM<sub>L</sub>) in volts?
= 0.3
= 0.3 V
= 0,3
! NM<sub>L</sub> = V<sub>IL</sub> − V<sub>OL</sub>.

? A 74LS (TTL) gate input measures 1.4 V. What does the gate "see"?
- surely logic 0
- surely logic 1
+ undefined: it is in the forbidden zone
! For TTL, below 0.8 V is surely 0, above 2.0 V is surely 1.

? What does V<sub>IH</sub> mean?
- the highest low-level output voltage
+ the lowest input voltage the gate still surely reads as 1
- the supply voltage
- the exact threshold voltage
! I = input, H = high.
```
