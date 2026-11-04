---
title: Passwords, Multi-Factor Authentication, Encryption
summary: Strong passwords and passphrases, password managers, MFA and passkeys, symmetric and public-key encryption, hashes.
minutes: 18
---

## What you will learn

- what makes a password **strong**, and why you need a **password manager**,
- what **multi-factor authentication** (MFA) and **passkeys** are,
- what **encryption** (symmetric and public-key) and a **hash** are.

## Strong passwords

Attackers don't “guess” passwords; they try them with machines: dictionary words, leaked password lists, then every combination. A password's strength depends mainly on its **length**.

```python run
# How many possible passwords are there? (size of character set ** length)
print("8 lowercase:  ", 26 ** 8)
print("8 mixed:      ", 94 ** 8)      # lower and upper case, digits, symbols
print("16 lowercase: ", 26 ** 16)
# At 10 billion guesses per second, how many years to try them all?
for name, n in [("8 mixed", 94 ** 8), ("16 lowercase", 26 ** 16)]:
    print(name, round(n / 1e10 / 3600 / 24 / 365, 1), "years")
```

Tips:

- at least **12–16 characters**; a **passphrase** (`purple-bike-falls-on-monday`) is long and memorable,
- **a different password for every site** – if one site leaks, the others stay safe,
- a **password manager** (Bitwarden, 1Password, the browser's or phone's built-in one): protects the other, randomly generated passwords with one strong master password.

## Multi-factor authentication (MFA)

Authentication factors:

1. something you **know** – password, PIN,
2. something you **have** – phone, security key,
3. something you **are** – fingerprint, face.

**MFA** asks for at least two. Even if your password leaks, the attacker can't log in without your phone. An **authenticator app** (Microsoft/Google Authenticator) is better than SMS codes.

A **passkey** is passwordless login: your phone or computer stores a secret key that you unlock with your fingerprint or face. It doesn't work on a phishing site, because the key only belongs to the real domain.

## Encryption

**Encryption** turns readable data (plaintext) into unreadable data (ciphertext) with a **key**; only the right key decrypts it.

- **Symmetric** (e.g. AES): the same key encrypts and decrypts. Fast; the problem is how to deliver the key safely.
- **Public-key** / asymmetric (e.g. RSA, elliptic curves): a key pair. Anyone can encrypt for you with the **public** key, but only your **private** key can decrypt it. This is how HTTPS agrees on a shared symmetric key.

```python run
# Toy encryption: Caesar shift (NOT secure in reality!)
def caesar(text, key):
    out = ""
    for c in text:
        if "a" <= c <= "z":
            out += chr((ord(c) - ord("a") + key) % 26 + ord("a"))
        else:
            out += c
    return out

secret = caesar("attack at dawn", 3)
print(secret)
print(caesar(secret, -3))
```

## Hash

A **hash** is a one-way function: it makes a fixed-length “fingerprint” of any data, but the original can't be restored from it. Servers store only the (salted) hash of passwords; downloaded files' integrity is checked this way too.

```python run
import hashlib
print(hashlib.sha256(b"password123").hexdigest())
print(hashlib.sha256(b"password124").hexdigest())   # one character → completely different
```

## Summary

- Long, unique passwords or passphrases, with a password manager.
- MFA: two factors (knowledge, possession, inherence); passkeys resist phishing.
- Symmetric: one key; public-key: a key pair; hash: a one-way fingerprint.

## Exercise

```quiz required
? Which is the strongest password?
- Anna2007
- P@ssw0rd
+ purple-bike-falls-on-monday-morning
- 12345678
! Length matters most.

? Which authentication factor is the authenticator app on your phone?
- something you know
+ something you have
- something you are
! Having the phone is the second factor.

? What does the text `"abc"` become with a Caesar shift of 3?
= def
! a→d, b→e, c→f.

? What is the encryption called that uses a key pair of a public and a private key?
+ asymmetric (public-key)
- symmetric
- Caesar
- hash
! E.g. RSA.
```
