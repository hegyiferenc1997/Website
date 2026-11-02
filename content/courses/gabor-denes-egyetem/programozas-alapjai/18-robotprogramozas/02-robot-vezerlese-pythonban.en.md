---
title: Robot Control in Python – a Simulated Robot
summary: A grid robot as a class, a state machine for a robot vacuum and filtering noisy sensor data.
minutes: 20
---

## What you will learn

- how to model a robot with a **class** (sensors = query methods, actuators = command methods),
- what a **state machine** is and why it is one of the most important patterns in robot control,
- how to **filter** noisy sensor data.

## A simulated robot on a grid

The map is a list of strings: `#` is a wall, `.` is a free cell. The robot has a **position** (row, column) and a **heading** (N, E, S, W). Sensors query the environment; actuators change the robot's state.

```python run
# Map: # = wall, . = free; the robot moves in (row, column) coordinates.
MAP = [
    "#########",
    "#.......#",
    "#..##...#",
    "#.......#",
    "#########",
]

# Headings clockwise: north, east, south, west.
HEADINGS = ["N", "E", "S", "W"]
DELTA = {"N": (-1, 0), "E": (0, 1), "S": (1, 0), "W": (0, -1)}


class Robot:
    """A simulated robot moving on a grid."""

    def __init__(self, grid: list[str], row: int, col: int, heading: str = "E"):
        self.grid = grid
        self.row = row
        self.col = col
        self.heading = heading
        self.path = [(row, col)]  # visited cells

    # --- sensors ---
    def wall_ahead(self) -> bool:
        """Bump sensor: is there a wall directly ahead?"""
        dr, dc = DELTA[self.heading]
        return self.grid[self.row + dr][self.col + dc] == "#"

    def distance(self) -> int:
        """Distance sensor: how many free cells are ahead up to the wall?"""
        dr, dc = DELTA[self.heading]
        r, c, count = self.row + dr, self.col + dc, 0
        while self.grid[r][c] != "#":
            count += 1
            r, c = r + dr, c + dc
        return count

    # --- actuators ---
    def forward(self) -> None:
        """Step one cell forward (won't drive into a wall)."""
        if self.wall_ahead():
            raise RuntimeError("Collision! The robot would hit a wall.")
        dr, dc = DELTA[self.heading]
        self.row += dr
        self.col += dc
        self.path.append((self.row, self.col))

    def turn_right(self) -> None:
        """Turn 90 degrees to the right."""
        self.heading = HEADINGS[(HEADINGS.index(self.heading) + 1) % 4]

    def turn_left(self) -> None:
        """Turn 90 degrees to the left."""
        self.heading = HEADINGS[(HEADINGS.index(self.heading) - 1) % 4]

    def __str__(self) -> str:
        return f"({self.row}, {self.col}) facing {self.heading}"


robot = Robot(MAP, 1, 1)
print("Start:", robot, "– free cells ahead:", robot.distance())
while not robot.wall_ahead():
    robot.forward()
print("At the wall:", robot)
robot.turn_right()
robot.forward()
robot.forward()
print("Turned and stepped twice:", robot)
print("Number of visited cells:", len(robot.path))
```

**Observation:** the `Robot` class **encapsulates** the robot's state and operations. On a real robot the same methods would drive the hardware – the program using the robot (the `while` loop) could stay unchanged.

## State machines

A robot's behaviour can often be split into **states**: "driving", "turning", "going to charger", "charging". Each state has its own job, and specific **events** (sensor signals) trigger the **transitions**. This is called a **finite state machine**.

| State | Event | New state |
| --- | --- | --- |
| DRIVE | obstacle ahead | TURN |
| DRIVE | battery ≤ 15% | GO TO CHARGER |
| TURN | finished turning | DRIVE |
| GO TO CHARGER | at the charging station | CHARGE |
| CHARGE | battery ≥ 50% | DRIVE |

```python run
# A robot vacuum's state machine: each state behaves differently,
# and specific events trigger the transitions.
DRIVE, TURN, GO_TO_CHARGER, CHARGE = "DRIVE", "TURN", "GO TO CHARGER", "CHARGE"

# Simulated sensor data per step: (obstacle ahead?, at the charging station?)
sensor = [
    (False, False), (False, False), (True, False), (False, False),
    (False, False), (False, False), (False, False), (False, True),
    (False, True), (False, True), (False, False),
]

state = DRIVE
battery = 30  # percent

for step, (obstacle, at_charger) in enumerate(sensor):
    # --- think: transitions ---
    if state == DRIVE:
        if battery <= 15:
            state = GO_TO_CHARGER
        elif obstacle:
            state = TURN
    elif state == TURN:
        state = DRIVE              # turns in one step, then drives on
    elif state == GO_TO_CHARGER:
        if at_charger:
            state = CHARGE
    elif state == CHARGE:
        if battery >= 50:
            state = DRIVE

    # --- act: the action belonging to the state ---
    if state in (DRIVE, GO_TO_CHARGER):
        battery -= 3
    elif state == TURN:
        battery -= 1
    elif state == CHARGE:
        battery = min(100, battery + 20)

    print(f"step {step:2}: {state:<14} battery: {battery}%")
```

The advantages of a state machine: it is **clear** (you can draw it), **easy to extend** (new state = new branch), and in every situation it is unambiguous what the robot does. It is used everywhere from industrial robots to enemies in games.

## Filtering noisy sensor data

Real sensors sometimes return **wrong values** (reflections, interference). If the robot reacted to a single bad reading, it would jerk or stop needlessly. The solution: look at several consecutive readings together.

- **Moving average:** the average of the last *n* readings – smooths, but big errors drag it off.
- **Moving median:** the median of the last *n* readings – filters out outliers completely.

```python run
import statistics

# Raw data from a distance sensor: 250 and 0 are bad readings (noise, reflection).
raw = [52, 51, 250, 50, 49, 0, 48, 47, 47, 46]

def moving_median(data: list[int], window: int = 3) -> list[float]:
    """Replace each point with the median of the last `window` readings."""
    filtered = []
    for i in range(len(data)):
        part = data[max(0, i - window + 1): i + 1]
        filtered.append(statistics.median(part))
    return filtered

def moving_average(data: list[int], window: int = 3) -> list[float]:
    """The average of the last `window` readings."""
    return [round(statistics.mean(data[max(0, i - window + 1): i + 1]), 1) for i in range(len(data))]

print("raw:     ", raw)
print("average: ", moving_average(raw))
print("median:  ", moving_median(raw))
```

You can see that the bad reading of 250 spoils the average for three steps, while the median barely notices it.

## Summary

- It's worth modelling a robot with a **class**: sensor and actuator methods.
- A **state machine** is a clear description of robot behaviour: states + transitions.
- Sensor data must be **filtered**; against outliers, the **median** works best.
