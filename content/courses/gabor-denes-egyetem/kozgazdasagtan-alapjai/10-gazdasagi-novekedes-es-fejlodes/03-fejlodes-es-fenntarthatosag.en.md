---
title: Development, Inequality and Sustainability
summary: Growth is not everything: the Human Development Index (HDI), measuring income inequality (Lorenz curve, Gini coefficient), poverty, the sustainable development goals, green growth and carbon pricing.
minutes: 25
---

## What you will learn

- the difference between **growth** and **development**,
- what the **Human Development Index** (HDI) measures,
- how we measure **inequality** (Lorenz curve, Gini coefficient),
- what **sustainable development** means,
- how **climate change** can be tackled economically (a price on carbon).

## Growth and development

- **Growth** is quantitative: more output (real GDP).
- **Development** is qualitative: better health, education, institutions, quality of life, freedom. According to Amartya Sen (Nobel Prize, 1998), development is the expansion of **capabilities** and choices.

The two usually go together, but not always: an oil-exporting country's GDP can grow while most of its population does not develop.

## The Human Development Index (HDI)

The **HDI**, calculated by the United Nations Development Programme (UNDP), combines three dimensions into a value between 0 and 1:

| Dimension                   | Indicator                                   |
| --------------------------- | ------------------------------------------- |
| a long, healthy life        | life expectancy at birth                    |
| knowledge                   | mean and expected years of schooling        |
| a decent standard of living | GNI per capita (at purchasing power parity) |

Hungary is among the countries with "very high" human development.

## Inequality

### The Lorenz curve

We rank households by income and plot what share of total income the bottom $x$ share of the population receives.

```plot
title: Lorenz curve
x: 0, 1
y: 0, 1
param: k = 2, 1, 5, 0.25
f: x # perfect equality
f: x^k # Lorenz curve
area: x - x^k @ 0, 1
value: Gini coefficient = (k - 1) / (k + 1)
```

- With perfect equality the curve is the **diagonal** (20% of the population receives 20% of income).
- The more the curve "sags", the greater the inequality.

### The Gini coefficient

The **Gini coefficient** is twice the area between the diagonal and the Lorenz curve: **0** = perfect equality, **1** = one person gets everything. In European welfare states it is around 0.25–0.30 (in Hungary around 0.28–0.30), in the USA around 0.4, and above 0.5 in some Latin American and African countries.

In the chart the **k** slider changes the shape of the Lorenz curve; for a curve of the form $x^k$ the Gini is $(k-1)/(k+1)$.

### Why does inequality matter?

- too much inequality can reduce equality of opportunity (education, health) and erode social trust,
- some inequality, however, provides incentives (studying, entrepreneurship, innovation pay off),
- the state reduces it with **taxes and transfers** (topic 5) – the debate is about how much.

## Poverty

- **Absolute poverty:** people living below the minimum needed for subsistence (the World Bank measure is about 3 dollars a day at purchasing power parity). Its share in the world has fallen dramatically since 1990, mainly because of growth in East and South Asia.
- **Relative poverty:** people living below 60% of median income (the EU measure).

## Sustainable development

According to the Brundtland Report (1987), **sustainable development** is development that meets the needs of the present without compromising the ability of future generations to meet their own needs.

The UN's **17 Sustainable Development Goals** (SDGs, 2015–2030) include ending poverty and hunger, quality education, gender equality, clean energy, decent work and economic growth, and climate action.

## Climate change as an externality

Carbon dioxide emissions are a **negative externality** (topic 1): the emitter does not pay for the damage it causes – so the market produces **too much** of it. Economic solutions:

- **carbon tax:** emissions get a price, the polluter pays,
- **emissions trading (cap and trade):** the state sets a total emissions cap, and firms can trade allowances with each other. The EU Emissions Trading System (**EU ETS**) has operated since 2005,
- **subsidies** for green technologies (solar panels, batteries, heat pumps),
- **regulation** (e.g. the EU phase-out of new cars with internal combustion engines).

**Green growth** aims for GDP to grow while emissions fall (**decoupling**). In the EU and in Hungary emissions have been falling since the 1990s while GDP has grown.

## Summary

- Growth: quantitative; development: qualitative (health, education, freedom).
- HDI: life expectancy, schooling, GNI per capita.
- Inequality: Lorenz curve, Gini (0 = equal, 1 = completely unequal).
- Sustainable development: preserving future generations' opportunities; 17 SDGs.
- CO₂ is a negative externality: carbon tax, emissions trading, subsidies, regulation.

## Your task

```quiz required
? Which is **not** one of the three dimensions of the HDI?
- life expectancy
- schooling
- income per capita
+ the share of military spending
! The three: health, knowledge, standard of living.

? What does a Gini coefficient of 0 mean?
+ perfect equality
- perfect inequality
- no income
- a measurement error
! Everyone receives the same.

? In the chart k = 3. What is the Gini coefficient?
= 0,5
= 0.5
= 1/2
! (3 − 1) / (3 + 1).

? What is the essence of emissions trading (cap and trade)?
- a total ban on pollution
+ the state sets a total emissions cap, and allowances can be traded
- every firm may pollute the same amount for free
- it only affects households
! The EU ETS has operated since 2005.

? Why are carbon dioxide emissions a **negative externality**?
- because they are expensive to measure
+ because the emitter does not pay for the damage it causes
- because the state emits them
- because they are a public good
! Part of the cost is borne by others (and by future generations).
```
