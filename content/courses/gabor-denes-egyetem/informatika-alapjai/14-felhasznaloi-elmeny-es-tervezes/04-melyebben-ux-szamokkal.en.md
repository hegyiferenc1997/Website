---
title: Deeper – User Experience in Numbers
summary: Computing the WCAG contrast ratio with a program, Fitts's and Hick's laws in designing buttons and menus, how many users to test with, and scoring the SUS questionnaire – with small programs and an interactive chart.
minutes: 45
---

## What you will learn in this lesson

- how to **compute** whether the contrast between a text and its background is enough,
- why important buttons should be **big and close** (Fitts's law), and why there shouldn't be too many menu items (Hick's law),
- **how many users** to test an interface with,
- how to score the **SUS** questionnaire.

## 1. Contrast in numbers

In the basic lesson we saw that WCAG requires a contrast ratio of at least **4.5:1** for normal text (3:1 for large text). But where does this number come from? From the two colours' **relative luminance** ($L$): $(L_1 + 0.05) / (L_2 + 0.05)$, where $L_1$ is the lighter one.

```python run
# WCAG contrast ratio between two colours
def luminance(hex_colour):
    r, g, b = (int(hex_colour[i:i + 2], 16) / 255 for i in (1, 3, 5))
    def lin(c):                                   # undoing the screen's gamma correction
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)   # the eye is most sensitive to green

def contrast(a, b):
    l1, l2 = sorted([luminance(a), luminance(b)], reverse=True)
    return (l1 + 0.05) / (l2 + 0.05)

pairs = [("#000000", "#ffffff"), ("#767676", "#ffffff"), ("#999999", "#ffffff"), ("#ffffff", "#ffcc00"), ("#0b5394", "#ffffff")]
for text, background in pairs:
    c = contrast(text, background)
    print(f"{text} on {background}: {c:5.2f}:1 → {'passes (AA)' if c >= 4.5 else 'large text only' if c >= 3 else 'FAILS'}")
```

It may be surprising that light grey (`#999999`) on white **fails** – yet many websites use it for "elegant" secondary text. And white text on a yellow background is almost unreadable. **Viewpoints**: to the designer a faint colour looks "clean", but to a visually impaired user, or anyone on their phone in sunshine, it's unreadable. So contrast must be checked by **measuring**, not by eye (browser developer tools can do it too).

## 2. Fitts's and Hick's laws

According to **Fitts's law**, the time to reach a target (e.g. a button) is longer the **further** away and the **smaller** it is:

$$T = a + b \cdot \log_2\left(\frac{D}{W} + 1\right)$$

where $D$ is the distance, $W$ the target's size, and $a$ and $b$ experimentally measured constants.

```plot
title: Time (ms) to reach a button as a function of distance (px)
x: 10, 1000
y: 0, 1200
param: w = 40, 10, 200, 10
f: 100 + 150*log2(x/w + 1) # Fitts's law with a w px wide button
```

With the slider you set the button's size: a 10 px button takes much more time from the same distance than a 100 px one. That's why mobile buttons are big (guidelines recommend a touch target of about 44–48 px), and why menus sit at the **edge** of the screen: the mouse "stops" at the edge, so the target there is practically infinitely large.

According to **Hick's law**, decision time grows with the **logarithm** of the number of choices:

```python run
# Hick's law: decision time depending on the number of menu items (illustrative constants)
from math import log2

a, b = 200, 150                                  # ms
for n in [2, 4, 8, 16, 32]:
    print(f"{n:>2} menu items: {a + b * log2(n + 1):4.0f} ms")

# Fitts: how much does a bigger button gain?
for w in [10, 24, 48]:
    print(f"{w:>2} px wide button from 600 px: {100 + 150 * log2(600 / w + 1):4.0f} ms")
```

The practical lesson: **frequent** actions should be big, close and among few choices; rare ones can go into a "More" menu. Note, though: Hick's law holds for lists searched **at random** – in an alphabetical or logically grouped, familiar menu, the user doesn't weigh items one by one.

## 3. How many users should we test with?

In the basic lesson we saw user testing. According to research by Jakob Nielsen and Tom Landauer, one tester finds on average about **31%** ($L = 0.31$) of the usability problems. With $n$ testers, the share of problems found is:

$$1 - (1 - L)^n$$

```plot
title: Share of problems found (%) as a function of the number of testers
x: 0, 15
y: 0, 100
param: l = 0.31, 0.1, 0.6, 0.01
f: 100*(1 - (1 - l)^x) # problems found
dash: 85 # roughly what five testers find
```

```python run
# Share of problems found and the return on testing
L = 0.31
previous = 0
for n in range(1, 11):
    found = 1 - (1 - L) ** n
    print(f"{n:>2} testers: {found:5.1%} (the last tester's contribution: +{found - previous:5.1%})")
    previous = found
```

Five testers find about 85% of the problems, and the sixth adds only 5%. That's why the recommendation is that **several small rounds** (5 people, fix, another 5 people) are better than one big 15-person test. Two caveats: if your users are **very different** (e.g. students and teachers), you need a few testers per group; and a statistical comparison (e.g. an A/B test) needs far more people.

## 4. Scoring the SUS questionnaire

The **System Usability Scale** (SUS) is a standard 10-question questionnaire on a 1–5 scale. The odd questions are positive ("I found the system easy to use"), the even ones negative ("I would need help to use it"). Scoring:

- for an odd question: answer − 1,
- for an even question: 5 − answer,
- multiply the sum by 2.5 → a score between 0 and 100 (around 68 counts as average).

```python run
# Computing the SUS score, and the average of several respondents
from statistics import mean

def sus(answers):
    points = 0
    for i, a in enumerate(answers, start=1):
        points += (a - 1) if i % 2 == 1 else (5 - a)   # odd: positive, even: negative statement
    return points * 2.5

respondents = [
    [4, 2, 5, 1, 4, 2, 5, 2, 4, 1],
    [3, 3, 4, 2, 3, 3, 4, 2, 3, 2],
    [5, 1, 5, 1, 5, 1, 5, 1, 5, 1],
    [2, 4, 3, 4, 2, 3, 3, 4, 2, 4],
]
scores = [sus(a) for a in respondents]
print("individual scores:", scores)
avg = mean(scores)
print(f"average: {avg:.1f} → {'above average' if avg > 68 else 'below average'} usability")
```

The SUS shows users' **feeling** in a single number, so it's easy to track whether a redesign helped. But it doesn't say **what** the problem is – for that you need observation and "thinking aloud". Together the two methods give the full picture: the number is the "how much", observation the "why".

| Viewpoint         | What does good UX mean to them?                                                  |
| ----------------- | -------------------------------------------------------------------------------- |
| **user**          | reaches their goal quickly and without errors, without having to think           |
| **accessibility** | visually impaired, colour-blind, keyboard and screen-reader users can manage too |
| **developer**     | consistent components, fewer bug reports                                         |
| **business**      | more completed purchases or sign-ups, fewer support calls                        |

## Summary

- The contrast ratio is computed from the two colours' relative luminance; normal text needs at least 4.5:1.
- Fitts's law: a big, close target is reached faster; Hick's law: decision time grows with the logarithm of the number of choices.
- One tester finds about 31% of the problems; five find about 85% – hence several small test rounds are better.
- The SUS gives a 0–100 score (around 68 is average); observation shows the "why".

## Lesson exercise

```quiz required
? According to WCAG, what is the minimum contrast ratio for normal-size text? (as a decimal, without the ":1")
= 4,5
= 4.5
! For large text 3:1 is enough.

? A button is 300 px away and 30 px wide. What is the value of $\log_2(D/W + 1)$? (rounded to a whole number)
= 3
! $\log_2(11) \approx 3.46$, rounded to 3.

? If one tester finds 31% of the problems, roughly what percentage do two testers find together? (whole number)
= 52
! $1 - 0.69^2 \approx 0.524$.

? On a SUS questionnaire, someone answered 5 to every odd question and 1 to every even one. What is the score?
= 100
! Every question is worth 4 points, $40 \cdot 2.5 = 100$.

? Why is the menu often at the edge of the screen (e.g. the macOS menu bar)?
- because it looks nicer there
+ because the mouse stops at the edge, so the target is practically infinitely large and quick to reach
- because WCAG requires it
- because it takes less space there
! Fitts's law: a bigger target is reached faster.
```
