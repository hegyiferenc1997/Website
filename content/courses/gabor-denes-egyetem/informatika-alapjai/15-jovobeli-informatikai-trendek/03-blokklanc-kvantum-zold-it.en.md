---
title: Blockchain, Quantum Computing, Green IT
summary: How blockchain works and its enterprise use, quantum computers and quantum-safe encryption, sustainable IT.
minutes: 16
---

## What you will learn

- how **blockchain** works and what it is good for in companies,
- what a **quantum computer** is and why **quantum-safe encryption** is needed,
- what **green (sustainable) IT** means.

## Blockchain

A **blockchain** is a **distributed ledger**: many computers (nodes) keep a copy of the same data. Data goes into **blocks**, and every block contains the **hash** of the previous block – so if someone changes an old block, the hash of every following block breaks, and the fraud is revealed immediately.

```python run
# A tiny blockchain: every block also contains the previous hash
import hashlib

def hash_(text):
    return hashlib.sha256(text.encode()).hexdigest()[:12]

chain = []
prev = "0" * 12
for data in ["Anna → Béla: 5", "Béla → Cili: 2", "Cili → Anna: 1"]:
    h = hash_(prev + data)
    chain.append({"data": data, "prev": prev, "hash": h})
    prev = h

for block in chain:
    print(block)

# Forgery: rewrite the first block's data and check the chain
chain[0]["data"] = "Anna → Béla: 500"
valid = all(hash_(b["prev"] + b["data"]) == b["hash"] for b in chain)
print("Is the chain valid?", valid)
```

Uses: cryptocurrencies (Bitcoin), **smart contracts** (contracts that execute automatically), supply chain tracking (where goods come from), verifying digital certificates and diplomas. Drawback: slower and more expensive than a traditional database – it only pays off where participants **don't trust each other** and there is no central party.

## Quantum computers

A classical bit is 0 or 1. A **quantum bit (qubit)**, thanks to **superposition**, can be a mix of both at once, and several qubits can be **entangled**. For certain tasks (simulating molecules, optimisation, some mathematical problems) this can bring an enormous speed-up. Today's machines are still experimental: they work with few, noisy qubits and are reached through the cloud (IBM, Google, Amazon, Microsoft).

**Security consequence:** a large enough quantum computer would **break most of today's public-key encryption** (RSA, elliptic curves). That is why the US standards institute (NIST) published the first **quantum-safe** (post-quantum) encryption standards in 2024, and browsers and operating systems have already partly switched to them. Companies should assess now where they use vulnerable encryption – encrypted data stolen today can be decrypted later (“harvest now, decrypt later”).

## Green IT

IT is a significant energy consumer: **data centres** (especially for training and running AI models) need more and more electricity and cooling water, and electronic waste is growing quickly.

What can a company – and an engineer – do?

- **efficient code** and architecture: what is faster uses less energy,
- in the cloud, resources **sized** to the load, switching off idle machines,
- choosing a data centre region powered by **renewable energy**,
- **using devices longer**, repairing and recycling them,
- watching the **PUE** metric (a data centre's total energy use / the IT equipment's use; the ideal value is 1).

## Summary

- Blockchain: a distributed ledger, blocks chained by hashes; useful where there is no central trust.
- Quantum computer: qubits, superposition; threatens RSA → quantum-safe encryption (NIST, 2024).
- Green IT: efficient code, right-sized cloud, renewable energy, longer device use, PUE.

## Exercise

```quiz required
? What does every block in a blockchain contain that exposes forging an old block?
+ the hash of the previous block
- the user's password
- an image
- the server's IP address
! Every later hash in the chain breaks.

? What does the last line of the lesson's blockchain example print after the forgery?
- Is the chain valid? True
+ Is the chain valid? False
! The first block's hash no longer matches its data.

? What is the basic unit of a quantum computer called?
= qubit
= quantum bit
! It can be in superposition.

? What is the ideal PUE value for a data centre?
= 1
! Then all energy goes to IT equipment, none to cooling and losses.
```
