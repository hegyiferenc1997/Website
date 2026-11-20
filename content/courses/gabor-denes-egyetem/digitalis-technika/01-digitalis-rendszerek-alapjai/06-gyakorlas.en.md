---
title: Practice – Digital Fundamentals
summary: Review questions and a summary worksheet for the first topic.
minutes: 45
kind: practice
---

## Review questions

Try to answer in your head first, and only then open the answer!

<details>
<summary>1. What is the difference between a discrete-time and a digital signal?</summary>

A discrete-time signal has a value only at certain instants, but the value can be anything (continuous amplitude). A digital signal is also discrete in amplitude: it can take only a finite number of levels.

</details>

<details>
<summary>2. Why can a digital signal be restored without error after noise?</summary>

Because the receiver only decides between two levels using a threshold. As long as the noise is smaller than the noise margin, the decision is correct and the signal can be regenerated cleanly.

</details>

<details>
<summary>3. What does a noise margin of 0.4 V mean for a logic family?</summary>

At most 0.4 V of interference may be added to the signal between two gates while the receiver still surely sees the correct logic value.

</details>

<details>
<summary>4. Why can't the clock frequency of a circuit be arbitrarily high?</summary>

Because between two clock edges the signal must travel through the longest (critical) path. The clock period cannot be shorter than the critical path delay (plus the storage elements' own timing).

</details>

<details>
<summary>5. What are the two main parts of a sequential circuit?</summary>

Combinational logic and memory (storage elements), connected by feedback.

</details>

## Summary worksheet

```quiz required
? For a 74HC (5 V CMOS) gate V<sub>OH</sub> = 4.4 V and V<sub>IH</sub> = 3.5 V. What is NM<sub>H</sub> in volts?
= 0.9
= 0.9 V
= 0,9
! NM<sub>H</sub> = V<sub>OH</sub> − V<sub>IH</sub>.

? For a 74HC gate V<sub>IL</sub> = 1.5 V and V<sub>OL</sub> = 0.1 V. What is NM<sub>L</sub> in volts?
= 1.4
= 1.4 V
= 1,4
! NM<sub>L</sub> = V<sub>IL</sub> − V<sub>OL</sub>.

? A processor runs at 2.5 GHz. What is its clock period in ns?
= 0.4
= 0.4 ns
= 0,4
! T = 1 / f = 1 / (2.5 · 10<sup>9</sup> Hz).

? A 1 kHz PWM signal has a 30% duty cycle. For how many µs is it high in one period?
= 300
= 300 µs
! T = 1 ms = 1000 µs; take 30% of it.

? The critical path goes through 5 gates of 4 ns each. What is the maximum clock frequency in MHz (ignoring storage element timing)?
= 50
= 50 MHz
! The period must be at least 5 · 4 ns = 20 ns; f = 1 / T.

? What characterises **negative logic**?
- the voltage is negative
+ the lower voltage level means logic 1
- gate outputs are always inverted
- it is used only in TTL circuits
! Active-low signals (e.g. RESET̅) follow this view.

? Which one is not sequential?
- counter
- shift register
+ full adder
- processor
! A full adder's output depends only on the present values of its three inputs.
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **Noise margin between two families.** Write the `noise_margin(voh, vol, vih, vil)` function, which returns the `(NMH, NML)` pair rounded to two decimals! (NMH = VOH − VIH, NML = VIL − VOL.)

```python starter
def noise_margin(voh, vol, vih, vil):
    return (0, 0)
```

<details>
<summary>Solution</summary>

If either value is negative, the connection is unreliable – the second case is exactly the problem of a 3.3 V output driving a 5 V 74HC input.

```python solution
def noise_margin(voh, vol, vih, vil):
    nmh = voh - vih              # this much noise fits at the high level
    nml = vil - vol              # and this much at the low level
    return (round(nmh, 2), round(nml, 2))
```

</details>

```python test
assert noise_margin(4.4, 0.1, 3.5, 1.5) == (0.9, 1.4)     # 74HC → 74HC
assert noise_margin(2.4, 0.4, 3.5, 1.5) == (-1.1, 1.1)    # 3.3 V → 74HC: negative!
assert noise_margin(4.4, 0.1, 2.0, 0.8) == (2.4, 0.7)     # 74HC → 74HCT
print("All checks passed!")
```

**2.** **Maximum clock.** Write the `f_max_mhz(t_cq, t_logic, t_setup)` function (all times in ns), which returns the highest clock frequency in MHz, rounded to one decimal!

```python starter
def f_max_mhz(t_cq, t_logic, t_setup):
    return 0
```

<details>
<summary>Solution</summary>

```python solution
def f_max_mhz(t_cq, t_logic, t_setup):
    t_min = t_cq + t_logic + t_setup      # ns
    return round(1000 / t_min, 1)          # 1 / ns = GHz → ×1000 = MHz
```

</details>

```python test
assert f_max_mhz(2, 10, 1) == 76.9
assert f_max_mhz(1, 8, 1) == 100.0
assert f_max_mhz(0.5, 2.4, 0.1) == 333.3
print("All checks passed!")
```

**3.** **PWM duty cycle.** A microcontroller pin outputs either 0 V or `u_supply` volts. Write the `duty(u_target, u_supply)` function, which returns the duty cycle (0…1) needed for the desired average voltage! Clip requests outside the range to 0 or 1, and round the result to 3 decimals.

```python starter
def duty(u_target, u_supply):
    return u_target / u_supply
```

<details>
<summary>Solution</summary>

```python solution
def duty(u_target, u_supply):
    d = u_target / u_supply             # U_avg = D · U_supply
    return round(min(max(d, 0), 1), 3)  # clip between 0 and 1
```

</details>

```python test
assert duty(1.25, 5) == 0.25
assert duty(3.3, 3.3) == 1
assert duty(7, 5) == 1              # the pin can't give more
assert duty(-1, 5) == 0
assert duty(1, 3.3) == 0.303
print("All checks passed!")
```

### Quick check questions

```quiz
? A signal is passed on 10 times over a noisy channel. In which case does the noise accumulate?
+ with the analogue signal
- with the digital signal
- equally with both
! The digital receiver decides again at every step whether it's 0 or 1 – so the noise doesn't add up.

? What is the 74HCT family good for compared with 74HC?
- it's faster
+ its input levels are TTL-compatible, so a 3.3 V or TTL output drives it reliably
- it uses less power
! VIH = 2.0 V instead of the 74HC's 3.5 V.

? A signal's rise time is 3.5 ns. Roughly what frequency components (MHz) does it contain?
= 100
! Bandwidth ≈ 0.35 / tr = 0.35 / 3.5 ns = 0.1 GHz.

? What is the period of a 250 MHz clock in ns?
= 4
! T = 1 / f = 1 / 250 MHz = 4 ns.

? An LED is driven with 5 V PWM at a 40% duty cycle. What is the average voltage (V)?
= 2
! 0.4 · 5 V = 2 V.
```
