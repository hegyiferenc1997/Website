---
title: Integrated Circuit Gates – TTL and CMOS
summary: TTL and CMOS logic families, totem-pole, open-collector and tri-state outputs, fan-out, delay, power and level shifting between 3.3 V and 5 V.
minutes: 25
---

## What you will learn

- the characteristics of the two most important logic families, **TTL** and **CMOS**,
- **totem-pole**, **open-collector** (open-drain) and **tri-state** outputs,
- what **fan-out** means and how to calculate it,
- why CMOS **consumes power** only when switching, and how to **interface** different families.

## Electrical carriers of logic values

Inside the gates **transistors** switch. Which transistors are used and how the gate is built defines the **logic family**: voltage levels, speed, power consumption.

| Property              | TTL (74LS)                  | CMOS (74HC / 4000)                    |
| --------------------- | --------------------------- | ------------------------------------- |
| transistor            | bipolar (BJT)               | complementary MOSFET (n and p channel) |
| supply voltage        | 5 V ± 5%                    | 74HC: 2–6 V, 4000: 3–18 V              |
| static consumption    | significant (mA/gate)       | almost zero (nA–µA)                    |
| input                 | draws current               | insulated gate, high input resistance  |
| delay (typical)       | ~10 ns                      | 74HC: ~8–10 ns, 4000: 50–100 ns        |
| sensitivity           | robust                      | sensitive to static discharge          |

Today almost every integrated circuit (processor, memory, FPGA) is **CMOS**. TTL lives on mainly in education and old equipment; the **74HCT** series is CMOS but with TTL-compatible input levels.

## Output types

### Totem-pole (push-pull) output

Two transistors stacked: one pulls the output to the supply, the other to ground. Fast and strong in both directions. **Two such outputs must never be connected** – if one drives 1 and the other 0, there is a short between supply and ground.

### Open-collector / open-drain output (OC / OD)

Only the pull-down transistor is present: the output either **pulls to 0** or "floats". An external **pull-up resistor** provides the 1 level. Advantages:

- several outputs can be **connected together** (**wired-AND**): if any pulls 0, the line is 0,
- the pull-up resistor can go to **another supply voltage** → simple **level shifting**,
- this is how the **I²C bus** works (topic 10).

### Tri-state output

Besides 0 and 1 there is a third, **high-impedance** state (Z, "disconnected"), controlled by an enable input (*Enable*, OE). This lets several devices share a **bus**: only one drives it at a time, the others are in Z state.

## Fan-out

An output can drive only a limited number of inputs. **Fan-out** tells how many inputs of the same family can be connected to one output:

**fan-out = min( I<sub>OL</sub> / I<sub>IL</sub> , I<sub>OH</sub> / I<sub>IH</sub> )**

**Example (74LS):** I<sub>OL</sub> = 8 mA, I<sub>IL</sub> = 0.4 mA → 20; I<sub>OH</sub> = 0.4 mA, I<sub>IH</sub> = 20 µA → 20. The fan-out is **20**.

CMOS inputs draw almost no current, so the limit is **capacitive load**: every extra input slows down the transitions.

## CMOS power consumption

A CMOS gate uses almost no power at rest – only **when switching**, as it charges and discharges load capacitances. The **dynamic power**:

**P = α · C · V<sup>2</sup> · f**

where C is the switched capacitance, V the supply voltage, f the clock frequency, α the activity (fraction of switching, simplified to 1).

**Example:** C = 10 pF, V = 5 V, f = 10 MHz → P = 10·10<sup>−12</sup> · 25 · 10<sup>7</sup> = **2.5 mW**.

This shows why processor supply voltages went down from 5 V to ~1 V: power is proportional to the **square** of the voltage.

## Practical rules

- **Never leave a CMOS input floating!** A floating input picks up noise, can sit half-way, and both transistors may turn on (increased current, heating). Tie unused inputs to supply or ground (or to a used input).
- Put a **decoupling capacitor** (typically 100 nF) next to the supply pins of every IC.
- Use antistatic packaging and a grounded wrist strap when handling CMOS ICs.

## Interfacing families

| Direction | Problem | Solution |
| --------- | ------- | -------- |
| TTL → CMOS (5 V) | TTL V<sub>OH</sub> (min. 2.4 V) is too low for CMOS V<sub>IH</sub> (3.5 V) | pull-up resistor, open-collector buffer, transistor stage or a **74HCT** input |
| CMOS → TTL | old 4000-series CMOS cannot supply enough current | CMOS buffer IC |
| 3.3 V → 5 V | a 3.3 V signal may be too low for 5 V CMOS | level shifter (e.g. **TXS0108E**, bidirectional) |
| 5 V → 3.3 V | 5 V can **damage** a 3.3 V input | 5 V-tolerant buffer (e.g. **SN74LVC245A**), voltage divider |

> When connecting an Arduino (5 V) and a Raspberry Pi (3.3 V) this is an everyday task!

## Summary

- TTL: bipolar, 5 V, constant consumption; CMOS: MOSFET, wide supply range, power only when switching.
- Totem-pole outputs must not be tied together; open-collector = wired-AND + pull-up; tri-state = can share a bus.
- Fan-out = min(I<sub>OL</sub>/I<sub>IL</sub>, I<sub>OH</sub>/I<sub>IH</sub>).
- P = C·V²·f; CMOS inputs must not float; different levels need interfacing.

## Lesson exercise

```quiz required
? An output has I<sub>OL</sub> = 16 mA, I<sub>OH</sub> = 0.4 mA; an input has I<sub>IL</sub> = 1.6 mA, I<sub>IH</sub> = 40 µA. What is the fan-out?
= 10
! min(16 / 1.6 ; 0.4 / 0.04).

? What is the dynamic power of a CMOS gate in mW if C = 20 pF, V = 3.3 V, f = 50 MHz (α = 1)?
= 10.89
= 10,89
! P = C · V² · f = 20·10<sup>−12</sup> · 3.3² · 50·10<sup>6</sup>.

? With which output type can several outputs be connected **safely**, with a pull-up resistor?
- totem-pole
+ open-collector
- any output type
! Here the output can only pull down, so there can be no short.

? What is the third state of a tri-state output?
- the forbidden zone
+ high-impedance (disconnected) state
- negative voltage
- half the supply voltage
! In this state the output is practically disconnected from the line.

? What should you do with an unused input of a CMOS IC?
- leave it open
+ tie it to supply or ground
- connect it to the output through a resistor
! A floating CMOS input picks up noise and can cause excess current.

? By what factor does CMOS dynamic power grow if the supply voltage is doubled (everything else unchanged)?
= 4
! P is proportional to V².
```
