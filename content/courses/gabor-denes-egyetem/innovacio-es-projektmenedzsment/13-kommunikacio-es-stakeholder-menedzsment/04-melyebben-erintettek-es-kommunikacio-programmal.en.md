---
title: Deeper – Stakeholders and Communication with a Program
summary: Processing a stakeholder register with a program – the power–interest grid and strategies, the salience model (power, legitimacy, urgency), the gaps of the engagement matrix ranked –, and the distortion of messages through intermediaries ("Chinese whispers") on an interactive chart.
minutes: 35
---

## What you will learn in this lesson

- how a program places stakeholders on the **power–interest grid**, and which strategy goes with each,
- how the **salience model** works with three attributes,
- how to rank **engagement actions** by the difference between the current and the desired state,
- why a message gets distorted when it passes through many **intermediaries**.

## 1. The power–interest grid with a program

We scored the stakeholders of replacing a university's student information system on a 1–10 scale by power (influence) and interest. A value above 5 is "high":

```python run
# Power–interest grid: quadrant and strategy from the stakeholders' scores
stakeholders = {  # name: (power, interest) 1–10
    "rector": (9, 4), "registrar's office": (7, 9), "student union": (4, 9),
    "lecturers": (5, 7), "IT directorate": (8, 8), "software vendor": (6, 6),
    "alumni": (2, 3), "ministry": (8, 2),
}
strategy = {(True, True): "manage closely", (True, False): "keep satisfied",
            (False, True): "keep informed", (False, False): "monitor"}

for name, (p, i) in sorted(stakeholders.items(), key=lambda t: -(t[1][0] + t[1][1])):
    print(f"{name:<25} power {p:>2}, interest {i:>2} → {strategy[(p > 5, i > 5)]}")
```

The program assigns the usual four strategies to the stakeholders, and sorts by the sum of power + interest – so the top of the list holds those who need the most attention (registrar's office, IT directorate). The rector and the ministry are powerful but currently not very interested: they must be **kept satisfied**, with short, infrequent but to-the-point updates – and watched, because a problem can suddenly make them interested. Important: the scores are **estimates** and change during the project, so the register has to be updated regularly.

## 2. The salience model

The salience model looks at three yes/no attributes: **power** (can they affect the project), **legitimacy** (is their claim justified) and **urgency** (do they demand immediate attention). The combinations give seven stakeholder types:

```python run
# Salience model: power, legitimacy, urgency → stakeholder type
types = {
    (1, 0, 0): "dormant", (0, 1, 0): "discretionary", (0, 0, 1): "demanding",
    (1, 1, 0): "dominant", (1, 0, 1): "dangerous", (0, 1, 1): "dependent",
    (1, 1, 1): "definitive", (0, 0, 0): "not a stakeholder",
}
stakeholders = {
    "registrar's office": (1, 1, 1), "ministry": (1, 1, 0),
    "student union": (0, 1, 1), "an unhappy blogger": (0, 0, 1),
    "rector": (1, 1, 0), "software vendor": (1, 0, 0),
}
for name, attributes in stakeholders.items():
    count = sum(attributes)
    print(f"{name:<24} {attributes} → {types[attributes]:<18} (salience: {count}/3)")
```

The more attributes a stakeholder has, the more **salient** they are, and the more attention they need. The registrar's office has all three: it's the "definitive" stakeholder. The student union has no formal power, but its claim is legitimate and urgent – if we ignore it, it may look for an ally (e.g. the press) and gain power that way. The model's advantage is that it's **dynamic**: an attribute appearing or disappearing immediately reclassifies the stakeholder.

## 3. The engagement matrix: where is the biggest gap?

The levels of engagement: unaware (1) – resistant (2) – neutral (3) – supportive (4) – leading (5). For every stakeholder we record the **current** (C) and the **desired** (D) level. We rank the actions by the product of gap and power:

```python run
# Engagement matrix: current and desired level, ranking of actions (gap × power)
levels = {1: "unaware", 2: "resistant", 3: "neutral", 4: "supportive", 5: "leading"}
stakeholders = [  # (name, power 1–10, current, desired)
    ("lecturers", 5, 2, 4), ("registrar's office", 7, 3, 5), ("rector", 9, 3, 4),
    ("student union", 4, 1, 4), ("IT directorate", 8, 4, 5),
]
ranking = sorted(stakeholders, key=lambda t: -(t[3] - t[2]) * t[1])
for name, power, c, d in ranking:
    if d > c:
        print(f"{name:<25} {levels[c]:>10} → {levels[d]:<10} priority: {(d - c) * power}")
```

At the top of the list is the registrar's office (it has to move two levels, and its power is high), followed by the student union (a three-level gap – we haven't even informed them yet!) and the resistant lecturers. Resistance is worth **understanding**: what are the lecturers afraid of? If it's that entering grades will be more complicated in the new system, a short demo and a pilot group are worth more than any circular e-mail.

