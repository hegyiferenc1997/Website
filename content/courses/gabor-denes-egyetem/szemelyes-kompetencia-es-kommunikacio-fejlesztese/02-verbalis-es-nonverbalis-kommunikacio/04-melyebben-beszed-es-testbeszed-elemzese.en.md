---
title: Deeper – Analysing Speech and Body Language
summary: Measuring speaking pace and filler words from a talk's transcript, why it's misleading to draw conclusions from a single body language cue (baseline and Bayesian thinking), and how different cultures read the same cue – with small programs and an interactive chart.
minutes: 35
---

## What you will learn in this lesson

- how to **measure** your own speech (pace, filler words, sentence length),
- why you **can't** read minds from a single body language cue,
- what **baseline behaviour** is, and why we watch for change relative to it,
- how the same cue is **read differently** in other cultures.

## 1. Measuring speech: pace and filler words

It's easy to say general things about paraverbal cues (pace, volume, pauses), but to improve, it's worth **measuring**. Record a 2-minute practice talk on your phone, get a transcript (most note-taking apps can make one), and analyse it with a small program:

```python run
# Speech analysis from a transcript: pace, filler words and sentence length
import re

transcript = """So our project is a timetable planner app. Well basically the goal was
that students could put together their timetables more easily. You know, everyone knows
when two classes clash. Um, so the backend was made in Python, and the frontend in React.
The database is PostgreSQL. The biggest challenge was checking clashes quickly,
because a semester can have hundreds of courses. Well we finally solved this with a sorted list,
which turned out much faster. Basically that's it, thank you."""
minutes = 0.45                                # length of the recording in minutes (27 seconds)

words = re.findall(r"\w+", transcript.lower())
fillers = {"so", "well", "basically", "um", "like"}
found = [w for w in words if w in fillers]
sentences = [s for s in re.split(r"[.!?]", transcript) if s.strip()]

print(f"number of words: {len(words)}, pace: {len(words) / minutes:.0f} words/minute")
print(f"filler words: {len(found)} ({len(found) / len(words):.1%}) – {sorted(set(found))}")
print(f"average sentence length: {len(words) / len(sentences):.1f} words")
```

How should you interpret the result?

- **Pace**: a calm, easy-to-follow talk in English is roughly **130–160 words/minute** (in Hungarian, with its longer words, about 120–150). Most people speed up when nervous – if you're well above that, consciously pause at the end of sentences.
- **Filler words**: a few are perfectly natural, but if every tenth word is "so", "well" or "basically", listeners start counting them instead of following the content. The best remedy is a **silent pause**: instead of the filler word, simply stay quiet for a moment.
- **Sentence length**: in speech, **shorter sentences** are easier to follow than in writing – by the end of a 30-word sentence the listener has forgotten its beginning.

Let's calculate with the pace! The length of a text meant for a 10-minute talk depends on the pace:

```plot
title: Length of the talk (minutes) as a function of the text length (words)
x: 0, 2000
y: 0, 16
param: v = 140, 100, 200, 5
f: x / v # length of the talk in minutes
dash: 10 # 10-minute slot
```

If you speak at 140 words/minute, about **1400 words** fit into the 10-minute slot. If nerves push you up to 180, the same text runs out in 7.8 minutes – or if you slow down to 100 because of questions, it takes 14 minutes. That's why you should plan the final text **10–15% shorter**.

## 2. Body language: why can't we read minds?

According to popular articles, crossed arms mean "rejection" and touching your nose means "lying". Research doesn't support this: a single cue can have **many causes**. Crossed arms may mean someone is cold, sitting comfortably, concentrating – or really disagreeing.

Bayes' theorem shows why a single cue is deceptive. Suppose that at a presentation **20%** of the audience really disagrees with you. **60%** of them cross their arms, but so do **30%** of those who agree (the room is cold, it's comfortable):

