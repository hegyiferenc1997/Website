---
title: Deeper – The Operating System up Close
summary: How the OS shares the processor (first come, first served versus round-robin scheduling, with a simulation), why running several programs at once is better (CPU utilisation), how it resolves paths, and what 755 and 644 permissions mean – with small programs and an interactive chart.
minutes: 45
---

## What you will learn in this lesson

- how the operating system **shares** the processor among several programs,
- why the computer is **faster** with several programs running at once (and up to what point),
- how the OS turns a **relative** path into an absolute one,
- how to read and compute Linux **permissions** (e.g. `755`).

## 1. Who gets the processor? Scheduling

A processor core does one thing at a time, yet music plays, the browser runs and your code compiles all at once. The OS **scheduler** decides who gets the processor when. Two simple strategies:

- **first come, first served** (FCFS): whoever came first runs to completion first,
- **round robin**: everyone gets a small time slice (e.g. 2 ms), then goes to the back of the queue.

```python run
# Scheduling simulation: first come, first served vs. round robin (everyone arrives at time 0)
from collections import deque

tasks = [("compile", 12), ("music", 2), ("typing", 1), ("download", 5)]   # (name, CPU need in ms)

def fcfs(tasks):
    time, done = 0, {}
    for name, need in tasks:
        time += need
        done[name] = time                          # when it finished
    return done

def round_robin(tasks, slice_ms):
    queue = deque(tasks)
    time, done = 0, {}
    while queue:
        name, left = queue.popleft()
        run = min(slice_ms, left)
        time += run
        if left > run:
            queue.append((name, left - run))       # not finished: to the back of the queue
        else:
            done[name] = time
    return done

for title, done in [("first come, first", fcfs(tasks)), ("round robin, 2 ms", round_robin(tasks, 2))]:
    avg = sum(done.values()) / len(done)
    print(f"{title:<18} finish times: {done}  average: {avg:.2f} ms")
```

With first come, first served, the short "typing" task has to wait for the long compile – the user feels the computer **stuttering**. With round robin, short tasks finish quickly and the computer stays **responsive**. The price: the long compile finishes a little later, and every switch (context switch) costs a little time too. Real systems (Windows, Linux) are smarter than this: they also use **priorities**, and favour whatever interacts with the user.

## 2. Why is it good to run several programs at once?

A program spends much of its time **waiting**: for the disk, the network, the keyboard. If only one program ran, the processor would sit idle then. If a program waits a fraction $p$ of its time, with $n$ programs the chance that **all** of them are waiting at once is $p^n$ – so processor utilisation is about $1 - p^n$:

```plot
title: CPU utilisation (%) as a function of the number of programs running in parallel
x: 1, 10
y: 0, 100
param: p = 0.8, 0.1, 0.95, 0.05
f: 100*(1 - p^x) # utilisation if a program waits a fraction p of its time
```

If a program waits 80% of its time ($p = 0.8$), with a single program the processor only works 20% of the time, with five about 67%. But the curve **flattens**: above ten you gain hardly anything – meanwhile every program takes memory, and when RAM runs out the OS starts paging to disk, which slows everything down. That's why endless browser tabs don't help.

## 3. Paths: how does the OS understand `..`?

In the basic lesson we saw absolute and relative paths. The OS always interprets a relative path relative to the **current folder**: `.` is the current folder, `..` the parent folder. Let's write a small "resolver":

```python run
# Resolving a relative path to an absolute one (with Linux-style paths)
def resolve(current, relative):
    if relative.startswith("/"):
        parts = []                                 # absolute path: start from the root
    else:
        parts = [p for p in current.split("/") if p]
    for p in relative.split("/"):
        if p in ("", "."):
            continue                               # "." = stay
        if p == "..":
            if parts:
                parts.pop()                        # ".." = one level up
        else:
            parts.append(p)
    return "/" + "/".join(parts)

here = "/home/anna/uni/infobasics"
for path in ["notes.txt", "../maths/exercises.pdf", "./images/../chart.png", "../../../../../etc", "/tmp/x"]:
    print(f"{path:<24} → {resolve(here, path)}")

# Python's built-in solution
import posixpath
print(posixpath.normpath(posixpath.join(here, "../maths/exercises.pdf")))
```

The `../../../../../etc` line also shows a **security** viewpoint: you can't "step out" of the root, but a badly written web server that appends a user-supplied file name to a folder without checking can hand out any file on the server via `../` sequences (this is the **path traversal** attack). That's why you must always check the resolved, absolute path.

## 4. Permissions: what does 755 mean?

On Linux every file has three permission triples: the **owner's**, the **group's** and **everyone else's**. Each has `r` (read, 4), `w` (write, 2), `x` (execute, 1). The sum of the three gives one digit, so `rwxr-xr-x` becomes `755`:

```python run
# Permissions: rwx text ↔ octal number
def octal(perms):
    value = {"r": 4, "w": 2, "x": 1, "-": 0}
    return "".join(str(sum(value[c] for c in perms[i:i + 3])) for i in (0, 3, 6))

def text(octal_str):
    return "".join(("r" if int(d) & 4 else "-") + ("w" if int(d) & 2 else "-") + ("x" if int(d) & 1 else "-") for d in octal_str)

for p in ["rwxr-xr-x", "rw-r--r--", "rw-------", "rwxrwxrwx"]:
    print(f"{p} → {octal(p)}")
print("640 →", text("640"))
```

| Permission | Meaning                                  | Typical use                                 |
| ---------- | ---------------------------------------- | ------------------------------------------- |
| `755`      | owner everything, others read + execute  | programs, scripts, folders                  |
| `644`      | owner reads and writes, others only read | website files, documents                    |
| `600`      | only the owner can read and write        | SSH key, a config file containing passwords |
| `777`      | everyone everything                      | **avoid**: anyone can modify or replace it  |

According to the "principle of least privilege", everyone should get only as many rights as their task needs. A security viewpoint and a convenience viewpoint clash here: `777` "solves" the permission error, but it also opens a door to every other user and process.

## Summary

- The scheduler shares the processor; round robin favours short, interactive tasks, while first come, first served is simpler but can cause stuttering.
- Several programs at once use the processor better ($\approx 1 - p^n$), but the gain flattens out and memory sets a limit.
- The OS resolves a relative path against the current folder; always check a user-supplied path after resolving it.
- Permissions are sums of r = 4, w = 2, x = 1 (e.g. 755, 644, 600); avoid 777.

## Lesson exercise

```quiz required
? Three tasks arrive at once, with CPU needs of 6, 2 and 1 ms, in this order. With first come, first served, when does the 2 ms task finish (ms)?
= 8
! The 6 ms one runs first, then the 2 ms one: $6 + 2 = 8$.

? A program waits 50% of its time. What is the CPU utilisation in percent with 3 such programs in parallel? (as a decimal)
= 87,5
= 87.5
! $1 - 0.5^3 = 0.875$.

? The current folder is `/home/anna/uni`. Where does the relative path `../downloads/a.zip` point?
+ `/home/anna/downloads/a.zip`
- `/home/anna/uni/downloads/a.zip`
- `/downloads/a.zip`
- `/home/downloads/a.zip`
! `..` steps one level up: `/home/anna`.

? What is the octal form of the permission `rw-r-----`?
= 640
! $4+2 = 6$, $4$, $0$.

? Which permission suits an SSH private key?
- `777`
- `755`
- `644`
+ `600`
! Only the owner can read and write it.
```
