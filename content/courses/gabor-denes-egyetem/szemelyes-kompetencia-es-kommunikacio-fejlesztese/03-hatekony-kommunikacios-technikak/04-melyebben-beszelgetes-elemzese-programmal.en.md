---
title: Deeper – Analysing Conversations with a Program
summary: Who talked how much, and what questions did they ask? Analysing the transcript of a requirements interview (talk ratio, open and closed questions), filtering out you-messages and rewriting them with the four steps of nonviolent communication, and two versions of an interview from three viewpoints – with small programs.
minutes: 35
---

## What you will learn in this lesson

- how to **measure** how much you really listened in a conversation (talk ratio),
- how to **recognise** open and closed questions with a program,
- how to rewrite a **you-message** with the observation–feeling–need–request steps,
- what the same **interview** looks like done well and badly, from several angles.

## 1. Who talked more? The talk ratio

In a **requirements interview** (when you find out from the client what they want), the goal is for **them** to talk. Rule of thumb: the interviewer should fill at most **20–30%** of the conversation, the interviewee the rest. If you talk more, you're not gathering needs, you're selling your own idea.

This is easy to measure from a transcript:

```python run
# Talk ratio and question types from an interview transcript
import re

transcript = [
    ("Developer", "What problems do you have with bookings right now?"),
    ("Client", "Bookings come in by phone and e-mail, and we often give out the same slot twice."),
    ("Developer", "So how many times a week does that happen?"),
    ("Client", "Maybe two or three times, but then the customer is very angry, and some never come back."),
    ("Developer", "Do customers need to be able to cancel their booking online?"),
    ("Client", "Yes."),
    ("Developer", "Tell me, what does a typical day at the reception look like?"),
    ("Client", "In the morning we go through the daily list, meanwhile the phone keeps ringing, and we record changes on paper, which someone copies into the spreadsheet in the evening."),
]

words = {}
for who, sentence in transcript:
    words[who] = words.get(who, 0) + len(re.findall(r"\w+", sentence))
total = sum(words.values())
for who, count in words.items():
    print(f"{who:<10} {count:>3} words ({count / total:.0%})")

open_starts = ("what", "how", "why", "tell", "which", "when", "describe")
for who, sentence in transcript:
    if who == "Developer":
        first = re.findall(r"\w+", sentence.lower())[0]
        kind = "open" if first in open_starts else "closed"
        print(f"  [{kind:<6}] {sentence}")
```

In this excerpt the developer said about **39%** of the words – even though they only asked questions! That's above the target: in a short excerpt it's still natural, but in a longer interview it suggests too many or too long questions, or that the interviewer is also commenting. Half of the questions are **open**, and most importantly: the open questions brought the most information (changes recorded on paper reveal a completely new need: **synchronisation**). The closed question ("Do customers need…?") got a single word.

> The program works with a simple rule (based on the first word), so it can be wrong: it classifies "So how many times…?" as closed because its first word is "so" – in fact it asks for a number, which is a half-closed question. English closed questions usually start with an auxiliary verb ("Do…", "Is…", "Can…"). In a real analysis it's worth checking the classification by hand too.

## 2. Two versions of the interview – from three viewpoints

**Version A (bad):**

```text
Developer: So we'd build a web booking system with React, push notifications and
           an admin interface. That'd be good, right?
Client:    Well... I suppose so.
Developer: Great! And it needs calendar sync too, doesn't it?
Client:    If you think it does...
```

**Version B (good):** the transcript analysed in point 1.

| Viewpoint       | Version A                                                                                               | Version B                                                                   |
| --------------- | ------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| **Client**      | Doesn't understand the jargon, it's awkward to say no, so they nod along. Feels nobody listens to them. | Can finally say what hurts; feels understood.                               |
| **Developer**   | Quickly "has the plan", but blindly: doesn't know the real problem (double booking).                    | Seems slower, but a hidden need comes to light (syncing the paper changes). |
| **The project** | A big chance of building something nobody needs – an expensive rewrite later.                           | Development targets the real problem; fewer surprises at handover.          |

