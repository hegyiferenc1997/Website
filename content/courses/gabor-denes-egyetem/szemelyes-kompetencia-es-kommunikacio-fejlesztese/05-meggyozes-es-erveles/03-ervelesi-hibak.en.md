---
title: Logical Fallacies
summary: Ad hominem, straw man, false dilemma, slippery slope, appeal to authority, post hoc, circular reasoning and friends – how to recognise them and how to respond.
minutes: 20
---

## What you will learn

- what a **logical fallacy** is,
- the names and recognition of the most common fallacies,
- how to **respond** in a debate.

## What is a logical fallacy?

A **logical fallacy** is an argument that may seem convincing but is **logically flawed**: the conclusion doesn't follow from the premises. It is often unintentional – everyone commits them sometimes.

## The most common fallacies

| Fallacy                                 | Essence                                                | Example                                                                                |
| --------------------------------------- | ------------------------------------------------------ | -------------------------------------------------------------------------------------- |
| **ad hominem**                          | attacks the person instead of the argument             | "What would a junior know about scaling?"                                              |
| **straw man**                           | distorts the other's position and refutes that         | "So you think we shouldn't write tests?" (when they only objected to end-to-end tests) |
| **false dilemma**                       | shows only two options when there are more             | "Either we release it buggy now, or never."                                            |
| **slippery slope**                      | predicts disaster from one step without justification  | "If we skip code review once, tomorrow nobody will test and we'll go bankrupt."        |
| **appeal to authority**                 | authority outside their field, or as the only argument | "A famous actor says this is the best VPN."                                            |
| **post hoc** (after, therefore because) | infers cause from sequence in time                     | "Since the new logo, sign-ups grew – it's because of the logo."                        |
| **circular reasoning**                  | assumes the conclusion in the premise                  | "This library is reliable because it never fails."                                     |
| **hasty generalisation**                | generalises from few cases                             | "Two of my Python projects were slow, Python is useless."                              |
| **appeal to popularity**                | true because many believe it                           | "Everyone uses this framework, so it's the best."                                      |
| **red herring** (distraction)           | diverts attention with an unrelated issue              | "The security hole? How many does the competitor's product have?"                      |

## Correlation and causation

A relative of the **post hoc** fallacy is confusing correlation with causation. Two things can change together because of a **third cause**, or by chance. Before saying "A caused B", ask:

- Could the direction be reversed?
- Is there a common cause (e.g. seasonality)?
- Did you check with an experiment (e.g. an A/B test)?

## How to respond

- **Don't shout the fallacy's name** ("That's ad hominem!") – it only makes the other person defensive.
- Steer the conversation back to the **argument**: "Let's look at the measurements, regardless of who suggested it."
- **Clarify** your position in case of a straw man: "I didn't say we shouldn't test, but that…"
- With a false dilemma, show a **third way**: "We can release the feature behind a flag, only for beta users."

## Summary

- A fallacy may seem convincing but is logically flawed.
- Typical ones: ad hominem, straw man, false dilemma, slippery slope, authority, post hoc, circular reasoning, generalisation, popularity, red herring.
- Correlation does not prove causation.
- In a debate, steer back to the argument rather than naming the fallacy as an accusation.

## Exercise

```quiz required
? "What would a first-year know about security?" Which fallacy?
+ ad hominem
- false dilemma
- circular reasoning
- slippery slope
! It attacks the person instead of the argument.

? "Either we rewrite everything in Rust, or we let it crash." Which fallacy?
- straw man
+ false dilemma
- post hoc
- appeal to popularity
! There are more options (e.g. optimising the bottleneck).

? "Since we introduced the dark theme, sales grew – so it's because of the dark theme." Which fallacy?
- ad hominem
- red herring
+ post hoc (after, therefore because)
- circular reasoning
! Order in time doesn't prove cause and effect.

? "This source is credible because it says so about itself." Which fallacy?
- appeal to authority
+ circular reasoning
- hasty generalisation
- false dilemma
! It assumes the conclusion in the premise.

? How should you respond to a straw man argument?
- "That's a straw man, I won't argue with you!"
+ clarify your own position: "I didn't say…, but that…"
- distort their position too
- stay silent
! Steer the debate back to the actual claim.
```
