---
title: Deeper – Security in Numbers
summary: How long it takes to crack a password (entropy and guesses), why passwords must be stored with a salt and a slow hash, how frequency analysis breaks old ciphers, how much 3-2-1 backup protects, and how to rank risks – with small programs and an interactive chart.
minutes: 45
---

## What you will learn in this lesson

- how to estimate a password's **strength** in bits and in cracking time,
- how a good system stores passwords (**salt** and **slow hash**),
- why a simple cipher can be broken by **frequency analysis**,
- what **3-2-1 backup** is worth in numbers, and how to rank **risks**.

## 1. How long does it take to crack a password?

In the basic lesson we saw that a long password is stronger. But by how much? If the attacker tries every possibility (**brute force**), the number of possibilities is $N^L$, where $N$ is the number of usable symbols and $L$ the length. We can express this in bits too: $L \cdot \log_2 N$ bits (**entropy**) – every extra bit **doubles** the number of guesses.

```python run
# Password strength: entropy and average brute-force cracking time
from math import log2

def time_text(sec):
    for unit, length in [("years", 365 * 24 * 3600), ("days", 24 * 3600), ("hours", 3600), ("minutes", 60)]:
        if sec >= length:
            return f"{sec / length:,.0f} {unit}"
    return f"{sec:.2f} s"

guesses_per_sec = 1e10                              # 10 billion guesses per second (graphics cards)
cases = [("8 lowercase letters", 26, 8), ("8 symbols (lower+upper+digit)", 62, 8), ("12 symbols (lower+upper+digit)", 62, 12),
         ("4 random words (of 7776)", 7776, 4), ("6 random words (of 7776)", 7776, 6)]
for name, n, length in cases:
    bits = length * log2(n)
    avg = n ** length / 2 / guesses_per_sec          # on average half the possibilities must be tried
    print(f"{name:<31} {bits:5.1f} bits → on average {time_text(avg)}")
```

```plot
title: Average cracking time (base-10 logarithm, seconds) as a function of entropy (bits)
x: 20, 100
y: -5, 20
param: g = 10, 6, 14, 1
f: (x - 1)*log(2) - g # lg(2^(x−1) / 10^g): 10^g guesses per second
dash: 7.5 # about one year (10^7.5 s)
```

The chart's vertical axis shows the **order of magnitude** (7.5 means about a year, 10 about 300 years). With the slider you set the attacker's speed: an attacker a thousand times faster only shifts the line by 3 orders of magnitude – 10 extra bits (two or three extra characters) make up for it. **But** the calculation only holds for a **random** password! "Password123!" formally has 12 symbols with lower and upper case, digits and a symbol, yet it's cracked in minutes, because attackers start with **dictionaries** and common patterns. That's why a password manager (it generates truly random passwords) and a passphrase of random words are good.

## 2. How does a good system store passwords?

A website must **never** store passwords in readable form – if the database leaks, every account is at risk (and many people use the same password elsewhere). In the basic lesson we saw the **hash**: a one-way function that makes a fingerprint from the password. On its own it's not enough, for two reasons:

- if two users have the same password, their hashes are the same too – and the hashes of common passwords can be precomputed,
- a fast hash function (e.g. SHA-256) can be computed billions of times a second.

The solution: every user gets a random **salt** that goes next to the password, and we use a **deliberately slow** function (e.g. PBKDF2, bcrypt, Argon2):

```python run
# Storing passwords: salt + slow hash (PBKDF2), verification with a timing-safe comparison
import hashlib, os, hmac

def store(password):
    salt = os.urandom(16)                                # a different random salt per user
    h = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, 100_000)   # 100,000 rounds: slow
    return salt, h

def verify(password, salt, stored):
    h = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, 100_000)
    return hmac.compare_digest(h, stored)                # constant-time comparison

anna = store("kitten123")
bela = store("kitten123")                                # the same password...
print("Anna hash:", anna[1].hex()[:24], "...")
print("Béla hash:", bela[1].hex()[:24], "...  ← different because of the salt")
print("correct password:", verify("kitten123", *anna))
print("wrong password:  ", verify("kitten124", *anna))
```

The 100,000 rounds are barely noticeable at login (a few tenths of a second), but they make the attacker **a hundred thousand times slower**. It's a good example of the **developer's** and the **user's** viewpoints coinciding: the user doesn't have to do anything, yet the system is much more secure.

## 3. Why can a simple cipher be broken?

One of the oldest ciphers is the **Caesar cipher**: every letter is shifted by the same amount in the alphabet. There are 25 possible shifts, so you can simply try them all. But a cleverer method, **frequency analysis**, breaks even more complex substitutions: every language has common letters (`e` in English, `e` and `a` in Hungarian), and these stay common in the ciphertext too.

