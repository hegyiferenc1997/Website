---
title: Control and Path Planning
summary: On-off and proportional (P) controllers, line following, and finding the shortest path with breadth-first search (BFS).
minutes: 20
---

## What you will learn

- what **control** is and why a **proportional (P) controller** beats on-off control,
- how a **line-following** robot works,
- how a robot plans a **path** on a map with **breadth-first search** (BFS).

## Control: on-off or proportional?

**Task:** the robot should stop exactly 30 cm from the wall. In each step the controller decides the speed based on the **error** (the difference between the desired and the measured value).

- **On-off controller:** full speed when far, stop when reached. Simple, but because of inertia it **overshoots** the target (and may jerk back and forth).
- **Proportional (P) controller:** the speed is **proportional to the error** (`speed = Kp · error`). Fast when far, slower and slower near the target – it settles gently.

```python run
# The robot wants to stop 30 cm from the wall. It starts 100 cm away.
TARGET = 30

def on_off(distance: float) -> float:
    """On-off controller: full speed or stop."""
    return 10 if distance > TARGET else 0

def proportional(distance: float, kp: float = 0.3) -> float:
    """Proportional (P) controller: speed proportional to the error, at most 10 cm/step."""
    error = distance - TARGET
    return max(-10, min(10, kp * error))

for name, controller in [("on-off", on_off), ("P", proportional)]:
    distance = 100.0
    trace = []
    for _ in range(12):
        speed = controller(distance)
        distance -= speed * 1.1   # in reality the robot goes a bit further (inertia, slipping)
        trace.append(round(distance, 1))
    print(f"{name:7}: {trace}")
```

The on-off controller stops at 23 cm (7 cm too far), while the proportional controller gradually approaches 30 cm. In practice a **PID controller** is used: besides the proportional (P) term it also considers the accumulated error (I, integral) and the change in error (D, derivative) – making it faster and more accurate.

> The value of `Kp` must be **tuned**: too small and the robot reaches the target slowly; too large and it overshoots and oscillates.

## Line following

A line-following robot has light sensors underneath that watch a dark line drawn on the floor. With two sensors the simple rule is:

| Left sensor | Right sensor | Action                     |
| ----------- | ------------ | -------------------------- |
| line        | line         | straight                   |
| line        | none         | turn left                  |
| none        | line         | turn right                 |
| none        | none         | stop / search for the line |

```python run
def line_follower(left: bool, right: bool) -> str:
    """Decision rule of a two-sensor line follower."""
    if left and right:
        return "straight"
    if left:
        return "left"
    if right:
        return "right"
    return "search"

# Simulated sensor pairs along a winding line.
for left, right in [(True, True), (True, False), (True, True), (False, True), (False, False)]:
    print(f"left={left!s:5} right={right!s:5} → {line_follower(left, right)}")
```

## Path planning: the shortest path on a map

If the robot knows the map, it can plan the shortest path in advance. On a grid map, **breadth-first search** (BFS) is the simplest method: starting from the start, it first checks the cells 1 step away, then those 2 steps away, and so on – so the first time it reaches the goal, it is guaranteed to be via a shortest path. It keeps the cells still to be examined in a **queue** (`deque`).

```python run
from collections import deque

MAP = [
    "##########",
    "#S...#...#",
    "#.##.#.#.#",
    "#.#..#.#.#",
    "#.#.##.#.#",
    "#......#G#",
    "##########",
]

def find(grid: list[str], mark: str) -> tuple[int, int]:
    """Find the position of a mark (S or G) on the map."""
    for r, row in enumerate(grid):
        if mark in row:
            return r, row.index(mark)
    raise ValueError(f"No {mark} on the map")

def shortest_path(grid: list[str]) -> list[tuple[int, int]] | None:
    """Find the shortest path from S to G with breadth-first search (BFS)."""
    start, goal = find(grid, "S"), find(grid, "G")
    came_from = {start: None}       # where we reached each cell from
    queue = deque([start])
    while queue:
        cell = queue.popleft()
        if cell == goal:
            # Reconstruct the path from the goal back to the start.
            path = []
            while cell is not None:
                path.append(cell)
                cell = came_from[cell]
            return path[::-1]
        r, c = cell
        for dr, dc in [(-1, 0), (0, 1), (1, 0), (0, -1)]:
            neighbour = (r + dr, c + dc)
            if grid[neighbour[0]][neighbour[1]] != "#" and neighbour not in came_from:
                came_from[neighbour] = cell
                queue.append(neighbour)
    return None                     # no path

path = shortest_path(MAP)
print("Number of steps:", len(path) - 1)

# Draw the path onto the map.
drawing = [list(row) for row in MAP]
for r, c in path[1:-1]:
    drawing[r][c] = "*"
print("\n".join("".join(row) for row in drawing))
```

