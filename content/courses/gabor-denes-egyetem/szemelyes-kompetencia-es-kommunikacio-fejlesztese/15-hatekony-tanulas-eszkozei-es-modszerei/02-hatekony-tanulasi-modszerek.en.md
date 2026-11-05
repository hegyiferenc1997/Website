---
title: Research-Backed Learning Methods
summary: Active recall, spaced repetition, interleaving, worked examples, the Feynman technique and elaborative interrogation – plus popular but less effective methods and myths.
minutes: 20
---

## What you will learn

- which learning methods **work** according to research,
- which popular methods are **less effective**,
- the myth of **learning styles**.

## What does research say?

In 2013 John Dunlosky and colleagues evaluated common learning techniques based on hundreds of studies. The two most effective were **practice testing** and **distributed (spaced) practice**.

## The most effective methods

### Active recall (practice testing)

Don't just read – **quiz yourself**.

- Close your notes and write down what you remember.
- Answer practice questions and old problem sets.
- Use **flashcards** (paper or an app, e.g. Anki): question on the front, answer on the back.

### Spaced repetition

Spread your reviews **over time**, with longer and longer gaps (e.g. after 1, 3, 7, 14, 30 days), not all at once the night before the exam.

```python run
# A simple review schedule: double the gap after every review.
from datetime import date, timedelta

study_day = date(2026, 11, 2)
gap = 1
day = study_day
for review in range(1, 6):
    day = day + timedelta(days=gap)
    print(f"Review {review}: {day.isoformat()} ({gap} days after the previous one)")
    gap *= 2
```

Flashcard apps handle this automatically: what goes well is asked less often, what is hard more often.

### Interleaving

When practising, **mix** problem types (e.g. loops, recursion, sorting together), instead of solving twenty of one type in a row. It feels harder, but this way you learn to **recognise** which method a new problem needs – in the exam, problems don't come sorted by type either.

### Worked examples

For a new topic, first study a **step-by-step** worked solution, understand every step, then solve a similar one on your own.

### The Feynman technique

Physicist Richard Feynman's method:

1. Choose a concept.
2. **Explain it** simply, as if teaching a 12-year-old (in writing or out loud).
3. Where you get stuck or hide behind complicated jargon, your **understanding is incomplete** – look it up.
4. Simplify, use analogies.

Programmers' "**rubber duck debugging**" is similar: if you explain your code line by line, out loud, to a rubber duck, you often find the bug.

### Elaborative interrogation

While learning, ask: **"Why is this true?"**, **"How does it connect to what I already know?"**, **"What if…?"**

## Popular but less effective

| Method                                         | Why is it weak?                                                              |
| ---------------------------------------------- | ---------------------------------------------------------------------------- |
| **rereading**                                  | the feeling of familiarity deceives: "I know this" – but you can't recall it |
| **highlighting**                               | passive; we often highlight almost everything                                |
| **massed practice** (cramming before the exam) | may work short term, but we forget quickly                                   |

## The myth of learning styles

A widespread belief is that everyone is a "visual", "auditory" or "kinaesthetic" learner and should learn in their own style. Research has **not confirmed** that learning is more effective when the method is matched to the supposed style.

What really helps: a format that suits the **content** (an algorithm is best learned with a diagram, pronunciation with sound), and using **several channels** together (text + diagram).

## Summary

- Most effective: active recall and spaced repetition.
- Also: interleaving, worked examples, the Feynman technique, elaborative interrogation.
- Weak: rereading, highlighting, cramming in one go.
- Matching learning styles is a myth; choose a format suited to the content.

## Exercise

```quiz required
? According to Dunlosky and colleagues, which are the two most effective learning techniques?
- rereading and highlighting
+ practice testing and spaced practice
- cramming and summarising
- listening to music and copying notes
! Recall + spread-out reviews.

? What is the essence of **interleaving**?
- many problems of one type in a row
+ mixing different problem types when practising
- alternating study and breaks
- two subjects at once, in one session
! That's how you learn to recognise which method is needed.

? Why is rereading deceptive?
+ because the feeling of familiarity suggests you know it, although you can't recall it
- because it takes too much time
- because it tires the eyes
- it isn't
! Familiar ≠ recallable.

? Has research confirmed that learning is more effective when the method is matched to "learning styles" (visual, auditory, kinaesthetic)?
- yes, clearly
+ no, it's a myth
- only for visual learners
- only for children
! A format suited to the content matters.
```
