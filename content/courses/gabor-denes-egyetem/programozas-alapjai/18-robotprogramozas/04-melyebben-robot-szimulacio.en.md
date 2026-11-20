---
title: Deeper – Robot Control with Simulation
summary: A two-wheeled robot's path from its wheel speeds, the PD controller and overshoot (with an interactive chart), combining two sensors with a complementary filter, and the A* path finder, which searches more cleverly than breadth-first search – with runnable simulations and a programming exercise.
minutes: 55
---

## What you will learn in this lesson

- how a two-wheeled robot's **path** can be computed from the wheels' speeds,
- why a P controller overshoots, and how the D term **damps** it,
- how two poor sensors make one good one (**sensor fusion**),
- why the **A\*** path finder is faster than plain breadth-first search.

## 1. A two-wheeled robot's path

In the basic lesson we simulated a robot moving on a grid. A real two-wheeled robot (robot vacuum, educational robot) turns using the **difference in speed** of its two wheels: if they turn equally, it goes straight; if the right one is faster, it turns left. We update its position $(x, y)$ and heading $\theta$ in small time steps:

```python run
# Simulating a two-wheeled robot's path with small time steps
import math

AXLE = 0.2                           # distance between the two wheels (m)

def step(x, y, theta, v_left, v_right, dt):
    v = (v_left + v_right) / 2                   # speed of the centre
    omega = (v_right - v_left) / AXLE            # turning speed (rad/s)
    return x + v * math.cos(theta) * dt, y + v * math.sin(theta) * dt, theta + omega * dt

def simulate(commands, dt=0.01):
    x = y = theta = 0.0
    for v_left, v_right, duration in commands:
        for _ in range(round(duration / dt)):
            x, y, theta = step(x, y, theta, v_left, v_right, dt)
    return x, y, math.degrees(theta) % 360

routes = {
    "straight for 2 s":          [(0.5, 0.5, 2)],
    "turning on the spot":       [(-0.157, 0.157, 1)],
    "arc to the left":           [(0.4, 0.6, 2)],
    "straight + turn + straight": [(0.5, 0.5, 2), (-0.157, 0.157, 1), (0.5, 0.5, 2)],
}
for name, commands in routes.items():
    x, y, heading = simulate(commands)
    print(f"{name:<28} → x = {x:5.2f} m, y = {y:5.2f} m, heading = {heading:5.1f}°")
```

The robot turning on the spot turns about 90° in one second ($0.314 / 0.2 \approx 1.57$ rad/s), and the last route traces an "L" shape. In reality wheels slip, and small errors **add up** – that's why robots also rely on external cues (walls, markers, a camera) besides their own calculation.

## 2. PD controller: taming overshoot

A **P** (proportional) controller acts in proportion to the error. If the robot has "inertia" (momentum), a P controller **overshoots**: by the time it reaches the target, it's too fast, and runs past it. The **D** (derivative) term reacts to the **change** of the error: if the error is shrinking fast, it brakes:

```plot
title: Distance from the target with simple P control (step by step)
x: 0, 30
y: -1, 1
param: k = 0.3, 0.05, 1.9, 0.05
f: (1 - k)^x # the error is multiplied by (1 − k) at every step
```

The slider shows it: with small $k$ it approaches slowly, above $k > 1$ it changes sign (overshoots and swings back), and near $k$ = 2 it hardly settles. With a robot that has momentum this is even sharper:

```python run
# P and PD controllers on a robot with momentum: overshoot and settling
def simulate(kp, kd, steps=60, dt=0.1):
    position, velocity, target = 0.0, 0.0, 1.0
    prev_error = target - position
    peak = 0.0
    for _ in range(steps):
        error = target - position
        acceleration = kp * error + kd * (error - prev_error) / dt   # P term + D term
        prev_error = error
        velocity += acceleration * dt
        position += velocity * dt
        peak = max(peak, position)
    return peak, position

for name, kp, kd in [("P only (kp=4)", 4, 0), ("PD (kp=4, kd=2)", 4, 2), ("PD (kp=4, kd=4)", 4, 4)]:
    peak, final = simulate(kp, kd)
    print(f"{name:<17} overshoot: {max(0, peak - 1) * 100:5.1f}%, position after 6 s: {final:.3f} m")
```

The P-only controller runs well past the 1-metre target, and is still swinging back and forth after 6 seconds. Adding the D term removes the overshoot, and the robot settles nicely. Real industrial controllers are **PID**s: the third, I (integral) term removes a small error that persists (e.g. if a slope keeps pulling the robot back).

## 3. Sensor fusion: the complementary filter

A robot's tilt angle can be measured with two sensors: the **gyroscope** is accurate short term, but slowly drifts; the **accelerometer** is accurate long term, but noisy. The **complementary filter** combines the strengths of both: it trusts the gyroscope with fast changes, the accelerometer with the long-term value:

```python run
# Complementary filter: drifting gyroscope + noisy accelerometer = a good estimate
import random

random.seed(3)
true_angle = 10.0                               # the true tilt angle: a constant 10°
dt, alpha = 0.01, 0.98                          # 98% gyroscope, 2% accelerometer
gyro_angle = estimate = true_angle

errors = {"gyroscope only": 0, "accelerometer only": 0, "complementary filter": 0}
for _ in range(1000):                           # 10 seconds
    gyro_rate = 0.0 + 0.5                       # the gyroscope measures with a 0.5 °/s offset (drift)
    accel_angle = true_angle + random.gauss(0, 3)   # the accelerometer measures with ±3° noise
    gyro_angle += gyro_rate * dt
    estimate = alpha * (estimate + gyro_rate * dt) + (1 - alpha) * accel_angle
    errors["gyroscope only"] = abs(gyro_angle - true_angle)
    errors["accelerometer only"] = abs(accel_angle - true_angle)
    errors["complementary filter"] = abs(estimate - true_angle)

for name, error in errors.items():
    print(f"{name:<22} error after 10 s: {error:5.2f}°")
```

