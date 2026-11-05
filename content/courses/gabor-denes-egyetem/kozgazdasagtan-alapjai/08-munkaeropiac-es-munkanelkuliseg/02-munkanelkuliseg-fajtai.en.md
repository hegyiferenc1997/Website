---
title: Types of Unemployment and Policy
summary: Why is there always unemployment? Frictional, structural, cyclical and seasonal unemployment, the natural rate, Okun's law, the Phillips curve and the tools of employment policy.
minutes: 25
---

## What you will learn

- the **four types** of unemployment,
- what the **natural rate of unemployment** is,
- what **Okun's law** says,
- what the **Phillips curve** shows,
- what **active** and **passive** employment policy tools are.

## Types of unemployment

| Type           | Cause                                                            | Example                                                     | Remedy                           |
| -------------- | ---------------------------------------------------------------- | ----------------------------------------------------------- | -------------------------------- |
| **frictional** | job search takes time                                            | a new graduate developer is at their 3rd interview          | job portals, better information  |
| **structural** | the skills and locations demanded and available **do not match** | miners from a closed coal mine while programmers are sought | retraining, support for mobility |
| **cyclical**   | there is little work due to an economic **downturn**             | layoffs in a recession                                      | fiscal and monetary stimulus     |
| **seasonal**   | the seasons                                                      | construction in winter, tourism in summer                   | –                                |

**Technological unemployment** is a kind of structural unemployment: automation eliminates some jobs (lesson 3 and topic 12).

## The natural rate of unemployment

Frictional and structural unemployment **always** exist – even in a well-functioning economy. Together they make up the **natural rate**. If the actual rate is at the natural rate, the economy is at **full employment** (which does not mean 0% unemployment!).

- **Cyclical unemployment** = actual rate − natural rate.
- It is positive in a recession and can even be negative in an overheating economy.

## Okun's law

Arthur Okun's observation: unemployment and output move together. A frequently used rule of thumb:

> If the unemployment rate is **1 percentage point** above the natural rate, GDP is about **2%** below its potential level.

So cyclical unemployment means **lost output** not only for those affected but for society as a whole.

## The Phillips curve

In 1958 A. W. Phillips found that in the short run **low unemployment goes with high inflation**, and vice versa. If spare labour is scarce, firms compete for workers, wages rise, and this is built into prices.

In the modern version the position of the curve depends on **expected inflation** ($\pi^e$): $\pi = \pi^e - b \cdot (u - u^{\ast})$. In the chart the natural rate is $u^{\ast} = 5\%$ and $b = 2$:

```plot
title: Short-run Phillips curve
x: 0, 12
y: -6, 20
param: e = 3, 0, 10, 0.5
f: e - 2(x - 5) # Phillips curve
point: 5, e # natural rate
value: inflation at the natural rate = e
```

If expectations rise (the **e** slider), the whole curve shifts up: inflation is higher at the same unemployment. In the long run unemployment returns to the natural rate – persistently high inflation does **not** buy persistently low unemployment (Friedman and Phelps, 1960s; the stagflation of the 1970s confirmed this).

## Employment policy

| Passive tools                                       | Active tools                      |
| --------------------------------------------------- | --------------------------------- |
| **replacing the income** of the unemployed          | **helping people into work**      |
| jobseeker's allowance (in Hungary at most 3 months) | retraining, adult education       |
|                                                     | wage subsidies for employers      |
|                                                     | job search counselling, placement |
|                                                     | support for starting a business   |
|                                                     | public works schemes              |

Overly generous and long benefits can reduce the incentive to search, while overly meagre ones can force someone to accept the first job that does not match their skills. A good system **balances** security and incentives.

## Summary

- Types: frictional, structural, cyclical, seasonal.
- Natural rate = frictional + structural; full employment ≠ 0% unemployment.
- Okun: 1 percentage point of cyclical unemployment ≈ a 2% GDP gap.
- Phillips curve: a short-run trade-off between inflation and unemployment; none in the long run.
- Passive (income replacement) and active (helping into work) tools.

## Your task

```quiz required
? A new graduate has been looking for their first job for two months. What kind of unemployment is this?
+ frictional
- structural
- cyclical
- seasonal
! Searching takes time.

? A factory closes in a region, and there is no demand for the workers' skills elsewhere either. What kind of unemployment is this?
- frictional
+ structural
- seasonal
! Skills do not match.

? The actual rate is 7%, the natural rate 4%. What is cyclical unemployment (percentage points)?
= 3
! 7 − 4.

? By the Okun's law rule of thumb, approximately how many percent below potential is GDP then?
= 6
= 6%
! 3 · 2.

? Which is an **active** employment policy tool?
- jobseeker's allowance
+ free programming retraining for the unemployed
- unemployment benefit
- severance pay
! It helps people into work.
```
