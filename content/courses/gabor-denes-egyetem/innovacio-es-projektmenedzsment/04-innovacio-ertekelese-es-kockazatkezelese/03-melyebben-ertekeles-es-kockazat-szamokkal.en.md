---
title: Deeper – Evaluation and Risk in Numbers
summary: Net present value and internal rate of return with a program (by bisection), the interest-rate sensitivity of NPV on an interactive chart, Monte Carlo simulation for uncertain revenues, and why the "early kill" of the Stage-Gate process is worth money.
minutes: 40
---

## What you will learn in this lesson

- how to compute **NPV** and the **internal rate of return** (IRR) with a program,
- how to handle **uncertainty** with Monte Carlo simulation ("what's the chance of a loss?"),
- why staged (Stage-Gate) decision-making **reduces risk** and increases expected value.

## 1. NPV and IRR with a program

The example from the previous lesson: an investment of 1000 units, then an inflow of 500 units a year for three years. NPV is a function of the interest rate; the **IRR** is the rate at which NPV is exactly 0. It can't be expressed with a simple formula, but the machine quickly finds it by **bisection**:

```python run
# NPV and IRR: −1000 investment, then an inflow of 500 a year for 3 years
cash_flows = [-1000, 500, 500, 500]

def npv(r):
    return sum(cf / (1 + r) ** t for t, cf in enumerate(cash_flows))   # discounted sum

for r in [0.0, 0.05, 0.10, 0.20, 0.30]:
    print(f"r = {r:4.0%}: NPV = {npv(r):7.1f}")

# IRR by bisection: between 0% and 100% the NPV changes sign
low, high = 0.0, 1.0
for _ in range(50):
    mid = (low + high) / 2
    if npv(mid) > 0:
        low = mid             # still positive → the IRR is larger
    else:
        high = mid
print(f"\nIRR ≈ {mid:.2%}")
```

If the cost of capital (the required return) is **below** the IRR (about 23.4%), the project is worth it. Beware: NPV is **sensitive** to the interest rate – at 10% it's 243, at 20% only 53. For long-payback, risky innovations a higher rate (risk premium) easily turns the NPV negative.

```plot
title: NPV as a function of the interest rate (−1000, then an inflow of c a year for 3 years)
x: 0, 0.6
y: -400, 800
param: c = 500, 300, 700, 10
f: -1000 + c/(1 + x) + c/(1 + x)^2 + c/(1 + x)^3 # NPV(r)
dash: 0 # NPV = 0
```

Where the curve crosses the 0 line, there is the IRR. Lower the yearly inflow ($c$): below about 333 (the amount needed for the three instalments to bring back the 1000 at all) the project makes a loss even at a 0% rate.

## 2. Monte Carlo: what if revenues are uncertain?

In reality the 500 a year is only an **estimate**. Suppose that every year it's 500 on average, but fluctuates with a standard deviation of 150. Let's simulate 10,000 possible futures:

```python run
# Monte Carlo simulation: the yearly inflow is uncertain (mean 500, std. dev. 150), r = 10%
import random

random.seed(1)                         # fixed randomness, so the same comes out every time
r, runs = 0.10, 10_000
results = []
for _ in range(runs):
    flows = [random.gauss(500, 150) for _ in range(3)]           # one possible future
    results.append(-1000 + sum(cf / (1 + r) ** (t + 1) for t, cf in enumerate(flows)))

results.sort()
mean = sum(results) / runs
loss = sum(x < 0 for x in results) / runs
print(f"average NPV: {mean:.0f}")
print(f"probability of a loss: {loss:.1%}")
print(f"threshold of the worst 5%: {results[runs // 20]:.0f}")
```

The average NPV is still about 243, but now we also see that the project makes a loss in **about one case in eight** (13%), and in the worst 5% we lose more than 100 units. This tells the decision-maker much more than a single "point estimate": a project with a smaller but more certain NPV may be the better choice.

## 3. Stage-Gate: the value of the early kill

An innovation project consists of four stages; at the end of each stage a gate reveals whether it can continue. Let's compare: (a) we fund everything at once, and only at the end do we find out whether it's successful; (b) we decide stage by stage, and **kill** the project at the gate that signals failure.

```python run
# Stage-Gate: stage-by-stage funding vs. everything at once (million Ft)
costs = [10, 40, 150, 400]             # cost of each stage
success = [0.5, 0.6, 0.7, 0.9]         # chance that the project passes the gate of the given stage
value = 2000                           # value of the successful product

p_all = 1.0
for p in success:
    p_all *= p                         # chance of final success: the product of the probabilities

at_once = p_all * value - sum(costs)

expected_cost, reached = 0.0, 1.0
for c, p in zip(costs, success):
    expected_cost += reached * c       # we pay for this stage only if we got this far
    reached *= p

staged = p_all * value - expected_cost
print(f"chance of final success: {p_all:.1%}")
print(f"(a) everything at once: expected value {at_once:7.1f}")
print(f"(b) Stage-Gate:         expected cost {expected_cost:.1f}, expected value {staged:7.1f}")
```

Same project, same chance of success (about 19%) – yet the expected value of funding it all at once is **negative**, and of the staged approach **positive**. The reason is that we pay for the expensive late stages (150 and 400) only if the early, cheap stages have already validated the idea. That's why it's worth **testing cheaply and quickly** (prototype, MVP), and why killing a project at a gate isn't a failure: the money saved can go into another idea.

## Summary

- $\text{NPV}(r) = \sum_t \frac{CF_t}{(1 + r)^t}$; the IRR is the rate where NPV = 0 – it can be found with a program by bisection.
- Monte Carlo simulation turns uncertain inputs into the **distribution** of the output: the probability of a loss and the "worst case" too.
- The Stage-Gate process funds the expensive stages only for validated ideas; this lowers the expected cost and raises the expected value.

## Lesson exercise

```quiz required
? A project: −1000 today, +1210 in two years. What is the NPV at a 10% interest rate?
= 0
! $1210 / 1.1^2 = 1210 / 1.21 = 1000$, so NPV = 0.

? What is the IRR of the previous project (%)?
= 10
! The IRR is the rate where NPV = 0: exactly 10%.

? What does Monte Carlo simulation give compared with a single NPV estimate?
- a more accurate interest rate
+ the distribution of the possible outcomes, for example the probability of a loss
- a guaranteed positive NPV
- the project's exact cost
! It simulates many random "futures", so the risk becomes visible too.

? A project has two stages: the first costs 10 units and succeeds with a 50% chance; only then comes the second, 100-unit stage. What is the expected cost?
= 60
! $10 + 0.5 \cdot 100 = 60$.

? Why isn't it a failure if a project is killed at a Stage-Gate gate?
- because the killed project's money is refunded
+ because this way we don't spend on the expensive late stages for a bad idea, and the money can go into a better idea
- because killed projects are always continued later
- because projects are never killed at the gates
! The early, cheap kill is the essence of the method.
```
