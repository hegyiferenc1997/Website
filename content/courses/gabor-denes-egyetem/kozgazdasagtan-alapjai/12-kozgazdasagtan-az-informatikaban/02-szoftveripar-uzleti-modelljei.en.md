---
title: Business Models and Metrics of the Software Industry
summary: How does a software company make money? Licences, SaaS subscriptions, freemium, usage-based and advertising models, price discrimination and versioning, unit economics metrics (MRR, churn, CAC, LTV), cloud economics and open source.
minutes: 30
---

## What you will learn

- the main **revenue models** of software,
- what **price discrimination** and **versioning** are,
- how to calculate **unit economics** metrics (MRR, churn, CAC, LTV),
- the economic advantage of the **cloud** (operating cost instead of investment),
- how to make money with **open source**.

## Revenue models

| Model                        | Essence                                            | Example                                                |
| ---------------------------- | -------------------------------------------------- | ------------------------------------------------------ |
| **one-off licence**          | pay once, use forever (updates separately)         | older office software, some games                      |
| **subscription / SaaS**      | monthly or annual fee for the service              | office suites, design tools, streaming                 |
| **freemium**                 | the basic version is free, extra features are paid | note-taking, music and storage services                |
| **usage-based**              | you pay for what you use                           | cloud: CPU hours, storage per GB, API calls, AI tokens |
| **advertising**              | free for users, advertisers pay                    | search engines, social media                           |
| **commission / marketplace** | the platform takes a share of each transaction     | app stores, accommodation booking                      |
| **in-app purchases**         | free base game, paid virtual items                 | mobile games                                           |

**SaaS** (Software as a Service) has become dominant over the past decade: more predictable, recurring revenue for the company, lower upfront spending for the buyer, always the latest version.

## Price discrimination and versioning

Because marginal cost is almost zero, it makes sense to set prices by **willingness to pay**. **Price discrimination:** selling the same product to different buyers at different prices.

- **Versioning:** basic / pro / enterprise plans – everyone chooses what suits them (self-selection).
- **Group discounts:** student prices, education licences (reflecting students' lower willingness to pay – and getting them "hooked" early).
- **Regional pricing:** the same subscription is cheaper in lower-income countries.
- **Volume discounts:** an annual subscription is cheaper than 12 monthly ones.

Part of the **consumer surplus** (topic 4) thus goes to the company, but more buyers can get the product.

## Unit economics

A few metrics indicate the health of a subscription business:

- **MRR / ARR:** monthly / annual recurring revenue.
- **ARPU:** average revenue per user (per month).
- **Churn:** the percentage of users who cancel their subscription each month.
- **CAC** (customer acquisition cost): the cost of winning a new customer (marketing, sales).
- **LTV** (lifetime value): the gross profit expected from a customer over their lifetime.

As a simple approximation:

$$ LTV = \frac{ARPU \cdot \text{gross margin}}{\text{monthly churn}} $$

**Example:** ARPU = 3,000 HUF/month, gross margin 80%, monthly churn 4% → $LTV = 3000 \cdot 0.8 / 0.04 = 60\,000$ HUF. If CAC is 15,000 HUF, then $LTV / CAC = 4$.

Rule of thumb: **LTV/CAC should be at least 3** – otherwise winning a customer costs more than they bring. Reducing churn is often worth more than acquiring new customers.

```python run
# Unit economics of a subscription service
arpu = 3000     # HUF / user / month
margin = 0.8    # gross margin
churn = 0.04    # monthly rate
cac = 15000     # HUF / new customer

ltv = arpu * margin / churn
print("LTV:", round(ltv), "HUF")
print("LTV/CAC:", round(ltv / cac, 2))
print("Average lifetime:", round(1 / churn), "months")
```

## Cloud economics

- **Operating cost instead of investment** (capex → opex): no need to build a server room in advance; you pay monthly for what you use. For a start-up this is a huge advantage: low barriers to entry.
- **Flexibility:** more capacity at peak times, less at night – no need to size for the peak.
- **Economies of scale:** at huge scale cloud providers buy hardware and energy more cheaply and use them more efficiently.
- **But:** with large, steady workloads your own infrastructure may be cheaper, and you need to watch out for **lock-in** (lesson 1) and outbound data transfer fees.

## The economics of open source

Why do companies and developers give software away for free?

- **Complementary products:** the software is free, support, cloud hosting and enterprise features are paid (e.g. enterprise support for Linux distributions, cloud versions of open-source databases).
- **Setting a standard:** if my solution spreads, the whole ecosystem builds on me.
- **Shared development:** costs are shared, bugs are found faster.
- **Signalling and human capital:** the developer's portfolio and reputation grow (topic 8).

Open source is a **positive externality** and in many ways a **public good** – so sustaining it (funding maintainers) is a recurring problem.

## Summary

- Models: licence, SaaS, freemium, usage-based, advertising, commission, in-app purchases.
- With near-zero marginal cost, price is set by willingness to pay: versioning, student prices, regional prices.
- Unit economics: LTV = ARPU · margin / churn; LTV/CAC ≥ 3.
- Cloud: opex instead of capex, flexibility, economies of scale – but lock-in.
- Open source: complementary products, standards, shared development, signalling.

## Your task

```quiz required
? Which is the **freemium** model?
- one-off purchase, use forever
+ free basic version, paid extra features
- lives only from advertising
- you pay in proportion to usage
! Free + premium.

? ARPU = 2,000 HUF/month, gross margin 75%, monthly churn 5%. What is LTV (HUF)?
= 30000
! 2000 · 0.75 / 0.05.

? Here CAC is 12,000 HUF. What is the LTV/CAC ratio?
= 2,5
= 2.5
! 30,000 / 12,000 – below the rule of thumb of 3.

? Which is an example of **price discrimination**?
+ a student-discounted subscription
- every buyer pays the same price
- the product is free
- the price equals the production cost
! Different prices according to willingness to pay.

? Why is the cloud advantageous for a start-up?
- because it is always cheaper than own servers
+ because no large upfront investment is needed and it pays according to usage
- because there is no lock-in
- because it is free
! Opex instead of capex.
```
