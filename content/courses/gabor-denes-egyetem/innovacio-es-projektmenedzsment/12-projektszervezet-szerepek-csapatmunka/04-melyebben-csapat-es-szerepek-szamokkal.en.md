---
title: Deeper – Teams and Roles in Numbers
summary: Automatically checking a RACI matrix (exactly one accountable, workload per person), the effect of team size – communication channels, splitting into sub-teams and the Ringelmann effect on an interactive chart –, and covering Belbin roles when putting a team together, with a program.
minutes: 35
---

## What you will learn in this lesson

- how to check the rules of a **RACI matrix** by machine, and how overload shows up in it,
- why it's worth splitting a big team into **sub-teams**, and what the **Ringelmann effect** shows,
- how to put a team together so that every important **Belbin role** is covered.

## 1. Checking the RACI matrix

The two basic rules of a RACI matrix: every task has **exactly one** accountable person (A) and at least one responsible person (R). A program checks this (and the workload) instantly:

```python run
# Checking a RACI matrix: exactly one A and at least one R per task; R workload per person
raci = {
    "requirements": {"Anna": "A", "Bence": "R", "Csilla": "C", "Dávid": "I"},
    "UI design":    {"Anna": "I", "Bence": "C", "Csilla": "R", "Dávid": "A"},
    "backend":      {"Anna": "A", "Bence": "R", "Dávid": "A"},
    "testing":      {"Anna": "I", "Bence": "R", "Csilla": "C"},
    "release":      {"Anna": "A", "Bence": "R", "Dávid": "C"},
}
workload = {}
for task, roles in raci.items():
    a = [n for n, r in roles.items() if r == "A"]
    r = [n for n, ro in roles.items() if ro == "R"]
    if len(a) != 1:
        print(f"ERROR – {task}: {len(a)} accountable ({', '.join(a) or 'nobody'})")
    if not r:
        print(f"ERROR – {task}: nobody responsible")
    for n in r:
        workload[n] = workload.get(n, 0) + 1

print("\nresponsible (R) workload:", workload)
```

The program finds two errors: the backend has **two** accountable people (Anna and Dávid – if something goes wrong, each points at the other), and testing has **none** (nobody answers for getting it done). The workload is a warning too: Bence is responsible in four of five tasks – he is the project's **bottleneck**, and if he falls ill, everything stops. So the RACI not only records responsibilities but also reveals risks.

## 2. Team size: channels and the Ringelmann effect

In a 12-person team the number of communication channels is $\frac{12 \cdot 11}{2} = 66$. If we split it into two 6-person sub-teams, and the two team leads keep in touch:

```python run
# Communication channels: one big team vs. sub-teams linked by their leads
def channels(n):
    return n * (n - 1) // 2

for sizes in [[12], [6, 6], [4, 4, 4], [3, 3, 3, 3]]:
    internal = sum(channels(s) for s in sizes)
    leads = channels(len(sizes))                 # the sub-team leads also talk to each other
    print(f"{' + '.join(map(str, sizes)):>13} people: {internal:>2} internal + {leads} lead = {internal + leads:>2} channels")
```

The two sub-teams mean only 31 channels instead of 66, three four-person teams 21. That's why large agile projects are organised into **small, autonomous teams** (Scrum recommends teams of fewer than 10, Amazon calls it the "two-pizza team": as big as two pizzas can feed).

The other reason is human. The French engineer Maximilien Ringelmann measured people pulling a rope at the turn of the 19th and 20th centuries: the more people pulled together, the smaller the force **per person**. This is the **Ringelmann effect** (social loafing): in a big group the individual's contribution is less visible, and coordination is partly harder too.

```python run
# Ringelmann effect: performance per person decreases with group size (a simple model)
drop = 0.07                                      # every additional member reduces individual performance by 7%
for n in [1, 2, 3, 4, 6, 8]:
    individual = max(0.0, 1 - drop * (n - 1))
    print(f"{n} people: individual performance {individual:4.0%}, the group pulls with the strength of {n * individual:4.1f} people")
```

