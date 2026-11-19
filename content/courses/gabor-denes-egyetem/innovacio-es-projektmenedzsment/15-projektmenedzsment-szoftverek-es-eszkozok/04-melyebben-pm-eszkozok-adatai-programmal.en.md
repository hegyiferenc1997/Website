---
title: Deeper – PM Tool Data with a Program
summary: Tool selection with a weighted matrix and sensitivity analysis (at which weight does the decision flip?), a Jira-like workflow as a state machine that filters out illegal transitions, and Kanban metrics (cycle time, 85th percentile, weekly throughput) from ticket data – with small programs and an interactive chart.
minutes: 40
---

## What you will learn in this lesson

- how to check how **stable** a weighted-matrix tool selection is,
- how a ticket workflow can be described as a **state machine**, and how a tool enforces it,
- how to compute the most important **Kanban metrics** from data exported from a PM tool.

## 1. Tool selection: when does the decision flip?

We compare two tools by four criteria (1–5 points). The weight of "features" is disputed: developers think it's important, management less so. Let's see how the winner depends on this weight (the other criteria share the rest in proportion):

```python run
# Weighted scoring matrix with sensitivity analysis: how does the winner depend on the "features" weight?
scores = {
    "A (Jira-like)":   {"features": 5, "price": 2, "integrations": 5, "simplicity": 2},
    "B (Trello-like)": {"features": 3, "price": 5, "integrations": 3, "simplicity": 5},
}
others = {"price": 0.3, "integrations": 0.3, "simplicity": 0.4}   # how the remaining weight is split

def score(tool, w):
    s = scores[tool]
    return w * s["features"] + (1 - w) * sum(wt * s[k] for k, wt in others.items())

for w in [0.1, 0.2, 0.3, 0.4, 0.5, 0.6]:
    a, b = score("A (Jira-like)", w), score("B (Trello-like)", w)
    print(f"features weight {w:.0%}: A = {a:.2f}, B = {b:.2f} → {'A' if a > b else 'B'} wins")

# The tipping point: 2.9 + 2.1w = 4.4 − 1.4w
print(f"\ntipping point: w = {1.5 / 3.5:.1%}")
```

If the weight of features is below **43%**, the simpler, cheaper B wins; above it, the versatile A. This number is much more useful in the debate than a single final result: if everyone agrees that features weigh at most 30%, the decision is **stable** (B), and there's no need to argue further. If opinions fall on both sides of the tipping point, it's worth trying both with a pilot team.

```plot
title: The two tools' scores as a function of the "features" weight
x: 0, 1
y: 2, 5
f: 2.9 + 2.1*x # A (Jira-like)
f: 4.4 - 1.4*x # B (Trello-like)
point: 0.4286, 3.8 # tipping point
```

## 2. The workflow as a state machine

In a Jira-like tool tickets move between **states**, but not arbitrarily: the workflow specifies which **transition** is allowed. This is a **state machine**:

```python run
# Ticket workflow as a state machine: only allowed transitions can be performed
transitions = {
    "New":          {"In progress", "Rejected"},
    "In progress":  {"Review", "New"},
    "Review":       {"Done", "In progress"},      # review can send it back
    "Done":         set(),                        # final state
    "Rejected":     set(),
}

def check(history):
    state = history[0]
    for nxt in history[1:]:
        if nxt not in transitions[state]:
            return f"illegal transition: {state} → {nxt}"
        state = nxt
    return f"OK, final state: {state}"

tickets = {
    "WEB-101": ["New", "In progress", "Review", "In progress", "Review", "Done"],
    "WEB-102": ["New", "In progress", "Done"],
    "WEB-103": ["New", "Rejected", "In progress"],
}
for ticket, history in tickets.items():
    print(f"{ticket}: {check(history)}")
```

