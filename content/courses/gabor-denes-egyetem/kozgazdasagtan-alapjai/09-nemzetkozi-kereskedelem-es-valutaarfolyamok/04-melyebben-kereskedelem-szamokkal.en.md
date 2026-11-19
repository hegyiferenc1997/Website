---
title: Deeper – Trade and Exchange Rates in Numbers
summary: Comparative advantage computed (how specialisation yields more of both goods), the winners and losers of a tariff to the forint with a slider chart, the effect of the exchange rate on a laptop's price and an exporter's revenue, cross rates, and purchasing power parity on a burger.
minutes: 40
---

## What you will learn in this lesson

- how trade yields **more of both goods** with the same amount of work,
- who wins and who loses from a **tariff**, and why a loss remains in the end,
- how to compute with **exchange rates** and **cross rates**,
- what it means that a currency is **undervalued**, and why PPP-based GDP is higher.

## 1. Comparative advantage in numbers

Two countries, Alpha and Beta, produce chips and software; each has 1200 labour hours. Alpha is more efficient at **both** (absolute advantage):

```python run
# Comparative advantage: labour hours per unit; both countries have 1200 labour hours
hours = {"Alpha": {"chip": 4, "software": 2}, "Beta": {"chip": 12, "software": 4}}
TOTAL = 1200

for country, h in hours.items():
    print(f"{country}: opportunity cost of 1 chip = {h['chip'] / h['software']:.1f} software")

# Autarky: each country spends half of its working time on each product
chips_a = sum(TOTAL / 2 / h["chip"] for h in hours.values())
soft_a = sum(TOTAL / 2 / h["software"] for h in hours.values())
print(f"\nautarky: {chips_a:.0f} chips + {soft_a:.0f} software")

# Specialisation: Alpha (relatively better at chips) makes mostly chips, Beta only software
alpha_chip_hours = 840                                     # 70% of Alpha's hours on chips
chips_s = alpha_chip_hours / hours["Alpha"]["chip"]
soft_s = (TOTAL - alpha_chip_hours) / hours["Alpha"]["software"] + TOTAL / hours["Beta"]["software"]
print(f"specialisation: {chips_s:.0f} chips + {soft_s:.0f} software → more of both!")
```

For Alpha a chip costs 2 software, for Beta 3 – so Alpha has a **comparative advantage** in chips, Beta in software. If Beta makes only software and Alpha mostly chips, the same amount of work produces **more of both goods** than if both made everything themselves. The surplus is shared through trade: the exchange ratio will be between 2 and 3 software per chip, so both countries benefit.

## 2. The winners and losers of a tariff

A small country can import as much as it wants at the world price (60). Now it levies a tariff of 20:

```python run
# The effect of a tariff in a small country: domestic demand Q = 200 − P, supply Q = P − 20, world price 60
def market(p):
    return 200 - p, p - 20                         # (demand, domestic production)

for tariff in [0, 20]:
    p = 60 + tariff                                # with the tariff the domestic price rises
    d, s = market(p)
    print(f"tariff {tariff:>2}: price {p}, demand {d}, domestic production {s}, imports {d - s}")

d0, s0 = market(60)
d1, s1 = market(80)
consumers = (d0 + d1) / 2 * 20                     # fall in consumer surplus (trapezoid)
producers = (s0 + s1) / 2 * 20                     # rise in producer surplus
revenue = 20 * (d1 - s1)                           # tariff revenue
print(f"\nconsumers' loss {consumers:.0f} | producers' gain {producers:.0f} | tariff revenue {revenue:.0f}")
print(f"deadweight loss (net) = {consumers - producers - revenue:.0f}")
```

