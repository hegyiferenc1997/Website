---
title: Questioning Techniques
summary: Open and closed questions, the funnel technique, the trap of leading questions, and the "5 whys" method for finding the root of a problem.
minutes: 15
---

## What you will learn

- the role of **open** and **closed** questions,
- the **funnel technique**,
- why to avoid **leading** questions,
- how to use the **"5 whys"** method.

## Open and closed questions

| Type       | Feature                      | Example                                   | Good for                         |
| ---------- | ---------------------------- | ----------------------------------------- | -------------------------------- |
| **open**   | how, why, what, tell me…     | "How do you use the app at the moment?"   | gathering information, ideas     |
| **closed** | yes/no, or one specific fact | "Are you using Chrome?" "How many users?" | clarifying, confirming, deciding |

Neither is better than the other – the situation decides which one you need.

## The funnel technique

Start the conversation **broadly** and gradually **narrow** it down:

```text
open       "Tell me, what happened when the error appeared?"
   ▼
probing    "Which page were you on? What did you do before?"
   ▼
closed     "So the error message came after pressing Save?"
```

This way you don't miss important details, and at the end you surely understand the essentials. It works for user interviews, bug reports and gathering requirements.

## Questions to avoid

- **Leading (suggestive)**: "You also think React is the best, don't you?" – the question suggests the answer.
- **Multiple questions**: "When did the error come, in which browser and what did you do before?" – the other person will only answer one of them.
- **Accusing "why"**: "Why didn't you test?" – triggers defensiveness. Instead: "What got in the way of testing?"

## The "5 whys" method

A technique from the Toyota Production System: you get to the **root** of a problem by asking "why?" (roughly) five times.

```text
Problem: the live site was down for 20 minutes.
1. Why?  Because the server ran out of memory.
2. Why?  Because the new feature loaded the whole database on every request.
3. Why?  Because pagination was missing from the query.
4. Why?  Because nobody noticed it during code review.
5. Why?  Because there is no test for large data volumes and no review checklist.
→ Fix: load test + checklist, not just fixing the query.
```

> The "5 whys" examines the **process**, it doesn't look for a culprit. If the answer is "because Pete was careless", keep asking: what allowed this mistake to slip through?

## Summary

- Open questions gather information; closed questions clarify.
- Funnel technique: from broad to narrow.
- Avoid leading, multiple and accusing questions.
- The "5 whys" leads to the root of the problem.

## Exercise

```quiz required
? Which one is an **open** question?
- "Does login work?"
- "How many bugs did you find?"
+ "How do you usually use the app while working?"
- "Are you using Firefox?"
! How, why, what, tell me…

? Which order describes the **funnel technique**?
+ open → probing → closed
- closed → open → closed
- closed → probing → open
- only open questions
! From broad to narrow.

? "You also see this solution as better, don't you?" What kind of question is this?
- open
- clarifying
+ leading (suggestive)
- funnel
! The question suggests the answer.

? Roughly how many times do we ask "why" in the method named after it?
= 5
! Five "whys" – down to the root of the problem.
```
