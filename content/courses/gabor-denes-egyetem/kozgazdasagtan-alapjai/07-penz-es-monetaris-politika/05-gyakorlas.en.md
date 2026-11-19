---
title: Practice – Money and Monetary Policy
summary: Review questions and a summary worksheet on the functions of money, money creation, the quantity equation and central bank decisions.
minutes: 55
kind: practice
---

## Review questions

<details>
<summary>1. Why can't the central bank print unlimited money to boost the economy?</summary>

According to the quantity equation ($MV = PY$), if the money supply grows much faster than real output, the price level rises. In the long run output is determined by labour, capital and technology, not the amount of money – so too much money leads to inflation and, in extreme cases, hyperinflation.

</details>

<details>
<summary>2. How does a rate hike affect a student planning a mortgage, and a grandmother with a deposit?</summary>

For the student the loan becomes more expensive (with a variable rate, even an existing one), and they can borrow less for the same instalment. The grandmother's deposit may earn more interest – a rate hike favours savers, not borrowers.

</details>

<details>
<summary>3. Why is the risk of a bank run higher in the age of mobile banking and social media?</summary>

Because bad news spreads in minutes and money can be withdrawn with a few clicks – no need to queue at a branch. The collapse of Silicon Valley Bank in 2023 showed that a bank run can happen within hours.

</details>

<details>
<summary>4. Why does inflation react to a rate hike with a lag?</summary>

Because loan contracts, wage agreements and company pricing adjust only gradually, investment decisions are made months in advance, and expectations change slowly. So the central bank has to look ahead: today's decision takes effect in 1–2 years.

</details>

## Summary worksheet

```quiz required
? Which function of money suffers most during hyperinflation?
- medium of exchange
- unit of account
+ store of value
! Money loses its purchasing power within hours – nobody holds money.

? M = 200, V = 4, P = 2. What is real output (Y)?
= 400
! 200 · 4 / 2.

? If the money supply grows by 10% and V and Y are unchanged, by what percentage does the price level rise?
= 10
= 10%
! MV = PY: P rises proportionally.

? The reserve ratio is 5%. What is the simple money multiplier?
= 20
! 1 / 0.05.

? 2,000,000 HUF of new deposits enter the banking system, the reserve ratio is 10%. What can total deposits be in theory at the end of the process (HUF)?
= 20000000
! 2,000,000 · 10.

? There is a recession, inflation is 1%, the target is 3%. What does the textbook model suggest?
- a rate hike
+ a rate cut
- raising the reserve requirement
! Expansionary monetary policy.

? Which is not a task of the central bank in Hungary?
- issuing banknotes
- setting the policy rate
+ setting the personal income tax rate
- supervising the financial system
! Parliament decides on taxes – that is fiscal policy.
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **Money creation with cash holding.** Write the function `money_multiplier(reserve, cash=0)`, which tells by what factor a new deposit grows in the banking system if banks hold back a share `reserve`, and from every loan a share `cash` doesn't return to the banks: $\frac{1}{1 - (1 - r)(1 - k)}$. Round to 2 decimals!

```python starter
def money_multiplier(reserve, cash=0):
    return round(1 / reserve, 2)
```

<details>
<summary>Solution</summary>

```python solution
def money_multiplier(reserve, cash=0):
    returns = (1 - reserve) * (1 - cash)   # this much comes back as a deposit in every round
    return round(1 / (1 - returns), 2)     # sum of a geometric series
```

</details>

```python test
assert money_multiplier(0.10) == 10.0
assert money_multiplier(0.05) == 20.0
assert money_multiplier(0.10, 0.20) == 3.57
assert money_multiplier(0.20, 0.10) == 3.57
print("All checks passed!")
```

**2.** **Quantity equation.** Write the function `quantity_inflation(m, v, y)`, which computes inflation from the percentage growth of the money supply (`m`), velocity (`v`) and real GDP (`y`) ($(1 + m)(1 + v) = (1 + \pi)(1 + y)$), to 1 decimal!

```python starter
def quantity_inflation(m, v, y):
    return round(m - y, 1)
```

<details>
<summary>Solution</summary>

The starter code leaves out velocity – the second test shows exactly that without it we'd reach a completely wrong conclusion.

```python solution
def quantity_inflation(m, v, y):
    return round(100 * ((1 + m / 100) * (1 + v / 100) / (1 + y / 100) - 1), 1)
```

</details>

```python test
assert quantity_inflation(10, 0, 3) == 6.8
assert quantity_inflation(10, -10, 0) == -1.0
assert quantity_inflation(8, 0, 2) == 5.9
assert quantity_inflation(5, 2, 2) == 5.0
print("All checks passed!")
```

**3.** **Taylor rule.** Write the function `taylor(inflation, gap, neutral=2.0, target=3.0)`: $i = r^* + \pi + 0.5(\pi - \pi^*) + 0.5 \cdot \text{gap}$, but the interest rate can't be negative (clip it to 0)! Round to 2 decimals.

```python starter
def taylor(inflation, gap, neutral=2.0, target=3.0):
    return round(neutral + inflation, 2)
```

<details>
<summary>Solution</summary>

The last test is the "zero lower bound" situation: the rule would call for a negative rate, but then the central bank turns to unconventional tools (e.g. asset purchases).

```python solution
def taylor(inflation, gap, neutral=2.0, target=3.0):
    i = neutral + inflation + 0.5 * (inflation - target) + 0.5 * gap
    return round(max(i, 0.0), 2)           # the nominal rate can't go below zero (lower bound)
```

</details>

```python test
assert taylor(3, 0) == 5.0
assert taylor(6, 2) == 10.5
assert taylor(5, 0) == 8.0
assert taylor(0, -6) == 0.0
print("All checks passed!")
```

### Quick check questions

```quiz
? Which is NOT a function of money?
- unit of account
- medium of exchange
- store of value
+ factor of production
! The three classic functions of money: unit of account, medium of exchange, store of value.

? The central bank's policy rate is 6.5%, inflation is 4%. Roughly what is the real interest rate (%)?
= 2,5
= 2.5
! $6.5 - 4 = 2.5$.

? What does the central bank do if inflation is well above target?
+ it raises the policy rate
- it cuts the policy rate
- it prints more money
- it cuts the reserve ratio
! It tightens: makes credit more expensive and holds back demand.

? What is the purpose of deposit insurance?
- to increase banks' profits
+ to prevent bank runs (mass withdrawals)
- to reduce inflation
- to finance the government deficit
! If depositors know their money is safe, they don't rush to the bank.

? The interest rate on a 10 million Ft variable-rate loan rises from 4% to 7% a year. By how much does the monthly interest charge rise in the first month (Ft)?
= 25000
! $10\,000\,000 \cdot \frac{0.03}{12} = 25\,000$ Ft.
```
