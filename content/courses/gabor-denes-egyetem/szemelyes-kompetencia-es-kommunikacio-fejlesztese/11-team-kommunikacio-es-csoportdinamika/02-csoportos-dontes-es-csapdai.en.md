---
title: Group Decision-Making and Its Traps
summary: Groupthink, social loafing, the number of communication channels and Brooks's law, and good group decision techniques: brainstorming, brainwriting, the Delphi method, devil's advocate.
minutes: 20
---

## What you will learn

- the signs of **groupthink**,
- what **social loafing** is,
- how the **number of communication channels** grows with team size,
- good **group decision techniques**.

## Groupthink

Described by psychologist Irving Janis: a cohesive group strives so hard for **agreement** that it suppresses critical thinking and makes a bad decision.

Signs:

- the group believes it is **invulnerable** ("a mistake like that can't happen to us"),
- doubters face **pressure** or fall silent on their own (self-censorship),
- the **illusion of unanimity**: silence counts as consent,
- outside opinions are dismissed.

Remedies:

- the leader speaks **last**,
- appoint a **devil's advocate** who deliberately looks for counter-arguments,
- ask for **outside** opinions,
- before a decision, hold a "**pre-mortem**": "Imagine the project failed six months from now. What caused it?"

## Social loafing

Also known as the Ringelmann effect: in a **group** people often put in **less effort** than alone, because individual contributions are less visible.

Remedies:

- **individual, visible responsibilities** (who took on what, on a shared board),
- smaller teams,
- recognising individual contributions.

## The number of communication channels

In a team of $n$ people every member can communicate pairwise with the others. The number of possible two-person channels is:

$$
C = \frac{n(n-1)}{2}
$$

```plot
title: Number of communication channels by team size
x: 0, 16
y: 0, 120
param: k = 5, 2, 15, 1
f: x*(x - 1)/2 # number of channels
point: k, k*(k - 1)/2 # your team
value: channels in a team of k people = k*(k - 1)/2
```

Move the slider: with 5 people there are 10 channels, with 10 already 45, with 15 people 105. The number of channels grows **quadratically**.

This leads to **Brooks's law** (Fred Brooks: _The Mythical Man-Month_): "Adding manpower to a late software project makes it later." Newcomers have to be trained, and the communication overhead grows.

> That's why software companies like small teams (e.g. Amazon's "two-pizza" rule: a team shouldn't be larger than two pizzas can feed).

## Good group decision techniques

| Technique            | Essence                                                                                   | When is it good?                          |
| -------------------- | ----------------------------------------------------------------------------------------- | ----------------------------------------- |
| **brainstorming**    | many ideas, no criticism, filtering afterwards                                            | collecting new solutions                  |
| **brainwriting**     | everyone first collects ideas alone, in writing, then group discussion                    | when there are dominant and quiet members |
| **dot voting**       | everyone votes for their favourite ideas with a few dots                                  | quickly ranking many ideas                |
| **Delphi method**    | experts give estimates anonymously over several rounds, seeing the summary between rounds | estimates, forecasts                      |
| **planning poker**   | the team shows the estimated size of a task at the same time, discrepancies are discussed | agile task estimation                     |
| **devil's advocate** | one member deliberately looks for counter-arguments                                       | against groupthink                        |

## Summary

- Groupthink: the desire for agreement suppresses criticism – remedy: devil's advocate, outside opinion, pre-mortem.
- Social loafing: less effort in a group – remedy: visible individual responsibility.
- Number of channels: $n(n-1)/2$ – grows quadratically; Brooks's law.
- Techniques: brainstorming, brainwriting, dot voting, Delphi, planning poker.

## Exercise

```quiz required
? At a team meeting nobody contradicts the leader's plan, although several people doubt it. What is this?
- social loafing
+ groupthink
- Brooks's law
- the Delphi method
! The desire for agreement suppresses criticism.

? How many two-person communication channels are there in a team of 8?
= 28
! 8 · 7 / 2 = 28.

? What does Brooks's law say?
- the bigger the team, the faster the development
+ adding manpower to a late software project makes it later
- every project is late
- small teams are always slower
! Training + larger communication overhead.

? In a team two loud members dominate brainstorming while the others stay silent. Which technique helps most?
- more brainstorming the same way
+ brainwriting (everyone first collects ideas alone, in writing)
- the leader decides alone
- voting by show of hands, after the loud ones
! Everyone's ideas get an equal chance.
```
