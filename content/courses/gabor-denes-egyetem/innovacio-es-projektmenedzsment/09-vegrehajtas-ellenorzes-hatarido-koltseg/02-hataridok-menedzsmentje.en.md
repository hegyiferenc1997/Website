---
title: Managing Deadlines
summary: PERT three-point estimate and standard deviation, time buffers, typical causes of delay (Parkinson's law, student syndrome), schedule compression with crashing and fast-tracking.
minutes: 25
---

## What you will learn

- how to estimate with the **three-point (PERT)** method,
- why projects slip and what a **time buffer** is,
- how to **shorten** a schedule (crashing, fast-tracking).

## PERT three-point estimate

An activity's duration is uncertain. **PERT** (Program Evaluation and Review Technique, US Navy, 1958) asks for three estimates:

- **O** – optimistic (everything goes well),
- **M** – most likely,
- **P** – pessimistic (many things go wrong).

> **expected duration: tₑ = (O + 4M + P) / 6**
>
> **standard deviation: σ = (P − O) / 6**

Example: O = 4 days, M = 6 days, P = 14 days → tₑ = (4 + 24 + 14) / 6 = 42 / 6 = **7 days**; σ = (14 − 4) / 6 ≈ **1.67 days**.

The expected value is **larger** than the most likely one, because more things can usually go wrong in the pessimistic direction than can improve in the optimistic one.

The expected durations of critical-path activities are **added up**, and the project's standard deviation is the square root of the sum of their **variances** (σ²). With about **68%** probability the project finishes within the expected value ± 1σ, and with about **95%** within ± 2σ.

## Why do projects slip?

- **optimistic estimates** – the planner gives the "everything goes well" version,
- **Parkinson's law** – "work expands to fill the time available",
- **student syndrome** – work starts at the last moment,
- **dependencies** – one late supplier stops the whole chain,
- **scope creep** – tasks growing bit by bit without approval,
- **multitasking** – one person works on too many tasks at once.

### Time buffer

A **buffer** is deliberate slack in the schedule. The **critical chain** method (Eliyahu Goldratt, 1997) removes the individual "safety margins" of activities and collects them into a shared **project buffer** at the end – so the slack does not "melt away" because of Parkinson's law.

## Schedule compression

If the project is late, or an earlier deadline is needed, there are two main techniques – both are effective **only on critical-path** activities:

| Technique         | What does it do?                                            | Price                 |
| ----------------- | ----------------------------------------------------------- | --------------------- |
| **crashing**      | more resources (people, overtime, machines) on the activity | **more cost**         |
| **fast-tracking** | sequential activities are done **in parallel**              | **more risk**, rework |

### Crashing: which activity to shorten?

The **crash cost per day**:

> **(crash cost − normal cost) / (normal duration − crash duration)**

Example: an activity normally takes 10 days and costs 100 thousand; crashed, 6 days and 180 thousand → (180 − 100) / (10 − 6) = **20 thousand per day**.

Always shorten the **critical-path** activity with the **lowest crash cost per day** first. Beware: after shortening, **another path may become critical**.

> **Brooks's law** (for software projects): "Adding manpower to a late software project makes it later." New people must be trained and the communication overhead grows – crashing works only to a limited extent in software.

## Summary

- PERT: tₑ = (O + 4M + P) / 6, σ = (P − O) / 6.
- Causes of delay: optimistic estimates, Parkinson, student syndrome, dependencies, scope creep.
- Buffer: deliberate slack; critical chain: a shared project buffer.
- Compression: crashing (more money), fast-tracking (more risk) – only on the critical path.
- Crash cost per day = Δcost / Δtime; Brooks's law.

## Lesson exercise

```quiz required
? PERT: O = 2, M = 5, P = 14 days. What is the expected duration (days)?
= 6
= 6 days
! (2 + 4·5 + 14) / 6 = 36 / 6.

? For the same activity, what is the standard deviation (days)?
= 2
= 2 days
! (14 − 2) / 6.

? Normal: 8 days, 200 thousand. Crashed: 5 days, 290 thousand. What is the crash cost per day, in thousands?
= 30
= 30 thousand
! (290 − 200) / (8 − 5).

? We start testing **in parallel** with development to finish sooner. Which technique is this?
- crashing
+ fast-tracking
- buffer
- baseline
! Overlapping: faster, but riskier.

? Why does shortening a non-critical activity **not** help finish the project earlier?
+ because the project length is set by the critical path; the non-critical activity already has float
- because non-critical activities are free
- because they cannot be shortened
- because the Gantt chart does not allow it
! Only shortening the critical path shortens the project.

? What does **Parkinson's law** say?
- half of all projects always fail
+ work expands to fill the time available
- adding people to a late project makes it later
- 80% of bugs are in 20% of the code
! That is why slack given to activities "melts away".
```
