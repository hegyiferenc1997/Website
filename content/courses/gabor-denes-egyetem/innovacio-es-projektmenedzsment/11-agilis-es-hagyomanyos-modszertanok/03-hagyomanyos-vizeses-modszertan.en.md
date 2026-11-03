---
title: Traditional (Waterfall) Methodologies
summary: The phases and origin of the waterfall model, the V-model and test levels, the pros and cons of the traditional method, and where it is still used successfully.
minutes: 20
---

## What you will learn

- how the **waterfall model** works,
- what the **V-model** is and how it links development to testing,
- the **advantages** and **disadvantages** of the traditional approach.

## The waterfall model

In the **waterfall model** the phases follow **strictly one after another**, like water falling down steps: a phase starts only when the previous one is **closed and approved**.

```text
 Requirements ─┐
               └► Design ─┐
                          └► Implementation ─┐
                                             └► Testing ─┐
                                                         └► Deployment ─┐
                                                                        └► Maintenance
```

The name is linked to **Winston W. Royce**'s 1970 paper – ironically, Royce himself pointed out that a purely linear model is risky and proposed feedback loops.

Characteristics:

- **detailed up-front planning**: scope, schedule and cost are fixed at the start,
- **documentation and approval per phase** (phase gates),
- the client sees the finished product **at the end**,
- change is **expensive** and needs formal change control.

## The V-model

The **V-model** extends waterfall by assigning a **test level** to every development phase. The left arm of the V is specification and design, the right arm is verification.

```text
 Requirements analysis ───────────────────────► Acceptance test
     System design ───────────────────────► System test
         Architecture design ───────────► Integration test
             Module design ─────────► Unit test
                       \           /
                         Coding
```

Its advantage is that tests are planned **already during design**: e.g. acceptance test cases are written during requirements analysis. That is why it is popular in **safety-critical** fields (automotive, rail, medical devices, aviation), where standards (e.g. ISO 26262) require strict documentation.

## Advantages and disadvantages

| Advantages                                        | Disadvantages                                                  |
| ------------------------------------------------- | -------------------------------------------------------------- |
| simple, easy to understand and control            | rigid, change is expensive                                     |
| total cost and deadline are known at the start    | the working product is only visible at the end – late feedback |
| good documentation, easy to hand over and audit   | defects (especially in requirements) are found late            |
| resource needs are easy to plan                   | the client would need to know everything at the start          |
| convenient for contractual (fixed-price) projects | the "90% done" state can last a long time                      |

## When is it still a good choice?

- requirements are **stable and well known** (e.g. a reporting obligation set by law),
- change is **physically expensive or impossible** (construction, hardware manufacturing),
- **strict regulation** and auditing (safety-critical systems),
- a **fixed-price** contract where scope must be fixed in advance.

## Summary

- Waterfall: strictly sequential phases, detailed up-front plan, handover at the end.
- V-model: a test level for every development level (unit, integration, system, acceptance test).
- Pros: predictability, documentation; cons: rigidity, late feedback.
- Still a good choice for stable requirements and regulated projects that are physically expensive to change.

## Lesson exercise

```quiz required
? What is the main characteristic of the waterfall model?
+ phases follow strictly one after another, each starting after the previous one is closed
- it works in short, repeated sprints
- it has no planning
- the client can add new requirements every week
! A linear, sequential model.

? In the V-model, which test level belongs to **requirements analysis**?
- unit test
- integration test
- system test
+ acceptance test
! The two ends of the V: requirements ↔ acceptance.

? In the V-model, which test level belongs to **module design**?
+ unit test
- acceptance test
- system test
- integration test
! The level closest to the bottom of the V.

? Which is a **disadvantage** of the waterfall model?
- too little documentation
+ the working product is only visible at the end, so feedback comes late
- cost cannot be estimated with it
- it only allows 15-minute meetings
! Defects and misunderstandings are found late.

? Which project suits the traditional (waterfall or V-model) approach best?
- a new social mobile app where we do not yet know what users like
+ control software for a car's braking system under a strict safety standard
- a start-up's MVP
- a hackathon project
! Stable requirements, strict regulation and documentation.
```
