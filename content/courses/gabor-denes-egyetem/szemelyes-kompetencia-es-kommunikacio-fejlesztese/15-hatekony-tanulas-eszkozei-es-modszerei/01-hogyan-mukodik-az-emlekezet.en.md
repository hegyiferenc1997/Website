---
title: How Does Memory Work?
summary: Working memory and long-term memory, cognitive load, the forgetting curve on an interactive chart, and why repetition and recall strengthen memories.
minutes: 20
---

## What you will learn

- the roles of **working memory** and **long-term memory**,
- what **cognitive load** is,
- what Ebbinghaus's **forgetting curve** shows,
- why **repetition** and **recall** strengthen a memory.

## Two kinds of memory

| Memory               | Capacity                          | Duration         | Example                                       |
| -------------------- | --------------------------------- | ---------------- | --------------------------------------------- |
| **working memory**   | very small: about 4 items at once | seconds, minutes | keeping a phone number in mind until you dial |
| **long-term memory** | practically unlimited             | up to a lifetime | your native language, the concept of a loop   |

The essence of learning: **moving** information from the narrow working memory into long-term memory, and **organising** it so that you can retrieve it later.

## Cognitive load

According to John Sweller's cognitive load theory, working memory is easily **overloaded**. If you have to process too many new things at once (new syntax, a new concept, a new development environment, a noisy room), no capacity is left for understanding.

What can you do?

- Learn in **small steps**, one new thing at a time.
- Study **worked examples** before solving problems alone.
- Remove **distractions** (phone, notifications).
- Connect the new to what you **already know** – existing knowledge "schemas" relieve working memory.

## The forgetting curve

In the 1880s German psychologist Hermann Ebbinghaus measured how fast we forget by learning nonsense syllables. The result: forgetting is **fastest at the beginning**, then slows down.

A simplified model: the share of retained knowledge is $R = e^{-t/S}$, where $t$ is elapsed time (days) and $S$ is the **strength** of the memory. The stronger the memory, the slower we forget.

```plot
title: Forgetting curve (simplified model)
x: 0, 30
y: 0, 100
param: S = 2, 1, 30, 1
f: 100*exp(-x/S) # retained knowledge (%)
value: retained knowledge after 7 days (%) = 100*exp(-7/S)
```

Move the **S** slider: after a single reading the memory is weak (small S), and almost everything is lost within a week. Every successful **repetition and recall** increases the memory's strength – the curve becomes flatter and flatter.

> The exact numbers depend on the person, the material and how meaningful it is. A concept you understand and have connected to existing knowledge is remembered far longer than a nonsense syllable.

## Why does recall strengthen?

When you **retrieve** a memory (rather than just rereading it), the brain strengthens the connections leading to it. This is the **testing effect**: answering practice questions is worth more than the same time spent rereading.

"Desirable difficulty" (Robert Bjork): learning that is **a bit effortful** (recalling from memory, making mistakes, correcting them) produces more lasting knowledge than the comfortable "everything looks familiar" feeling.

## Summary

- Working memory is small and short-term; long-term memory is large and lasting.
- Avoid cognitive overload: small steps, worked examples, connections to existing knowledge.
- Forgetting is fastest at first; repetition and recall strengthen memories.
- Recall (the testing effect) is more effective than rereading.

## Exercise

```quiz required
? Roughly how many items can working memory handle at once?
= 4
! That's why it's easy to overload.

? What does Ebbinghaus's forgetting curve show?
- that we never forget
+ that forgetting is fastest at the beginning, then slows down
- that forgetting is steady
- that we only forget in old age
! That's why you need to review in time.

? Which learning activity strengthens a memory most?
- rereading your notes several times
+ recalling from memory (e.g. answering practice questions)
- highlighting the text
- sleeping with the textbook under your pillow
! The testing effect.

? You try to learn a new programming language, a new development environment and a new algorithm at once, in a noisy place. What is the main problem?
+ cognitive overload of working memory
- long-term memory is full
- too little new information
- the forgetting curve reverses
! One new thing at a time, in a calm environment.
```
