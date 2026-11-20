---
title: Deeper – Differential Equations by Simulation
summary: Comparing the accuracy of the Euler, Heun and Runge–Kutta methods, a skydiver's terminal velocity by simulation and by formula, and the SIR epidemic model as a system of differential equations – the peak, herd immunity and how to think about the model.
minutes: 40
---

## What you will learn in this lesson

- why real simulation programs don't use Euler's method, and what they use instead,
- how to get an **equilibrium value** (terminal velocity) from a differential equation without solving it,
- how a **system of equations** models an epidemic, and what can be learned from it.

## 1. Euler, Heun, Runge–Kutta: which is more accurate?

Euler's method steps along the tangent – but the tangent's slope is only true at the **beginning** of the step. Better methods "taste" the slope at several places:

- **Heun** (improved Euler): computes the slope at the beginning and at the estimated endpoint, and steps with the **average** of the two.
- **Runge–Kutta (RK4)**: computes four slopes (at the beginning, twice in the middle, at the end), and steps with their weighted average – like a small Simpson's rule.

```python run
# Comparing Euler, Heun and Runge–Kutta (RK4): y' = y, y(0) = 1, the exact value is y(1) = e
import math

def f(t, y):
    return y

def euler(h):
    y = 1.0
    for i in range(round(1 / h)):
        y += h * f(i * h, y)                              # one step along the tangent
    return y

def heun(h):
    y = 1.0
    for i in range(round(1 / h)):
        t = i * h
        k1 = f(t, y)
        k2 = f(t + h, y + h * k1)                         # slope at the estimated endpoint
        y += h * (k1 + k2) / 2                            # step with the average of the two slopes
    return y

def rk4(h):
    y = 1.0
    for i in range(round(1 / h)):
        t = i * h
        k1 = f(t, y)
        k2 = f(t + h / 2, y + h / 2 * k1)
        k3 = f(t + h / 2, y + h / 2 * k2)
        k4 = f(t + h, y + h * k3)
        y += h * (k1 + 2 * k2 + 2 * k3 + k4) / 6          # weighted average of four slopes
    return y

print(f"{'h':>6} | {'Euler error':>12} | {'Heun error':>11} | {'RK4 error':>10}")
for h in [0.1, 0.01, 0.001]:
    print(f"{h:>6} | {abs(euler(h) - math.e):>12.1e} | {abs(heun(h) - math.e):>11.1e} | {abs(rk4(h) - math.e):>10.1e}")
```

If we reduce the step size to **a tenth**, Euler's error falls to a $10$th, Heun's to a $100$th, and RK4's to a $10\,000$th: their errors are of order $h$, $h^2$ and $h^4$ respectively. RK4 is four times as much work per step, but with $h = 0.1$ it's more accurate than Euler with $h = 0.001$ (that is, with a hundred times as many steps). Engineering software (MATLAB `ode45`, Python `scipy.integrate.solve_ivp`) therefore uses such higher-order methods, which also adjust the step size automatically.

## 2. A skydiver's terminal velocity

When falling, gravity accelerates and air resistance – which at high speed is proportional to the **square** of the speed – brakes: $v' = g - c v^2$. Let's simulate it with Euler's method:

```python run
# A skydiver's fall with air resistance: v' = g − c·v², the speed tends to the terminal velocity
import math

g, c = 9.81, 0.0039                     # c = drag coefficient / mass (1/m), falling belly-down
v, t, h = 0.0, 0.0, 0.01
for target in [1, 5, 10, 20, 30]:
    while t < target - 1e-9:
        v += h * (g - c * v * v)        # Euler step
        t += h
    print(f"t = {target:>2} s: v = {v:5.1f} m/s = {v * 3.6:5.0f} km/h")
print(f"terminal velocity (v' = 0): √(g/c) = {math.sqrt(g / c):.1f} m/s")
```

The speed doesn't grow forever, it tends to a **terminal velocity**. We can get it without solving the equation: when the speed no longer changes, $v' = 0$, so $g = c v^2$, that is, $v_\infty = \sqrt{g/c}$. This is the **equilibrium** (steady-state) solution – often the most important piece of information from a model (e.g. the final temperature of a cooling object, the final voltage of a charging capacitor).

