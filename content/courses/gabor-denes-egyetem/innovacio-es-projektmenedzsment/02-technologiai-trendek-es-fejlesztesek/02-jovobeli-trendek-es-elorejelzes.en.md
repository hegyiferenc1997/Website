---
title: Future Trends and Forecasting Them
summary: Quantum computing, extended reality, blockchain, sustainable IT; the Gartner hype cycle, the technology S-curve and Moore's law.
minutes: 20
---

## What you will learn

- the **emerging** technologies that may shape the next decade,
- how to read the **Gartner hype cycle**,
- what the technology **S-curve** shows and what **Moore's law** says.

## Emerging technologies

| Technology                                | Essence                                                       | Possible use                                     |
| ----------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------ |
| **quantum computing**                     | qubits: several states at once (superposition)                | drug research, optimisation, breaking encryption |
| **augmented / virtual reality** (AR / VR) | digital content over the real world, or a fully virtual space | remote maintenance, education, design            |
| **blockchain**                            | a distributed ledger that cannot be altered afterwards        | supply-chain tracking, digital identity          |
| **autonomous systems**                    | self-driving vehicles, drones, robots                         | logistics, agriculture                           |
| **sustainable ("green") IT**              | energy-efficient data centres, lower carbon emissions         | measuring the cloud's CO₂ footprint, recycling   |

> One danger of **quantum computers** is that they could break some of today's public-key encryption (e.g. RSA). **Post-quantum cryptography** is being developed for this.

## The Gartner hype cycle

Since 1995 the analyst firm **Gartner** has published every year how **expectations** around new technologies change over time. Its five phases:

```text
 expectations
    ▲        2
    │       /\
    │      /  \                       5
    │     /    \               4 ___________
    │    /      \          ___/
    │   /        \     ___/
    │  /          \___/
    │ 1             3
    └──────────────────────────────────────▶ time
```

1. **Innovation Trigger**: a breakthrough or demo attracts attention.
2. **Peak of Inflated Expectations**: exaggerated promises, lots of press, a few successes and many failures.
3. **Trough of Disillusionment**: experiments fail to deliver, interest drops.
4. **Slope of Enlightenment**: it becomes clear what it is really good for; second- and third-generation products appear.
5. **Plateau of Productivity**: broad, everyday use.

**Lesson**: do not invest blindly at the peak, and do not write a technology off for good in the trough.

## The technology S-curve

A technology's **performance** as a function of development effort follows an S-shaped curve:

- **start**: slow progress, lots of experimenting,
- **growth**: rapid improvement, the technology matures,
- **maturity**: improvements get smaller and smaller because of physical limits.

In the maturity phase a **new S-curve** (a new technology) appears, which is weaker at first but eventually outgrows the old one – this is technology substitution (e.g. HDD → SSD, 4G → 5G).

## Moore's law

**Gordon Moore** (a co-founder of Intel) observed in 1965 that the number of transistors on integrated circuits doubles regularly; according to his 1975 revision, **every two years**. For decades this set the pace of progress in computing. Today it is slowing because of physical limits, so performance increasingly comes from **parallelism** (more cores, GPUs, specialised AI accelerators).

**Worked example**: if a chip has 10 billion transistors today and the count doubles every two years, in 6 years it will have 10 · 2³ = **80 billion**.

## Summary

- Emerging technologies: quantum computing, AR/VR, blockchain, autonomous systems, green IT.
- Hype cycle: trigger → peak → trough → slope → plateau.
- S-curve: slow start, rapid growth, maturity; the new technology arrives at maturity.
- Moore's law: the transistor count doubles about every two years (now slowing).

## Lesson exercise

```quiz required
? In which phase of the hype cycle are the exaggerated promises and the most press attention?
- Innovation Trigger
+ Peak of Inflated Expectations
- Trough of Disillusionment
- Plateau of Productivity
! At the peak, expectations far exceed real performance.

? How many phases does the Gartner hype cycle have?
= 5
= five
! Trigger, peak, trough, slope, plateau.

? A chip has 10 billion transistors today. According to Moore's law (doubling every two years), how many billion will it have in **4 years**?
= 40
= 40 billion
! 4 years = 2 doublings: 10 · 2 · 2.

? What does it indicate if a technology is in the **maturity** phase of the S-curve?
- it is improving fastest right now
+ improvements are getting smaller, and a new technology is likely to appear
- nobody uses it yet
- it is at the peak of the hype cycle
! Physical limits slow progress; this is the time of technology substitution.

? Which of today's encryption methods could a quantum computer threaten?
+ RSA (public-key encryption)
- writing passwords in lowercase
- HTML
- ZIP compression
! That is why post-quantum cryptography is being developed.
```
