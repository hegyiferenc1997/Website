---
title: Practice – Budgets and Finance
summary: Review questions and a summary worksheet on the government budget, a student's monthly plan, compound interest and loans.
minutes: 60
kind: practice
---

## Review questions

<details>
<summary>1. Why is it not necessarily bad if the government runs a deficit during a recession?</summary>

Because in a recession private demand falls, and the deficit (more spending, less tax) partly replaces it, dampening the downturn. Automatic stabilisers do this on their own too. The problem arises if the deficit stays high even in a boom and debt keeps growing.

</details>

<details>
<summary>2. What is the difference between the budget deficit and public debt?</summary>

The deficit is the gap between a year's revenue and spending (a flow), the debt is the accumulated sum of past deficits at a point in time (a stock). If the deficit falls but is still positive, the debt keeps growing in forints.

</details>

<details>
<summary>3. Why is it worth starting to save small amounts already as a student?</summary>

Because of compound interest, time is the most important factor: the same amount grows to much more over 40 years than over 20. The habit of regular saving also matters more than the size of the amount saved at the beginning.

</details>

<details>
<summary>4. A store credit offer advertises "0% interest", but the APR is 18%. How is this possible?</summary>

The APR includes all fees besides interest (handling fee, disbursement fee, compulsory insurance). The advertised interest rate may be zero, and the loan can still be expensive. That is why loans must be compared by APR.

</details>

## Summary worksheet

A student's net monthly income is 280,000 HUF. In a national budget revenue is 38 and spending 41 thousand billion HUF, and GDP is 100 thousand billion HUF.

```quiz required
? Under the 50/30/20 rule, how much goes on wants each month (HUF)?
= 84000
! 30% · 280,000.

? What is the budget deficit as a percentage of GDP?
= 3
= 3%
! (41 − 38) / 100.

? Does this meet the Maastricht deficit criterion?
+ yes, exactly at the limit
- no
! The limit is 3% of GDP.

? The student deposits 150,000 HUF for 2 years at 4% compound interest a year. How much will they have at the end (HUF)?
= 162240
! 150,000 · 1.04² = 162,240.

? What is the present value of 315,000 HUF received in 1 year at a 5% interest rate (HUF)?
= 300000
! 315,000 / 1.05.

? What is the simple multiplier if MPC = 0.5?
= 2
! 1 / (1 − 0.5).

? Two loans: A – 12% interest, APR 16%; B – 14% interest, APR 15%. Which is cheaper?
- A
+ B
! The APR decides: 15% < 16%.
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **Monthly payment.** Write the function `payment(loan, annual_rate, years)`, which returns the monthly instalment of an annuity loan rounded to a whole forint ($A = H \cdot \frac{i}{1 - (1 + i)^{-n}}$, $i$ is the monthly interest rate, $n$ the number of months)!

```python starter
def payment(loan, annual_rate, years):
    return round(loan * (1 + annual_rate / 100) / (years * 12))
```

<details>
<summary>Solution</summary>

```python solution
def payment(loan, annual_rate, years):
    i = annual_rate / 100 / 12             # monthly interest rate
    n = years * 12                         # number of instalments
    return round(loan * i / (1 - (1 + i) ** -n))
```

</details>

```python test
assert payment(20_000_000, 6.5, 20) == 149115
assert payment(20_000_000, 6.5, 10) == 227096
assert payment(15_000_000, 3, 20) == 83190
print("All checks passed!")
```

**2.** **Compound interest with monthly deposits.** Write the function `savings(monthly, annual_rate, years)`, which tells how much money we'll have if we put aside `monthly` forints at the end of every month and the money earns interest monthly (`annual_rate / 12` %)! Round to a whole forint.

```python starter
def savings(monthly, annual_rate, years):
    return round(monthly * 12 * years)
```

<details>
<summary>Solution</summary>

Over 10 years we pay in 2.4 million forints, and interest adds almost 900 thousand.

```python solution
def savings(monthly, annual_rate, years):
    i = annual_rate / 100 / 12
    balance = 0.0
    for _ in range(years * 12):
        balance = balance * (1 + i) + monthly   # interest accrues, then we deposit
    return round(balance)
```

</details>

```python test
assert savings(10_000, 0, 1) == 120000
assert savings(78_572, 4, 3) == 3000002
assert savings(20_000, 6, 10) == 3277587
print("All checks passed!")
```

**3.** **Fiscal multiplier.** Write the function `multiplier(c, t=0, m=0)`, which computes the spending multiplier from the marginal propensity to consume (`c`), the tax rate (`t`) and the propensity to import (`m`): $\frac{1}{1 - c(1 - t) + m}$, to 2 decimals!

```python starter
def multiplier(c, t=0, m=0):
    return round(1 / (1 - c), 2)
```

<details>
<summary>Solution</summary>

That's why in a small, open, high-tax economy the multiplier is much smaller than the simple $\frac{1}{1 - c}$ formula suggests.

```python solution
def multiplier(c, t=0, m=0):
    return round(1 / (1 - c * (1 - t) + m), 2)   # taxes and imports are "leakage"
```

</details>

```python test
assert multiplier(0.8) == 5.0
assert multiplier(0.75) == 4.0
assert multiplier(0.8, 0.25, 0) == 2.5
assert multiplier(0.8, 0.25, 0.3) == 1.43
print("All checks passed!")
```

### Quick check questions

```quiz
? According to the 50/30/20 rule, how much of a net income of 400,000 Ft is worth putting into savings (Ft)?
= 80000
! 20% of income.

? What is a deposit of 1 million Ft worth after 2 years at 5% compound interest a year (Ft)?
= 1102500
! $1\,000\,000 \cdot 1.05^2 = 1\,102\,500$.

? Which is an example of an automatic stabiliser?
+ in a recession spending on unemployment benefits rises automatically
- the government builds a new motorway
- parliament votes for a tax cut
- the central bank cuts interest rates
! It dampens the cycle without a separate decision.

? What is the present value of 110,000 Ft due in 1 year, if the interest rate is 10% (Ft)?
= 100000
! $\frac{110\,000}{1.1} = 100\,000$.

? The government's revenue is 30,000 and its spending 32,000 billion Ft. What is the balance (billion Ft)?
= -2000
= −2000
! $30\,000 - 32\,000 = -2000$, i.e. a deficit.
```
