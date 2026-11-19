---
title: Deeper – Network Planning with a Program
summary: The critical path method (CPM) as an algorithm – topological order, forward and backward pass, float – in Python, a text Gantt chart from the computed dates, a "what if" analysis of delays, and an automatic check of the WBS 100% rule.
minutes: 40
---

## What you will learn in this lesson

- how a **program** (every project management tool) computes the critical path,
- how a **Gantt chart** is built from the computed dates,
- how to examine **which delay** threatens the deadline,
- how to check the **WBS** roll-up by machine.

## 1. The critical path as an algorithm

Now a program computes the example from the network planning lesson. Three steps:

1. **topological order**: an order in which every activity comes after its predecessors,
2. **forward pass**: $ES = \max(\text{predecessors' } EF)$, $EF = ES + \text{duration}$,
3. **backward pass**: $LF = \min(\text{successors' } LS)$, $LS = LF - \text{duration}$; the float is $LS - ES$.

```python run
# Critical path method (CPM): forward and backward pass, float
acts = {  # name: (duration in days, predecessors)
    "A": (3, []), "B": (2, ["A"]), "C": (4, ["A"]), "D": (3, ["B"]), "E": (2, ["C", "D"]),
}

# 1) topological order: always take one whose predecessors have all been placed already
order = []
while len(order) < len(acts):
    for name, (_, preds) in acts.items():
        if name not in order and all(p in order for p in preds):
            order.append(name)

# 2) forward pass
ES, EF = {}, {}
for name in order:
    dur, preds = acts[name]
    ES[name] = max((EF[p] for p in preds), default=0)
    EF[name] = ES[name] + dur
length = max(EF.values())

# 3) backward pass (in reverse order)
LS, LF = {}, {}
for name in reversed(order):
    succs = [s for s, (_, pr) in acts.items() if name in pr]
    LF[name] = min((LS[s] for s in succs), default=length)
    LS[name] = LF[name] - acts[name][0]

print("act. | ES | EF | LS | LF | float")
for name in order:
    print(f"  {name}  | {ES[name]:>2} | {EF[name]:>2} | {LS[name]:>2} | {LF[name]:>2} | {LS[name] - ES[name]:>3}")
critical = [n for n in order if LS[n] == ES[n]]
print(f"\nproject length: {length} days, critical path: {' → '.join(critical)}")
```

The same comes out as by hand: the project takes 10 days, the critical path is A → B → D → E, and activity C has 1 day of float. The program's advantage is that it computes instantly even with **a hundred or a thousand** activities – that's how MS Project, GanttProject and the other schedulers work. (The topological sort here is a simple but slow version; for large networks Kahn's algorithm is the usual one, and it also reveals if there's a **cycle** in the dependencies – that's a faulty plan.)

## 2. A Gantt chart from the computed dates

A Gantt chart is simply a drawing of the ES–EF intervals. A slightly larger example, a webshop development:

```python run
# Text Gantt chart: the bars run from the earliest start to the finish, the float shown with dots
acts = {  # name: (duration in days, predecessors)
    "Requirements": (4, []), "UI design": (3, ["Requirements"]), "Database": (3, ["Requirements"]),
    "Backend": (6, ["Database"]), "Frontend": (5, ["UI design"]), "Payment": (3, ["Backend"]),
    "Testing": (4, ["Frontend", "Payment"]), "Release": (1, ["Testing"]),
}
ES, EF = {}, {}
for name, (dur, preds) in acts.items():                 # the listing here is already in a valid order
    ES[name] = max((EF[p] for p in preds), default=0)
    EF[name] = ES[name] + dur
length = max(EF.values())
LS = {}
for name in reversed(list(acts)):
    succs = [s for s, (_, pr) in acts.items() if name in pr]
    LS[name] = min((LS[s] for s in succs), default=length) - acts[name][0]

for name in acts:
    slack = LS[name] - ES[name]
    bar = " " * ES[name] + ("█" if slack == 0 else "▒") * acts[name][0] + "·" * slack
    print(f"{name:<14}|{bar:<{length}}| {'critical' if slack == 0 else f'{slack} days of float'}")
print(f"{'':<14} 0{'':<{length - 3}}{length} days")
```

The **█** bars are the critical path (Requirements → Database → Backend → Payment → Testing → Release, 21 days); the dots after the **▒** bars show the float: UI design and Frontend can slip by 4 days together without threatening the deadline. Important: the float is shared **along the chain** – if UI design slips by 3 days, only 1 day remains for Frontend.

## 3. What if…? – the effect of delays

One of a project manager's most important questions: if an activity slips, does the project slip? Let's recompute the network with each activity delayed by 2 days:

```python run
# Sensitivity analysis: if an activity slips by 2 days, how much does the project slip?
base = {"A": (3, []), "B": (2, ["A"]), "C": (4, ["A"]), "D": (3, ["B"]), "E": (2, ["C", "D"])}

def project_length(acts):
    EF = {}
    for name, (dur, preds) in acts.items():             # listing in a valid order
        EF[name] = max((EF[p] for p in preds), default=0) + dur
    return max(EF.values())

l0 = project_length(base)
for name in base:
    modified = dict(base)
    dur, preds = base[name]
    modified[name] = (dur + 2, preds)                    # this activity takes 2 days longer
    print(f"{name} +2 days → project {project_length(modified)} days (slip: {project_length(modified) - l0})")
```

Every day of delay in the critical activities (A, B, D, E) delays the project too. A 2-day delay in C, however, delays it by only **1 day**: the first day is absorbed by the float, but the second already pushes the deadline – and at that point a **new critical path** appears (A → C → E). That's why you have to watch the float too, not just the critical path.

## 4. The WBS 100% rule by machine

The 100% rule: the elements under a WBS element together cover **exactly** the parent's work – no more, no less. If we assign an estimated cost to every work package, the machine can roll up and check recursively:

```python run
# WBS roll-up recursively, and checking the 100% rule against the approved budgets (thousand Ft)
wbs = {"Webshop": {"Planning": {"Requirements": 400, "UI design": 300},
                   "Development": {"Backend": 1200, "Frontend": 900, "Payment": 500},
                   "Rollout": {"Testing": 600, "Release": 100}}}
budget = {"Webshop": 3800, "Planning": 700, "Development": 2400, "Rollout": 700}

def total(element, name, level=0):
    if isinstance(element, (int, float)):                # work package: the estimate itself
        return element
    s = sum(total(child, c_name, level + 1) for c_name, child in element.items())
    verdict = "OK" if s == budget[name] else f"MISMATCH: budget {budget[name]}"
    print(f"{'  ' * level}{name}: {s} – {verdict}")
    return s

total(wbs["Webshop"], "Webshop")
```

The machine immediately finds that the Development work packages add up to 2600 thousand forints while the approved budget is 2400 – and because of that the whole project also exceeds the 3800 budget by 200 thousand. Either something is missing from the budget, or the WBS contains work that shouldn't be there. The recursion (the function calls itself on the children) follows exactly the tree structure of the WBS.

## Summary

- CPM is an algorithm: topological order, forward pass (max), backward pass (min), float = LS − ES.
- A Gantt chart is a drawing of the ES–EF intervals; float is shared along a chain.
- A "what if" analysis shows which delay threatens the deadline, and when a new critical path is born.
- The WBS can be rolled up recursively, and the 100% rule checked by machine.

## Lesson exercise

```quiz required
? The earliest finishes of an activity's predecessors are 5, 8 and 6. What is the activity's earliest start (ES)?
= 8
! The ES is the maximum of the predecessors' EFs.

? The latest starts of an activity's successors are 12 and 10, its duration is 3. What is its latest start (LS)?
= 7
! $LF = \min(12, 10) = 10$, $LS = 10 - 3 = 7$.

? In the lesson's example (A3, B2, C4, D3, E2) activity C slips by 3 days. How many days will the project take?
= 12
! C has 1 day of float, so the project slips by 2 days: 10 + 2 = 12.

? What does it indicate if the topological sort can't put every activity in order?
- that there are too many activities
+ that there's a cycle in the dependencies, which is a faulty plan
- that there's no critical path
- that every activity is critical
! With a circular dependency none of the activities can start first.

? The estimates of a WBS element's children are 300, 450 and 250, the approved budget is 1100. What does the check by the 100% rule show?
- it's OK
+ a mismatch: the work packages add up to 1000, the budget is 1100
- the WBS has to be thrown away
- the budget has to be cut to 300
! $300 + 450 + 250 = 1000 \ne 1100$ – something is missing from the WBS, or the budget is overestimated.
```
