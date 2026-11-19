---
title: Deeper – Your Network as a Graph
summary: Your network as a graph – who can introduce you to whom (breadth-first search), how many people you reach in two steps, why "bridges" between two groups are valuable (weak ties in numbers), how much time maintaining relationships takes, and how a relationship "cools down" – with small programs and an interactive chart.
minutes: 40
---

## What you will learn in this lesson

- how a network can be described as a **graph**, and how to find the shortest **chain of introductions**,
- how many people you reach through **second-degree** connections,
- why the **bridges** connecting groups are especially valuable,
- how much **time** maintaining relationships takes, and when it's worth getting in touch.

## 1. Who can introduce you? The shortest path in the graph

A network is a **graph**: the nodes are people, the edges are acquaintances. You'd like an internship at a company where Eszter works – but you don't know Eszter. Who can introduce you? **Breadth-first search** (BFS) finds the shortest chain: first it looks at your direct acquaintances, then theirs, and so on.

```python run
# Network as a graph: shortest chain of introductions with breadth-first search
from collections import deque

acquaintances = {
    "You": ["Ádám", "Bori", "Csaba"],
    "Ádám": ["You", "Dóra"],
    "Bori": ["You", "Csaba", "Gergő"],
    "Csaba": ["You", "Bori"],
    "Dóra": ["Ádám", "Eszter", "Feri"],
    "Gergő": ["Bori", "Feri"],
    "Feri": ["Dóra", "Gergő", "Eszter"],
    "Eszter": ["Dóra", "Feri"],
}

def chain(start, goal):
    previous = {start: None}
    queue = deque([start])
    while queue:
        now = queue.popleft()
        if now == goal:                         # trace the path back
            path = []
            while now:
                path.append(now)
                now = previous[now]
            return path[::-1]
        for neighbour in acquaintances[now]:
            if neighbour not in previous:
                previous[neighbour] = now
                queue.append(neighbour)
    return None

print(" → ".join(chain("You", "Eszter")))
second = {b for a in acquaintances["You"] for b in acquaintances[a]} - set(acquaintances["You"]) - {"You"}
print(f"direct acquaintances: {len(acquaintances['You'])}, second-degree: {sorted(second)}")
```

According to the program, Ádám introduces you to Dóra, who introduces you to Eszter. In practice: you ask Ádám whether they know anyone at the company; Ádám contacts Dóra, who – since an acquaintance is asking – is happy to forward a short introduction. Such a **referred** contact is far more likely to get an answer than a cold message.

**Second-degree connections:** if you have 100 acquaintances and each of them has another 100, in principle you reach 10,000 people in two steps. In reality fewer, because your acquaintances also know each other (**overlap**) – but it's still several thousand people. LinkedIn's "2nd-degree connection" label shows exactly this.

## 2. Bridges: the strength of weak ties in numbers

In the basic lesson we saw Granovetter's observation: we often hear about new jobs through **weak ties** (acquaintances, former classmates), not close friends. Why? Because our close friends know **the same things** we do – we move in the same group. A weak tie, however, is often a **bridge** to another group.

We can even measure this: between two circles of friends (a university group and a meetup crowd) a single person, Lili, is the link. Let's count how many shortest paths go through them!

```python run
# Bridge role: how many shortest paths between pairs pass through a given person? (simplified betweenness)
from collections import deque
from itertools import combinations

network = {
    "Anna": ["Bence", "Cili", "Lili"], "Bence": ["Anna", "Cili"], "Cili": ["Anna", "Bence"],
    "Lili": ["Anna", "Máté"],                                   # Lili is the bridge
    "Máté": ["Lili", "Nóra", "Olivér"], "Nóra": ["Máté", "Olivér"], "Olivér": ["Máté", "Nóra"],
}

def path(a, b):
    previous, queue = {a: None}, deque([a])
    while queue:
        x = queue.popleft()
        for y in network[x]:
            if y not in previous:
                previous[y] = x
                queue.append(y)
    steps, x = [], b
    while x:
        steps.append(x)
        x = previous[x]
    return steps[::-1]

through = {person: 0 for person in network}
for a, b in combinations(network, 2):
    for middle in path(a, b)[1:-1]:                  # the two endpoints don't count
        through[middle] += 1
for person, count in sorted(through.items(), key=lambda t: -t[1]):
    print(f"{person:<7} {count:>2} shortest paths pass through")
```

