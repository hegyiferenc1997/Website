---
title: Professional Portfolio and GitHub Profile
summary: Why a good project says more than a grade, what makes a good portfolio project, what a tidy GitHub profile looks like, and how to present your projects.
minutes: 20
---

## What you will learn

- why a **portfolio** matters for a computer engineer,
- what makes a good **portfolio project**,
- how to tidy up your **GitHub profile**,
- how to **present** a project.

## Show, don't tell

Anyone can write "I know Python" in a CV. A **working project** shows that you can really **create** something with it – and how you think.

## What makes a good portfolio project?

- It solves a **real problem** (even your own: timetable, expense tracker, workout log).
- It is **finished** and **works** – better one small finished project than five abandoned ones.
- It can be **tried**: there's a live demo, screenshots or a short video.
- The **code is readable**: meaningful names, comments, consistent style.
- It has **tests** and is easy to **start** (README!).
- It shows **progress**: meaningful commit messages, not a single "final" commit.

> For a team project, write down exactly **what your part was**. Integrity is part of your brand.

## A tidy GitHub profile

| Element                    | Tip                                                                                                                     |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| **profile photo and name** | the same as on LinkedIn                                                                                                 |
| **short bio**              | one sentence: who you are, what interests you                                                                           |
| **profile README**         | the README of a repo named `username/username` appears on your profile: short intro, technologies, highlighted projects |
| **pinned repos**           | your 4–6 best projects up front                                                                                         |
| **a README in every repo** | what it does, how to start it, a screenshot                                                                             |
| **licence**                | for open source, specify a licence (e.g. MIT)                                                                           |

Watch out:

- **Never upload secrets** (passwords, API keys, `.env` files) – use `.gitignore`. If one does get uploaded, replace the key immediately, because it remains in the Git history.
- Only make university assignments public if the rules allow it and it doesn't help others copy.

## A good commit message

```text
Bad:   "fix", "asdf", "final2"
Good:  "Add pagination to the product search API"
       "Fix wrong date format in the export (#42)"
```

The commit history is communication too: a recruiter or teammate can see from it how you work.

## Presenting a project

Whether in an interview or a README, the **STAR** structure (see topic 4) works here too:

```text
Situation: In the dorm everyone booked the washing machine on paper.
Task:      I wanted to make a simple online booking system.
Action:    Flask backend, SQLite, a simple web interface; tested with 15 users.
Result:    The floor has used it for 3 months, double bookings have stopped.
```

Prepare for questions: **Why** did you choose this technology? What was the **hardest** part? What would you do **differently**?

## Personal website

A simple personal site (e.g. on GitHub Pages, for free) can bring together your projects, CV and contact details. It isn't mandatory, but for a student interested in web development the site itself is a portfolio piece.

## Summary

- A working project says more than any claim.
- A good portfolio project: real problem, finished, tryable, readable code, README, tests.
- GitHub: profile README, pinned repos, a README in every repo, never any secrets.
- Present the project with the STAR structure and prepare for "why?" questions.

## Exercise

```quiz required
? Which is the better portfolio?
- five abandoned projects without READMEs
+ one smaller, finished, working project with a good README
- an empty GitHub profile
- a single file called "final_final2.py"
! Better few, but finished and presentable.

? You accidentally uploaded an API key to a public repo. What is the most important step?
- delete the file in a new commit and you're done
+ immediately replace (revoke) the key, because it remains in the Git history
- nothing, nobody will notice
- rename the file
! The key is still readable in old commits.

? Which is a good commit message?
- "fix"
- "asdf"
+ "Add pagination to the product search API"
- "final2"
! Short, specific, says what it changes.

? What should you write about a team project in your portfolio?
- that you did it all alone
+ exactly what your part was
- nothing, just the link
- your teammates' mistakes
! Integrity is part of your brand.
```
