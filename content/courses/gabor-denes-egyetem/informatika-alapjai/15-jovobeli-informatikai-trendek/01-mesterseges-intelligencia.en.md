---
title: Artificial Intelligence in Companies
summary: AI, machine learning, deep learning; generative AI and language models; enterprise use, AI agents, risks and the EU AI Act.
minutes: 18
---

## What you will learn

- the difference between **artificial intelligence**, **machine learning** and **deep learning**,
- roughly how **generative AI** and **large language models** work,
- what companies use them for, and the **risks** and **rules**.

## Concepts

```text
 ┌──────────────────────────────────────────────┐
 │ artificial intelligence (AI)                 │  behaviour that seems intelligent
 │  ┌────────────────────────────────────────┐  │
 │  │ machine learning (ML)                  │  │  learns from data instead of rules
 │  │  ┌──────────────────────────────────┐  │  │
 │  │  │ deep learning (neural networks)  │  │  │  many-layer nets, image, sound, language
 │  │  │  ┌────────────────────────────┐  │  │  │
 │  │  │  │ generative AI, LLMs        │  │  │  │  creates new text, images, code
 │  │  │  └────────────────────────────┘  │  │  │
 │  │  └──────────────────────────────────┘  │  │
 │  └────────────────────────────────────────┘  │
 └──────────────────────────────────────────────┘
```

The essence of **machine learning**: we don't write the rule (“if the mail contains the word _prize_, it is spam”); the machine learns it from many **examples** (labelled mails). Kinds:

- **supervised learning**: from labelled examples (spam / not spam, price prediction),
- **unsupervised**: finds groups without labels (customer segmentation),
- **reinforcement**: learns from trial and reward (games, robots).

## Generative AI and large language models

A **large language model** (LLM – e.g. Claude, GPT, Gemini, Llama), trained on huge amounts of text, learns how a text continues. Surprisingly many abilities come from this: summarising, translating, writing code, answering questions, reasoning. **Generative** models also create images, audio and video.

**AI agents** go one step further: they use tools (search, running code, e-mail, company systems) and complete tasks on their own in several steps – for example, based on a ticket they find the bug in the code, fix it and check it with a test.

## Enterprise use

| Area                 | Example                                                    |
| -------------------- | ---------------------------------------------------------- |
| customer service     | an AI assistant answers common questions, around the clock |
| software development | code suggestions, debugging, writing tests, code review    |
| documents            | summarising contracts and reports, extracting data         |
| forecasting          | demand, stock, machine failures (predictive maintenance)   |
| fraud detection      | filtering unusual bank transactions                        |
| marketing            | personalised offers, texts, images                         |

## Risks and rules

- **Hallucination**: the model may confidently state falsehoods – important results must be **checked**.
- **Data protection**: don't paste confidential company data into an unvetted public AI service; that is why companies use solutions under enterprise contracts or running in their own environment.
- **Bias**: prejudices in the training data can show up in decisions (e.g. CV screening).
- **Copyright and liability**: who is responsible for a bad decision made by AI?

The **EU AI Act** (2024) regulates by risk level: besides **prohibited** practices (e.g. social scoring), strict requirements apply to **high-risk** systems (e.g. recruitment, credit scoring, educational assessment); chatbots must disclose that the user is talking to an AI.

## Summary

- AI ⊃ machine learning ⊃ deep learning ⊃ generative AI; machine learning learns from data.
- LLMs: text, code, summaries; AI agents: tool use, multi-step autonomous work.
- Risks: hallucination, data protection, bias; rules: the EU AI Act with risk levels.

## Exercise

```quiz required
? What is the essence of machine learning?
- The programmer writes every rule by hand.
+ The machine learns the rules from examples (data).
- The computer gets a faster processor.
- We encrypt the data.
! Data instead of rules.

? What is it called when a language model confidently states something false?
= hallucination
! That is why important results must be checked.

? Which kind of learning finds groups **without labels** (e.g. customer segments)?
- supervised
+ unsupervised
- reinforcement
! Unsupervised learning.

? In which year was the EU AI Act adopted?
= 2024
! It regulates by risk level.
```