```python run
# Bayesian thinking: how revealing is a body language cue?
def posterior(prior, cue_if_true, cue_if_false):
    # P(disagrees | crossed arms)
    true = prior * cue_if_true
    false = (1 - prior) * cue_if_false
    return true / (true + false)

# several independent cues one after another (crossed arms, turning away, one-word answers)
p = 0.20
for i, (cue_true, cue_false) in enumerate([(0.60, 0.30), (0.50, 0.15), (0.70, 0.20)], 1):
    p = posterior(p, cue_true, cue_false)
    print(f"after cue {i}: {p:.0%}")
```

From a single cue, the chance that someone really disagrees is only **33%** – whoever "reads" it from crossed arms is wrong twice as often as right. But if **several cues appear together** (crossed arms, turning away, one-word answers), the chance is already **around 85%**. This is the principle of **clusters**: never draw conclusions from a single cue.

> The model simplifies: in reality the cues aren't completely independent. The lesson still holds – one cue is only a suspicion, several cues together are information.

## 3. Baseline behaviour

Some people always smile little, always speak fast, or always cross their arms. For them these cues **mean nothing**, because that's their **baseline behaviour**. What's revealing is the **change** relative to the baseline:

| Situation                                                                                         | Conclusion                                                             |
| ------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Péter always speaks quietly, in short sentences, at meetings.                                     | That's Péter's baseline, it doesn't mean lack of interest.             |
| Zsófi is usually enthusiastic and asks a lot, but today is quiet and joined without camera.       | A change: worth asking Zsófi privately whether everything's all right. |
| The client nodded at every proposal so far, but now stays silent for a long time and takes notes. | A change: they may have doubts – ask openly.                           |

So the best "body language reading" isn't a dictionary of cues, but: **observe the baseline, notice the change, and ask** ("I sense this part convinced you less – what do you think?").

## 4. One cue, several cultures

The same nonverbal cue can mean different things in different cultures – in an international team or with a foreign client this easily causes misunderstandings:

| Cue                             | One interpretation                        | Another interpretation                                                                     |
| ------------------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------ |
| sustained eye contact           | honesty, attention (e.g. Northern Europe) | disrespect towards an older or higher-ranking person (e.g. in several East Asian cultures) |
| nodding                         | "I agree"                                 | "I hear what you're saying" – not necessarily agreement                                    |
| a long silence after a question | embarrassment, being stuck                | respect and careful consideration (e.g. in Finland or Japan)                               |
| thumbs up                       | "OK"                                      | an offensive gesture in some cultures                                                      |

Changing viewpoints is the key here too: if a cue seems "strange", first consider that the other party communicates **by different rules** – and if needed, confirm the essentials verbally ("So we agree on this?"). Topic 8 deals with cultural differences in detail.

## Summary

- Your own speech is measurable: pace (about 130–160 words/minute in English), share of filler words, sentence length; the best substitute for a filler word is a pause.
- A single body language cue is only a suspicion (Bayesian thinking); several cues together (a cluster) are information.
- What's revealing is the change relative to baseline behaviour, not the cue itself.
- The same cue can mean different things in different cultures; when in doubt, ask and confirm verbally.

## Lesson exercise

```quiz required
? You deliver a 1200-word talk at 150 words per minute. How many minutes does it take?
= 8
! $1200 / 150 = 8$ minutes.

? A 600-word transcript contains 12 filler words. How many filler words are there per 100 words?
= 2
! $12 / 600 \cdot 100 = 2$.

? 50% of the audience disagrees. 60% of those who disagree and 20% of those who agree cross their arms. What's the chance that someone with crossed arms disagrees? (as a decimal)
= 0,75
= 0.75
! $\frac{0.5 \cdot 0.6}{0.5 \cdot 0.6 + 0.5 \cdot 0.2} = \frac{0.3}{0.4} = 0.75$.

? A colleague sits with crossed arms at every meeting. What does this probably mean?
- they certainly reject the proposals
+ it's their baseline behaviour, on its own it means nothing
- they're lying
- they're bored
! What's revealing is the change relative to the baseline, not the cue itself.

? A foreign partner stays silent for a long time after your question. What's the best reaction?
- immediately repeat the question louder
- conclude that they disagree
+ give them time to answer, because in many cultures silence signals consideration, and ask verbally if needed
- change the subject
! The same cue can mean different things in different cultures.
```
