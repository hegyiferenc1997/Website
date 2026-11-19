---
title: Practice – Verbal and Nonverbal Communication
summary: Review questions and a summary worksheet on paraverbal cues, channels of body language and congruence.
minutes: 50
kind: practice
---

## Review questions

<details>
<summary>1. What is the difference between verbal and paraverbal communication?</summary>

Verbal is the content of the spoken or written words; paraverbal is how speech sounds: volume, pace, pitch, stress, pauses. The same sentence can mean something quite different because of how it sounds.

</details>

<details>
<summary>2. Why is it risky to draw conclusions from a single body-language cue?</summary>

Because a cue can have many causes (crossed arms can mean withdrawal, but also that the person is cold or just comfortable). Look at clusters of cues together with the situation, and if unsure, ask.

</details>

<details>
<summary>3. How can you get feedback in an online talk with cameras off?</summary>

Ask for active signals: reaction emojis, a short chat message, a quick poll, questions to named people. Stop regularly and ask whether things are clear.

</details>

<details>
<summary>4. Why is punctuality a form of communication?</summary>

According to chronemics, how we handle time is a message: being late regularly suggests that others' time matters less. A fast or slow response time also shows how important you consider the other person.

</details>

## Summary worksheet

```quiz required
? In which sentence does stress express that **someone else** said it?
+ "**I** didn't say he made a mistake."
- "I **didn't** say he made a mistake."
- "I didn't say he made a **mistake**."
- "I didn't **say** he made a mistake."
! The stress is on "I".

? How many basic zones did Edward T. Hall describe for the use of space?
= 4
! Intimate, personal, social, public.

? At a job interview the interviewer sits 2 metres from you. Which zone are you in?
- intimate
- personal
+ social
- public
! 1.2–3.6 m.

? Which one is **not** a nonverbal channel?
- facial expression
- posture
+ vocabulary
- use of space
! Vocabulary is part of verbal communication.

? A colleague says "Sure, happy to help" while sighing and looking at their phone. What can we say about this?
- a congruent message
+ an incongruent message
- a purely verbal message
- an asynchronous message
! Words and body language contradict each other.
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **Speaking pace.** Write the function `pace(words, seconds)`, which gives the speaking pace in words per minute, rounded to a whole number!

```python starter
def pace(words, seconds):
    return round(words / seconds)
```

<details>
<summary>Solution</summary>

```python solution
def pace(words, seconds):
    return round(words / (seconds / 60))      # convert seconds to minutes
```

</details>

```python test
assert pace(140, 60) == 140
assert pace(74, 27) == 164
assert pace(300, 150) == 120
print("All checks passed!")
```

**2.** **Share of filler words.** Write the function `filler_share(text, fillers)`, which gives the share of filler words in the text (to 3 decimals)! Lowercase the words and strip punctuation (`.,!?`) from their ends – so "So," counts as a filler word, but "something" does not.

```python starter
def filler_share(text, fillers):
    count = sum(text.lower().count(f) for f in fillers)
    return round(count / len(text.split()), 3)
```

<details>
<summary>Solution</summary>

```python solution
def filler_share(text, fillers):
    words = [w.strip(".,!?").lower() for w in text.split()]   # compare whole words
    count = sum(1 for w in words if w in fillers)
    return round(count / len(words), 3)
```

</details>

```python test
f = {"so", "um", "like"}
assert filler_share("So, this project works. Um, like.", f) == 0.5
assert filler_share("Something is on the desk.", f) == 0.0
assert filler_share("Um um um okay", f) == 0.75
print("All checks passed!")
```

**3.** **The strength of a body-language signal.** Write the function `posterior(base, signal_if_true, signal_if_false)` using Bayes' theorem: the probability that someone really disagrees, given that we see the signal (to 3 decimals)!

```python starter
def posterior(base, signal_if_true, signal_if_false):
    return round(signal_if_true, 3)
```

<details>
<summary>Solution</summary>

```python solution
def posterior(base, signal_if_true, signal_if_false):
    true = base * signal_if_true               # disagrees AND shows the signal
    false = (1 - base) * signal_if_false       # agrees, but shows it anyway
    return round(true / (true + false), 3)
```

</details>

```python test
assert posterior(0.2, 0.6, 0.3) == 0.333
assert posterior(0.5, 0.6, 0.2) == 0.75
assert posterior(0.1, 0.9, 0.1) == 0.5
print("All checks passed!")
```

### Quick check questions

```quiz
? What is the baseline in interpreting body language?
- the dictionary of body language
+ someone's usual behaviour, against which we watch for changes
- the first impression
- the cultural average
! The change is what's telling, not the signal itself.

? How many words fit into a 10-minute slot at 140 words per minute?
= 1400
! $10 \cdot 140 = 1400$.

? What does congruence mean?
+ the words, the voice and the body language send the same message
- speaking fast
- lots of jargon
- long eye contact
! If they contradict each other, the listener tends to believe the nonverbal signal.

? What is the best remedy for filler words?
- speaking faster
+ a short, silent pause
- speaking louder
- more jargon
! The pause takes the place of the filler word.
```
