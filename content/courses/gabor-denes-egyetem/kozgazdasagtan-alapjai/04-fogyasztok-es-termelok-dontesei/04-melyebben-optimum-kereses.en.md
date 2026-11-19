---
title: Deeper – Finding the Optimum, from Consumer to Duopoly
summary: Computing the consumer optimum by trying every basket, a bakery's cost table (why marginal cost crosses average cost at its minimum), comparing monopoly and competition with a slider chart, and a duopoly where the two firms' reactions settle into equilibrium.
minutes: 40
---

## What you will learn in this lesson

- how a consumer (and a program) finds the **best basket**,
- how to read the minimum, marginal cost and shutdown point from a **cost table**,
- how much society **loses** from a monopoly,
- how two firms reacting to each other reach **equilibrium**.

## 1. The consumer optimum by machine

You have 12,000 Ft a month for entertainment: a cinema ticket is 3000 Ft, a month of streaming 2000 Ft. Each extra unit of either gives less enjoyment. The program tries **every** affordable basket:

```python run
# Consumer optimum: 12,000 Ft a month for entertainment – cinema ticket (3000 Ft) or a month of streaming (2000 Ft)?
# Diminishing marginal utility: every extra unit brings less enjoyment (in utility points)
cinema = [0, 60, 100, 125, 135, 140]        # total utility after 0…5 cinema visits
stream = [0, 50, 85, 105, 115, 120, 122]    # total utility after 0…6 months of streaming (e.g. different services)
budget, p_cinema, p_stream = 12000, 3000, 2000

best = max(((cinema[c] + stream[s], c, s)
            for c in range(len(cinema)) for s in range(len(stream))
            if c * p_cinema + s * p_stream <= budget))
print(f"best basket: {best[1]} cinema + {best[2]} streaming, total utility {best[0]}")

c, s = best[1], best[2]
print(f"marginal utility / price of the last cinema visit: {(cinema[c] - cinema[c - 1]) / p_cinema * 1000:.1f} points / 1000 Ft")
print(f"marginal utility / price of the last streaming month: {(stream[s] - stream[s - 1]) / p_stream * 1000:.1f} points / 1000 Ft")
```

The best choice is 2 cinema visits and 3 months of streaming. According to theory, at the optimum the **marginal utility per forint** is equal: $\frac{MU_1}{P_1} = \frac{MU_2}{P_2}$ – if one were larger, it would be worth reallocating. Here the two ratios don't match exactly (13.3 and 10), because we can only buy whole units: a third cinema visit would mean giving up one and a half months of streaming. That's how we decide in reality too: we roughly balance "what's worth spending" our next thousand forints on.

## 2. The secrets of the cost table

A bakery's fixed cost is 20,000 Ft a day (rent, machines), the variable cost grows with the number of loaves:

```python run
# Cost curves: a small bakery's daily costs (Ft), the fixed cost is 20,000 Ft
fixed = 20_000
variable = {100: 15_000, 200: 25_000, 300: 33_000, 400: 44_000, 500: 60_000, 600: 84_000}  # loaves/day

prev = fixed                                      # at Q = 0 there is only the fixed cost
print(f"{'Q':>4} | {'TC':>7} | {'ATC':>6} | {'AVC':>6} | {'MC (Ft/unit)':>12}")
for q, vc in variable.items():
    tc = fixed + vc
    mc = (tc - prev) / 100                        # marginal cost: the cost of the extra 100 units, per unit
    print(f"{q:>4} | {tc:>7,} | {tc / q:6.1f} | {vc / q:6.1f} | {mc:12.1f}")
    prev = tc
```

What can we see in it?

- The **marginal cost (MC)** first falls (thanks to the division of labour they get more efficient), then rises (the oven and the space are limited: **diminishing returns**).
- MC crosses both the average variable cost (AVC) and the average total cost (ATC) **from below** – each at its **minimum**. It makes sense: if the next loaf is cheaper than the average, it pulls the average down; if it's more expensive, it pulls it up. The minimum of ATC here is around 400–500 loaves (160 Ft/unit), where $MC = ATC$.
- **Shutdown point:** in the short run it's worth baking even if the price is below ATC but above AVC (min. 110 Ft) – the fixed cost must be paid anyway, and this way we cover at least part of it. Below 110 Ft, however, it's better to close.

## 3. Monopoly versus competition

Demand: $P = 100 - Q$, marginal cost: $MC = 20$. In a competitive market the price falls to marginal cost; the monopolist, however, produces where **marginal revenue** equals marginal cost ($MR = 100 - 2Q = 20$):

