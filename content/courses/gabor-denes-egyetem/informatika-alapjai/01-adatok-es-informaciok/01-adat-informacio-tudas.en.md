---
title: Data, Information, Knowledge
summary: What is the difference between data and information, and what does computer science deal with?
minutes: 12
---

## What you will learn

- what **data**, **information** and **knowledge** are, and how they build on each other,
- what **informatics** (computer science) is about,
- what a **bit** is, and why the computer “thinks” in binary.

## Data, information, knowledge

**Data** is a sign or fact without interpretation: `23`, `"Budapest"`, `2026-11-04`. When data is **put into context** and gets a meaning, it becomes **information**: “It is 23 °C in Budapest today.” When we draw a general rule from information and use it for decisions, it is **knowledge**: “Above 20 °C you don't need a coat.”

```text
    wisdom      ← what is worth doing in the long run?
      ▲
   knowledge    ← rules, experience (“if…, then…”)
      ▲
  information   ← interpreted data (“it is 23 °C today”)
      ▲
     data       ← raw sign (“23”)
```

This ladder is called the **DIKW pyramid** (Data–Information–Knowledge–Wisdom). Companies do the same: raw data (a sales table) becomes meaning (monthly revenue), which becomes a decision (which product to make more of).

## What is informatics?

**Informatics** deals with **collecting, storing, processing and transmitting** information, mainly with computers. The four basic operations appear in every system:

| Operation    | Example                              |
| ------------ | ------------------------------------ |
| collecting   | a sensor measures the temperature    |
| storing      | the value goes into a database       |
| processing   | a program computes the daily average |
| transmitting | the result arrives on your phone     |

## The bit

A computer works with **two-state** signals: voltage or no voltage, magnetised or not. We write these two states as `0` and `1`. Such a two-state unit is a **bit** (binary digit), the smallest unit of information.

With `n` bits you can describe `2ⁿ` different states: 2 with 1 bit, 4 with 2 bits, 256 with 8 bits. That is why a colour channel with 256 brightness levels needs 8 bits.

## Summary

- Data = raw sign; information = interpreted data; knowledge = generalised information used for decisions.
- Informatics is collecting, storing, processing and transmitting information.
- A bit has two states; `n` bits describe `2ⁿ` states.

## Exercise

```quiz required
? Which of these is **information**?
- 37.2
- “Anna Kovács”
+ Anna Kovács's body temperature is 37.2 °C.
- 2026
! Information is data placed in context, with a meaning.

? What is the smallest unit of information, with two possible states, called?
= bit
! binary digit.

? How many different states can 5 bits describe?
= 32
! 2⁵ = 32.

? Which is NOT one of the four basic operations of informatics?
- storing
- processing
+ soldering
- transmitting
! The four operations: collecting, storing, processing, transmitting.
```
