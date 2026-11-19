---
title: Practice – Persuasion and Argumentation
summary: Review questions and a summary worksheet on the structure of arguments, the tools of persuasion and logical fallacies.
minutes: 50
kind: practice
---

## Review questions

<details>
<summary>1. Build a Toulmin argument for the team introducing code review!</summary>

- **Claim**: let's introduce mandatory code review.
- **Data**: last month a second pair of eyes would have caught 4 of 6 live bugs.
- **Warrant**: another developer looks at the code from a different angle, so they notice the author's blind spots.
- **Backing**: industry experience shows that code review filters out a large share of bugs before release.
- **Qualifier**: it would probably reduce the number of bugs significantly.
- **Rebuttal**: for urgent one-line fixes a review afterwards may be enough.

</details>

<details>
<summary>2. Why isn't pathos enough for an engineering audience?</summary>

Because engineering decisions are made on data and logical relationships; emotional arguments without evidence look like manipulation. Pathos can grab attention, but the decision is carried by logos and the speaker's credibility (ethos).

</details>

<details>
<summary>3. What is a dark pattern? Give two examples!</summary>

A user-interface design that influences the user's decision against their interest. Examples: a hard-to-find cancel button, a pre-ticked newsletter subscription, a fake "only 2 left" label, a guilt-tripping decline button ("No, I don't want to save money").

</details>

<details>
<summary>4. How can you decide whether a new feature really increased sign-ups?</summary>

With a controlled experiment (A/B test): users randomly get the old or the new version, and you compare the results of the two groups. That filters out seasonality and other common causes.

</details>

## Summary worksheet

> At a team meeting you are debating whether to switch to a new framework.

```quiz required
? Gabe: "Everyone is switching to it, Google uses it too." Which fallacy (or fallacies) characterise this?
- straw man
+ appeal to popularity and authority
- circular reasoning
- slippery slope
! Popularity and a big company don't prove it's right for you.

? Dora: "If we don't switch now, in two years nobody will want to work here and we can close down." Which fallacy?
- post hoc
- ad hominem
+ slippery slope
- red herring
! It predicts disaster from one step.

? Adam: "In our pilot project page load dropped from 1.2 s to 0.7 s." Which mode of persuasion?
- ethos
- pathos
+ logos
- scarcity
! Measurement data.

? By what percentage did load time drop according to Adam's data (rounded to a whole number)?
= 42
! (1.2 − 0.7) / 1.2 ≈ 0.4167 → 42%.

? Esther: "So you're saying we should throw away all the old code?" – although Adam only proposed rewriting one module. Which fallacy?
+ straw man
- false dilemma
- appeal to authority
- hasty generalisation
! It distorts the other person's position.
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **Updating a belief.** Write the function `update(p, likelihood_ratio)`, which uses the odds form of Bayes' theorem to compute the new belief (to 3 decimals): odds $= p/(1-p)$, new odds = old odds × likelihood ratio, new $p$ = odds / (1 + odds)!

```python starter
def update(p, likelihood_ratio):
    return round(p * likelihood_ratio, 3)
```

<details>
<summary>Solution</summary>

```python solution
def update(p, likelihood_ratio):
    odds = p / (1 - p) * likelihood_ratio   # probability to odds, then multiply
    return round(odds / (1 + odds), 3)      # back to probability
```

</details>

```python test
assert update(0.5, 3) == 0.75
assert update(0.2, 2) == 0.333
assert update(0.8, 0.25) == 0.5
print("All checks passed!")
```

**2.** **Survivorship bias.** The keys of the `table` dictionary are `(group, successful)` pairs, the values are counts. Write the function `success_rate(table, group)`, which gives the group's success rate (to 3 decimals) – relative to **all** members of the group, not just the successful ones!

```python starter
def success_rate(table, group):
    successes = sum(c for (g, s), c in table.items() if s)
    return round(table[(group, True)] / successes, 3)
```

<details>
<summary>Solution</summary>

```python solution
def success_rate(table, group):
    total = table[(group, True)] + table[(group, False)]   # every member of the group
    return round(table[(group, True)] / total, 3)
```

</details>

```python test
t = {("agile", True): 80, ("agile", False): 720, ("not", True): 20, ("not", False): 180}
assert success_rate(t, "agile") == 0.1
assert success_rate(t, "not") == 0.1
assert success_rate({("A", True): 30, ("A", False): 70, ("B", True): 10, ("B", False): 10}, "B") == 0.5
print("All checks passed!")
```

**3.** **Toulmin check.** An argument is stored as a dictionary. Write the function `missing_elements(argument)`, which returns in alphabetical order which of the basic elements "claim", "data", "warrant" is missing (or an empty string)!

```python starter
def missing_elements(argument):
    return [e for e in ["claim", "data", "warrant"] if e not in argument]
```

<details>
<summary>Solution</summary>

```python solution
def missing_elements(argument):
    basic = ["claim", "data", "warrant"]
    return sorted(e for e in basic if not argument.get(e, "").strip())   # missing or empty
```

</details>

```python test
assert missing_elements({"claim": "Let's rewrite it in Rust.", "data": "Rust is fast."}) == ["warrant"]
assert missing_elements({"claim": "X", "data": "Y", "warrant": "Z"}) == []
assert missing_elements({"claim": "X", "data": "  "}) == ["data", "warrant"]
print("All checks passed!")
```

### Quick check questions

```quiz
? Which fallacy is this: "Everyone uses this framework, so it's the best."?
- straw man
+ appeal to the majority (bandwagon)
- ad hominem
- false dilemma
! Just because many people use it doesn't mean it's the best for us.

? At first you estimate a claim at 25% (odds 1:3). A piece of evidence has a likelihood ratio of 3. What is the new belief? (as a decimal)
= 0,5
= 0.5
! New odds $\frac13 \cdot 3 = 1$, so $p = 1/2$.

? Which of Aristotle's means of persuasion is the speaker's credibility?
+ ethos
- pathos
- logos
- kairos
! Ethos: the speaker's credibility and expertise.

? What's the difference between ethical persuasion and manipulation?
- there's no difference
+ ethical persuasion works with true information and respects the other person's interests; manipulation withholds, distorts or applies pressure
- manipulation is always more effective
- ethical persuasion doesn't use emotions
! The difference lies in honesty and in respecting the other party's freedom to decide.
```
