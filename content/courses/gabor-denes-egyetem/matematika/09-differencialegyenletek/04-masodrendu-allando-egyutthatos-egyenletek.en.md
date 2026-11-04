---
title: Second-Order Equations with Constant Coefficients
summary: The characteristic equation, the three types of solutions, damped oscillation, and briefly the inhomogeneous case and resonance.
minutes: 35
---

## What you will learn

- to solve $y'' + a y' + b y = 0$ with the **characteristic equation**,
- the **three cases** (two real roots, a double root, a complex pair),
- to describe a **damped oscillation**,
- what **resonance** means.

## The characteristic equation

We look for solutions of $y'' + a y' + b y = 0$ ($a, b$ constants) in the form $y = e^{\lambda x}$. Substituting gives $e^{\lambda x}(\lambda^2 + a\lambda + b) = 0$, and since $e^{\lambda x} \neq 0$:

$$
\lambda^2 + a\lambda + b = 0 \qquad \text{(characteristic equation).}
$$

Depending on the roots, the general solution is:

| Roots                                         | General solution                                            | Behaviour                     |
| --------------------------------------------- | ----------------------------------------------------------- | ----------------------------- |
| two distinct real: $\lambda_1 \neq \lambda_2$ | $C_1 e^{\lambda_1 x} + C_2 e^{\lambda_2 x}$                 | exponential                   |
| double real: $\lambda$                        | $(C_1 + C_2 x)\,e^{\lambda x}$                              | exponential (borderline case) |
| complex: $\alpha \pm \beta i$                 | $e^{\alpha x}\big(C_1\cos(\beta x) + C_2\sin(\beta x)\big)$ | oscillation                   |

The two constants are determined by two initial conditions ($y(0)$ and $y'(0)$).

**Example.** $y'' - 3y' + 2y = 0$, $y(0) = 0$, $y'(0) = 1$. The characteristic equation is $\lambda^2 - 3\lambda + 2 = 0$ with roots $1$ and $2$, so $y = C_1 e^x + C_2 e^{2x}$. The conditions give $C_1 + C_2 = 0$, $C_1 + 2C_2 = 1$, so $C_2 = 1$, $C_1 = -1$: $y = e^{2x} - e^x$.

**Example.** $y'' + 4y = 0$: $\lambda^2 + 4 = 0$, $\lambda = \pm 2i$ ($\alpha = 0$, $\beta = 2$), so $y = C_1\cos(2x) + C_2\sin(2x)$: undamped oscillation.

## Damped oscillation

The displacement of a mass on a spring, slowed by friction, satisfies $m y'' + c y' + k y = 0$. Rewritten:

$$
y'' + 2\delta\,y' + \omega_0^2\,y = 0, \qquad \delta = \frac{c}{2m}, \quad \omega_0 = \sqrt{\frac{k}{m}}.
$$

If $\delta < \omega_0$ (**underdamping**), the roots are $-\delta \pm \omega i$, where $\omega = \sqrt{\omega_0^2 - \delta^2}$. With the initial conditions $y(0) = 1$, $y'(0) = 0$:

$$
y(t) = e^{-\delta t}\left(\cos(\omega t) + \frac{\delta}{\omega}\sin(\omega t)\right).
$$

```plot
title: Damped oscillation: y(0) = 1, y'(0) = 0
x: 0, 15
y: -1.2, 1.2
param: w0 = 2, 1, 4, 0.1
param: d = 0.2, 0, 0.9, 0.05
f: e^(-d x) (cos(sqrt(w0^2 - d^2) x) + d/sqrt(w0^2 - d^2) sin(sqrt(w0^2 - d^2) x)) # y(t)
dash: e^(-d x) # envelope
dash: -e^(-d x) # envelope
value: ω = sqrt(w0^2 - d^2)
value: period = 2pi/sqrt(w0^2 - d^2)
```

(On the sliders, $w0$ is $\omega_0$ and $d$ is $\delta$.) The amplitude decreases along the envelope $e^{-\delta t}$; with $\delta = 0$ the oscillation is undamped. If $\delta = \omega_0$ (**critical damping**), the mass returns without oscillating, as fast as possible: this is what car shock absorbers and measuring instruments use. With $\delta > \omega_0$ (**overdamping**) it returns more slowly, also without oscillating.

The same equation describes the electrical **RLC circuit** ($L q'' + R q' + \frac{1}{C} q = 0$).

## The inhomogeneous case and resonance

The solution of $y'' + a y' + b y = f(x)$ is $y = y_h + y_p$, where $y_p$ is often found with a **trial function** resembling the right-hand side (e.g. $f = $ polynomial → polynomial, $f = e^{cx}$ → $Ae^{cx}$, $f = \sin(\Omega x)$ → $A\cos(\Omega x) + B\sin(\Omega x)$).

If an undamped oscillating system is driven at its own frequency ($y'' + \omega_0^2 y = \sin(\omega_0 t)$), the displacement grows without bound: this is **resonance** (to be avoided when designing bridges and buildings, and exactly what tunes a radio).

## Summary

- $y'' + ay' + by = 0$: characteristic equation $\lambda^2 + a\lambda + b = 0$.
- Real roots: exponentials; double root: $(C_1 + C_2x)e^{\lambda x}$; complex roots: $e^{\alpha x}(\dots\cos\beta x + \dots\sin\beta x)$.
- Damped oscillation: amplitude along $e^{-\delta t}$, angular frequency $\sqrt{\omega_0^2 - \delta^2}$.

## Lesson exercise

```quiz required
? What is the general solution of $y'' - 5y' + 6y = 0$?
- $C_1 e^{-2x} + C_2 e^{-3x}$
+ $C_1 e^{2x} + C_2 e^{3x}$
- $C_1 \cos(2x) + C_2 \sin(3x)$
- $(C_1 + C_2 x)e^{5x}$
! $\lambda^2 - 5\lambda + 6 = (\lambda - 2)(\lambda - 3)$.

? Solve: $y'' + 4y = 0$, $y(0) = 1$, $y'(0) = 0$.
fn: x -> cos(2x)

? Solve: $y'' - 3y' + 2y = 0$, $y(0) = 0$, $y'(0) = 1$.
fn: x -> e^(2x) - e^x
domain: -2, 1

? Solve: $y'' + 2y' + y = 0$, $y(0) = 1$, $y'(0) = 0$.
fn: x -> (1 + x) e^(-x)
! Double root: $\lambda = -1$, so $y = (C_1 + C_2 x)e^{-x}$.

? The solutions of $y'' + 2y' + 5y = 0$ are damped oscillations. What is their angular frequency ($\beta$)?
= 2
! $\lambda = -1 \pm 2i$.

? A spring system has $\delta = 3$ and $\omega_0 = 3$. What is the motion like?
- underdamped oscillation
+ critically damped: returns without oscillating, as fast as possible
- overdamped
- undamped oscillation
```
