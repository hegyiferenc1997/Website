---
title: Practice – Robotics Basics
summary: Review questions and a summary worksheet on robot parts, control and applications.
minutes: 18
kind: practice
---

## Review questions

<details>
<summary>1. A robot vacuum reaches the edge of the stairs. Which sensor notices it, and what does the controller do?</summary>

The downward infrared (cliff) sensor: it gets no reflected signal because there is no floor below. The controller stops the motors, reverses and turns.

</details>

<details>
<summary>2. Why is cruise control closed-loop and not open-loop?</summary>

Because it continuously measures the actual speed, compares it with the set one, and gives more throttle uphill and less downhill – it works with feedback.

</details>

<details>
<summary>3. What happens to a proportional controller if Kp is too large?</summary>

It overshoots: passes the setpoint, then overshoots back too, and oscillates; with a very large Kp the oscillation keeps growing (it becomes unstable).

</details>

```python run
# Try it with different Kp values: 0.3, 1.0, 1.5, 2.2
target, pos, Kp = 100.0, 0.0, 1.5
for step in range(1, 7):
    pos += Kp * (target - pos)
    print(step, round(pos, 1))
```

## Summary worksheet

```quiz required
? Which part is the robot's “brain”?
- motor
- battery
+ controller (e.g. a microcontroller)
- wheel
! The program runs on it.

? Which sensor makes a 3D distance map of the surroundings with a laser?
= LIDAR
! Self-driving cars and robot vacuums use it too.

? What is the difference between the setpoint and the measured value called?
= error
= error signal
! The controller computes its action from it.

? Where is the robot after the **first** step in the simulation above with Kp = 1.5?
= 150
! 0 + 1.5 · 100 = 150 – it overshot.

? Which one is not a robot?
- robot vacuum
- welding robot arm
- self-driving delivery drone
+ a kitchen timer with a fixed program
! The timer doesn't sense its environment or decide.

? Which motor moves to an exact given angle?
- DC motor
+ servo motor
- fan
- speaker
! A servo holds the angle with internal feedback.
```
