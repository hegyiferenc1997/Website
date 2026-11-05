---
title: Market Equilibrium and Government Intervention
summary: Where do demand and supply intersect? Calculating the equilibrium price and quantity, shortage and surplus, the effect of shifting curves, price ceilings, price floors and taxes.
minutes: 30
---

## What you will learn

- what **market equilibrium** is and how to calculate it,
- what a **shortage** and a **surplus** are and how they disappear,
- how equilibrium changes when the curves **shift**,
- what happens with a **price ceiling**, a **price floor** and a **tax**.

## Equilibrium

**Market equilibrium** is where **quantity demanded = quantity supplied**. The corresponding price is the **equilibrium price** ($P^{\ast}$), the quantity is the **equilibrium quantity** ($Q^{\ast}$).

In the chart demand is $P = a - 2Q$ and supply is $P = c + Q$. Try the sliders!

```plot
title: Market equilibrium
x: 0, 60
y: 0, 150
param: a = 100, 60, 140, 5
param: c = 10, 0, 50, 5
f: a - 2x # demand
f: c + x # supply
point: (a - c)/3, c + (a - c)/3 # equilibrium
value: equilibrium quantity Q* = (a - c)/3
value: equilibrium price P* = c + (a - c)/3
```

- If **demand rises** (a ↑): both price and quantity **rise**.
- If **supply falls** (c ↑): the price **rises**, the quantity **falls**.

## Calculating equilibrium

The functions are often given solved for quantity:

- demand: $Q_D = 100 - 2P$
- supply: $Q_S = -20 + 4P$

In equilibrium $Q_D = Q_S$:

$$ 100 - 2P = -20 + 4P \;\Rightarrow\; 120 = 6P \;\Rightarrow\; P^{\ast} = 20 $$

Substituting back: $Q^{\ast} = 100 - 2 \cdot 20 = 60$.

## Shortage and surplus

- If the price is **below equilibrium**: $Q_D > Q_S$ → **shortage** (excess demand). People queue, buyers bid → the price **rises**.
- If the price is **above equilibrium**: $Q_S > Q_D$ → **surplus** (excess supply). Goods stay in stock → sellers **cut prices**.

In a free market this process pushes the price towards equilibrium.

## Price ceiling (maximum price)

The government sets an **upper limit** on the price, **below** the equilibrium price. Its aim is to protect buyers (e.g. rents, fuel, basic foods).

In the example above, with a price ceiling at 15 HUF: $Q_D = 70$, $Q_S = 40$ → a **shortage of 30 units**.

Consequences: shortages, queues, black markets, falling quality, less investment. In Hungary, during the fuel price cap from 2021 to the end of 2022, temporary petrol shortages appeared at filling stations in late 2022.

## Price floor (minimum price)

The government sets a **lower limit** on the price, **above** the equilibrium price. Its aim is to protect sellers (e.g. the **minimum wage** on the labour market – topic 8, guaranteed agricultural prices).

In the example, with a price floor at 25 HUF: $Q_D = 50$, $Q_S = 80$ → a **surplus of 30 units**.

## Tax

If the government levies a per-unit tax (e.g. excise duty on cigarettes), the supply curve shifts **up by the amount of the tax**. In the new equilibrium **the price paid by buyers is higher and the quantity is lower**.

Buyers and sellers **share** the burden of the tax: the **more inelastic** side bears the larger part. Demand for cigarettes is inelastic, so smokers pay most of the tax.

## Summary

- Equilibrium: $Q_D = Q_S$; we calculate it from the equation.
- Price below equilibrium → shortage; above → surplus.
- Price ceiling (below equilibrium) → shortage; price floor (above equilibrium) → surplus.
- A tax shifts supply up; its burden falls more on the more inelastic side.

## Your task

```quiz required
? $Q_D = 120 - 3P$, $Q_S = 20 + 2P$. What is the equilibrium price?
= 20
! 120 − 3P = 20 + 2P → 100 = 5P.

? What is the equilibrium quantity here?
= 60
! 120 − 3 · 20 = 60.

? A price ceiling of 14 HUF is introduced on this market. How large is the shortage?
= 30
! Q_D = 120 − 3 · 14 = 78, Q_S = 20 + 2 · 14 = 48, the difference is 78 − 48.

? If demand rises and supply is unchanged, what happens to the equilibrium price and quantity?
+ both rise
- both fall
- the price rises, the quantity falls
- the price falls, the quantity rises
! The demand curve shifts right along the supply curve.

? Where must a price floor be to have an effect?
- below the equilibrium price
+ above the equilibrium price
- exactly at the equilibrium price
! Below it, it does not bind – the market sets a higher price.
```
