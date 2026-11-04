---
title: Open-Loop and Closed-Loop Control
summary: Open and closed loop, feedback, on–off and proportional controllers, the PID idea – with a simulation.
minutes: 18
---

## What you will learn

- the difference between **open-loop control** and **closed-loop control**,
- what **feedback** and the **error signal** are,
- how **on–off** and **proportional (P)** controllers work, and the idea of **PID**.

## Open-loop control

In **open-loop control** the robot doesn't check the result. Example: “turn the motor for 2 seconds” – if the floor is slippery or the battery is weaker, the robot stops somewhere else and doesn't even notice.

## Closed-loop control

In **closed-loop control** the robot continuously **measures** the actual value, compares it with the desired one (**setpoint**), and adjusts based on the difference (**error**). This is **feedback**.

```text
 setpoint ──►(−)──► error ──► controller ──► actuator ──► process ──┬──► output
              ▲                                                     │
              └─────────────────── sensor ◄─────────────────────────┘
```

Examples: thermostats, cruise control, a hovering drone, a line-following robot.

## On–off controller

The simplest: if the temperature is below the setpoint, the heating turns **on**, if above, **off**. Cheap, but the value always oscillates around the setpoint.

## Proportional (P) controller

A **proportional** controller sets the action **in proportion** to the error: `action = Kp · error`. It acts strongly on a big error and gently on a small one.

```python run
# A robot wants to reach 100 cm; in each step it moves Kp times the error
target = 100.0
pos = 0.0
Kp = 0.5
for step in range(1, 9):
    error = target - pos
    pos += Kp * error
    print(f"step {step}: pos = {pos:6.2f} cm, error = {target - pos:6.2f} cm")
```

Small `Kp` → arrives slowly; too large `Kp` (e.g. 1.5) → **overshoots** and oscillates; above 2 it can even run away. Try it in the code above!

## The PID idea

In practice the **PID** controller is the most widespread. It has three terms:

| Term                 | What does it look at?      | What is it for?             |
| -------------------- | -------------------------- | --------------------------- |
| **P** (proportional) | the current error          | quick reaction              |
| **I** (integral)     | the sum of past errors     | removes the remaining error |
| **D** (derivative)   | how fast the error changes | damps overshoot             |

Drones, robot arms, 3D printer heaters, self-driving cars – they all use PID (or an advanced version).

## Summary

- Open-loop control: no feedback; closed-loop control: with feedback.
- Error = setpoint − measured value.
- On–off: on/off; proportional: `Kp · error`; PID: proportional + integral + derivative.

## Exercise

```quiz required
? What is typical of **closed-loop** control compared with open-loop control?
- It has no sensor.
+ It measures the result and adjusts based on the error (feedback).
- It runs only once.
- It is always faster.
! Closed loop.

? What is the error if the setpoint is 22 °C and the measured value is 19 °C?
= 3
! error = setpoint − measured = 22 − 19.

? In the lesson's simulation (target 100, Kp = 0.5, starting at 0), where is the robot after the **first** step (cm)?
= 50
! 0 + 0.5 · 100 = 50.

? Which PID term damps overshoot by watching how fast the error changes?
- P
- I
+ D
! The derivative term.
```
