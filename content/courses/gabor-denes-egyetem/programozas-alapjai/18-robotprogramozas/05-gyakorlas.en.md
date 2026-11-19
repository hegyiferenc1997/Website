---
title: Practice – Robot Programming
summary: Review questions, executing a command sequence, obstacle avoidance, a P controller and path finding.
minutes: 30
kind: practice
---

## Review questions

**1. What is the difference between a sensor and an actuator? Give two examples of each.**

<details>
<summary>Answer</summary>

A sensor collects data about the environment or the robot (e.g. ultrasonic distance sensor, camera, gyroscope); an actuator turns the controller's decision into a physical effect (e.g. motor, servo, gripper).

</details>

**2. What is the sense–think–act loop?**

<details>
<summary>Answer</summary>

The endless loop of a robot program: it reads the sensors (sense), the program logic decides (think), then it commands the actuators (act), repeating this many times per second.

</details>

**3. Why is a median filter better than an average when the sensor sometimes returns a completely wrong value?**

<details>
<summary>Answer</summary>

Because the median is the middle value, so a single outlier doesn't affect it, whereas one big error drags the average off considerably.

</details>

**4. What is the drawback of on-off control, and how does a proportional controller improve on it?**

<details>
<summary>Answer</summary>

The on-off controller goes at full speed until it reaches the target, so inertia makes it overshoot and it may jerk back and forth. The proportional controller gives a speed proportional to the error, so it slows down near the target and settles gently.

</details>

**5. Why does breadth-first search (BFS) find the shortest path on a grid?**

<details>
<summary>Answer</summary>

Because it proceeds layer by layer: first it examines all cells 1 step away, then those 2 steps away, and so on. So when it first reaches the goal, no shorter path can exist.

</details>

**6. Why should a robot's decision logic be kept separate from the hardware code?**

<details>
<summary>Answer</summary>

So that the logic can be tried out in simulation and with unit tests, without expensive hardware or danger, and when the hardware changes only the sensor/actuator layer has to be rewritten.

</details>

## Exercises

### Exercise 1: Executing a command sequence

The robot starts at `(0, 0)` facing **north**. Write a function `execute(commands)` that executes a command string (`F` = one step forward, `R` = turn right, `L` = turn left) and returns the final `(x, y, heading)` triple. Going north increases `y`, going east increases `x`. The heading is one of `"N"`, `"E"`, `"S"`, `"W"`. Raise `ValueError` for an unknown command.

```python starter
def execute(commands):
    # TODO
    pass
```

<details>
<summary>Solution</summary>

```python solution
HEADINGS = ["N", "E", "S", "W"]
STEP = {"N": (0, 1), "E": (1, 0), "S": (0, -1), "W": (-1, 0)}

def execute(commands):
    """Execute F/R/L commands and return the final (x, y, heading) triple."""
    x, y, heading = 0, 0, "N"
    for command in commands:
        if command == "F":
            dx, dy = STEP[heading]
            x, y = x + dx, y + dy
        elif command == "R":
            heading = HEADINGS[(HEADINGS.index(heading) + 1) % 4]
        elif command == "L":
            heading = HEADINGS[(HEADINGS.index(heading) - 1) % 4]
        else:
            raise ValueError(f"Unknown command: {command}")
    return x, y, heading
```

</details>

```python test
assert execute("") == (0, 0, "N")
assert execute("FF") == (0, 2, "N")
assert execute("FRFF") == (2, 1, "E")
assert execute("RRRR") == (0, 0, "N")
assert execute("LF") == (-1, 0, "W")
try:
    execute("FX")
    assert False, "Expected ValueError"
except ValueError:
    pass
print("All checks passed!")
```

### Exercise 2: Obstacle avoidance

Write a function `decide(distance)` that returns the robot's action based on a distance reading (cm):

- invalid reading (≤ 0 or > 400): `"stop"` (for safety),
- below 20 cm: `"turn"`,
- from 20 up to (but not including) 50 cm: `"slow down"`,
- otherwise: `"forward"`.

Also write a function `control(readings)` that returns the list of decisions for a list of readings.

```python starter
def decide(distance):
    # TODO
    pass

def control(readings):
    # TODO
    pass
```

<details>
<summary>Solution</summary>

```python solution
def decide(distance):
    """Decide the robot's action from a single distance reading."""
    if distance <= 0 or distance > 400:
        return "stop"       # faulty sensor: better to stop
    if distance < 20:
        return "turn"
    if distance < 50:
        return "slow down"
    return "forward"

def control(readings):
    """The list of decisions for a series of readings."""
    return [decide(d) for d in readings]
```

</details>

```python test
assert decide(100) == "forward"
assert decide(50) == "forward"
assert decide(49.9) == "slow down"
assert decide(20) == "slow down"
assert decide(19) == "turn"
assert decide(0) == "stop"
assert decide(999) == "stop"
assert control([120, 35, 10, -1]) == ["forward", "slow down", "turn", "stop"]
print("All checks passed!")
```

### Exercise 3: P controller with limits

Write a function `p_controller(target, measured, kp, max_speed)` that returns the speed `kp * (measured - target)`, clamped to the range `[-max_speed, max_speed]`. Also write a function `simulate(start, target, kp, max_speed, steps)` that moves the robot by `measured -= speed` in each step and returns the final distance rounded to two decimals.

```python starter
def p_controller(target, measured, kp, max_speed):
    # TODO
    pass

def simulate(start, target, kp, max_speed, steps):
    # TODO
    pass
```

