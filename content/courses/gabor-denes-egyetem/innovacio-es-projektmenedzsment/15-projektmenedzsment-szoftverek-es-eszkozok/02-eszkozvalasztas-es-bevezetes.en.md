---
title: Choosing and Introducing a Tool
summary: Tool selection criteria and the weighted scoring matrix, integrations, a Jira-like workflow and the anatomy of an issue, issue tracking, and the steps of introducing a tool from pilot to training.
minutes: 30
---

## What you will learn

- the **criteria** for choosing a project management tool,
- how to decide with a **weighted scoring matrix**,
- how a **workflow** and an **issue** are built up,
- how to **introduce** a new tool so that people actually use it.

## Selection criteria

- **methodology**: waterfall, agile or hybrid (topic 11) – do you need a Gantt chart, a sprint board, or both?
- **team size and scalability**: 5 people or 500? Several projects, a portfolio?
- **features**: dependencies, resources, time tracking, reports, automation.
- **usability**: how long does it take to learn? Is there a mobile app?
- **integrations**: Git (GitHub, GitLab), CI/CD, chat (Slack, Teams), calendar, documentation.
- **security and compliance**: permissions, single sign-on (SSO), data location, GDPR.
- **cost**: licence fee, rollout, training, operation – the **total cost of ownership** (TCO).

## Weighted scoring matrix

We give each criterion a **weight** (they sum to 1), score each tool from 1 to 5, multiply the scores by the weights and add them up:

| Criterion    | Weight | Tool "A" | Tool "B" |
| ------------ | ------ | -------- | -------- |
| features     | 0.4    | 4 → 1.6  | 5 → 2.0  |
| usability    | 0.3    | 5 → 1.5  | 3 → 0.9  |
| cost         | 0.2    | 3 → 0.6  | 4 → 0.8  |
| integrations | 0.1    | 4 → 0.4  | 5 → 0.5  |
| **total**    | 1.0    | **4.1**  | **4.2**  |

Tool "B" is slightly better – but the difference is small, so it is worth checking with a **trial period** (pilot) too. We used the same technique to rank projects (topic 4).

## Issues and workflows

In agile tools (Jira, GitHub, Azure DevOps) the unit of work is the **issue** (ticket). Typical types:

- **epic** – a large unit spanning several sprints (e.g. "Payments"),
- **story** – a user story (topic 8: "As a user I want…"),
- **task** – a technical task,
- **bug** – a defect,
- **subtask** – a smaller part of an issue.

Important fields of an issue: **title**, **description**, **acceptance criteria**, **assignee**, **priority**, **estimate** (story points), **sprint**, **labels**, **links** (blocks, depends on).

### Workflow

The workflow defines the issue's **states** and the allowed **transitions** between them:

```text
 ┌───────┐   started   ┌─────────────┐  PR ready  ┌─────────────┐  approved  ┌──────┐
 │ To do │ ──────────▶ │ In progress │ ─────────▶ │ Code review │ ─────────▶ │ Done │
 └───────┘             └─────────────┘            └─────────────┘            └──────┘
                              ▲                          │
                              └────── needs a fix ───────┘
```

> We can build **rules** into the workflow: e.g. an issue can only move to "Done" if the tests are green and there is an approved code review – this automates the **Definition of Done** (topic 14).

### Issue tracking

A good **bug report** contains: the **steps** to reproduce, the **expected** and the **actual** behaviour, the environment (browser, version), a screenshot or log, and the **severity** (critical, high, medium, low). A **Pareto chart** can be made from this defect list (topic 14).

## Integrations and automation

- **Git integration**: if the commit message or branch name contains the issue key (e.g. `WEB-42`), the tool links the code to the issue.
- **automation**: e.g. "when the PR is merged, move the issue to Done", "if a critical bug has no owner for 24 hours, notify the lead".
- **notifications** to chat, **dashboards** for management.

## Introducing the tool

Introducing a new tool is itself a **change** – the ADKAR model (topic 14) applies here too:

1. **needs assessment**: what hurts now? Who will use it?
2. **selection**: weighted matrix, offers, demos.
3. **pilot**: one team, one project, a few weeks – collect experience.
4. **configuration**: workflows, fields, permissions, templates – starting **simple**.
5. **training**: a short course, a guide, key users (champions).
6. **rollout and support**: gradual extension, quick answers to questions.
7. **reinforcement**: reports and meetings now work from the new tool; the old spreadsheets are closed.

> A common mistake is **over-configuration**: after 15 states and 40 mandatory fields nobody updates the issues, and the tool shows the past instead of reality.

## Summary

- Criteria: methodology, size, features, usability, integrations, security, total cost.
- Weighted matrix: Σ weight · score; with a small difference, run a pilot.
- Issue types: epic, story, task, bug, subtask; workflow = states + transitions + rules.
- Introduction: needs → selection → pilot → configuration → training → rollout → reinforcement.

## Lesson exercise

```quiz required
? Weights: features 0.5, usability 0.3, cost 0.2. A tool scores 4, 2, 5. What is its weighted score?
= 3.6
! 0.5 · 4 + 0.3 · 2 + 0.2 · 5 = 2 + 0.6 + 1.

? Which issue type is a large unit of work spanning several sprints?
+ epic
- bug
- subtask
- task
! E.g. a "Payments" epic containing several stories.

? What does a workflow define?
- the team's salaries
+ the issue's states and the allowed transitions between them
- the project budget
- the structure of the repository
! States + transitions (+ rules).

? Which does **not** belong in a good bug report?
- the steps to reproduce
- the expected and the actual behaviour
- the environment (browser, version)
+ a rating of the developer who caused the bug
! A bug report records facts; it does not look for someone to blame.

? What is the role of a pilot when introducing a tool?
- all teams switch over at once
+ one team tries it on one project before we extend it
- keeping the old tool forever
- buying the licences
! We gain experience at low risk.
```
