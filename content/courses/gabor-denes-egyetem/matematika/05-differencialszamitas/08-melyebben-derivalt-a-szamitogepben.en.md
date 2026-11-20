---
title: Deeper – The Derivative Inside the Computer
summary: Numerical differentiation with forward and central differences, and why it breaks down when the step is too small; gradient descent (how neural networks learn) and the effect of the step size; and the optimal tin can by trial and by differentiation.
minutes: 40
---

## What you will learn in this lesson

- how the machine **approximates** the derivative when there's no formula, and why "the smaller $h$, the better" isn't true,
- what **gradient descent** is, and why the derivative is the engine of machine learning,
- to solve a real **optimisation** problem in two ways: by trial and by differentiation.

## 1. The numerical derivative – and the trap of a too-small h

The definition of the derivative is a limit: $f'(x) = \lim\limits_{h \to 0} \dfrac{f(x + h) - f(x)}{h}$. The machine can't take a limit, but it can compute the difference quotient with a **small** $h$. Two variants:

$$
\text{forward: } \frac{f(x + h) - f(x)}{h}, \qquad \text{central: } \frac{f(x + h) - f(x - h)}{2h}.
$$

Let's try it for $f(x) = \sin x$ at the point $x = 1$, where the exact derivative is $\cos 1$:

```python run
# Numerical derivative: forward and central difference, f(x) = sin x, x = 1 (exact value: cos 1)
import math

exact = math.cos(1)
print(f"{'h':>8} | {'forward: (f(x+h) − f(x)) / h':>28} | {'central: (f(x+h) − f(x−h)) / 2h':>32}")
for k in [1, 2, 4, 6, 8, 10, 12]:
    h = 10 ** -k
    forward = (math.sin(1 + h) - math.sin(1)) / h
    central = (math.sin(1 + h) - math.sin(1 - h)) / (2 * h)
    print(f"{h:>8.0e} | error {abs(forward - exact):>22.1e} | error {abs(central - exact):>26.1e}")
```

Two surprising things show up:

- The **central** difference is much more accurate: its error is proportional to $h^2$, the forward difference's only to $h$. (At $h = 0.01$: $10^{-5}$ versus $10^{-3}$.) The central difference is "symmetric", so the first error term cancels – this will become clear with Taylor polynomials (topic 7).
- If $h$ is chosen **too small**, the error **grows** again! At $10^{-12}$ it's already worse than at $10^{-4}$. The reason is floating-point rounding: in the difference of two nearly equal numbers ($\sin(1 + h) - \sin 1$) most of the significant digits are lost, and this is then divided by a very small number. The best $h$ is a "golden mean" (for the central difference about $10^{-5}$–$10^{-6}$).

**Analogy:** you estimate a car's speed from two photos. If an hour passed between them, the estimate is inaccurate (it sped up and slowed down meanwhile). If a millionth of a second passed, you can no longer measure the car's position on the two photos accurately enough. The right interval is somewhere in between.

## 2. Gradient descent: down the slope

The derivative tells you **which way** the function grows. If we're looking for the minimum, let's step in the **opposite** direction: $x_{\text{new}} = x - \eta \cdot f'(x)$, where $\eta$ is the step size (the "learning rate" in machine learning). Let's find the minimum of $f(x) = (x - 3)^2 + 1$!

```python run
# Gradient descent: step against the derivative – this is how neural networks learn too
def f(x):
    return (x - 3) ** 2 + 1

def df(x):
    return 2 * (x - 3)                   # the derivative: which way and how steeply f grows

for learning_rate in [0.1, 0.5, 1.1]:
    x = 0.0
    for _ in range(20):
        x = x - learning_rate * df(x)    # one step down the slope
    print(f"step size {learning_rate}: after 20 steps x = {x:12.4f}, f(x) = {f(x):.4g}")
```

- $\eta = 0.1$: approaches the minimum ($x = 3$) nicely, but slowly.
- $\eta = 0.5$: for this parabola it jumps there in exactly one step.
- $\eta = 1.1$: it **overshoots** and bounces further and further away – the method blows up.

