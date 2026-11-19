---
title: Deeper – Robots by Simulation
summary: Filtering noisy sensors (mean and median), where a two-wheeled robot is from its wheel turns, why a P controller leaves an error and how the I term removes it, and the state machine of a line-following robot – with small programs and an interactive chart.
minutes: 45
---

## What you will learn in this lesson

- how to **filter** a noisy sensor signal, and which filter is good for what,
- how a robot computes its **position** from its wheels' rotation, and why it drifts over time,
- why a proportional controller leaves a **steady-state error**, and what the **integral term** adds,
- how to describe a robot's behaviour with a **state machine**.

## 1. Noisy sensors: mean or median?

An ultrasonic distance sensor never gives a perfect value: measurements are **noisy**, and now and then a completely wrong value (a "spike") slips in, e.g. when the sound bounces off a slanted surface in the wrong direction. Two simple filters:

- **moving average**: the mean of the last $k$ measurements – it smooths, but also "smears" the spike,
- **moving median**: the middle value of the last $k$ measurements – it completely filters out rare spikes.

```python run
# Filtering a noisy distance measurement with a moving average and a moving median
import random
from statistics import mean, median

random.seed(4)
real = 50.0                                           # the wall is really 50 cm away
readings = [real + random.gauss(0, 2) for _ in range(12)]
readings[5] = 300.0                                   # a bad reflection: a spike

def moving(data, k, fn):
    return [fn(data[max(0, i - k + 1):i + 1]) for i in range(len(data))]

avg = moving(readings, 3, mean)
med = moving(readings, 3, median)
print("reading    mean  median")
for r, a, m in zip(readings, avg, med):
    print(f"{r:6.1f} {a:7.1f} {m:7.1f}")
```

The spike pulls the moving average to **about 134 cm** for three steps – a robot would then think the way is clear. The median doesn't even notice it. The **viewpoints** here depend on the task: the average is good for small, even noise (and quick to compute on a small microcontroller), the median for rare, large errors. Both cost **delay**: the filtered value only follows a real change after a few measurements.

## 2. Where am I? Positioning from the wheels

A two-wheeled robot (like a robot vacuum) measures its wheels' rotation (**odometry**). If both wheels turn the same amount, it goes straight; if the right one turns more, it turns left; if they turn in opposite directions, it spins on the spot. From the wheels' distances the new position and heading can be computed:

```python run
# Odometry: a two-wheeled robot's position from the distance each wheel travels
from math import cos, sin, pi, degrees

AXLE = 0.20                                     # distance between the two wheels (m)

def step(x, y, heading, left, right):
    dist = (left + right) / 2                   # distance travelled by the robot's centre
    turn = (right - left) / AXLE                # change of heading in radians
    heading += turn / 2
    x, y = x + dist * cos(heading), y + dist * sin(heading)
    return x, y, heading + turn / 2

TURN = AXLE * pi / 4                            # 90° on the spot: the wheels turn in opposite directions
x = y = heading = 0.0
for left, right in [(1.0, 1.0), (-TURN, TURN), (1.0, 1.0)]:   # forward 1 m, left 90°, forward 1 m
    x, y, heading = step(x, y, heading, left, right)
    print(f"left {left:6.3f} m, right {right:6.3f} m → x = {x:5.2f}, y = {y:5.2f}, heading {degrees(heading):5.1f}°")

# in reality the wheel slips a little: when turning, the right wheel travels 2% more than the robot believes
x = y = heading = 0.0
for _ in range(4):                             # a square: 4 × (forward 1 m, left 90°)
    x, y, heading = step(x, y, heading, 1.0, 1.0)
    x, y, heading = step(x, y, heading, -TURN, TURN * 1.02)
print(f"after one square the robot is really at ({x:.2f}, {y:.2f}), though it believes it's back at (0, 0)")
```

Even a small 2% wheel slip accumulates: after one square the robot is already a few centimetres away from where it thinks it is, and the further it goes, the bigger the error. That's why real robots combine odometry with **other sensors** (gyroscope, camera, laser rangefinder, GPS) – this is called **sensor fusion**.

## 3. The controller: why does an error remain, and what does the I term do?

In the basic lesson we saw the proportional (P) controller: the action is proportional to the error. With a robot arm or heating, though, there's often a **constant disturbance** (gravity pulls the arm, heat escapes through the window). Then a P controller never quite reaches the target: a small remaining error is needed to produce the action that balances the disturbance. The **integral (I) term** **sums up** past errors and keeps increasing the action until the error disappears:

```python run
# P and PI controller: temperature control with constant heat loss
def simulate(kp, ki, steps=100):
    T, target, integral = 15.0, 22.0, 0.0
    for _ in range(steps):
        error = target - T
        integral += error
        heating = max(0.0, kp * error + ki * integral)   # heating can't be negative
        T += 0.1 * heating - 0.05 * (T - 10)             # heating − heat loss to the 10 °C outside
    return T

for kp, ki in [(1.0, 0.0), (3.0, 0.0), (1.0, 0.1)]:
    T = simulate(kp, ki)
    print(f"Kp = {kp}, Ki = {ki}: after 100 steps {T:.2f} °C (target 22 °C, remaining error {22 - T:.2f})")
```

Raising the P controller's gain reduces the steady-state error but doesn't remove it (and with too high a gain the system starts to oscillate). The PI controller, however, reaches the target exactly. The **D (derivative) term** reacts to how fast the error changes and dampens overshoot – that's how PID comes together.

In a simple P-controlled system the error decreases roughly exponentially; with the slider you set the controller's strength:

```plot
title: Decrease of the error (%) over time (s) with a P controller
x: 0, 10
y: 0, 100
param: k = 0.5, 0.1, 3, 0.1
f: 100*exp(-k*x) # with stronger control the error drops faster
dash: 5 # 5% band
```

## 4. State machine: the "brain" of a line-following robot

A robot's behaviour is often described with **states**: it's always in one state, and switches to another based on sensor signals. A line-following robot has two light sensors (left, right) that tell whether they see the black line:

```python run
# State machine: a line-following robot with two light sensors
def next_state(state, left_sees, right_sees, obstacle):
    if obstacle:
        return "STOP"                         # safety overrides everything
    if left_sees and right_sees:
        return "STRAIGHT"
    if left_sees:
        return "LEFT"                         # the line has shifted left
    if right_sees:
        return "RIGHT"
    return "SEARCH" if state != "STOP" else "STOP"   # it lost the line

state = "STRAIGHT"
sensors = [(1, 1, 0), (1, 0, 0), (1, 1, 0), (0, 1, 0), (0, 0, 0), (1, 1, 0), (1, 1, 1)]
for left, right, obstacle in sensors:
    state = next_state(state, left, right, obstacle)
    print(f"left {left}, right {right}, obstacle {obstacle} → {state}")
```

The advantage of a state machine is that you have to think through what the robot should do in **every situation** – so a case like losing the line isn't forgotten. The obstacle check comes first: that's the **safety viewpoint**, which for an industrial robot or a self-driving car comes before everything else.

| Viewpoint             | What do they watch out for in a robot?                           |
| --------------------- | ---------------------------------------------------------------- |
| **mechanics**         | motors, wheels, slip, weight, energy use                         |
| **electronics**       | sensor noise, microcontroller speed, power supply                |
| **software**          | filtering, control, state machine, handling rare cases           |
| **safety and ethics** | emergency stop, people nearby, who's responsible for an accident |

## Summary

- A moving average smooths small, even noise, a moving median filters out rare spikes; both add delay.
- Odometry computes position from the wheels' distances, but errors accumulate – hence sensor fusion.
- With a constant disturbance a P controller leaves a steady-state error; the I term removes it by summing errors, the D term dampens overshoot.
- A state machine prescribes the robot's behaviour in every situation; the safety condition comes first.

## Lesson exercise

```quiz required
? What is the median of the readings 48, 51, 300?
= 51
! Sorted: 48, 51, 300 – the middle one is 51.

? What is the mean of the readings 48, 51, 300?
= 133
! $(48 + 51 + 300) / 3 = 133$.

? Both wheels of a robot turn 1 metre each. How far did the robot's centre travel (m)?
= 1
! $(1 + 1) / 2 = 1$ m, straight ahead.

? Why does an error remain with a P controller if there's a constant disturbance (e.g. heat loss)?
- because the controller is broken
+ because there's only action when there's an error, so a small remaining error is needed to balance the disturbance
- because a P controller always overshoots
- no error remains
! The integral term removes the steady-state error by summing errors.

? In a line-following robot's state machine, which condition should be checked first?
- whether the left sensor sees the line
- whether the right sensor sees the line
+ whether there's an obstacle (stop)
- how charged the battery is
! Safety comes before everything else.
```
