---
title: Deeper – Cultures and Ethical Decisions with Numbers
summary: Calculating shared working hours in a team across three time zones, why differences between individuals within a culture are larger than between cultural averages (overlapping distributions), and analysing an ethical dilemma from the viewpoint of three ethical theories – with small programs and an interactive chart.
minutes: 40
---

## What you will learn in this lesson

- how to calculate an international team's **shared working hours**, and what to do if there are none,
- why it's **misleading** to apply a cultural average to a single person,
- how to analyse an ethical dilemma according to **three different ethical theories**,
- why a **professional code of ethics** helps in difficult situations.

## 1. Time zones: how many shared working hours?

The three main developers of an open-source project work in Budapest, Bengaluru (India) and San Francisco, everyone from 9 to 17 local time. In winter, local time differs from Coordinated Universal Time (UTC) by: Budapest +1, Bengaluru +5.5, San Francisco −8 hours.

```python run
# Shared working hours across three time zones (in half-hour slots, calculated in UTC)
team = {"Budapest": 1, "Bengaluru": 5.5, "San Francisco": -8}   # offset from UTC (winter time)
start, end = 9, 17                                              # local working hours

def working_utc(offset):
    # the half-hour slots of the working day in UTC (numbered 0–47, the day wraps around)
    return {int(((start - offset) * 2 + i) % 48) for i in range((end - start) * 2)}

slots = {city: working_utc(o) for city, o in team.items()}
cities = list(team)
for i in range(len(cities)):
    for j in range(i + 1, len(cities)):
        shared = slots[cities[i]] & slots[cities[j]]
        print(f"{cities[i]} – {cities[j]}: {len(shared) / 2} hours of shared working time")
all_three = slots["Budapest"] & slots["Bengaluru"] & slots["San Francisco"]
print(f"all three: {len(all_three) / 2} hours")
```

Budapest and Bengaluru overlap for 3.5 hours in the morning, but **San Francisco** doesn't overlap with anyone (it misses Budapest by one hour). What can be done?

- **Asynchronous communication as the basis**: written decisions, detailed tickets, recorded demos – so nobody has to stay up at night for information.
- **Rotating meeting times**: if a live meeting is needed, the inconvenient slot shouldn't always fall on the same person.
- **Hand-over at the end of the day** ("follow the sun"): whoever finishes their day writes a short summary for the next time zone.

> Note: daylight saving time changes the offsets – and it doesn't start everywhere at the same time, while India doesn't have it at all. That's why a real calendar app uses a time zone database, not fixed offsets.

## 2. Cultural average and individual: overlapping distributions

In the basic lessons we learned Hofstede's dimensions (e.g. power distance, individualism). These are **national averages**, and here comes the most common mistake: drawing conclusions from an average about a **specific person**. Suppose a trait (e.g. how directly someone gives criticism) is normally distributed within a culture, and the two cultures' averages differ by $d$ standard deviations:

```plot
title: Distribution of two cultures' members along a trait
x: -4, 6
y: 0, 0.45
param: d = 1, 0, 4, 0.1
f: exp(-x^2/2)/sqrt(2*pi) # culture A
f: exp(-(x - d)^2/2)/sqrt(2*pi) # culture B
```

Move the slider: even with a difference of $d = 1$ standard deviation – which counts as a **large** difference in the social sciences – the two curves largely **overlap**. Let's calculate the overlap, and the chance that a randomly chosen person from culture "A" is **more direct** than one from culture "B":

```python run
# Overlap of two normal distributions and the share of "reversed" pairs at a difference of d SDs
from math import erf, sqrt

def phi(z):
    # the standard normal cumulative distribution function
    return 0.5 * (1 + erf(z / sqrt(2)))

for d in [0.2, 0.5, 1.0, 2.0]:
    overlap = 2 * phi(-d / 2)                # the shared area under the two curves
    reversed_ = phi(-d / sqrt(2))            # P(an A member > a B member), if B's mean is d higher
    print(f"d = {d}: overlap {overlap:.0%}, in {reversed_:.0%} of cases the 'A' person is more direct")
```

With a difference of 1 standard deviation the two distributions overlap by **62%**, and in **24%** of cases the situation is exactly the opposite of what the stereotype would say. So: cultural dimensions are useful for **expecting** differences and **not taking them personally** – but you only learn something about a specific colleague by **getting to know them**.

