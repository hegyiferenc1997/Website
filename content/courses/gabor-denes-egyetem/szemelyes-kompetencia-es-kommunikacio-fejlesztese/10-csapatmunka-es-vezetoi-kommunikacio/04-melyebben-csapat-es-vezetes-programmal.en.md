---
title: Deeper – Team and Leadership with a Program
summary: Belbin role coverage in a four-person student team, situational leadership per task (the same person, a different style), when delegation pays off (training time versus savings), and checking SBI feedback – with small programs and an interactive chart.
minutes: 40
---

## What you will learn in this lesson

- how to check whether **every important role** is covered in a team,
- why the leadership style must be chosen **per task**, not per person,
- how to calculate when delegation **pays off**,
- how to check whether a piece of feedback follows the **SBI model**.

## 1. Is every role covered?

According to the Belbin model from the basic lesson, a well-functioning team needs all nine roles – but one person usually has 2–3 strong roles, so even a four-person team can cover them all. After a short self-assessment questionnaire, the team looks like this:

```python run
# Belbin role coverage: who has which strong role, and what's missing?
roles = {
    "action": ["shaper", "implementer", "completer finisher"],
    "people": ["coordinator", "teamworker", "resource investigator"],
    "thinking": ["plant", "monitor evaluator", "specialist"],
}
team = {
    "Ági": ["plant", "resource investigator"],
    "Bálint": ["specialist", "monitor evaluator"],
    "Dani": ["shaper", "plant"],
    "Emese": ["teamworker", "coordinator", "implementer"],
}
covered = {}
for person, strengths in team.items():
    for r in strengths:
        covered.setdefault(r, []).append(person)

for group, lst in roles.items():
    print(f"{group}-oriented:")
    for r in lst:
        who = covered.get(r)
        print(f"   {r:<22} {', '.join(who) if who else '⚠ MISSING'}")
double = [r for r, who in covered.items() if len(who) > 1]
print(f"\nseveral people strong in: {double}")
```

Two lessons:

- **The completer finisher is missing**: nobody is the type who hunts down every small bug at the end and closes the work on time. In a student project this is a typical problem: the night before the demo it turns out the README is incomplete and half the tests don't run. Solution: someone **consciously takes on** this role (e.g. Bálint, the monitor evaluator), or the team uses a **checklist** for finishing.
- **Two plants** (Ági and Dani): this gives lots of creative ideas, but also debates – it's worth time-boxing brainstorming and then leaving the weighing up to the monitor evaluator.

## 2. Situational leadership per task

In the basic lesson we saw Hersey and Blanchard's model: the style depends on the person's **competence** and **commitment** **in the given task**. So one person can be D4 (experienced) in one task and D1 (beginner) in another at the same time:

```python run
# Situational leadership: style from competence and commitment, per task (1–5 scale)
def style(competence, commitment):
    if competence <= 2 and commitment >= 4:
        return "S1 – directing"           # enthusiastic beginner
    if competence <= 3 and commitment <= 3:
        return "S2 – coaching"            # learning, but disillusioned
    if competence >= 4 and commitment <= 3:
        return "S3 – supporting"          # capable, but unsure or unmotivated
    if competence >= 4:
        return "S4 – delegating"          # experienced and confident
    return "S2 – coaching"

tasks = [  # (person, task, competence, commitment)
    ("Bálint", "designing the database schema", 5, 5),
    ("Bálint", "presenting to the client", 2, 2),
    ("Emese", "running sprint planning", 4, 2),
    ("Dani", "first React component", 1, 5),
]
for person, task, c, m in tasks:
    print(f"{person:<7} {task:<30} → {style(c, m)}")
```

You can safely **delegate** the database design to Bálint – but for the presentation, where Bálint is a beginner and also nervous about it, a **coaching** style is needed: explain what to pay attention to, practise together, and encourage. Emese knows how to run sprint planning but is unmotivated for some reason (maybe feeling unappreciated) – what's needed is **support**, not instructions. The most common leadership mistake is labelling someone "capable" or "a beginner" once and treating them the same way in every task.

## 3. When does delegation pay off?

"It's faster if I do it myself" – true for a one-off task, almost never for a recurring one. Suppose a weekly task (e.g. putting together the weekly release) takes you **2 hours**. Training someone takes a one-off **6 hours**, after which half an hour of checking and questions per week stays with you:

