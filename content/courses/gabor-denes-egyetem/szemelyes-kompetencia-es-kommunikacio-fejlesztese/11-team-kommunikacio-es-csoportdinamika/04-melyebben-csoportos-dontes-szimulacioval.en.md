---
title: Deeper – Group Decisions by Simulation
summary: When is a group smarter than an individual? Condorcet's jury theorem, and how a lack of independence ruins it (a simulation of groupthink), the "hidden profile": why unique information doesn't come up, and recognising a Tuckman stage from symptoms – with small programs and an interactive chart.
minutes: 40
---

## What you will learn in this lesson

- when a group decides **better** by majority vote than one person,
- why it **ruins** the group's wisdom if everyone follows the most vocal member,
- why what only one team member knows often stays **hidden**,
- how to recognise your team's **development stage** from symptoms.

## 1. The wisdom of the group: Condorcet's theorem

The French mathematician Nicolas de Condorcet noticed in the 18th century: if every group member decides correctly **independently of the others** with probability $p > 0.5$, then a **majority vote** is more reliably correct the larger the group. With three people, the majority decides correctly if at least two decide correctly:

$$P_3 = p^3 + 3p^2(1 - p)$$

```plot
title: The chance that a majority decision is correct, as a function of individual accuracy
x: 0, 1
y: 0, 1
f: x # one person
f: x^3 + 3*x^2*(1 - x) # majority of 3
f: x^5 + 5*x^4*(1 - x) + 10*x^3*(1 - x)^2 # majority of 5
```

The curves cross at $p = 0.5$. If individuals are better than a coin toss, the group is **even better** (the curves lie above the diagonal); if they're worse – for example because they're misinformed – the group is **even worse**. Calculating exactly, for $p = 0.7$:

```python run
# Condorcet's theorem: accuracy of the majority vote of independent members
from math import comb

def majority(n, p):
    # the chance that the majority of n (odd) independent members decides correctly
    return sum(comb(n, k) * p**k * (1 - p)**(n - k) for k in range(n // 2 + 1, n + 1))

for n in [1, 3, 5, 9, 15]:
    print(f"{n:>2} people: {majority(n, 0.7):.1%}")
```

Instead of one person with 70% accuracy, the majority of 9 independent, equally accurate people decides correctly with a chance of over **90%**. That's the "wisdom of crowds" – but there's small print: **independence**.

## 2. When everyone follows the loudest voice: groupthink

**Groupthink**, from the basic lesson, eliminates exactly this independence: at a meeting the team lead or the most confident person speaks first, and the others – out of convenience, respect or fear – go along. Let's simulate: after the first speaker, every member **simply adopts** that opinion with 70% chance, and only otherwise thinks independently (then also deciding correctly with 70% chance):

```python run
# Simulating groupthink: independent members vs members who follow the first speaker
import random

random.seed(42)                                     # reproducible result

def simulate(n, p, conformity, repeats=10000):
    correct = 0
    for _ in range(repeats):
        first = random.random() < p                 # is the first speaker right?
        votes = [first]
        for _ in range(n - 1):
            if random.random() < conformity:
                votes.append(first)                 # adopts the loudest opinion
            else:
                votes.append(random.random() < p)   # decides independently
        correct += sum(votes) > n / 2
    return correct / repeats

for n in [3, 5, 9]:
    independent = simulate(n, 0.7, 0.0)
    conforming = simulate(n, 0.7, 0.7)
    print(f"{n} people: independent {independent:.0%}, conforming {conforming:.0%}")
```

If members follow the first speaker 70% of the time, the group is barely better than **a single person** – however many there are. Size doesn't help if the group really thinks as one person.

What can be done? The techniques from the basic lesson protect exactly this independence:

- Everyone decides (or ranks) **individually, in writing first**, and only then do you discuss.
- **The lead speaks last** – otherwise their opinion acts as an anchor.
- **Devil's advocate**: someone's explicit job is to look for counter-arguments.
- **Psychological safety**: where disagreeing isn't risky, members really say what they think.

## 3. The hidden profile: why doesn't what only one person knows come up?

