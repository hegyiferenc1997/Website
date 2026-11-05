---
title: Rhetoric and Influence
summary: Aristotle's three modes of persuasion (ethos, pathos, logos) and Cialdini's principles of influence – how to use them ethically, and how to notice when they are used on you.
minutes: 20
---

## What you will learn

- Aristotle's **three modes of persuasion**,
- Robert Cialdini's **principles of influence**,
- the line between persuasion and **manipulation**.

## Ethos, pathos, logos

According to Aristotle, a speaker can persuade in three ways:

| Mode       | Based on                  | Example when introducing a new tool                                         |
| ---------- | ------------------------- | --------------------------------------------------------------------------- |
| **ethos**  | the speaker's credibility | "I've run this system for three years, I've seen every outage."             |
| **pathos** | the audience's emotions   | "Remember last Christmas's night-time alert? This would have prevented it." |
| **logos**  | logic and data            | "Measurements show deployment time drops by 40%."                           |

Good persuasion usually uses all three: for an engineering audience **logos** is the backbone, but without ethos they won't believe you, and without pathos they won't care.

## Cialdini's principles of influence

Based on psychologist Robert Cialdini's research, these principles act on us automatically:

1. **Reciprocity** – when we receive something, we want to give back. (A free trial, a helpful code review.)
2. **Commitment and consistency** – once we've said yes to something small, we're more likely to agree to something bigger. (First just a 5-minute survey…)
3. **Social proof** – we do what others do. ("Used by 10,000 developers.")
4. **Authority** – we believe experts. ("The security auditor recommended this.")
5. **Liking** – we say yes to people we like and who are similar to us.
6. **Scarcity** – what is rare or running out seems more valuable. ("Only 3 places left at the workshop.")
7. **Unity** (a later addition) – shared identity. ("We computer engineers…")

## Ethical persuasion or manipulation?

The difference lies in **intent** and **transparency**.

| Ethical persuasion                         | Manipulation                          |
| ------------------------------------------ | ------------------------------------- |
| true data, real benefits                   | false or withheld information         |
| also serves the other party's interest     | serves only the influencer's interest |
| the other party decides freely             | pressure, artificial time limits      |
| acceptable even if the method became known | the method only works in secret       |

> It matters for software developers too: **dark patterns** – such as hidden cancellation, a fake "today only" countdown or pre-ticked consent – are abusive uses of Cialdini's principles in user interfaces. The EU even prohibits them in some cases.

## How to protect yourself

- If you are rushed ("today only"), stop: what would change if you decided tomorrow?
- Separate the **person** from the **offer** (liking, authority).
- Ask yourself: if this principle didn't affect me, would I still say yes?

## Summary

- Ethos (credibility), pathos (emotion), logos (logic) – good arguments use all three.
- Cialdini's principles: reciprocity, commitment, social proof, authority, liking, scarcity, unity.
- Persuasion is ethical if it is true, transparent and the other party decides freely.

## Exercise

```quiz required
? "Measurements show loading is 40% faster." Which mode of persuasion?
- ethos
- pathos
+ logos
- none
! Based on data and logic.

? "Already used by 10,000 developers." Which Cialdini principle?
- reciprocity
+ social proof
- scarcity
- authority
! We do what others do.

? A webshop shows a fake countdown: "The offer expires in 5 minutes!" (but it restarts on every visit). Which principle does it abuse?
- liking
- reciprocity
+ scarcity
- unity
! An artificial time limit – a dark pattern.

? What most distinguishes ethical persuasion from manipulation?
- volume
- whether it uses data
+ intent and transparency: true information, and the other party decides freely
- the length of the talk
! Would it be acceptable if the method became known?
```
