---
title: Practice – Self-Reflection
summary: Review questions and a summary worksheet on experiential learning, self-awareness tools, the growth mindset and emotional intelligence; your own reflection on an event.
minutes: 55
kind: practice
---

## Review questions

<details>
<summary>1. Use Gibbs' cycle to work through a recent situation that didn't go as you wanted!</summary>

Write in order: (1) what happened, (2) what you felt, (3) what was good and bad, (4) why it turned out this way, (5) what you could have done differently, (6) concretely what you'll do next time. Step 6 should be checkable (e.g. "I'll finish two days earlier"), not general ("I'll pay more attention").

</details>

<details>
<summary>2. Ask two classmates for feedback: what are you good at in teamwork, and what would they change? What did you learn about your blind spot?</summary>

There's no single right answer. Listen without defending yourself, say thank you, and choose one thing to work on in the coming weeks. Asking for feedback shrinks the blind spot in the Johari window.

</details>

<details>
<summary>3. Do your personal SWOT analysis and draw two conclusions from it!</summary>

3–5 points per box. Example conclusions: "Strength + opportunity: I write well and there's a special-college blog → I'll apply to write an article." "Weakness + threat: I procrastinate and will have many parallel deadlines → I'll plan my week with time blocking."

</details>

<details>
<summary>4. Why is impostor syndrome common in computing?</summary>

Because the field is huge and changes fast, there's always something you don't know; beginners compare themselves to experienced developers and to the "best moments" visible online; and bugs in code are very visible. This is normal – experienced developers keep learning too.

</details>

## Summary worksheet

> Anna is a first-year student. Her first programming assignment came back saying the code works but is hard to read. Anna's first thought: "I'm not cut out to be a programmer."

```quiz required
? What mindset does Anna's first thought reflect?
+ a fixed mindset
- a growth mindset
- emotional intelligence
- self-regulation
! She treats the failure as proof of her ability.

? How could she rephrase it with a growth mindset?
- "It'll never work."
+ "I don't write readable code yet, but I can learn – I'll look at what they suggested."
- "The lecturer doesn't know anything."
- "The others are more talented."
! "Not yet" + a concrete step.

? Which step of Kolb's cycle is it when Anna uses descriptive variable names and shorter functions in her next assignment?
- concrete experience
- reflective observation
- abstract conceptualisation
+ active experimentation
! She tries the new approach.

? The feedback revealed something Anna hadn't noticed in her own code. Which pane of the Johari window is this?
- open area
+ blind spot
- hidden area
- unknown area
! Others see it, she doesn't.

? Anna is angry about the feedback, but instead of replying sharply right away, the next day she calmly says thank you and asks questions. Which EQ component does she show?
- empathy
+ self-regulation
- motivation
- social skills
! She manages her emotions.
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **Gap in 360-degree feedback.** Write the function `gap(own, others)`, which returns the difference between your own rating and the average of the others' ratings (own − average, to 2 decimals)!

```python starter
def gap(own, others):
    return round(own - max(others), 2)
```

<details>
<summary>Solution</summary>

```python solution
from statistics import mean

def gap(own, others):
    return round(own - mean(others), 2)   # positive: you rate yourself higher
```

</details>

```python test
assert gap(4, [2, 3, 2.5]) == 1.5
assert gap(3, [5, 4, 5]) == -1.67
assert gap(4, [4, 4]) == 0
print("All checks passed!")
```

**2.** **Johari label.** Write the function `johari(gap)`: if the gap is at least 1, return `"blind spot"`; if it's at most −1, `"hidden strength"`; otherwise `"open area"`!

```python starter
def johari(gap):
    return "blind spot" if gap > 0 else "hidden strength"
```

<details>
<summary>Solution</summary>

```python solution
def johari(gap):
    if gap >= 1:
        return "blind spot"            # others rate you lower
    if gap <= -1:
        return "hidden strength"       # others rate you higher
    return "open area"
```

</details>

```python test
assert johari(1.5) == "blind spot"
assert johari(1) == "blind spot"
assert johari(-1.67) == "hidden strength"
assert johari(0.5) == "open area"
assert johari(-0.9) == "open area"
print("All checks passed!")
```

**3.** **Calibration.** Write the function `calibration(results)`, which from `(estimated %, actual %)` pairs returns the `(bias, mean error)` pair: the bias is the average of the (estimate − actual) differences, the mean error is the average of their absolute values (both to 1 decimal)!

```python starter
def calibration(results):
    d = [e - a for e, a in results]
    return round(sum(d) / len(d), 1), round(sum(d) / len(d), 1)
```

<details>
<summary>Solution</summary>

```python solution
def calibration(results):
    d = [e - a for e, a in results]                    # positive: overestimate
    bias = sum(d) / len(d)
    error = sum(abs(x) for x in d) / len(d)            # the size of a typical miss
    return round(bias, 1), round(error, 1)
```

</details>

```python test
assert calibration([(80, 70), (70, 60), (60, 50)]) == (10.0, 10.0)
assert calibration([(80, 62), (60, 55), (85, 70), (50, 58), (75, 64)]) == (8.2, 11.4)
assert calibration([(50, 60), (70, 60)]) == (0.0, 10.0)
print("All checks passed!")
```

### Quick check questions

```quiz
? Why aren't two misses that cancel out (once +10, once −10) enough to call yourself well calibrated?
+ because the bias is 0, but the mean error is 10 points – the estimates are inaccurate one by one
- because the bias is 10
- because two measurements are always enough
- because only a teacher can measure calibration
! That's why you should look at the mean error as well as the bias.

? You rate yourself 2, your teammates give 4, 3 and 5. What is the gap (own − others' average)?
= -2
! The others' average is 4, the gap is $2 - 4 = -2$: a hidden strength.

? What should you do if 360-degree feedback shows a blind spot?
- argue with the raters
+ ask for a concrete example ("when did you see this?") and set a development goal
- ignore it
- not ask for feedback next time
! A blind spot is the most valuable information, because you wouldn't notice it yourself.

? What is the last step of Gibbs' cycle?
- description
- feelings
- analysis
+ action plan
! Change starts with concrete tasks tied to a person and a date.
```
