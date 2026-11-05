---
title: The Communication Model
summary: What happens when we send a message? Sender, receiver, encoding, channel, noise and feedback, illustrated with everyday examples from a development team.
minutes: 15
---

## What you will learn

- what **communication** means,
- the **elements** of the communication process,
- what **noise** is and what kinds exist,
- why **feedback** is essential.

## What is communication?

**Communication** is the **transfer and understanding** of information, thoughts and feelings between two or more parties. The key word is _understanding_: if you sent an email but the recipient understood something different from what you meant, the communication failed.

> As an engineer it is tempting to think that "precise wording" is enough. In practice, many projects slip not because of technical errors but because of misunderstandings.

## Elements of the communication process

The classic model (based on Shannon and Weaver) compares communication to a telephone line:

```text
 SENDER ──encoding──> MESSAGE ──channel──> decoding ──> RECEIVER
   ^                      ▲   NOISE                        │
   └──────────────────── feedback ─────────────────────────┘
```

| Element      | Meaning                                       | Example                                       |
| ------------ | --------------------------------------------- | --------------------------------------------- |
| **sender**   | who sends the message                         | the team lead                                 |
| **encoding** | turning a thought into words or signs         | phrasing the task                             |
| **message**  | the content itself                            | "We need the new login page by Friday."       |
| **channel**  | the medium the message travels through        | Slack, email, face-to-face conversation       |
| **decoding** | the receiver interprets the signs             | the developer tries to understand it          |
| **receiver** | the person the message is meant for           | the developer                                 |
| **noise**    | anything that distorts the message            | jargon, bad audio, tiredness                  |
| **feedback** | the receiver's response that shows the effect | "Do you mean password reset is included too?" |

## Types of noise

- **Physical noise**: a loud environment, a choppy video call, a bad microphone.
- **Semantic noise**: words mean different things to the two parties (e.g. "done" means "it compiles" to the developer and "it is live" to the client).
- **Psychological noise**: prejudice, stress, tiredness, emotions.
- **Physiological noise**: hunger, illness, hearing difficulties.

> Semantic noise is the sneakiest, because neither party notices it. That is why it pays to define terms together (e.g. a team's "Definition of Done").

## Feedback

**Feedback** closes the loop: it shows whether the receiver understood what the sender intended. Without feedback, there is only **one-way** information transfer.

Good feedback techniques:

- **checking back**: "Do I understand correctly that…?"
- **summarising** at the end of a conversation,
- written **confirmation** after a meeting (a short email about the decisions).

## Summary

- Communication succeeds when the receiver understands what the sender meant.
- Elements: sender, encoding, message, channel, decoding, receiver, noise, feedback.
- Noise can be physical, semantic, psychological or physiological.
- Feedback makes the process two-way.

## Exercise

```quiz required
? When can we say that communication was **successful**?
- when the sender sent the message
- when the message had perfect spelling
+ when the receiver understood what the sender meant
- when the receiver replied immediately
! The essence of communication is understanding.

? In the model, what is the **channel**?
- the content of the message
+ the medium the message travels through (e.g. email, chat, face-to-face)
- the receiver's reaction
- turning a thought into words
! E.g. Slack, phone, video call.

? To the developer "done" means "it compiles", to the client it means "it is live". What kind of noise is this?
- physical
+ semantic
- physiological
- technical
! The meaning of the words differs.

? Which is an example of **feedback**?
- the team lead sends out a newsletter
+ the developer asks back: "Do I understand correctly that password reset is needed too?"
- the microphone crackles
- the team lead phrases the task
! The receiver's response shows the sender the effect.
```
