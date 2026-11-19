---
title: Practice – Demand, Supply, Equilibrium
summary: Review questions and a summary worksheet on the equilibrium of a GPU rental market for machine learning, its shifts and a price ceiling.
minutes: 60
kind: practice
---

## Review questions

<details>
<summary>1. Why can't we say "demand fell because the price rose"?</summary>

Because a change in the own price changes the **quantity demanded** (movement along the curve), not **demand** (the position of the curve). Demand only changes if another factor (income, the price of a substitute, tastes…) changes.

</details>

<details>
<summary>2. Demand and supply both rise at the same time. What can we say for sure about the equilibrium price and quantity?</summary>

Quantity definitely **rises** (both effects increase it). The direction of price is **uncertain**: rising demand pushes it up, rising supply pushes it down; the stronger effect decides.

</details>

<details>
<summary>3. Why does a shortage usually appear under an official price ceiling?</summary>

Because below the equilibrium price buyers want to buy more, while sellers want (or are able) to sell less. The price cannot rise to balance the two, so the difference appears as a shortage and queues.

</details>

<details>
<summary>4. Why do governments like to raise taxes on goods with inelastic demand (tobacco, alcohol, fuel)?</summary>

Because consumption hardly falls, so tax revenue rises reliably. For health-related goods (tobacco, alcohol) a – small – reduction in consumption is also an aim.

</details>

## Summary worksheet

On a cloud GPU rental market (P: HUF/hour, Q: thousand hours/day):

- demand: $Q_D = 200 - 4P$
- supply: $Q_S = -40 + 2P$

```quiz required
? What is the equilibrium price (HUF/hour)?
= 40
! 200 − 4P = −40 + 2P → 240 = 6P.

? What is the equilibrium quantity (thousand hours)?
= 40
! 200 − 4 · 40.

? A price ceiling of 30 HUF/hour is introduced. How large is the shortage (thousand hours)?
= 60
! Q_D = 80, Q_S = 20.

? Because of an AI boom demand rises to $Q_D = 260 - 4P$. What is the new equilibrium price?
= 50
! 260 − 4P = −40 + 2P → 300 = 6P.

? What is the new equilibrium quantity?
= 60
! 260 − 4 · 50.

? What happened to demand?
+ the demand curve shifted right
- movement along the demand curve
- the supply curve shifted left
! An outside factor (fashion, expectations) changed.

? On another service the price rises by 10% and the quantity demanded falls by 4%. Is demand elastic or inelastic?
- elastic
+ inelastic
! |E| = 0.4 < 1.

? How does revenue change there after the price rise?
+ it rises
- it falls
- it does not change
! With inelastic demand a price rise increases revenue (1.1 · 0.96 = 1.056).
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **Market equilibrium.** Demand is $Q_D = a - bP$, supply is $Q_S = c + dP$. Write the function `equilibrium(a, b, c, d)`, which returns the equilibrium `(price, quantity)` pair rounded to 2 decimals!

```python starter
def equilibrium(a, b, c, d):
    return (round(a / b, 2), 0)
```

<details>
<summary>Solution</summary>

```python solution
def equilibrium(a, b, c, d):
    p = (a - c) / (b + d)                 # a − bP = c + dP
    return (round(p, 2), round(a - b * p, 2))
```

</details>

```python test
assert equilibrium(120, 2, -30, 3) == (30.0, 60.0)
assert equilibrium(200, 4, -40, 2) == (40.0, 40.0)
assert equilibrium(100, 1, -20, 2) == (40.0, 60.0)
assert equilibrium(50, 1, 0, 2) == (16.67, 33.33)
print("All checks passed!")
```

**2.** **Price elasticity with the midpoint method.** Write the function `elasticity(p1, q1, p2, q2)`, which computes the price elasticity of demand from two points: $E = \frac{(q_2 - q_1) / \bar q}{(p_2 - p_1) / \bar p}$, where $\bar q$ and $\bar p$ are the averages of the two values. Round to 2 decimals!

```python starter
def elasticity(p1, q1, p2, q2):
    return round((q2 - q1) / (p2 - p1), 2)
```

<details>
<summary>Solution</summary>

The advantage of the midpoint method is that it gives the same value whether we view the change as a price rise or a price fall.

```python solution
def elasticity(p1, q1, p2, q2):
    dq = (q2 - q1) / ((q1 + q2) / 2)      # relative change in quantity
    dp = (p2 - p1) / ((p1 + p2) / 2)      # relative change in price
    return round(dq / dp, 2)
```

</details>

```python test
assert elasticity(100, 800, 150, 600) == -0.71
assert elasticity(200, 400, 250, 200) == -3.0
assert elasticity(10, 100, 12, 90) == -0.58
print("All checks passed!")
```

**3.** **Who pays the tax?** With linear curves ($Q_D = a - bP$, $Q_S = c + dP$), of a per-unit tax $t$ the buyer bears $\frac{d}{b + d} \cdot t$ and the seller the rest. Write the function `tax_burden(b, d, t)`, which returns the pair `(buyer's share, seller's share)` to 2 decimals!

```python starter
def tax_burden(b, d, t):
    return (round(t / 2, 2), round(t / 2, 2))
```

<details>
<summary>Solution</summary>

```python solution
def tax_burden(b, d, t):
    buyer = d / (b + d) * t               # the less elastic side bears more
    return (round(buyer, 2), round(t - buyer, 2))
```

</details>

```python test
assert tax_burden(2, 3, 10) == (6.0, 4.0)
assert tax_burden(0.5, 3, 7) == (6.0, 1.0)
assert tax_burden(8, 2, 5) == (1.0, 4.0)
print("All checks passed!")
```

### Quick check questions

```quiz
? What happens to the equilibrium price and quantity if demand rises (supply unchanged)?
+ both rise
- the price rises, the quantity falls
- both fall
- the price falls, the quantity rises
! The demand curve shifts right along the supply curve.

? The equilibrium price is 40, the official price ceiling is 30. What develops?
- a surplus
+ a shortage
- nothing changes
- a new equilibrium at a price of 30
! With a ceiling below the equilibrium price, the quantity demanded exceeds the quantity supplied.

? A product's price rises by 10%, the quantity demanded falls by 5%. What is the price elasticity?
= -0,5
= -0.5
= −0,5
= −0.5
! $\frac{-5\%}{10\%} = -0.5$ – inelastic demand.

? With inelastic demand, how does a price rise affect revenue?
+ it rises
- it falls
- it doesn't change
- it falls to zero
! The quantity falls by a smaller proportion than the price rises.

? Which shifts the demand curve for coffee?
- a rise in the price of coffee
+ a rise in the price of tea (a substitute)
- a fall in the price of coffee
- a rise in the cost of producing coffee
! The own price only causes a movement along the curve; the substitute's price shifts the curve.
```
