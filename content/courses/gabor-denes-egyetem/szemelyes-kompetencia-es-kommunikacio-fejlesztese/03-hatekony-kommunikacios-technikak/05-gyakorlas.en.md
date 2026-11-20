---
title: Practice – Effective Communication Techniques
summary: Review questions and a summary worksheet on active listening, questioning techniques and assertive communication.
minutes: 50
kind: practice
---

## Review questions

<details>
<summary>1. Why is paraphrasing useful if the other person has already said it?</summary>

Because it checks understanding: if you got it wrong, the other person corrects you at once. It also shows you were paying attention, and the other person feels understood.

</details>

<details>
<summary>2. Rephrase "Why didn't you write a test?" so that it doesn't trigger defensiveness!</summary>

For example: "What got in the way of writing a test for this part?" or "How do you think we could cover this part with tests?" The focus is on the situation and the solution, not on blame.

</details>

<details>
<summary>3. What is the difference between passive and passive-aggressive behaviour?</summary>

A passive person gives up their own needs and does not signal dissatisfaction. A passive-aggressive person also says yes openly, but expresses anger in hidden ways (sarcasm, "forgetting", lateness).

</details>

<details>
<summary>4. Write an I-message: a teammate regularly doesn't update their tickets!</summary>

"When ticket statuses aren't updated for days, it's hard for me to see where we are, and my weekly report becomes inaccurate. Could I ask you to update them at the end of the day?"

</details>

## Summary worksheet

> A user writes: "Your app is useless!" You work on the support team.

```quiz required
? According to active listening, which is the best first reaction?
- "It works for me."
+ "Sorry that was annoying. Could you tell me what happened exactly?"
- "Read the documentation."
- "Why didn't you update?"
! Reflecting the feeling + an open question.

? Next you ask "Which browser did you use?". What kind of question is this?
- open
+ closed
- leading
- multiple
! It asks for one specific fact.

? According to the funnel technique, which question comes **last**?
- "Tell me, what do you want to achieve with the app?"
- "What steps did you take before?"
+ "So the error message comes after the export button?"
- "What's your opinion of the app?"
! A narrow, confirming closed question.

? The user asks you to call them right now at 11 pm. Which is the assertive answer?
- "Sure, I'll call." (although you're not on call)
- "That's a ridiculous request."
+ "I can't call tonight, but I'll contact you first thing at 9 tomorrow."
- you don't answer
! No + an alternative.
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **Talk share.** A transcript is a list of `(speaker, sentence)` pairs. Write the function `talk_share(transcript, who)`, which gives what share of the words `who` said (to 2 decimals)! Count words by splitting on spaces.

```python starter
def talk_share(transcript, who):
    return round(sum(1 for s, _ in transcript if s == who) / len(transcript), 2)
```

<details>
<summary>Solution</summary>

```python solution
def talk_share(transcript, who):
    total = sum(len(t.split()) for _, t in transcript)              # every word
    own = sum(len(t.split()) for s, t in transcript if s == who)    # only theirs
    return round(own / total, 2)
```

</details>

```python test
t = [("D", "What's the problem?"), ("M", "We double-book one slot every single week."), ("D", "Tell me!"), ("M", "We track all changes on paper each evening.")]
assert talk_share(t, "D") == 0.25
assert talk_share(t, "M") == 0.75
assert talk_share([("A", "one two three")], "A") == 1.0
print("All checks passed!")
```

**2.** **Open or closed?** Write the function `question_type(question)`: if the first word of the question (lowercased, without punctuation) is one of "what, which, how, why, when, tell, describe, who", return `"open"`, otherwise `"closed"`!

```python starter
def question_type(question):
    return "open"
```

<details>
<summary>Solution</summary>

```python solution
OPEN = {"what", "which", "how", "why", "when", "tell", "describe", "who"}

def question_type(question):
    first = question.split()[0].strip(".,!?").lower()      # the first word decides
    return "open" if first in OPEN else "closed"
```

</details>

```python test
assert question_type("What problems do you have?") == "open"
assert question_type("Do you need a mobile app?") == "closed"
assert question_type("Tell me, how does a day go?") == "open"
assert question_type("Do you like the idea?") == "closed"
print("All checks passed!")
```

**3.** **You-message detector.** Write the function `you_message(sentence)`, which returns `True` if the sentence (lowercased, without punctuation) contains any of the words "always, never, again, sloppy, lazy", otherwise `False`!

```python starter
def you_message(sentence):
    return "always" in sentence
```

<details>
<summary>Solution</summary>

```python solution
SIGNS = {"always", "never", "again", "sloppy", "lazy"}

def you_message(sentence):
    words = {w.strip(".,!?").lower() for w in sentence.split()}   # whole words
    return bool(words & SIGNS)
```

</details>

```python test
assert you_message("You always break the build.") is True
assert you_message("You're late again.") is True
assert you_message("Two tests failed yesterday; could you please run them?") is False
assert you_message("This is pretty sloppy work.") is True
print("All checks passed!")
```

### Quick check questions

```quiz
? What is one technique of active listening?
+ summarising what you heard in your own words (paraphrasing)
- finishing the other person's sentence
- giving advice immediately
- looking at your phone
! Paraphrasing shows you understood, and gives a chance to correct it.

? In a 900-word interview the interviewer said 180 words. What percentage of the talking did they do? (write only the number)
= 20
! $180 / 900 = 20\%$.

? What is the essence of the funnel technique?
- only closed questions
+ starting with broad, open questions and gradually narrowing towards specifics
- starting with the hardest question
- asking several questions at once
! First the full picture, then the details.

? Which is an assertive way of saying no?
- "Fine, I'll do it..." (while angry)
- "That's your problem."
+ "This week I can't fit it in because I'm preparing for the demo; I can help next Tuesday."
- not answering
! Clear, reasoned, and offers an alternative.
```
