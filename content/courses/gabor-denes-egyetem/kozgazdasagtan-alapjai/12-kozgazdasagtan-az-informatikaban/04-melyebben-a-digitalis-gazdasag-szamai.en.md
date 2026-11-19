---
title: Deeper – The Numbers of the Digital Economy
summary: Why the winner takes the whole market because of network effects (simulation), when a freemium service's growth is worth it, how two software versions bring more revenue than one, and when the cloud is cheaper than your own server – with small programs and a slider chart.
minutes: 40
---

## What you will learn in this lesson

- why **"winner takes all"** situations often arise in digital markets,
- why the **rapid growth** of a free service isn't always good news,
- how **price discrimination** works through versioning,
- how to decide whether the **cloud** or your **own server** is better.

## 1. Network effects: the winner takes all

Two equally good messaging apps start with 10 users each. Every new user prefers the one where more of their acquaintances are – the chance of choosing is proportional to the network's value (by Metcalfe's law roughly the square of its size):

```python run
# Network effect: two messaging apps compete – a new user prefers the bigger network
import random

def race(seed, new_users=10_000):
    r = random.Random(seed)
    a, b = 10, 10                                  # both start with 10 users
    for _ in range(new_users):
        # the chance of choosing is proportional to the SQUARE of the network size (Metcalfe: value ~ n²)
        if r.random() < a ** 2 / (a ** 2 + b ** 2):
            a += 1
        else:
            b += 1
    return a / (a + b)

for seed in range(1, 7):
    print(f"world {seed}: app A's market share {race(seed):.0%}")
```

Run in six "parallel worlds": one of the apps always takes **almost the whole market** – but which one is decided by early **chance**, not by quality! This is a consequence of the network effect: the bigger network is more attractive, so it grows further (positive feedback). That's why start-ups spend huge sums on rapid growth ("blitzscaling"), and why competition authorities watch platforms especially closely (the EU's Digital Markets Act, the DMA).

```plot
title: The value and cost of a network – critical mass
x: 0, 100
y: 0, 100
param: c = 0.5, 0.1, 1, 0.05
f: x^2/100 # value (~ n²)
f: 20 + c*x # cost
```

The intersection of the two curves is the **critical mass**: below it the network costs more than it's worth to its users, above it it grows by itself.

## 2. Freemium: growth is only good if the contribution is positive

A service offers a free basic plan and a paid plan at 3000 Ft a month. Every user (free ones too!) causes 150 Ft of server and support costs a month:

```python run
# Freemium funnel: is growth worth it? The contribution per user decides
visitors_per_month = 200_000
signup = 0.05                     # 5% of visitors sign up (free plan)
price = 3_000                     # Ft/month for the paid plan
fixed_cost = 6_000_000            # developers, office (Ft/month)
cost_per_user = 150               # servers, support (Ft/month/user – for free users too!)

for conversion in [0.04, 0.08]:   # what percentage of free users pay
    contribution = conversion * price - cost_per_user          # a user's average monthly contribution
    print(f"conversion {conversion:.0%}: contribution per user {contribution:+.0f} Ft/month")
    users = 0.0
    for month in range(1, 25):
        users = users * 0.97 + visitors_per_month * signup     # 3% monthly churn
        if month in (6, 12, 24):
            result = users * contribution - fixed_cost
            print(f"   month {month:>2}: {users:7,.0f} users, result {result:12,.0f} Ft")
```

At 4% conversion a user brings on average $0.04 \cdot 3000 = 120$ Ft, but costs 150: **the loss grows with every new user**, however fast the growth! At 8% conversion the contribution is positive, and the company becomes profitable within a year. The lesson: the number of users on its own is a "vanity metric" – the **contribution per user** (unit economics) decides whether scaling makes you rich or ruins you.

## 3. Versioning: one product, two prices

Three customer types value a software's basic and professional versions differently. Does a single price or two versions bring more revenue?

