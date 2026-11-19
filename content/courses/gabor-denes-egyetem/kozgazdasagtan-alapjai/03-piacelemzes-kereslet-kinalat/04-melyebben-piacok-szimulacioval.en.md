---
title: Deeper – Markets by Simulation
summary: How a market finds equilibrium step by step, the link between price elasticity and revenue through a concert ticket, who really pays a tax, how big the deadweight loss is, and why elasticity decides how the tax burden is shared – with a slider chart.
minutes: 40
---

## What you will learn in this lesson

- how a market **gets to** equilibrium without anyone calculating it,
- at which price revenue is **largest**, and what elasticity has to do with it,
- that a tax is **not paid by** whoever it's levied on, but shared according to the elasticities,
- what **deadweight loss** is, and why every tax has a "hidden" cost.

## 1. The invisible hand step by step

Nobody knows the full demand and supply curves – yet the equilibrium price emerges. A simple model: if there are too many goods (surplus), sellers lower the price; if too few (shortage), they raise it. The change in price is proportional to excess demand:

```python run
# How does the market "find" equilibrium? The price moves in proportion to excess demand (tâtonnement)
def demand(p):
    return 120 - 2 * p          # Q_D: thousand units

def supply(p):
    return 3 * p - 30           # Q_S: thousand units

p = 50.0                        # starting price too high
for rnd in range(8):
    excess = demand(p) - supply(p)
    print(f"round {rnd}: P = {p:6.2f} Ft | Q_D = {demand(p):6.1f} | Q_S = {supply(p):6.1f} | excess demand {excess:7.2f}")
    p += 0.1 * excess            # surplus → price falls, shortage → price rises
```

Starting from 50 Ft, the price approaches the 30 Ft equilibrium step by step (where $120 - 2P = 3P - 30$). The distance halves in every round. This is the essence of **decentralised** coordination: the price carries **information** (whether something is scarce) and gives an **incentive** (to produce more or buy less).

**From an engineering point of view:** this is a feedback control loop, like a thermostat. If the reaction is too strong (e.g. 0.5 instead of the 0.1 multiplier), the price overshoots and oscillates – this is seen in reality too, in the pork or memory-chip markets (see the "pork cycle").

## 2. Elasticity and revenue

A concert organiser is looking for the ticket price. A higher price sells fewer tickets – but which is better for revenue?

```python run
# Elasticity and revenue: a concert ticket price (Q = 1200 − 4P, where P is in hundreds of Ft, Q tickets)
print(f"{'price (Ft)':>10} | {'tickets sold':>12} | {'revenue (Ft)':>12} | price elasticity")
for p in [50, 100, 150, 200, 250]:
    q = 1200 - 4 * p
    elasticity = -4 * p / q                      # (dQ/dP) · P/Q
    kind = "elastic" if abs(elasticity) > 1 else "unit elastic" if abs(elasticity) == 1 else "inelastic"
    print(f"{p * 100:>10,} | {q:>12} | {p * 100 * q:>12,} | {elasticity:6.2f} ({kind})")
```

- On the **inelastic** part ($|E| < 1$) raising the price **increases** revenue: buyers barely react.
- On the **elastic** part ($|E| > 1$) raising the price **decreases** revenue: many drop out.
- Revenue is **largest** where the elasticity is exactly $-1$ (here 15,000 Ft).

That's why prices are readily raised for products with inelastic demand (medicine, fuel, specialised software licences), and why firms compete on price where there are many substitutes (streaming services, restaurants). Beware: the revenue maximum isn't the **profit** maximum – for that you need to look at costs too (topic 4).

## 3. Who pays the tax?

The government levies a tax of 10 Ft per unit on **sellers**. Let's see how the price and quantity change:

