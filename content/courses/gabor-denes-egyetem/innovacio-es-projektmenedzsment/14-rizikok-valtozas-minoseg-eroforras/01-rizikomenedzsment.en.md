---
title: Risk Management in the Project
summary: The risk management process, risk identification techniques, the risk register, qualitative and quantitative analysis (decision tree, EMV), responses to threats and opportunities, residual and secondary risk.
minutes: 30
---

## What you will learn

- the steps of a project's **risk management process**,
- how to **identify** and **record** risks,
- how to decide with a **decision tree** which option is better,
- the responses to **opportunities** (positive risks).

> We have already seen the basics (probability–impact matrix, EMV, four responses to threats) in topic 4; now we look at the full project management process.

## The risk management process

```text
 1. plan → 2. identify → 3. qualitative analysis → 4. quantitative analysis
   → 5. plan responses → 6. implement responses → 7. monitor
                ▲                                              │
                └─────────────── repeats continuously ─────────┘
```

1. **Plan** – how we will manage risks (scales, roles, frequency).
2. **Identify** – which risks exist?
3. **Qualitative analysis** – estimate probability and impact, rank (P · I matrix).
4. **Quantitative analysis** – numerical impact (EMV, decision tree, simulation) for the most important ones.
5. **Plan responses** – a strategy and an owner for every important risk.
6. **Implement** – carry out the responses.
7. **Monitor** – new risks, changing probabilities, the effect of responses.

## Risk identification techniques

- **brainstorming** and **expert interviews**,
- **checklists** based on earlier projects,
- the **Delphi method** – anonymous expert rounds,
- **SWOT** (weaknesses and threats are often risks),
- **assumption analysis** – what if an assumption turns out false? (topic 7),
- **risk breakdown structure** (RBS): organised by category (technical, external, organisational, project management).

It is worth phrasing a risk in **cause – risk – effect** form:

> _Because_ the team has never worked with Kubernetes (cause), _the_ deployment setup _may_ take longer (risk), _which would_ delay handover by 2 weeks (effect).

## The risk register

| Field             | Example                                                |
| ----------------- | ------------------------------------------------------ |
| ID, description   | R-07: Kubernetes deployment takes longer               |
| category          | technical                                              |
| probability (1–5) | 3                                                      |
| impact (1–5)      | 4                                                      |
| score (P · I)     | 12                                                     |
| **risk owner**    | Péter Kiss, DevOps engineer                            |
| **trigger**       | the test environment is still not running after 1 week |
| response strategy | mitigate: 2-day training, bring in an outside expert   |
| status            | open                                                   |

- **Risk owner**: one person who watches and handles the risk.
- **Trigger**: a warning sign that the risk is about to occur.
- **Residual risk**: what remains after the response.
- **Secondary risk**: a risk caused by the response itself (e.g. the outside expert arrives late).

## Quantitative analysis: decision tree

A **decision tree** helps choose between options when outcomes are uncertain. We calculate the **expected value** of each branch.

Example: a module is either **built in-house** or **bought** (costs in millions).

```text
                         ┌─ 70%: no problem ─────────── 50
          ┌ build ───────┤
          │              └─ 30%: +20 extra cost ─────── 70
 decision ┤
          │              ┌─ 90%: no problem ─────────── 60
          └ buy ─────────┤
                         └─ 10%: +10 integration ────── 70
```

- Build: 0.7 · 50 + 0.3 · 70 = 35 + 21 = **56**
- Buy: 0.9 · 60 + 0.1 · 70 = 54 + 7 = **61**

Based on expected cost, **building** is better (56 < 61). (Of course other criteria count too, e.g. risk appetite.)

## Responses

**To threats** (negative risk): **avoid, transfer, mitigate, accept** (topic 4) + **escalate** (if it is outside the project's authority).

**To opportunities** (positive risk):

| Strategy    | Essence                                           | Example                                           |
| ----------- | ------------------------------------------------- | ------------------------------------------------- |
| **exploit** | make sure it happens                              | put the best developer on the key task            |
| **share**   | exploit it together with a partner                | joint development with a university, shared gains |
| **enhance** | increase its probability or impact                | an early beta to get more feedback                |
| **accept**  | if it happens we use it, but we do nothing for it | —                                                 |

## Summary

- Process: plan → identify → qualitative → quantitative analysis → plan responses → implement → monitor.
- Identification: brainstorming, checklists, Delphi, SWOT, assumption analysis, RBS; "cause – risk – effect".
- Register: P, I, score, risk owner, trigger, response; residual and secondary risk.
- Decision tree: expected value per branch.
- Opportunities: exploit, share, enhance, accept.

## Lesson exercise

```quiz required
? In the decision tree example, what is the expected cost of **building in-house** (millions)?
= 56
! 0.7 · 50 + 0.3 · 70.

? An option: 80% chance of 40, 20% chance of 60 million. What is its expected cost?
= 44
! 0.8 · 40 + 0.2 · 60 = 32 + 12.

? What is a **secondary risk**?
+ a risk caused by the risk response itself
- the less important risks
- a risk that has already occurred
- the second risk owner
! E.g. the outside expert brought in arrives late.

? Which is a response to an **opportunity** (positive risk)?
- avoid
- transfer
+ exploit
- mitigate
! Exploit: make sure it happens.

? What is a **trigger**?
+ a warning sign that the risk is about to occur
- the person responsible for the risk
- the name of the risk register
- an insurance contract
! E.g. "the test environment is still not running after 1 week".
```
