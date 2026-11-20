---
title: Deeper – IT in Business Language
summary: The "nines" of availability translated into minutes, the cost of a slow build and an outage in forints, the timeline of an incident's status messages, and the health of an open-source project (time to first response, "bus factor") from the maintainer's, the user's and the company's point of view – with small programs and an interactive chart.
minutes: 40
---

## What you will learn in this lesson

- how to translate **availability** ("three nines") into understandable minutes,
- how to express a technical problem **in money**, so that a decision-maker understands it too,
- at what **pace and in what structure** to communicate during an incident,
- how an **open-source project's** health can be measured, and why it matters to companies.

## 1. The "nines": how much downtime is allowed?

Service level agreements (SLAs) often say something like "99.9% availability". To a non-technical manager this number means nothing – 99.9% is pretty close to 100%, isn't it? Let's translate it into **minutes**:

```python run
# Availability ("nines") translated into allowed downtime
minutes_year = 365 * 24 * 60
for percent in [99.0, 99.5, 99.9, 99.95, 99.99]:
    down_year = minutes_year * (1 - percent / 100)
    down_month = down_year / 12
    print(f"{percent:>6}%: {down_year / 60:6.1f} hours per year, {down_month:6.1f} minutes per month")
```

"99.9%" allows about **44 minutes** of downtime a month – that's one botched update. "99.99%" allows only 4 minutes: that requires automatic failover, multiple servers and round-the-clock on-call, which **costs many times more**. That's the real business question: **how much is the extra nine worth to us?** For a university timetable planner 99.5% is plenty; for a bank's payment system even 99.99% may be too little.

```plot
title: Allowed monthly downtime (minutes) as a function of availability
x: 99, 100
y: 0, 450
f: 30*24*60*(1 - x/100) # minutes per month
dash: 43.2 # the 99.9% limit
```

## 2. A technical problem in money

"The build is slow, it needs two weeks of optimisation." A manager will ask: **is it worth it?** Calculate it for them:

```python run
# The cost of a slow build and an outage in forints – in the decision-maker's language
def num(x):
    return f"{x:,.0f}"                           # thousands separator

# 1) slow build
developers = 6
builds_per_day = 10                              # per developer
wait_minutes = 12 - 3                            # 12 minutes now, 3 minutes once optimised
hourly_cost = 8000                               # Ft, the full cost of one developer hour
workdays_month = 21
lost_hours = developers * builds_per_day * wait_minutes / 60 * workdays_month
cost_month = lost_hours * hourly_cost
optimisation = 2 * 5 * 8 * hourly_cost           # 2 weeks, 1 developer
print(f"{lost_hours:.0f} hours of waiting per month = {num(cost_month)} Ft")
print(f"the optimisation costs {num(optimisation)} Ft and pays off in {optimisation / cost_month * workdays_month:.0f} working days\n")

# 2) an online shop outage
revenue_hour = 150_000                           # Ft average hourly revenue
outage_hours = 3
lost_revenue = revenue_hour * outage_hours
support = 40 * 15 / 60 * 5000                    # 40 complaint calls, 15 minutes, 5000 Ft/hour
print(f"3-hour outage: {num(lost_revenue)} Ft lost revenue + {num(support)} Ft customer support")
print("(+ hard to measure: lost trust, returning customers)")
```

"The build is slow" becomes: "We lose 189 developer hours a month waiting, about 1.5 million Ft; the two-week optimisation costs 640 thousand Ft and pays off in about 9 working days." A manager can approve that **in a minute**. Three rules for translating into money:

- **State** the assumptions (hourly cost, number of builds), so the decision-maker can check or adjust them.
- Round **honestly**, and signal uncertainty ("about", "at least").
- Don't forget the **hard-to-measure** items (trust, developer satisfaction) – but don't overcount them either.

## 3. An incident's status messages: pace and structure

In the basic lesson we saw what makes a good incident message. In practice an incident is a **timeline**: several messages one after another, at a regular pace. The most important rule: **write even when there's no news** – silence tells users that nobody is working on the problem.

