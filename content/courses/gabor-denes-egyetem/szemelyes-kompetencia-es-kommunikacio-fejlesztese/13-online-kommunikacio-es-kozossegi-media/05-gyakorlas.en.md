---
title: Practice – Online Communication and Social Media
summary: Review questions and a summary worksheet on choosing channels, video call and chat etiquette, and a safe online presence.
minutes: 50
kind: practice
---

## Review questions

<details>
<summary>1. Which channel would you choose for: (a) bad news for a team member, (b) sharing a link, (c) reporting a bug?</summary>

(a) Face-to-face or a video call – it needs an emotional, rich channel. (b) Chat – a simple, unambiguous message. (c) The issue tracker (ticket) – trackable, with an owner and status.

</details>

<details>
<summary>2. What would you check before a job interview by video call?</summary>

Whether the app, camera and microphone work; whether the light is good (in front of me); whether the camera is at eye level; whether the background is tidy; whether notifications are off; whether the internet is stable; whether my CV and notes are at hand.

</details>

<details>
<summary>3. How do you recognise a phishing email?</summary>

It rushes or threatens, the sender address is odd or resembles the official one, the link goes somewhere other than it shows, there's an unexpected attachment, it asks for a password or code, often with spelling mistakes.

</details>

<details>
<summary>4. Why is it worth understanding how recommendation algorithms work as a computer engineer?</summary>

Because as a user you consume content more consciously (filter bubbles, manipulation), and as a developer you might one day design such a system and bear responsibility for what it optimises (attention vs. user well-being).

</details>

## Summary worksheet

```quiz required
? On Monday morning you get a chat message from "your manager" from an unknown account: "Urgently transfer 300,000 HUF to this partner, I'll explain later." What should you do?
- transfer it immediately, it's urgent
+ don't transfer, and ask your manager through a known channel (e.g. by phone)
- forward it to the team, maybe someone will transfer
- reply that you did it
! Social engineering: authority + urgency.

? An article headline: "SHOCKING! This programming language will disappear in 2027!" Only an unknown site reports it. What do you do?
- share it immediately
+ check what reliable sources say, and if there's no confirmation, don't share it
- believe it because it's in capitals
- get outraged in the comments
! A clickbait headline, a single source.

? You have 8 back-to-back meetings a day, each in a 30-minute slot. If you shorten each to 25 minutes, how many minutes of break do you get per day in total?
= 40
! 8 · 5 minutes = 40 minutes.

? The team has been arguing about a complex architecture in chat for two days, in 200 messages. What is the best suggestion?
+ a short video call, then recording the decision in the wiki
- more chat messages
- closing the topic without a decision
- everyone emails everyone
! Complex topic → rich channel, then a written record.

? Which is **not** good chat practice?
- replying in a thread
- setting a status while on leave
+ an `@everyone` mention in every message
- sending code in a code block
! Mass mentions disturb everyone.
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **The cost of interruptions.** Write the function `lost_minutes(interruptions, recovery, day_minutes=480)`, which gives how many minutes are lost in a day to the recovery needed after interruptions – but at most the whole day!

```python starter
def lost_minutes(interruptions, recovery, day_minutes=480):
    return interruptions * recovery
```

<details>
<summary>Solution</summary>

```python solution
def lost_minutes(interruptions, recovery, day_minutes=480):
    return min(day_minutes, interruptions * recovery)   # you can't lose more than the day
```

</details>

```python test
assert lost_minutes(6, 15) == 90
assert lost_minutes(32, 12) == 384
assert lost_minutes(50, 15) == 480
assert lost_minutes(10, 10, day_minutes=60) == 60
print("All checks passed!")
```

**2.** **Password entropy.** Write the function `entropy(n, length)`, which gives the entropy in bits of a password of `length` elements chosen at random from `n` kinds of elements (characters or words) (to 1 decimal)!

```python starter
def entropy(n, length):
    return round(n * length / 8, 1)
```

<details>
<summary>Solution</summary>

```python solution
from math import log2

def entropy(n, length):
    return round(length * log2(n), 1)      # n^length possibilities → length · log2(n) bits
```

</details>

```python test
assert entropy(26, 8) == 37.6
assert entropy(2048, 4) == 44.0
assert entropy(7776, 6) == 77.5
print("All checks passed!")
```

**3.** **The real domain.** Write the function `real_domain(url)`, which from an address starting with `http://` or `https://` returns the last two parts of the domain (e.g. `login-check.com`), lowercased! The port (`:8080`) and the path shouldn't count.

```python starter
def real_domain(url):
    return url.split("/")[2].split(".")[0]
```

<details>
<summary>Solution</summary>

```python solution
def real_domain(url):
    host = url.split("/")[2].split(":")[0].lower()   # the part after "//", without the port
    return ".".join(host.split(".")[-2:])            # reading from the right, the last two parts
```

</details>

```python test
assert real_domain("http://neptun-uni-hu.login-check.com/login") == "login-check.com"
assert real_domain("https://github.com/settings") == "github.com"
assert real_domain("https://WWW.Example.org:8080/a/b") == "example.org"
print("All checks passed!")
```

### Quick check questions

```quiz
? What is two-factor authentication (2FA)?
+ besides the password, a second proof (e.g. a code on your phone) is needed to log in
- two different passwords
- typing the password twice
- two usernames
! Even if the password leaks, you can't log in without the second factor.

? What is the entropy in bits of a 10-character PIN made only of random digits (10 kinds)? (to 1 decimal)
= 33,2
= 33.2
! $10 \cdot \log_2 10 \approx 33.2$ bits.

? Which is good practice on a video call?
- microphone on the whole time in a noisy place
+ muting when you're not speaking; camera and sound tested beforehand; an agenda in the invite
- starting on time but without an agenda
- writing emails meanwhile
! Preparation saves everyone's time.

? What is a filter bubble?
- a chat app
+ when algorithms mainly show content that reinforces opinions we already hold
- a form of advertising
- a privacy setting on social media
! It's worth deliberately reading sources with different viewpoints too.
```
