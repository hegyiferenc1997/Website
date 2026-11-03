---
title: Steps of Project Execution
summary: How does the plan become reality? Baseline, work authorisation, status meetings and RAG reports, the difference between an issue and a risk, handling variances and integrated change control.
minutes: 20
---

## What you will learn

- what the **baseline** is and why it must be "frozen",
- how to **track** work (status meetings, RAG reports),
- the difference between an **issue** and a **risk**,
- how to handle **variances** and **changes**.

## The baseline

At the end of planning the approved **scope, schedule and cost plans** are recorded as the **baseline**. Actual performance is measured against it. The baseline may only be changed through an **approved change request** – otherwise we would not know what we are late against.

## The execution cycle

```text
 baseline → work authorisation → execution → measurement (actual)
     ▲                                          │
     └── corrective action / change request ◄── plan vs. actual
```

1. **Work authorisation** – work packages are formally handed to the owner (who, what, by when, from which budget).
2. **Execution** – the team works, the PM removes obstacles and coordinates.
3. **Measurement** – collect actual progress, time and cost spent.
4. **Comparison** – plan vs. actual (variances: schedule, cost, quality, scope).
5. **Action** – corrective action or a change request.

## Status meeting and status report

- **Status meeting**: regular (e.g. weekly), short, with an agenda: what was finished, what comes next, which obstacles and risks exist.
- **Status report**: for the sponsor and management, on one page. Often with a **RAG** colour code (Red–Amber–Green):

| Colour       | Meaning                                                       |
| ------------ | ------------------------------------------------------------- |
| 🟢 **green** | on track                                                      |
| 🟡 **amber** | minor variance, the team is handling it, keep watching        |
| 🔴 **red**   | significant variance, a management decision or help is needed |

> The "watermelon project": green outside, red inside – the report paints over reality. A good PM raises problems early.

## Issue or risk?

| Risk                                 | Issue                                 |
| ------------------------------------ | ------------------------------------- |
| has **not yet** happened             | has **already** happened              |
| probability < 100%                   | 100%, must be dealt with              |
| kept in the risk register            | kept in the **issue log**             |
| e.g. "the key developer might leave" | e.g. "the key developer has resigned" |

The issue log contains: description, impact, owner, due date, status.

## Handling variances

If actual differs from plan:

- **corrective action** – bring the project back on plan (e.g. overtime, reassigning resources),
- **preventive action** – so it does not happen again,
- **defect repair** – fix a faulty deliverable,
- **change request** – if the plan itself must change.

## Integrated change control

Every change request runs through **one place**, in a single process:

1. **record** the change request (who, what, why),
2. **impact analysis** – scope, time, cost, quality, risk,
3. **decision** – the **Change Control Board** (CCB) or the sponsor approves or rejects,
4. if approved, **update the baseline** and inform the team,
5. track implementation.

Change control is covered in detail in topic 14.

## Summary

- The baseline is the approved plan; it can only change through an approved change.
- Cycle: work authorisation → execution → measurement → comparison → action.
- RAG status: green / amber / red.
- Risk: has not happened yet; issue: has already happened (issue log).
- Integrated change control: record, impact analysis, decision (CCB), update baseline.

## Lesson exercise

```quiz required
? What is the **baseline**?
+ the approved scope, schedule and cost plan against which actuals are measured
- the first draft, which can be changed at any time
- the last status report of the project
- the list of team members
! It can only be changed through an approved change request.

? "The cloud provider has announced a 30% price rise from tomorrow." Risk or issue?
- risk
+ issue
! It has already happened and must be handled → issue log.

? What does a **red** RAG status mean?
- on track
- minor variance, the team is handling it
+ significant variance, a management decision or help is needed
- the project has closed
! Red–Amber–Green.

? Who typically decides on a larger change request?
- any developer
+ the Change Control Board (CCB) or the sponsor
- the client's help desk
- nobody, it is accepted automatically
! Change Control Board.

? What is the **second** step of change control, after recording?
- updating the baseline
+ impact analysis
- informing the team
- implementation
! First we must understand what the change affects.
```
