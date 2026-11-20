---
title: Deeper – Online Security and Attention with Numbers
summary: What notifications cost (the price of interruptions), checking the telltale signs of a suspicious link with a program, the strength of passwords and passphrases in bits and cracking time, and the life of a chat message from three viewpoints – with small programs and an interactive chart.
minutes: 40
---

## What you will learn in this lesson

- how much **attention** each notification takes, and how to protect yourself,
- how to recognise the telltale signs of a **phishing** link and message,
- how to calculate a password's **strength**, and why a passphrase is better,
- why everything you write online is **lasting**.

## 1. The price of interruptions

Every notification (chat, e-mail, social media) is an **interruption**. Reading the message itself takes only a few seconds, but afterwards you have to find your way back into the work – this is called **resumption time**. According to research, for a complex task (programming, studying) it can be as much as **10–20 minutes**. Let's calculate:

```plot
title: Effective working time per hour as a function of the number of interruptions
x: 0, 6
y: 0, 60
param: r = 10, 1, 25, 1
f: 60 - x*r # effective minutes per hour
```

If you need 10 minutes to get back after an interruption, **3 notifications** an hour already take half the hour; with 15 minutes of resumption, 4 notifications take practically the whole hour. For a whole day:

```python run
# The price of interruptions over a working day: time lost and the longest uninterrupted block
day_minutes = 8 * 60
resumption = 12                                       # minutes after one interruption

for per_hour in [0, 1, 2, 4]:
    count = per_hour * 8
    lost = min(day_minutes, count * resumption)
    block = 60 / per_hour if per_hour else day_minutes
    print(f"{per_hour} notifications/hour: {count:>2} interruptions, {lost:>3} minutes lost "
          f"({lost / day_minutes:.0%}), longest quiet block ≈ {block:.0f} minutes")
```

The numbers come from a simple model, but the lesson is real: deep work needs **long, uninterrupted blocks**. Practical steps:

- **Batching**: check e-mail and chat at a few fixed times a day, not continuously.
- **Do Not Disturb mode** on your phone and computer during study blocks.
- In the team, a **status indicator** ("focusing until 2 pm") and a shared rule about what counts as urgent (with its own channel, e.g. a phone call).
- **Don't interrupt needlessly yourself**: a single, complete message ("Hi! Question about the login test: …") is better than "Hi" – then waiting – then the question in three parts.

## 2. A phishing link? Telltale signs with a program

In the basic lesson we saw the signs of phishing. Browser and mail client filters work with similar **heuristics** (rules of thumb) to this small program:

```python run
# Warning signs of phishing in a message and a link (simple heuristics, not complete protection)
import re

known_domains = {"neptun.uni.hu", "github.com", "otpbank.hu"}

def suspicion(message, link):
    signs = []
    m = re.match(r"(https?)://([^/:]+)", link)
    protocol, host = m.group(1), m.group(2).lower()
    if protocol != "https":
        signs.append("unencrypted (http) connection")
    if re.fullmatch(r"[\d.]+", host):
        signs.append("IP address instead of a domain name")
    for known in known_domains:
        if known.split(".")[0] in host and not (host == known or host.endswith("." + known)):
            signs.append(f"resembles {known}, but isn't it")
    if re.search(r"immediately|within 24 hours|suspend|final warning", message.lower()):
        signs.append("urgency, threats")
    if re.search(r"password|card number|\bpin\b", message.lower()):
        signs.append("asks for sensitive data")
    return signs

cases = [
    ("Your account will be suspended within 24 hours! Confirm your password.", "http://neptun-uni-hu.login-check.com/login"),
    ("New sign-in to your account. If it wasn't you, check your settings.", "https://github.com/settings/security"),
    ("Final warning: enter your card number to have your parcel delivered.", "http://185.23.4.17/parcel"),
]
for message, link in cases:
    s = suspicion(message, link)
    print(f"{link}\n   → {'SUSPICIOUS: ' + '; '.join(s) if s else 'no suspicious signs (but that is no guarantee!)'}")
```

Look at the first link: "neptun-uni-hu" is at the **beginning** of the address, but the real domain is at the end: `login-check.com`. This is the most common trick – always look at the domain name **read from the right** (the part before `.com`). The second message also warns you, but doesn't pressure with threats, and the link points to the real site – still, the safest thing is not to click the link but to **type the address yourself**.

> A heuristic is never perfect: professional attackers use https and believable text. The best protection is **two-factor authentication** (2FA) and a habit: never enter sensitive data on a link opened from a message.

