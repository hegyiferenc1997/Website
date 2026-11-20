---
title: Practice – The Labour Market
summary: Review questions and a summary worksheet on hiring decisions, types of unemployment, Okun's law and the return on education.
minutes: 55
kind: practice
---

## Review questions

<details>
<summary>1. Why can unemployment not be reduced to zero permanently?</summary>

Because frictional and structural unemployment are always present: people change jobs, new people enter the labour market, and the structure of the economy keeps changing. Together they make up the natural rate.

</details>

<details>
<summary>2. An AI tool doubles programmers' productivity. Will demand for programmers necessarily fall?</summary>

Not necessarily. With higher productivity the marginal revenue product (MRP) of labour rises and software becomes cheaper, so there may be demand for more software. The outcome depends on how elastic demand for software is and which tasks the tool replaces.

</details>

<details>
<summary>3. Why can a minimum wage rise be bad news for a young job starter, and why can it be good?</summary>

Bad: if the new minimum wage is higher than their productivity (MRP), it is not worth hiring them. Good: if they are hired, they earn more, and if the employer has wage-setting power, the higher wage may even increase employment.

</details>

<details>
<summary>4. Why did stagflation occur in the 1970s, and what did it say about the Phillips curve?</summary>

The oil price shocks caused cost-push inflation, and high inflation expectations shifted the Phillips curve up: high inflation and high unemployment at the same time. This showed that the Phillips curve trade-off is not stable but depends on expectations.

</details>

## Summary worksheet

A cybersecurity company sells an audit for 600,000 HUF. The monthly wage is 1,000,000 HUF per analyst.

| Analysts       | 1   | 2   | 3   | 4   | 5   |
| -------------- | --- | --- | --- | --- | --- |
| Audits / month | 3   | 5   | 6.5 | 7.5 | 8   |

```quiz required
? What is the marginal product of the 3rd analyst (audits / month)?
= 1,5
= 1.5
! 6.5 − 5.

? What is the marginal revenue product of the 3rd analyst (thousand HUF)?
= 900
! 1.5 · 600.

? How many analysts is it worth employing?
= 2
! The 2nd's MRP is 2 · 600 = 1200 thousand ≥ 1000, the 3rd's is 900 < 1000.

? The natural rate is 4.5%, the actual rate 6%. By Okun's rule, how large is the GDP gap in percent?
= 3
= 3%
! (6 − 4.5) · 2.

? A bootcamp costs 2 million HUF, and you give up 1 million HUF of earnings meanwhile; afterwards you earn 1.2 million HUF more a year. What is the simple payback period in years?
= 2,5
= 2.5
! 3 / 1.2.

? A ski instructor is out of work in summer. What kind of unemployment is this?
- structural
- cyclical
+ seasonal
! It is tied to the season.
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **Minimum wage and unemployment.** Labour demand is $L_D = a - bw$, supply is $L_S = c + dw$. Write the function `minimum_wage(a, b, c, d, w_min)`, which returns the pair `(employment, job seekers who find no job)`! If the minimum wage is below the equilibrium wage, it doesn't bind (the equilibrium holds). Round to 1 decimal.

```python starter
def minimum_wage(a, b, c, d, w_min):
    return (round(a - b * w_min, 1), round((c + d * w_min) - (a - b * w_min), 1))
```

<details>
<summary>Solution</summary>

For a non-binding minimum wage the starter code would give negative unemployment.

```python solution
def minimum_wage(a, b, c, d, w_min):
    w_e = (a - c) / (b + d)                       # equilibrium wage
    w = max(w_min, w_e)                           # a minimum wage below equilibrium doesn't bind
    employed = min(a - b * w, c + d * w)          # the shorter side decides
    return (round(employed, 1), round(c + d * w - employed, 1))
```

</details>

```python test
assert minimum_wage(1000, 2, -500, 3, 350) == (300.0, 250.0)
assert minimum_wage(1000, 2, -500, 3, 280) == (400.0, 0.0)
assert minimum_wage(1000, 2, -500, 3, 340) == (320.0, 200.0)
print("All checks passed!")
```

**2.** **Okun's law.** Write the function `okun(rate, natural, coefficient=2.0, potential=None)`, which returns the output gap in % to 1 decimal; if potential GDP is also given, it returns the pair `(gap, lost output)` (lost output can't be negative, rounded to a whole number)!

```python starter
def okun(rate, natural, coefficient=2.0, potential=None):
    return round(rate - natural, 1)
```

<details>
<summary>Solution</summary>

```python solution
def okun(rate, natural, coefficient=2.0, potential=None):
    gap = round(-coefficient * (rate - natural), 1) + 0.0   # + 0.0: avoid "-0.0"
    if potential is None:
        return gap
    return (gap, round(max(0.0, -gap) / 100 * potential))
```

</details>

```python test
assert okun(7, 5) == -4.0
assert okun(4, 5) == 2.0
assert okun(6.5, 4, potential=80_000) == (-5.0, 4000)
assert okun(4, 4, potential=80_000) == (0.0, 0)
print("All checks passed!")
```

**3.** **The unemployment bathtub.** Write the function `lasting_rate(s, f)`, which from the monthly job-loss rate (`s`) and job-finding rate (`f`) gives the steady-state unemployment rate in %, to 1 decimal, and the function `after_months(u0, s, f, months)`, which gives the rate after simulating `months` months (also in %, to 1 decimal)!

```python starter
def lasting_rate(s, f):
    return round(100 * s / f, 1)

def after_months(u0, s, f, months):
    return round(100 * u0, 1)
```

<details>
<summary>Solution</summary>

```python solution
def lasting_rate(s, f):
    return round(100 * s / (s + f), 1)     # inflow = outflow

def after_months(u0, s, f, months):
    u = u0
    for _ in range(months):
        u = u + s * (1 - u) - f * u        # inflow from the employed, outflow from the unemployed
    return round(100 * u, 1)
```

</details>

```python test
assert lasting_rate(0.01, 0.10) == 9.1
assert lasting_rate(0.02, 0.18) == 10.0
assert after_months(0.10, 0.01, 0.30, 60) == 3.2
assert after_months(0.10, 0.01, 0.30, 1) == 7.9
print("All checks passed!")
```

### Quick check questions

```quiz
? Which is an example of structural unemployment?
- someone looking for a new job between two jobs
+ automation eliminates shop cashier jobs, and the affected people's skills don't fit the new jobs
- demand falls because of a recession
- a beach lifeguard doesn't work in winter
! The workers' skills and the jobs' requirements don't match.

? What does the short-run Phillips curve show?
+ the trade-off between inflation and unemployment
- the relationship between GDP and the interest rate
- the relationship between wages and the exchange rate
- the relationship between the money supply and GDP
! In the short run lower unemployment comes with higher inflation.

? If a worker's marginal product brings in 900,000 Ft of revenue per month and the wage is 700,000 Ft, is it worth hiring them?
+ yes
- no
- only if the wage is 900,000 Ft
- it can't be decided
! The value of the marginal product is larger than the wage.

? Steady-state unemployment is 5%, the monthly job-loss rate is 1%. What is the monthly job-finding rate (%)?
= 19
! $\frac{s}{s + f} = 0.05 \Rightarrow f = 0.19$.

? Why can wages in IT be higher than average in a country's labour market?
- because IT workers work more
+ because demand is high and supply is scarce (the profession takes a lot of learning)
- because their minimum wage is higher
- because there's no competition
! The wage reflects the ratio of demand and supply; the human capital requirement limits supply.
```