BFS builds on the **queue** data structure and the **dictionary** from topic 10. Real robots often use the **A\*** (A-star) algorithm, which uses an estimate (e.g. the distance to the goal) to examine fewer cells but still gives the shortest path.

## Summary

- A **controller** decides based on the error; a **proportional (P)** controller is gentler than on-off; in practice **PID** is used.
- **Line following** can be solved with a simple rule table.
- On a grid map, **breadth-first search** (BFS) gives the shortest path; on bigger maps **A\*** is faster.

## Lesson exercise: The shortest path cell by cell

In the practice task we only looked for the **number** of steps. Now you must give the **path** itself! Write a `find_path(grid)` function that uses breadth-first search to find the shortest path from cell `S` to cell `G`, and returns the list of `(row, col)` pairs from `S` to `G` (both included).

- It may only step up, down, left and right; `#` is a wall. The grid is surrounded by walls.
- If there is no path, the result is `None`.
- Tip: during the search, record in a dictionary where you came from to each cell (`previous[neighbour] = cell`), then build the path by stepping back from the goal.

```python starter required
from collections import deque


def find_path(grid):
    # find the start and goal cells, then breadth-first search
    return []


GRID = [
    "#######",
    "#S..#.#",
    "#.#.#.#",
    "#.#...#",
    "#...#G#",
    "#######",
]
print(find_path(GRID))
```

<details>
<summary>Solution</summary>

```python solution
from collections import deque


def find_path(grid):
    for r, line in enumerate(grid):
        for c, cell in enumerate(line):
            if cell == "S":
                start = (r, c)
            elif cell == "G":
                goal = (r, c)
    previous = {start: None}    # where we arrived at each cell from
    queue = deque([start])
    while queue:
        cell = queue.popleft()
        if cell == goal:
            # Build the path by stepping backwards
            path = []
            while cell is not None:
                path.append(cell)
                cell = previous[cell]
            return path[::-1]
        r, c = cell
        for nb in ((r - 1, c), (r + 1, c), (r, c - 1), (r, c + 1)):
            if nb not in previous and grid[nb[0]][nb[1]] != "#":
                previous[nb] = cell
                queue.append(nb)
    return None


GRID = [
    "#######",
    "#S..#.#",
    "#.#.#.#",
    "#.#...#",
    "#...#G#",
    "#######",
]
print(find_path(GRID))
```

</details>

```python test
def good_path(grid, path, length):
    assert isinstance(path, list) and len(path) == length, f"The shortest path has {length} cells (S and G included)."
    assert grid[path[0][0]][path[0][1]] == "S" and grid[path[-1][0]][path[-1][1]] == "G", "The path must start at S and end at G."
    for (r1, c1), (r2, c2) in zip(path, path[1:]):
        assert abs(r1 - r2) + abs(c1 - c2) == 1, "The path must use neighbouring cells (only up, down, left, right)."
    for r, c in path:
        assert grid[r][c] != "#", "The path cannot go through a wall."

GRID = ["#######", "#S..#.#", "#.#.#.#", "#.#...#", "#...#G#", "#######"]
good_path(GRID, find_path(GRID), 8)
good_path(["####", "#SG#", "####"], find_path(["####", "#SG#", "####"]), 2)
assert find_path(["#####", "#S#G#", "#####"]) is None, "If there is no path, return None."
BIG = ["#########", "#S......#", "#######.#", "#G......#", "#########"]
good_path(BIG, find_path(BIG), 15)
```
