---
title: The Research Process
summary: What scientific research is, research questions and hypotheses, independent and dependent variables, qualitative, quantitative and mixed methods – illustrated with research on a user interface.
minutes: 20
---

## What you will learn

- the steps of the **research process**,
- how to phrase a good **research question** and **hypothesis**,
- what **independent** and **dependent variables** are,
- the difference between **qualitative** and **quantitative** methods.

## Why does a computer engineer need this?

It isn't only scientists who do research. A developer does research too when they:

- uncover needs through user interviews,
- decide which interface is better with an A/B test,
- compare two databases with performance measurements,
- review the literature for their thesis.

## Steps of the research process

```text
1. topic and problem          →  What interests me? What's wrong?
2. literature review          →  What do we already know?
3. research question, hypothesis →  Exactly what am I trying to answer?
4. method design              →  How, from whom, how much data?
5. data collection
6. analysis
7. conclusions and limitations →  What does it mean? Where doesn't it apply?
8. communication              →  thesis, report, talk
```

## Research question

A good research question is **specific**, **answerable** and **relevant**.

| Bad                                 | Better                                                                                                            |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| "What makes a good user interface?" | "Does registration abandonment drop if the form has 3 fields instead of 6?"                                       |
| "Is Python good?"                   | "How does the running time of Python implementations of two sorting algorithms compare on lists of 10⁶ elements?" |

## Hypothesis

A **hypothesis** is a testable, tentative answer to the research question that the data can **confirm or refute**.

> "If the registration form has 3 fields, more of those who start registering will finish than with 6 fields."

A good hypothesis is **falsifiable** (Karl Popper): a result contradicting it is conceivable. "It may be better, it may not" is not a hypothesis.

## Variables

- **Independent variable**: what the researcher changes or compares (the number of form fields).
- **Dependent variable**: what is measured and may depend on the independent variable (the completion rate).
- **Confounding variable**: another factor that may also affect the result (e.g. time of day, device, a campaign). We try to **control** these, e.g. by random assignment to groups.

## Qualitative, quantitative, mixed

| Quantitative                                                 | Qualitative                                           |
| ------------------------------------------------------------ | ----------------------------------------------------- |
| numbers, measurements, statistics                            | texts, observations, interpretation                   |
| "how much?", "how often?", "is there a difference?"          | "why?", "how do they experience it?"                  |
| closed-question surveys, measurement, experiments, A/B tests | interviews, focus groups, observation, open questions |
| large sample, generalisable                                  | small sample, deep understanding                      |

**Mixed methods** combine the two: e.g. you uncover problems with interviews (qualitative), then measure how common they are with a survey (quantitative).

## Correlational and experimental research

- **Correlational**: you observe whether two variables move together (e.g. study time and results). It doesn't prove cause and effect (see topic 5, the post hoc fallacy).
- **Experimental**: you set the independent variable and assign participants to groups **randomly** (e.g. an A/B test). This allows causal conclusions.

## Summary

- Steps: problem, literature, question and hypothesis, method, data collection, analysis, conclusions, communication.
- A good research question: specific, answerable, relevant; a hypothesis is testable and falsifiable.
- Independent variable: what you change; dependent: what you measure; control confounders.
- Quantitative: numbers, "how much"; qualitative: texts, "why"; mixed uses both.

## Exercise

```quiz required
? In an A/B test you change the button colour and measure the click-through rate. What is the **independent variable**?
+ the button colour
- the click-through rate
- the time of day
- the users' age
! What the researcher changes.

? Which is a good hypothesis?
- "The new interface may be better, or may not."
+ "With the 3-field form a larger share complete registration than with the 6-field form."
- "User interfaces are important."
- "Everyone likes dark mode."
! Specific, testable, falsifiable.

? You want to understand **why** users abandon registration. Which method fits best?
- only measuring the completion rate
+ qualitative: interviews, observation
- a performance benchmark on the server
- a random number generator
! "Why?" → qualitative.

? What best allows causal conclusions?
- a correlational study
+ an experiment with random assignment to groups
- an interview with a single user
- a blog post
! Random assignment controls for confounders.
```
