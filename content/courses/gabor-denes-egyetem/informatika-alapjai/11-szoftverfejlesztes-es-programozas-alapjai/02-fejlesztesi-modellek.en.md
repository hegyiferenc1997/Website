---
title: Development Models
summary: Waterfall, iterative and agile development, the Agile Manifesto, Scrum in brief, DevOps and CI/CD.
minutes: 16
---

## What you will learn

- how the **waterfall model** works and when it fits,
- what **iterative** and **agile** development are,
- what **DevOps** and **CI/CD** mean.

## Waterfall model

**Waterfall** carries out the phases **strictly one after another**: first all requirements, then all design, then all the code, finally all the testing.

- **Pro**: transparent, well documented, the cost is easy to plan.
- **Con**: the client only sees the product at the end; if the needs change in the meantime, going back is expensive.
- **When does it fit?** When requirements are stable and well known (e.g. parts of regulated, safety-critical systems).

## Iterative and agile development

**Iterative** development proceeds in small steps: at the end of every **iteration** (a few weeks) there is a working version to try, and work continues based on feedback.

The **agile** mindset was formulated by the 2001 **Agile Manifesto**. Its four values:

1. **individuals and interactions** over processes and tools,
2. **working software** over comprehensive documentation,
3. **customer collaboration** over contract negotiation,
4. **responding to change** over following a plan.

(The things on the right are valuable too; the ones on the left are valued more.)

**Scrum** in brief – the most widespread agile framework (in detail in the project management topic):

```text
 product backlog ─► sprint planning ─► SPRINT (1–4 weeks, daily 15-minute meeting)
                                          │
                    retrospective ◄── sprint review (demo) ◄─┘
                        └─► next sprint
```

## DevOps and CI/CD

**DevOps** joins development (Dev) and operations (Ops): shared responsibility, lots of **automation**, frequent small releases.

- **CI** (Continuous Integration): on every code change the build and tests run automatically (e.g. GitHub Actions).
- **CD** (Continuous Delivery/Deployment): the tested version is automatically releasable or is even pushed to production.

```text
 commit ─► build ─► automated tests ─► staging ─► production
          └────────────── CI ─────────┘ └──────── CD ────────┘
```

This way a large company can ship even hundreds of small updates a day, with little risk.

## Summary

- Waterfall: strictly sequential phases; fits stable requirements.
- Agile: short iterations, working software, continuous feedback (Scrum).
- DevOps: development + operations; CI/CD: automatic build, test and release.

## Exercise

```quiz required
? In which model does the client only see the product at the **very end**?
+ waterfall
- agile
- Scrum
- iterative
! The phases follow strictly one after another.

? In which year was the Agile Manifesto published?
= 2001
! Written by 17 software developers in Utah.

? What does the abbreviation CI stand for?
= Continuous Integration
! Automatic build and test on every change.

? According to the Agile Manifesto, what is valued over comprehensive documentation?
- the contract
+ working software
- following the plan
- the tools
! Working software > comprehensive documentation.
```
