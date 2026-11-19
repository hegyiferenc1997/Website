---
title: Practice – Types of Operating Systems
summary: Review questions, a classification task and a summary worksheet.
minutes: 45
kind: practice
---

## Classification task

Classify the following systems (desktop / server / mobile / embedded / real-time; open / closed):

1. your phone's OS,
2. the servers of the university's student portal,
3. your home Wi-Fi router,
4. a car's anti-lock braking system (ABS),
5. your lab machine's Ubuntu,
6. a smartwatch.

<details>
<summary>Suggested solution</summary>

1. mobile – Android (open base, Linux kernel) or iOS (closed);
2. server – typically Linux or Windows Server;
3. embedded – often embedded Linux (e.g. OpenWrt-based);
4. embedded, hard real-time RTOS;
5. desktop, open source, multi-user;
6. embedded/mobile – Wear OS (Linux-based) or watchOS (XNU); simpler ones run an RTOS.

</details>

## Review questions

<details>
<summary>1. Why does the vast majority of the cloud and supercomputers run on Linux?</summary>

Because it is free (no per-machine licence fee across thousands of machines), open source (adaptable to the hardware and the task), stable, easy to automate, and runs on a great many architectures.

</details>

<details>
<summary>2. Why is a fast but unpredictable OS not enough for an airbag?</summary>

Because for a hard real-time task what counts is not the average but the worst-case response time. If the signal is late even once (e.g. because of a background task), it leads to disaster.

</details>

<details>
<summary>3. From the user's point of view, what is the difference between a network and a distributed system?</summary>

In a network system the user knows and specifies which machine's resource they use (e.g. the address of a shared folder). A distributed system hides the machine boundaries and looks like a single unit.

</details>

## Summary worksheet

```quiz required
? Which Linux distribution belongs to the Red Hat family?
- Ubuntu
- Linux Mint
+ Fedora
- Manjaro
! Its package manager: dnf (.rpm).

? Which kernel does iOS use?
= XNU
! The same as macOS.

? In which year did the first version of Windows NT appear?
= 1993
! Windows NT 3.1.

? Which licence allows you to build the code into a closed product without releasing source code?
- GPL
+ MIT
- neither
- AGPL
! MIT and BSD are permissive licences.

? What does "free" mean in "free software"?
+ freedom (to run, study, modify, distribute)
- mandatory zero price
- ad-supported distribution
- a limited trial version
! "Free as in freedom, not as in free beer."

? Which operating system runs on every machine of the TOP500 supercomputer list?
= Linux
! On all 500 machines since 2017.
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **Schedulable with Rate Monotonic?** Tasks are `(C, T)` pairs. Write the `rm_guaranteed(tasks)` function: true if the utilisation (Σ C/T) is at most n · (2^(1/n) − 1), i.e. by the Liu–Layland bound every deadline is guaranteed!

```python starter
def rm_guaranteed(tasks):
    return True
```

<details>
<summary>Solution</summary>

```python solution
def rm_guaranteed(tasks):
    n = len(tasks)
    U = sum(C / T for C, T in tasks)
    return U <= n * (2 ** (1 / n) - 1)
```

</details>

```python test
assert rm_guaranteed([(1, 4), (2, 8), (1, 10)]) is True      # U = 60%
assert rm_guaranteed([(2, 5), (4, 7)]) is False              # U ≈ 97%
assert rm_guaranteed([(1, 2)]) is True                       # one task: fine up to 100%
assert rm_guaranteed([(1, 3), (1, 3), (1, 3)]) is False      # U = 100%
print("All checks passed!")
```

**2.** **How long does the battery last?** Write the `lifetime_days(capacity_mah, active_share, i_active_ma, i_sleep_ma)` function: the average current is the average weighted by the time shares; the lifetime in hours is capacity / average current. Return it in days, rounded to a whole number!

```python starter
def lifetime_days(capacity_mah, active_share, i_active_ma, i_sleep_ma):
    return 0
```

<details>
<summary>Solution</summary>

```python solution
def lifetime_days(capacity_mah, active_share, i_active_ma, i_sleep_ma):
    avg = active_share * i_active_ma + (1 - active_share) * i_sleep_ma
    return round(capacity_mah / avg / 24)
```

</details>

```python test
assert lifetime_days(220, 1.0, 5.0, 0.0) == 2
assert lifetime_days(220, 0.01, 5.0, 0.002) == 176
assert lifetime_days(3000, 0.05, 200, 1) == 11
print("All checks passed!")
```

**3.** **Whom does Android kill?** Apps are `(name, MB, score)` triples. Write the `kill(apps, free, needed)` function: while there isn't enough free memory, it always kills the app with the **highest score** (least important). Return the names of the killed apps in order! An app with score 0 (foreground) can never be killed.

```python starter
def kill(apps, free, needed):
    return []
```

<details>
<summary>Solution</summary>

```python solution
def kill(apps, free, needed):
    killed = []
    for name, mb, score in sorted(apps, key=lambda a: -a[2]):
        if free >= needed or score == 0:
            break
        free += mb
        killed.append(name)
    return killed
```

</details>

```python test
apps = [("Maps", 450, 0), ("Music", 120, 200), ("Browser", 600, 900), ("Game", 900, 950)]
assert kill(apps, 200, 1000) == ["Game"]
assert kill(apps, 200, 1700) == ["Game", "Browser"]
assert kill(apps, 1000, 500) == []
assert kill(apps, 0, 5000) == ["Game", "Browser", "Music"]
print("All checks passed!")
```

### Quick check questions

```quiz
? Which is an example of a hard real-time system?
+ a car's airbag controller
- a video player
- an online game
! Missing the deadline is a catastrophe – not just a drop in quality.

? Which mobile operating system is built on the Linux kernel?
+ Android
- iOS
- Windows 11
! iOS is built on the XNU kernel shared with macOS.

? What is an embedded system?
+ a computer built into a larger device for a single task (e.g. the controller of a washing machine, router or smartwatch)
- a virtual machine
- a server farm
! It often runs an RTOS (e.g. FreeRTOS, Zephyr) or a small Linux.

? What is the difference between an open-source and a closed-source OS?
+ with open source anyone can view, modify and (under the licence) distribute the source code
- closed source is always free
- open source can't run at companies
! Linux: GPLv2; Windows: closed.

? Which scheduling is optimal on one core if utilisation is at most 100%?
- Rate Monotonic
+ EDF
- FCFS
! Earliest Deadline First.
```