- **Consumers** lose the most (2600): they buy less, at a higher price.
- Domestic **producers** gain (1000): they sell more at a higher price – they lobby for the tariff.
- The **government** gets tariff revenue (1200).
- The difference, **400**, goes to nobody: this is the deadweight loss (more expensive domestic production and purchases that don't happen).

```plot
title: A tariff in a small country (price and quantity)
x: 0, 200
y: 0, 150
param: t = 20, 0, 50, 5
f: 200 - x # domestic demand
f: x + 20 # domestic supply
dash: 60 # world price
dash: 60 + t # price with tariff
point: 140 - t, 60 + t # demand with tariff
point: 40 + t, 60 + t # domestic production with tariff
```

The distance between the two points is the imports: it shrinks as the tariff grows, and at a tariff of 50 (a price of 110, where domestic demand and supply are equal) it falls to zero – a tariff this high is **prohibitive**. That's why most economists argue against tariffs: the gain is concentrated (a few producers), the loss is spread out (every buyer), but bigger overall.

## 3. Exchange rates in practice

```python run
# Exchange rates in practice: a 1000-euro laptop and a software exporter's revenue of 50,000 euros
for eur_huf in [385, 400, 415]:
    laptop = 1000 * eur_huf
    export = 50_000 * eur_huf
    print(f"1 € = {eur_huf} Ft: the laptop {laptop:,} Ft, the export revenue {export:,} Ft")

# Cross rate: if 1 € = 400 Ft and 1 € = 1.10 $, then 1 $ = ? Ft
eur_huf, eur_usd = 400, 1.10
print(f"\ncross rate: 1 $ = {eur_huf / eur_usd:.1f} Ft")
```

If the forint **weakens** from 385 to 415 Ft/€, the laptop gets 30 thousand forints more expensive – but a software company invoicing in euros gets 1.5 million forints more for the same work. A weak forint thus favours **exporters** and tourism, and hurts importing consumers and those with foreign-currency loans. The **cross rate** can be computed from two exchange rates: if 1 € = 400 Ft and 1 € = 1.10 USD, then 1 USD = 400 / 1.10 ≈ 364 Ft.

## 4. Purchasing power parity with a burger

If the same product costs 1890 Ft at home and 5.60 € in the euro area, at what exchange rate would its price be the same?

```python run
# Purchasing power parity with a burger: what does the same product cost in two places?
price_huf, price_eur, market_rate = 1890, 5.60, 400   # burger price at home (Ft), in the euro area (€); 1 € = 400 Ft
ppp = price_huf / price_eur                           # at this exchange rate the price would be the same
print(f"PPP exchange rate: 1 € = {ppp:.0f} Ft, market: {market_rate} Ft")
print(f"by the burger measure the forint is undervalued by {100 * (1 - ppp / market_rate):.0f}%")

# That's why GDP per capita at PPP is higher than at the exchange rate
gdp_pc_eur = 22_000                                   # at the market exchange rate, €
print(f"GDP per capita at the exchange rate {gdp_pc_eur:,} €, at purchasing power ≈ {gdp_pc_eur * market_rate / ppp:,.0f} €")
```

By "burger parity" 1 € ≈ 338 Ft, but the market rate is 400 – so by this measure the forint is **undervalued**, meaning a forint salary is worth more at home than the exchange rate shows. This is typical of less developed countries: local services (labour, rent) are cheaper. That's why international comparisons use **purchasing power parity (PPP)**: GDP per capita is then higher than at market exchange rates. (The Economist publishes the "Big Mac index" every year – a half-joking but instructive measure.)

## Summary

- Comparative advantage: the smaller opportunity cost decides; with specialisation and trade both sides can consume more.
- Tariff: consumers lose, producers and the government gain, the net result is a deadweight loss.
- A weak domestic currency: good for exports, bad for imports; cross rate = the ratio of two exchange rates.
- PPP exchange rate: the rate at which the same basket costs the same everywhere; less developed countries' currencies are typically undervalued.

## Lesson exercise

```quiz required
? In a country producing a car takes 10 labour hours, a computer 5. How many computers is the opportunity cost of a car?
= 2
! $10 / 5 = 2$.

? Domestic demand $Q = 150 - P$, supply $Q = P - 30$, world price 50, tariff 10. What are the imports?
= 60
! $P = 60$: demand $90$, domestic production $30$, imports $60$.

? 1 € = 400 Ft. How many forints is a 250-euro product?
= 100000
! $250 \cdot 400 = 100\,000$ Ft.

? Who benefits from the forint weakening?
+ domestic software companies invoicing in euros
- buyers of imported laptops
- people travelling abroad on holiday
- those with euro loans
! They get more forints for the same euros.

? A burger costs 2000 Ft at home and 5 € in the euro area. What is the PPP exchange rate (Ft/€)?
= 400
! $2000 / 5 = 400$.
```
