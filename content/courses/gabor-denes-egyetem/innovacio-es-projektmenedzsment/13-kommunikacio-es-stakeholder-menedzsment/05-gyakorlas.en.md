---
title: Practice – Communication and Stakeholders
summary: Review questions and a summary worksheet for the thirteenth topic.
minutes: 45
kind: practice
---

## Review questions

<details>
<summary>1. Why is it not enough to send the sponsor a 20-page status report every week?</summary>

Because the sponsor is a high-power stakeholder with little time: they will probably not read a long report (push communication). A short one-page RAG report with the points needing a decision is needed, and an in-person check-in for important matters.

</details>

<details>
<summary>2. Place the stakeholders of a new canteen app on the power–interest grid: rector, students, canteen operator company, university facilities office.</summary>

Rector: high power, medium–low interest → keep satisfied. Students: low power, high interest → keep informed (and involve in testing). Canteen operator: high power (it cannot work without them), high interest → manage closely. Facilities office: low power, low interest → monitor.

</details>

<details>
<summary>3. The head of the registrar's office opposes the new system because "the old one worked too". What would you do?</summary>

Listen to what they fear (e.g. more work during the transition, data errors). Show their team the concrete benefits, involve them as key users in testing, provide training and transitional support, and show a quick win (e.g. an automated report) early.

</details>

<details>
<summary>4. A supplier offers a licence 20% above market price. How would you use your BATNA?</summary>

Assess the alternatives in advance (another supplier, an open-source solution). If the best of these is cheaper than the current offer, that is a strong negotiating position: bring the market price as an objective criterion, and if they do not move, choose the BATNA.

</details>

## Summary worksheet

```quiz required
? How many communication channels are there in a **12-person** project team?
= 66
! 12 · 11 / 2.

? A 4-person team gets 2 new members. How many **more** channels will there be?
= 9
! 6 · 5 / 2 = 15; 4 · 3 / 2 = 6; 15 − 6.

? Which is **push** communication?
+ a weekly status report by e-mail
- a video call
- the project wiki
- an in-person meeting
! The sender delivers it, but it may not be read.

? An authority can stop the project by law, with an immediate deadline. What kind of stakeholder is it in the salience model?
- dormant
- demanding
+ definitive
- discretionary
! It has all three attributes (power, legitimacy, urgency).

? The finance director has high power but hardly any interest in the project. Which strategy?
- manage closely
+ keep satisfied
- keep informed
- monitor
! Keep satisfied: briefly, on the essentials.

? Which engagement strategy means the stakeholder leads part of the change themselves?
- inform
- consult
- involve
+ empower
! They become the change "champion".

? What is a good way to end a meeting?
- "We'll discuss it later."
+ record and send out the decisions and action items (who, what, by when)
- everyone says what they did at the weekend
- raise new topics at the end of the meeting
! Written minutes with decisions and actions.
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **Power–interest grid.** Write the function `strategy(power, interest, threshold=5)`, which, treating values above the threshold as high, returns the strategy: `"manage closely"`, `"keep satisfied"`, `"keep informed"` or `"monitor"`!

```python starter
def strategy(power, interest, threshold=5):
    return "manage closely" if power > threshold else "monitor"
```

<details>
<summary>Solution</summary>

```python solution
def strategy(power, interest, threshold=5):
    if power > threshold:
        return "manage closely" if interest > threshold else "keep satisfied"
    return "keep informed" if interest > threshold else "monitor"
```

</details>

```python test
assert strategy(8, 8) == "manage closely"
assert strategy(9, 4) == "keep satisfied"
assert strategy(4, 9) == "keep informed"
assert strategy(2, 3) == "monitor"
print("All checks passed!")
```

**2.** **Salience model.** Write the function `salience(power, legitimacy, urgency)` (boolean parameters), which gives the stakeholder's type: `"dormant"`, `"discretionary"`, `"demanding"`, `"dominant"`, `"dangerous"`, `"dependent"`, `"definitive"` or `"not a stakeholder"`!

```python starter
def salience(power, legitimacy, urgency):
    return "definitive" if power and legitimacy and urgency else "not a stakeholder"
```

<details>
<summary>Solution</summary>

```python solution
def salience(power, legitimacy, urgency):
    types = {
        (1, 0, 0): "dormant", (0, 1, 0): "discretionary", (0, 0, 1): "demanding",
        (1, 1, 0): "dominant", (1, 0, 1): "dangerous", (0, 1, 1): "dependent",
        (1, 1, 1): "definitive", (0, 0, 0): "not a stakeholder",
    }
    return types[(int(power), int(legitimacy), int(urgency))]
```

</details>

```python test
assert salience(True, True, True) == "definitive"
assert salience(True, True, False) == "dominant"
assert salience(False, True, True) == "dependent"
assert salience(False, False, True) == "demanding"
assert salience(True, False, False) == "dormant"
print("All checks passed!")
```

**3.** **Engagement actions.** Write the function `engagement_ranking(stakeholders)`, which from a list of `(name, power, current, desired)` quadruples returns the names of those whose desired level is higher than the current one, in descending order of the priority (desired − current) × power!

```python starter
def engagement_ranking(stakeholders):
    ordered = sorted(stakeholders, key=lambda s: -(s[3] - s[2]))
    return [s[0] for s in ordered if s[3] > s[2]]
```

<details>
<summary>Solution</summary>

The starter code looks only at the gap, so a stakeholder with little power but a big gap would come out on top.

```python solution
def engagement_ranking(stakeholders):
    ordered = sorted(stakeholders, key=lambda s: -(s[3] - s[2]) * s[1])   # gap × power
    return [s[0] for s in ordered if s[3] > s[2]]
```

</details>

```python test
stakeholders = [("lecturers", 5, 2, 4), ("registrar's office", 7, 3, 5), ("rector", 9, 3, 4),
                ("student union", 4, 1, 4), ("IT directorate", 8, 4, 5),
                ("software vendor", 6, 4, 4)]
assert engagement_ranking(stakeholders) == ["registrar's office", "student union",
                                            "lecturers", "rector", "IT directorate"]
print("All checks passed!")
```

### Quick check questions

```quiz
? What is pull communication?
- sending an e-mail to every stakeholder
+ the information is available in a shared place and the stakeholder looks it up (e.g. wiki, dashboard)
- a live meeting
- a phone call
! Push: we send it; pull: we make it available; interactive: dialogue.

? What does BATNA mean?
+ the best alternative to a negotiated agreement – what we'd do if no agreement is reached
- the opening offer of the negotiation
- the negotiation deadline
- the list of negotiating parties
! The better your BATNA, the stronger your negotiating position.

? A stakeholder's current level is 1, the desired is 4, their power is 3. What is their priority?
= 9
! $(4 - 1) \cdot 3 = 9$.

? Which quadrant does a stakeholder with little power but high interest belong to?
- manage closely
- keep satisfied
+ keep informed
- monitor
! They need regular updates, and often give valuable feedback.
```
