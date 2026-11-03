---
title: Security Principles and Threats
summary: The CIA triad, kinds of malware, authentication (password, hash, MFA) and the principle of least privilege.
minutes: 20
---

## What you will learn

- the three goals of security (**CIA**: confidentiality, integrity, availability),
- which **threats** and **malware** exist,
- how **authentication** works (password, hash, multi-factor), and what the **principle of least privilege** is.

## The CIA triad

| Goal                | Meaning                                | If it is violated…                                             |
| ------------------- | -------------------------------------- | -------------------------------------------------------------- |
| **Confidentiality** | only those allowed can see the data    | passwords leak                                                 |
| **Integrity**       | only those allowed can change the data | someone rewrites your grades                                   |
| **Availability**    | the system is reachable when needed    | a denial-of-service (DoS) attack takes down the student portal |

Add to this **authentication** (who are you?) and **authorisation** (what may you do?): the OS first establishes that it is really you, then whether you may access a file.

## Threats and malware

| Malware                    | What does it do?                                                   |
| -------------------------- | ------------------------------------------------------------------ |
| **virus**                  | embeds itself into other programs and spreads when they run        |
| **worm**                   | spreads on its own over the network (e.g. through a vulnerability) |
| **trojan**                 | disguises itself as a useful program                               |
| **ransomware**             | encrypts your files and demands a ransom                           |
| **spyware**, **keylogger** | steals data and passwords                                          |
| **rootkit**                | hides itself (and other malware) deep down, even in the kernel     |

The most common entry point today is not technology but **people**: **phishing** tricks users out of passwords with fake e-mails and sites. The other big gate is known vulnerabilities in **unpatched** software.

## Authentication

The OS can identify you by three things:

- something you **know** – password, PIN,
- something you **have** – phone (authenticator app), security key, smart card,
- something you **are** – fingerprint, face (Windows Hello).

**Multi-factor authentication** (MFA) asks for at least two of the three – so a stolen password alone is not enough.

### How does the OS store the password?

**Never** as plain text! The system stores the password's **hash** (a fingerprint made with a one-way function), extended with a random **salt**. At login a hash is made from the typed password in the same way, and the two are compared.

```bash
sudo grep "^$USER:" /etc/shadow    # the hash: $y$… (yescrypt) – the password itself is not there
```

The password cannot be recovered from the hash, only **guessed** – that is why length matters: a 12-character password with letters, digits and symbols is practically uncrackable by guessing, a 6-character one falls within minutes. On Windows the password hashes are stored in the **SAM** database.

## The principle of least privilege

Every user and program should get **only the rights** it absolutely needs for its task. Therefore:

- do your daily work **not as administrator** (root),
- services should run with their own restricted user (e.g. `www-data`),
- a phone app should not ask for access to your contacts if it does not need it.

That way, if a program gets infected, the damage is **limited to its rights**.

## Summary

- CIA: confidentiality, integrity, availability; plus authentication and authorisation.
- Malware: virus, worm, trojan, ransomware, spyware, rootkit; the main gates are phishing and unpatched software.
- Passwords are stored as salted hashes; MFA: at least two factors.
- The principle of least privilege limits the damage.

## Lesson exercise

```quiz required
? Which element of the CIA triad is violated if a DoS attack takes down the website?
- confidentiality
- integrity
+ availability
- authentication
! The system is not reachable when needed.

? Which malware encrypts files and demands a ransom?
= ransomware
! The best protection against it is a backup following the 3-2-1 rule.

? How does a well-written OS store passwords?
- as plain text, in a hidden file
- encrypted, together with the key
+ as salted, one-way hashes
- in the BIOS
! The password cannot be recovered from the hash.

? Which Linux file holds the users' password hashes?
= /etc/shadow
! Only root can read it.

? Phone code + password: how many factors does this authentication have?
= 2
! Something you know (password) + something you have (phone).
```