Version A's mistakes are familiar from the basic lessons: **jargon** (semantic noise), a **leading question** ("That'd be good, right?"), a series of **closed questions**, and the interviewer talks more. The sentence "If you think it does..." is a warning sign: the client **isn't agreeing but giving up**.

## 3. From you-message to I-message: nonviolent communication

Marshall Rosenberg's **Nonviolent Communication** (NVC) describes an assertive message in four steps:

1. **Observation** – a fact, without judgement: "Last week untested code got into the main branch twice."
2. **Feeling** – your own feeling: "I'm worried…"
3. **Need** – what's behind it: "…because it matters that the demo is stable."
4. **Request** – concrete and doable: "Could you run the tests before merging?"

Telltale signs of you-messages are **labelling** and **generalising** ("always", "never", "again"). A small program shows where rephrasing is needed:

```python run
# Telltale signs of you-messages: generalisation and labelling; suggestions for rewriting
import re

signs = {
    r"\balways\b": "generalisation – name a concrete case",
    r"\bnever\b": "generalisation – name a concrete case",
    r"\bagain\b": "reproach – describe what happened",
    r"\b(sloppy|lazy|careless)\w*": "labelling – describe the behaviour, not the person",
    r"\bwhy didn't you\b": "accusing question – make a request instead",
}

messages = [
    "You didn't run the tests again, you always break the build.",
    "Why didn't you tell me the task was late? That's pretty sloppy.",
    "Yesterday the build was stopped by two failing tests; could you run them before merging?",
]
for m in messages:
    hits = [explanation for pattern, explanation in signs.items() if re.search(pattern, m.lower())]
    print(f"\"{m}\"")
    for h in hits or ["fine: states a fact and makes a request"]:
        print(f"   → {h}")
```

The last message signals the same problem, but states a **fact** (yesterday, two tests) and makes a **request**. The other person doesn't start defending themselves but thinks about a solution.

**Changing viewpoints:** NVC is sometimes felt to be "artificial" – especially when it's said word for word, like a template. The goal isn't to recite the four steps mechanically, but the **way of thinking**: separate the fact from the interpretation, own your feeling, and ask concretely. An experienced colleague can say the same thing in one natural sentence.

## Summary

- In requirements gathering the interviewer should speak at most 20–30% of the words; the talk ratio is easy to measure from a transcript.
- Open questions bring new information; closed and leading questions confirm your own idea.
- The steps of an I-message (NVC): observation, feeling, need, request; "always", "never", "again" and labelling words point to a you-message.
- The same conversation can mean very different things from the client's, the developer's and the project's point of view.

## Lesson exercise

```quiz required
? An interview transcript has 1200 words, of which the interviewer said 300. What percentage of the conversation did they fill? (number only)
= 25
! $300 / 1200 = 0.25 = 25\%$.

? Which is the best opening question in a requirements interview?
- "Do you need a mobile app too?"
- "React will be fine, right?"
+ "What does a booking look like now, from start to finish?"
- "Exactly how many users will there be?"
! An open question brings the most information and doesn't lead.

? What is the correct order of the four steps of nonviolent communication (NVC)?
+ observation, feeling, need, request
- feeling, request, observation, need
- request, observation, feeling, need
- need, feeling, request, observation
! First the fact, then your own feeling and need, finally the concrete request.

? Which sentence is a you-message?
- "Yesterday two tests failed after the merge."
+ "You always break the build."
- "I'm worried about the demo."
- "Could you run the tests, please?"
! Generalisation ("always") and labelling.

? In the interview the client says: "If you think it does..." What does this probably signal?
- enthusiastic agreement
+ that they don't understand or don't dare to challenge the proposal, they just give in
- that they know exactly what they want
- that the developer asked well
! This isn't agreement but giving up – go back to open questions.
```
