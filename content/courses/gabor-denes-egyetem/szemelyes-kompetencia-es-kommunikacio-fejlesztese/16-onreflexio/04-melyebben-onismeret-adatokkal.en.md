---
title: Deeper – Self-Knowledge with Data
summary: Comparing self-assessment with others' assessment (360-degree feedback and the Johari window with a program), how accurately you estimate your own performance (calibration), why the Dunning–Kruger effect must be handled with care, and processing a failed demo with Gibbs' cycle – with small programs and an interactive chart.
minutes: 40
---

## What you will learn in this lesson

- how to compare your own picture of yourself with others' **in numbers**,
- how to measure how **accurately** you estimate your own performance,
- why the interpretation of the popular **Dunning–Kruger effect** is disputed,
- how to process a failure **step by step**.

## 1. 360-degree feedback and the Johari window

In the basic lesson we saw the Johari window: some of our traits are known both to us and to others (**open area**), and some are seen by others but not by us (**blind spot**). At the end of a team project, ask for **360-degree feedback**: rate yourself on a few competences from 1 to 5, and ask your teammates to do the same (anonymously). The differences reveal a lot:

```python run
# 360-degree feedback: self-assessment vs teammates' average, differences and their interpretation
from statistics import mean

competences = {  # competence: (self-assessment, [teammates' ratings])
    "technical knowledge": (4, [4, 5, 4]),
    "meeting deadlines": (4, [2, 3, 2]),
    "helpfulness": (3, [5, 4, 5]),
    "communicating with the client": (2, [2, 3, 2]),
    "accepting feedback": (4, [3, 2, 3]),
}
for name, (own, others) in competences.items():
    avg = mean(others)
    diff = own - avg
    if diff >= 1:
        meaning = "blind spot: you rate yourself higher than others do"
    elif diff <= -1:
        meaning = "hidden strength: others rate you higher than you do"
    else:
        meaning = "matches (open area)"
    print(f"{name:<30} own {own}, others {avg:.1f}, difference {diff:+.1f} → {meaning}")
```

Three different situations:

- **Blind spot** (deadlines, accepting feedback): you believe you're good at this, the team doesn't. This is the most valuable information, because you wouldn't notice it yourself. Don't argue with it – ask: "Could you tell me a concrete situation where you saw this?"
- **Hidden strength** (helpfulness): others see it as more valuable than you do. This matters for your self-confidence and personal brand (and can be a sign of impostor syndrome).
- **Match** (technical knowledge, communicating with the client): here your picture is accurate – everyone sees the weak point (communication), so it's easy to set a shared development goal.

> Three raters are too few to treat any single difference as certain – the sample is small, and one bad day can distort it. Look for tendencies, not verdicts.

## 2. How well do you know your own performance? Calibration

A useful self-knowledge exercise: **before** every practice set or mock exam, write down what percentage you expect, and afterwards compare it with the real result. This is **calibration**:

```python run
# Calibration: prior estimate vs real result, average bias and average error
from statistics import mean

results = [  # (practice set, estimated %, real %)
    ("Programming – practice 1", 80, 62),
    ("Maths – practice 1", 60, 55),
    ("Programming – practice 2", 85, 70),
    ("Maths – practice 2", 50, 58),
    ("Databases – practice 1", 75, 64),
]
differences = [estimate - real for _, estimate, real in results]
bias = mean(differences)                             # positive: overestimation
avg_error = mean(abs(d) for d in differences)        # how big the typical error is
print(f"average bias: {bias:+.1f} percentage points ({'overestimation' if bias > 0 else 'underestimation'})")
print(f"average error: {avg_error:.1f} percentage points")
for name, e, r in results:
    print(f"   {name:<26} estimate {e}%, real {r}%  ({e - r:+d})")
```

According to the sample, **you regularly overestimate yourself in programming** (by 15–18 points), while in maths you're roughly accurate, and once even underestimated yourself. That's a concrete lesson: in programming the "I understand it when I read it" feeling **misleads** – only code you write yourself measures your knowledge. The goal isn't to become pessimistic, but for your estimate to approach reality – so you can divide your study time well.

## 3. The Dunning–Kruger effect – with care!

