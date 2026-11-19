---
title: Deeper – the Communication Model with Numbers and Cases
summary: How much information is lost on a noisy channel, and how much does one check-back save? Choosing a channel by the complexity of the task, and analysing a code review comment with Watzlawick's five axioms from three viewpoints – with small programs and an interactive chart.
minutes: 35
---

## What you will learn in this lesson

- how to **calculate** how much information gets through a noisy channel,
- why a **feedback round** is worth almost any amount of time,
- how to **choose a channel** (chat, e-mail, call, face to face) for the situation,
- how to analyse a real misunderstanding from **several viewpoints**.

## 1. How much gets through? Noise as probability

In the basic lesson we described noise qualitatively. Now let's calculate! Suppose a task assignment consists of **5 important details** (deadline, owner, scope, priority, how to hand it over), and the receiver **misunderstands or forgets** each of them with probability $p$. If the details are independent, the chance that **all 5** arrive correctly is:

$$P(\text{all correct}) = (1 - p)^5$$

What happens if the receiver **repeats the task back** ("Do I understand correctly that…?") and the sender corrects the wrong part? Then a detail stays wrong only if it went wrong the first time **and** nobody noticed during the check-back. If the latter also happens with probability $p$, the chance of a wrong detail is $p \cdot p = p^2$:

```python run
# Noisy channel: the chance that every detail arrives, with and without feedback
details = 5
for p in [0.05, 0.10, 0.20, 0.30]:
    without = (1 - p) ** details          # one-way message
    with_fb = (1 - p * p) ** details      # after one check-back round
    print(f"p = {p:.0%}: without feedback {without:6.1%}, with one round {with_fb:6.1%}")
```

Even with a 10% error per detail, the chance that the whole task arrives correctly is only **about 59%** – so something goes wrong in every second or third task assignment! After a single check-back it jumps above **95%**. A half-minute "So it's due Friday at 10, and password reset isn't part of it?" pays off many times over when the alternative is a misunderstood feature developed in the wrong direction for three days.

```plot
title: The chance that every detail arrives correctly
x: 0, 15
y: 0, 1
param: p = 0.1, 0.01, 0.4, 0.01
f: (1 - p)^x # without feedback
f: (1 - p^2)^x # with one check-back round
dash: 0.5 # 50%
```

Move the $p$ slider and watch at how many details the two curves drop below 50%. Two lessons:

- **The more details** a message has, the bigger the trouble – long, dense messages are worth breaking into bullet points, and the essentials should be confirmed in writing.
- Feedback reduces the error **not linearly but quadratically**: $0.04$ instead of $p = 0.2$.

> Note: this is a simplified model. In reality the details aren't independent (someone who's tired understands every detail worse), and the check-back isn't perfect either. The lesson still holds: feedback is the cheapest quality assurance.

## 2. Which channel should I choose?

According to **media richness theory** (Daft and Lengel), channels differ in how many cues they carry at once (voice, face, body language, immediate feedback). The more **complex, ambiguous or emotional** the topic, the richer the channel it needs; for simple, unambiguous information, however, a rich channel is a waste (nobody likes a half-hour call about a date).

```python run
# Channel choice: for a topic's complexity (1–5), the least "expensive" channel that is rich enough
channels = [  # (name, richness 1–5, time cost in minutes, leaves a written trace)
    ("chat message", 1, 1, True),
    ("e-mail", 2, 5, True),
    ("video call", 4, 20, False),
    ("face-to-face talk", 5, 30, False),
]

def choose(complexity, must_document):
    ok = [c for c in channels if c[1] >= complexity]           # rich enough?
    name, richness, time, written = min(ok, key=lambda c: c[2])  # the cheapest of these
    if must_document and not written:
        return f"{name}, then a short written summary"
    return name

situations = [
    ("the demo moves to 2 pm", 1, True),
    ("describing an API change to another team", 2, True),
    ("settling a debate between two designs", 4, True),
    ("a problem with a colleague's performance", 5, False),
]
for desc, comp, doc in situations:
    print(f"{desc:<45} → {choose(comp, doc)}")
```

Look at the third line: the debate is best settled in a **call** (faster, fewer misunderstandings, emotions are visible), but the decision should then be recorded **in writing**, otherwise in two weeks everyone remembers something different. These two aspects – **richness** and **traceability** – often pull in opposite directions, which is why we combine channels.

