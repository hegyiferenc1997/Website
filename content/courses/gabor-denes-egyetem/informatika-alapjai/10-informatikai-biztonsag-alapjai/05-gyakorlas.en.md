---
title: Practice – IT Security
summary: Review questions and a summary worksheet on threats, authentication, encryption and backups.
minutes: 45
kind: practice
---

## Review questions

<details>
<summary>1. You get this mail: “Dear User! Your Neptun account will be deleted within 2 hours. Confirm here: neptun-gde.account-check.top”. What gives it away?</summary>

The urgency and threat, the generic greeting, and above all the domain: `account-check.top` is not the university's address (`neptun-gde` is just a subdomain part at the front). Don't click; report it to the university's IT staff.

</details>

<details>
<summary>2. Why isn't a very strong password enough if you use the same one everywhere?</summary>

Because if one site's database leaks, attackers try the same e-mail–password pair on every other site too (credential stuffing).

</details>

<details>
<summary>3. A company makes a full backup every morning onto the same always-connected network drive. What is the problem?</summary>

There is no offline or off-site copy: ransomware encrypts the connected drive too, and a fire takes everything. A disconnected or versioned off-site backup is also needed.

</details>

```python run
# A simple password checker: length and kinds of characters
def rate(password):
    points = 0
    if len(password) >= 12: points += 2
    if len(password) >= 16: points += 1
    if any(c.isupper() for c in password): points += 1
    if any(c.isdigit() for c in password): points += 1
    if any(not c.isalnum() for c in password): points += 1
    return points

for p in ["Anna2007", "purple-bike-falls-monday", "Purple-Bike-7-Monday"]:
    print(p, rate(p), "/ 6")
```

## Summary worksheet

```quiz required
? What does the C stand for in the CIA triad?
+ Confidentiality
- Control
- Cipher
- Cloud
! Confidentiality, Integrity, Availability.

? Which malware disguises itself as a useful program?
- worm
+ trojan
- botnet
- ransomware
! Named after the Trojan horse.

? How many points does the password checker above give `Anna2007`?
= 2
! 8 characters (0 points), has an upper-case letter (1) and a digit (1), no symbol.

? Which login method resists phishing sites best?
- SMS code
- password
+ passkey
- security question
! A passkey only works on the real domain.

? Which is one-way, i.e. can't be reversed?
- AES
- RSA
+ SHA-256 hash
- Caesar shift
! A hash is a fingerprint, not encryption.

? What does the principle of least privilege mean?
+ everyone gets only as many rights as their task needs
- everyone is an administrator
- nobody has a password
- the fewest users may use the machine
! Don't do everyday work as an administrator.
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **Entropy in bits.** Write the `bits(n, length)` function, which gives the entropy in bits of a password of `length` symbols chosen at random from `n` kinds of symbols (to 1 decimal)!

```python starter
def bits(n, length):
    return round(n * length, 1)
```

<details>
<summary>Solution</summary>

```python solution
from math import log2

def bits(n, length):
    return round(length * log2(n), 1)      # every symbol adds log2(n) bits
```

</details>

```python test
assert bits(64, 10) == 60.0
assert bits(26, 8) == 37.6
assert bits(7776, 6) == 77.5
assert bits(10, 4) == 13.3
print("All checks passed!")
```

**2.** **Caesar cipher.** Write the `caesar(text, shift)` function, which shifts the lowercase letters of the English alphabet by `shift` (wrapping around, also with a negative shift), leaving the other characters unchanged!

```python starter
def caesar(text, shift):
    return "".join(chr(ord(c) + shift) for c in text)
```

<details>
<summary>Solution</summary>

```python solution
ABC = "abcdefghijklmnopqrstuvwxyz"

def caesar(text, shift):
    out = ""
    for c in text:
        if c in ABC:
            out += ABC[(ABC.index(c) + shift) % 26]   # % 26 wraps around
        else:
            out += c
    return out
```

</details>

```python test
assert caesar("abc xyz", 3) == "def abc"
assert caesar("def abc", -3) == "abc xyz"
assert caesar("hello, world!", 13) == "uryyb, jbeyq!"
print("All checks passed!")
```

**3.** **Risk ranking.** Write the `ranking(risks)` function, which, from a `{name: (likelihood, impact)}` dictionary, returns the names of the risks in decreasing order of score (likelihood × impact)! With equal scores, the one with the bigger impact comes first.

```python starter
def ranking(risks):
    return sorted(risks)
```

<details>
<summary>Solution</summary>

```python solution
def ranking(risks):
    return sorted(risks, key=lambda n: (-risks[n][0] * risks[n][1], -risks[n][1]))
```

</details>

```python test
r = {"phishing": (5, 3), "ransomware": (2, 5), "laptop": (3, 4), "meteor": (1, 5), "power": (5, 2)}
assert ranking(r) == ["phishing", "laptop", "ransomware", "power", "meteor"]
assert ranking({}) == []
print("All checks passed!")
```

### Quick check questions

```quiz
? What does the "A" (availability) in the CIA triad mean?
- authenticity
+ availability: the data and the service are accessible when needed
- confidentiality
- integrity
! C: confidentiality, I: integrity, A: availability.

? How many copies does the 3-2-1 backup rule require?
= 3
! 3 copies, on 2 kinds of media, 1 in another location.

? Which is the strongest second factor?
- a code received by SMS
- a code received by email
+ a passkey or a hardware security key
- a security question (e.g. "mother's maiden name")
! These can't be phished.

? What should you do if you get a suspicious, urgent email from "your bank" with a login link?
- click it and enter your details
+ don't click; find the bank's official site or number yourself
- forward it to everyone
- reply with your password
! Urgency is a typical sign of phishing.
```