The popular version says "the less skilled overestimate themselves, the skilled underestimate themselves". In Dunning and Kruger's 1999 study it did appear that the weakest performers rated themselves far above their results. The chart shows an **illustrative** version:

```plot
title: Self-estimate as a function of the real result (illustrative model)
x: 0, 100
y: 0, 100
param: m = 0.4, 0, 1, 0.05
f: x # perfect self-knowledge
f: 60 + m*(x - 50) # typical self-estimate: "everyone feels a bit above average"
```

If $m < 1$, the line is flatter than the diagonal: the weaker overestimate and the stronger underestimate themselves. But **why** is it flat? Here comes the other viewpoint:

- **Psychological explanation** (Dunning–Kruger): those who understand an area less also lack the knowledge needed to recognise their mistakes.
- **Statistical explanation**: if both the self-estimate and the test result are **noisy** measurements, the extreme groups' values would look like this because of "regression to the mean" even if nobody had any particular bias. Later analyses suggest part of the effect comes from this.
- **Practical lesson**, true from both viewpoints: in a new area **don't trust the feeling of confidence**, and measure your knowledge with external feedback (practice exercises, code review, a mentor).

This section also shows how to handle a popular "psychological fact": look at the original study, look for alternative explanations, and build the practical conclusion on what follows from every explanation.

## 4. Processing a failed demo with Gibbs' cycle

At your team's presentation the app crashed, and the client was visibly disappointed. Gibbs' reflective cycle helps you learn from it in six steps – instead of blaming others or yourself:

| Step               | Question                                              | Example                                                                                                                        |
| ------------------ | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **1. Description** | What happened? (facts)                                | In minute 5 of the demo the booking page gave a 500 error; we tried restarting for 4 minutes, then continued with screenshots. |
| **2. Feelings**    | What did I feel and think?                            | Panic, shame; "they must think we don't know what we're doing".                                                                |
| **3. Evaluation**  | What went well, what badly?                           | Good: we could finish with screenshots. Bad: there was no backup plan, and we demoed on a live database.                       |
| **4. Analysis**    | Why did it turn out like this?                        | The night before we merged a change without testing; the demo environment wasn't separated.                                    |
| **5. Conclusion**  | What did I learn? What could I have done differently? | A "code freeze" 24 hours before the demo; a separate demo environment; a pre-recorded video as backup.                         |
| **6. Action plan** | What will I do next time?                             | Before the next demo we use a checklist, and Bálint is responsible for the backup video.                                       |

Notice **step 2**: naming feelings isn't "softness" but part of the processing – if it's skipped, the shame will still be there at the next demo. And without **step 6** reflection is just remembering: change starts with concrete actions tied to an owner and a date.

## Summary

- In 360-degree feedback, the difference between self-assessment and others' average shows blind spots and hidden strengths; with a small sample, look for tendencies.
- Calibration (prior estimate vs real result) shows in which area you over- or underestimate yourself.
- The Dunning–Kruger effect may partly be a statistical phenomenon; the shared lesson: in a new area rely on external feedback, not the feeling of confidence.
- Gibbs' cycle (description, feelings, evaluation, analysis, conclusion, action plan) turns a failure into concrete actions.

## Lesson exercise

```quiz required
? You rate yourself 4 in a competence; your teammates give 2, 3 and 2.5 points. What is the difference (own − others' average)? (as a decimal)
= 1,5
= 1.5
! The others' average is $(2 + 3 + 2.5) / 3 = 2.5$, the difference $4 - 2.5 = 1.5$.

? Before three practice sets you expected 80, 70 and 60 percent; the results were 70, 60 and 50 percent. What is the average bias in percentage points?
= 10
! You overestimated by 10 points each time; the average is 10.

? Which area of the Johari window is what others see about you but you don't?
- open area
+ blind spot
- hidden area
- unknown area
! 360-degree feedback brings exactly this to the surface.

? In Gibbs' cycle, which step comes after analysis?
- description
- feelings
+ conclusion
- evaluation
! Description → feelings → evaluation → analysis → conclusion → action plan.

? What is the best practical lesson regarding the Dunning–Kruger effect?
- that beginners are always stupid
- that experts are never wrong
+ that in a new area you should rely on external feedback (practice exercises, code review, a mentor), not the feeling of confidence
- that self-assessment is never needed
! This follows from both the psychological and the statistical explanation.
```
