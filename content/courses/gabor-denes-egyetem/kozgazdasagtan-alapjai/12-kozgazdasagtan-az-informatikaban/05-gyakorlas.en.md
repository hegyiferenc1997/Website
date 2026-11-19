---
title: Practice – The Digital Economy and Course Summary
summary: Review questions on the digital economy, followed by a mixed summary worksheet covering the whole course – through the story of an imaginary Hungarian SaaS start-up.
minutes: 65
kind: practice
---

## Review questions

<details>
<summary>1. Why can a social network offer its service for free, and why does this pay off for it?</summary>

Because it is a two-sided platform: users are free, revenue comes from advertisers. The more users there are, the more valuable the platform is to advertisers (and, because of network effects, to users too). Users "pay" with their attention and data.

</details>

<details>
<summary>2. Why is it hard for a newcomer to break into a market with strong network effects?</summary>

Because users value the existing service precisely because the others are there; a new, empty service is not attractive even if it is technically better. Add switching costs (data, habit). That is why critical mass is needed, and why competition law and data portability matter.

</details>

<details>
<summary>3. How are topics 4 and 12 of this course connected?</summary>

The cost concepts (fixed and marginal cost, economies of scale) and market structures (monopoly, oligopoly) of topic 4 explain the special features of the software industry: near-zero marginal cost and network effects lead to winner-takes-all markets, which is why competition regulation matters.

</details>

<details>
<summary>4. From a computer engineer's point of view: which macroeconomic variables most affect a domestic software company's business?</summary>