```python run
# Who pays the tax? A per-unit tax of t Ft on sellers (Q_D = 120 − 2P, Q_S = 3(P − t) − 30)
t = 10
p_buyer = (150 + 3 * t) / 5                # 120 − 2P = 3P − 3t − 30 → P = (150 + 3t)/5
p_seller = p_buyer - t                     # what the seller keeps
q = 120 - 2 * p_buyer
print(f"before the tax: P = 30, Q = 60")
print(f"after the tax: the buyer pays {p_buyer:.0f} Ft (+{p_buyer - 30:.0f}), the seller keeps {p_seller:.0f} Ft (−{30 - p_seller:.0f}), Q = {q:.0f}")
print(f"tax revenue: {t * q:.0f} | deadweight loss: {0.5 * t * (60 - q):.0f} (thousand Ft, if Q is in thousand units)")
```

Although the sellers pay the tax in, **buyers bear 6 Ft** of the 10 Ft (a higher price), and sellers only 4 Ft (they keep less). If it were levied on buyers, the result would be **the same** – how the burden is shared doesn't depend on the law, but on the slopes of the curves.

The **deadweight loss** is value that shows up **with nobody**: 12 thousand units of trade simply don't happen, although buyers would have valued them more than they cost to produce. This is the "hidden" social cost of the tax, on top of the tax revenue.

```plot
title: The tax drives a wedge between the buyer's and the seller's price
x: 0, 120
y: 0, 70
param: t = 10, 0, 30, 1
f: 60 - x/2 # demand
f: 10 + x/3 # supply
dash: 10 + x/3 + t # supply + tax
point: 60 - 1.2*t, 30 + 0.6*t # buyer's price
point: 60 - 1.2*t, 30 - 0.4*t # seller's price
```

Move the slider: the bigger the tax, the smaller the volume of trade, and the deadweight loss (the "triangle" between the two points) grows with the **square** of the tax – double the tax, four times the loss.

## 4. Elasticity decides who bears the burden

```python run
# The split of the tax burden depends on elasticities: buyer's share ≈ |supply slope| / (sum)
# linear curves: Q_D = a − b·P, Q_S = c + d·P; with a tax t the buyer's price rises by d·t/(b + d)
cases = [("cigarettes (inelastic demand)", 0.5, 3),
         ("average product", 2, 3),
         ("restaurant (elastic demand)", 8, 3)]
for name, b, d in cases:
    buyer_share = d / (b + d)
    print(f"{name:<31}: the buyer bears {buyer_share:.0%}, the seller {1 - buyer_share:.0%}")
```

The larger part of the burden is always borne by the side that **can dodge it less** (the less elastic one). Smokers can't easily quit, so they pay most of the excise tax; restaurant guests, on the other hand, can easily eat at home, so there the seller swallows most of the tax. The same logic applies to taxes on wages (employer or employee?) and to platform fees too (does the app store's 30% commission burden the developer or the buyer?).

## Summary

- The price moves in response to excess demand and, as feedback, guides the market to equilibrium.
- With inelastic demand a price rise increases revenue, with elastic demand it decreases it; the maximum is at $|E| = 1$.
- The tax burden is shared according to the elasticities, regardless of who it's levied on; the less elastic side bears more.
- Deadweight loss: valuable trades that don't happen because of the tax; it grows roughly with the square of the tax.

## Lesson exercise

```quiz required
? $Q_D = 100 - P$ and $Q_S = 2P - 20$. What is the equilibrium price?
= 40
! $100 - P = 2P - 20 \Rightarrow 3P = 120$.

? Demand is $Q = 600 - 2P$. At which price is revenue maximal?
= 150
! Revenue is $P(600 - 2P)$, its maximum is at $P = 150$ (here $|E| = 1$).

? A product's price elasticity is $-1.5$. By how many percent does the quantity demanded change if the price rises by 10%?
= -15
= −15
! $-1.5 \cdot 10\% = -15\%$.

? A product's demand is very inelastic, its supply elastic. Who bears the larger part of a new tax?
+ the buyers
- the sellers
- it's split equally
- the government
! The less elastic side bears more.

? Because of a 4 Ft tax, trade falls from 50 thousand units to 40 thousand. How big is the deadweight loss (thousand Ft)?
= 20
! $\frac12 \cdot 4 \cdot (50 - 40) = 20$.
```
