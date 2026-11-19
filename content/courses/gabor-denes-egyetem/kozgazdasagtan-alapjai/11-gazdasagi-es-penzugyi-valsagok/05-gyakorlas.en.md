---
title: Practice – Crises and Crisis Management
summary: Review questions and a summary worksheet on the business cycle, the lessons of major crises and the tools of crisis management.
minutes: 55
kind: practice
---

## Review questions

<details>
<summary>1. Why are financial crises usually deeper than "ordinary" recessions?</summary>

Because damage to the banking system paralyses lending (firms get no working capital loans, households no mortgages), falling asset prices reduce wealth, and indebted actors spend years paying down debt instead of consuming and investing.

</details>

<details>
<summary>2. Why would large-scale demand stimulus not have been a good response to the oil crisis of the 1970s?</summary>

Because it was a supply shock: production possibilities worsened (more expensive energy). Demand stimulus could not have raised output permanently, but it would have accelerated inflation further – which is exactly what happened in several countries and led to stagflation.

</details>

<details>
<summary>3. What can today's AI investment wave learn from the dot-com bubble?</summary>

That even alongside a truly revolutionary technology there can be overvalued companies: investors may price in huge future profits in advance, and if these do not come quickly enough, prices can plunge. In the long run the technology can still transform the economy – but the winners and losers are hard to see in advance.

</details>

<details>
<summary>4. Why did Hungary have to take an international loan in 2008 when many other countries did not?</summary>

Because public debt and the budget deficit were both high, a large share of households had borrowed in foreign currency, and the country depended heavily on foreign financing. When investors began to flee in the crisis, the forint weakened and the state could not obtain market funding at an acceptable interest rate.

</details>

## Summary worksheet

A country's quarterly real GDP (index, previous quarter = 100): Q1 100.4; Q2 99.7; Q3 99.5; Q4 100.2.

```quiz required
? Was the country in a technical recession during the year?
+ yes
- no
! GDP fell in Q2 and Q3 in a row.

? In which quarter did growth resume?
= 4
= Q4
! The Q4 index is above 100.

? Potential GDP is 200, actual GDP 192 (thousand billion HUF). What is the output gap as a percentage of potential GDP? (With sign.)
= -4
= −4
! (192 − 200) / 200.

? The natural rate of unemployment is 4%. By Okun's rule (1 percentage point ≈ 2% GDP gap), approximately what might the actual unemployment rate be (%)?
= 6
= 6%
! A 4% GDP gap ≈ 2 percentage points of cyclical unemployment → 4 + 2.

? Which is the most appropriate monetary response to a fall in demand with low inflation?
+ a rate cut
- a rate hike
- raising the reserve requirement
! Expansionary monetary policy.

? A bank gets into trouble; under EU rules who must bear the losses first?
- taxpayers
- depositors up to 100,000 euros
+ shareholders and creditors (bail-in)
! Taxpayers' money is only a last resort.

? Which event triggered the Great Depression?
+ the New York stock market crash of October 1929
- the failure of Lehman Brothers
- the OPEC oil embargo
- the bursting of the dot-com bubble
! The collapse of a credit-fuelled share bubble.
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **Leverage.** An investor invests `leverage` times their own capital (the rest from a loan). Write the function `leverage_effect(leverage, price_change)`, which tells by how many % their own capital changes if the asset's price moves by `price_change` %! The loss can't be larger than 100% (at that point the capital is gone). Round to 1 decimal.

```python starter
def leverage_effect(leverage, price_change):
    return round(price_change, 1)
```

<details>
<summary>Solution</summary>

With 20× leverage even a 5% fall wipes out all the capital – in 2008 many banks worked with leverage like that.

```python solution
def leverage_effect(leverage, price_change):
    change = leverage * price_change         # the loan magnifies the move
    return round(max(-100.0, change), 1) + 0.0
```

</details>

```python test
assert leverage_effect(1, -5) == -5.0
assert leverage_effect(10, -5) == -50.0
assert leverage_effect(20, -6) == -100.0
assert leverage_effect(10, 3) == 30.0
print("All checks passed!")
```

**2.** **The path of the debt ratio.** Government debt is `d0` % of GDP, the interest rate is `r` %, nominal GDP growth is `g` %, and the primary surplus is `primary` % of GDP every year. Write the function `debt_path(d0, r, g, primary, years)`, which gives the debt ratio after `years` years (%, to 1 decimal)! One year: $d \leftarrow d \cdot \frac{1 + r}{1 + g} - \text{primary}$.

```python starter
def debt_path(d0, r, g, primary, years):
    return round(d0 + years * (r - g) - years * primary, 1)
```

<details>
<summary>Solution</summary>

If the interest rate is below growth ($r < g$), the debt ratio falls by itself; if it's above, it can only be kept in check with a primary surplus.

```python solution
def debt_path(d0, r, g, primary, years):
    d = d0
    for _ in range(years):
        d = d * (1 + r / 100) / (1 + g / 100) - primary   # interest raises it, GDP growth dilutes it
    return round(d, 1)
```

</details>

```python test
assert debt_path(80, 3, 5, 0, 10) == 66.0
assert debt_path(80, 5, 3, 0, 10) == 97.0
assert debt_path(80, 5, 3, 1, 10) == 86.0
assert debt_path(60, 2, 2, 1, 5) == 55.0
print("All checks passed!")
```

**3.** **Maximum drawdown.** Write the function `max_drawdown(prices)`, which from a price time series gives the largest fall measured from an earlier peak, in % (to 1 decimal)! This is one of the most important indicators in risk management.

```python starter
def max_drawdown(prices):
    return round(100 * (max(prices) - min(prices)) / max(prices), 1)
```

<details>
<summary>Solution</summary>

The starter code measures the minimum against the maximum even when the minimum came BEFORE the peak – it would show a fall even for a steadily rising price.

```python solution
def max_drawdown(prices):
    peak, worst = prices[0], 0.0
    for price in prices:
        peak = max(peak, price)                          # the highest price so far
        worst = max(worst, (peak - price) / peak)
    return round(100 * worst, 1)
```

</details>

```python test
assert max_drawdown([100, 120, 90, 130, 104, 150]) == 25.0
assert max_drawdown([100, 110, 120]) == 0.0
assert max_drawdown([100, 60, 80, 50, 200]) == 50.0
assert max_drawdown([50, 100, 75, 100, 40]) == 60.0
print("All checks passed!")
```

### Quick check questions

```quiz
? What is a bubble?
+ when an asset's price rises persistently far above its true value (expected returns), because buyers expect further price rises
- when the central bank prints money
- when GDP falls for two quarters
- when a bank goes bankrupt
! The self-fulfilling expectation sustains the price for a while, then it suddenly collapses.

? Why is a bank run dangerous even for a healthy bank?
- because the bank steals the money
+ because it has invested most of the deposits in loans, so it can't pay everyone at once
- because the central bank forbids payouts
- because the deposits lose their value
! Fractional reserves: the bank's liquid assets cover a small fraction of the deposits.

? What is the usual (technical) definition of a recession?
+ real GDP falls in two consecutive quarters
- inflation rises above 10%
- unemployment rises above 5%
- the stock market falls by 20%
! This is a simple rule of thumb; the official determination looks at several indicators.

? An investor buys a stock with 10× leverage, and it falls by 4%. How many % of their own capital do they lose?
= 40
! $10 \cdot 4 = 40$.

? What does the central bank do in a crisis as the "lender of last resort"?
- raises taxes
+ provides liquidity (loans) to banks that are solvent but temporarily short of cash
- closes the banks
- abolishes deposit insurance
! The goal is to stop panic and bank runs.
```