This is exactly how **neural networks** learn: there's an "error function" (how wrong the network's answers are) depending on millions of parameters, and the machine moves every parameter a little in the direction opposite to the derivative (gradient) of the error. Choosing the learning rate is one of the most important settings there too: too small → slow learning, too large → the learning falls apart.

## 3. The optimal tin can

The material cost of a $1$ litre ($V = 1000\ \text{cm}^3$) cylindrical can is proportional to its surface area. For which radius is the surface area **smallest**?

$$
V = \pi r^2 h \;\Rightarrow\; h = \frac{V}{\pi r^2}, \qquad A(r) = 2\pi r^2 + 2\pi r h = 2\pi r^2 + \frac{2V}{r}.
$$

Differentiating: $A'(r) = 4\pi r - \dfrac{2V}{r^2} = 0$, from which $r = \sqrt[3]{\dfrac{V}{2\pi}}$. Let's compare it with "brute force":

```python run
# The optimal tin can: 1 litre (1000 cm³) volume, minimal surface area (material cost)
import math

V = 1000.0
def surface(r):
    h = V / (math.pi * r ** 2)           # the height is determined by the volume
    return 2 * math.pi * r ** 2 + 2 * math.pi * r * h

# 1) "brute force": we try many radii
best = min((surface(r / 100), r / 100) for r in range(100, 1500))
print(f"by trial:            r ≈ {best[1]:.2f} cm, A ≈ {best[0]:.1f} cm²")

# 2) by differentiation: A'(r) = 4πr − 2V/r² = 0  →  r = (V / 2π)^(1/3)
r = (V / (2 * math.pi)) ** (1 / 3)
print(f"by differentiation:  r = {r:.2f} cm, h = {V / (math.pi * r ** 2):.2f} cm, A = {surface(r):.1f} cm²")
```

The two methods give the same: $r \approx 5.42$ cm, and – this is the nice surprise – $h = 2r$, that is, the ideal can is **as tall as it is wide**. Trial works here too, but it's cheap only for one variable; if 10 dimensions of a product have to be optimised, only derivative (gradient) based methods are feasible. (Real tin cans are taller, because the top and bottom are made of thicker material, and fitting on a shelf matters too – the model's assumptions always count.)

```plot
title: The can's surface area as a function of the radius (V = 1000 cm³)
x: 1, 15
y: 0, 2000
f: 2*pi*x^2 + 2000/x # A(r)
point: 5.42, 553.6 # minimum
```

## Summary

- Numerical derivative: the central difference ($h^2$ error) is better than the forward difference ($h$ error); with a too-small $h$ the rounding error spoils it.
- Gradient descent: $x \leftarrow x - \eta f'(x)$; with too large a step size it blows up. This is the basis of machine learning.
- Extremum problem: write the objective function with one variable, differentiate, and solve $f'(x) = 0$; the ideal cylinder's height equals its diameter.

## Lesson exercise

```quiz required
? Compute the central difference for $f(x) = x^2$ at $x = 3$ with $h = 0.1$: $\dfrac{f(3.1) - f(2.9)}{0.2}$
= 6
! $\frac{9.61 - 8.41}{0.2} = 6$ – for a parabola the central difference is exact!

? Gradient descent: $f(x) = x^2$, $x_0 = 4$, step size $\eta = 0.25$. What is $x_1$?
= 2
! $f'(4) = 8$, $x_1 = 4 - 0.25 \cdot 8 = 2$.

? Differentiate: $A(r) = 2\pi r^2 + \dfrac{2000}{r}$
fn: x -> 4*pi*x - 2000/x^2
domain: 1, 10

? Why does the error of the numerical derivative grow if $h$ is chosen very small (e.g. $10^{-12}$)?
- because the difference quotient is then undefined
+ because when subtracting two nearly equal numbers, floating-point rounding loses the significant digits
- because the function isn't differentiable
- because the central difference only works for large $h$
! And the rounding error is then divided by a very small number.

? For a given volume, the surface area of a closed cylindrical can is minimal when its height is how many times the radius?
= 2
! With $r = \sqrt[3]{V / (2\pi)}$, $h = 2r$.
```