## 4. Chinese whispers: distortion of the message

In the communication model every relay brings **noise**. Suppose that at every hand-over a detail of the message is distorted or lost with probability $p$. After $k$ intermediaries a detail arrives unchanged only with probability $(1 - p)^k$:

```python run
# Distortion of a message through intermediaries: a detail arrives unchanged with probability (1 − p)^k
details = 10                                      # the message consists of this many important details
for p in [0.05, 0.10, 0.20]:
    row = "  ".join(f"k={k}: {details * (1 - p) ** k:4.1f}" for k in [1, 2, 4, 6])
    print(f"p = {p:.0%} | intact details out of 10: {row}")
```

If there's 10% distortion at every hand-over, after four intermediaries only about 6.6 of the 10 details remain intact. That's why the key messages should reach stakeholders **directly** (or in writing, from a single authoritative source), and why important decisions should be followed by a **confirmation** ("Do I understand correctly that…?"). Push communication (e-mail) alone doesn't guarantee that the message has actually arrived.

```plot
title: Share of intact details as a function of the number of intermediaries
x: 0, 10
y: 0, 1
param: p = 0.1, 0.01, 0.4, 0.01
f: (1 - p)^x # chance that a detail arrives unchanged
dash: 0.5 # half
```

## Summary

- The power–interest grid gives four strategies (manage closely, keep satisfied, keep informed, monitor); the scores are estimates and must be updated regularly.
- In the salience model the number of attributes among power, legitimacy and urgency shows how much attention is needed; the "definitive" stakeholder has all three.
- Engagement actions can be ranked by the product (desired − current) × power.
- Every relay adds noise: after $k$ intermediaries the chance that a detail stays intact is $(1 - p)^k$.

## Lesson exercise

```quiz required
? A stakeholder's power is 8, interest 3 (a value above 5 is high). Which strategy fits?
- manage closely
+ keep satisfied
- keep informed
- monitor
! High power, low interest → keep satisfied.

? In the salience model, which stakeholder has power and legitimacy but no urgent claim?
- dangerous
- dependent
+ dominant
- demanding
! Power + legitimacy = dominant.

? A stakeholder is currently "resistant" (2), the desired level is "supportive" (4), and their power is 6. What is their priority (gap × power)?
= 12
! $(4 - 2) \cdot 6 = 12$.

? A message is distorted with a 20% chance at every hand-over. What's the chance it arrives intact after two intermediaries? (as a decimal)
= 0,64
= 0.64
! $0.8^2 = 0.64$.

? What's the best way to make sure an important decision reaches the stakeholders accurately?
- have the team leads pass it on verbally
+ communicate it directly, from a single authoritative written source, and ask for confirmation
- send it through as many channels and in as many versions as possible
- wait until the stakeholders ask about it themselves
! Fewer intermediaries → less distortion; confirmation checks understanding.
```
