---
title: Gathering Project Requirements
summary: Functional and non-functional requirements, elicitation techniques, user stories and acceptance criteria, MoSCoW prioritisation and the requirements traceability matrix.
minutes: 25
---

## What you will learn

- which **types** of requirements exist,
- which **techniques** to use to elicit them from stakeholders,
- how to write a good **user story** and **acceptance criteria**,
- how to **prioritise** with the MoSCoW method.

## Why does it matter?

One of the most common causes of failed IT projects is **incomplete or misunderstood requirements**. What is not clarified during planning has to be reworked expensively at the end (the cost of change grows – topic 6).

## Requirement types

| Type                   | Question                                              | Example (course registration system)               |
| ---------------------- | ----------------------------------------------------- | -------------------------------------------------- |
| **business**           | Why are we doing it? What is the organisation's goal? | halve the admin work of the registration period    |
| **stakeholder (user)** | What does the user want to achieve?                   | the student sees which courses still have places   |
| **functional**         | What should the system **do**?                        | the system e-mails a confirmation of registration  |
| **non-functional**     | **How** should the system be?                         | respond within 2 s even with 2000 concurrent users |
| **transition**         | What is needed for the switch-over?                   | migrating old data, training users                 |

**Non-functional** requirements (quality characteristics) according to **ISO/IEC 25010** include: performance, usability, reliability, security, maintainability, portability, compatibility.

## Elicitation techniques

- **Interview** – with one stakeholder at a time, for deeper understanding.
- **Workshop** – with several stakeholders together, for quick agreement.
- **Survey** – to reach many people, for numerical data.
- **Observation** (job shadowing) – how they really work (people do not always say what they do).
- **Document analysis** – laws, policies, description of the old system.
- **Prototype** – "is this what you meant?" – a screen mock-up clears up many misunderstandings.

## User story and acceptance criteria

In agile projects requirements are written as **user stories**:

> **As a** _student_, **I want** _to see the number of free places on courses_, **so that** _I know before applying whether I have a chance of getting in._

A good story follows **INVEST**: **I**ndependent, **N**egotiable, **V**aluable, **E**stimable, **S**mall, **T**estable.

A story has **acceptance criteria**, often in **Given–When–Then** form:

> **Given** that 30 students may register for the course and 28 have registered, **when** a student opens the course list, **then** "2 places left" is shown next to the course.

## Prioritisation – MoSCoW

Not everything fits into the first release. The four categories of **MoSCoW**:

| Category                   | Meaning                                       |
| -------------------------- | --------------------------------------------- |
| **M**ust have              | without it the system is unusable or unlawful |
| **S**hould have            | important, but a workaround exists            |
| **C**ould have             | nice if it fits                               |
| **W**on't have (this time) | consciously left out of this release          |

> Rule of thumb: spend at most about **60%** of the effort on "Must" requirements, so that some contingency remains.

## Requirements traceability matrix

The **Requirements Traceability Matrix** shows for every requirement its source (who asked for it), the design, the work package that implements it and the **test case**. This lets us check that every requirement has been built and tested, and which parts a change affects.

## Summary

- Types: business, stakeholder, functional, non-functional (ISO 25010), transition.
- Elicitation: interview, workshop, survey, observation, document analysis, prototype.
- User story: "As a …, I want …, so that …"; INVEST; acceptance criteria in Given–When–Then form.
- MoSCoW: Must, Should, Could, Won't.
- The traceability matrix links each requirement to design, implementation and test.

## Lesson exercise

```quiz required
? "The system must respond within 2 seconds even with 2000 concurrent users." What kind of requirement is this?
- functional
+ non-functional
- business
- transition
! It describes how (how fast) the system should be, not what it should do.

? "The system e-mails a confirmation of successful registration." What kind of requirement is this?
+ functional
- non-functional
- transition
- business
! It describes what the system should do.

? Which MoSCoW category means requirements that are consciously **left out**?
- Must
- Should
- Could
+ Won't
! Won't have (this time).

? According to INVEST, what does "T" say a user story should be?
- Timely
+ Testable
- Technical
- Total
! Independent, Negotiable, Valuable, Estimable, Small, Testable.

? Which elicitation technique is best if we want **numerical** data from **many people**?
- interview
- observation
+ survey
- prototype
! A survey reaches many people cheaply.
```