```plot
title: Your own time spent (hours) as a function of weeks
x: 0, 12
y: 0, 24
param: t = 6, 0, 15, 0.5
f: 2*x # I do it myself
f: t + 0.5*x # I delegate (training + weekly checking)
```

The two lines cross where $2x = t + 0.5x$, i.e. $x = t / 1.5$: with 6 hours of training, delegation pays off after **4 weeks**, and after that you gain an hour and a half every week. Move the slider: even 12 hours of training pays for itself in 8 weeks – plenty within a semester-long project.

```python run
# Delegation payback: when does your own effort become smaller?
def payback(own_time, training, checking):
    # after how many weeks it pays off (weekly recurring task)
    saving = own_time - checking
    return training / saving if saving > 0 else None

for task, own, train, check in [
    ("putting together the weekly release", 2, 6, 0.5),
    ("writing meeting notes", 0.5, 1, 0.1),
    ("one-off server migration", 8, 10, 8),
]:
    weeks = payback(own, train, check)
    print(f"{task:<37} {'does not pay off' if weeks is None else f'pays off after {weeks:.1f} weeks'}")
```

The third line is instructive too: a **one-off** task has no weekly saving – here the reason to delegate isn't time but **development** (the colleague learns from it), and that's a valid reason too. Delegation is both an **investment of time** and an **investment in people**.

## 4. Checking SBI feedback

According to the SBI model (Situation – Behaviour – Impact), good feedback names a **concrete situation**, describes **observable behaviour** (not personality), and states its **impact**. A simple checker:

```python run
# SBI check: is there a concrete situation, observable behaviour and impact in a piece of feedback?
import re

def sbi(text):
    t = text.lower()
    situation = bool(re.search(r"yesterday|today|monday|tuesday|wednesday|thursday|friday|last week|demo|meeting", t))
    labelling = bool(re.search(r"\b(lazy|sloppy|clumsy|genius|always|never)\b", t))
    impact = bool(re.search(r"\b(so|because of this|as a result|which meant|thanks to)\b", t))
    issues = [f"missing: {name}" for name, ok in [("situation", situation), ("impact", impact)] if not ok]
    if labelling:
        issues.append("labelling instead of behaviour")
    return issues or ["complete SBI"]

for f in [
    "You're always late, that's really sloppy.",
    "Well done!",
    "At yesterday's demo you handled the questions calmly and precisely, and as a result the client's trust visibly grew.",
    "At Monday's meeting you were 15 minutes late, which meant we had to restart sprint planning.",
]:
    print(f"\"{f}\"\n   → {', '.join(sbi(f))}")
```

Notice that the praise "Well done!" is also **weak** feedback: it feels good, but it doesn't say what's worth repeating. Concrete praise ("at yesterday's demo you calmly handled the questions, and as a result…") **teaches**. Negative feedback is also easiest to accept in SBI form, because it's about the behaviour, not the person.

## Summary

- Belbin role coverage can be checked with a simple table; a missing role can be consciously taken on by someone or replaced by a process (e.g. a checklist).
- The situational leadership style must be chosen per task: the same person can be delegated to in one task and need directing or support in another.
- For a weekly recurring task, the payback time of delegation is: training / (own time − checking).
- Good feedback contains the situation, observable behaviour and impact – praise too.

## Lesson exercise

```quiz required
? A weekly task takes you 3 hours. Training takes 10 hours, after which 1 hour of checking per week stays with you. After how many weeks does delegation pay off?
= 5
! $10 / (3 - 1) = 5$ weeks.

? Which Belbin role was missing in the lesson's team?
- plant
- specialist
+ completer finisher
- coordinator
! Nobody was strong at finding the bugs at the end and closing the work on time.

? A colleague is experienced in a task but is now unmotivated and unsure. Which situational leadership style fits?
- directing
- coaching
+ supporting
- delegating
! High competence, low commitment → supporting (S3).

? Which piece of feedback follows the SBI model?
- "You're always late, that's really sloppy."
- "Well done!"
+ "At Monday's meeting you were 15 minutes late, which meant we had to restart sprint planning."
- "You should pay more attention."
! Situation (Monday's meeting), behaviour (15 minutes late), impact (had to restart).

? What can be the reason for delegating a one-off task if it doesn't save you time?
- nothing, you should never delegate then
+ the colleague's development: they learn from the task
- to reduce your responsibility
- so you don't have to check anything
! Delegation is also an investment in people.
```