Typical mistakes in choosing a channel:

- **Bad news over chat** ("From tomorrow you're on another project 🙂"): too poor a channel for an emotional topic.
- **A long e-mail thread** about a disagreement, with 14 replies: a 10-minute call would have solved it.
- **A verbal decision with no written trace**: the agreement "evaporates".

## 3. Case study: a code review comment through three pairs of eyes

In a student team project, Bence opens a pull request, and Anna comments:

```text
Anna: This won't work like this. Why didn't you use proper validation?
```

Bence is in a bad mood all afternoon, and the next day doesn't speak to Anna. Let's analyse it with Watzlawick's five axioms!

| Axiom                                         | What happened?                                                                                                                             |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **One cannot not communicate**                | Bence's silence the next day is also a message: "I'm offended". Anna may not even notice.                                                  |
| **Content and relationship levels**           | Content: validation is missing. Relationship: "proper" and "why didn't you" sound to Bence like "you're sloppy".                           |
| **Punctuation of the sequence of events**     | Anna: "Bence is sloppy, so I'm strict". Bence: "Anna is hurtful, so I don't ask". Each treats the other's behaviour as the starting point. |
| **Digital and analogue communication**        | In writing there's no tone, face or smile – Bence fills the missing analogue cues with the worst interpretation.                           |
| **Symmetrical and complementary interaction** | Two equal team members (a symmetrical relationship), but the comment strikes a teacher–pupil (complementary) tone, which creates tension.  |

**Three viewpoints:**

- **Anna** (the sender) thinks they were just efficient: Anna pointed out the bug and asked a question. By intention, Anna _helped_.
- **Bence** (the receiver) reacted to the relationship message, not the content, and felt _judged_.
- **An outside observer** (e.g. the team's third member) sees that the content was justified, but the form cost the team half a day, and on the next PR Bence may not dare to ask.

How could it have gone better? The same content with a different relationship message:

```text
Anna: Registration currently lets an empty e-mail address through (I tried it: it gives a 500 error).
      I think the existing validation function could catch it – if you like, I'm happy to
      show you how we used it for login.
```

This is **concrete** (what the bug is, how we know), it **proposes** something, and on the relationship level it says: "we're on the same team". From Bence's side, feedback would have helped: "I felt your comment said I'd been sloppy – did you mean it that way?" A sentence like this breaks the **punctuation** trap.

## Summary

- If a message consists of $k$ independent details, each going wrong with probability $p$, it arrives fully correct with probability $(1 - p)^k$; after one check-back round with probability $(1 - p^2)^k$.
- Choose the channel by the topic's complexity and emotional charge; record decisions made on a rich channel in writing too.
- A misunderstanding is worth looking at through the eyes of the sender, the receiver and an outside observer: the content and relationship levels often say different things.

## Lesson exercise

```quiz required
? A message consists of 3 independent details, each going wrong with a 20% chance. What's the chance that all three arrive correctly? (as a decimal)
= 0,512
= 0.512
! $0.8^3 = 0.512$.

? A detail goes wrong with a 20% chance, and an error also goes unnoticed at the check-back with a 20% chance. What's the chance this detail is correct in the end? (as a decimal)
= 0,96
= 0.96
! The chance of an error is $0.2 \cdot 0.2 = 0.04$, so $1 - 0.04 = 0.96$.

? Two team members have been arguing about an architecture decision for weeks, and the debate is tense. Which channel is best?
- another detailed e-mail
- chat messages in the team channel
+ a video call or face-to-face meeting, then a written summary of the decision
- sending out a questionnaire
! Complex, emotional topic → rich channel; the decision needs to be written down too.

? A colleague hasn't answered your question for two days, but chats with the others. Which axiom fits best?
+ one cannot not communicate
- digital and analogue communication
- symmetrical and complementary interaction
- all communication is encoding
! Silence is a message too.

? Anna's comment ("Why didn't you use proper validation?") was justified in content. What caused the tension anyway?
- the channel's physical noise
+ the relationship-level message (judgement, lecturing tone)
- that it contained too many details
- that Bence can't read
! The receiver reacted to the relationship message, not the content.
```
