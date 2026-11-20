---
title: Practice – Micro, Macro and Data
summary: Review questions and a summary worksheet on the micro and macro levels, the circular flow of income and calculating with economic data.
minutes: 55
kind: practice
---

## Review questions

<details>
<summary>1. A news item says: "The interest rate rose by 3 percent." Why can this be misleading?</summary>

It is not clear whether the change is 3 **percentage points** (e.g. from 4% to 7%) or 3 **percent** (e.g. from 4% to 4.12%). The difference is huge; for rates, percentage point is the precise term.

</details>

<details>
<summary>2. Why is the ceteris paribus assumption important when studying demand?</summary>

Because in reality many things change at once (price, income, fashion, prices of other goods). If we do not hold the other factors fixed, we cannot separate how much of the change was caused by the price itself.

</details>

<details>
<summary>3. Use the circular flow model to show why output may fall if households suddenly import much more.</summary>

Imports are a leakage: part of households' income does not flow back to domestic firms. If this is not offset by an injection (e.g. more exports or investment), domestic firms' revenue falls, they produce less and pay less in wages.

</details>

<details>
<summary>4. A study finds that people who drink more coffee earn more. Give two reasons why it does not follow that coffee raises pay.</summary>

A hidden third factor: longer working hours or a more stressful, better-paid job may cause both. Reverse causation: those who earn more can spend more on coffee (e.g. in expensive cafés).

</details>

## Summary worksheet

A university student's data (HUF/month):

| Year | Net income | Consumer price index (previous year = 100) |
| ---- | ---------- | ------------------------------------------ |
| 2025 | 200,000    | –                                          |
| 2026 | 220,000    | 104                                        |

```quiz required
? By what percentage did nominal income rise in 2026?
= 10
= 10%
! 220,000 / 200,000 = 1.10.

? What is the real income index (previous year = 100)? Rounded to one decimal place.
= 105,8
= 105.8
! 110 / 104 · 100 ≈ 105.8.

? Using the approximate rule, by what percentage did real income rise?
= 6
= 6%
! 10 − 4 = 6 (exactly 5.8%).

? The student saves 30,000 HUF a month. What is this in the circular flow?
+ a leakage
- an injection
! Saving (S) is a leakage.

? Inflation falls from 5% to 3%. What is the change in percentage points? (With sign.)
= -2
= −2
! 3 − 5.

? Did prices fall in this case?
- yes, by 2%
+ no, they are just rising more slowly
! Positive inflation = the price level is still rising.

? Which is a positive statement?
+ The consumer price index in 2026 was 104.
- The price index should be below 102.
- Students should receive more scholarships.
! It can be checked against data.
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **GDP from the expenditure side.** Write the function `gdp(C, I, G, X, M)`, which computes GDP from consumption, investment, government purchases, exports and imports!

```python starter
def gdp(C, I, G, X, M):
    return C + I + G + X + M
```

<details>
<summary>Solution</summary>

Imports are included in C, I or G (e.g. a foreign laptop), but they're not domestic production – that's why we subtract them.

```python solution
def gdp(C, I, G, X, M):
    return C + I + G + (X - M)            # imports must be subtracted: they were produced abroad
```

</details>

```python test
assert gdp(600, 200, 250, 450, 400) == 1100
assert gdp(500, 150, 200, 300, 250) == 900
assert gdp(100, 20, 30, 10, 40) == 120
print("All checks passed!")
```

**2.** **Percentage point and percent.** Write the function `change(old, new)`, which returns, from two percentage values (e.g. an interest rate), the pair `(change in percentage points, change in percent)`, both rounded to 1 decimal!

```python starter
def change(old, new):
    return (round(new - old, 1), round(new - old, 1))
```

<details>
<summary>Solution</summary>

```python solution
def change(old, new):
    pp = new - old                         # simple difference
    percent = 100 * (new - old) / old      # relative change
    return (round(pp, 1), round(percent, 1))
```

</details>

```python test
assert change(4.0, 6.5) == (2.5, 62.5)
assert change(5, 6) == (1.0, 20.0)
assert change(10, 8) == (-2.0, -20.0)
assert change(3, 3) == (0.0, 0.0)
print("All checks passed!")
```

**3.** **Real wage.** Write the function `real_wage(nominal, price_index)`, which expresses the nominal wage in base-year prices (the price index is 100 in the base year), rounded to a whole forint, and the function `real_wage_change(wage_growth, inflation)`, which gives the percentage change of the real wage to 1 decimal!

```python starter
def real_wage(nominal, price_index):
    return nominal

def real_wage_change(wage_growth, inflation):
    return round(wage_growth - inflation, 1)
```

<details>
<summary>Solution</summary>

The approximate "wage growth − inflation" rule is fine for small numbers, but with high inflation it's noticeably wrong.

```python solution
def real_wage(nominal, price_index):
    return round(nominal / (price_index / 100))       # divide by the price level

def real_wage_change(wage_growth, inflation):
    return round(100 * ((1 + wage_growth / 100) / (1 + inflation / 100) - 1), 1)
```

</details>

```python test
assert real_wage(520_000, 134.7) == 386043
assert real_wage(400_000, 100) == 400000
assert real_wage_change(10, 4) == 5.8
assert real_wage_change(30, 34.7) == -3.5
print("All checks passed!")
```

### Quick check questions

```quiz
? Which is a macroeconomic question?
- how much a new smartphone should cost
- how many workers a bakery should hire
+ why inflation rose across the whole country
- whether a student should take a part-time job
! Macroeconomics deals with the economy as a whole.

? A product's price is 450 units in 2025 and 486 in 2026. What is the 2026 chain index?
= 108
! $\frac{486}{450} \cdot 100 = 108$.

? What does the "ceteris paribus" condition mean?
+ all other factors unchanged
- all factors change at once
- prices are constant
- the model is always accurate
! We examine the effect of one factor while holding the others fixed.

? In the circular flow, which is an injection?
- saving
- taxes
+ exports
- imports
! The injections: investment, government purchases, exports.

? Inflation rose from 3% to 5%. By how many percentage points?
= 2
! $5 - 3 = 2$ percentage points (while this is a 66.7% increase).
```