```python run
# Caesar cipher and breaking it with frequency analysis
from collections import Counter

ABC = "abcdefghijklmnopqrstuvwxyz"

def caesar(text, shift):
    return "".join(ABC[(ABC.index(c) + shift) % 26] if c in ABC else c for c in text)

secret = caesar("the meeting is at seven in the computer lab near the entrance", 7)
print("encrypted:", secret)

# the most common letter is probably the English 'e'
most_common = Counter(c for c in secret if c in ABC).most_common(1)[0][0]
shift = (ABC.index(most_common) - ABC.index("e")) % 26
print(f"most common letter: {most_common} → estimated shift: {shift}")
print("decrypted:", caesar(secret, -shift))
```

Modern ciphers (e.g. AES) therefore work so that the ciphertext **looks random**: no frequencies or patterns remain. Their security doesn't depend on the algorithm being secret (AES is public), but on the length of the **key**: with a 128-bit key there are $2^{128}$ possibilities – out of reach by brute force.

## 4. What is 3-2-1 backup worth?

In the basic lesson we saw the 3-2-1 rule: **3** copies, on **2** different media, **1** in another place. Let's compute how much it helps! Suppose a storage device is lost with 5% probability in a year (it fails, is stolen, ransomware encrypts it):

```python run
# Chance of data loss in a year with different backup strategies (assuming independent failures)
p = 0.05                                     # yearly loss probability of one device
print(f"only on the laptop:            {p:.4%}")
print(f"laptop + external drive:       {p ** 2:.4%}")
print(f"laptop + external drive + cloud: {p ** 3:.4%}")

# but if the external drive is always next to the laptop, a burglary or fire takes both
shared = 0.02                                # shared event (fire, theft, ransomware on the connected drive)
print(f"laptop + always-connected drive, with shared risk: {shared + (1 - shared) * p ** 2:.4%}")
```

With two independent copies the chance is 0.25%, with three 0.0125% – **four hundred times** smaller than with a single copy. The word "independent" is crucial, though: ransomware encrypts an always-connected external drive just like the laptop. That's why one copy must be **elsewhere** (and preferably disconnected).

## 5. Ranking risks

A company can't defend against everything equally – money and time are limited. A simple method: estimate each risk's **probability** (1–5) and **impact** (1–5); their product is the risk score:

```python run
# Risk matrix: probability × impact, ranked
risks = {
    "phishing email to an employee": (5, 3),
    "ransomware on the file server": (2, 5),
    "lost company laptop without encryption": (3, 4),
    "power cut in the server room": (2, 3),
    "meteor strike": (1, 5),
}
for name, (prob, impact) in sorted(risks.items(), key=lambda r: -r[1][0] * r[1][1]):
    score = prob * impact
    level = "HIGH" if score >= 12 else "medium" if score >= 6 else "low"
    print(f"{score:>2} {level:<7} {name}")
```

| Viewpoint      | What do they see of security?                   | What can they do?                                          |
| -------------- | ----------------------------------------------- | ---------------------------------------------------------- |
| **user**       | an extra step at login, "annoying" updates      | password manager, MFA, updates, suspicion of urgent emails |
| **developer**  | input validation, password storage, permissions | salt + slow hash, parameterised queries, least privilege   |
| **management** | cost and risk                                   | ranking, backups, training, an incident response plan      |
| **attacker**   | the weakest link – often a person               | that's why training and MFA are worth the most             |

## Summary

- A random password's strength is $L \cdot \log_2 N$ bits; every extra bit doubles the cracking time – but human-invented passwords fall much faster to dictionary attacks.
- Passwords must be stored with a salt and a deliberately slow hash (PBKDF2, bcrypt, Argon2).
- Simple ciphers are broken by frequency analysis; modern encryption's security depends on the key length.
- Independent backups cut the chance of data loss by orders of magnitude; risks are best ranked by probability × impact.

## Lesson exercise

```quiz required
? What is the entropy in bits of a 10-character password chosen at random from 64 kinds of symbols?
= 60
! $10 \cdot \log_2 64 = 10 \cdot 6 = 60$ bits.

? By what factor does brute-force cracking time grow if a password's entropy grows by 10 bits?
= 1024
! $2^{10} = 1024$.

? Why does every user get a separate random salt for their password?
- so the password can be shorter
+ so that identical passwords get different hashes, and precomputed tables can't be used
- so the user can forget their password
- to make login faster
! The salt makes every hash unique.

? A storage device is lost with 10% probability a year. What is the chance that two independent copies are lost at the same time (in percent)?
= 1
! $0.1^2 = 0.01 = 1\%$.

? A risk has probability 4 and impact 3 (on a 1–5 scale). What is the risk score?
= 12
! $4 \cdot 3 = 12$.
```
