---
title: Evaluating Innovation Projects
summary: How do we choose which idea deserves money and time? Weighted scoring, payback period, ROI, net present value and the decision gates of Stage-Gate.
minutes: 25
---

## What you will learn

- the **criteria** used to evaluate an innovation idea,
- how to build a **weighted scoring** table,
- how to calculate the **payback period**, **ROI** and **net present value** (NPV),
- how the **Stage-Gate** process works.

## Why evaluate?

A company always has **more ideas than money**. Evaluation aims to spend limited resources on the projects with the **highest expected benefit** that fit the strategy, and to stop hopeless ideas in time.

Typical criteria:

- **strategic fit** – does it support the company's goals?
- **market attractiveness** – how big is the market, how urgent is the customer's problem?
- **technical feasibility** – how mature is the technology (TRL, topic 2)?
- **financial return** – how much does it bring, and when?
- **risk** – what happens if it fails?

## Weighted scoring

Each criterion gets a **weight** (they add up to 1, i.e. 100%), and each idea gets a **score** per criterion (e.g. 1–5). The total is the weighted sum:

| Criterion             | Weight | Idea A  | Idea B  |
| --------------------- | ------ | ------- | ------- |
| strategic fit         | 0.4    | 4       | 3       |
| market attractiveness | 0.3    | 3       | 5       |
| feasibility           | 0.3    | 5       | 2       |
| **total**             | 1.0    | **4.0** | **3.3** |

Idea A: 0.4·4 + 0.3·3 + 0.3·5 = 1.6 + 0.9 + 1.5 = **4.0**. Idea B: 1.2 + 1.5 + 0.6 = **3.3**. Idea A is better.

## Financial indicators

### Payback period

How long does it take for the project to earn back the investment?

> **Payback period = investment / annual net cash inflow** (for even inflows)

Example: an investment of 12 million, savings of 4 million a year → **3 years**. Simple, but it ignores the time value of money and any benefit after payback.

### Return on investment (ROI)

> **ROI = (return − investment) / investment · 100%**

Example: an investment of 10 million yields 15 million → ROI = (15 − 10) / 10 = **50%**.

### Net present value (NPV)

One unit of money received today is worth more than one received in a year (it can earn interest, and there is risk). So future cash flows are **discounted** at a rate **r**:

> **NPV = −C₀ + CF₁/(1+r) + CF₂/(1+r)² + … + CFₙ/(1+r)ⁿ**

where C₀ is the initial investment and CFₜ is the cash flow in year t.

Example: an investment of 1000 units, an inflow of 500 units a year for three years, r = 10%:

| Year | Cash flow | Discount factor 1/(1.1)ᵗ | Present value |
| ---- | --------- | ------------------------ | ------------- |
| 0    | −1000     | 1                        | −1000         |
| 1    | 500       | 0.909                    | 454.5         |
| 2    | 500       | 0.826                    | 413.2         |
| 3    | 500       | 0.751                    | 375.7         |
|      |           | **NPV**                  | **≈ 243**     |

**Decision rule**: if **NPV > 0**, the project pays off at the given rate. The **internal rate of return** (IRR) is the rate at which NPV is exactly 0.

> For radical innovations cash flows are very uncertain, so financial indicators are always used together with **scenarios** (optimistic, expected, pessimistic) and non-financial criteria.

## The Stage-Gate process

In **Robert G. Cooper**'s model development is split into **stages**, with decision **gates** between them. At each gate a review board decides: **go**, **kill**, **hold** or **recycle**.

```text
 idea → [G1] → 1. scoping → [G2] → 2. business case → [G3]
      → 3. development → [G4] → 4. testing → [G5] → 5. launch
```

Its advantage is filtering out weak ideas before the expensive stages; the later a project is stopped, the more money is lost.

## Summary

- Evaluation criteria: strategy, market, feasibility, finance, risk.
- Weighted scoring: Σ weight · score.
- Payback = investment / annual inflow; ROI = (return − investment) / investment.
- NPV: sum of discounted cash flows minus investment; NPV > 0 → worth it.
- Stage-Gate: stages and decision gates (go / kill / hold / recycle).

## Lesson exercise

```quiz required
? A project costs 8 million and saves 2 million a year. What is the payback period in years?
= 4
= 4 years
! 8 / 2.

? An investment of 20 million yields 26 million. What is the ROI (in %)?
= 30
= 30%
! (26 − 20) / 20 · 100.

? Weights: 0.5 / 0.3 / 0.2. An idea scores 4 / 2 / 5. What is its weighted total score?
= 3.6
! 0.5·4 + 0.3·2 + 0.2·5 = 2 + 0.6 + 1.

? At a 10% rate, what is the present value of 1100 units received **in one year**?
= 1000
! 1100 / 1.1.

? What does it mean if a project's NPV is **negative**?
- it will surely bring a big profit
+ at the given rate it does not pay off; it brings less than an alternative of equal risk
- its payback period is zero
- its ROI is infinite
! NPV < 0 → the discounted return is less than the investment.

? In the Stage-Gate model, what happens at a **gate**?
- the team writes code
+ a review board decides whether to continue (go / kill / hold / recycle)
- the product is sold
- the project is closed automatically
! Gates are the decision points between stages.
```
