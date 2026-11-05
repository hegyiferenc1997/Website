---
title: Incentives and Marginal Thinking
summary: How does an economist think? Rational choice, marginal benefit and marginal cost, sunk costs, incentives and the gains from trade.
minutes: 20
---

## What you will learn

- what a **rational decision** is,
- how **marginal analysis** works ("is one more unit worth it?"),
- why **sunk costs** do not matter,
- how **incentives** shape behaviour,
- why **trade** and the **division of labour** benefit everyone.

## Rational choice

The basic assumption of economics is that actors decide **rationally**: they choose the option where the **difference between benefit and cost** is the largest.

This does not mean everyone is a perfect computer. **Behavioural economics** (Kahneman, Thaler) has shown that we often err: we procrastinate, overweight the present, and are influenced by framing. The rational model is still a good starting point.

## Marginal analysis: "one more unit?"

Most decisions are not "all or nothing" but "**a little more or a little less**".

- **Marginal benefit**: how much the benefit increases if we choose one more unit.
- **Marginal cost**: how much the cost increases from the same.

**Rule:** keep increasing an activity as long as **marginal benefit ≥ marginal cost**.

**Example:** in a cloud service a GPU instance costs 400 HUF per hour. The expected benefit of each hour of model training (e.g. accuracy improvement in HUF):

| Hour                   | 1st  | 2nd | 3rd | 4th | 5th |
| ---------------------- | ---- | --- | --- | --- | --- |
| Marginal benefit (HUF) | 1500 | 900 | 500 | 300 | 100 |
| Marginal cost (HUF)    | 400  | 400 | 400 | 400 | 400 |

In the first 3 hours the marginal benefit exceeds 400 HUF; the 4th hour is no longer worth it. **Optimum: 3 hours.**

Marginal benefit usually **decreases** (the first slice of pizza is more enjoyable than the fourth) – more on this in topic 4.

## Sunk cost

A **sunk cost** is a cost already paid that cannot be recovered. It **does not matter** for a rational decision, because whatever you decide, you will not get it back.

> A team has already spent 2 years and 50 million HUF on software that clearly will not work. "But we've put so much into it!" – this is the **sunk cost trap**. The right question: what benefit can we expect in return for the costs **from now on**?

## Incentives

People respond to **incentives** – changes in benefits or costs.

- If petrol becomes more expensive, more people use public transport.
- If there is a reward for bug hunting (_bug bounty_), more bugs are reported.
- If a developer is paid by lines of code written, they will write long, verbose code.

The last one is an example of a **badly designed incentive** (Goodhart's law: when a measure becomes a target, it ceases to be a good measure).

## Gains from trade and the division of labour

Trade is **not a zero-sum game**: in a voluntary exchange both sides are better off, otherwise they would not trade.

- **Division of labour, specialisation**: if everyone specialises in what they are relatively best at, we produce more in total. In a team, not everyone writes backend, frontend and tests at the same time.
- The deeper principle behind this is **comparative advantage**, which we cover in topic 9 on international trade.

## Summary

- Rational choice: maximising the difference between benefit and cost.
- Marginal analysis: continue as long as marginal benefit ≥ marginal cost.
- Sunk costs do not matter for decisions.
- People respond to incentives – badly designed incentives can backfire.
- Voluntary trade benefits both sides; specialisation increases output.

## Your task

```quiz required
? According to marginal analysis, how far should an activity be increased?
- as long as total benefit is positive
+ as long as marginal benefit is at least as large as marginal cost
- until the money runs out
- always as far as possible
! MB ≥ MC.

? In the table above a GPU hour now costs 600 HUF. How many hours should you run?
= 2
= 2 hours
! 1500 and 900 > 600, but 500 < 600.

? You have already paid for a non-refundable 8,000 HUF concert ticket, but you are ill that day. What is the sunk cost?
- the concert experience
+ the 8,000 HUF ticket price
- the price of the medicine
- nothing
! Whatever you decide, the 8,000 HUF will not come back – it does not matter for the decision.

? A company rewards testers by the number of closed bug tickets. What is the likely side effect?
- fewer bug tickets
+ a flood of tiny, insignificant bug tickets
- developers earn more
- nothing
! A badly designed incentive – Goodhart's law.

? What is true about voluntary exchange?
- one side always loses
+ both sides are better off, otherwise they would not trade
- only the seller gains
- it only works with money
! Trade is not a zero-sum game.
```
