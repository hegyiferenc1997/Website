---
title: Deeper – Decisions in Numbers
summary: The production possibility frontier through a development team (why opportunity cost grows), marginal analysis on a study decision, the sunk-cost trap, and the gains from specialisation between two flatmates – all computed with small programs.
minutes: 35
---

## What you will learn in this lesson

- **why** the production possibility frontier **curves**, and where increasing opportunity cost comes from,
- how to make a good decision with **marginal analysis** ("one more hour?"),
- how to recognise the **sunk-cost** trap,
- why even someone who is worse at **everything** gains from trade.

## 1. Why is the production possibility frontier curved?

A company has 10 developers. Each of them can build new **features** or **bug fixes** each month – but not equally well. If management wants more fixes, whom should they move first? Naturally, the one who is least good at features and best at fixes – their **opportunity cost** is the smallest:

```python run
# Production possibility frontier: a team's 10 developers can build new features or bug fixes
# The developers aren't identical: some are strong at features, others at fixes.
developers = [(9, 1), (8, 2), (7, 3), (6, 4), (5, 5), (4, 6), (3, 7), (2, 8), (1, 9), (1, 10)]  # (features, fixes)/month

# When moving someone to fixes, start with the cheapest: the one with the smallest features/fixes ratio
order = sorted(developers, key=lambda p: p[0] / p[1])
features = sum(f for f, j in developers)
fixes = 0
print(f"{'on fixes':>9} | {'features':>8} | {'fixes':>5} | opportunity cost of +1 person")
print(f"{0:>9} | {features:>8} | {fixes:>5} |")
for i, (f, j) in enumerate(order, 1):
    features -= f
    fixes += j
    print(f"{i:>9} | {features:>8} | {fixes:>5} | {f} features ↔ {j} fixes → 1 fix = {f / j:.2f} features")
```

The first developer moved brings 10 fixes at the cost of 1 feature (1 fix = 0.1 features). The last one, however, "takes away" 9 features for a single fix! As we move more and more people, we have to move less and less suitable ones, so **the opportunity cost grows** – that's why the frontier is concave (bowed outwards).

**Three viewpoints on the same thing:**

- **Engineering:** the frontier is the system's capacity; what's inside is waste (e.g. someone is on the wrong task), what's outside is unreachable – unless there's a new tool or training (the frontier shifts out).
- **Management:** every point on the frontier is **efficient** – which one we choose is a matter of priorities (features or stability), not of calculation.
- **Economic:** people and resources are **not perfect substitutes** for each other – that's the reason for the curvature.

## 2. Marginal analysis: one more hour?

A good decision depends not on "is it worth it in total" but on "is **one more unit** worth it". When studying a topic, the first hours bring a lot, later ones less and less (diminishing marginal benefit), while every hour costs the same (rest, work, another subject):

```python run
# Marginal analysis: how many hours is it worth studying a topic? (marginal benefit vs marginal cost)
# The benefit of studying diminishes: the first hours bring a lot, later ones less and less.
benefit = [0, 30, 55, 75, 90, 100, 106, 109, 110]  # total "knowledge points" after 0…8 hours
hour_cost = 12                                     # opportunity cost of an hour (e.g. rest, work) in the same units

best = 0
for hour in range(1, len(benefit)):
    marginal = benefit[hour] - benefit[hour - 1]   # what the extra hour brings
    decision = "worth it" if marginal > hour_cost else "not worth it"
    print(f"hour {hour}: marginal benefit {marginal:>2} vs marginal cost {hour_cost} → {decision}")
    if marginal > hour_cost:
        best = hour
net = [b - hour_cost * h for h, b in enumerate(benefit)]
print(f"\noptimum: {best} hours (net benefit {net[best]}); at 8 hours only {net[8]}")
```

