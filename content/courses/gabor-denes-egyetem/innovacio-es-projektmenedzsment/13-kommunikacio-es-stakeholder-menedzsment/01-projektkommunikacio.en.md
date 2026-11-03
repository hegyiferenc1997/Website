---
title: Project Communication
summary: The communication model and its noise, the number of communication channels, push, pull and interactive communication, the communication plan, and rules for effective meetings and escalation.
minutes: 20
---

## What you will learn

- why **communication** is the project manager's most important task,
- how the **communication model** works and what can disturb it,
- how to calculate the number of **communication channels**,
- what a **communication plan** contains.

## Why does it matter so much?

By common estimates about **90%** of a project manager's time is **communication**: coordination, reporting, negotiation, meetings, e-mail. According to PMI surveys, **poor communication** is one of the main causes in a large share of failed projects.

## The communication model

```text
 Sender ──► encode ──► [ message / channel ] ──► decode ──► Receiver
   ▲                          ▲ noise                         │
   └─────────────────── feedback ◄────────────────────────────┘
```

- The **sender** **encodes** their thoughts into words or diagrams.
- The message travels through a **channel** (in person, e-mail, video call …).
- **Noise** can distort it: jargon, language and cultural differences, poor audio, information overload, emotions.
- The **receiver** decodes it – based on their own knowledge and viewpoint.
- **Feedback** ("Do I understand correctly that …?") checks whether understanding matches intent.

> The **sender** is responsible for the message: we have not communicated successfully until the receiver has understood.

## The number of communication channels

Every pair of people is a **two-person link** – and the number of links **grows faster** than headcount:

> **number of channels = n · (n − 1) / 2**

| Headcount (n) | Channels |
| ------------- | -------- |
| 3             | 3        |
| 5             | 10       |
| 10            | 45       |
| 20            | 190      |

That is why a large team is harder to coordinate (and why adding people to a late project delays it – Brooks's law, topic 9).

## Modes of communication

| Mode            | Essence                                        | Example                               |
| --------------- | ---------------------------------------------- | ------------------------------------- |
| **interactive** | two-way, real time                             | meeting, phone, video call            |
| **push**        | the sender delivers it, but it may not be read | e-mail, status report, newsletter     |
| **pull**        | the receiver looks it up when they need it     | wiki, project portal, shared document |

Rule of thumb: **complex, sensitive or urgent** matters → interactive; **regular updates** → push; **reference material for many people** → pull.

## The communication plan

The **communication plan** records who gets what, when, how and from whom:

| To whom            | What                     | When / how often    | How                     | Sent by       |
| ------------------ | ------------------------ | ------------------- | ----------------------- | ------------- |
| sponsor            | status report (RAG)      | every two weeks     | e-mail + 30-min meeting | PM            |
| steering committee | milestone review         | at every phase gate | in-person meeting       | PM            |
| development team   | daily check-in           | daily, 15 min       | stand-up                | Scrum Master  |
| users              | news, training           | every release       | newsletter, wiki        | Product Owner |
| everyone           | documentation, decisions | continuously        | project wiki            | team          |

## Effective meetings

- have a **purpose** and an **agenda**, sent out in advance,
- invite only those who are **needed**,
- start and finish **on time**; have a **facilitator** and a **note-taker**,
- at the end: **decisions** and **action items** (who, what, by when) – sent out in writing (minutes).

## Escalation

**Escalation**: if a problem cannot be solved at project level, it is taken to the next decision level (PM → sponsor → steering committee). Good practice is to define the **escalation path** and thresholds in advance (e.g. "if the delay exceeds 2 weeks").

## Summary

- Most of the PM's time is communication.
- Model: sender → encode → channel (noise) → decode → receiver → feedback.
- Number of channels: n · (n − 1) / 2.
- Interactive, push and pull communication.
- Communication plan: to whom, what, when, how, sent by whom; effective meetings; escalation path.

## Lesson exercise

```quiz required
? How many communication channels are there in a **6-person** team?
= 15
! 6 · 5 / 2.

? A team grows from 5 to 8 people. How many **new** channels are created?
= 18
! 8 · 7 / 2 = 28; 5 · 4 / 2 = 10; 28 − 10.

? Which is **pull** communication?
- an e-mail to the sponsor
- a phone call
+ the project wiki, where documentation is available to anyone
- the weekly status meeting
! The receiver looks the information up themselves.

? A sensitive, complex conflict needs to be discussed with the client. Which mode is best?
+ interactive (in-person meeting or video call)
- push (e-mail)
- pull (wiki)
- newsletter
! A two-way, real-time channel is needed.

? In the communication model, what checks whether the receiver understood the message correctly?
- encoding
- noise
+ feedback
- the channel
! "Do I understand correctly that …?"
```
