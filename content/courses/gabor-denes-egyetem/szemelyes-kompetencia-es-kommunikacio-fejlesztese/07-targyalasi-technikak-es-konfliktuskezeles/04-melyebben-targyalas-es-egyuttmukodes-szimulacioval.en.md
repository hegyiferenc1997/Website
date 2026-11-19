---
title: Deeper – Negotiation and Cooperation by Simulation
summary: Multi-issue negotiation with scoring (why "meeting in the middle" is worse than trading, and what a Pareto-efficient agreement is), a small tournament of the iterated prisoner's dilemma (why cooperation wins in the long run), and choosing Thomas–Kilmann styles by situation – with small programs.
minutes: 40
---

## What you will learn in this lesson

- why a **better agreement** is reached when you negotiate several issues at once,
- what it means for an agreement to be **Pareto-efficient**,
- why cooperation **pays off** in the long run (iterated prisoner's dilemma),
- how to choose a **conflict-handling style** for the situation.

## 1. Multi-issue negotiation: don't let price be the only issue

A small business (the client) orders a booking system from you. You need to agree on three issues: the **deadline**, the **price** and the length of **support** (how many months you fix bugs for free). During preparation both sides score how much each option is worth to them (quantifying the interests from the basic lesson):

| Issue    | Option    | Client's points | Developer's points |
| -------- | --------- | --------------: | -----------------: |
| deadline | 4 weeks   |              40 |                  0 |
|          | 6 weeks   |              20 |                 15 |
|          | 8 weeks   |               0 |                 30 |
| price    | 2.0 M Ft  |              30 |                  0 |
|          | 2.5 M Ft  |              15 |                 25 |
|          | 3.0 M Ft  |               0 |                 50 |
| support  | 3 months  |               0 |                 20 |
|          | 6 months  |              10 |                 10 |
|          | 12 months |              30 |                  0 |

For the client a **fast deadline** and **long support** matter (the system is needed by the start of the season, and they have no IT staff of their own). For the developer the **price** counts most. The "obvious" solution is to meet in the middle on everything. Let's look at all $3 \cdot 3 \cdot 3 = 27$ possible packages!

```python run
# Multi-issue negotiation: scores of all packages, the compromise and the Pareto-efficient packages
from itertools import product

issues = {
    "deadline": [("4 weeks", 40, 0), ("6 weeks", 20, 15), ("8 weeks", 0, 30)],
    "price": [("2.0 M Ft", 30, 0), ("2.5 M Ft", 15, 25), ("3.0 M Ft", 0, 50)],
    "support": [("3 months", 0, 20), ("6 months", 10, 10), ("12 months", 30, 0)],
}
packages = []
for choice in product(*issues.values()):            # every combination
    name = ", ".join(c[0] for c in choice)
    packages.append((name, sum(c[1] for c in choice), sum(c[2] for c in choice)))

def dominated(p):
    # is there a package at least as good for both sides, and better for one?
    return any(q[1] >= p[1] and q[2] >= p[2] and (q[1], q[2]) != (p[1], p[2]) for q in packages)

compromise = next(p for p in packages if p[0] == "6 weeks, 2.5 M Ft, 6 months")
print(f"compromise: {compromise[0]} → client {compromise[1]}, developer {compromise[2]}")
print(f"Pareto-efficient? {'no' if dominated(compromise) else 'yes'}\n")

print("Pareto-efficient packages at least as good for both sides:")
for name, c, d in sorted(packages, key=lambda p: -(p[1] + p[2])):
    if c >= compromise[1] and d >= compromise[2] and not dominated((name, c, d)):
        print(f"  {name:<32} client {c}, developer {d}, together {c + d}")
```

The "meet in the middle" compromise (45 + 50 points) is **not Pareto-efficient**: there's an agreement that is **better for both**. If the client gets the fast deadline and long support that matter to them, and in exchange accepts the higher price (4 weeks, 3.0 M Ft, 12 months), the client gets 70 points and the developer 50 – or with the 6 weeks, 3.0 M Ft, 12 months package both are better off (50 and 65 points).

This is **logrolling**: each side gives way on what matters **less to them but a lot to the other**. For this you need to:

- negotiate several issues **at once** (if you settle the price first, the trading opportunity is lost),
- **ask** about interests ("Why are 4 weeks important?"), because in reality nobody puts their scores on the table,
- first **grow** the "pie", and only then divide it.

> An agreement is **Pareto-efficient** if there's no other one that is better for at least one side and worse for neither. A good negotiator doesn't stop at the first acceptable solution, but asks: "Is there a version that's better for both of us?"

## 2. Why does cooperation pay? The iterated prisoner's dilemma

In a team it's decided again and again whether you help the other person (cooperate) or focus on your own task and let them solve their problem (a selfish move). On a single occasion selfishness may seem more rewarding. The **prisoner's dilemma** models this; the points:

| You \ The other    | cooperates | selfish |
| ------------------ | :--------: | :-----: |
| **you cooperate**  |    3, 3    |  0, 5   |
| **you're selfish** |    5, 0    |  1, 1   |

In Robert Axelrod's famous computer tournament, strategies played many rounds against each other. Let's hold a small tournament with four strategies, in 10-round matches:

```python run
# Iterated prisoner's dilemma: a small round robin with four strategies
POINTS = {("C", "C"): (3, 3), ("C", "S"): (0, 5), ("S", "C"): (5, 0), ("S", "S"): (1, 1)}

def always_cooperate(mine, theirs): return "C"
def always_selfish(mine, theirs): return "S"
def tit_for_tat(mine, theirs): return theirs[-1] if theirs else "C"   # cooperates first, then copies
def grudger(mine, theirs): return "S" if "S" in theirs else "C"       # selfish forever after one betrayal

strategies = [always_cooperate, always_selfish, tit_for_tat, grudger]

def match(a, b, rounds=10):
    ha, hb, pa, pb = [], [], 0, 0
    for _ in range(rounds):
        ma, mb = a(ha, hb), b(hb, ha)
        x, y = POINTS[(ma, mb)]
        ha.append(ma); hb.append(mb); pa += x; pb += y
    return pa, pb

total = {s.__name__: 0 for s in strategies}
for i, a in enumerate(strategies):
    for b in strategies[i:]:                          # everyone against everyone (and itself) once
        pa, pb = match(a, b)
        total[a.__name__] += pa
        if a is not b:
            total[b.__name__] += pb
for name, p in sorted(total.items(), key=lambda t: -t[1]):
    print(f"{name:<18} {p:>3} points")
```

The "always selfish" strategy scores at least as many points as its opponent in every single match – **yet it comes last**, because it can't reach high scores together with the cooperators. **Tit for tat** and the grudger lead: they **start nice** (cooperate) but **don't let themselves be exploited**.

What does this mean for teamwork?

- **Start by cooperating**: help, share information, assume good intent.
- **React** to exploitation (tit for tat isn't naive), but **forgive** quickly: if the other returns to cooperation, so do you. (The grudger loses the benefit of cooperation forever because of one accidental misunderstanding – in a real team that's its biggest risk.)
- A team is a **repeated game**: whoever is selfish today won't get help tomorrow. So in a good team culture cooperation is the rational choice, not just the kind one.

## 3. Which conflict-handling style when?

The two axes of the Thomas–Kilmann model from the basic lesson: how important the **issue** is (your own goal), and how important the **relationship** is (the other side's goals). No style is "the right one" – the situation decides:

```python run
# Thomas–Kilmann: choosing a style by the importance of the issue and the relationship (1–5)
def style(issue, relationship, urgent=False):
    if urgent and issue >= 4:
        return "competing (quick, firm decision)"
    if issue >= 4 and relationship >= 4:
        return "collaborating (problem-solving)"
    if issue >= 4:
        return "competing"
    if relationship >= 4:
        return "accommodating"
    if issue <= 2 and relationship <= 2:
        return "avoiding"
    return "compromising"

situations = [
    ("the server is down in production, you argue about what to do", 5, 3, True),
    ("with a long-term client about the architecture", 5, 5, False),
    ("a teammate wants to pick the meeting room's colour", 1, 4, False),
    ("a stranger comments on a forum that your code style is bad", 1, 1, False),
    ("who presents the demo, moderately important to both of you", 3, 3, False),
]
for desc, i, r, u in situations:
    print(f"{desc:<64} → {style(i, r, u)}")
```

The program simplifies, of course, but shows the way of thinking: **first assess** how important the issue and the relationship are to you, and only then choose. The problem is usually that everyone uses their **habitual** style everywhere: the ever-accommodating colleague gives way on important matters too, and the ever-competing one argues even about the meeting room's colour.

## Summary

- In multi-issue negotiation "meeting in the middle" is often not Pareto-efficient; logrolling (each side gives way on what matters less to them) can give a better agreement for both.
- Negotiate the issues at once and ask about interests – first grow the pie, then divide it.
- In the iterated prisoner's dilemma the strategy that starts nice but reacts to exploitation and forgives (tit for tat) does well; teamwork is a repeated game.
- Choose your conflict-handling style by the importance of the issue and the relationship, not out of habit.

## Lesson exercise

```quiz required
? According to the lesson's scoring table, how many points is the "4 weeks, 2.5 M Ft, 12 months" package worth to the client?
= 85
! $40 + 15 + 30 = 85$.

? In the prisoner's dilemma you're selfish and the other cooperates. How many points do you get in this round?
= 5
! According to the table, the selfish move is worth 5 points if the other cooperates.

? When is an agreement Pareto-efficient?
- when both sides get the same number of points
- when they met in the middle on everything
+ when there's no other agreement that is better for at least one side and worse for neither
- when the client has accepted it
! From a Pareto-efficient agreement nobody's position can be improved without worsening the other's.

? What does the "tit for tat" strategy play in the first round?
+ cooperate
- selfish
- a random choice
- skips the round
! It starts nice, then copies the other's previous move.

? The relationship is very important to you, but the issue is insignificant (e.g. the meeting room's colour). Which style fits?
- competing
- avoiding
+ accommodating
- collaborating
! Important relationship, unimportant issue → accommodating.
```