## 3. One ethical dilemma from three viewpoints

You work in a student start-up developing a healthcare appointment booking app. Two days before the demo for the client, it turns out that in a rare case (about one booking in a thousand) the system assigns the patient to the **wrong doctor**. The lead suggests: "Let's not mention it, it won't come up in the demo anyway, we'll quietly fix it afterwards."

Three major ethical theories ask three kinds of question:

| Theory                             | The question                                                       | What does it say here?                                                                                                                               |
| ---------------------------------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **consequentialist** (utilitarian) | Which option brings the most good and the least harm for everyone? | Hiding it is convenient in the short term, but if a patient goes to the wrong place in production, the harm (health, trust, lawsuit) is far greater. |
| **duty ethics** (deontology)       | Which rule or duty are we violating?                               | The client has a right to know about a known bug affecting health; deception is wrong in itself.                                                     |
| **virtue ethics**                  | What would an honest, responsible professional do?                 | They'd disclose the bug and bring a proposal for fixing it – building long-term trust this way.                                                      |

Consequentialist thinking can also be illustrated with numbers. You set the weights – which is itself an ethical decision:

```python run
# Consequentialist weighing: expected benefit and harm per option (illustrative scores)
options = {
    # (name): [(probability, impact in points, who is affected)]
    "hide it, fix it quietly afterwards": [
        (0.90, +10, "team: smooth demo"),
        (0.10, -200, "patient and client: the bug shows up in production, loss of trust"),
    ],
    "disclose the bug and the fix plan": [
        (1.00, -5, "team: a more awkward demo"),
        (1.00, +15, "client: can trust us and plan"),
    ],
}
for name, impacts in options.items():
    expected = sum(p * i for p, i, _ in impacts)
    print(f"{name:<40} expected value: {expected:+.1f}")
```

Hiding it has a negative expected value (−11), because even a low-probability but **severe** harm is enough to tip the balance. The other two theories reach the same conclusion by a different route – this is common, and a good sign: if all three theories say the same thing, you can decide with confidence. If they contradict each other, it's a real dilemma, and it's worth discussing with others too.

**A professional code as a handrail:** the ACM Code of Ethics states that professionals should avoid harm, be honest and trustworthy, and put the public good first. Referring to such a code is easier, even with a manager, than to a feeling of "I don't think this is right": "By professional standards a known bug affecting health must be reported – I suggest we present the fix plan too, so we look more professional."

## Summary

- An international team's shared working hours are easy to calculate in UTC; if there's no overlap, asynchronous written communication and rotating meeting times help.
- Cultural dimensions are averages: even with large differences the distributions overlap heavily, so you can only draw conclusions about a person after getting to know them.
- The three questions of an ethical dilemma: what is the best outcome (utilitarianism), which duty are we violating (deontology), what would a good professional do (virtue ethics).
- A professional code of ethics is a shared, citable standard in difficult situations.

## Lesson exercise

```quiz required
? Budapest is UTC+1, New York UTC−5; in both places people work from 9 to 17 local time. How many hours of shared working time are there?
= 2
! In UTC Budapest works 8–16 and New York 14–22; the overlap is 14–16, i.e. 2 hours.

? Two cultures' averages differ a lot in a trait. What does this tell you about a specific colleague?
- exactly how they will behave
+ only a weak prior expectation – differences between individuals are large, so you need to get to know them
- that they certainly behave according to the average
- nothing, because culture doesn't exist
! The distributions overlap heavily even with large differences.

? Which ethical theory asks: "Which rule or duty are we violating?"
- consequentialist ethics
+ duty ethics (deontology)
- virtue ethics
- none of them
! Deontology focuses on duties and rules, not consequences.

? If hidden, the impact is +10 points with 90% chance and −200 points with 10% chance. What is the expected value?
= -11
! $0.9 \cdot 10 + 0.1 \cdot (-200) = 9 - 20 = -11$.

? Two team members have no shared working hours. What's the best practice?
- make every decision in live calls, at night too
+ asynchronous, written communication (decisions, tickets, end-of-day summaries), and rotating meeting times if needed
- leave the remote colleague out of decisions
- just send e-mails without expecting answers
! Asynchronous communication is the basis; the inconvenient slot shouldn't always fall on the same person.
```
