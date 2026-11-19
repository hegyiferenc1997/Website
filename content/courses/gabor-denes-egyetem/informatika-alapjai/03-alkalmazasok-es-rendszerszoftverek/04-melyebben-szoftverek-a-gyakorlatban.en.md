---
title: Deeper – Software in Practice
summary: Comparing semantic versions with a program, dependencies and update risk, license compatibility in a project, verifying a downloaded installer with a checksum, and the total cost of ownership (one-time, subscription, open source) – with small programs and an interactive chart.
minutes: 45
---

## What you will learn in this lesson

- how to read and **compare** version numbers, and what they tell you about an update,
- why every **dependency** is a risk, and how to put a number on it,
- how to decide whether the licenses used in your project are **compatible**,
- how to **verify** a downloaded installer, and how to compare software by **cost**.

## 1. Semantic versioning: what does the version number tell you?

In the basic lesson we saw the `major.minor.patch` form (e.g. `3.14.1`). According to the rules of **semantic versioning** (SemVer):

- the **patch** number goes up if only bugs were fixed (update without worry),
- the **minor** number goes up if a new feature arrived, but old usage keeps working,
- the **major** number goes up if there's a **backward-incompatible** change – read the changelog before updating!

A common trap: version numbers **can't be compared as text**. As text, `"3.9"` is greater than `"3.14"`, because the character `9` is greater than `1`:

```python run
# Comparing version numbers: wrong as text, right as numbers
def version(v):
    return tuple(int(x) for x in v.split("."))   # "3.14.1" → (3, 14, 1)

print("as text:   ", "3.9" < "3.14")             # False – yet 3.14 is newer
print("as numbers:", version("3.9") < version("3.14"))

def update_type(old, new):
    o, n = version(old), version(new)
    if n[0] > o[0]:
        return "MAJOR – may be incompatible, read the changelog!"
    if n[1] > o[1]:
        return "minor – new feature, compatible"
    return "patch – bug fix, update without worry"

for old, new in [("2.4.1", "2.4.2"), ("2.4.2", "2.5.0"), ("2.5.0", "3.0.0")]:
    print(f"{old} → {new}: {update_type(old, new)}")

print(sorted(["1.10.0", "1.2.0", "1.9.3"], key=version))   # correct order
```

## 2. Dependencies: every package is a small risk

A modern web project often rests on **hundreds** of packages, because your direct dependencies have dependencies too. Even if the chance that a security bug is found in one package within a year is small, with many packages it's almost certain:

```python run
# Dependency risk: the chance that at least one package is affected
for packages in [1, 10, 50, 200, 800]:
    p = 0.01                                     # assumption: 1% chance per package per year
    at_least_one = 1 - (1 - p) ** packages
    print(f"{packages:>4} packages: {at_least_one:7.2%} chance that a bug is found in at least one this year")
```

That's why updating must be a **regular** task, not a one-off. In practice these help:

- **locked versions** (a lock file, e.g. `pnpm-lock.yaml`): everyone installs exactly the same version,
- **automatic alerts** (e.g. GitHub Dependabot) about known vulnerabilities,
- and **minimalism**: don't install a package for a three-line function.

## 3. License compatibility

In the basic lesson you met **permissive** (MIT, BSD, Apache) and **copyleft** (GPL) licenses. The practical question: if you build a package into your own closed-source product, are you allowed to? A simplified rule (not legal advice!): you can include permissively licensed code if you keep the copyright notice; you can't build GPL code into a **distributed** closed product, because then you'd have to release the whole product under the GPL.

```python run
# License check with a (simplified) rule table – not legal advice!
RULE = {
    "MIT": "ok (the copyright notice must be kept)",
    "BSD-3-Clause": "ok (the notice must be kept)",
    "Apache-2.0": "ok (notice + patent terms)",
    "LGPL-3.0": "careful: usable as a separate, replaceable library",
    "GPL-3.0": "PROBLEM: can't be built into a closed, distributed product",
}

dependencies = {"requests": "Apache-2.0", "flask": "BSD-3-Clause", "pyqt-sample": "GPL-3.0", "dateutil": "Apache-2.0", "tqdm": "MIT"}
for package, license in dependencies.items():
    print(f"{package:<12} {license:<13} → {RULE.get(license, 'unknown license: check by hand!')}")
```

