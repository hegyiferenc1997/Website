---
title: Practice – Growth and Development
summary: Review questions and a summary worksheet on growth rates, the rule of 70, the sources of growth and measuring inequality.
minutes: 55
kind: practice
---

## Review questions

<details>
<summary>1. Why can a country not be made permanently rich simply by continuously increasing investment?</summary>

Because of diminishing returns: each extra unit of capital adds less and less output, and capital also wears out (depreciation). At some point investment is only enough to replace existing capital. Sustained growth requires technological progress.

</details>

<details>
<summary>2. Why can GDP per capita be misleading as a measure of living standards?</summary>

Because it is an average: it does not show distribution (Gini), and it leaves out health, education, leisure and the state of the environment. That is why we use the HDI and inequality measures as complements.

</details>

<details>
<summary>3. How does the institutional approach explain the difference between North and South Korea?</summary>

The two countries had similar geography, culture and starting points, but South Korea built inclusive economic institutions (markets, property rights, openness, later democracy), while North Korea built an extractive, centrally planned system. The difference in incentives led to a huge gap in living standards.

</details>

<details>
<summary>4. Why can a carbon price be more efficient than the state telling every firm how much to cut?</summary>

Because with a price, those for whom cutting is cheaper cut more, while those for whom it is more expensive buy allowances instead. So the same total reduction is achieved at the lowest total cost, and the price provides a continuous incentive for new, cleaner technologies.

</details>

## Summary worksheet

```quiz required
? A country's real GDP rose from 400 to 418. What is the growth rate in percent?
= 4,5
= 4.5
! 18 / 400.

? In the same year the population grew by 1.5%. Approximately by what percentage did GDP per capita grow?
= 3
= 3%
! 4.5 − 1.5.

? By the rule of 70, in how many years do living standards double with 2% per capita growth a year?
= 35
! 70 / 2.

? What does a starting value of 100 become after 2 years of 10% annual growth?
= 121
! 100 · 1.1².

? According to a Lorenz curve, the bottom 50% of the population receives 50% of income and the bottom 80% receives 80%. What is the Gini coefficient?
= 0
! The curve is the diagonal – perfect equality.

? Which raises total factor productivity?
- hiring more workers with the same technology
+ introducing a new, more efficient production process
- population growth
- increasing the money supply
! "More from the same."
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **Doubling time exactly.** The rule of 70 ($70 / g$) is only an approximation. Write the function `doubling(g)`, which tells in how many years GDP doubles at `g` % annual growth – exactly, with logarithms ($\frac{\ln 2}{\ln(1 + g/100)}$), to 1 decimal!

```python starter
def doubling(g):
    return round(70 / g, 1)
```

<details>
<summary>Solution</summary>

At low rates the rule of 70 is almost exact (at 2% both give 35 years), but at high rates it visibly underestimates.

```python solution
import math

def doubling(g):
    return round(math.log(2) / math.log(1 + g / 100), 1)   # solving (1 + g)^t = 2
```

</details>

```python test
assert doubling(2) == 35.0
assert doubling(3.5) == 20.1
assert doubling(7) == 10.2
assert doubling(10) == 7.3
print("All checks passed!")
```

**2.** **Catching up.** A poorer country's GDP per capita is `gdp_a`, its annual growth `g_a` %; a richer one's is `gdp_b` and `g_b` %. Write the function `catch_up_years(gdp_a, g_a, gdp_b, g_b)`, which tells after how many full years the first reaches (or overtakes) the second! If not even within 1000 years, return `None`; if it already isn't smaller, return `0`.

```python starter
def catch_up_years(gdp_a, g_a, gdp_b, g_b):
    return round((gdp_b - gdp_a) / (gdp_a * (g_a - g_b) / 100))
```

<details>
<summary>Solution</summary>

The starter code assumes linear growth, and with equal rates it would divide by zero. Because of compound interest, real catching up is faster than the linear estimate.

```python solution
def catch_up_years(gdp_a, g_a, gdp_b, g_b):
    years = 0
    while gdp_a < gdp_b:
        if years >= 1000:
            return None                    # practically never
        gdp_a *= 1 + g_a / 100             # both grow with compound interest
        gdp_b *= 1 + g_b / 100
        years += 1
    return years
```

</details>

```python test
assert catch_up_years(20_000, 5, 40_000, 2) == 24
assert catch_up_years(10_000, 6, 50_000, 1.5) == 38
assert catch_up_years(20_000, 2, 40_000, 2) is None
assert catch_up_years(30_000, 1, 20_000, 3) == 0
print("All checks passed!")
```

**3.** **Gini coefficient from quintiles.** The income shares of the five quintiles of the population by income (from the poorest) are `shares` (%, 100 in total). Write the function `gini(shares)`, which computes the Gini coefficient from the area under the Lorenz curve (with trapezoids): $G = 1 - 2 \cdot \text{area}$, to 3 decimals!

```python starter
def gini(shares):
    return round(1 - shares[0] / 20, 3)
```

<details>
<summary>Solution</summary>

The last test shows the limit of computing from quintiles: with total inequality the real Gini would be 1, but with five groups at most 0.8 can come out – the differences within a group are invisible.

```python solution
def gini(shares):
    area, cumulative = 0.0, 0.0
    for s in shares:
        new = cumulative + s / 100
        area += 0.2 * (cumulative + new) / 2   # trapezoid: width × average height
        cumulative = new
    return round(1 - 2 * area, 3) + 0.0
```

</details>

```python test
assert gini([20, 20, 20, 20, 20]) == 0.0
assert gini([8, 13, 17, 23, 39]) == 0.288
assert gini([4, 9, 15, 22, 50]) == 0.42
assert gini([0, 0, 0, 0, 100]) == 0.8
print("All checks passed!")
```

### Quick check questions

```quiz
? What does GDP per capita at purchasing power parity (PPP) measure?
+ average income, taking the countries' different price levels into account
- the country's total wealth
- only exports
- the income distribution
! At PPP the same money buys the same basket everywhere.

? What is the main message of the Solow model about long-run growth?
- capital accumulation increases GDP per capita without limit
+ because of the diminishing returns to capital, in the long run growth is driven by technological progress
- population growth is the most important
- growth depends solely on natural resources
! Capital brings less and less extra; the source of lasting growth is technology.

? A country grows by 3.5% a year. According to the rule of 70, in how many years does GDP double?
= 20
! $70 / 3.5 = 20$.

? What does a Gini coefficient close to 0 mean?
+ a very equal income distribution
- a very unequal income distribution
- low GDP
- high inflation
! 0: everyone has the same; 1: one person has everything.

? Which is NOT a component of the HDI (Human Development Index)?
- life expectancy
- education
- income per capita
+ military spending
! The HDI measures health, education and income.
```
