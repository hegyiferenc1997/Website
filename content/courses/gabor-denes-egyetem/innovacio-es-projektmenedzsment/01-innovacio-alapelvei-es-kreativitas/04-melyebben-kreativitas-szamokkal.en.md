---
title: Deeper – Creativity in Numbers
summary: The combinatorics of the morphological box on the example of a study app, why you need many ideas (the probability of "at least one good idea"), and the convergent phase with weighted scoring – with small programs and an interactive chart.
minutes: 35
---

## What you will learn in this lesson

- how the morphological box **multiplies** ideas, and why you have to filter afterwards,
- why it's true in numbers too that **quantity breeds quality** in ideation,
- how to choose among ideas with **transparent scoring**, and why it's worth checking how sensitive the decision is to the weights.

## 1. The morphological box: an explosion of combinations

The **morphological box** (Zwicky box) is a systematic ideation technique: you break the product down into **attributes**, list a few options for each, and then combine them. Let the task be a study app for university students:

```python run
# Morphological box: a few options for every attribute, the ideas are the combinations
import itertools, random

box = {
    "platform": ["mobile app", "web interface", "chatbot"],
    "main feature": ["flashcard review", "group study", "AI explainer", "exam calendar"],
    "revenue": ["subscription", "freemium", "university licence"],
    "target group": ["first-years", "exam takers", "PhD students"],
}

combinations = list(itertools.product(*box.values()))   # every possible configuration
print(f"number of possible ideas: {len(combinations)}  (= 3 · 4 · 3 · 3)")

random.seed(7)                                          # fixed randomness, so the same comes out every time
print("\na few random ideas from the box:")
for idea in random.sample(combinations, 4):
    print(" –", " + ".join(idea))
```

Four attributes and a few options already give **108** ideas – a brainstorm rarely produces that many. The strength of the box is that it also puts in front of us pairings we wouldn't think of by ourselves (e.g. "chatbot + exam calendar + university licence + PhD students"). At the same time the number grows by **multiplication**: with a fifth attribute of 5 options there would already be 540 ideas. That's why the divergent phase must be followed by a **convergent** phase that filters and ranks (see part 3).

## 2. Why do you need many ideas?

Suppose an idea is "really good" with probability $p$. If we have $n$ mutually independent ideas, the chance that **at least one** of them is good is:

$$
P(\text{at least one good}) = 1 - (1 - p)^n.
$$

```python run
# Probability of at least one good idea out of n, if an idea is good with probability p
for p in [0.02, 0.05, 0.10]:
    row = "  ".join(f"n={n:>3}: {1 - (1 - p) ** n:5.1%}" for n in [5, 20, 50, 100])
    print(f"p = {p:.0%} | {row}")

# How many ideas are needed for a 90% chance of a good one among them, if p = 5%?
n = 1
while 1 - (1 - 0.05) ** n < 0.9:
    n += 1
print(f"\nfor 90% certainty with p = 5% you need {n} ideas")
```

If every twentieth idea is good ($p = 5\%$), 5 ideas contain a good one with only about a 23% chance, 50 ideas already with 92%; for 90% certainty you need 45 ideas. That's why the rules of brainstorming say that **quantity is the goal**, and why criticism is forbidden in the divergent phase: every suppressed idea reduces $n$. (The model simplifies: in reality ideas aren't independent – ten similar ideas are worth less than ten different ones. That's why "jolting" techniques like SCAMPER or the six hats are useful.)

```plot
title: Probability of at least one good idea as a function of the number of ideas
x: 0, 100
y: 0, 1
param: p = 0.05, 0.01, 0.3, 0.01
f: 1 - (1 - p)^x # P(at least one good)
dash: 0.9 # 90%
```

Move the slider: the rarer a good idea is (small $p$), the more ideas you need for the same certainty.

## 3. The convergent phase: weighted scoring

We score the ideas by **criteria** (1–5), **weight** the criteria, and rank by the weighted sum:

```python run
# Convergent phase: scoring ideas by weighted criteria (1–5 points)
ideas = {
    "AI explainer mobile app": {"value": 5, "feasibility": 2, "novelty": 5},
    "group study on the web": {"value": 4, "feasibility": 4, "novelty": 3},
    "flashcard chatbot": {"value": 3, "feasibility": 5, "novelty": 2},
}

def ranking(weights):
    score = {name: sum(weights[c] * p for c, p in criteria.items()) for name, criteria in ideas.items()}
    return sorted(score.items(), key=lambda t: -t[1])     # descending order

for label, weights in [("balanced", {"value": 0.4, "feasibility": 0.3, "novelty": 0.3}),
                       ("quick launch", {"value": 0.3, "feasibility": 0.6, "novelty": 0.1}),
                       ("safe benefit", {"value": 0.5, "feasibility": 0.4, "novelty": 0.1})]:
    first, score = ranking(weights)[0]
    print(f"{label:<16} → winner: {first} ({score:.2f} points)")
```

From the same scores, **depending on the weights** any of the three ideas can win. This isn't a flaw of the method but its essence: the weights express the **strategy** (do we want to get to market fast, or are we looking for a breakthrough?). Good practice:

- fix the weights **before scoring**, otherwise it's easy to justify your favourite idea "backwards",
- check **how sensitive** the winner is to the weights – if even a small change reshuffles the order, the ideas are really neck and neck, and it's worth trying both (e.g. with a quick prototype).

## Summary

- The morphological box produces ideas by multiplication: $3 \cdot 4 \cdot 3 \cdot 3 = 108$; the many ideas then have to be filtered.
- If an idea is good with probability $p$, at least one of $n$ ideas is good with probability $1 - (1 - p)^n$ – that's why quantity and the ban on criticism matter in the divergent phase.
- Weighted scoring gives a transparent decision, but the weights reflect the strategy; it's worth testing sensitivity.

## Lesson exercise

```quiz required
? A morphological box has 3 attributes, with 4, 5 and 2 options. How many ideas (combinations) can be formed?
= 40
! $4 \cdot 5 \cdot 2 = 40$.

? An idea is good with a 10% chance. What is the chance that at least one of 2 independent ideas is good? (as a decimal)
= 0,19
= 0.19
! $1 - 0.9^2 = 1 - 0.81 = 0.19$.

? Why is criticism forbidden in the divergent phase?
- because criticism is always wrong
+ because every suppressed idea reduces the chance of a really good one among them
- because criticism isn't allowed in the convergent phase either
- because the good ideas are always among the first
! Good ideas are rare, so you need many; immediate criticism reduces their number.

? An idea's scores: value 4, feasibility 3, novelty 5; the weights are 0.5, 0.3 and 0.2. What is the weighted score?
= 3,9
= 3.9
! $0.5 \cdot 4 + 0.3 \cdot 3 + 0.2 \cdot 5 = 2 + 0.9 + 1 = 3.9$.

? What should you do if even a small change of the weights changes the winning idea?
- adjust the weights until your favourite idea wins
+ treat the two ideas as neck and neck, and try both with a quick prototype
- always choose the cheapest
- reject both ideas
! In that case the scoring doesn't decide clearly; an experiment gives more information.
```