WEB-102 skipped code review – the workflow doesn't allow that, so the quality assurance rule is **enforced by the tool**, not by people's goodwill. WEB-103 was rejected and then started anyway: the process forbids that too (it would have to be reopened through a separate transition, which the system logs). WEB-101 came back from review twice – that's not an error, but if it happens with many tickets, it's worth looking into why (e.g. the acceptance criteria aren't clear).

## 3. Kanban metrics from ticket data

Ticket histories can be exported from PM tools. **Cycle time** runs from the start of work to completion. Besides the average, the **85th percentile** is useful: "85% of tickets are done within this time" – a good basis for a promise.

```python run
# Kanban metrics: cycle time per ticket, average, 85th percentile and weekly throughput
from datetime import date

tickets = [  # (id, start of work, completion)
    ("WEB-101", date(2026, 10, 1), date(2026, 10, 6)), ("WEB-104", date(2026, 10, 2), date(2026, 10, 4)),
    ("WEB-105", date(2026, 10, 2), date(2026, 10, 12)), ("WEB-106", date(2026, 10, 5), date(2026, 10, 8)),
    ("WEB-107", date(2026, 10, 6), date(2026, 10, 9)), ("WEB-108", date(2026, 10, 7), date(2026, 10, 21)),
    ("WEB-109", date(2026, 10, 9), date(2026, 10, 13)), ("WEB-110", date(2026, 10, 12), date(2026, 10, 15)),
    ("WEB-111", date(2026, 10, 13), date(2026, 10, 19)), ("WEB-112", date(2026, 10, 14), date(2026, 10, 16)),
]
times = sorted((end - start).days for _, start, end in tickets)
print("cycle times (days):", times)
print(f"average: {sum(times) / len(times):.1f} days")
p85 = times[int(0.85 * len(times) + 0.5) - 1]         # simple percentile: the element at the 85% position
print(f"85th percentile: {p85} days")

weeks = {}
for _, _, end in tickets:
    week = end.isocalendar()[1]                        # ISO week number
    weeks[week] = weeks.get(week, 0) + 1
print("tickets finished per week:", dict(sorted(weeks.items())))
```

The average is around 5 days, but 85% of tickets take up to about 10 days – one or two "stuck" tickets (WEB-105, WEB-108) stretch the distribution a lot. So promise based on the percentile ("a typical ticket is done within about 10 days"), and examine the outliers: why did they get stuck? (A common cause: a dependency on another team, or a task too big and never split up.) Most Kanban tools draw these metrics automatically (cycle time scatterplot, throughput chart) – but now you know what's behind them.

## Summary

- It's worth checking the result of a weighted matrix with sensitivity analysis: where is the tipping point, and which side are opinions on?
- A ticket workflow is a state machine: the allowed transitions enforce process rules (e.g. mandatory code review).
- Kanban metrics: cycle time per ticket, average and 85th percentile, weekly throughput; promises should build on the percentile.

## Lesson exercise

```quiz required
? Two tools' scores: A = 3 + 2w, B = 4 − w, where w is a criterion's weight. At which w are the two scores equal? (as a decimal)
= 0,33
= 0.33
= 1/3
! $3 + 2w = 4 - w \Rightarrow 3w = 1 \Rightarrow w = \frac13 \approx 0.33$.

? In the lesson's workflow, which transition is illegal?
- Review → In progress
- New → Rejected
+ In progress → Done
- Review → Done
! From "In progress" you can only move to review (or back to new).

? Work on a ticket started on 3 October and finished on 10 October. What is its cycle time in days?
= 7
! $10 - 3 = 7$ days.

? The cycle times of 20 tickets are known in ascending order. Which element is the 85th percentile (with the simple method)?
= 17
! $0.85 \cdot 20 = 17$.

? Why is it better to base a promise on the 85th percentile than on the average?
- because it's always smaller than the average
+ because outlying, stuck tickets make the average misleading, while the percentile tells what share of tickets finish within a given time
- because Kanban forbids using the average
- because the average can't be computed
! "85% of tickets are done within this time" – a promise with a manageable risk.
```
