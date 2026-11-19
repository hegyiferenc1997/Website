---
title: Practice – IT Security
summary: Review questions and a summary worksheet on threats, authentication, encryption and backups.
minutes: 20
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
