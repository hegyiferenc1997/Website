---
title: Practice – User Experience and Design
summary: Review questions, a mini design task and a summary worksheet on UX, accessibility and the design process.
minutes: 47
kind: practice
---

## Review questions

<details>
<summary>1. In a web shop the “Add to cart” button is grey and small, next to the “Wishlist” button, which is the same size and bright orange. What is the problem?</summary>

The visual hierarchy is wrong: the main action (Add to cart) should be the most prominent. The secondary action (Wishlist) should be fainter.

</details>

<details>
<summary>2. How do you make a custom “button” that is really a `<div>` usable with the keyboard?</summary>

Best is to use a real `<button>` element: it is focusable by default, works with Enter and Space, and screen readers announce it as a button.

</details>

<details>
<summary>3. Why isn't it enough for the development team to test the interface's usability themselves?</summary>

Because they already know the system and the jargon; they don't see what is confusing for a new user. Real target users are needed.

</details>

**Mini design task:** draw a paper wireframe of a university “My classes today” mobile screen! It should have one clear main piece of information (the next class), a list of the day's classes, and a button for the weekly view. Then ask a classmate to “think aloud” while finding the room of your Thursday lab on it.

## Summary worksheet

```quiz required
? Which is part of UX and not UI?
- the font
- the icon style
+ whether the user finds the pay button the first time
- the background colour
! UX is the whole experience.

? What does the O stand for in WCAG's POUR principles?
+ Operable – e.g. with the keyboard too
- Optimised
- Online
- Optional
! Perceivable, Operable, Understandable, Robust.

? What is the invented but research-based typical user called in design?
= persona
! E.g. “Kata, 19, first-year student”.

? In which test does half the users see one version and the other half another, in production?
- usability test
+ A/B test
- unit test
- stress test
! Then they measure which gives better results.

? Which of Nielsen's heuristics does a date picker violate that lets you choose 30 February?
- help and documentation
+ error prevention
- flexibility
- aesthetic, minimalist
! A good interface doesn't even allow the error.

? Which popular browser-based tool is used to make wireframes and prototypes?
= Figma
! With co-editing, a favourite of design teams.
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **Hex to RGB.** Write the `hex_rgb(colour)` function, which turns a `"#rrggbb"` colour code into an `(r, g, b)` triple (integers between 0 and 255)! Accept both lowercase and uppercase.

```python starter
def hex_rgb(colour):
    return (0, 0, 0)
```

<details>
<summary>Solution</summary>

```python solution
def hex_rgb(colour):
    return tuple(int(colour[i:i + 2], 16) for i in (1, 3, 5))   # two hex digits = one colour channel
```

</details>

```python test
assert hex_rgb("#000000") == (0, 0, 0)
assert hex_rgb("#FFFFFF") == (255, 255, 255)
assert hex_rgb("#0b5394") == (11, 83, 148)
print("All checks passed!")
```

**2.** **Which button is faster?** Write the `fitts_time(distance, width)` function, which returns the time to reach a target according to Fitts's law ($T = 100 + 150 \cdot \log_2(D/W + 1)$ ms), rounded to an integer!

```python starter
def fitts_time(distance, width):
    return 100 + 150 * distance / width
```

<details>
<summary>Solution</summary>

```python solution
from math import log2

def fitts_time(distance, width):
    return round(100 + 150 * log2(distance / width + 1))   # logarithmic index of difficulty
```

</details>

```python test
assert fitts_time(300, 100) == 400
assert fitts_time(700, 100) == 550
assert fitts_time(100, 100) == 250
print("All checks passed!")
```

**3.** **SUS score.** Write the `sus(answers)` function, which computes the SUS score from 10 answers between 1 and 5! Odd questions (1st, 3rd, …): answer − 1; even questions: 5 − answer; the sum multiplied by 2.5. For a list of the wrong length, raise a `ValueError`!

```python starter
def sus(answers):
    return sum(answers) * 2.5
```

<details>
<summary>Solution</summary>

```python solution
def sus(answers):
    if len(answers) != 10:
        raise ValueError("exactly 10 answers are needed")
    score = sum((a - 1) if i % 2 == 0 else (5 - a) for i, a in enumerate(answers))   # i=0 is question 1
    return score * 2.5
```

</details>

```python test
assert sus([5, 1] * 5) == 100
assert sus([1, 5] * 5) == 0
assert sus([3] * 10) == 50
try:
    sus([3] * 9)
    assert False, "a ValueError was expected"
except ValueError:
    pass
print("All checks passed!")
```

### Quick check questions

```quiz
? What is the minimum contrast ratio for large text at WCAG level AA? (without the ":1")
= 3
! 4.5:1 for normal text, 3:1 for large.

? According to Hick's law, what does decision time depend on logarithmically?
- the size of the buttons
+ the number of choices
- the screen resolution
- the user's age
! That's why rare options are worth putting in a "More" menu.

? If one tester finds 31% of the problems, roughly what percent do three testers find together? (whole number)
= 67
! $1 - 0.69^3 \approx 0.671$.

? An interface's SUS score is 55. What does that mean?
- excellent usability
+ below-average usability (the average is around 68)
- 55% of users are satisfied
- 55 bugs were found
! SUS is a 0–100 scale, not a percentage.
```
