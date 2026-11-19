---
title: Deeper – The Project Triangle in Numbers
summary: Trading time for cost with team size (why more people don't speed things up forever – the communication overhead), the cost of change by phase on the example of a faulty requirement, and the S-curve of cumulative cost against the decreasing ability to influence – with small programs and an interactive chart.
minutes: 35
---

## What you will learn in this lesson

- how time and cost can be **traded off** in the project triangle, and where the limit is (Brooks's law),
- why a defect gets **many times** more expensive if we notice it late,
- why our influence is greatest at the **start** of the project, while most of the money is spent later.

## 1. More people = a faster project?

According to the project triangle, scope, time and cost are linked: if we want a shorter deadline, we usually need **more resources** (money, people). But not without limit. In a 120 person-week task every new team member increases the **communication overhead**: suppose each additional person reduces everyone's efficiency by 3% (meetings, coordination, alignment).

```python run
# Team size, duration and cost: 120 person-weeks of work, 3% communication loss per person
work, loss = 120, 0.03

print(f"{'size':>7} | {'effective capacity':>18} | {'duration (weeks)':>16} | {'cost (person-weeks)':>19}")
for n in [1, 2, 4, 6, 8, 10, 15, 20]:
    capacity = n * (1 - loss * (n - 1))              # the real weekly output in person-weeks
    duration = work / capacity
    print(f"{n:>7} | {capacity:>18.2f} | {duration:>16.1f} | {n * duration:>19.1f}")
```

With 1 person it's 120 weeks, with 4 it's 33 weeks – so far the speed-up is almost proportional. With 10 people, however, it's only 16.4 weeks, and the cost is 164 person-weeks instead of 120; above 15 the duration no longer shrinks (14.0 weeks with 20 people, more than with 15), while the cost rises steeply. This is the triangle's trade-off in numbers: **we pay for shortening time with cost, more and more dearly.**

**Brooks's law** (Fred Brooks, _The Mythical Man-Month_) goes even further: "Adding manpower to a late software project makes it later." New people have to be trained (which takes the old team's time), and the number of communication channels grows as $\frac{n(n - 1)}{2}$.

```plot
title: Project duration as a function of team size (120 person-weeks)
x: 1, 20
y: 0, 130
param: o = 0.03, 0, 0.05, 0.005
f: 120/(x*(1 - o*(x - 1))) # duration (weeks)
```

Set the communication loss ($o$) to zero: then the curve is the ideal $120 / n$. Raise it to 5%: the curve soon "flattens out", and even rises again at the end – there more people **slow things down**.

## 2. The cost of change

The cost of fixing a requirement defect (e.g. a misunderstood business rule) is the higher, the later we notice it. Industry experience shows roughly these multipliers:

```python run
# The cost of change (fixing a defect) by phase – multipliers relative to the requirements phase
multipliers = {"requirements": 1, "design": 5, "development": 10, "testing": 20, "after release": 100}
base = 50_000                                     # Ft, if we notice it in the requirements phase

for phase, m in multipliers.items():
    print(f"{phase:<15}: {base * m:>9,.0f} Ft")

# 40 requirement defects: without a review vs. with a 600,000 Ft requirements review
# that filters out 60% of the defects at the start (we find the rest in testing)
defects = 40
without = defects * base * multipliers["testing"]
with_review = 600_000 + defects * 0.6 * base * multipliers["requirements"] + defects * 0.4 * base * multipliers["testing"]
print(f"\nwithout review: {without:,.0f} Ft, with review: {with_review:,.0f} Ft")
```

A 50,000 forint fix becomes 5 million after release: it has to be redesigned, redeveloped, retested and re-released, and meanwhile the users suffer too. That's why a careful **planning phase**, requirement reviews and an early prototype pay back many times over: in the example a 600,000 forint review turns a 40 million fixing cost into 17.8 million.

## 3. Cumulative cost and the ability to influence

A project's money isn't spent evenly: at the start (initiation, planning) few people work, in execution the most, at closing few again. The **cumulative cost** therefore traces an S-shaped curve:

```python run
# The project's weekly cost by phase (million Ft) and the S-curve of cumulative cost
phases = [("initiation", 2, 0.5), ("planning", 4, 1.5), ("execution", 10, 6), ("closing", 2, 1)]
total = sum(weeks * cost for _, weeks, cost in phases)

cumulative, week = 0, 0
for name, weeks, cost in phases:
    cumulative += weeks * cost
    week += weeks
    print(f"end of {name:<11} (week {week:>2}): cumulative {cumulative:5.1f} M Ft = {cumulative / total:4.0%}")
```

By the end of planning we've spent only about 10% of the money – but by then the structure of the solution, the scope and the schedule have **already been decided**. Stakeholders' influence is greatest at the start of the project, and as we progress, changing anything becomes more and more expensive (see part 2). These two curves – rising cost and falling ability to influence – make up one of the most important charts in project management: **good decisions must be made early and cheaply.**

## Summary

- In the project triangle time can be shortened with money (people), but more and more dearly because of the communication overhead; beyond a point more people slow things down (Brooks's law).
- Fixing a defect gets orders of magnitude more expensive by phase (1 → 5 → 10 → 20 → 100); an early review pays back many times over.
- Cumulative cost is S-shaped; the ability to influence is greatest at the start of the project.

## Lesson exercise

```quiz required
? How many communication channels are there in a 6-person team?
= 15
! $\frac{6 \cdot 5}{2} = 15$.

? A 60 person-week task is done by 3 people, and because of the communication loss everyone works at 90% efficiency. In how many weeks do they finish?
= 22,2
= 22.2
! $60 / (3 \cdot 0.9) = 60 / 2.7 \approx 22.2$.

? What does Brooks's law say?
- the more people, the faster the project
+ adding manpower to a late software project makes it later
- projects are always late
- cost is inversely proportional to team size
! Training and the multiplying communication channels slow things down.

? Fixing a defect in the requirements phase costs 20,000 Ft. How much does it cost after release if the multiplier is 100?
= 2000000
= 2 000 000
! $20{,}000 \cdot 100 = 2{,}000{,}000$ Ft.

? In which phase of the project is the stakeholders' influence on the final result greatest?
+ at the start (initiation, planning)
- in the middle of execution
- at closing
- always the same
! Later every change gets more and more expensive.
```
