---
title: Practice – GDP, Unemployment, Inflation
summary: Review questions and a summary worksheet on the macro data of an imaginary country: GDP from the expenditure side, real growth, labour market rates and inflation.
minutes: 60
kind: practice
---

## Review questions

<details>
<summary>1. A country's GDP grew by 3% and its population by 4%. Did the average standard of living improve?</summary>

Probably not: GDP per capita **fell** by about 1% (3 − 4). Growth in total GDP alone does not show output per person.

</details>

<details>
<summary>2. Why are intermediate products not counted separately in GDP?</summary>

Because their value is already included in the price of the final product. If we added the chip, the laptop and the retail sale all at full price, we would count the same value several times. That is why we add up final products or value added.

</details>

<details>
<summary>3. Why can the unemployment rate fall even during a crisis?</summary>

If many jobseekers become discouraged and stop searching, they move to the inactive group. The number of unemployed and the rate then fall, while employment does not rise. That is why the employment rate is also worth watching.

</details>

<details>
<summary>4. Why is the target 2–3% inflation rather than 0%?</summary>

Because measurement errors make measured inflation slightly overestimate true inflation, the risk of deflation grows near 0%, and with a little inflation the central bank has more room to cut interest rates in a crisis. Adjusting real wages is also easier.

</details>

## Summary worksheet

Data of an imaginary country (thousand billion HUF, or thousand people):

| Item                      | Value |
| ------------------------- | ----- |
| household consumption (C) | 60    |
| investment (I)            | 25    |
| government purchases (G)  | 20    |
| pensions and benefits     | 12    |
| exports (X)               | 70    |
| imports (M)               | 65    |
| population aged 15–74     | 8,000 |
| employed                  | 5,520 |
| unemployed                | 480   |

```quiz required
? What is GDP (thousand billion HUF)?
= 110
! 60 + 25 + 20 + (70 − 65); pensions are transfers and are not included.

? What is the unemployment rate (%)?
= 8
= 8%
! 480 / (5520 + 480) = 480 / 6000.

? What is the employment rate (%)?
= 69
= 69%
! 5520 / 8000.

? Next year nominal GDP is 121 and the GDP deflator 105 (this year = 100). What is real GDP next year (at this year's prices), to one decimal place?
= 115,2
= 115.2
! 121 / 105 · 100 ≈ 115.24.

? So approximately what is real growth in percent? (To a whole number.)
= 5
= 5%
! 115.2 / 110 ≈ 1.048.

? The price index changed from 108 (last year) to 104 (this year). What happened?
- deflation
+ disinflation
- hyperinflation
! Inflation slowed from 8% to 4%, but prices are still rising.
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **Real growth.** Write the function `real_growth(nominal, deflator)`, which computes real growth to 1 decimal from nominal GDP growth and the change in the deflator (both %)!

```python starter
def real_growth(nominal, deflator):
    return round(nominal - deflator, 1)
```

<details>
<summary>Solution</summary>

```python solution
def real_growth(nominal, deflator):
    return round(100 * ((1 + nominal / 100) / (1 + deflator / 100) - 1), 1)
```

</details>

```python test
assert real_growth(8, 5) == 2.9
assert real_growth(16.4, 11.4) == 4.5
assert real_growth(3, 3) == 0.0
assert real_growth(2, 6) == -3.8
print("All checks passed!")
```

**2.** **Labour market rates.** Write the function `rates(employed, unemployed, inactive)`, which returns the triple `(unemployment rate, activity rate, employment rate)` in percent, to 1 decimal!

```python starter
def rates(employed, unemployed, inactive):
    pop = employed + unemployed + inactive
    return (round(100 * unemployed / pop, 1), 0, 0)
```

<details>
<summary>Solution</summary>

The third test is the example from the lesson: 60 thousand discouraged unemployed people "improve" the rate, while employment doesn't change.

```python solution
def rates(employed, unemployed, inactive):
    active = employed + unemployed                  # labour force
    pop = active + inactive                         # population aged 15–74
    return (round(100 * unemployed / active, 1),    # relative to the labour force!
            round(100 * active / pop, 1),
            round(100 * employed / pop, 1))
```

</details>

```python test
assert rates(4700, 210, 2590) == (4.3, 65.5, 62.7)
assert rates(900, 100, 500) == (10.0, 66.7, 60.0)
assert rates(4700, 150, 2650) == (3.1, 64.7, 62.7)
print("All checks passed!")
```

**3.** **Consumer price index.** Write the function `inflation(basket)`, which computes the weighted average inflation to 2 decimals from the dictionary `{item: (weight, price change %)}`! The weights don't necessarily add up to 1 – in that case normalise them.

```python starter
def inflation(basket):
    return round(sum(c for w, c in basket.values()) / len(basket), 2)
```

<details>
<summary>Solution</summary>

```python solution
def inflation(basket):
    total_weight = sum(w for w, c in basket.values())
    return round(sum(w * c for w, c in basket.values()) / total_weight, 2)   # weighted average
```

</details>

```python test
assert inflation({"food": (0.6, 5), "other": (0.4, 10)}) == 7.0
assert inflation({"a": (25, 6), "b": (20, 3), "c": (15, -2), "d": (10, 8), "e": (5, -5), "f": (25, 4)}) == 3.35
assert inflation({"x": (1, 2), "y": (3, 6)}) == 5.0
print("All checks passed!")
```

### Quick check questions

```quiz
? Which is NOT counted in GDP?
- a newly built home
- a domestically made car
+ the sale of a used car between private individuals
- a hairdresser's service
! The used product was already counted in GDP once, when it was produced.

? A country's population is 10 million, its GDP 80,000 billion Ft. What is GDP per capita (million Ft)?
= 8
! $80\,000 \text{ bn} / 10 \text{ million} = 8$ million Ft.

? What does core inflation show?
+ the change in the price level without the most volatile items (e.g. energy, fresh food)
- only the rise in food prices
- wage growth
- the GDP deflator
! It shows the lasting inflation process better.

? Whom does unexpectedly high inflation benefit?
- savers
+ debtors with fixed-rate loans
- people on fixed incomes
- pensioners, if pensions don't follow prices
! The real value of the debt falls.

? Nominal GDP rises from 1000 to 1100, the deflator from 100 to 105. What will real GDP be (rounded to a whole number)?
= 1048
! $\frac{1100}{1.05} \approx 1048$.
```
