---
title: Deeper – Modelling Learning by Simulation
summary: A simple memory model (retention and stability), comparing cramming and spaced repetition on exam day and a month later, a simulation of the Leitner box flashcard system, and learning methods from three viewpoints – with small programs and an interactive chart.
minutes: 40
---

## What you will learn in this lesson

- how forgetting can be described with a quantity called **stability**, and what increases it,
- why **cramming** works in the exam, and why it doesn't afterwards,
- how the **Leitner box**, the ancestor of flashcard apps, works,
- why it's worth treating claims about "effective learning" **critically** too.

## 1. A simple memory model: retention and stability

In the basic lesson we saw the forgetting curve: retained knowledge decreases as $R = e^{-t/S}$, where $t$ is the elapsed time and $S$ is the memory's **stability** (the larger it is, the slower we forget). The key question: **what increases stability?** According to research, every successful recall increases it – and the more so, the **harder** the recall was (the more the memory was already "fading"). This is called **desirable difficulty**.

The chart shows how forgetting slows down with each review, if every review multiplies stability by $g$:

```plot
title: Retained knowledge (%) after reviews (simplified model)
x: 0, 30
y: 0, 100
param: g = 2.5, 1, 5, 0.1
f: 100*exp(-x/2) # without review
f: 100*exp(-x/(2*g)) # after 1 review
f: 100*exp(-x/(2*g^2)) # after 2 reviews
f: 100*exp(-x/(2*g^3)) # after 3 reviews
```

Each review "stretches" the curve – that's why the breaks between reviews can get **longer and longer**. This is the mathematical basis of spaced repetition.

## 2. Cramming or spaced repetition?

Let's simulate a student who has to know some material for an exam in 30 days. In the model, stability grows more at each review the more has been forgotten by then ($1 - R$):

```python run
# Memory model: cramming vs spaced repetition – retention on exam day and a month later
from math import exp

def learn(reviews, initial_s=2.0, boost=4.0):
    # returns the stability and the day of the last review
    s, last = initial_s, 0
    for day in reviews:
        r = exp(-(day - last) / s)                 # how much is remembered at the moment of review
        s = s * (1 + boost * (1 - r)) + 0.5        # harder recall → bigger boost
        last = day
    return s, last

def retention(s, last, day):
    return exp(-(day - last) / s)

plans = {
    "three times on one day (massed)": [0.1, 0.2, 0.3],
    "cramming in the last 3 days": [27, 28, 29],
    "spaced: days 1, 3, 7, 14": [1, 3, 7, 14],
    "spaced + review on day 28": [1, 3, 7, 14, 28],
}
for name, rev in plans.items():
    s, l = learn(rev)
    print(f"{name:<33} exam day (30): {retention(s, l, 30):4.0%}   a month later (60): {retention(s, l, 60):4.0%}")
```

Four lessons from a simple model (the exact numbers depend on the assumptions, but the trend matches the research):

- **Massed** review on a single day is worth almost nothing: the memory is still fresh, so recall is easy and barely strengthens it.
- **Cramming** in the last days **works** on exam day (high retention) – that's why it's so popular. A month later, however, most of the material is gone. In a computer engineering programme this is a big problem, because subjects **build on each other**: what you forgot from maths you'll have to relearn for probability theory.
- **Spaced** review may be somewhat weaker on exam day, but it builds **lasting** knowledge.
- The best is a **combination**: spaced review during the semester, and a short review right before the exam.

## 3. The Leitner box

In the 1970s Sebastian Leitner implemented spaced repetition with paper cards. There are five boxes, each with a review frequency (e.g. every 1, 2, 4, 8, 16 days). If you know a card, it moves **one box up** (you see it less often); if not, it **goes back to the first**. Modern flashcard apps (e.g. Anki) are refined versions of this.

```python run
# Leitner box simulation: 30 cards, 5 boxes, 20 days
import random

random.seed(7)                                       # reproducible result
interval = [1, 2, 4, 8, 16]                          # how often each box is reviewed (days)
known = [0.5, 0.7, 0.85, 0.93, 0.97]                 # chance of knowing a card in that box
cards = [{"box": 0, "next": 1} for _ in range(30)]

for day in range(1, 21):
    today = [c for c in cards if c["next"] == day]
    for c in today:
        if random.random() < known[c["box"]]:
            c["box"] = min(c["box"] + 1, 4)           # knew it: moves up
        else:
            c["box"] = 0                              # didn't know it: back to the start
        c["next"] = day + interval[c["box"]]
    if day in (1, 5, 10, 15, 20):
        distribution = [sum(1 for c in cards if c["box"] == b) for b in range(5)]
        print(f"day {day:>2}: {len(today):>2} cards today; boxes: {distribution}")
```

Notice: in the first days there's a lot to review, but as cards move up to higher boxes the daily load generally **decreases** (sometimes several cards fall due on the same day) – while the hard cards often fall back, so you see them most. That's exactly the goal: you spend your time on **what you don't know yet**, not on what you already know.

## 4. Learning methods – from three viewpoints

| Viewpoint                 | What does it say?                                                                                                                                                                                      |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Cognitive psychology**  | The strongest evidence supports practice testing (active recall) and spaced repetition (Dunlosky et al., 2013); rereading and highlighting are less effective.                                         |
| **The learner's feeling** | Rereading feels **easy** and familiar, so we think we've got it; recall feels **hard**, so it feels less effective. Here the feeling misleads.                                                         |
| **The critical reader**   | Research shows averages, and what works also depends on the subject (you can only learn programming by programming). It's worth trying and measuring: practice exercise results are the best feedback. |

The theory of "learning styles" (visual, auditory, kinaesthetic) is a good example of why you need to be critical: popular, intuitive – but research has found no evidence that learning matched to "your style" gives better results. What works: a form that suits the **content** (a diagram for a graph, code for programming) and active recall.

## Summary

- A simple model: retention $R = e^{-t/S}$; every successful recall increases stability, the more so the harder it was (desirable difficulty).
- Cramming works on exam day, but the knowledge fades quickly; spaced repetition builds lasting knowledge; a combination of the two is best.
- In the Leitner box a known card comes up less often, an unknown one goes back to the start – your time goes to what you don't know yet.
- Most evidence supports active recall and spaced repetition; the feeling of ease misleads, and popular theories (e.g. learning styles) should be treated critically too.

## Lesson exercise

```quiz required
? The Leitner boxes' review intervals are 1, 2, 4, 8 and 16 days. A card has moved to box 3. In how many days will you see it again?
= 4
! Box 3 comes up every 4 days.

? In the model $R = e^{-t/S}$. What is the retention when $t = S$ (i.e. as many days have passed as the stability)? (rounded to two decimals)
= 0,37
= 0.37
! $e^{-1} \approx 0.37$.

? A review schedule doubles the break after each review: 1, 2, 4, 8 days. How many days will the next break be?
= 16
! $8 \cdot 2 = 16$.

? Why is reviewing material three times in a row on a single day a weak method?
- because it takes too much time
+ because the memory is still fresh, recall is easy, so it barely increases stability
- because you can't review three times
- it isn't weak, it's the most effective method
! Desirable difficulty is missing: easy recall strengthens little.

? What does research say about learning matched to "learning styles" (visual, auditory, kinaesthetic)?
- that everyone must learn according to their own style
+ that there's no evidence that matching to a style gives better results; what matters is a form that suits the content and active recall
- that only visual learning works
- that styles are genetically determined
! A popular but unsupported theory.
```