<details>
<summary>Solution</summary>

```python solution
def p_controller(target, measured, kp, max_speed):
    """Proportional controller: speed proportional to the error, limited."""
    speed = kp * (measured - target)
    return max(-max_speed, min(max_speed, speed))

def simulate(start, target, kp, max_speed, steps):
    """Simulate the robot's movement with a P controller."""
    measured = start
    for _ in range(steps):
        measured -= p_controller(target, measured, kp, max_speed)
    return round(measured, 2)
```

</details>

```python test
assert p_controller(30, 100, 0.5, 10) == 10        # clamped
assert p_controller(30, 40, 0.5, 10) == 5.0
assert p_controller(30, 10, 0.5, 10) == -10        # too close: reverse
assert p_controller(30, 30, 0.5, 10) == 0
assert abs(simulate(100, 30, 0.5, 10, 30) - 30) < 0.01
assert simulate(30, 30, 0.5, 10, 5) == 30
print("All checks passed!")
```

### Exercise 4: How many steps to the goal?

Write a function `step_count(grid)` that uses breadth-first search to find the minimum number of steps from cell `S` to cell `G` (moving only up, down, left, right; `#` is a wall). Return `-1` if there is no path. You may assume the map is surrounded by walls.

```python starter
from collections import deque

def step_count(grid):
    # TODO
    pass
```

<details>
<summary>Solution</summary>

```python solution
from collections import deque

def step_count(grid):
    """The length of the shortest path from S to G (BFS), or -1 if there is none."""
    for r, row in enumerate(grid):
        if "S" in row:
            start = (r, row.index("S"))
    dist = {start: 0}                # steps from the start for each cell
    waiting = deque([start])
    while waiting:
        r, c = waiting.popleft()
        if grid[r][c] == "G":
            return dist[(r, c)]
        for dr, dc in [(-1, 0), (0, 1), (1, 0), (0, -1)]:
            new = (r + dr, c + dc)
            if grid[new[0]][new[1]] != "#" and new not in dist:
                dist[new] = dist[(r, c)] + 1
                waiting.append(new)
    return -1
```

</details>

```python test
assert step_count(["#####", "#S.G#", "#####"]) == 2
assert step_count(["#####", "#S#G#", "#####"]) == -1
assert step_count([
    "#######",
    "#S..#.#",
    "#.#.#.#",
    "#.#...#",
    "#.###G#",
    "#######",
]) == 7
print("All checks passed!")
```

## Summary exercise: Robot vacuum: what can it clean?

A robot vacuum starts from cell `R` and cleans every free (`.`) cell it can reach by stepping up, down, left or right. Write a `clean(floor)` function that returns a dictionary:

- `"cleaned"`: how many `.` cells it cleaned,
- `"unreachable"`: how many `.` cells stayed dirty because they cannot be reached,
- `"floor"`: the new map (list of strings) with `o` in place of the cleaned cells; `R`, the walls and the unreachable cells are unchanged.

Don't modify the input map! The map is surrounded by walls. Tip: breadth-first or depth-first traversal (flood fill) with a set for the visited cells.

```python starter required
def clean(floor):
    cleaned = sum(line.count(".") for line in floor)
    return {"cleaned": cleaned, "unreachable": 0, "floor": floor}


FLOOR = [
    "########",
    "#R..#..#",
    "#.#.#..#",
    "#...####",
    "########",
]
for line in clean(FLOOR)["floor"]:
    print(line)
```

<details>
<summary>Solution</summary>

```python solution
from collections import deque


def clean(floor):
    for r, line in enumerate(floor):
        if "R" in line:
            start = (r, line.index("R"))
    # Flood fill: visit every reachable cell
    seen = {start}
    queue = deque([start])
    while queue:
        r, c = queue.popleft()
        for nb in ((r - 1, c), (r + 1, c), (r, c - 1), (r, c + 1)):
            if nb not in seen and floor[nb[0]][nb[1]] == ".":
                seen.add(nb)
                queue.append(nb)
    # New map: cleaned cells become o
    new = []
    for r, line in enumerate(floor):
        new.append("".join("o" if (r, c) in seen and ch == "." else ch for c, ch in enumerate(line)))
    cleaned = len(seen) - 1           # the R cell is not counted
    total = sum(line.count(".") for line in floor)
    return {"cleaned": cleaned, "unreachable": total - cleaned, "floor": new}


FLOOR = [
    "########",
    "#R..#..#",
    "#.#.#..#",
    "#...####",
    "########",
]
for line in clean(FLOOR)["floor"]:
    print(line)
```

</details>

```python test
FLOOR = ["########", "#R..#..#", "#.#.#..#", "#...####", "########"]
copy = list(FLOOR)
r = clean(FLOOR)
assert FLOOR == copy, "Don't modify the input map."
assert r["cleaned"] == 7 and r["unreachable"] == 4, "7 cells are reachable, 4 stay behind the wall."
assert r["floor"] == ["########", "#Roo#..#", "#o#o#..#", "#ooo####", "########"], "Cleaned cells become o, everything else is unchanged."
assert clean(["###", "#R#", "###"]) == {"cleaned": 0, "unreachable": 0, "floor": ["###", "#R#", "###"]}, "With no free cells there is nothing to clean."
r = clean(["#####", "#.#R#", "#.#.#", "#####"])
assert r["cleaned"] == 1 and r["unreachable"] == 2 and r["floor"][2] == "#.#o#", "It can only move to neighbouring (not diagonal) cells."
```
