---
title: Practice – Scarcity and Economic Systems
summary: Review questions and a summary worksheet on the production possibility frontier, opportunity cost and economic systems.
minutes: 55
kind: practice
---

## Review questions

<details>
<summary>1. Why do we say "there is no such thing as a free lunch"?</summary>

Because every choice has an opportunity cost. Even if you pay no money for something, you sacrifice your time, your attention or another option. With a "free" app, for example, you pay with your data and attention.

</details>

<details>
<summary>2. Why is the production possibility frontier usually concave (bowed outwards)?</summary>

Because resources are not equally suited to every task. As we produce more and more of one good, we have to reallocate less and less suitable resources, so we must give up more and more of the other good (increasing opportunity cost).

</details>

<details>
<summary>3. What are the two biggest weaknesses of a command economy?</summary>

The **information problem** (the central planner cannot know the needs of millions and local conditions) and the **lack of incentives** (extra work and innovation do not pay). The results are shortages, queues, low quality and slow development.

</details>

<details>
<summary>4. Why does the market under-supply public goods?</summary>

Because nobody can be excluded from using them, so everyone can free ride: use them without paying. A private firm could not recover its costs, so they are typically provided by the state from taxes.

</details>

<details>
<summary>5. A start-up has been developing a product for 18 months, and tests show there is no demand for it. What would you advise based on marginal analysis?</summary>

The money and time spent so far are sunk costs and do not matter for the decision. Compare the benefit expected in return for the costs of **further** development – if it is small, it is worth stopping or changing direction (_pivot_).

</details>

## Summary worksheet

A small country can produce **laptops** and **wheat** in a year. Its production possibilities (straight lines between the points):

| Combination        | A   | B   | C   | D   | E   |
| ------------------ | --- | --- | --- | --- | --- |
| Laptops (thousand) | 0   | 10  | 20  | 30  | 40  |
| Wheat (thousand t) | 100 | 95  | 80  | 55  | 0   |

```quiz required
? What is the opportunity cost, in thousand tonnes of wheat, of moving from B to C (10 thousand more laptops)?
= 15
! 95 − 80 = 15.

? What is the opportunity cost, in thousand tonnes of wheat, of moving from D to E?
= 55
! 55 − 0 = 55.

? What does the difference between the two previous answers show?
- the PPF is a straight line
+ increasing opportunity cost
- laptops became cheaper
- the table is wrong
! The more laptops we make, the more expensive (in wheat) the next one is.

? The country produces 20 thousand laptops and 60 thousand tonnes of wheat. What kind of point is this?
- efficient
+ inefficient
- unattainable
! At C, 80 thousand t of wheat would be possible alongside 20 thousand laptops.

? Are 30 thousand laptops and 70 thousand tonnes of wheat currently attainable?
- yes
+ no
! At D, 30 thousand laptops allow at most 55 thousand t of wheat.

? Which event would push the country's PPF outwards?
- rising unemployment
+ a more efficient chip manufacturing technology
- a rise in the price of wheat
- closing a factory
! Better technology = economic growth.

? A student spends 4 hours studying instead of working for 2,800 HUF an hour. What is the opportunity cost in HUF?
= 11200
! 4 · 2,800.
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **Opportunity cost.** A worker can make `a_units` units of product A or `b_units` units of product B in a day. Write the function `opp_cost(a_units, b_units)`, which tells how many units of B they give up for each unit of A (rounded to 2 decimals)!

```python starter
def opp_cost(a_units, b_units):
    return round(a_units / b_units, 2)
```

<details>
<summary>Solution</summary>

If 6 A or 3 B are made in a day, then 6 A are "worth" the same as 3 B, so the price of 1 A is 0.5 B.

```python solution
def opp_cost(a_units, b_units):
    return round(b_units / a_units, 2)    # making 1 A takes 1/a_units days, in which b_units/a_units B would be made
```

</details>

```python test
assert opp_cost(6, 3) == 0.5
assert opp_cost(4, 12) == 3.0
assert opp_cost(5, 5) == 1.0
assert opp_cost(3, 10) == 3.33
print("All checks passed!")
```

**2.** **Marginal analysis.** The list `benefit` gives the total benefit after 0, 1, 2, … units (the first element is always 0). Every unit costs the same, `cost`. Write the function `optimum(benefit, cost)`, which tells how many units are worth choosing: keep increasing as long as the next unit's marginal benefit is **greater** than the marginal cost!

```python starter
def optimum(benefit, cost):
    return len(benefit) - 1
```

<details>
<summary>Solution</summary>

The starter code would always choose the most – but the point of marginal analysis is that because of diminishing marginal benefit, beyond some point it's no longer worth it.

```python solution
def optimum(benefit, cost):
    units = 0
    while units + 1 < len(benefit) and benefit[units + 1] - benefit[units] > cost:
        units += 1                         # the next unit is still worth it
    return units
```

</details>

```python test
assert optimum([0, 30, 55, 75, 90, 100, 106], 12) == 4
assert optimum([0, 10, 18, 24], 5) == 3
assert optimum([0, 4, 7], 5) == 0
assert optimum([0, 50, 90, 120, 140], 25) == 3
print("All checks passed!")
```

**3.** **Comparative advantage.** Two people (`"Anna"` and `"Ben"`) do two tasks; the dictionary `minutes` gives how many minutes one unit takes them (e.g. `{"Anna": (30, 60), "Ben": (60, 90)}`, the pairs being (cooking, cleaning)). Write the function `who_cleans(minutes)`, which returns the name of the one who has a **comparative advantage** in cleaning (the smaller opportunity cost of cleaning, measured in cooking)!

```python starter
def who_cleans(minutes):
    return min(minutes, key=lambda name: minutes[name][1])
```

<details>
<summary>Solution</summary>

The starter code looks at absolute advantage (who cleans faster) – but for trade, what counts is the relative, i.e. comparative, advantage.

```python solution
def who_cleans(minutes):
    # opportunity cost of 1 cleaning = cleaning time / cooking time (this many meals are given up)
    return min(minutes, key=lambda name: minutes[name][1] / minutes[name][0])
```

</details>

```python test
assert who_cleans({"Anna": (30, 60), "Ben": (60, 90)}) == "Ben"
assert who_cleans({"Anna": (20, 30), "Ben": (40, 100)}) == "Anna"
assert who_cleans({"Anna": (10, 50), "Ben": (30, 60)}) == "Ben"
print("All checks passed!")
```

### Quick check questions

```quiz
? A student can spend Saturday afternoon studying or doing a job paying 12,000 Ft; they choose to study. What is the opportunity cost of the decision (Ft)?
= 12000
! The value of the best alternative forgone.

? Which is a sunk cost?
- next month's rent
+ the price of a software licence bought last year but not used
- the expected cost of a new project
- next semester's tuition
! It has already been paid, and no decision will bring it back.

? A country can produce 100 units of grain or 50 units of steel. How many units of grain is the opportunity cost of 1 unit of steel?
= 2
! $100 / 50 = 2$.

? In which economic system does the price primarily decide what and how much is produced?
+ market economy
- planned economy
- traditional economy
- none of them
! In a market economy prices are set by demand and supply.

? What does a point inside the production possibility frontier mean?
- unattainable production
+ unused resources (waste)
- efficient production
- technological progress
! With the same resources more of both goods could be produced.
```
