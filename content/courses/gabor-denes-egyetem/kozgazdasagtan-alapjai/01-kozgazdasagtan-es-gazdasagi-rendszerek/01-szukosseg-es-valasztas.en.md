---
title: Scarcity, Choice and Opportunity Cost
summary: Why do we have to choose at all? Scarcity, factors of production, opportunity cost and the production possibility frontier, using everyday examples from a computer engineering student's life.
minutes: 20
---

## What you will learn

- what **economics** studies,
- what **scarcity** means and why everything starts from it,
- what the **factors of production** are,
- what **opportunity cost** is,
- how the **production possibility frontier** shows choices.

## What is economics?

**Economics** studies how people, firms and governments decide how to use their **scarce resources**, and how these decisions affect one another.

It is not only about money: deciding whether to spend an evening in exam season studying, sleeping or at a hackathon is an economic decision too.

## Scarcity

**Scarcity**: our wants are unlimited, but our resources are limited. That is why we **have to choose**.

| Resource  | Why is it scarce?                                    |
| --------- | ---------------------------------------------------- |
| time      | a day has 24 hours                                   |
| money     | wages and scholarships are finite                    |
| GPU time  | we pay an hourly fee for it in the cloud             |
| attention | we can only focus on a few things at once            |
| labour    | experienced developers are few, so their pay is high |

> "Scarce" does not mean "rare". Air is not scarce (everyone gets it for free), but cooling capacity in a server room is.

## Factors of production

To produce goods and services the economy uses four main **factors of production**:

1. **Labour** – people's physical and mental effort (e.g. developers' working hours).
2. **Capital** – man-made means of production (servers, laptops, offices, software).
3. **Land / natural resources** – sites, raw materials, energy, rare earth metals for chips.
4. **Entrepreneurship** – combining the factors, taking risks, turning new ideas into products.

Many add **knowledge and data** as a fifth factor – we return to this in topic 12.

## Opportunity cost

When you choose something, you give up the **best alternative you did not choose**. Its value is the **opportunity cost**.

**Example:** you have 8 hours on Saturday. Your options:

- study for the maths exam,
- work a student job for 2,500 HUF an hour (20,000 HUF in total),
- go on a hike.

If you choose to study and your second-best option would have been working, the opportunity cost of studying is **20,000 HUF** (the hike does not count, because it was not the best option you gave up).

> The opportunity cost of university is not only fees and books, but also the salary you could earn in a full-time job in the meantime.

## The production possibility frontier

A simple model: in one month a small software company can develop **web apps** or **mobile apps**. The **production possibility frontier** (PPF) shows the maximum combinations of the two products that can be produced with the given resources.

```plot
title: Production possibility frontier
x: 0, 12
y: 0, 12
param: t = 10, 6, 11, 0.5
f: sqrt(t^2 - x^2) # PPF
point: 6, 8 # efficient point
point: 4, 4 # inefficient
```

- Points **on the curve** are **efficient**: you can only make more of one by making less of the other.
- A point **below** the curve is **inefficient**: resources are idle (e.g. half the developers have nothing to do).
- A point **above** the curve is currently **unattainable**.
- The **t** slider shows **economic growth**: more resources or better technology push the frontier outwards.

The curve **bows outwards** (concave) because resources are not equally good at both tasks: as we move more and more web developers to mobile development, we have to move less and less suitable ones, so each extra mobile app "costs" more and more web apps. This is the principle of **increasing opportunity cost**.

## Summary

- Economics studies decisions about using scarce resources.
- Factors of production: labour, capital, land, entrepreneurship (and increasingly knowledge).
- Opportunity cost is the value of the best alternative given up.
- Points on the PPF are efficient, below it resources are wasted, above it is (for now) unattainable.
- Growth pushes the PPF outwards.

## Your task

```quiz required
? What does **scarcity** mean in economics?
- that a product is rarely available in shops
+ that wants are unlimited but resources are limited
- that the government restricts production
- that money has run out
! That is why we have to choose.

? Which factor of production is a company's **server farm**?
- labour
+ capital
- land
- entrepreneurship
! A man-made means of production.

? In the evening you can study for 3 hours, or work for 3,000 HUF an hour (your second-best option). What is the opportunity cost of 3 hours of studying, in HUF?
= 9000
= 9000 HUF
! 3 · 3,000 HUF – the wage you give up.

? Where is a point at which some developers are sitting idle, relative to the production possibility frontier?
- on the curve
+ below the curve
- above the curve
- on an axis
! Idle resources = an inefficient point.

? What pushes the production possibility frontier **outwards**?
- producing only one of the two goods
- rising unemployment
+ better technology or more resources
- rising prices
! This is economic growth.
```
