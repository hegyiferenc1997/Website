---
title: Practice – Presentations and Delivery
summary: Review questions and a summary worksheet on preparation, slide design and presentation skills, with an outline of your own mini talk.
minutes: 55
kind: practice
---

## Review questions

<details>
<summary>1. Why shouldn't you start preparing with the slides?</summary>

Because slides are only tools. First you need to know who you are talking to, what your goal is and the one sentence the audience should take home. Without these the slides fall apart and bullet lists replace the line of thought.

</details>

<details>
<summary>2. What's wrong with a "Questions?" closing slide?</summary>

It is often followed by silence, and that becomes the final impression. It's better to close with the key message and a call to action, and leave the summary slide up during questions.

</details>

<details>
<summary>3. Why repeat the audience's question before answering?</summary>

So that everyone hears it (especially in a large room or a recording), to check you understood it correctly, and to gain a few seconds to think about the answer.

</details>

<details>
<summary>4. Task: plan a 5-minute talk about your favourite programming tool!</summary>

Write down: audience (e.g. first-year students), goal (they try it), key message (one sentence), opening (question or fact), 3 main ideas, a short story or demo, closing with a call to action. 5 minutes is about 600–700 words and at most 5–6 slides. Say it out loud, with a stopwatch.

</details>

## Summary worksheet

```quiz required
? What is a good test of a key message?
- whether it fits on one slide
+ whether you can say it in about 30 seconds (elevator pitch)
- whether it contains jargon
- whether there is a chart about it
! If you can't say it briefly, it isn't clear yet.

? Which chart is best for comparing categories (e.g. the market share of five browsers)?
- line chart
+ column or bar chart
- 3D pie chart
- scatter plot
! Comparing categories → column/bar.

? What helps most against stage fright at the start of a talk?
- coffee right before
+ thorough preparation and an almost word-for-word memorised opening
- speaking faster so it's over sooner
- avoiding the audience
! After the first minutes you get going.

? According to 10/20/30, at most how many slides should a 20-minute talk have?
= 10
! 10 slides, 20 minutes, 30 points.

? Which is **not** good advice for a live demo?
- a script
- prepared data
+ typing everything live to look more authentic
- an enlarged font size
! Live typing is slow and error-prone.
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **Word budget.** Write the function `word_budget(minutes, pace, reserve)`, which gives how many words you can say in a talk `minutes` long if you leave `reserve` minutes for questions and speak at `pace` words per minute!

```python starter
def word_budget(minutes, pace, reserve):
    return minutes * pace
```

<details>
<summary>Solution</summary>

```python solution
def word_budget(minutes, pace, reserve):
    return (minutes - reserve) * pace       # only the net time counts
```

</details>

```python test
assert word_budget(15, 130, 2) == 1690
assert word_budget(10, 140, 0) == 1400
assert word_budget(20, 120, 5) == 1800
print("All checks passed!")
```

**2.** **Crowded slide?** Write the function `crowded(points)`, which returns `True` if the slide has more than 6 points, **or** the points together have more than 30 words!

```python starter
def crowded(points):
    return len(points) > 6
```

<details>
<summary>Solution</summary>

```python solution
def crowded(points):
    words = sum(len(p.split()) for p in points)    # all the words on the slide
    return len(points) > 6 or words > 30
```

</details>

```python test
assert crowded(["a"] * 7) is True
assert crowded(["Double bookings", "Changes tracked on paper"]) is False
assert crowded(["one two three four five six seven eight nine ten"] * 4) is True
print("All checks passed!")
```

**3.** **Time plan.** Write the function `time_plan(net, shares)`, which turns a `{section: share}` dictionary into a `{section: minutes}` dictionary (rounded to 1 decimal)! If the shares don't add up to 1 (with a tolerance of 0.001), raise a `ValueError`.

```python starter
def time_plan(net, shares):
    return {name: round(net * s, 1) for name, s in shares.items()}
```

<details>
<summary>Solution</summary>

```python solution
def time_plan(net, shares):
    if abs(sum(shares.values()) - 1) > 0.001:       # the shares must cover the whole time
        raise ValueError("the shares don't add up to 1")
    return {name: round(net * s, 1) for name, s in shares.items()}
```

</details>

```python test
assert time_plan(13, {"opening": 0.15, "demo": 0.3, "rest": 0.55}) == {"opening": 1.9, "demo": 3.9, "rest": 7.2}
try:
    time_plan(10, {"a": 0.5, "b": 0.6})
    assert False, "a ValueError was expected"
except ValueError:
    pass
print("All checks passed!")
```

### Quick check questions

```quiz
? What is the 10/20/30 rule (Guy Kawasaki)?
+ at most 10 slides, 20 minutes, a font size of at least 30
- 10 minutes, 20 slides, 30 questions
- 10 points per slide, 20 words per point
- 30 slides in 10 minutes
! A short, easy-to-read talk.

? For a 20-minute talk you plan 2 minutes per slide. How many slides should there be?
= 10
! $20 / 2 = 10$.

? What should you do before a live demo?
- nothing, the demo will work anyway
+ a backup (recorded video or screenshots), preloaded data and a tested environment
- write the last feature during the demo
- leave the demo for the end so there's no time for it
! Whatever can go wrong will – you need a plan B.

? Which is a good opening for a project presentation?
- "Well, let's get started..."
+ a concrete problem or a surprising figure that shows why the project matters
- the team members' CVs
- apologising for being unprepared
! The first minute decides whether the audience pays attention.
```