## 3. How strong is your password?

The strength of a randomly chosen password is measured in **bits** (entropy): if we randomly choose a password of length $L$ from $N$ kinds of characters, the number of possibilities is $N^L$, and the entropy is $L \cdot \log_2 N$ bits. Each additional bit **doubles** the number of guesses:

```python run
# Password and passphrase strength: entropy in bits and expected cracking time
from math import log2

guesses_per_s = 1e10                         # a strong attacking machine: 10 billion guesses/second
cases = [
    ("8 characters, lowercase only", 26, 8),
    ("8 characters, upper/lower, digit, symbol", 94, 8),
    ("12 characters, upper/lower, digit, symbol", 94, 12),
    ("4 random words from a 7776-word list", 7776, 4),
    ("6 random words from a 7776-word list", 7776, 6),
]
for name, n, length in cases:
    bits = length * log2(n)
    s = 2 ** bits / 2 / guesses_per_s                  # on average half the space must be searched
    if s < 3600:
        time = f"{s:.0f} seconds"
    elif s < 365 * 86400:
        time = f"{s / 86400:.1f} days"
    else:
        time = f"{s / (365 * 86400):,.0f} years"
    print(f"{name:<44} {bits:5.1f} bits → {time}")
```

The 8-character lowercase-only password falls in **seconds**, the 8-character "complex" one in **a few days**. A passphrase of 4 random words (e.g. "horse-battery-stove-cloud") is roughly as strong – but much **easier to remember**. A 6-word passphrase or a 12-character random password would take **hundreds of thousands of years**. So length beats "complexity": a passphrase is easy to make longer. Two important additions:

- This only holds for **random** choices. "Password123!" or your favourite quote is among the first guesses, because attackers start with dictionaries and lists of known passwords.
- A password's strength is worthless if you use the same one in **several places**: from a leaked database the attacker tries it everywhere. That's why you need a **password manager** and a **different** password everywhere.

## 4. The life of a chat message – from three viewpoints

Tired on a Friday evening, you write in the team channel: "This client is a total idiot, they've changed the spec for the third time."

| Viewpoint                    | How do they see it?                                                                                                                                   |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **You, on Friday evening**   | Letting off steam in a "closed" channel, your teammates understand.                                                                                   |
| **A teammate on Monday**     | Awkward: if the client's representative is also in the channel (or joins later), they can read it too. The tone also damages the team culture.        |
| **Someone six months later** | It turns up in a search; someone can screenshot it. In a company channel messages are archived and can even become part of an employer investigation. |

Online messages are **lasting, searchable and forwardable**. A good rule of thumb: don't write anything you wouldn't say to the client's face or want to see on a projector. Frustration is better discussed face to face, verbally – and the actual problem written factually: "The spec has changed for the third time; I suggest we handle changes through a change management process."

## Summary

- After an interruption it can take 10–20 minutes to get back; deep work needs batched message handling and uninterrupted blocks.
- Warning signs of phishing: a similar but not identical domain (read from the right), http, an IP address, urgency, requests for sensitive data; 2FA and typing the address yourself protect best.
- A random password's strength is $L \cdot \log_2 N$ bits; length beats complexity, and a random passphrase of 5–6 words is strong and easy to remember – and you need a different password everywhere.
- Online messages are lasting and searchable: write as if the recipient and anyone else could read them.

## Lesson exercise

```quiz required
? On an 8-hour day you get 6 interruptions, each needing 15 minutes to get back. How many minutes are lost in total?
= 90
! $6 \cdot 15 = 90$ minutes.

? A passphrase consists of 4 randomly chosen words from a 2048-word list. What is its entropy in bits?
= 44
! $4 \cdot \log_2 2048 = 4 \cdot 11 = 44$ bits.

? Which is the real domain in this link: http://neptun-uni-hu.login-check.com/belepes ?
- neptun-uni-hu
+ login-check.com
- belepes
- uni.hu
! Read the domain name from the right: the part before .com is the real owner.

? Why is "Password123!" weak, even though it has an uppercase letter, digits and a symbol?
- because it's too long
+ because it isn't random: attackers start with dictionaries and known password lists, and it's among the first
- because it contains an exclamation mark
- it isn't weak, it's very strong
! The entropy formula only holds for random choices.

? What's the best practice for contacting a colleague on chat?
- "Hi" – then wait for an answer, and ask afterwards
+ a single, complete message with the greeting and the concrete question
- five short messages in a row
- start a video call immediately without warning
! That way they can answer at once, with a single interruption.
```
