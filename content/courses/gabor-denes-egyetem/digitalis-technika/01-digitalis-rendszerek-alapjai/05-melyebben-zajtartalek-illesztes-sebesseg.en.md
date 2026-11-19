---
title: Deeper – Noise Margin, Interfacing and the Limits of Speed in Numbers
summary: Copying an analogue and a digital signal over a noisy channel (simulator), noise margin and compatibility between logic families (when doesn't a 74HC understand a 3.3 V signal?), the maximum clock from the critical path, the link between rise time and bandwidth, and an "analogue" voltage from a digital signal with PWM.
minutes: 40
---

## What you will learn in this lesson

- to see with a **simulator** why an analogue signal degrades with every copy, and a digital one doesn't,
- to **calculate** whether two logic families can be connected directly,
- to estimate a circuit's **maximum clock frequency** from the delays,
- to understand what the **rise time** reveals about a signal's frequency content,
- how a microcontroller produces an **"analogue" voltage** from nothing but 0s and 1s (PWM).

## 1. Copying over a noisy channel – analogue versus digital

In the base lesson you saw that a digital signal is **noise-tolerant**, because the receiver only decides whether the voltage is above or below the threshold. Let's see this in numbers! We pass a signal on 10 times in a row (like a long chain where everyone passes on what they received), and ±0.15 V of noise is added at every step.

```python run
# Passing an analogue and a digital signal through 10 noisy steps
import random

r = random.Random(7)               # fixed randomness, so you always get the same
analogue = 1.0                     # the analogue value: we want to transmit exactly 1.0 V
digital = 1                        # the digital value: logic 1 (represented by 1.0 V)

for step in range(1, 11):
    noise_a = r.uniform(-0.15, 0.15)
    noise_d = r.uniform(-0.15, 0.15)
    analogue += noise_a                        # the analogue signal passes the noise on too
    voltage = digital * 1.0 + noise_d          # the digital signal is noisy on the wire too…
    digital = 1 if voltage > 0.5 else 0        # …but the receiver decides again: 0 or 1
    print(f"step {step:>2}: analogue {analogue:.3f} V | digital on the wire "
          f"{voltage:.3f} V → restored: {digital}")
```

The analogue value **wanders**: the noise adds up, and after 10 steps it's only about 0.5 V – near the threshold! Nothing corrects the error. The digital signal is just as noisy on the wire, but every receiver **restores** (regenerates) a clean 0 or 1, so the noise doesn't accumulate. That's why a digital file can be copied a thousand times without loss, and a cassette tape can't.

**Analogy:** in the game of "telephone" (analogue) the message gets distorted at every person. But if everyone only passes on a card saying "YES" or "NO" (digital), everyone reads even a slightly crumpled card correctly.

## 2. Can two logic families be connected?

The output of family A can drive the input of family B **directly** if both levels are reliably understood:

- the high output is high enough: **V<sub>OH</sub>(A) ≥ V<sub>IH</sub>(B)**,
- the low output is low enough: **V<sub>OL</sub>(A) ≤ V<sub>IL</sub>(B)**.

The differences are exactly the **noise margins**. If either is negative, the connection is **unreliable** – sometimes it works, sometimes it doesn't, the worst kind of fault.

```python run
# Compatibility between logic families: NMH = VOH(driver) − VIH(receiver), NML = VIL(receiver) − VOL(driver)
families = {
    #               VIL   VIH   VOL   VOH
    "TTL (74LS)":  (0.8,  2.0,  0.4,  2.4),
    "74HC (5 V)":  (1.5,  3.5,  0.1,  4.4),
    "74HCT (5 V)": (0.8,  2.0,  0.1,  4.4),
    "LVCMOS 3.3":  (0.8,  2.0,  0.4,  2.4),
}

print(f"{'driver → receiver':<28} {'NMH':>6} {'NML':>6}  result")
for drv, (_, _, vol, voh) in families.items():
    for rcv, (vil, vih, _, _) in families.items():
        if drv == rcv:
            continue
        nmh, nml = voh - vih, vil - vol
        ok = "fine" if nmh >= 0 and nml >= 0 else "NOT RELIABLE"
        print(f"{drv + ' → ' + rcv:<28} {nmh:>5.1f}V {nml:>5.1f}V  {ok}")
```

The most important lessons:

- **TTL or 3.3 V output → 74HC input: not reliable!** The 2.4 V "1" still falls into the forbidden band for the 74HC (V<sub>IH</sub> = 3.5 V).
- That's what the **74HCT** family was invented for: CMOS technology, but with TTL-compatible input thresholds (V<sub>IH</sub> = 2.0 V).
- The other way round (5 V output → 3.3 V input) the levels are understood, but 4.4 V may be **too high** for the 3.3 V input and can damage it – a **level shifter** (voltage divider or interface IC) is needed there. The table doesn't show this, because the absolute maximum voltage is a separate datasheet value.

This is a very practical question: exactly this has to be thought through when connecting a 3.3 V Raspberry Pi or ESP32 to a 5 V Arduino module.

## 3. How fast can the circuit be? – the critical path

In a synchronous circuit there's combinational logic between two storage elements (flip-flops). Three things must happen within one clock period:

1. the first flip-flop's output changes after the clock edge: **t<sub>CQ</sub>** (_clock-to-Q_),
2. the signal runs through the longest combinational path: **t<sub>logic</sub>**,
3. the new value must be stable at the second flip-flop's input for **t<sub>setup</sub>** before the next edge.

**T<sub>min</sub> = t<sub>CQ</sub> + t<sub>logic</sub> + t<sub>setup</sub>**, and **f<sub>max</sub> = 1 / T<sub>min</sub>**.

```python run
# The maximum clock frequency from the critical path
def f_max_mhz(t_cq, gates, t_gate, t_setup):
    t_logic = gates * t_gate                       # delays of gates in series add up
    T_min = t_cq + t_logic + t_setup               # ns
    return T_min, 1000 / T_min                     # 1 / ns = GHz → ×1000 = MHz

for name, t_cq, gates, t_gate, t_setup in [
    ("74HC gates, 5 levels",   15, 5, 8.0, 5),
    ("74HC gates, 2 levels",   15, 2, 8.0, 5),
    ("FPGA, 4 LUT levels",    0.5, 4, 0.6, 0.1),
    ("modern CPU, 1 stage",   0.03, 12, 0.02, 0.02),
]:
    T, f = f_max_mhz(t_cq, gates, t_gate, t_setup)
    print(f"{name:<24} T_min = {T:6.2f} ns → f_max ≈ {f:8.1f} MHz")
```

The same function with 2 gate levels instead of 5 allows a clock about **1.7 times faster** – that's why we simplify (topics 3 and 4), and why processors split the work into many short **pipeline stages** (topic 7): a shorter path per stage → a higher clock.

## 4. Rise time and bandwidth

A "nice" square wave is really a sum of many sine waves: the **steeper** its edge, the more high-frequency components it contains. A useful rule of thumb:

**bandwidth ≈ 0.35 / t<sub>r</sub>**

So a signal with a 1 ns rise time contains components of about **350 MHz** – even if the clock is only 10 MHz! That's why the traces of a printed circuit board need attention with fast signals: the signal travels at about **15 cm/ns** on the board, and if a trace is longer than about a sixth of the rising edge's "length", the trace already behaves as a **transmission line** (reflections, ringing edges).

```python run
# Rise time → bandwidth and the "critical" trace length on the board
SPEED_CM_NS = 15                        # signal propagation on a printed circuit board (cm/ns)

for t_r_ns in [10, 3, 1, 0.3]:
    bandwidth_mhz = 0.35 / t_r_ns * 1000
    edge_length_cm = t_r_ns * SPEED_CM_NS           # how long a stretch the edge "spreads over"
    critical_cm = edge_length_cm / 6
    print(f"t_r = {t_r_ns:>4} ns → bandwidth ≈ {bandwidth_mhz:6.0f} MHz, "
          f"traces over {critical_cm:5.1f} cm are already transmission lines")
```

A surprising consequence: a **slower** (older) logic family is sometimes the **better** choice if the speed isn't needed – it causes less interference and is less sensitive to wiring.

## 5. An "analogue" voltage from nothing but 0s and 1s: PWM

A microcontroller pin can only output 0 V or 3.3 V (5 V). Yet we can dim an LED or slow a motor with it: we switch it rapidly, and control the **average** voltage with the **duty cycle** (D):

**U<sub>avg</sub> = D · U<sub>supply</sub>**

```python run
# PWM: the average voltage as a function of the duty cycle
U_SUPPLY = 5.0                   # V
f_pwm = 1000                     # Hz → T = 1 ms
T_us = 1e6 / f_pwm

for D in [0.0, 0.1, 0.25, 0.5, 0.75, 1.0]:
    t_high = D * T_us
    bar = "█" * int(D * 20) + "·" * (20 - int(D * 20))       # a "drawing" of one period
    print(f"D = {D:>4.0%}: {bar}  high {t_high:6.1f} µs / {T_us:.0f} µs → "
          f"average {D * U_SUPPLY:.2f} V")
```

The LED and the motor (and our eyes) **average**: if the switching is fast enough (e.g. 1 kHz), we see no flicker, just dimmer light. This is the simplest form of digital → analogue conversion; we'll come back to it in topic 8 (AD and DA converters).

## Summary

- With an analogue signal noise **accumulates**, with a digital one every receiver **regenerates** the signal – that's why digital data can be copied without loss.
- Two families can be connected directly if V<sub>OH</sub>(driver) ≥ V<sub>IH</sub>(receiver) and V<sub>OL</sub>(driver) ≤ V<sub>IL</sub>(receiver). TTL/3.3 V → 74HC isn't reliable; that's what **74HCT** is for.
- **f<sub>max</sub> = 1 / (t<sub>CQ</sub> + t<sub>logic</sub> + t<sub>setup</sub>)** – fewer gate levels, a higher clock.
- **Bandwidth ≈ 0.35 / t<sub>r</sub>**: a steep edge contains high frequencies, even if the clock is slow.
- **PWM**: U<sub>avg</sub> = D · U<sub>supply</sub> – an "analogue" value from a digital pin.

## Lesson exercise

```quiz required
? What is the high-level noise margin (NMH) between two 74HC gates if VOH = 4.4 V and VIH = 3.5 V? (in V)
= 0.9
= 0,9
! NMH = VOH − VIH.

? A 3.3 V device's output (VOH = 2.4 V) drives a 5 V 74HC input (VIH = 3.5 V). Is the connection reliable?
- yes, because 2.4 V is more than half the supply voltage
+ no, because the 2.4 V "1" falls into the forbidden band for the 74HC
- yes, because CMOS inputs accept any voltage
! The fix: a 74HCT input or a level shifter.

? In a synchronous circuit tCQ = 2 ns, the critical path is 10 ns, tsetup = 1 ns. What is the maximum clock in MHz? (one decimal)
= 76.9
= 76,9
! f = 1 / 13 ns ≈ 76.9 MHz.

? A signal's rise time is 1 ns. Roughly what frequency components does it contain (MHz)?
= 350
! Bandwidth ≈ 0.35 / tr.

? A 5 V PWM signal has a 25% duty cycle. What is the average voltage (V)?
= 1.25
= 1,25
! U = D · U_supply = 0.25 · 5 V.
```
