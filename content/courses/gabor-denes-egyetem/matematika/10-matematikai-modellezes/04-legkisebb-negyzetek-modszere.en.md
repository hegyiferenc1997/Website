---
title: Fitting Data – the Method of Least Squares
summary: Fitting a regression line to measured data, minimizing the sum of squared errors, the normal equations, and fitting an exponential model with logarithms.
minutes: 30
---

## What you will learn

- what it means to **fit** a line to measured data,
- why we minimize the **sum of squared errors**,
- the **formula** of the regression line,
- how to fit an **exponential** model.

## The problem

We have measurements: $(x_1; y_1), \dots, (x_n; y_n)$. We look for the line $y = mx + b$ that fits "best". The **deviation** (residual) of each point is $y_i - (mx_i + b)$. The **method of least squares** (Gauss) chooses the line for which the **sum of squared errors**

$$
S(m, b) = \sum_{i=1}^{n} \big(y_i - (m x_i + b)\big)^2
$$

is smallest. (Squaring means positive and negative deviations do not cancel, large deviations count more, and the minimum can be found with derivatives.)

Try to find the best line by hand! For the five measurements below, the minimum is $S = 1.9$.

```plot
title: Fitting a line to five measurements
x: 0, 6
y: 0, 8
param: m = 0.5, -1, 2, 0.05
param: b = 2, -1, 4, 0.05
f: m x + b # y = mx + b
point: 1, 2
point: 2, 3
point: 3, 5
point: 4, 4
point: 5, 6
value: S (sum of squared errors) = (2 - m - b)^2 + (3 - 2m - b)^2 + (5 - 3m - b)^2 + (4 - 4m - b)^2 + (6 - 5m - b)^2
```

## The formula of the regression line

At the minimum of $S$ both partial derivatives are zero ($\frac{\partial S}{\partial m} = 0$, $\frac{\partial S}{\partial b} = 0$). Solving these **normal equations** gives:

$$
m = \frac{\sum (x_i - \bar x)(y_i - \bar y)}{\sum (x_i - \bar x)^2}, \qquad b = \bar y - m \bar x,
$$

where $\bar x$ and $\bar y$ are the means. Consequence: the regression line always passes through the **mean point** $(\bar x; \bar y)$.

**Example** for the data above: $\bar x = 3$, $\bar y = 4$. The sum of the products is $(-2)(-2) + (-1)(-1) + 0 \cdot 1 + 1 \cdot 0 + 2 \cdot 2 = 9$, the sum of the squares $4 + 1 + 0 + 1 + 4 = 10$. So $m = 0.9$ and $b = 4 - 0.9 \cdot 3 = 1.3$.

```python run
# Regression line with the formulas (numpy.polyfit(x, y, 1) would give the same)
xs = [1, 2, 3, 4, 5]
ys = [2, 3, 5, 4, 6]
n = len(xs)
xa, ya = sum(xs) / n, sum(ys) / n
m = sum((x - xa) * (y - ya) for x, y in zip(xs, ys)) / sum((x - xa) ** 2 for x in xs)
b = ya - m * xa
S = sum((y - (m * x + b)) ** 2 for x, y in zip(xs, ys))
print(f"y = {m:.2f}x + {b:.2f},  S = {S:.2f}")
print("prediction for x = 6:", round(m * 6 + b, 2))
```

## Linearizing nonlinear models

For an exponential relationship, $y = Ae^{kx}$, take the logarithm of both sides: $\ln y = \ln A + kx$. This is **linear** in the points $(x; \ln y)$, so we fit a line, and $k = m$, $A = e^{b}$. Similarly, for a power function ($y = Ax^p$) we fit the points $(\ln x; \ln y)$ (a log-log plot).

Least squares is also the foundation of machine learning: **linear regression** is exactly this, and training a neural network means minimizing a (much more complicated) error function.

## Summary

- Sum of squared errors: $S = \sum (y_i - mx_i - b)^2$, which we minimize.
- $m = \frac{\sum (x_i - \bar x)(y_i - \bar y)}{\sum (x_i - \bar x)^2}$, $b = \bar y - m\bar x$; the line passes through $(\bar x; \bar y)$.
- Exponential model: fit a line to $(x; \ln y)$.

## Lesson exercise

```quiz required
? For the points $(0; 1)$, $(1; 3)$, $(2; 5)$, what is the slope $m$ of the regression line?
= 2
! The points lie on a line.

? For the same points, what is $b$?
= 1

? For the points $(1; 1)$, $(2; 2)$, $(3; 2)$, what is $m$? (As a decimal or a fraction.)
= 0.5
= 1/2
! $\bar x = 2$, $\bar y = \frac{5}{3}$; the sum of the products is $1$, of the squares $2$.

? For the same points, what is $b$? (As a fraction.)
= 2/3
! $b = \bar y - m\bar x = \frac{5}{3} - 1$

? Which point does the regression line always pass through?
- the origin
- the first measurement
+ the mean point $(\bar x; \bar y)$
- the point with the largest $y$

? The data are expected to follow $y = Ae^{kx}$. What should we fit a line to?
- the points $(x; y)$
+ the points $(x; \ln y)$
- the points $(\ln x; y)$
- the points $(x; y^2)$
```