Lili (and the two groups' "gateways", Anna and Máté) sit on a lot of paths, even though Lili has only **two** acquaintances. Bence, Cili, Nóra and Olivér sit on none. That's the bridge role: whoever stands between two groups lies in the path of the flow of **information** and **opportunities** – they hear first about the other group's job openings and projects. The lesson for you:

- Don't build connections only within your own course group: a **meetup**, a **hackathon**, an **open-source project** or students from another programme take you into new groups.
- You can be a bridge yourself: if two of your acquaintances could be useful to each other, **introduce them** – one of the most valuable forms of "give and take".

## 3. How much time does maintaining relationships take?

In the basic lesson we saw Dunbar's layers: we can maintain about **5** close, **15** good, **50** friendly and **150** stable, meaningful relationships at once. Let's work out a simple time budget: how much time per month if you contact people in each layer with a different frequency and duration?

```python run
# Time budget for maintaining relationships: people per layer, how often, minutes per contact
layers = [  # (layer, number of people, contacts per month, minutes/contact)
    ("close", 5, 4, 60),
    ("good acquaintance", 10, 1, 30),
    ("professional contact", 35, 0.25, 15),   # a message or coffee every quarter
    ("wider circle", 100, 1 / 12, 5),         # a short message once a year
]
total = 0
for name, count, freq, minutes in layers:
    monthly = count * freq * minutes
    total += monthly
    print(f"{name:<21} {count:>3} people → {monthly:5.0f} min/month")
print(f"total: {total / 60:.1f} hours/month, about {total / 60 / 4.3:.1f} hours/week")
```

Maintaining the wider circle (100 people) costs barely **42 minutes** a month if you write them a short, personal message once a year (congratulating them on a new job, sharing an article that reminded you of them). Close relationships, however, take the most time – and that's fine.

## 4. When to get in touch? A relationship "cooling down"

Without contact a relationship gradually **cools down**: after a while it feels awkward to approach someone you haven't spoken to in years – especially if you're asking for help. In a simple illustrative model the "warmth" of a relationship decreases exponentially, with a characteristic time of $T$ months:

```plot
title: The "warmth" of a relationship without contact (illustrative model)
x: 0, 36
y: 0, 1
param: T = 12, 2, 36, 1
f: exp(-x/T) # warmth after x months
dash: 0.5 # half cooled down
```

If $T = 12$ months, the warmth halves in about **8 months** ($T \cdot \ln 2$). The lesson: **get in touch when you don't need anything yet** – a short congratulation or a "thought of you, saw this article" message restores the relationship, and if you ask for help later, it won't be awkward.

> The model only illustrates: a deep friendship can survive years of silence, while a one-off conference acquaintance is forgotten within weeks. The value of $T$ depends on the strength of the relationship.

## Summary

- A network is a graph; the shortest chain of introductions can be found with breadth-first search, and a referred contact is far more effective than a cold one.
- The number of second-degree connections is roughly the square of the direct ones (overlap reduces it).
- Many shortest paths pass through the bridges connecting groups: they hear first about new opportunities – join new groups, and introduce your acquaintances to each other.
- Maintaining wider connections takes little time; get in touch when you don't need anything yet.

## Lesson exercise

```quiz required
? In the lesson's first graph, in how many steps (along how many edges) do you reach Eszter on the shortest path?
= 3
! You → Ádám → Dóra → Eszter: 3 edges.

? You have 5 direct acquaintances, each with another 4 acquaintances (besides you), and there's no overlap. How many second-degree connections do you have?
= 20
! $5 \cdot 4 = 20$.

? Why is a "bridge" between two groups valuable?
- because they have the most acquaintances
+ because many shortest paths pass through them, so the other group's information and opportunities reach others through them
- because they're the group's leader
- because they're the most active on social media
! Lili had only two acquaintances, yet the most paths went through them.

? According to the lesson's time budget, how many minutes per month does maintaining the 100-person wider circle take, with one 5-minute message per year? (rounded to a whole number)
= 42
! $100 \cdot \frac{1}{12} \cdot 5 \approx 41.7 \approx 42$ minutes.

? When is the best time to contact an old acquaintance?
- only when you need help
+ when you don't need anything yet, with a short, personal message
- never, because it's awkward
- only before the holidays, with a template message
! That way asking for help later won't be awkward either.
```
