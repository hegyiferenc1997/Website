---
title: Risk Management Techniques in Innovation
summary: Risk types of innovation, the probability–impact matrix, expected value, the four response strategies, portfolio thinking and the "fail fast" principle.
minutes: 20
---

## What you will learn

- the **risks** of an innovation project,
- how to rank risks with the **probability–impact matrix**,
- which **response strategies** you can choose from,
- why **portfolio** and **fail fast** thinking help.

## Risk and uncertainty

**Risk**: an uncertain event that, if it occurs, affects the objectives. Innovation is risky by nature – if it were sure to succeed, somebody would have done it already. The goal is not to **eliminate** risk but to **manage it deliberately**.

## Risk types of innovation

| Type                   | Question                                   | Example                                  |
| ---------------------- | ------------------------------------------ | ---------------------------------------- |
| **technical**          | Will the technology work?                  | the AI model does not reach 95% accuracy |
| **market**             | Do customers need it? Will they buy it?    | users are not willing to pay             |
| **financial**          | Will the money be enough? Will it pay off? | development costs twice as much          |
| **organisational**     | Do we have the skills and the commitment?  | the key developer leaves                 |
| **legal / regulatory** | Are we allowed to do this?                 | GDPR, patent infringement                |

## The probability–impact matrix

For each risk we estimate a **probability** (P) and an **impact** (I), e.g. on a 1–5 scale. Their product is the **risk score**:

> **risk score = P · I**

```text
 impact ▲
   5    │  5  10  15  20  25
   4    │  4   8  12  16  20
   3    │  3   6   9  12  15
   2    │  2   4   6   8  10
   1    │  1   2   3   4   5
        └──────────────────────▶ probability
           1   2   3   4   5
```

Typically: **1–4 low** (green), **5–12 medium** (amber), **15–25 high** (red). We deal with the red ones first.

It can also be expressed in money as the **expected monetary value** (EMV): **EMV = probability · monetary impact**. If there is a 20% chance of a 5 million loss, EMV = 0.2 · 5 = **1 million** – that is the reserve worth setting aside for it.

## Response strategies (for threats)

| Strategy     | What do we do?                                   | Example                                                   |
| ------------ | ------------------------------------------------ | --------------------------------------------------------- |
| **avoid**    | change the plan so the risk no longer exists     | choose a proven technology instead of an experimental one |
| **transfer** | shift the impact to someone else                 | insurance, a fixed-price subcontract                      |
| **mitigate** | reduce the probability or the impact             | prototype, early testing, knowledge sharing               |
| **accept**   | consciously take it on (possibly with a reserve) | small risk, not worth defending against                   |

Project risk management is covered in detail in topic 14.

## Portfolio thinking

A single radical project is very risky, but a **project portfolio** spreads the risk. A common split (Nagji and Tuff, 2012): about **70% of resources to core** (incremental), **20% to adjacent** (new market or product), **10% to transformational** (radical) innovation.

## Fail fast and real options

- **Fail fast**: use cheap experiments to find out as early as possible if an idea does not work – little money is lost and much is learnt (Lean Startup, topic 3).
- **Real option**: invest **in stages**; each stage gives the right (but not the obligation) to the next. The gates of Stage-Gate are such options.

## Summary

- Risk types: technical, market, financial, organisational, legal.
- Risk score = probability · impact; EMV = probability · monetary impact.
- Responses to threats: avoid, transfer, mitigate, accept.
- A portfolio (e.g. 70/20/10) and failing fast reduce the overall risk of innovation.

## Lesson exercise

```quiz required
? A risk has probability 4 and impact 3 (on a 1–5 scale). What is its risk score?
= 12
! P · I = 4 · 3.

? A risk has a 25% chance of causing an 8 million loss. What is its expected monetary value (EMV) in millions?
= 2
= 2 million
! 0.25 · 8.

? The team takes out insurance against possible data loss. Which response strategy?
- avoid
+ transfer
- mitigate
- accept
! The financial impact is borne by the insurer.

? The team tests the risky technology with an early prototype. Which response strategy?
- avoid
- transfer
+ mitigate
- accept
! The prototype reduces the probability and impact of failure.

? "Users will not be willing to pay." What type of risk is this?
- technical
+ market
- legal
- organisational
! It concerns customer behaviour.

? In the 70/20/10 portfolio split, what percentage goes to **transformational** (radical) innovation?
= 10
= 10%
! 70% core, 20% adjacent, 10% transformational.
```