```python run
# Incident communication: a timeline of status messages from a template, with regular updates
from datetime import datetime, timedelta

start = datetime(2026, 11, 20, 14, 5)
events = [  # (minutes from start, status, what we know)
    (0, "Investigating", "The booking page shows an error for some users. Bookings already made are safe."),
    (20, "Identified", "The error is caused by a database update. We are rolling back to the previous version."),
    (50, "Fixing", "The rollback is in progress; booking is still slow for some users."),
    (75, "Resolved", "The service has been restored. We will publish a detailed analysis within 2 working days."),
]
update_minutes = 30                              # the next update comes at the latest after this much time
for minute, status, text in events:
    t = start + timedelta(minutes=minute)
    nxt = "" if status == "Resolved" else f" Next update: by {(t + timedelta(minutes=update_minutes)):%H:%M} at the latest."
    print(f"[{t:%H:%M}] {status.upper()}: {text}{nxt}")
```

Notice the structure: every message has the **status**, **what we know**, what does **not** affect users (bookings are safe), and **when the next** news comes. At the end there's a promise: publishing a **blameless post-mortem**. Such a series builds trust – often more than if the error had never happened.

## 4. The health of an open-source project

When a company builds on an open-source library, it's really building on a **community**. Two simple indicators reveal a lot: how long a new issue takes to get an answer (**time to first response**), and how many people the project depends on (**bus factor**: after how many people leaving development would stop).

```python run
# Health of an open-source project: time to first response and bus factor
from statistics import median

first_response_hours = [2, 5, 1, 30, 4, 72, 3, 8, 6, 120, 2, 10]   # the last 12 issues
print(f"median time to first response: {median(first_response_hours)} hours, slowest: {max(first_response_hours)} hours")

commits = {"maria": 410, "tom": 95, "lee": 60, "ana": 25, "dev42": 10}   # commits over the past year
total = sum(commits.values())
covered, bus_factor = 0, 0
for name, count in sorted(commits.items(), key=lambda t: -t[1]):
    covered += count
    bus_factor += 1
    if covered / total >= 0.5:                  # this many people do half the work
        break
print(f"bus factor: {bus_factor} ({covered / total:.0%} of commits come from {bus_factor} person/people)")
```

The median time to first response is good (a few hours), but the bus factor is **1**: more than half the work is done by a single person. Three viewpoints:

| Viewpoint      | What do they see?                                                                                    | What can they do?                                                                     |
| -------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| **maintainer** | Risk of burnout: every question, review and release depends on them, often unpaid.                   | Delegating tasks, "good first issue" labels for new contributors, setting boundaries. |
| **user**       | The library works great – until the maintainer runs out of energy. Then security fixes may stop too. | Good-quality bug reports, improving docs, smaller pull requests – reducing the load.  |
| **company**    | A business risk: their product rests on a one-person project.                                        | Sponsorship, offering developer time to the project, or assessing alternatives.       |

The lesson applies to the whole of topic 18: technical reality (availability, build time, commits) must be **translated** into the language of whoever decides, and every stakeholder's viewpoint is worth understanding.

## Summary

- Translate availability into minutes: 99.9% ≈ 44 minutes of downtime per month, 99.99% ≈ 4 minutes – and weigh whether the extra nine is worth its price.
- Express a technical problem in money, with stated assumptions and honest rounding.
- During an incident communicate at a regular pace (even with no news): status, what we know, what isn't affected, the time of the next update.
- An open-source project's health is well indicated by time to first response and bus factor; the maintainer, the user and the company can all help.

## Lesson exercise

```quiz required
? A service commits to 99.9% availability. How many hours of downtime are allowed in a (365-day) year? (to two decimals)
= 8,76
= 8.76
! $365 \cdot 24 \cdot 0.001 = 8.76$ hours.

? An online shop brings in 200 thousand Ft per hour on average. What is the lost revenue during a 2-hour outage (in thousand Ft)?
= 400
! $200 \cdot 2 = 400$ thousand Ft.

? A single person makes 60% of a project's commits. What is the bus factor (how many people do at least half the work)?
= 1
! A single person already does more than half the work.

? During an incident there's been no new information for 40 minutes. What should you do?
- wait until there's something new
+ send a short update: still investigating, what isn't affected, and when the next news comes
- delete the earlier messages
- only write after the fix
! Silence suggests nobody is working on the problem.

? How should a slow build problem be presented to a non-technical manager?
- "The CI pipeline caching isn't optimal."
+ in monthly lost developer hours and forints, with the solution's cost and payback time, stating the assumptions
- not at all, it's a technical matter
- by pasting the build log
! In the decision-maker's language: cost, benefit, payback.
```
