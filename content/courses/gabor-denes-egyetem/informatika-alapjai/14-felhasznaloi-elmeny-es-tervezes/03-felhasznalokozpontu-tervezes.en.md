---
title: User-Centred Design
summary: The design process (understand, ideate, prototype, test), persona, user journey, wireframe, Figma, usability test, A/B test.
minutes: 18
---

## What you will learn

- the steps of **user-centred design**,
- what a **persona** and a **user journey** are,
- how a **wireframe** and a **prototype** are made, and how to **test** with users.

## The process

The essence of **user-centred design** (UCD): we don't build what _we_ think is good; we observe real users and **iterate**.

```text
  1. understand ──► 2. define ──► 3. ideate ──► 4. prototype ──► 5. test
       ▲                                                          │
       └────────────────────── lessons, again ◄───────────────────┘
```

1. **Understand** – interviews, observation, surveys: who is the user, what is their problem?
2. **Define** – stating the problem precisely, personas.
3. **Ideate** – many possible solutions as sketches, choosing the best.
4. **Prototype** – a model that can be made quickly and tried out.
5. **Test** – real users try it; with the lessons learned, back to the start.

## Persona and user journey

A **persona** is an invented but research-based description of a typical user:

> **Kata, 19, first-year computer engineering student.** Commutes by bus and studies on her phone on the way. Goal: quickly review the week's material. Frustrated by: tiny text and videos stuttering on mobile data.

A **user journey** describes step by step how the persona reaches a goal (e.g. “enrols in a course”) and where the **pain points** are.

## Wireframe and prototype

- **Wireframe**: a simple, grey sketch of the screen's **layout** – where the menu, title and main button go. No colour or decoration, so the discussion is about structure.
- **Mockup**: the final look (colour, font, images), but it doesn't work yet.
- **Prototype**: a clickable model you can walk through a flow with.

```text
 ┌───────────────────────────┐
 │ ☰  Logo          [Log in] │
 ├───────────────────────────┤
 │  Big title                │
 │  Short description ...... │
 │  [ Get started ]          │  ← main action
 ├─────────┬─────────┬───────┤
 │  card   │  card   │ card  │
 └─────────┴─────────┴───────┘
```

Tools: **Figma** (the most widespread, in the browser, with co-editing), Penpot (open source), paper and pencil (the fastest!).

## Testing with users

**Usability test:** give a real task (“Find your timetable for next week”) and watch how the user solves it; ask them to **think aloud**. Don't help or explain – the difficulty is the data. According to Nielsen, just **5 users** find most of the problems.

**A/B test:** in production half the users see version A, the other half version B (e.g. different button text), and you measure which leads to more successful actions.

```python run
# Simple comparison of an A/B test: conversion rate
a_visitors, a_purchases = 2400, 96
b_visitors, b_purchases = 2350, 141
print("A:", round(a_purchases / a_visitors * 100, 1), "%")
print("B:", round(b_purchases / b_visitors * 100, 1), "%")
```

(In practice you must also check statistically that the difference isn't due to chance.)

## Summary

- UCD: understand → define → ideate → prototype → test, iterating.
- Persona = description of a typical user; user journey = steps and pain points.
- Wireframe → mockup → prototype (Figma); usability test with about 5 users; A/B test in production.

## Exercise

```quiz required
? What is a **wireframe**?
+ a simple, colourless sketch of the screen's layout
- the final, colourful visual design
- the source code of the working program
- the network cabling of the server
! It focuses on structure.

? According to Nielsen, roughly how many users are enough for a usability test to reveal most problems?
= 5
! Then fix and test again.

? What is version B's conversion rate in the lesson's example (one decimal, in percent)?
= 6.0
= 6
! 141 / 2350 · 100 = 6.0%.

? What do you do during a usability test when the user gets stuck?
- immediately show them the right button
+ watch and take notes, ask them to say aloud what they are thinking
- end the test
- explain how it should have been done
! Getting stuck is the valuable data.
```
