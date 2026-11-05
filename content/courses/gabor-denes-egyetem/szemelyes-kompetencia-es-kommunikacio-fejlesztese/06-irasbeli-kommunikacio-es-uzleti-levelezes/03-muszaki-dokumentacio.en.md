---
title: Technical Documentation and Plain Writing
summary: The pyramid principle, rules of plain language, a good README, a good bug report and the structure of a short specification.
minutes: 20
---

## What you will learn

- the **pyramid principle**,
- the rules of **plain language**,
- what goes into a **README**,
- how to write a good **bug report**,
- the structure of a short **specification**.

## The pyramid principle

Barbara Minto's (McKinsey) method: start with the **conclusion**, follow with the supporting arguments, and finally the details.

```text
          ┌──────────────────────┐
          │ Main message/decision│
          └──────────┬───────────┘
        ┌────────────┼────────────┐
    argument 1   argument 2   argument 3
     details      details      details
```

Instead of the school essay (introduction → body → conclusion at the end), in business and technical writing the **conclusion comes first** – because the reader may only get as far as the first paragraph.

## Plain language

- **Short sentences**: one sentence, one idea.
- **Familiar words**; explain jargon the first time you use it.
- **Active voice**: "The script deletes temporary files", not "Temporary files are deleted".
- **Consistent terms**: if it is "user" once, don't call the same thing "customer" in the next paragraph.
- **Formatting**: headings, lists, tables, code blocks – readers skim before they read.

## A good README

A **README** is a project's business card and user guide. A good structure:

````text
# Project name

One sentence: what it does and for whom.

## Installation
```bash
git clone https://github.com/example/project.git
cd project
pnpm install
```

## Usage
A short example of the most common case.

## Development
Running tests, code style, how to contribute.

## Licence
MIT
````

Test: can a new team member start the project from the README **without help**?

## A good bug report

A bad bug report: "Saving doesn't work." A good one:

```text
Title: Save button returns a 500 error if the description is longer than 1000 characters

Environment: Chrome 131, Windows 11, production, v2.4.1

Steps:
1. Log in with a test user
2. New post → 1200 characters in the description
3. Click Save

Expected result: the post is saved
Actual result: "An error occurred" message, a 500 response in the console

Frequency: always reproducible
Attachments: screenshot, console log
```

The most important parts are the **reproducible steps** and the **expected vs. actual** result.

## A short specification

A description of a new feature (many teams call it an RFC or design doc):

1. **Problem** – what's wrong, for whom.
2. **Goals and non-goals** – what it solves and what it does **not** (just as important).
3. **Proposed solution** – overview, diagram.
4. **Alternatives** – what else we considered, and why not.
5. **Risks, open questions**.
6. **Metric** – how we'll know it worked.

## Summary

- Pyramid principle: the conclusion first.
- Short sentences, active voice, consistent terms, good formatting.
- README: what it does, installation, usage, development, licence.
- Bug report: environment, steps, expected and actual result.
- Specification: problem, goals and non-goals, solution, alternatives, risks, metric.

## Exercise

```quiz required
? What does the **pyramid principle** say?
- start with the details, the conclusion comes at the end
+ start with the conclusion, then the arguments, finally the details
- every paragraph should be the same length
- the document should be triangle-shaped
! The reader might only read the beginning.

? Which sentence follows the rules of plain language?
- "Temporary files are deleted by the script."
+ "The script deletes temporary files."
- "The removal of temporary files by the script takes place."
- "Deletion: temporary, files, script."
! Active, short, unambiguous.

? What is most important in a bug report?
- naming the exact cause of the bug
+ reproducible steps and the expected and actual result
- as many exclamation marks as possible
- the name of the developer who broke it
! These let the developer reproduce and fix it.

? Why is listing **non-goals** in a specification important?
- because it makes it longer
+ because it clarifies what the feature does not solve, which prevents scope creep
- because it is a mandatory formal element
- because then nobody asks questions
! Clear boundaries, fewer misunderstandings.
```