It's worth continuing as long as the **marginal benefit is greater than the marginal cost**. Here that's 4 hours; 8 hours of study is still "worth it" in total (the net benefit is positive), but it's a much worse decision than 4 hours. So marginal analysis doesn't ask whether something is worth it, but **how much** of it is worth doing.

## 3. The sunk-cost trap

You've already put 8 million forints and half a year into a project. Now it turns out that finishing needs another 5 million, and the finished product is expected to bring 4 million in revenue. Should you continue?

- The tempting argument: "If we stop now, the 8 million is wasted!"
- The correct argument: the 8 million is **lost either way** (sunk), whatever we decide. The decision is only about the **future**: 5 million more cost versus 4 million revenue → it's **not** worth continuing (−1 million).

The same trap in everyday life: sitting through a bad film because "we've already paid for the ticket", or sticking with an outdated technology because "we've invested so much in learning it". In software development it's sometimes called the **"Concorde effect"**, after the loss-making yet completed supersonic airliner.

## 4. Gains from trade: comparative advantage at home

Anna is faster than Ben at both chores (absolute advantage). Is it still worth sharing the work?

```python run
# Gains from trade: two flatmates, two chores (cooking and cleaning)
# minutes per unit: Anna 30 minutes per meal, 60 per cleaning; Ben 60 and 90 minutes
time = {"Anna": {"cooking": 30, "cleaning": 60}, "Ben": {"cooking": 60, "cleaning": 90}}

for name, t in time.items():
    print(f"{name}: opportunity cost of 1 cleaning = {t['cleaning'] / t['cooking']:.1f} meals")

# Each does everything for themselves: 7 meals + 3 cleanings each
separate = sum(7 * t["cooking"] + 3 * t["cleaning"] for t in time.values())
# Specialisation: Ben cleans for both (6), Anna cooks for both (14)
together = 14 * time["Anna"]["cooking"] + 6 * time["Ben"]["cleaning"]
print(f"\nseparately: {separate} minutes, specialised: {together} minutes → {separate - together} minutes saved per week")
```

Yes! For Anna 1 cleaning "costs" 2 meals, for Ben only 1.5 – so Ben has a **comparative advantage** in cleaning, and Anna in cooking. If everyone does what they're relatively better at, together they gain **2 hours** a week. The same principle explains the division of labour within a team (the best programmer doesn't have to do every task), and international trade too (topic 9).

## Summary

- The production possibility frontier is curved because resources aren't equally suited to everything: opportunity cost grows.
- Marginal analysis: continue as long as the marginal benefit is greater than the marginal cost.
- Sunk cost doesn't count in the decision – only future costs and benefits.
- Comparative advantage: the smaller opportunity cost decides, not absolute speed; specialisation benefits both sides.

## Lesson exercise

```quiz required
? A developer can build 6 features or 3 fixes a month. How many features is the opportunity cost of one fix for them?
= 2
! They give up $6 / 3 = 2$ features for every fix.

? By serving its 30th customer, a café earns 900 Ft revenue at 650 Ft extra cost. What is the net marginal benefit of the 30th customer (Ft)?
= 250
! $900 - 650 = 250$ Ft – it's worth serving them.

? 10 million Ft has gone into a project so far. Finishing needs 3 million more, the expected revenue is 4 million. What should be done?
+ finish it, because the further 3 million cost brings 4 million revenue
- stop, because a total cost of 13 million faces 4 million revenue
- stop, because the 10 million is already lost
- it can't be decided
! The sunk 10 million doesn't count; $4 - 3 = +1$ million.

? With diminishing marginal benefit, how does the benefit of one more unit change?
- it grows
+ it decreases
- it stays constant
- it first decreases, then grows
! Every additional hour (slice of pizza, developer) adds less.

? If Anna can translate 4 pages or draw 2 figures in an hour, and Ben 2 pages or 2 figures, who has a comparative advantage in drawing figures?
- Anna
+ Ben
- both of them
- neither of them
! For Anna 1 figure costs 2 pages, for Ben only 1 page.
```
