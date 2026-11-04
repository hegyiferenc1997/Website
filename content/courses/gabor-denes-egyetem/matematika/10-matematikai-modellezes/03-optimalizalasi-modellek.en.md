---
title: Optimization Models
summary: Extremum problems with derivatives, formulating a linear program, the graphical solution with two variables, and the optimum at a vertex.
minutes: 30
---

## What you will learn

- to formulate an **optimization problem** (objective function, constraints),
- to solve a one-variable problem with **derivatives**,
- to formulate and graphically solve a **linear programming** problem,
- why the optimum should be sought at the **vertices**.

## Parts of an optimization problem

- **Decision variables:** what we can choose (e.g. production quantities).
- **Objective function:** what we want to maximize (profit) or minimize (cost, time, material).
- **Constraints:** the limits (resources, capacity, non-negativity).

**One variable: with derivatives.** A rectangle fenced with $100$ m of fence has area $T(x) = x(50 - x)$. $T'(x) = 50 - 2x = 0$ when $x = 25$: the largest area belongs to the square, $625\ \mathrm{m}^2$. (See the topic on differential calculus.)

## Linear programming

If the objective function and every constraint are **linear**, we have a **linear programming** (LP) problem.

**Example.** A plant makes two products. One unit of A earns $2$, one unit of B $3$ thousand HUF profit. Machine time requires $x + y \leq 4$, labour time $x + 3y \leq 6$ (in hours), and $x, y \geq 0$. Maximize $z = 2x + 3y$!

The constraints cut out a polygon in the plane: the **feasible region**. The **level lines** of the objective ($2x + 3y = z$) are parallel lines; we push them as far as they still touch the region.

```plot
title: Linear programming graphically
x: -0.5, 6.5
y: -0.5, 4.5
param: z = 6, 0, 14, 0.5
area: min(4 - x, (6 - x)/3) @ 0, 4 # feasible region
f: 4 - x # machine time: x + y = 4
f: (6 - x)/3 # labour time: x + 3y = 6
dash: (z - 2x)/3 # level line: 2x + 3y = z
point: 0, 2 # (0; 2): z = 6
point: 3, 1 # (3; 1): z = 9
point: 4, 0 # (4; 0): z = 8
```

(The shaded part is the feasible region; the number shown is just its area.) Increase $z$: the level line leaves the region last at $z = 9$, at the vertex $(3; 1)$.

**Fundamental theorem of LP:** if there is an optimum, there is one at a **vertex** of the feasible region. So it is enough to check the vertices:

| Vertex   | $z = 2x + 3y$ |
| -------- | ------------- |
| $(0; 0)$ | $0$           |
| $(4; 0)$ | $8$           |
| $(3; 1)$ | $\mathbf{9}$  |
| $(0; 2)$ | $6$           |

With many variables (even millions), the **simplex method** walks from vertex to vertex, always in an improving direction. LP is used in production planning, transportation and scheduling problems, and even in network traffic routing.

```python run
from itertools import combinations
# Solving the LP by checking the vertices: max 2x + 3y, x + y <= 4, x + 3y <= 6, x >= 0, y >= 0
# Every constraint in the form a·x + b·y <= c
constraints = [(1, 1, 4), (1, 3, 6), (-1, 0, 0), (0, -1, 0)]

def feasible(x, y):
    return all(a * x + b * y <= c + 1e-9 for a, b, c in constraints)

best = None
for (a1, b1, c1), (a2, b2, c2) in combinations(constraints, 2):
    det = a1 * b2 - a2 * b1
    if det == 0:
        continue
    x = (c1 * b2 - c2 * b1) / det   # Cramer's rule: intersection of two lines
    y = (a1 * c2 - a2 * c1) / det
    if feasible(x, y):
        z = 2 * x + 3 * y
        print(f"vertex ({x:.1f}; {y:.1f}): z = {z:.1f}")
        if best is None or z > best[0]:
            best = (z, x, y)
print("optimum:", best)
```

## Summary

- Optimization: decision variables, objective function, constraints.
- One variable: $f'(x) = 0$ and check the endpoints.
- LP: linear objective and constraints; the optimum is at a vertex; graphically for two variables, with the simplex method for many.

## Lesson exercise

```quiz required
? What is the maximum of $z = 2x + 3y$ in the lesson's example ($x + y \leq 4$, $x + 3y \leq 6$, $x, y \geq 0$)?
= 9

? At which point is it attained?
- $(4; 0)$
- $(0; 2)$
+ $(3; 1)$
- $(2; 2)$

? With the same constraints, what is the maximum of $z = 3x + 2y$?
= 12
! Check the vertices: $12$ at $(4; 0)$, $11$ at $(3; 1)$.

? Where is the optimum of a linear programming problem (with a bounded feasible region)?
- always in the middle of the region
+ at (at least) one vertex
- where the derivative of the objective is zero
- always at the origin

? At most how many square metres can a rectangular area fenced with $100$ m of fence have?
= 625
```
