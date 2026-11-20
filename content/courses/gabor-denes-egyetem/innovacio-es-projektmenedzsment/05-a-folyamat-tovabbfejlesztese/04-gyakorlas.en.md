---
title: Practice – Process Improvement
summary: Review questions and a summary worksheet for the fifth topic.
minutes: 45
kind: practice
---

## Review questions

<details>
<summary>1. How does Kaizen differ from radical process innovation?</summary>

Kaizen is continuous, small improvement done by everyone, with low risk. Radical process innovation is a rare, big leap (e.g. a completely new production technology), with higher risk and effort. The two complement each other.

</details>

<details>
<summary>2. In a team, bug tickets wait 5 days on average for testing. Which Lean waste is this, and what would you do?</summary>

Waiting (and half-finished inventory). Solution: automated tests, putting the tester into the development team, handing over in smaller batches, limiting work in progress (WIP limit, topic 11).

</details>

<details>
<summary>3. What is the difference between the main goal of Lean and of Six Sigma?</summary>

Lean improves the speed and flow of the process by eliminating waste. Six Sigma improves the precision and reliability of the process by reducing variation and defects.

</details>

<details>
<summary>4. Do a "5 Whys" analysis: "Users cannot find the sign-up button."</summary>

Why? Because it is at the bottom of the page. Why? Because the designer drew it there. Why? Because there was no user test. Why? Because it was skipped due to the deadline. Why? Because the design process has no mandatory user test. → Root cause: the process lacks a mandatory user test.

</details>

## Summary worksheet

```quiz required
? What is the correct order of the PDCA cycle?
+ Plan → Do → Check → Act
- Do → Plan → Act → Check
- Plan → Check → Do → Act
- Check → Plan → Do → Act
! Plan, do, check, act.

? Which Rothwell generation builds on **a network of partners** and digital tools?
- 2nd (market pull)
- 3rd (coupling)
- 4th (integrated)
+ 5th (networked)
! The fifth generation is the systems-integration, networked model.

? Which Lean waste is frequent **switching between many tools and tasks**?
- overproduction
+ motion
- inventory
- defects
! Motion: unnecessary "movements", context switching.

? Which 5S step is introducing "shared coding rules"?
- sort
- shine
+ standardise
- sustain
! Seiketsu = standardise.

? A bug ticket needs 4 hours of work, but on average 40 hours pass from report to fix. What is the process efficiency (in %)?
= 10
= 10%
! 4 / 40 · 100.

? Out of 1000 reports, 800 relate to a small part of the features. Which tool shows this well?
- Gantt chart
+ Pareto chart
- SWOT
- Business Model Canvas
! A Pareto chart shows causes in descending order.

? In which DMAIC step do we sustain the result achieved?
- Define
- Analyze
- Improve
+ Control
! Control = measurement, standardisation, sustaining.
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **Pareto analysis.** Write the function `pareto(tickets, limit=0.8)`, which returns, in descending order, the names of the categories that together reach the `limit` share of the tickets! A category goes in if the cumulative share of those before it is still below the limit.

```python starter
def pareto(tickets, limit=0.8):
    ordered = sorted(tickets, key=lambda k: -tickets[k])
    return ordered[:max(1, len(ordered) // 5)]
```

<details>
<summary>Solution</summary>

```python solution
def pareto(tickets, limit=0.8):
    total = sum(tickets.values())
    result, cumulative = [], 0
    for name in sorted(tickets, key=lambda k: -tickets[k]):   # by descending count
        if cumulative / total >= limit:
            break
        result.append(name)
        cumulative += tickets[name]
    return result
```

</details>

```python test
tickets = {"login": 46, "payment": 31, "slow page": 12, "e-mail": 9,
           "mobile": 7, "translation": 5, "export": 3, "other": 7}
assert pareto(tickets) == ["login", "payment", "slow page", "e-mail"]
assert pareto({"a": 50, "b": 30, "c": 20}) == ["a", "b"]
assert pareto({"a": 50, "b": 30, "c": 20}, 0.5) == ["a"]
print("All checks passed!")
```

**2.** **Process efficiency.** Write the function `efficiency(steps)`, which from a list of `(name, work time, waiting)` triples gives the process efficiency: work time / lead time, in %, to 1 decimal!

```python starter
def efficiency(steps):
    work = sum(w for _, w, _ in steps)
    waiting = sum(q for _, _, q in steps)
    return round(100 * work / waiting, 1)
```

<details>
<summary>Solution</summary>

On the last test the starter code would divide by zero: without waiting the efficiency is 100%.

```python solution
def efficiency(steps):
    work = sum(w for _, w, _ in steps)
    lead_time = work + sum(q for _, _, q in steps)   # lead time = work + waiting
    return round(100 * work / lead_time, 1)
```

</details>

```python test
assert efficiency([("a", 6, 54)]) == 10.0
assert efficiency([("request", 2, 30), ("development", 16, 8), ("review", 1, 20),
                   ("test", 4, 40), ("approval", 0.5, 60), ("release", 0.5, 24)]) == 11.7
assert efficiency([("a", 3, 0), ("b", 1, 0)]) == 100.0
print("All checks passed!")
```

**3.** **Six Sigma.** Write the function `dpmo(defects, units, opportunities)` (defects per million opportunities, rounded to a whole number) and the function `sigma(dpmo)`, which gives the sigma level with a 1.5 sigma shift (to 2 decimals)! Hint: `NormalDist().inv_cdf(1 - dpmo / 1e6) + 1.5`.

```python starter
from statistics import NormalDist

def dpmo(defects, units, opportunities):
    return round(defects / units * 1_000_000)

def sigma(dpmo):
    return round(NormalDist().inv_cdf(1 - dpmo / 1e6), 2)
```

<details>
<summary>Solution</summary>

```python solution
from statistics import NormalDist

def dpmo(defects, units, opportunities):
    return round(defects / (units * opportunities) * 1_000_000)   # several defect opportunities per unit

def sigma(dpmo):
    return round(NormalDist().inv_cdf(1 - dpmo / 1e6) + 1.5, 2)
```

</details>

```python test
assert dpmo(120, 50_000, 4) == 600
assert dpmo(25, 10_000, 5) == 500
assert sigma(3.4) == 6.0
assert sigma(600) == 4.74
print("All checks passed!")
```

### Quick check questions

```quiz
? What is the first step of 5S (Seiri)?
+ sort: removing unnecessary things
- regular cleaning
- standardising
- sustaining discipline
! 5S: sort, set in order, shine, standardise, sustain.

? Which is NOT one of the seven wastes of Lean?
- waiting
- overproduction
- unnecessary motion
+ a documented requirement
! The seven wastes: transport, inventory, motion, waiting, overproduction, over-processing, defects.

? In a process the work is 4 hours, the waiting 36 hours. What is the process efficiency (%)?
= 10
! $4 / 40 = 0.1$.

? Among the DMAIC steps, what is the "C" (Control)?
- defining the problem
- analysing the causes
+ sustaining and monitoring the improved state
- implementing the solution
! Define, Measure, Analyze, Improve, Control.
```
