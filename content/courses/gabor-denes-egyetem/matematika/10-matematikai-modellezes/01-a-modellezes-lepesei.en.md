---
title: The Steps of Modelling
summary: How a real problem becomes a mathematical model: assumptions, variables, solution, interpretation and validation, units and estimation.
minutes: 25
---

## What you will learn

- the steps of the **modelling cycle**,
- how to choose **variables** and **assumptions**,
- how to check a model with **units** and **estimation**,
- a simple **linear model** for decision making.

## The modelling cycle

A **mathematical model** is a simplified description of reality with formulas. Every topic of this semester was such a tool: functions, derivatives, integrals and differential equations. The steps of modelling:

1. **Understand the problem:** what do we want to know, and what will we use it for?
2. **Assumptions and variables:** what matters and what can be neglected (e.g. "air resistance is negligible")? What are the inputs and the output, in what units?
3. **Write down the mathematical model:** an equation, a function, a system of inequalities, a differential equation…
4. **Solve it:** on paper or with a program (numerically).
5. **Interpret:** what does the result mean in reality?
6. **Validate:** does it agree with measurements, is the order of magnitude sensible? If not, go back to step 2 and refine.

> "All models are wrong, but some are useful." (George E. P. Box)

## Checking with units and estimation

- **Dimensional check:** both sides of a formula must have the same unit, and only quantities with the same unit can be added. If a distance formula were $s = v t^2$, its unit would be $\frac{\mathrm{m}}{\mathrm{s}} \cdot \mathrm{s}^2 = \mathrm{m \cdot s}$, which is not a length, so the formula is certainly wrong.
- **In an exponent, or inside $\sin$ or $\ln$,** only a dimensionless number can stand: hence $e^{-t/\tau}$ ($\tau$ a time) or $e^{-kt}$ ($k$ in $\frac{1}{\mathrm{s}}$).
- **Order-of-magnitude (Fermi) estimate:** with rough but sensible numbers we check that the result is not absurd. For example: "How much data does a university of $10\,000$ people upload in a day?"

## A linear model: which fare is better?

Two taxi companies charge for $x$ km: **A**: $500 + 300x$ HUF, **B**: $1000 + 250x$ HUF. The intersection of the two lines is the **break-even point**: $500 + 300x = 1000 + 250x$, that is, $x = 10$ km. For shorter trips A is cheaper, for longer ones B.

```plot
title: Two fares and the break-even point (x km, y HUF)
x: 0, 20
y: 0, 7000
param: a = 300, 200, 400, 10
param: b = 250, 150, 350, 10
f: 500 + a x # fare A
f: 1000 + b x # fare B
value: break-even point (km) = 500/(a - b)
```

The sliders change the per-kilometre fares. If $a \leq b$, the lines do not cross in the positive range (the break-even point is negative or does not exist): then A is always cheaper. The model's **assumption** is that the fare depends linearly on distance (no waiting fee, traffic jams…).

## Summary

- Modelling: problem → assumptions, variables → model → solution → interpretation → validation, and repeat.
- Unit check: both sides must agree; exponents and function arguments are dimensionless.
- The intersection of linear models is a decision boundary (break-even point).

## Lesson exercise

```quiz required
? Which is the correct order of the modelling cycle?
- solution → assumptions → validation → interpretation
+ assumptions and variables → model → solution → interpretation → validation
- validation → model → assumptions → solution
- model → solution → assumptions → validation

? Fare A is $500 + 300x$ and fare B is $1000 + 250x$ HUF. At how many km are the two fares equal?
= 10

? With the same fares, how much do we pay with B for a $16$ km trip (in HUF)?
= 5000

? Which formula can be correct if $s$ is distance (m), $v$ velocity (m/s), $a$ acceleration (m/s²) and $t$ time (s)?
- $s = v t^2$
- $s = a t$
+ $s = v t + \frac{1}{2} a t^2$
- $s = v + a t$
! Every term must be in m.

? In the model $N(t) = N_0 e^{-kt}$, $t$ is given in seconds. What is the unit of $k$?
- s
+ 1/s
- m/s
- it has no unit, and neither does $t$
! The exponent is a dimensionless number.
```
