---
title: Practice – Evaluation and Risk
summary: Review questions and a summary calculation worksheet for the fourth topic.
minutes: 25
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