```python run
# Versioning: a Basic and a Pro version of a software – three customer types' willingness to pay (Ft/month)
customers = {"student": (1500, 2000, 500), "freelancer": (2500, 6000, 300), "company": (3000, 12000, 100)}
#                        (for Basic, for Pro, number)

# 1) a single product (Pro) at a single price: which price brings the most?
best = max((p * sum(n for b, pr, n in customers.values() if pr >= p), p) for p in [2000, 6000, 12000])
print(f"one price: {best[1]:,} Ft → revenue {best[0]:,} Ft/month")

# 2) two versions: Basic 1500 Ft, Pro 5000 Ft – everyone picks the one with the largest "gain"
basic, pro = 1500, 5000
revenue = 0
for name, (wb, wp, n) in customers.items():
    gain_basic, gain_pro = wb - basic, wp - pro
    choice = "Pro" if gain_pro >= max(gain_basic, 0) else "Basic" if gain_basic >= 0 else "nothing"
    revenue += n * (pro if choice == "Pro" else basic if choice == "Basic" else 0)
    print(f"   {name:<10} → {choice}")
print(f"two versions: revenue {revenue:,} Ft/month")
```

With a single price we either sell cheaply to everyone (and companies pay much less than they'd be willing to), or expensively (and students drop out). With two versions customers **choose the price meant for them themselves** (self-selection): the student takes the cheap basic plan, the freelancer and the company take Pro – revenue is 15% higher. The Pro price must be set so that it isn't worth the freelancer "sliding down" to the basic plan. The same logic is behind student discounts, "Home/Business" editions and budget airline tickets.

## 4. Cloud or own server?

```python run
# Cloud or own server? When does your own machine pay off, and what if the load fluctuates?
own_investment, own_monthly = 6_000_000, 150_000     # purchase + power, operation per month
cloud_monthly_full = 450_000                         # the same capacity rented continuously

months = own_investment / (cloud_monthly_full - own_monthly)
print(f"at continuous full load the own server pays off in {months:.0f} months")

# In the cloud we pay only for the capacity actually used
for utilisation in [1.0, 0.5, 0.2]:
    cloud = cloud_monthly_full * utilisation
    own_3y = own_investment + 36 * own_monthly
    print(f"average utilisation {utilisation:.0%}: 3 years cloud {36 * cloud:>12,.0f} Ft vs own {own_3y:>12,.0f} Ft")
```

At continuous, steady, full load the own server pays off in about 20 months, and is cheaper over 3 years. Most services' load, however, **fluctuates** (many users by day, few at night, campaigns, seasonality); in the cloud we pay only for the capacity actually used, so at 50% average utilisation the cloud already wins. The cloud also turns a fixed cost into a **variable cost** – a start-up doesn't have to invest millions up front, and if the product doesn't work out, it isn't stuck with an expensive machine. That's why almost every start-up begins in the cloud today, and why some large companies with predictable loads move systems back to their own servers.

## Summary

- Network effect: positive feedback, "winner takes all", critical mass; chance and speed often matter more than quality.
- Freemium: growth is only worth it if the contribution per user is positive.
- Versioning: through customers' self-selection, more consumer surplus is turned into revenue.
- Cloud: variable cost, flexible capacity; cheaper with fluctuating load, while with steady full load your own machine pays off.

## Lesson exercise

```quiz required
? According to Metcalfe's law, by what factor does a network's value grow if the number of users grows from 10 to 20?
= 4
! The value is proportional to the square of the number of users: $2^2 = 4$.

? In a freemium service 5% of users pay 2000 Ft a month, every user costs 80 Ft a month. What is the monthly contribution per user (Ft)?
= 20
! $0.05 \cdot 2000 - 80 = 20$ Ft.

? An own server costs 3.6 million Ft, running it costs 100 thousand Ft a month; the same in the cloud is 400 thousand Ft a month. In how many months does the own server pay off at continuous full load?
= 12
! $\frac{3\,600\,000}{400\,000 - 100\,000} = 12$.

? What is a typical consequence of the network effect for market structure?
- perfect competition with many small players
+ the emergence of one or a few dominant platforms
- constantly falling prices for every player
- quality always decides the competition
! The bigger network is more attractive, so it grows further.

? What is the main purpose of versioning (e.g. a Basic and a Pro plan)?
- to reduce development costs
+ to let customers with different willingness to pay choose the price meant for them themselves
- to make every customer buy the more expensive plan
- to drive out competitors
! It's a form of price discrimination, through self-selection.
```
