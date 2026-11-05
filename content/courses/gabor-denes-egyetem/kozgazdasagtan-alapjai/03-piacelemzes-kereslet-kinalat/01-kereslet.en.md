---
title: Demand and Price Elasticity
summary: The law of demand, the demand curve, what shifts the curve (income, substitutes, complements, expectations), and how sensitive buyers are to price.
minutes: 25
---

## What you will learn

- what **demand** and the **law of demand** are,
- how to draw a **demand curve**,
- the difference between **movement along the curve** and a **shift of the curve**,
- what the **price elasticity of demand** shows.

## Demand

**Demand** shows how much of a product buyers **want and are able** to buy at different prices in a given period.

**The law of demand:** ceteris paribus, if the price of a product **rises**, the quantity demanded **falls** (and vice versa). The reasons:

- **substitution effect**: we buy something else instead of the more expensive product (free radio instead of Spotify),
- **income effect**: the price rise has made us "poorer", so we can buy less.

## The demand curve

In economics the **price (P) is traditionally on the vertical axis** and the **quantity (Q) on the horizontal axis**. A linear demand curve: $P = a - 2Q$.

```plot
title: Demand curve
x: 0, 60
y: 0, 150
param: a = 100, 60, 140, 5
f: a - 2x # demand
dash: 100 - 2x # original
```

The **a** slider shifts the whole curve: if **a** rises, more is demanded at every price (the curve shifts **right/up**).

## Movement along the curve or a shift of the curve?

- If **the product's own price** changes → **movement along the curve** (the quantity demanded changes).
- If **another factor** changes → **the curve shifts** (demand changes).

Factors that shift the curve:

| Factor                                                     | Effect on demand                                                                  |
| ---------------------------------------------------------- | --------------------------------------------------------------------------------- |
| buyers' **income** rises                                   | rises for a normal good (laptop), falls for an inferior good (the cheapest pasta) |
| a **substitute** becomes more expensive (e.g. PlayStation) | demand for Xbox rises                                                             |
| a **complement** becomes more expensive (e.g. games)       | demand for consoles falls                                                         |
| **expectations**: people expect prices to rise             | current demand rises                                                              |
| **tastes, fashion** (an influencer recommends it)          | rises                                                                             |
| the **number of buyers** rises (more students in town)     | rises                                                                             |

## Price elasticity of demand

How strongly does the quantity demanded react to price?

$$ E = \frac{\text{\% change in quantity demanded}}{\text{\% change in price}} $$

Because of the law of demand the sign is negative; we usually look at the **absolute value**:

| &#124;E&#124; | Name          | Example                                            |
| ------------- | ------------- | -------------------------------------------------- |
| > 1           | **elastic**   | a particular brand of soft drink, restaurant meals |
| = 1           | unit elastic  | –                                                  |
| < 1           | **inelastic** | petrol in the short run, insulin, electricity      |

What makes demand elastic? Many **substitutes**, the product is a **large share** of the budget, it is not a necessity, and there is **more time** to adjust.

**Revenue and elasticity:** revenue is $P \cdot Q$.

- With inelastic demand a **price rise increases** revenue (quantity hardly falls).
- With elastic demand a **price rise reduces** revenue.

**Example:** an app's price rises from 1,000 HUF to 1,100 HUF (+10%), downloads fall from 500 to 400 (−20%). $E = -20/10 = -2$, elastic. Revenue **falls** from 500,000 HUF to 440,000 HUF.

## Summary

- Law of demand: higher price → lower quantity demanded.
- Own price change: movement along the curve; another factor: the curve shifts.
- Normal / inferior goods; substitutes / complements.
- Elasticity: |E| > 1 elastic, < 1 inelastic; this determines how a price rise affects revenue.

## Your task

```quiz required
? Coffee becomes more expensive. What happens on the demand curve for coffee?
+ movement along the curve, lower quantity demanded
- the curve shifts right
- the curve shifts left
- nothing
! A change in the own price is a movement along the curve.

? Video games become more expensive. What happens to the demand curve for game consoles?
- it shifts right
+ it shifts left
- it does not change
! Games and consoles are complements.

? Students' incomes rise and they buy less of the cheapest instant noodles. What kind of good are instant noodles?
- normal
+ inferior
- luxury
- public good
! Income rises → demand falls.

? A product's price rises by 5% and the quantity demanded falls by 15%. What is the absolute value of the price elasticity?
= 3
! 15 / 5 = 3 – elastic.

? With inelastic demand (|E| < 1), what happens to revenue after a price rise?
+ it rises
- it falls
- it does not change
! Quantity falls proportionally less than the price rises.
```
