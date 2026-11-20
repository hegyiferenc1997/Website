---
title: Practice – Evaluation and Risk
summary: Review questions and a summary calculation worksheet for the fourth topic.
minutes: 50
kind: practice
---

## Review questions

<details>
<summary>1. Why is the payback period not enough to evaluate a project?</summary>

Because it ignores the time value of money and how much the project brings after payback. Of two projects with the same payback period, one may keep earning for years afterwards and the other nothing.

</details>

<details>
<summary>2. Why do we discount future cash flows?</summary>

Because money today is worth more than money in the future: it can be invested (earn interest), and the future amount is uncertain. Discounting makes amounts arriving at different times comparable.

</details>

<details>
<summary>3. What is the advantage of Stage-Gate over a "develop everything at once" approach?</summary>

It filters out weak ideas before the expensive development stage, so less money is lost, and at every gate the decision is based on fresh information.

</details>

<details>
<summary>4. Give an example of each of the four response strategies for developing a mobile app!</summary>

Avoid: do not build our own payment system, use a proven provider. Transfer: hosting is provided by a cloud provider under an SLA. Mitigate: an early beta test with real users. Accept: consciously leave a tiny display glitch on old phones unfixed.

</details>

## Summary worksheet

```quiz required
? An AI-based customer service system costs 30 million and saves 7.5 million in wages a year. What is the payback period in years?
= 4
= 4 years
! 30 / 7.5.

? The same system saves 37.5 million in total over 5 years. What is the ROI for the 5 years (in %)?
= 25
= 25%
! (37.5 − 30) / 30 · 100.

? At a 10% rate, what is the present value of 121 units received **in two years**?
= 100
! 121 / 1.1² = 121 / 1.21.

? A project: investment 100, an inflow of 132 in one year, rate 10%. What is the NPV?
= 20
! 132 / 1.1 = 120; 120 − 100.

? Two risks: A (P = 2, I = 5) and B (P = 4, I = 4). Which do we deal with first?
- A, because its impact is higher
+ B, because its risk score is higher (16 > 10)
- they are equally important
- neither needs attention
! A: 2 · 5 = 10, B: 4 · 4 = 16.

? A risk has an EMV of 3 million and a probability of 15%. What is its monetary impact in millions?
= 20
= 20 million
! EMV = P · impact → impact = 3 / 0.15.

? Which Stage-Gate decision means stopping the idea for good?
- go
+ kill
- hold
- recycle
! Go = continue, kill = stop, hold = suspend, recycle = rework.
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **Net present value.** Write the function `npv(flows, r)`, which returns the net present value of the cash flow list `[C0, CF1, CF2, …]` at interest rate `r` (to 1 decimal)! Element 0 is today's cash flow (usually negative).

```python starter
def npv(flows, r):
    return round(sum(flows), 1)
```

<details>
<summary>Solution</summary>

```python solution
def npv(flows, r):
    return round(sum(cf / (1 + r) ** t for t, cf in enumerate(flows)), 1) + 0.0   # discounted sum
```

</details>

```python test
assert npv([-1000, 500, 500, 500], 0.1) == 243.4
assert npv([-1000, 1210], 0.1) == 100.0
assert npv([-100, 0, 121], 0.1) == 0.0
print("All checks passed!")
```

**2.** **Internal rate of return.** Write the function `irr(flows)`, which by bisection finds the interest rate between 0 and 1 at which the NPV is zero (to 4 decimals)!

```python starter
def irr(flows):
    return 0.1
```

<details>
<summary>Solution</summary>

```python solution
def irr(flows):
    npv = lambda r: sum(cf / (1 + r) ** t for t, cf in enumerate(flows))
    low, high = 0.0, 1.0
    for _ in range(60):
        mid = (low + high) / 2
        if npv(mid) > 0:
            low = mid                      # still positive: the IRR is larger
        else:
            high = mid
    return round(mid, 4)
```

</details>

```python test
assert irr([-1000, 500, 500, 500]) == 0.2338
assert irr([-100, 150]) == 0.5
assert irr([-1000, 1200]) == 0.2
print("All checks passed!")
```

**3.** **Stage-Gate.** Write the function `stage_gate(costs, success, value)`, which returns the pair `(expected cost, expected value)` (to 1 decimal), if the i-th stage is paid for only if the project passed the previous gates, and at the end a product worth `value` is born!

```python starter
def stage_gate(costs, success, value):
    p = 1.0
    for s in success:
        p *= s
    return (round(sum(costs), 1), round(p * value - sum(costs), 1))
```

<details>
<summary>Solution</summary>

The starter code calculates as if every stage were paid for regardless – exactly the value of the early kill is lost.

```python solution
def stage_gate(costs, success, value):
    expected, reached = 0.0, 1.0
    for c, s in zip(costs, success):
        expected += reached * c            # we pay for this stage only with this probability
        reached *= s
    return (round(expected, 1), round(reached * value - expected, 1))
```

</details>

```python test
assert stage_gate([10, 40, 150, 400], [0.5, 0.6, 0.7, 0.9], 2000) == (159.0, 219.0)
assert stage_gate([10, 100], [0.5, 1.0], 300) == (60.0, 90.0)
print("All checks passed!")
```

### Quick check questions

```quiz
? A project costs 600 thousand Ft and brings in 150 thousand Ft a year. What is the payback period (years)?
= 4
! $600 / 150 = 4$ years.

? An investment is 200 units, the profit is 50 units. What is the ROI (%)?
= 25
! $50 / 200 = 0.25$.

? What does the "fail fast" principle mean?
- as many projects as possible should fail
+ test cheaply and early, so that bad ideas are revealed soon, with small losses
- failure should be hidden
- invest only in certain ideas
! An early, cheap failure is learning; a late, expensive failure is a loss.

? Which is one of the four risk response strategies (for threats)?
- ignoring
+ transferring (e.g. through insurance)
- concealing
- doubling
! Avoid, transfer, mitigate, accept.
```
