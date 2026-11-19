---
title: Deeper – Checking Written Texts with a Program
summary: A readability measure (LIX) on two versions, an e-mail checker program (subject line, request up front, deadline, vague words), checking the format of commit messages, and the same incident written for three audiences – with small programs.
minutes: 40
---

## What you will learn in this lesson

- how to **measure** a text's readability with a simple index,
- how to check an e-mail's **basic mistakes** with a program,
- what a well-formatted **commit message** looks like, and how teams check it automatically,
- how to write the same news for **different recipients**.

## 1. How readable is it? The LIX index

**LIX** (läsbarhetsindex, Swedish for "readability index") is a simple, language-independent measure: it adds the average sentence length to the share of long words:

$$\text{LIX} = \frac{\text{words}}{\text{sentences}} + 100 \cdot \frac{\text{long words (7+ letters)}}{\text{words}}$$

Rough interpretation: **below 40** easy, **40–50** medium (newspaper article), **50–60** hard (technical text), **above 60** very hard. Values differ between languages (Hungarian, with its suffixes, usually scores higher than English), so it's best used to **compare two versions**.

```python run
# LIX readability index for two versions: long and convoluted vs short and simple
import re

def lix(text):
    words = re.findall(r"\w+", text)
    sentences = [s for s in re.split(r"[.!?]+", text) if s.strip()]
    long = [w for w in words if len(w) >= 7]
    return len(words) / len(sentences) + 100 * len(long) / len(words), len(words), len(sentences)

original = ("We would like to inform our valued users that, as a consequence of maintenance "
            "activities related to the operation of the system, the availability of the service "
            "may become temporarily restricted during the weekend period, the duration of which "
            "is not expected to exceed four hours.")
simple = ("On Saturday from 8 to 12 we are doing maintenance. The site will be down during this time. "
          "By noon everything will work again.")

for name, text in [("original", original), ("simple", simple)]:
    value, w, s = lix(text)
    print(f"{name:<9} LIX = {value:5.1f}  ({w} words, {s} sentence(s))")
```

The original is one long sentence full of long, noun-heavy words ("consequence", "availability", "temporarily"). The simple version says **the same** – in fact more: it gives a concrete time – but in much shorter sentences. The lesson: **precision and simplicity aren't opposites**; vague officialese is often less precise.

> LIX doesn't measure content: a meaningless text made of short sentences can also score well. As an indicator it shows where rephrasing is worthwhile – the decision is yours.

## 2. An e-mail checker

A program can check the rules from the basic lesson (a telling subject line, the request up front, a concrete deadline, brevity). Many mail clients and grammar assistants work the same way:

```python run
# E-mail checker: subject line, request up front, deadline, vague words, length
import re

def check(subject, body):
    issues = []
    if len(subject.split()) < 3:
        issues.append("subject line too short – include the topic and the action")
    first_two = " ".join(re.split(r"(?<=[.!?])\s+", body.strip())[1:3]).lower()
    if not re.search(r"could you|please|need|approv|decision", first_two):
        issues.append("it isn't clear up front what you're asking (put the request in the first paragraph)")
    if not re.search(r"\b(monday|tuesday|wednesday|thursday|friday|\d{1,2}(st|nd|rd|th)|\d{1,2}:\d{2})", body.lower()):
        issues.append("no concrete deadline")
    vague = re.findall(r"\b(asap|sometime|maybe|perhaps|whenever)\b", body.lower())
    if vague:
        issues.append(f"vague words: {sorted(set(vague))}")
    if len(body.split()) > 150:
        issues.append(f"long ({len(body.split())} words) – use bullet points or talk it over")
    return issues or ["fine"]

mails = [
    ("Question", "Hi Péter! We discussed a lot at last week's meeting, the project is going well. "
                 "Maybe you could look at the documentation sometime? Thanks!"),
    ("Approval needed: API docs v2, by Thursday",
     "Hi Péter! The second version of the API documentation is ready. Could you review chapter 3 "
     "(authentication) by Thursday 12:00 and let me know whether you approve it? The link is below."),
]
for subject, body in mails:
    print(f"Subject: {subject}")
    for i in check(subject, body):
        print(f"   → {i}")
```