This equation actually has a formula too: $v(t) = v_\infty \tanh\left(\frac{g t}{v_\infty}\right)$. With the slider you can change the air resistance (body position):

```plot
title: Falling speed (m/s) as a function of time (s)
x: 0, 30
y: 0, 80
param: c = 0.0039, 0.001, 0.01, 0.0001
f: sqrt(9.81/c)*tanh(sqrt(9.81*c)*x) # v(t)
dash: sqrt(9.81/c) # terminal velocity
```

## 3. The SIR epidemic model

We split the population into three groups: **susceptible** ($S$), **infected** ($I$) and **recovered** ($R$), as proportions ($S + I + R = 1$). Their change is described by three coupled equations:

$$
S' = -\beta S I, \qquad I' = \beta S I - \gamma I, \qquad R' = \gamma I.
$$

The term $\beta S I$ is the number of new infections arising from encounters (the more susceptible **and** infected people there are, the more), and $\gamma I$ is the number recovering. Such a system usually has no formula, but Euler's method works the same way, just with three variables at once:

```python run
# The SIR epidemic model: S' = −β·S·I, I' = β·S·I − γ·I, R' = γ·I (proportions, in days)
beta, gamma = 0.3, 0.1                  # infection and recovery rates; R₀ = β/γ = 3
S, I, R, h = 0.999, 0.001, 0.0, 0.1
peak_I, peak_day = 0.0, 0
for step in range(1, 1201):             # 120 days in steps of 0.1 day
    new_infected = beta * S * I
    recovered = gamma * I
    S, I, R = S - h * new_infected, I + h * (new_infected - recovered), R + h * recovered
    if I > peak_I:
        peak_I, peak_day = I, step * h
    if step % 200 == 0:
        print(f"day {step * h:>3.0f}: susceptible {S:.3f}, infected {I:.3f}, recovered {R:.3f}")
print(f"peak: on day {peak_day:.0f}, {peak_I:.1%} of the population is infected at the same time")
```

What can we learn from it?

- The epidemic spreads if $I' > 0$, that is, $\beta S > \gamma$. At the start $S \approx 1$, so the condition is $R_0 = \frac{\beta}{\gamma} > 1$ – this is the famous **basic reproduction number**.
- The **peak** is where $I' = 0$, that is, $S = \frac{1}{R_0} = \frac13$. This is the **herd immunity threshold**: if $1 - \frac{1}{R_0} \approx 67\%$ of the population is already protected, the epidemic dies out by itself.
- The epidemic continues after the peak ("overshoot"), and in the end about $6\%$ of the population never gets infected.

The same structure describes many other processes: the spread of a rumour or a computer virus on a network, or the adoption of a new product. The model simplifies (everyone meets everyone equally, no vaccination, no reinfection) – real epidemic models refine this, but this one already shows the essence.

## Summary

- Euler: error $\sim h$; Heun: $\sim h^2$; RK4: $\sim h^4$ – a higher-order method is more accurate with fewer steps.
- Equilibrium solution: from $y' = 0$, without solving the differential equation (terminal velocity: $\sqrt{g/c}$).
- SIR model: $R_0 = \beta/\gamma$; the peak is at $S = 1/R_0$; herd immunity: $1 - 1/R_0$.

## Lesson exercise

```quiz required
? Euler's method: $y' = y$, $y(0) = 1$, $h = 0.5$. What is $y_1$?
= 1,5
= 1.5
! $y_1 = y_0 + h \cdot y_0 = 1 + 0.5 \cdot 1 = 1.5$.

? The error of RK4 is proportional to $h^4$. How many times smaller does the error become if the step size is halved?
= 16
! $2^4 = 16$.

? What is the terminal velocity (m/s) if $v' = 10 - 0.004\,v^2$?
= 50
! $v' = 0$: $v = \sqrt{10 / 0.004} = \sqrt{2500} = 50$.

? In the SIR model $\beta = 0.4$ and $\gamma = 0.2$. What is the basic reproduction number $R_0$?
= 2
! $R_0 = \frac{\beta}{\gamma} = \frac{0.4}{0.2} = 2$.

? Give the solution of the initial value problem $y' = 2y$, $y(0) = 3$!
fn: x -> 3*e^(2*x)
domain: 0, 1
! Separable: $y = C e^{2x}$, and $y(0) = C = 3$.
```