A great advantage of a group could be that members bring **different information**. Research (Stasser and Titus's "hidden profile" experiments), however, shows that discussions are mostly about what **everyone knows** – unique information often never comes up.

A simple model: **each holder** of a piece of information mentions it independently with probability $q$. If $k$ people know it, the chance that it's mentioned is:

$$P(\text{mentioned}) = 1 - (1 - q)^k$$

```python run
# Hidden profile: how likely is a piece of information to be mentioned if k people know it?
q = 0.3                                   # one holder brings it up with this chance
for k in [1, 2, 3, 4]:
    print(f"{k} people know it: mentioned with {1 - (1 - q) ** k:.0%} chance")

# a decision: the shared facts favour option A, the unique facts favour option B
shared = 4                                 # 4 shared facts, all 4 members know them
unique = 4                                 # 4 unique facts, each known by only 1 member
print(f"\nexpected shared facts mentioned (for A): {shared * (1 - (1 - q) ** 4):.1f}")
print(f"expected unique facts mentioned (for B): {unique * (1 - (1 - q) ** 1):.1f}")
```

Although the same number of facts favour each option, in the discussion **on average 3** of the shared facts for A get mentioned, but only **1.2** of the unique ones for B. So the group chooses A – even though B might be better if all the information came up. Remedies:

- **Roles**: everyone is the "expert" for an area, and it's explicitly their job to report on it ("Bálint, what did you see on the security side?").
- **Written preparation**: before the meeting everyone writes down what they know – in a shared document the unique information is visible too.
- **A question at the end**: "Is there anything only you know that you haven't said yet?"

## 4. Which stage is the team in?

Tuckman's model (forming, storming, norming, performing, adjourning) is familiar from the basic lesson. In practice the stage can be recognised from **symptoms**:

```python run
# Recognising the Tuckman stage from symptoms (most matching symptoms wins)
symptoms = {
    "forming": {"politeness", "unclear roles", "waiting for the lead", "little debate"},
    "storming": {"debates about methods", "factions", "deadline slips", "questioning the lead"},
    "norming": {"shared rules", "open feedback", "less conflict", "team language"},
    "performing": {"independent decisions", "fast problem solving", "high performance", "helping each other"},
}

def stage(observed):
    matches = {name: len(signs & observed) for name, signs in symptoms.items()}
    return max(matches, key=matches.get), matches

observed = {"debates about methods", "deadline slips", "factions", "politeness"}
name, matches = stage(observed)
print(f"likely stage: {name}  {matches}")
```

Recognising storming matters because at this point teams tend to **panic** ("this team is bad!"), although it's a natural part of development. What helps: **stating** roles and decision rules out loud, a retrospective meeting, and steering debates towards the **content** instead of people.

## Summary

- Condorcet's theorem: if members are independent and better than chance, the majority decision becomes more accurate with group size.
- If members follow the loudest voice, the group is barely better than one person – so decide individually and in writing first, and let the lead speak last.
- The hidden profile: shared information is more likely to be mentioned ($1 - (1 - q)^k$), unique information often stays hidden; roles and written preparation bring it out.
- The Tuckman stage can be recognised from symptoms; storming is natural, not the team's failure.

## Lesson exercise

```quiz required
? Three independent team members each decide correctly with an 80% chance. What's the chance that the majority decides correctly? (as a decimal)
= 0,896
= 0.896
! $0.8^3 + 3 \cdot 0.8^2 \cdot 0.2 = 0.512 + 0.384 = 0.896$.

? A piece of information is known by a single team member, who brings it up with a 30% chance. If three people knew it (each bringing it up independently with a 30% chance), what would be the chance it's mentioned? (as a decimal)
= 0,657
= 0.657
! $1 - 0.7^3 = 1 - 0.343 = 0.657$.

? What's the best method against groupthink before a decision?
- the lead states their opinion first, as a starting point
+ everyone decides individually in writing first, and the lead speaks last
- a decision that's as fast and unanimous as possible
- only the most experienced member votes
! This preserves independence.

? The team has debates about methods, factions have formed, and deadlines are slipping. Which Tuckman stage are they probably in?
- forming
+ storming
- norming
- performing
! These are typical symptoms of storming.

? Why doesn't a larger group help if everyone follows the loudest voice?
- because a large group always decides worse
+ because the members' votes aren't independent, so the group effectively decides as one person
- because majority voting is mathematically flawed
- because there are too many communication channels
! The condition of Condorcet's theorem is independence.
```