Two important viewpoints: for an **internal** (not distributed) tool the GPL usually causes no trouble, but for an application you **sell**, it does. If you're unsure, ask someone who knows – at a company, the legal department.

## 4. Verifying a downloaded installer

How do you know the installer you downloaded wasn't swapped or corrupted on the way? Serious projects publish the file's **checksum** (e.g. a SHA-256 hash). It's a "fingerprint": if even a single bit of the file changes, it's completely different:

```python run
# Checksum (SHA-256): a single byte difference gives a completely different fingerprint
import hashlib

original = b"installer contents, version 1.0"
modified = b"installer contents, version 1.O"   # one character differs
print(hashlib.sha256(original).hexdigest())
print(hashlib.sha256(modified).hexdigest())

published = hashlib.sha256(original).hexdigest()  # you see this on the developer's site
downloaded = original                            # this is what you downloaded
print("matches:", hashlib.sha256(downloaded).hexdigest() == published)
```

On Windows you can compute it with `Get-FileHash file.exe` (PowerShell), on Linux with `sha256sum file`. A checksum is only worth something if it comes from an **official, secure (HTTPS) place** – that's why you should install with a package manager or from the vendor's site, not from "free download sites".

## 5. What does it really cost? Total cost of ownership

A piece of software's price isn't just the purchase price: **training**, **maintenance** and **annual fees** count too. A small office (10 computers) weighs three options:

```plot
title: Total cost (thousand Ft) over the years, for 10 computers
x: 0, 8
y: 0, 2500
param: s = 30, 10, 60, 5
f: 1500 + 100*x # one-time license + annual support
f: s*10*x # subscription: s thousand Ft/computer/year
f: 600 + 50*x # open source: training + operation
```

On the chart the subscription (30 thousand Ft per computer per year by default) is the cheapest at first, but over the years it catches up with the one-time license; with the slider you can try how this changes with pricing. The **open-source** solution isn't free either: training and operation cost money (and time) – but there's no license fee, and you don't depend on one vendor.

| Viewpoint             | What matters to them?                                   | Typical decision                              |
| --------------------- | ------------------------------------------------------- | --------------------------------------------- |
| **user**              | easy use, a familiar interface, price                   | a free or subscription-based, well-known app  |
| **developer**         | license, number of dependencies, updates, documentation | open-source, permissively licensed libraries  |
| **company / IT lead** | total cost, support, security, vendor lock-in           | contracted support, central update management |

## Summary

- In a semantic version, an increase in the major number signals an incompatible change; compare versions as numbers (tuples), not as text.
- With many dependencies it's almost certain that a bug will be found in one of them – so updating is a regular task (lock file, automatic alerts).
- Permissively licensed code can go into a closed product, GPL code can't go into a distributed closed product.
- You can verify a downloaded installer with a checksum; when deciding, look at the total cost of ownership, not just the purchase price.

## Lesson exercise

```quiz required
? A library is updated from 4.2.7 to 5.0.0. What does this mean under semantic versioning?
- only bugs were fixed
- a new, compatible feature arrived
+ there may be a backward-incompatible change, read the changelog before updating
- the version number has no meaning
! An increase in the major number signals an incompatible change.

? Which version is the newest: 1.9.3, 1.10.0 or 1.2.0?
= 1.10.0
! As numbers: $(1, 10, 0) > (1, 9, 3) > (1, 2, 0)$.

? A project relies on 100 packages, each with a 1% yearly chance of a bug being found. Roughly what percentage is the chance that a bug is found in at least one this year? (whole number)
= 63
! $1 - 0.99^{100} \approx 0.634$.

? A library under which license can you NOT freely build into a closed-source desktop app you sell?
- MIT
- BSD
- Apache-2.0
+ GPL-3.0
! The GPL is copyleft: the whole product would have to be released under the GPL.

? What is an installer's SHA-256 checksum for?
- it makes installation faster
+ you can check that the downloaded file matches the released one bit for bit
- it encrypts the file
- it contains the license key
! A single bit of difference gives a completely different fingerprint.
```
