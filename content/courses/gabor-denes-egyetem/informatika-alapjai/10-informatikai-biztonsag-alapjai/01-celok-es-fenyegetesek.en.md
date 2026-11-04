---
title: Goals and Threats
summary: The CIA triad, types of malware, ransomware, phishing and social engineering.
minutes: 16
---

## What you will learn

- the three goals of IT security (the **CIA triad**),
- what kinds of **malware** exist and what **ransomware** does,
- how to recognise **phishing** and **social engineering**.

## The CIA triad

| Goal                | Meaning                                     | Violation, example                          |
| ------------------- | ------------------------------------------- | ------------------------------------------- |
| **Confidentiality** | only those with rights can access it        | a leaked password database                  |
| **Integrity**       | nobody has modified the data without rights | a changed bank account number in a transfer |
| **Availability**    | data and services are reachable when needed | a denial-of-service (DDoS) attack           |

## Malware

| Type           | What does it do?                                                    |
| -------------- | ------------------------------------------------------------------- |
| **virus**      | spreads attached to other programs when they are run                |
| **worm**       | spreads on its own over the network, without human action           |
| **trojan**     | disguises itself as a useful program but hides a harmful part       |
| **spyware**    | secretly watches: keystrokes, passwords, browsing                   |
| **ransomware** | encrypts the files and demands a ransom for the key                 |
| **botnet**     | a network of infected machines, remotely controlled by the attacker |

**Ransomware** is one of the biggest dangers for companies today: hospitals and factories can be shut down by it. The best defence against it is a **good backup** (see the third lesson).

## Phishing

A **phishing** e-mail or message pretends to be a trusted party (bank, courier, university, Microsoft) and tricks you into clicking a link and entering your password or card details.

Telltale signs:

- **urgency** or threats: “Your account will be locked within 24 hours!”,
- the **sender address** or the link's **domain** is odd (`neptun-gde.login-secure.xyz`),
- generic greeting, spelling mistakes (though AI-written mails can be flawless),
- an unexpected attachment (`invoice.zip`, `.exe`, an Office file with macros).

**Rule:** don't click the link in the mail; type the well-known address yourself, or call the company on its official number.

## Social engineering

**Social engineering** (psychological manipulation) attacks the person, not the machine: the attacker phones “from IT” and asks for your password, or walks through the entry gate behind an employee. The attacker relies on helpfulness, authority and haste. A system administrator **never** asks for your password.

## Summary

- CIA: confidentiality, integrity, availability.
- Malware: virus, worm, trojan, spyware, ransomware, botnet.
- Phishing: urgency, suspicious links, unexpected attachments; social engineering attacks the person.

## Exercise

```quiz required
? Which element of the CIA triad does a denial-of-service (DDoS) attack violate when it makes a website unreachable?
- confidentiality
- integrity
+ availability
! Availability.

? Which malware **encrypts** files and demands a ransom?
- worm
- spyware
+ ransomware
- trojan
! Ransomware.

? Which malware spreads **on its own** over the network, without human action?
= worm
! A virus needs an infected program to be started.

? What is the safest response to a “confirm your bank details immediately” e-mail?
- log in via the link in the mail
- reply to the mail with your password
+ type the bank's address yourself or call its official number
- forward it to your friends
! The link may lead to a fake site.
```
