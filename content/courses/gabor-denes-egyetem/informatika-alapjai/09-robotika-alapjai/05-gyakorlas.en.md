---
title: Practice – Robotics Basics
summary: Review questions and a summary worksheet on robot parts, control and applications.
minutes: 43
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

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **Moving median.** Write the `moving_median(data, k)` function, which returns a list with, for every position, the median of the last (at most) `k` measurements!

```python starter
def moving_median(data, k):
    return [sum(data[max(0, i - k + 1):i + 1]) / k for i in range(len(data))]
```

<details>
<summary>Solution</summary>

```python solution
from statistics import median

def moving_median(data, k):
    return [median(data[max(0, i - k + 1):i + 1]) for i in range(len(data))]   # shorter window at the start
```

</details>

```python test
assert moving_median([50, 51, 300, 49, 52], 3) == [50, 50.5, 51, 51, 52]
assert moving_median([1, 2, 3], 1) == [1, 2, 3]
assert moving_median([], 3) == []
print("All checks passed!")
```

**2.** **On/off controller.** Write the `thermostat(temperatures, target, hysteresis)` function, which tells for every measured temperature whether the heating is on (`True`/`False`)! The heating starts off; it switches on if the temperature drops below `target - hysteresis`, and off if it goes above `target + hysteresis`; in between the previous state remains.

```python starter
def thermostat(temperatures, target, hysteresis):
    return [t < target for t in temperatures]
```

<details>
<summary>Solution</summary>

```python solution
def thermostat(temperatures, target, hysteresis):
    on, states = False, []
    for t in temperatures:
        if t < target - hysteresis:
            on = True
        elif t > target + hysteresis:
            on = False                        # no switching inside the band: no "chattering"
        states.append(on)
    return states
```

</details>

```python test
assert thermostat([20, 21.4, 22.6, 21.8, 21.4], 22, 0.5) == [True, True, False, False, True]
assert thermostat([22, 22, 22], 22, 0.5) == [False, False, False]
print("All checks passed!")
```

**3.** **Odometry.** Write the `wheel_path(left, right)` function, which, from the distances travelled by a two-wheeled robot's wheels (in metres), returns the pair `(distance of the centre, change of heading in degrees)`, if the wheels are 0.2 m apart! Round both values to 2 decimals. (Change of heading in radians: (right − left) / 0.2.)

```python starter
def wheel_path(left, right):
    return (round(left + right, 2), 0.0)
```

<details>
<summary>Solution</summary>

```python solution
from math import degrees

def wheel_path(left, right):
    distance = (left + right) / 2            # the centre travels the average of the two wheels
    turn = degrees((right - left) / 0.2)
    return (round(distance, 2), round(turn, 2))
```

</details>

```python test
assert wheel_path(1, 1) == (1.0, 0.0)
assert wheel_path(0.9, 1.1) == (1.0, 57.3)
assert wheel_path(-0.157, 0.157) == (0.0, 89.95)
print("All checks passed!")
```

### Quick check questions

```quiz
? What are a robot's three basic functions?
+ sensing, deciding, acting
- design, manufacture, sales
- reading, writing, deleting
- input, output, storage
! The sense–decide–act cycle.

? A P controller's gain is 2, the error is 3 °C. How big is the control action (in arbitrary units)?
= 6
! $2 \cdot 3 = 6$.

? Which is an example of closed-loop control?
- a toaster with a timer
+ a thermostat that measures the temperature and switches the heating accordingly
- a light switch
- a washing machine with a fixed program
! Feedback is the key.

? How many degrees of freedom does a typical industrial robot arm have?
= 6
! Six joints: position (3) and orientation (3).
```