The gyroscope drifted 5 degrees in 10 seconds, a single accelerometer measurement can be off by several degrees, but the filter stays close to the true value throughout. Phones, drones and self-driving cars use the same principle (in a more advanced form: the Kalman filter).

## 4. Smarter path finding: A\*

In the basic lesson we saw breadth-first search, which spreads **equally in every direction**. The **A\*** algorithm also uses an **estimate** (heuristic) of how far the goal still is – on a grid, the Manhattan distance – and examines the cells towards the goal first:

```python run
# Comparing breadth-first search and A*: how many cells do they examine?
import heapq
from collections import deque

grid = [
    "............",
    "............",
    "....#####...",
    "S...#.......",
    "....#.......",
    "....#......G",
    "............",
]
R, C = len(grid), len(grid[0])
start = next((r, c) for r in range(R) for c in range(C) if grid[r][c] == "S")
goal = next((r, c) for r in range(R) for c in range(C) if grid[r][c] == "G")

def neighbours(r, c):
    for dr, dc in [(1, 0), (-1, 0), (0, 1), (0, -1)]:
        if 0 <= r + dr < R and 0 <= c + dc < C and grid[r + dr][c + dc] != "#":
            yield r + dr, c + dc

def breadth_first():
    queue, dist, examined = deque([start]), {start: 0}, 0
    while queue:
        cell = queue.popleft(); examined += 1
        if cell == goal:
            return dist[cell], examined
        for n in neighbours(*cell):
            if n not in dist:
                dist[n] = dist[cell] + 1; queue.append(n)

def a_star():
    estimate = lambda m: abs(m[0] - goal[0]) + abs(m[1] - goal[1])   # Manhattan distance
    open_list, dist, done = [(estimate(start), estimate(start), start)], {start: 0}, set()
    while open_list:
        _, _, cell = heapq.heappop(open_list)                        # the most promising cell
        if cell in done:
            continue
        done.add(cell)
        if cell == goal:
            return dist[cell], len(done)
        for n in neighbours(*cell):
            if n not in dist or dist[cell] + 1 < dist[n]:
                dist[n] = dist[cell] + 1
                # ordering: (travelled + estimated path, estimated path) – on a tie, the one closer to the goal wins
                heapq.heappush(open_list, (dist[n] + estimate(n), estimate(n), n))

print("breadth-first search: path length %d, cells examined %d" % breadth_first())
print("A*:                   path length %d, cells examined %d" % a_star())
```

Both find an equally long (shortest) path, but A\* examines only about a third of the cells. On a big map (a city's road network, a game level) this difference is huge. A\* is guaranteed to give the shortest path if the estimate never **overestimates** – the Manhattan distance on a grid with walls is such an estimate.

| Viewpoint               | What do they watch for in robot programming?                            |
| ----------------------- | ----------------------------------------------------------------------- |
| **programmer**          | small-time-step simulation, tunable parameters (kp, kd, alpha)          |
| **mechanical engineer** | the physics: mass, momentum, friction, the limits of motors and sensors |
| **safety**              | emergency stop, limited speed near people, detecting a faulty sensor    |
| **user**                | the robot should move predictably and smoothly, and not get stuck       |

## Summary

- A two-wheeled robot turns with the difference of its wheel speeds; we compute its path in small time steps.
- A P controller overshoots for a system with momentum; the D term damps, the I term removes persistent error.
- The complementary filter combines the gyroscope's short-term and the accelerometer's long-term accuracy.
- A\* searches towards the goal using an estimate, so it examines fewer cells than breadth-first search.

## Lesson exercise: PD control signals

Write the `pd_signals(errors, kp, kd)` function, which computes the PD controller's control signals (as a list) from the list of measured errors! At every step the signal is: `kp * error + kd * (error − previous error)`. At the first step there's no previous error yet, so the D term is 0 there. Round the signals to 2 decimals.

```python starter required
def pd_signals(errors, kp, kd):
    return [round(kp * e, 2) for e in errors]


print(pd_signals([1.0, 0.6, 0.3, 0.1], 2, 1))
```

<details>
<summary>Solution</summary>

```python solution
def pd_signals(errors, kp, kd):
    signals = []
    previous = None
    for e in errors:
        d = 0 if previous is None else e - previous
        signals.append(round(kp * e + kd * d, 2))
        previous = e
    return signals


print(pd_signals([1.0, 0.6, 0.3, 0.1], 2, 1))
```

</details>

```python test
assert pd_signals([1.0, 0.6, 0.3, 0.1], 2, 1) == [2.0, 0.8, 0.3, 0.0], "the D term brakes as the error shrinks"
assert pd_signals([1.0, 0.6, 0.3, 0.1], 2, 0) == [2.0, 1.2, 0.6, 0.2], "with kd = 0 it's a plain P controller"
assert pd_signals([0.5], 3, 10) == [1.5], "no D term at the first step"
assert pd_signals([], 1, 1) == [], "an empty list for an empty list"
```
