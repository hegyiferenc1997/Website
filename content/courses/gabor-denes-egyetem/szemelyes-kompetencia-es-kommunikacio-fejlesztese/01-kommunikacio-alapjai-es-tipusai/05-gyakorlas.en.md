---
title: Practice – Fundamentals of Communication
summary: Review questions and a summary worksheet on the communication model, types of communication and Watzlawick's axioms.
minutes: 50
kind: practice
---

## Review questions

<details>
<summary>1. Why isn't it enough to "word a message precisely"?</summary>

Because the success of communication depends on the receiver's understanding. The receiver decodes based on their own knowledge, language use and current state, and noise can distort the message along the way. Without feedback you cannot know what reached them.

</details>

<details>
<summary>2. How can semantic noise be reduced in a development team?</summary>

With a shared glossary (e.g. a "Definition of Done"), examples, checking back, and adapting jargon to the audience. After a meeting it is worth summarising the decisions in writing.

</details>

<details>
<summary>3. When is synchronous communication better, and when asynchronous?</summary>

Synchronous: when you need fast back-and-forth (brainstorming, conflict, a complex decision). Asynchronous: when the message needs thinking through or documenting, or the parties work in different time zones or schedules.

</details>

<details>
<summary>4. Give an example where the content level is fine but the relationship level is the problem!</summary>

In a code review the comment is technically correct ("this loop is O(n²)"), but the author finds the tone condescending ("even a beginner knows this…"). From then on the argument is no longer about the code but about respect.

</details>

## Summary worksheet

Read the situation and answer the questions.

> On Friday evening team lead Anna writes in the team chat channel: "The report must be ready by Monday." Ben, who doesn't check chat at weekends, sees it on Monday morning. Cecilia prepares the report but doesn't know whether Anna meant the monthly or the weekly one. David doesn't reply at all.

```quiz required
? Through what kind of channel did the message go?
- face-to-face conversation
+ a written, asynchronous channel (chat)
- phone call
- video call
! Written on Friday evening, read on Monday.

? Cecilia doesn't know which report is meant. What kind of noise caused this?
- physical
+ semantic
- physiological
- none of these
! The word "report" can be understood in several ways.

? What was most missing from the process that could have prevented the misunderstanding?
- a longer message
+ feedback (checking back or confirmation)
- more emojis
- a more formal greeting
! "Which report do you mean?" – one question would have solved it.

? David doesn't reply. According to which axiom is this also a message?
+ one cannot not communicate
- symmetrical relationship
- digital communication
- punctuation
! Silence means something too.

? What direction is Anna's message in the organisation?
+ downward
- upward
- lateral
- diagonal
! It goes from the manager to the team.
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **A flawless message.** A message consists of `k` independent details, each of which goes wrong with probability `p`. Write the function `flawless_chance(p, k)`, which gives the probability that every detail arrives correctly (rounded to 3 decimals)!

```python starter
def flawless_chance(p, k):
    return round(1 - p * k, 3)
```

<details>
<summary>Solution</summary>

```python solution
def flawless_chance(p, k):
    return round((1 - p) ** k, 3)          # every detail has to get through separately
```

</details>

```python test
assert flawless_chance(0.2, 3) == 0.512
assert flawless_chance(0.1, 5) == 0.59
assert flawless_chance(0.5, 10) == 0.001
print("All checks passed!")
```

**2.** **Asking back.** After one round of asking back, a detail stays wrong only if it went wrong at first and the check didn't catch it either (both with probability `p`). Write the function `with_asking_back(p, k)`, which gives the probability that all `k` details are correct (to 3 decimals)!

```python starter
def with_asking_back(p, k):
    return round((1 - p) ** k, 3)
```

<details>
<summary>Solution</summary>

```python solution
def with_asking_back(p, k):
    return round((1 - p * p) ** k, 3)      # a detail stays wrong with probability p·p
```

</details>

```python test
assert with_asking_back(0.2, 3) == 0.885
assert with_asking_back(0.1, 5) == 0.951
assert with_asking_back(0.0, 7) == 1.0
print("All checks passed!")
```

**3.** **Channel picker.** Write the function `channel(complexity, emotional)` (complexity 1–5): if the topic is emotional or the complexity is at least 4, return `"in person"`; if it's 3, `"video call"`; if it's 2, `"email"`; otherwise `"chat"`!

```python starter
def channel(complexity, emotional):
    return "email"
```

<details>
<summary>Solution</summary>

```python solution
def channel(complexity, emotional):
    if emotional or complexity >= 4:       # complex or emotional topic → rich channel
        return "in person"
    if complexity == 3:
        return "video call"
    if complexity == 2:
        return "email"
    return "chat"
```

</details>

```python test
assert channel(1, False) == "chat"
assert channel(2, False) == "email"
assert channel(3, False) == "video call"
assert channel(5, False) == "in person"
assert channel(1, True) == "in person"
print("All checks passed!")
```

### Quick check questions

```quiz
? Which is an example of semantic noise?
- a stuttering video connection
+ the word "done" means something different to the developer and the client
- a loud office
- tiredness
! The meaning of the words differs between the two parties.

? A message consists of 4 independent details, each going wrong with 10% probability. What is the chance it arrives flawlessly? (as a decimal, to 4 decimals)
= 0,6561
= 0.6561
! $0.9^4 = 0.6561$.

? Which of Watzlawick's axioms says that every message has a content and a relationship level?
+ content and relationship levels
- one cannot not communicate
- punctuation of events
- digital and analogue communication
! The relationship level tells us how to interpret the content.

? What is the role of feedback in the communication model?
- it reduces the cost of the channel
+ it shows the sender whether the receiver understood what they meant to say
- it replaces encoding
- it only exists in writing
! Without feedback, information flows one way only.
```