The first mail is typical: the recipient can't tell from the subject what it's about, the request hides at the end, and because of "sometime" it will never be urgent. The second mail's subject line alone tells Péter **what, about what and by when** you're asking.

## 3. Commit messages: written communication in the code

The version control history is the team's **shared log**: six months later, it's where you find out why something changed. Many teams use the **Conventional Commits** format: `type(scope): short description`, where the type is e.g. `feat` (new feature), `fix`, `docs`, `refactor`, `test`. A CI step can check this automatically:

```python run
# Checking commit messages against the Conventional Commits format
import re

pattern = re.compile(r"^(feat|fix|docs|refactor|test|chore)(\([a-z0-9-]+\))?: .{3,72}$")
messages = [
    "fix(login): don't throw a 500 error for an empty e-mail address",
    "feat(booking): online cancellation for customers",
    "fixes",
    "WIP",
    "docs: README installation steps for Windows",
    "Fix: something didn't work, now it maybe does",
]
for m in messages:
    ok = bool(pattern.match(m))
    print(f"{'✓' if ok else '✗'} {m}")
```

From "fixes" or "WIP" nobody will learn in six months what happened. A good commit message says **in one sentence** what it changes, and the scope shows where. (The last message starts with a capitalised `Fix`, so the strict pattern rejects it – and its content says nothing either.)

## 4. One piece of news, three recipients

Last night the booking system was down for 40 minutes because of a faulty database update. The same fact has to be written for three recipients – the **pyramid principle** (essentials first) applies to all three, but the essentials differ:

| Recipient            | What's essential for them?                                   | Detail                                                                                           | Tone                          |
| -------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ | ----------------------------- |
| **customers**        | Does it affect me? Is my booking safe? What do I need to do? | "Your bookings are safe, there's nothing you need to do." No technical cause.                    | simple, reassuring            |
| **management**       | How big is the damage? Is it fixed? Can it happen again?     | 40 minutes of downtime, about 25 missed bookings, fixed; preventive step: testing before updates | concise, with numbers         |
| **development team** | What exactly happened? How do we prevent it?                 | the migration script's steps, a log excerpt, the cause, action items with owners                 | technical, precise, blameless |

Notice: none of the versions is "better" than the others – each answers **the recipient's question**. The most common mistake is sending the developer version to customers (incomprehensible and frightening), or the customer version to developers (nothing can be learned from it).

## Summary

- LIX = average sentence length + percentage of long words; useful for comparing two versions, and short sentences and concrete words are usually more precise too.
- An e-mail's basic check can be automated: a telling subject line, the request up front, a concrete deadline, no vague words.
- The commit message is the team's shared log; the Conventional Commits format (`type(scope): description`) can be checked by machine.
- Write the same news with different essentials, level of detail and tone for each recipient.

## Lesson exercise

```quiz required
? A text has 100 words and 10 sentences, of which 30 words are long (7+ letters). What is its LIX value?
= 40
! $100 / 10 + 100 \cdot 30 / 100 = 10 + 30 = 40$.

? Which is the best subject line?
- "Question"
- "Hi!"
+ "Approval needed: API docs v2, by Thursday"
- "Important!!!"
! The subject line shows the topic, the action and the deadline.

? Which commit message matches the Conventional Commits format?
- "fixes"
- "WIP"
+ "fix(login): don't throw a 500 error for an empty e-mail address"
- "Fix: something didn't work"
! type(scope): short description – with a lowercase type.

? You're writing to customers about a night-time outage. What should go in the first sentence?
- the faulty line of the migration script
- the name of the responsible developer
+ that their bookings are safe and there's nothing they need to do
- the database version number
! The customer's question: does it affect me, and what do I need to do?

? What's the problem with "Maybe you could look at the documentation sometime?"
- it's too polite
+ it's vague: no concrete request or deadline, so it easily gets lost
- it's too short
- there's no greeting
! Because of "maybe" and "sometime" it will never be urgent.
```
