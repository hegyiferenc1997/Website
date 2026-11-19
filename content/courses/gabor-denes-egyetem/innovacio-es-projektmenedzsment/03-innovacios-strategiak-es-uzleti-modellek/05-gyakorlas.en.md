---
title: Practice – Strategies and Business Models
summary: Review questions and a summary worksheet for the third topic.
minutes: 45
kind: practice
---

## Review questions

<details>
<summary>1. Write a short SWOT for a new note-sharing app for university students!</summary>

Strength: the team are students themselves and know the needs. Weakness: little money and marketing experience. Opportunity: many students study online, university partnerships. Threat: big free competitors; copyright issues with uploaded material.

</details>

<details>
<summary>2. What is the difference between a defensive and an imitative strategy?</summary>

A defensive company quickly follows the pioneer and brings a better version through its own development. An imitative company copies the proven solution and competes mainly on lower cost, with little own development.

</details>

<details>
<summary>3. Why do we start the Business Model Canvas with the customer segments?</summary>

Because every other block (value proposition, channel, revenue) depends on for whom we create value. With the wrong customers, even the best model will not work.

</details>

<details>
<summary>4. After an MVP test it turns out that students would not pay, but universities would. What would you do?</summary>

Pivot in the customer segment: offer the product to universities (e.g. an institutional licence) and keep it free for students, while keeping what was learnt (what students use).

</details>

## Summary worksheet

```quiz required
? A company uses one of its **strengths** (an excellent AI team) to seize an **opportunity** (a new EU AI grant). Which TOWS strategy is this?
+ S–O
- W–O
- S–T
- W–T
! Strength + opportunity.

? A phone maker starts producing a smartwatch for its existing customers. Which Ansoff strategy?
- market penetration
+ product development
- market development
- diversification
! A new product on the existing market.

? Which business model pattern is **"console cheap, games expensive"**?
- freemium
- long tail
+ razor and blades
- advertising-based
! The base device is cheap, the "consumable" brings the profit.

? Uber connects drivers and passengers and takes a commission on every ride. Which pattern?
- subscription
+ platform (two-sided market)
- razor and blades
- open source + services
! Brokering between two user groups.

? Which Business Model Canvas block does "developer salaries" belong to?
- key resources
- revenue streams
+ cost structure
- key activities
! It is a cost, the bottom-left field of the canvas.

? A freemium app with 50,000 users has a 4% conversion rate. How many paying users does it have?
= 2000
= 2,000
! 50,000 · 0.04.

? We show two landing-page versions to two user groups and measure the number of sign-ups. What is this called?
= A/B test
= AB test
= A/B
! Comparing two versions with real data.
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **LTV and CAC.** Write the function `ltv(arpu, margin, churn)` (lifetime value, rounded to a whole number) and the function `ltv_cac(arpu, margin, churn, cac)` (the LTV / CAC ratio to 1 decimal)!

```python starter
def ltv(arpu, margin, churn):
    return round(arpu * margin * churn)

def ltv_cac(arpu, margin, churn, cac):
    return round(ltv(arpu, margin, churn) / cac, 1)
```

<details>
<summary>Solution</summary>

```python solution
def ltv(arpu, margin, churn):
    return round(arpu * margin / churn)    # monthly contribution × average lifetime (1 / churn months)

def ltv_cac(arpu, margin, churn, cac):
    return round(arpu * margin / churn / cac, 1)
```

</details>

```python test
assert ltv(2000, 0.8, 0.05) == 32000
assert ltv(3000, 0.5, 0.05) == 30000
assert ltv_cac(2000, 0.8, 0.10, 9000) == 1.8
assert ltv_cac(2000, 0.8, 0.02, 9000) == 8.9
print("All checks passed!")
```

**2.** **Freemium.** Write the function `critical_conversion(users, cost_per_user, premium_price, fixed)`, which tells what percentage of paying users is needed to break even (to 1 decimal)! Every user (free ones too) causes `cost_per_user` cost, and there's a `fixed` monthly cost as well.

```python starter
def critical_conversion(users, cost_per_user, premium_price, fixed):
    return round(100 * cost_per_user / premium_price, 1)
```

<details>
<summary>Solution</summary>

The starter code forgets the fixed cost – with few users that is exactly what decides whether the model works.

```python solution
def critical_conversion(users, cost_per_user, premium_price, fixed):
    cost = users * cost_per_user + fixed                  # total monthly cost
    return round(100 * cost / (users * premium_price), 1)
```

</details>

```python test
assert critical_conversion(200_000, 60, 1500, 3_000_000) == 5.0
assert critical_conversion(100_000, 50, 1000, 0) == 5.0
assert critical_conversion(50_000, 40, 2000, 1_000_000) == 3.0
print("All checks passed!")
```

**3.** **Long tail.** With a Zipf distribution, sales of the $k$-th product are proportional to $\frac{1}{k}$. Write the function `tail_share(catalogue, hits=100)`, which tells what percentage of sales falls outside the `hits` most popular products (to 1 decimal)!

```python starter
def tail_share(catalogue, hits=100):
    return round(100 * (catalogue - hits) / catalogue, 1)
```

<details>
<summary>Solution</summary>

The starter code calculates as if every product sold equally – in reality the hits sell far more.

```python solution
def tail_share(catalogue, hits=100):
    sales = [1 / k for k in range(1, catalogue + 1)]
    return round(100 * sum(sales[hits:]) / sum(sales), 1)
```

</details>

```python test
assert tail_share(1000) == 30.7
assert tail_share(100_000) == 57.1
assert tail_share(10, 5) == 22.0
print("All checks passed!")
```

### Quick check questions

```quiz
? Which block of the business model canvas does a "subscription fee" belong to?
- key partners
- value proposition
+ revenue streams
- key resources
! Revenue streams describe what customers pay for and how.

? What does MVP mean in the Lean Startup method?
+ the minimum viable product, with which the most important assumption can be tested as cheaply as possible
- the most valuable player
- the finished product with every feature
- the marketing plan
! Build – measure – learn: learn from real customers as fast as possible.

? ARPU of 1000 Ft a month, 60% margin, 3% monthly churn. What is the LTV (Ft)?
= 20000
= 20 000
! $1000 \cdot 0.6 / 0.03 = 20{,}000$.

? In the Ansoff matrix, what is diversification?
- an existing product in an existing market
- an existing product in a new market
- a new product in an existing market
+ a new product in a new market
! This is the riskiest growth direction.
```
