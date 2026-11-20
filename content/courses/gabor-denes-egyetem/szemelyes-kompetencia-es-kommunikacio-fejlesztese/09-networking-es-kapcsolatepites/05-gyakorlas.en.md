---
title: Practice – Networking and Relationship Building
summary: Review questions and a summary worksheet on the value of a network, making contact and maintaining relationships; writing your own elevator pitch.
minutes: 50
kind: practice
---

## Review questions

<details>
<summary>1. Why is an acquaintance sometimes more valuable than a close friend when job hunting?</summary>

Because your close friends know roughly what you know, while your acquaintances move in other circles, so they hear about opportunities you don't (Granovetter: the strength of weak ties).

</details>

<details>
<summary>2. Write your own elevator pitch!</summary>

Four parts: who you are (name, programme, year), what you're doing now (a concrete project or study), what interests you (the field you came for), and a question to the other person. Say it out loud and time it: it should be about 30 seconds.

</details>

<details>
<summary>3. How do you exit a conversation gracefully at an event?</summary>

Thank them for the conversation, say you'd like to stay in touch (e.g. on LinkedIn), and say where you're heading next, or introduce them to a third person.

</details>

<details>
<summary>4. What can you give a professional contact as a first-year student?</summary>

A useful article or tool; feedback on a project; an introduction to someone; congratulations; help in an open-source project; showing a new technology (reverse mentoring).

</details>

## Summary worksheet

> You are at a Python meetup. One of the speakers, Anna Toth, leads a company's data team.

```quiz required
? You go up to her after the talk. Which is the best opener?
- "Would you hire me as an intern?"
+ "I really liked what you said about type annotations. How long have you been using them at your company?"
- "How much do data engineers earn at your company?"
- silently hand her your CV
! It builds on the talk, with an open question.

? The conversation goes well. What should the next step be?
- stay by her side all evening
+ thank her and ask whether you could look her up on LinkedIn
- ask for her phone number
- ask for a job interview immediately
! A polite close + staying in touch.

? When and how should you send her a LinkedIn invitation?
- a week later, without a message
+ within 48 hours, with a personal message referring to the meetup
- immediately, during the talk
- never
! Follow up while you both remember.

? Later Anna mentions that they're looking for a good data visualisation library. You know one. What should you do?
+ send her the link in a short message
- say nothing, it's not your business
- only tell her if you get a job in return
- write a public post about it and tag her
! Give and take: give too.

? At most how many people can you talk to at the meetup if you spend 3 hours there and talk to everyone for 20 minutes on average, without breaks?
= 9
! 180 minutes / 20 minutes = 9.
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **Introduction chain.** The `graph` dictionary maps each person to a list of their acquaintances. Write the function `chain(graph, start, goal)`, which uses breadth-first search to give the shortest path (as a list of people), or `None` if there's no path!

```python starter
def chain(graph, start, goal):
    return [start, goal]
```

<details>
<summary>Solution</summary>

```python solution
from collections import deque

def chain(graph, start, goal):
    prev = {start: None}
    queue = deque([start])
    while queue:
        now = queue.popleft()
        if now == goal:                      # trace the path back
            path = []
            while now is not None:
                path.append(now)
                now = prev[now]
            return path[::-1]
        for n in graph[now]:
            if n not in prev:
                prev[n] = now
                queue.append(n)
    return None
```

</details>

```python test
g = {"You": ["Adam", "Bori"], "Adam": ["You", "Dora"], "Bori": ["You"], "Dora": ["Adam", "Eszter"], "Eszter": ["Dora"], "Zoli": []}
assert chain(g, "You", "Eszter") == ["You", "Adam", "Dora", "Eszter"]
assert chain(g, "You", "Bori") == ["You", "Bori"]
assert chain(g, "You", "Zoli") is None
print("All checks passed!")
```

**2.** **Second-degree connections.** Write the function `second_degree(graph, who)`, which returns in alphabetical order the people `who` reaches through a shared acquaintance, but who aren't direct acquaintances (and not `who` themselves)!

```python starter
def second_degree(graph, who):
    return sorted(b for a in graph[who] for b in graph[a])
```

<details>
<summary>Solution</summary>

```python solution
def second_degree(graph, who):
    direct = set(graph[who])
    two_steps = {b for a in direct for b in graph[a]}    # friends of friends
    return sorted(two_steps - direct - {who})
```

</details>

```python test
g = {"You": ["Adam", "Bori"], "Adam": ["You", "Dora", "Bori"], "Bori": ["You", "Adam", "Greg"], "Dora": ["Adam"], "Greg": ["Bori"]}
assert second_degree(g, "You") == ["Dora", "Greg"]
assert second_degree(g, "Dora") == ["Bori", "You"]
print("All checks passed!")
```

**3.** **Time budget for keeping in touch.** Write the function `monthly_minutes(layers)`, which computes the total monthly time in minutes from a list of `(number of people, contacts per month, minutes per contact)` triples (rounded to a whole number)!

```python starter
def monthly_minutes(layers):
    return round(sum(n * mins for n, _, mins in layers))
```

<details>
<summary>Solution</summary>

```python solution
def monthly_minutes(layers):
    return round(sum(n * freq * mins for n, freq, mins in layers))   # people × frequency × time
```

</details>

```python test
assert monthly_minutes([(5, 4, 60), (10, 1, 30)]) == 1500
assert monthly_minutes([(100, 1 / 12, 5)]) == 42
assert monthly_minutes([]) == 0
print("All checks passed!")
```

### Quick check questions

```quiz
? What is the strength of weak ties (Granovetter)?
+ more distant acquaintances often bring new information (e.g. job opportunities), because they move in other circles
- it's better to cut weak ties
- only close friends help
- the number of connections doesn't matter
! Our close friends mostly know the same things we do.

? Roughly how many people make up the circle of lasting, meaningful relationships according to Dunbar's number?
= 150
! Dunbar's layers: about 5, 15, 50, 150.

? What is an elevator pitch?
- a long professional talk
+ a 30–60-second concise introduction: who you are, what you do, what you're looking for
- the rules for using a lift
- a written CV
! Short, memorable, and invites a follow-up conversation.

? What is the "give and take" principle in networking?
- only contact someone when you need something
+ give value (help, an introduction, useful information) before you ask
- every favour must be repaid immediately
- it's only worth keeping in touch with people in higher positions
! Reciprocity builds trust in the long run.
```
