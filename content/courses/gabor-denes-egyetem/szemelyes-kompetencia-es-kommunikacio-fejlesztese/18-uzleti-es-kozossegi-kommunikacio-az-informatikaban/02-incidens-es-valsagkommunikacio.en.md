---
title: Incident and Crisis Communication
summary: What to do when the service goes down: internal coordination, status updates for users, a good incident message, and the blameless post-mortem.
minutes: 20
---

## What you will learn

- how a team communicates **internally** during an incident,
- how to inform **users**,
- what a good **incident message** looks like,
- what a **blameless post-mortem** is.

## What is an incident?

An **incident** is an unplanned event that degrades or interrupts a service – the website goes down, payments fail, a data leak is suspected. At such times communication is just as important as the technical fix.

## Internal communication

- Have an **incident commander** who coordinates – not necessarily the person fixing it.
- One **shared channel** for the incident (e.g. a dedicated chat channel), so information doesn't scatter.
- Regular, short **status updates**: what we know, what we're doing, what's next.
- **Record** the timeline (what happened when) – it's needed for the post-mortem.

## Communicating with users

People tolerate uncertainty worse than bad news. Therefore:

- Signal **early** that you know about the problem – even if you don't know the cause yet.
- Update **regularly** (e.g. every 30 minutes), even if there's no news ("we're still working on it").
- Use a **status page** where users can check the situation themselves.
- Be **honest** and **specific**; don't downplay, and don't speculate.
- At the end, announce the **resolution**, and **apologise** if appropriate.

## A good incident message

```text
[Investigating] 10:42
We're aware that some users can't log in to the mobile app.
The web interface works. We're investigating the cause; next update at 11:15.

[Identified] 11:10
We've identified the cause: an update this morning broke the login service.
We're rolling back to the previous version.

[Resolved] 11:35
Login has been working again since 11:28. We apologise for the inconvenience.
We'll publish a post-mortem within a few days.
```

Its elements: **what** the impact is (who is affected), **what** we know, **what** we're doing, **when** the next update comes.

## The blameless post-mortem

After the incident the team analyses in writing what happened – **not looking for a culprit**, but for how the **system and the process** allowed the error (see the "5 whys", topic 3, and psychological safety, topic 11).

Why blameless? If people fear punishment, they hide mistakes, and the organisation doesn't learn from them.

A typical structure:

1. **Summary** – what happened, for how long, who was affected.
2. **Timeline** – when what was noticed and done.
3. **Root cause and contributing factors**.
4. **What went well** (e.g. fast detection) and **what didn't**.
5. **Action items** – with owners and deadlines (e.g. an automated login test, gradual rollouts).

## Summary

- During an incident: one coordinator, one shared channel, regular status updates and a timeline.
- Towards users: early, regularly, honestly, specifically; a status page.
- A good incident message: impact, what we know, what we're doing, when the next update comes.
- Post-mortem: blameless, examines the system and the process, ends with action items.

## Exercise

```quiz required
? When should users first be informed about an outage?
- only once the fix is ready
+ as early as possible, even if the cause isn't known yet
- never, maybe they won't notice
- a week later, in a newsletter
! Uncertainty is worse than bad news.

? What is **not** part of a good incident message?
- who is affected by the problem
- what we're doing
- when the next update comes
+ the name of the developer who caused the bug
! Facts, not a scapegoat.

? What is the main goal of a blameless post-mortem?
- finding and punishing the culprit
+ understanding how the system and the process allowed the error, and preventing it from recurring
- hiding the error from management
- writing as long a document as possible
! If people are afraid, they hide mistakes.

? The outage began at 10:42 and ended at 11:28. How many minutes did it last?
= 46
! 11:28 − 10:42 = 46 minutes.
```
