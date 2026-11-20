---
title: Practice – Innovation and Creativity
summary: Review questions and a summary worksheet for the first topic.
minutes: 45
kind: practice
---

## Review questions

Try to answer in your head first, then open the answer!

<details>
<summary>1. Why is a patented but never implemented invention not an innovation?</summary>

Because the essence of innovation is practical implementation and value creation. A patent only protects the idea legally; as long as nobody uses it, it brings no benefit.

</details>

<details>
<summary>2. What does Schumpeter's "creative destruction" mean? Give a computing example!</summary>

The new solution pushes out the old one and thereby reshapes the market. Example: cloud office suites and web e-mail pushed back boxed, installed software.

</details>

<details>
<summary>3. How do radical and disruptive innovation differ?</summary>

Radical refers to the degree of technological novelty (a fundamentally new solution). Disruptive refers to market impact: it attacks the market leader from below with a simpler, cheaper product. A disruptive innovation may even be technologically simple.

</details>

<details>
<summary>4. Why must the divergent and convergent phases be separated?</summary>

Because instant criticism kills ideas. First we collect many ideas without judgement, and only afterwards do we evaluate and choose.

</details>

<details>
<summary>5. A university team is designing a canteen app. How would design thinking help?</summary>

First they would interview students to understand their problems (empathise), phrase the main problem (e.g. "queues are too long"), ideate, build a quick paper or clickable prototype, and test it with real students, then iterate based on the results.

</details>

## Summary worksheet

```quiz required
? A bank's mobile app introduces instant transfers that can be sent to a phone number. What type of innovation is this?
+ product innovation (service innovation)
- process innovation
- organisational innovation
- marketing innovation
! The service used by the customer itself became new.

? A company switches to monthly subscription pricing instead of a one-off licence purchase. What type of innovation is this in the four-way classification?
- product innovation
- process innovation
+ marketing innovation
- organisational innovation
! The price and the way of selling changed, not the product.

? Which is a classic example of **disruptive** innovation?
- the next processor generation is 10% faster
+ digital photography, which pushed out the film manufacturers
- a car maker introduces a new colour
- a restaurant puts together a new menu
! Image quality was weaker at first, then it caught up and pushed out the leader.

? Who introduced the concept of **open innovation** (2003)? (surname)
= Chesbrough
= Henry Chesbrough
! Henry Chesbrough, a researcher at Berkeley.

? In a meeting the group collects only the **benefits**. Which hat are they wearing?
- green
- white
+ yellow
- blue
! Yellow = optimism, benefits.

? Which technique transforms an **existing** product using targeted questions?
- mind map
+ SCAMPER
- the 6-3-5 method
- lateral thinking
! The seven SCAMPER questions (substitute, combine, adapt, modify, put to other use, eliminate, reverse) start from an existing solution.

? How many steps does the design thinking process have (Stanford model)?
= 5
= five
! Empathise, define, ideate, prototype, test.
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **Morphological box.** Write the function `combinations(box)`, which from a `{attribute: [options]}` dictionary tells how many different ideas (combinations) can be formed!

```python starter
def combinations(box):
    return sum(len(options) for options in box.values())
```

<details>
<summary>Solution</summary>

The options must be multiplied, not added: every choice can be paired with every other.

```python solution
def combinations(box):
    count = 1
    for options in box.values():
        count *= len(options)              # the number of choices multiplies at every attribute
    return count
```

</details>

```python test
assert combinations({"a": [1, 2, 3], "b": [1, 2]}) == 6
assert combinations({"p": [1, 2, 3], "f": [1, 2, 3, 4], "r": [1, 2, 3], "t": [1, 2, 3]}) == 108
assert combinations({"x": ["single"]}) == 1
print("All checks passed!")
```

**2.** **How many ideas are needed?** Write the function `at_least_one(p, n)`, which gives the chance of at least one good idea among `n` independent ideas if an idea is good with probability `p` (to 3 decimals), and the function `ideas_needed(p, target)`, which gives the smallest `n` for which this chance reaches `target`!

```python starter
def at_least_one(p, n):
    return round(p * n, 3)

def ideas_needed(p, target):
    return round(target / p)
```

<details>
<summary>Solution</summary>

`p · n` is a good approximation only when `p · n` is very small – for large `n` it would even give a "probability" above 1.

```python solution
def at_least_one(p, n):
    return round(1 - (1 - p) ** n, 3)      # 1 − the chance that all are bad

def ideas_needed(p, target):
    n = 1
    while 1 - (1 - p) ** n < target:
        n += 1
    return n
```

</details>

```python test
assert at_least_one(0.1, 2) == 0.19
assert at_least_one(0.05, 20) == 0.642
assert ideas_needed(0.05, 0.9) == 45
assert ideas_needed(0.5, 0.9) == 4
print("All checks passed!")
```

**3.** **Weighted scoring.** Write the function `winner(ideas, weights)`, which returns the name of the best idea by weighted score from an `{idea: {criterion: score}}` dictionary!

```python starter
def winner(ideas, weights):
    return max(ideas, key=lambda name: sum(ideas[name].values()))
```

<details>
<summary>Solution</summary>

```python solution
def winner(ideas, weights):
    def score(name):
        return sum(weights[c] * s for c, s in ideas[name].items())   # weighted sum
    return max(ideas, key=score)
```

</details>

```python test
ideas = {
    "AI": {"value": 5, "feasibility": 2, "novelty": 5},
    "group": {"value": 4, "feasibility": 4, "novelty": 3},
    "flashcard": {"value": 3, "feasibility": 5, "novelty": 2},
}
assert winner(ideas, {"value": 0.4, "feasibility": 0.3, "novelty": 0.3}) == "AI"
assert winner(ideas, {"value": 0.3, "feasibility": 0.6, "novelty": 0.1}) == "flashcard"
assert winner(ideas, {"value": 0.5, "feasibility": 0.4, "novelty": 0.1}) == "group"
print("All checks passed!")
```

### Quick check questions

```quiz
? A morphological box has 4 attributes with 3 options each. How many combinations can be formed?
= 81
! $3^4 = 81$.

? What is the essence of the SCAMPER method?
- scoring the ideas
+ a list of questions for modifying an existing product (substitute, combine, adapt, …)
- assigning the team members' roles
- estimating the market size
! Each letter stands for a direction of transformation.

? An idea is good with a 20% chance. What's the chance of at least one good idea among 3 independent ideas? (as a decimal, to 3 places)
= 0,488
= 0.488
! $1 - 0.8^3 = 1 - 0.512 = 0.488$.

? What characterises a radical innovation?
- a small improvement of an existing product
+ a fundamentally new technology or solution that opens up new possibilities
- only a price cut
- a renewed marketing campaign
! Incremental innovation is the version that improves in small steps.
```
