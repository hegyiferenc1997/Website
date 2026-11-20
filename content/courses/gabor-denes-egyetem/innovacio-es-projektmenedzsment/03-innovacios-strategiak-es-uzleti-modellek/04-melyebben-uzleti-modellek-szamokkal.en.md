---
title: Deeper – Business Models in Numbers
summary: The unit economics of a subscription business model (LTV, CAC, payback), the critical conversion rate of the freemium model, and the mathematics of the long tail with the Zipf distribution – with small programs and an interactive chart.
minutes: 40
---

## What you will learn in this lesson

- how to check in numbers whether a **subscription** business model is viable (LTV, CAC),
- what **conversion rate** a freemium model needs to be profitable,
- why the **long tail** together can be bigger than the hits.

## 1. Unit economics: LTV and CAC

The "revenue streams" and "cost structure" blocks of the business model canvas are worth calculating at the level of a single customer too:

- **ARPU**: the average monthly revenue per customer,
- **churn**: what percentage of customers cancel the subscription each month – a customer stays on average $1 / \text{churn}$ months,
- **LTV** (lifetime value): $\text{LTV} = \frac{\text{ARPU} \cdot \text{margin}}{\text{churn}}$,
- **CAC** (customer acquisition cost): the cost of winning a new customer (advertising, sales).

Rule of thumb: in a healthy model **LTV / CAC ≥ 3**, and the CAC pays back within 12 months.

```python run
# Unit economics: lifetime value (LTV) and customer acquisition cost (CAC) of a subscription app
arpu, margin, cac = 2000, 0.8, 9000         # Ft/month, margin (share of revenue kept), Ft/customer

for churn in [0.02, 0.05, 0.10, 0.20]:
    lifetime = 1 / churn                     # a customer stays this many months on average
    ltv = arpu * margin / churn
    payback = cac / (arpu * margin)          # months to earn back the acquisition cost
    verdict = "healthy" if ltv / cac >= 3 else "weak" if ltv > cac else "loss-making"
    print(f"churn {churn:4.0%}: lifetime {lifetime:5.1f} mo, LTV {ltv:>7.0f} Ft, "
          f"LTV/CAC {ltv / cac:4.1f} → {verdict}, payback {payback:.1f} mo")
```

Same product, same price – yet everything depends on churn: at 2% a month it's very profitable, but at 20% every new customer makes a **loss**: the acquisition cost would pay back in 5.6 months, but the average customer leaves after just 5 months. That's why subscription companies watch churn at least as closely as the number of new customers.

```plot
title: Lifetime value as a function of monthly churn (margin 80%)
x: 0.01, 0.2
y: 0, 80000
param: a = 2000, 500, 5000, 100
f: a*0.8/x # LTV
dash: 27000 # 3 · CAC
```

On the chart, the LTV curve above the **3 · CAC** line indicates a healthy model. Raise the ARPU (slider $a$), and see how much churn the model can still bear!

## 2. Freemium: what conversion is needed?

In the **freemium** model the basic service is free, and a small share of users pays for premium features. The question: what **conversion rate** covers the cost of serving the free users?

```python run
# Freemium: what percentage of paying users is needed for the model not to make a loss?
users = 200_000
cost_per_user = 60           # Ft/month: servers, support – for every user (free ones too)
premium_price = 1500         # Ft/month for paying users
fixed_cost = 3_000_000       # Ft/month: development team, office

def monthly_result(conversion):
    revenue = users * conversion * premium_price
    return revenue - users * cost_per_user - fixed_cost

for c in [0.02, 0.04, 0.06, 0.08]:
    print(f"conversion {c:.0%}: monthly result {monthly_result(c):>12,.0f} Ft")

critical = (users * cost_per_user + fixed_cost) / (users * premium_price)
print(f"\ncritical conversion rate: {critical:.1%}")
```

Typical freemium conversion is 2–5%, so this model only works if a free user is **very cheap** (for software the marginal cost is close to zero), and if there are many users. The formula:

$$
\text{critical conversion} = \frac{\text{users} \cdot \text{cost per user} + \text{fixed cost}}{\text{users} \cdot \text{premium price}}.
$$

## 3. The long tail

The "long tail" (Chris Anderson) says: online, where the shelf is infinite, the many **rarely** bought products together form a significant market. Product popularity often follows a **Zipf distribution**: sales of the $k$-th most popular product are proportional to $\frac{1}{k}$.

```python run
# Long tail: Zipf distribution, sales of the k-th product ∝ 1/k
def tail_share(catalogue, hits=100):
    sales = [1 / k for k in range(1, catalogue + 1)]
    return sum(sales[hits:]) / sum(sales)                # share of products outside the top 100

for catalogue in [1_000, 10_000, 100_000, 1_000_000]:
    print(f"{catalogue:>9,} products: share outside the top 100 {tail_share(catalogue):5.1%}")
```

In a physical shop (a few thousand products) the hits dominate; in an online catalogue (millions of songs, books, apps) the products **outside** the top 100 make up the larger part of sales. That's why streaming services and app stores can make money from "niche products" too – provided **search and the recommender system** are good, otherwise the buyer never even finds the tail.

## Summary

- $\text{LTV} = \frac{\text{ARPU} \cdot \text{margin}}{\text{churn}}$; in a healthy model LTV / CAC ≥ 3. Reducing churn is often worth more than acquiring customers.
- The critical conversion rate of the freemium model is the total cost divided by the potential premium revenue; it only works with cheap serving and a large user base.
- With a Zipf distribution in a large catalogue the long tail together can be bigger than the hits.

## Lesson exercise

```quiz required
? A subscription costs 3000 Ft a month, the margin is 50%, monthly churn is 5%. What is the LTV (Ft)?
= 30000
= 30 000
! $3000 \cdot 0.5 / 0.05 = 30{,}000$.

? If monthly churn is 4%, how many months does a customer stay on average?
= 25
! $1 / 0.04 = 25$.

? The LTV is 20,000 Ft, the CAC is 10,000 Ft. What can we say according to the rule of thumb?
- healthy, because the LTV is larger than the CAC
+ weak: profitable, but LTV / CAC = 2 doesn't reach 3
- loss-making
- it can't be said
! A healthy model needs LTV / CAC ≥ 3.

? 100,000 users, a cost of 50 Ft/month per user, no fixed cost, premium is 1000 Ft/month. What percentage conversion is needed to break even?
= 5
! $\frac{100{,}000 \cdot 50}{100{,}000 \cdot 1000} = 0.05 = 5\%$.

? What does an online shop need to make money from the long tail?
- as few products as possible
+ a large catalogue and good search / recommendations, so buyers find the rare products
- selling only hit products
- higher prices for the hits
! The tail is only worth something if the buyer finds it.
```