The **exchange rate** (the forint value of export revenue), **interest rates** (the availability of financing and venture capital, customers' willingness to invest), **inflation** and **wages** (labour is the biggest cost), the **business cycle** (in a crisis firms cut IT spending), and **regulation** (GDPR, the AI Act).

</details>

## Summary worksheet – covering the whole course

A Budapest start-up is developing a timetable-planning SaaS app for university students.

```quiz required
? One of the founders leaves a job paying 12 million HUF a year for the start-up. What is this in economic terms?
- a sunk cost
+ an opportunity cost
- a fixed cost
- a transfer
! The value of the best alternative given up (topic 1).

? The app's price rises from 1,000 HUF to 1,200 HUF a month, and subscribers fall from 5,000 to 4,500. What is the absolute value of the price elasticity?
= 0,5
= 0.5
! −10% / +20% (topic 3).

? Did monthly revenue rise or fall after the price rise?
+ it rose
- it fell
! 5,000,000 → 5,400,000 HUF – inelastic demand.

? The fixed cost of development is 3 million HUF a month, the cost per user 200 HUF. What is the average cost with 5,000 users (HUF)?
= 800
! (3,000,000 + 1,000,000) / 5,000 (topic 4).

? ARPU is 1,200 HUF, the margin 80%, monthly churn 4%. What is LTV (HUF)?
= 24000
! 1200 · 0.8 / 0.04 (topic 12).

? Inflation is 5%, and the start-up's developers' nominal wages rise by 8%. Approximately by what percentage do their real wages rise?
= 3
= 3%
! 8 − 5 (topics 2 and 6).

? The company receives 20,000 euros from a German client. How many more forints is this worth at a rate of 410 than at 400?
= 200000
! 20,000 · 10 – a weakening forint favours exporters (topic 9).

? The MNB raises interest rates. What is the most likely effect on the start-up?
+ financing becomes more expensive and harder to get
- credit becomes cheaper
- investors become more willing to take risks
- no effect
! Interest rate transmission (topic 7).

? In a recession the start-up's customers cut their spending. What kind of unemployment can this cause in the sector?
- frictional
- structural
+ cyclical
- seasonal
! A downturn in the business cycle (topics 8 and 11).

? The app becomes more useful as the number of users grows (shared timetables, groups). What is this?
+ a network effect
- diminishing returns
- moral hazard
- deflation
! More users → a more valuable product (topic 12).
```

Congratulations, you have reached the end of the Principles of Economics course! Its concepts – opportunity cost, marginal thinking, incentives, supply and demand, inflation, interest rates, exchange rates – will stay with you as an engineer, an entrepreneur and a citizen.

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **Metcalfe's law.** The value of a network is proportional to the number of possible connections: $\frac{n(n - 1)}{2}$. Write the function `metcalfe_ratio(n1, n2)`, which tells by what factor the network's value grows if the number of users grows from `n1` to `n2` (to 2 decimals)!

```python starter
def metcalfe_ratio(n1, n2):
    return round(n2 / n1, 2)
```

<details>
<summary>Solution</summary>

In a large network doubling the users roughly quadruples the value – that's why "the winner takes all" in many platform markets.

```python solution
def metcalfe_ratio(n1, n2):
    links = lambda n: n * (n - 1) / 2       # this many pairs can connect with each other
    return round(links(n2) / links(n1), 2)
```

</details>

```python test
assert metcalfe_ratio(10, 20) == 4.22
assert metcalfe_ratio(100, 200) == 4.02
assert metcalfe_ratio(1000, 3000) == 9.01
assert metcalfe_ratio(2, 4) == 6.0
print("All checks passed!")
```

**2.** **Break-even point.** A software company's monthly fixed cost is `fixed` Ft, a subscription costs `price` Ft, and the variable cost of serving one subscriber is `variable` Ft. Write the function `break_even(fixed, price, variable)`, which tells at least how many subscribers are needed to avoid a loss (a whole number)! If the price isn't larger than the variable cost, return `None`.

```python starter
def break_even(fixed, price, variable):
    return round(fixed / price)
```

<details>
<summary>Solution</summary>

You have to round up: with 666 subscribers the company would still just be at a loss. For a digital product the variable cost is small, so once the fixed cost is covered almost every new customer is pure contribution.

```python solution
import math

def break_even(fixed, price, variable):
    if price <= variable:
        return None                           # every sale makes a loss
    return math.ceil(fixed / (price - variable))  # contribution per unit, rounded up
```

</details>

```python test
assert break_even(1_000_000, 5000, 3000) == 500
assert break_even(900_000, 4000, 1000) == 300
assert break_even(1_000_000, 3000, 1500) == 667
assert break_even(100, 10, 10) is None
print("All checks passed!")
```

**3.** **Payback with growing revenue.** A development costs `investment` Ft, brings `monthly` Ft of revenue in the first month, and this grows by `growth` % every month. Write the function `payback_month(investment, monthly, growth)`, which tells by the end of which month the cumulative revenue reaches the investment! If not even within 120 months, return `None`.

```python starter
def payback_month(investment, monthly, growth):
    return round(investment / monthly)
```

<details>
<summary>Solution</summary>

```python solution
def payback_month(investment, monthly, growth):
    total = 0
    for month in range(1, 121):
        total += monthly                  # add this month's revenue
        monthly *= 1 + growth / 100       # next month's revenue
        if total >= investment:
            return month
    return None
```

</details>

```python test
assert payback_month(1_000_000, 100_000, 0) == 10
assert payback_month(1_000_000, 50_000, 5) == 15
assert payback_month(600_000, 100_000, 10) == 5
assert payback_month(1_000_000, 5000, 0) is None
print("All checks passed!")
```

### Quick check questions

```quiz
? What is the network effect?
+ a product is more valuable to a user the more people use it
- the price of network cables falls
- internet speed increases
- server costs grow with the number of users
! For example, a messaging app is only useful if your friends use it too.

? Why is the marginal cost of one more copy of a piece of software close to zero?
- because programmers work for free
+ because development is a one-off fixed cost, while copying and distribution are almost free
- because the state subsidises it
- because there's no competition
! Most of the cost is development; one more download costs hardly anything.

? A subscription costs 3000 Ft, the variable cost is 1000 Ft, the monthly fixed cost is 400,000 Ft. How many subscribers are needed to break even?
= 200
! $400{,}000 / (3000 - 1000) = 200$.

? What does "lock-in" mean for a platform?
- the platform doesn't allow new users
+ it's expensive or inconvenient for the user to switch to a competitor (data, habits, connections)
- the platform is closed at night
- the platform bans all advertising
! High switching costs keep customers even when a better alternative exists.

? Why are many social networks free for users?
- because they're non-profit organisations
+ because they operate in a two-sided market: advertisers pay for the users' attention and data
- because the state pays for them
- because they have no costs
! "If you're not paying for the product, you are the product."
```
