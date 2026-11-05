---
title: Professional and Open-Source Communities
summary: How to ask a good question, how to write issues and pull requests, how to give and receive code review, and what a code of conduct means in a professional community.
minutes: 20
---

## What you will learn

- how to ask a **good question** on a professional forum,
- how to write a good **issue** and **pull request**,
- how to give and receive **code review**,
- what a **code of conduct** is.

## Asking a good question

On a professional forum (e.g. Stack Overflow, Discord, a project's discussion board) volunteers help – respect their time.

1. **Search first**: it may already have been answered.
2. **Descriptive title**: "TypeError: 'NoneType' object is not subscriptable when parsing a JSON response" instead of "Help, it doesn't work!!!".
3. **What you want to achieve**, and **what happens** instead.
4. **A minimal, reproducible example**: the shortest code that triggers the error (not the whole project).
5. The exact **error message** as text (not a screenshot).
6. **What you've already tried**.
7. Environment: language and library versions, operating system.
8. If it's solved, **post the solution** – it helps others too.

## Issues and pull requests

In open-source projects, **issues** (bug reports, proposals) and **pull requests** (PRs, proposed changes) are the main means of communication.

**A good issue**: like a good bug report (see topic 6) – environment, steps, expected and actual result. For a proposal: what problem it would solve.

**A good pull request:**

- is **small** and **single-purpose** – one PR, one change,
- its description says **what** it changes and **why**, and how to **test** it,
- links the related issue (e.g. "Fixes #42"),
- follows the project's **contributing guide** (`CONTRIBUTING.md`) and code style.

> Before working on a big change, open an issue and ask the maintainers whether they'd welcome it. That way you don't spend weeks on a PR they can't accept.

## Code review – giving

- Talk about the **code**, not the person: "this function…", not "you always…".
- **Ask** instead of asserting when unsure: "What if we used a dictionary here?"
- **Give reasons**: why your suggestion is better (readability, performance, security).
- Mark **severity**: what's required and what's just an idea (e.g. "nit:", "optional:").
- **Praise** good solutions too.

## Code review – receiving

- The comment is about the **code**, not about you.
- If you don't understand, **ask**.
- If you disagree, **give reasons** objectively; if the other person is right after all, accept it.
- **Say thank you** – someone took time to make your code better.

## Codes of conduct

Many communities and projects have a **code of conduct** (e.g. the widely used _Contributor Covenant_). It sets out:

- expected behaviour (respect, inclusion, constructive criticism),
- unacceptable behaviour (harassment, insults, discrimination),
- how to report violations and what the consequences are.

Its purpose is for everyone to feel **safe** and happy to contribute – especially beginners.

## Community presence

- **Meetups**, conferences, hackathons – networking and learning (see topic 9).
- **Giving a talk** at a meetup – great presentation practice (topic 4) and brand building (topic 12).
- **Improving documentation** – the easiest first contribution to an open-source project; many projects label beginner tasks "good first issue".

## Summary

- A good question: search first, descriptive title, minimal example, exact error message, what you tried.
- A good PR: small, single-purpose, describes what, why and how to test; an issue before big changes.
- Code review: about the code, asking, with reasons, marking severity; when receiving, say thank you.
- A code of conduct creates a safe, inclusive community.

## Exercise

```quiz required
? Which is the best question title on a professional forum?
- "Help!!!"
- "My code doesn't work"
+ "TypeError: 'NoneType' object is not subscriptable when parsing a JSON response"
- "Python"
! Descriptive, specific.

? What is a **minimal, reproducible example**?
- uploading the whole project
+ the shortest possible code that still triggers the error
- a screenshot of the error
- a verbal description of the error
! So others can try it quickly.

? Which is a good code review comment?
- "This is horrible."
- "You always overcomplicate things."
+ "What if we used a dictionary here? Lookups would be faster for large lists."
- "Rewrite it."
! About the code, asking, with a reason.

? What is a community's **code of conduct** for?
- defining code style
+ setting out expected and unacceptable behaviour so everyone feels safe
- defining the licence
- version numbering
! Code of Conduct.
```
