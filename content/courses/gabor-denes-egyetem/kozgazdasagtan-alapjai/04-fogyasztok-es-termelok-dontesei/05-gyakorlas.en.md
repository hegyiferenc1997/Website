---
title: Practice – Consumers and Producers
summary: Review questions and a summary worksheet on a SaaS company's costs, profit maximum and market position.
minutes: 60
kind: practice
---

## Review questions

<details>
<summary>1. Why is it not worth a streaming service buying every film available?</summary>

Because of diminishing marginal utility, expanding the catalogue brings fewer and fewer new subscribers after a while, while the licence fee (marginal cost) does not fall. It should stop where the marginal revenue of the next film no longer covers its marginal cost.

</details>

<details>
<summary>2. Why can a software company's average cost fall almost without limit?</summary>

Because most of its costs are fixed (development) and its marginal cost is close to zero. The same fixed cost is spread over more users, so the cost per user keeps falling.

</details>

<details>
<summary>3. Why may a loss-making firm keep operating in the short run?</summary>

Because it has to pay its fixed costs (e.g. rent) even if it shuts down. If revenue covers at least the variable costs, operating also earns back part of the fixed costs, so the loss is smaller than when shut down.

</details>

<details>
<summary>4. How does the prisoner's dilemma explain why cartels often break up?</summary>

Each cartel member individually gains by secretly selling cheaper and taking a larger share of the market. If one member cheats, the others follow, and the price returns closer to the competitive level. The ban and high fines reinforce this.

</details>

## Summary worksheet

A SaaS company's monthly data:

| Subscribers (Q, thousand)     | 1   | 2   | 3   | 4   | 5   |
| ----------------------------- | --- | --- | --- | --- | --- |
| Price (thousand HUF / person) | 5   | 4.5 | 4   | 3.5 | 3   |
| Total cost (million HUF)      | 3   | 5   | 7   | 11  | 16  |

(Revenue in million HUF: Q · P, e.g. 1 thousand people · 5 thousand HUF = 5 million HUF.)

```quiz required
? What is the revenue with 3 thousand subscribers (million HUF)?
= 12
! 3 · 4.

? What is the profit with 3 thousand subscribers (million HUF)?
= 5
! 12 − 7.

? At how many thousand subscribers is profit highest?
= 3
! Profits: 2, 4, 5, 3, −1 million HUF. With marginal analysis: MR of the 3rd thousand is 12 − 9 = 3 > MC = 7 − 5 = 2, for the 4th 14 − 12 = 2 < MC = 4.

? Which market structure would you put the market for note-taking apps in (many firms, each with slightly different features)?
- perfect competition
+ monopolistic competition
- oligopoly
- monopoly
! Differentiated products, easy entry.

? A student would pay at most 9,000 HUF for a textbook and buys it for 6,500 HUF. What is their consumer surplus (HUF)?
= 2500
! 9,000 − 6,500.

? The company's fixed cost is 2 million HUF a month. What is the variable cost with 4 thousand subscribers (million HUF)?
= 9
! TC − FC = 11 − 2.

? What is the average cost with 4 thousand subscribers (thousand HUF / person)?
= 2,75
= 2.75
! 11 million / 4 thousand = 2.75 thousand HUF.
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **Average and marginal cost.** The dictionary `costs` gives the total cost at a few production levels (e.g. `{0: 20000, 100: 35000, 200: 45000}`). Write the functions `average_cost(costs, q)` and `marginal_cost(costs, q1, q2)`: the first gives the total cost per unit at level `q`, the second the extra cost per unit between `q1` and `q2`, rounded to 1 decimal!

```python starter
def average_cost(costs, q):
    return round(costs[q], 1)

def marginal_cost(costs, q1, q2):
    return round(costs[q2] / q2, 1)
```

<details>
<summary>Solution</summary>

```python solution
def average_cost(costs, q):
    return round(costs[q] / q, 1)                            # TC / Q

def marginal_cost(costs, q1, q2):
    return round((costs[q2] - costs[q1]) / (q2 - q1), 1)     # ΔTC / ΔQ
```

</details>

```python test
k = {0: 20000, 100: 35000, 200: 45000, 300: 53000, 400: 64000}
assert average_cost(k, 200) == 225.0
assert average_cost(k, 300) == 176.7
assert marginal_cost(k, 100, 200) == 100.0
assert marginal_cost(k, 300, 400) == 110.0
assert marginal_cost(k, 0, 100) == 150.0
print("All checks passed!")
```

**2.** **Monopoly optimum.** Demand is $P = a - bQ$, marginal cost is a constant `mc`. Marginal revenue is $MR = a - 2bQ$. Write the function `monopoly(a, b, mc)`, which returns the profit-maximising triple `(quantity, price, profit)` (without fixed cost), rounded to 2 decimals!

```python starter
def monopoly(a, b, mc):
    q = (a - mc) / b                       # this is the competitive quantity
    p = a - b * q
    return (round(q, 2), round(p, 2), round((p - mc) * q, 2))
```

<details>
<summary>Solution</summary>

The starter code gives the competitive solution ($P = MC$, zero profit) – the monopolist produces less, at a higher price.

```python solution
def monopoly(a, b, mc):
    q = (a - mc) / (2 * b)                 # MR = MC
    p = a - b * q                          # the price is read off the demand curve
    return (round(q, 2), round(p, 2), round((p - mc) * q, 2))
```

</details>

```python test
assert monopoly(100, 1, 20) == (40.0, 60.0, 1600.0)
assert monopoly(120, 1, 20) == (50.0, 70.0, 2500.0)
assert monopoly(200, 2, 40) == (40.0, 120.0, 3200.0)
print("All checks passed!")
```

**3.** **Produce or shut down?** Write the function `decision(price, atc_min, avc_min)`, which tells what a competitive firm should do in the short run: `"profitable"` if the price is above the minimum of average total cost; `"produce at a loss"` if it's between the minimum of average total cost and that of average variable cost; `"shut down"` if it's below (or equal to) the minimum of AVC!

```python starter
def decision(price, atc_min, avc_min):
    return "profitable" if price > atc_min else "shut down"
```

<details>
<summary>Solution</summary>

```python solution
def decision(price, atc_min, avc_min):
    if price > atc_min:
        return "profitable"
    if price > avc_min:
        return "produce at a loss"         # this way it still covers part of the fixed cost
    return "shut down"
```

</details>

```python test
assert decision(170, 160, 110) == "profitable"
assert decision(130, 160, 110) == "produce at a loss"
assert decision(100, 160, 110) == "shut down"
assert decision(110, 160, 110) == "shut down"
print("All checks passed!")
```

### Quick check questions

```quiz
? A consumer spends 6000 Ft on coffee (500 Ft) and cake (1000 Ft). At most how many cakes can they buy if they also buy 4 coffees?
= 4
! $6000 - 4 \cdot 500 = 4000$, that's 4 cakes.

? Which is a fixed cost for a bakery (in the short run)?
- flour
+ rent
- the energy cost of baking
- packaging
! It must be paid regardless of the quantity produced.

? In which market structure are there many small players selling an identical product?
+ perfect competition
- monopoly
- oligopoly
- monopolistic competition
! None of the players can influence the price.

? Production rises from 10 to 11 units, total cost from 500 to 540. What is the marginal cost?
= 40
! $540 - 500 = 40$.

? A firm's accounting profit is 5 million Ft; the owner would earn 6 million Ft elsewhere. What is the economic profit (million Ft)?
= -1
= −1
! Economic profit also subtracts the opportunity cost: $5 - 6 = -1$.
```
