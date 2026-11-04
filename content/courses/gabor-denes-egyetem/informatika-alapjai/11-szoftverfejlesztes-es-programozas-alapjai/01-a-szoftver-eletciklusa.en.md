---
title: The Software Life Cycle
summary: Phases of the SDLC, functional and non-functional requirements, roles in development.
minutes: 15
---

## What you will learn

- the phases of the software **life cycle** (SDLC),
- what **functional** and **non-functional** requirements are,
- what **roles** a development team has.

## Phases of the life cycle

The **Software Development Life Cycle** (SDLC) is software's journey from idea to retirement:

```text
 1. requirements ─► 2. design ─► 3. implementation ─► 4. testing
        ▲                                                │
        │                                                ▼
 6. maintenance ◄─────────────── 5. deployment ◄─────────┘
```

| Phase              | Question                   | Result                                   |
| ------------------ | -------------------------- | ---------------------------------------- |
| **requirements**   | _what_ must the system do? | requirement list, user stories           |
| **design**         | _how_ do we build it?      | architecture, data model, screen designs |
| **implementation** | writing the code           | a working program                        |
| **testing**        | does it work correctly?    | bug list, test report                    |
| **deployment**     | delivering to users        | a system running in production           |
| **maintenance**    | bug fixes, new needs       | new versions                             |

Software spends most of its life in **maintenance**: a successful system is developed further for years or decades.

## Requirements

- **Functional** – _what_ the system does: “A student can register for a course.” “An admin can export a report.”
- **Non-functional** – _with what quality_: “The page loads within 2 seconds.” “It serves 10,000 users at once.” “It stores passwords hashed.” “It is usable on mobile.”

Requirements are often written as **user stories**:

> _As a student_ I want to see my weekly timetable, _so that_ I don't have to remember the rooms.

A misunderstood requirement is the most expensive error: the later it is found, the more it costs to fix.

## Roles

| Role                                 | Its job                                        |
| ------------------------------------ | ---------------------------------------------- |
| **product owner** / business analyst | represents the client, formulates the needs    |
| **software architect**               | the system's structure, technologies           |
| **developer**                        | writing the code (front end, back end, mobile) |
| **tester** (QA)                      | finding bugs, writing tests                    |
| **UX/UI designer**                   | user experience and the interface              |
| **DevOps / operations**              | build, deployment, servers, monitoring         |

## Summary

- SDLC: requirements → design → implementation → testing → deployment → maintenance.
- Functional = what it does; non-functional = with what quality (speed, security…).
- A team has a product owner, architect, developers, testers, a UX designer and a DevOps engineer.

## Exercise

```quiz required
? In which phase is it decided *what* the system must do?
+ requirements
- implementation
- testing
- maintenance
! It is the first phase.

? What kind of requirement is “The page loads within 2 seconds”?
- functional
+ non-functional
! A quality requirement (performance).

? What kind of requirement is “A student can register for a course”?
+ functional
- non-functional
! It describes what the system does.

? In which phase does software spend most of its life?
- design
- implementation
- testing
+ maintenance
! Successful systems are developed further for years.
```
