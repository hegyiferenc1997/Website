---
title: Practice – Persuasion and Argumentation
summary: Review questions and a summary worksheet on the structure of arguments, the tools of persuasion and logical fallacies.
minutes: 25
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
