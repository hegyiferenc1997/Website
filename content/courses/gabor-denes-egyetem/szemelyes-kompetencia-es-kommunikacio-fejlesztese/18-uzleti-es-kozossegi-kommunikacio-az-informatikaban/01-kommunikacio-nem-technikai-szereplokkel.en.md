---
title: Communicating with Non-Technical Stakeholders
summary: Who the stakeholders are, how to gather requirements, what user stories and acceptance criteria are, how to explain to laypeople, and how to communicate estimates and risks.
minutes: 20
---

## What you will learn

- who the **stakeholders** of a software project are,
- how to gather **requirements**,
- what a **user story** and **acceptance criteria** are,
- how to explain a technical issue to a **layperson**,
- how to communicate **estimates** and **risks**.

## Stakeholders

A **stakeholder** is anyone affected by the project or able to influence it: client, users, management, customer support, legal, operations, marketing.

Each cares about different things:

| Stakeholder      | What do they care about?                            |
| ---------------- | --------------------------------------------------- |
| management       | cost, deadline, business results, risk              |
| user             | ease of use, speed, whether it solves their problem |
| customer support | fewer complaints, understandable error messages     |
| legal            | data protection, contracts, compliance              |
| operations       | stability, observability, simple deployment         |

A good engineer communicates in the stakeholder's **language** and **terms**.

## Gathering requirements

Clients often state a **solution** ("we need a button that exports to Excel"), while behind it there's a **problem** ("the monthly report is copied by hand, which takes days"). Ask behind the "why" (see the Harvard method, topic 7, and the "5 whys", topic 3).

Useful questions:

- What problem does this solve? Who will use it and how often?
- What happens now, without the software?
- How will we know it worked?
- What is **not** part of the task?

## User stories and acceptance criteria

Agile teams often write requirements as **user stories**:

```text
As a  [role],
I want  [feature],
so that  [goal / value].

As a  finance officer,
I want to export the monthly orders to a spreadsheet with one click,
so that  I don't have to copy them into the report by hand.
```

They come with **acceptance criteria** to make clear what counts as done:

```text
- The export contains all orders of a given month.
- Columns: date, order number, amount, status.
- It completes within 10 seconds even for 10,000 orders.
```

## Explaining to a layperson

- Start with the **impact** and the **decision**, not the technical details (pyramid principle, topic 6).
- Use an **analogy**: "A database index is like a book's index: you don't have to leaf through every page."
- Avoid **jargon**, or explain it.
- Check understanding: "How clear was that? What else would you like to ask?"

## Estimates and risks

Software estimates are **uncertain**, and that has to be said.

- Give a **range** instead of a single number: "3–5 weeks, most likely 4."
- Say **what it depends on**: "if the payment provider's API works as documented".
- If a delay is likely, **say so early**, not on the last day – bad news doesn't improve by telling it later.
- Offer **options**: "The deadline can be met if we postpone the export to the next release."

> To "How long will it take?", "I don't know" isn't a good answer, and neither is "Ready tomorrow" if it isn't true. A good answer: "Give me a day to look into it, then I'll give you a range along with the risks."

## Summary

- Stakeholders have different concerns – communicate in their language.
- Look for the problem behind the requested solution.
- User story: "As a …, I want …, so that …" + acceptance criteria.
- For laypeople: impact first, analogy, no jargon, check understanding.
- Estimates: a range, conditions, early warning, options.

## Exercise

```quiz required
? The client says: "We need an Excel export button." What is a good first step?
- start developing it immediately
+ ask what problem it solves, and who will use it and how often
- explain that Excel is outdated
- say it's impossible
! Look for the problem behind the requested solution.

? What is the correct structure of a user story?
+ "As a [role], I want [feature], so that [goal]."
- "The system must be able to [feature]."
- "I'm a developer and I write [feature]."
- "If [condition], then [error]."
! Role, feature, goal.

? What is the best answer to a manager asking how long a new feature will take?
- "I don't know."
- "Ready tomorrow." (although it isn't true)
+ "3–5 weeks, most likely 4; it depends on whether the external API works as documented."
- "As long as it takes."
! A range + conditions.

? Which analogy explains a database index well to a layperson?
- "A B-tree-based data structure to speed up queries."
+ "It's like a book's index: you don't have to leaf through every page."
- "An SQL statement."
- "It can't be explained."
! An everyday analogy, without jargon.
```