```python run
# Monopoly or competition? Demand: P = 100 − Q, constant marginal cost: MC = 20
def monopoly_profit():
    best = max(range(0, 101), key=lambda q: (100 - q) * q - 20 * q)   # profit = TR − TC
    return best, 100 - best

q_m, p_m = monopoly_profit()
q_c, p_c = 80, 20                                  # in competition P = MC → Q = 80
print(f"monopoly:    Q = {q_m}, P = {p_m}, profit = {(p_m - 20) * q_m}")
print(f"competition: Q = {q_c}, P = {p_c}, profit = 0")
cs_m = 0.5 * q_m * (100 - p_m)
cs_c = 0.5 * q_c * (100 - p_c)
print(f"consumer surplus: monopoly {cs_m:.0f}, competition {cs_c:.0f}")
print(f"deadweight loss due to the monopoly: {0.5 * (q_c - q_m) * (p_m - 20):.0f}")
```

The monopolist sells **half as much**, at three times the price, and earns a profit of 1600. Consumer surplus falls from 3200 to 800: 1600 of this moves to the monopolist, but 800 goes to **nobody** (deadweight loss) – these are the buyers who would pay more than the cost, but no longer buy at the monopoly price.

```plot
title: The monopolist produces where MR = MC
x: 0, 100
y: 0, 100
param: c = 20, 0, 80, 5
f: 100 - x # demand
f: 100 - 2*x # marginal revenue (MR)
dash: c # marginal cost (MC)
point: (100 - c)/2, (100 + c)/2 # monopoly
point: 100 - c, c # competition
```

With the slider you can change the marginal cost: the monopoly price is always "halfway" between demand and MC ($\frac{100 + c}{2}$), so it passes on only **half** of a cost reduction to buyers.

## 4. Duopoly: when two firms watch each other

Two firms in the same market ($P = 100 - Q_1 - Q_2$, $MC = 20$). Each adjusts its quantity to **the other's** (best response: $q = \frac{80 - q_{\text{other}}}{2}$), and they react in turn:

```python run
# Duopoly (Cournot): two firms take turns giving their best response to the other's quantity
# Demand: P = 100 − (q1 + q2), MC = 20 for both. Best response: q = (80 − other) / 2
q1, q2 = 80.0, 0.0                       # at first firm 1 is a monopolist
for rnd in range(1, 9):
    q2 = (80 - q1) / 2                   # firm 2 reacts
    q1 = (80 - q2) / 2                   # firm 1 reacts
    if rnd in (1, 2, 3, 8):
        p = 100 - q1 - q2
        print(f"round {rnd}: q1 = {q1:5.2f}, q2 = {q2:5.2f}, market price = {p:5.2f}")
print("equilibrium: q1 = q2 = 80/3 ≈ 26.67, price ≈ 46.67 (monopoly: 60, competition: 20)")
```

The reactions **settle into equilibrium** (Cournot–Nash equilibrium): 26.67 units each, price 46.67 – between monopoly (60) and competition (20). The more firms there are, the closer the price gets to marginal cost. This gives one of the basic principles of competition authorities (in Hungary the GVH, in the EU the European Commission): a merger that reduces the number of players can lead to price increases, so it requires approval.

**Analogy:** it's like two restaurants in the same street – each watches how many guests the other takes, and adjusts its offering to that.

## Summary

- Consumer optimum: equalising the marginal utilities per forint within the budget constraint.
- MC crosses ATC and AVC at their minimum; in the short run the minimum of AVC is the shutdown point.
- Monopoly: $MR = MC$, smaller quantity, higher price, deadweight loss.
- Duopoly: the equilibrium of mutual best responses; the price is between monopoly and competition.

## Lesson exercise

```quiz required
? For a consumer, coffee's marginal utility is 8 points per 1000 Ft, cake's 12 points per 1000 Ft. What should they do?
- buy more coffee and less cake
+ buy more cake and less coffee
- change nothing
- buy less of both
! The marginal utility per forint is larger for cake, so it's worth reallocating towards it.

? A firm's total cost at 250 units is 50,000 Ft. What is the average cost (Ft/unit)?
= 200
! $50\,000 / 250 = 200$.

? Monopoly: demand is $P = 120 - Q$, marginal cost is 20. How much does the monopolist produce? ($MR = 120 - 2Q$)
= 50
! $120 - 2Q = 20 \Rightarrow Q = 50$ (the price is $70$).

? In the short run, when is it worth a firm continuing to produce even at a loss?
- never
+ if the price is above average variable cost
- if the price is above average fixed cost
- if the marginal cost is zero
! That way it covers part of the fixed cost on top of the variable cost.

? Two firms in a Cournot duopoly: $P = 100 - Q$, $MC = 10$ for both; in equilibrium each produces 30 units. What is the market price?
= 40
! $100 - 30 - 30 = 40$.
```