In the model 8 people pull with the strength of only about 4 – Ringelmann's measurements showed something similar. The practical antidote: **visible individual contribution** (own area of responsibility, named tasks on the board), small teams and a shared, meaningful goal.

```plot
title: The group's total performance as a function of size (Ringelmann model)
x: 1, 12
y: 0, 12
param: c = 0.07, 0, 0.1, 0.005
f: x*(1 - c*(x - 1)) # group performance (in people)
f: x # ideal case
```

Set the drop ($c$) to zero: the two lines coincide. Even with a small $c$ the gap opens quickly with team size.

## 3. Covering Belbin roles

According to Belbin, in a well-functioning team every important role is present (e.g. plant, implementer, coordinator, completer finisher, specialist…). We can choose four of seven candidates; for each we know their two strongest roles. Which foursome covers the most roles?

```python run
# Building a team: 4 of 7 candidates, so that the most Belbin roles are covered
import itertools

candidates = {
    "Anna": {"coordinator", "teamworker"}, "Bence": {"implementer", "completer finisher"},
    "Csilla": {"plant", "specialist"}, "Dávid": {"implementer", "specialist"},
    "Emese": {"resource investigator", "teamworker"}, "Feri": {"monitor evaluator", "completer finisher"},
    "Gréta": {"shaper", "plant"},
}
all_roles = set().union(*candidates.values())

best = max(itertools.combinations(candidates, 4),
           key=lambda team: len(set().union(*(candidates[n] for n in team))))
covered = set().union(*(candidates[n] for n in best))
print(f"best foursome: {', '.join(best)} – {len(covered)} / {len(all_roles)} roles")
print("missing roles:", ", ".join(sorted(all_roles - covered)))
```

The program tries all $\binom{7}{4} = 35$ foursomes, and picks the one that brings the most different roles – instead of two "similar" people (e.g. Bence and Dávid, both implementers) a complementary one is better. (Four people can bring at most 8 roles, so of the 9 roles one will certainly be missing; the team has to make up for it consciously.) The Belbin model is of course only one aspect: expertise, availability and personal chemistry matter just as much. But it shows well that **diversity** is valuable: if everyone is a plant, nobody finishes the work.

## Summary

- The rules of a RACI matrix (exactly one A, at least one R) can be checked by machine; the number of Rs per person shows overload and bottlenecks.
- The number of communication channels is $\frac{n(n-1)}{2}$; splitting into sub-teams reduces it drastically.
- Because of the Ringelmann effect individual performance drops in a big group; the antidote is visible individual contribution and a small team.
- When building a team, covering the roles (diversity) matters more than everyone being strong in the same thing.

## Lesson exercise

```quiz required
? How many communication channels are there in total if a 10-person team is split into two 5-person sub-teams, and the two leads keep in touch?
= 21
! $10 + 10 + 1 = 21$ (a 5-person team has $\frac{5 \cdot 4}{2} = 10$ channels).

? What's wrong in a RACI matrix if a task has two "A"s?
- nothing, it's safer that way
+ it's unclear who is accountable – each can point at the other
- there are too few responsible people
- there are too many to inform
! Every task must have exactly one accountable person.

? In the Ringelmann model individual performance in a 4-person group is 85%. With the strength of how many people does the group pull?
= 3,4
= 3.4
! $4 \cdot 0.85 = 3.4$.

? What does it mean if a team member is "R" in almost every task in the RACI matrix?
+ they are the bottleneck, overloaded, and losing them is a big risk
- they are the best leader
- the matrix is correct this way
- they should be the "A" everywhere too
! It's worth levelling the workload and naming a backup.

? In how many ways can we choose a 4-person team from 7 candidates?
= 35
! $\binom{7}{4} = \frac{7 \cdot 6 \cdot 5 \cdot 4}{4 \cdot 3 \cdot 2 \cdot 1} = 35$.
```
