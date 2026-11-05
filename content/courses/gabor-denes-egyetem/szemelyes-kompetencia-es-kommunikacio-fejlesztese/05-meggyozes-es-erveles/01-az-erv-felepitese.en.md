---
title: The Structure of an Argument
summary: Claim, evidence and warrant; the six elements of the Toulmin model; deductive and inductive reasoning, illustrated with a technology decision.
minutes: 20
---

## What you will learn

- what an **argument** consists of,
- the elements of the **Toulmin model**,
- the difference between **deductive** and **inductive** reasoning.

## What is an argument?

An **argument** is a claim supported by **evidence** and **reasoning**. The goal of arguing is for the other party to accept our position for **reasonable grounds** – not because we are louder or more senior.

The simplest form:

```text
Claim:     We should switch to TypeScript.
Evidence:  Last quarter 30% of our bugs came from type errors.
Warrant:   Static type checking catches these at compile time.
```

## The Toulmin model

British philosopher Stephen Toulmin broke everyday arguments down into six elements:

| Element                  | Question                                 | Example                                                        |
| ------------------------ | ---------------------------------------- | -------------------------------------------------------------- |
| **claim**                | What do you claim?                       | Let's switch to TypeScript.                                    |
| **data / evidence**      | What do you base it on?                  | 30% of the bugs were type errors.                              |
| **warrant**              | Why does the claim follow from the data? | Type checking catches these at compile time.                   |
| **backing**              | Why should we accept the warrant?        | Case studies of several large projects showed fewer live bugs. |
| **qualifier**            | How certain is it?                       | "probably", "in most cases"                                    |
| **rebuttal / exception** | When is it not true?                     | Unless the project ends within two months.                     |

> Stating the **qualifier** and the **exception** doesn't weaken the argument, it **strengthens** it: it shows you've thought it through and aren't exaggerating.

## Deductive and inductive reasoning

### Deductive (from general to specific)

If the premises are true, the conclusion is **certainly** true.

```text
All HTTPS connections are encrypted.
This site uses HTTPS.
→ This site's connection is encrypted.
```

### Inductive (from specific cases to general)

The conclusion is only **probable**; a new case can overturn it.

```text
After the last 50 releases the tests always caught the bug.
→ Our tests are probably good.
```

Inductive reasoning is the basis of science and engineering (measurements, experience), but be careful: don't generalise from **few cases**.

## A good argument in practice

- **Concrete** data instead of a vague impression ("30%" vs. "a lot").
- **Relevant** evidence: does it really support the claim?
- Address **counter-arguments** in advance: "I know learning it takes time, so…"
- Tie it to the audience's **values** (management cares about cost and risk, developers about quality and convenience).

## Summary

- An argument: claim + evidence + warrant.
- Toulmin: claim, data, warrant, backing, qualifier, rebuttal.
- Deductive: certain conclusion from true premises; inductive: probable generalisation.
- Stating the qualifier and exception increases credibility.

## Exercise

```quiz required
? Which element of the Toulmin model answers **why** the claim follows from the data?
- claim
- qualifier
+ warrant
- rebuttal
! The warrant connects the data and the claim.

? "Probably", "in most cases" – which Toulmin element is this?
- data
+ qualifier
- backing
- claim
! It shows how certain the claim is.

? "In all 20 user interviews so far everyone complained about registration, so the majority probably find it difficult." What kind of reasoning is this?
- deductive
+ inductive
- circular
- emotional
! It generalises from specific cases; the conclusion is only probable.

? Why is it worth stating the **exceptions** to your argument?
- because it makes the talk longer
+ because it shows you've thought it through and aren't exaggerating – which increases credibility
- because then nobody asks questions
- because it is mandatory
! A self-critical argument is stronger.
```
