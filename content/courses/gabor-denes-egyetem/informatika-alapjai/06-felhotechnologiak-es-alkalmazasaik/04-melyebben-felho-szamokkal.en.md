---
title: Deeper – The Cloud in Numbers
summary: Own server or cloud – when each is cheaper, how availability grows with more servers, what Little's law says about a Kanban board, and how a chart with a truncated axis distorts – with small programs and an interactive chart.
minutes: 45
---

## What you will learn in this lesson

- how to work out when the cloud is **cheaper** than your own server, and when it's the other way round,
- why a service is **more reliable** with several servers, and how big the gain is,
- what a Kanban board reveals about **waiting time** (Little's law),
- how to spot a **misleading chart** with numbers.

## 1. Own server or cloud?

A small team launches a web app. There are two options: buy a server (one-time cost + power + maintenance), or rent in the cloud (monthly fee, in proportion to use). Which is cheaper? **It depends on how much it's used**:

```python run
# Own server vs. cloud: monthly cost as a function of utilisation (assumptions, Ft)
server_price = 1_200_000             # one-time, "used up" over 3 years
server_monthly = server_price / 36 + 25_000   # depreciation + power, network, maintenance
cloud_hour = 120                     # Ft per hour for a similar virtual machine

for utilisation in [0.1, 0.25, 0.5, 0.75, 1.0]:
    cloud_monthly = cloud_hour * 24 * 30 * utilisation   # you only pay while it runs
    cheaper = "cloud" if cloud_monthly < server_monthly else "own server"
    print(f"runs {utilisation:4.0%} of the time: cloud {cloud_monthly:>8,.0f} Ft, own {server_monthly:>8,.0f} Ft → {cheaper}")
```

The cloud wins if the machine is needed **only sometimes** (a university project, a campaign site, overnight computations), or if the load **fluctuates** and suddenly ten times as many machines are needed. For systems running continuously at full load, your own (or a long-term reserved) machine can be cheaper. Besides money, **other viewpoints** matter too: your own server needs a person to update and fix it; with the cloud you depend on the provider, and your data sits on another company's machines.

## 2. Availability: why are two servers better than one?

If a server works 99% of the time, the service is down about 3.7 days a year. If there are **two** independent servers and one working is enough, the service is down only when **both** fail at the same time:

$$A_n = 1 - (1 - a)^n$$

```plot
title: Service availability (%) as a function of the number of independent servers
x: 1, 4
y: 90, 100
param: a = 0.95, 0.8, 0.999, 0.005
f: 100*(1 - (1 - a)^x) # at least one server works
dash: 99.9 # "three nines"
```

```python run
# Redundancy: yearly downtime with one, two and three independent servers
for a in [0.95, 0.99]:
    for n in [1, 2, 3]:
        A = 1 - (1 - a) ** n
        print(f"one server {a:.0%}, {n} servers: {A:.6%} → {(1 - A) * 365 * 24:8.2f} hours of downtime a year")
```

With one 99% server, yearly downtime is about 88 hours, with two about 53 minutes, with three half a minute. **But** the formula assumes the failures are **independent**: if both servers are in the same room on the same circuit, one power cut stops both. That's why cloud providers put machines in separate **availability zones** (separate buildings, power, network).

## 3. Kanban and Little's law

In the basic lesson we saw the Kanban board (To do – In progress – Done). Little's law is a simple but surprisingly useful relationship:

$$\text{average lead time} = \frac{\text{number of items in progress}}{\text{average throughput}}$$

If a team has 12 cards "In progress" on average, and 4 get done each week, a new task takes on average **3 weeks** to get through. If they limit the number of parallel items (a **WIP limit**), lead time shortens:

```python run
# Little's law: lead time = work in progress / throughput
throughput = 4                               # cards done per week
for wip in [12, 8, 4]:
    print(f"{wip:>2} cards in progress, {throughput} done a week → average lead time {wip / throughput:.1f} weeks")

# from a real board's log: when a card went "In progress" and when it was done (day)
cards = [(1, 4), (1, 9), (2, 5), (3, 12), (5, 8), (6, 10)]
lead = [done - start for start, done in cards]
print(f"measured lead times: {lead}, average {sum(lead) / len(lead):.1f} days")
```

Besides the team's **viewpoint**, this serves the client's too: if someone asks "when will the new feature be ready?", you can estimate from measured lead times, not from your gut.

## 4. Misleading charts in numbers

The basic lesson mentioned misleading charts. One of the most common tricks is a **truncated vertical axis**: if the axis doesn't start at zero, a small difference looks huge. Let's compute by how much:

```python run
# Truncated axis: apparent vs. real ratio
a, b = 92, 96                                # two products' satisfaction scores (%)
for axis_start in [0, 50, 90]:
    visible_a, visible_b = a - axis_start, b - axis_start
    print(f"axis from {axis_start}: B's bar looks {visible_b / visible_a:.2f} times taller (really {b / a:.2f} times)")
```

If the axis starts at 90, the 4-point (about 4%) difference looks like a **threefold** difference in height. A well-designed bar chart therefore **starts at zero**; if you do want to highlight the difference, show the axis start clearly, or choose a different chart type (e.g. a dot plot).

| Viewpoint              | What matters to them about the cloud?                           |
| ---------------------- | --------------------------------------------------------------- |
| **finance**            | monthly fee versus investment, predictable costs                |
| **operations**         | less hardware maintenance, but new tools and accounts to manage |
| **security / privacy** | where the data is (EU?), who can access it, encryption          |
| **team**               | shared documents, real-time collaboration from anywhere         |

## Summary

- The cloud is cheaper if you use the machine only occasionally or the load fluctuates; with continuous, full load your own machine can be better value.
- With $n$ independent servers availability is $1 - (1-a)^n$, but only if the failures really are independent (separate zones).
- Little's law: lead time = work in progress / throughput – a WIP limit shortens lead time.
- A truncated axis magnifies differences; a bar chart's axis should start at zero.

## Lesson exercise

```quiz required
? Two independent servers each work 90% of the time. What is the service's availability in percent if one is enough?
= 99
! $1 - 0.1^2 = 0.99$.

? A team has 10 cards in progress on average, and 5 get done each week. What is the average lead time in weeks?
= 2
! $10 / 5 = 2$ weeks.

? A virtual machine costs 100 Ft per hour. How much does it cost in a 30-day month if it runs only a quarter of the time (Ft)?
= 18000
! $100 \cdot 24 \cdot 30 \cdot 0.25 = 18\,000$ Ft.

? Why isn't availability necessarily 99.99% with two 99% servers?
- because the formula is wrong
+ because if they're in the same place on the same power, their failures aren't independent
- because two servers are always slower
- because the cloud doesn't allow it
! That's why machines sit in separate availability zones.

? A bar chart's axis starts at 90, and the values are 92 and 96. What's wrong with it?
- nothing
+ the small difference looks many times bigger, so it's misleading
- too many colours
- the title is missing
! A bar chart's axis should start at zero.
```
