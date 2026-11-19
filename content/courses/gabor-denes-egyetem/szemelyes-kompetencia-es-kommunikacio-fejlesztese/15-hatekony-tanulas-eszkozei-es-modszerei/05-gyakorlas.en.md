---
title: Practice – Effective Learning
summary: Review questions and a summary worksheet on memory, effective learning methods and learning in practice; your own study plan for an exam.
minutes: 50
kind: practice
---

## Review questions

<details>
<summary>1. Why is it better to study 1 hour a day for two weeks than 7 hours on each of the two days before the exam?</summary>

Because of spaced repetition: spread-out reviews strengthen the memory each time, and the forgetting curve becomes flatter and flatter. Cramming may work short term, but we forget quickly, and tiredness and lack of sleep impair performance too.

</details>

<details>
<summary>2. Explain recursion with the Feynman technique!</summary>

For example: "Recursion is when a function calls itself, but always with a smaller problem, until it reaches a case simple enough to solve directly. Like a Russian matryoshka doll: you open it, there's a smaller one inside, and so on, until you reach the smallest." Where you get stuck, look it up.

</details>

<details>
<summary>3. Make a study plan for an exam in three weeks!</summary>

Break the material into topics; for each topic: worked examples → problems on your own → flashcards for concepts. Schedule reviews (e.g. after 1, 3, 7, 14 days), mix problem types, solve a mixed practice set every week, and leave time for sleep and breaks. On the last day, don't learn new material – review.

</details>

<details>
<summary>4. How would you use AI on a hard programming problem so that you also learn?</summary>

First try on your own; if stuck, ask for a hint, not code; ask it to explain the concept you don't understand; have it review your own solution, and ask why another solution might be better. Check everything, and follow the course's rules.

</details>

## Summary worksheet

```quiz required
? What is the most effective way to review a chapter?
- read it a third time
- highlight every important sentence
+ close the book, write down the main points from memory, then check
- listen to an audiobook while sleeping
! Active recall.

? In a review schedule, the first review is 1 day, the second 2, the third 4 and the fourth 8 days after the previous one. How many days after studying is the fourth review?
= 15
! 1 + 2 + 4 + 8 = 15 days.

? In the simplified forgetting curve model, what happens if the memory's strength (S) increases?
- we forget faster
+ we forget more slowly, the curve is flatter
- nothing changes
- the curve starts rising
! Repetition increases S.

? Practice consists of 20 loop problems, then 20 recursion problems. How could it be more effective?
+ mix the problem types (interleaving)
- add 20 more loop problems
- only solve the easy ones
- read the solutions instead of solving the problems
! Interleaving.

? Which statement is a **myth**?
- sleep helps consolidate memories
- recall is more effective than rereading
+ learning matched to your learning style (visual, auditory, kinaesthetic) is proven to be more effective
- spaced repetition gives more lasting knowledge
! Research hasn't confirmed the learning styles theory.
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **Forgetting curve.** Write the function `retention(t, s)`, which, using a simple model of the forgetting curve, gives what share of knowledge remains after `t` days if the memory's "stability" is `s` days: $e^{-t/s}$ (to 3 decimals)!

```python starter
def retention(t, s):
    return round(1 - t / s, 3)
```

<details>
<summary>Solution</summary>

```python solution
from math import exp

def retention(t, s):
    return round(exp(-t / s), 3)   # exponential forgetting
```

</details>

```python test
assert retention(0, 5) == 1.0
assert retention(5, 5) == 0.368
assert retention(10, 5) == 0.135
assert retention(1, 2) == 0.607
print("All checks passed!")
```

**2.** **Leitner box.** Write the function `next_box(box, knew_it, max_box=4)`: if you knew the card, it moves up one box (at most up to `max_box`); if not, it goes back to box 1!

```python starter
def next_box(box, knew_it, max_box=4):
    return box + 1 if knew_it else box - 1
```

<details>
<summary>Solution</summary>

```python solution
def next_box(box, knew_it, max_box=4):
    if not knew_it:
        return 1                             # on a mistake, start over
    return min(box + 1, max_box)             # stays in the top box
```

</details>

```python test
assert next_box(1, True) == 2
assert next_box(3, False) == 1
assert next_box(4, True) == 4
assert next_box(2, True, max_box=2) == 2
print("All checks passed!")
```

**3.** **Review schedule.** Write the function `schedule(first, multiplier, count)`, which returns the days of `count` reviews counted from the day of learning, if the first review comes after `first` days and each following gap is `multiplier` times longer than the previous one (rounded to whole numbers)!

```python starter
def schedule(first, multiplier, count):
    return [first * multiplier * i for i in range(1, count + 1)]
```

<details>
<summary>Solution</summary>

```python solution
def schedule(first, multiplier, count):
    days, day, gap = [], 0, first
    for _ in range(count):
        day += gap                           # the gaps add up
        days.append(round(day))
        gap *= multiplier                    # ever longer gaps
    return days
```

</details>

```python test
assert schedule(1, 2, 5) == [1, 3, 7, 15, 31]
assert schedule(2, 1, 3) == [2, 4, 6]
assert schedule(1, 2.5, 3) == [1, 4, 10]
print("All checks passed!")
```

### Quick check questions

```quiz
? What does retrieval practice mean?
- rereading your notes several times
+ recalling the material from memory, e.g. with questions or flashcards
- highlighting the important parts
- copying out the material
! Recall strengthens the memory trace; rereading only gives a feeling of familiarity.

? According to the model, with a stability of $s = 5$ days, roughly what percentage of the knowledge remains after 5 days? (whole number)
= 37
! $e^{-1} \approx 0.368$, i.e. about 37%.

? Why is spaced practice more effective than one long cramming session the night before the exam?
- because it takes less time
+ because each review strengthens the memory at a later point of forgetting, making it more lasting
- because you don't have to pay attention
- it isn't more effective
! The gap between reviews is itself part of learning.

? What is the essence of a growth mindset?
- talent is innate and doesn't change
+ abilities can be developed with effort, good strategies and feedback
- only praise matters
- mistakes should be hidden
! A mistake then becomes information, not a verdict.
```
