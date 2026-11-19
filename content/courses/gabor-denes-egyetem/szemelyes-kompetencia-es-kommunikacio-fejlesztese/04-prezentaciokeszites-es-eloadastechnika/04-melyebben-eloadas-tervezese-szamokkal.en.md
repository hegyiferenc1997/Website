---
title: Deeper – Planning a Talk with Numbers
summary: A time plan and word budget per section, checking how "crowded" slides are with a program, how attention changes during a talk (primacy and recency effects, an interactive break), and presenting the same project to three different audiences – with small programs and an interactive chart.
minutes: 35
---

## What you will learn in this lesson

- how to make a **time plan** and word budget for the sections of a talk,
- how to check with a program whether a slide is **too crowded**,
- how **attention** changes during a talk, and where to put the most important message,
- how to **adapt** the same content to different audiences.

## 1. Time plan and word budget

In the basic lessons we saw the three-part structure (introduction, body, conclusion). Let's put numbers on it! For a **15-minute** project presentation we leave 2 minutes of reserve for questions and overruns, and divide the rest:

```python run
# Time plan and word budget: how many minutes and words go to each section?
total_minutes = 15
reserve = 2                           # for questions, overruns
pace = 130                            # words/minute, calm pace
sections = [  # (name, share of the net time, number of slides)
    ("opening: the problem", 0.15, 1),
    ("our solution", 0.25, 2),
    ("live demo", 0.30, 1),
    ("results and lessons", 0.20, 2),
    ("closing: call to action", 0.10, 1),
]
net = total_minutes - reserve
print(f"net time: {net} minutes, total word budget: {net * pace} words\n")
for name, share, slides in sections:
    minutes = net * share
    print(f"{name:<26} {minutes:4.1f} min  ~{minutes * pace:4.0f} words  {slides} slide(s) ({minutes / slides:.1f} min/slide)")
print(f"\ntotal slides: {sum(s for _, _, s in sections)}")
```

A few lessons from the numbers:

- In 13 minutes you can say about **1700 words** – roughly 3–4 densely typed pages. If your notes are longer, you need to cut, not speak faster.
- The **demo** gets the most time, because for a software project it's the most convincing – but precisely for that reason it needs the most preparation (a backup video, preloaded data).
- On average **1–2 minutes** go to a slide. With much faster slide changes the audience can't follow; much slower, and it gets boring.

## 2. Is the slide too crowded?

The slide is your speech's **helper**: if it has a lot of text, listeners start reading and stop paying attention to you (the brain struggles to read and listen at the same time). A simple checker flags suspicious slides:

```python run
# Checking slide crowding: number of words and bullet points per slide
slides = {
    "1. The problem": ["Double bookings", "Changes recorded on paper"],
    "2. Architecture": ["Frontend: React", "Backend: Python (FastAPI)", "Database: PostgreSQL",
                        "Authentication: e-mail + password, password reset by e-mail",
                        "Notifications: e-mail and push, with scheduled jobs",
                        "Logging and error tracking", "CI/CD: GitHub Actions, with automated tests",
                        "Deployment: Docker containers on a cloud server"],
    "3. Results": ["0 double bookings in the 3-week trial", "−40% phone calls"],
}
for title, points in slides.items():
    words = sum(len(p.split()) for p in points)
    issues = []
    if len(points) > 6:
        issues.append(f"{len(points)} points (max. ~6)")
    if words > 30:
        issues.append(f"{words} words (max. ~30)")
    print(f"{title:<18} {'⚠ ' + ', '.join(issues) if issues else '✓ fine'}")
```

The architecture slide is the classic mistake: everything we know is on it, so the audience remembers nothing. A better solution is a **simple diagram** (three boxes: React → FastAPI → PostgreSQL), and say the details out loud, or put them on an **appendix** slide for questions.

> "Max. 6 points, max. 30 words" isn't a law of nature but a rule of thumb. Teaching material that will be read later can hold more text; in a live talk, though, less is almost always better.

## 3. How does attention change?

Memory research knows the **primacy** and **recency** effects: we remember best what we hear at the beginning and the end, while the middle blurs. In a talk, fatigue adds to this. The chart below is an **illustrative model** (not measured data) for a 20-minute talk; with the slider you can set where an interactive element goes (a question to the audience, a demo, a quick poll):

```plot
title: The audience's attention during a 20-minute talk (illustrative model)
x: 0, 20
y: 0, 1.2
param: b = 10, 2, 18, 0.5
f: 0.45 + 0.55*((x - 10)/10)^2 # without an interactive element
f: 0.45 + 0.55*((x - 10)/10)^2 + 0.35*exp(-((x - b)/1.5)^2) # with an interactive element at minute b
```

What do we learn from this?

- The **most important message** belongs at the beginning (opening) and the end (closing) – and it's worth repeating it in the closing.
- An **interactive element** lifts the "valley" in the middle: if you set the slider to 9–11 minutes, that's where the gain is greatest. That's why a demo in the middle of the talk works well.
- Attention needs a "restart" roughly every 10 minutes: for a longer talk, plan several such points.

## 4. One project, three audiences

You present the same timetable planner app to three kinds of audience. The content is the same, the **emphasis** and the **language** differ:

| Audience                               | What do they want to know?                                 | What to highlight?                                            | What to leave out?                  |
| -------------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------- | ----------------------------------- |
| **technical jury** (developers)        | How does it work? Are the technical decisions sound?       | architecture, the clash-detection algorithm, testing          | marketing talk, generalities        |
| **investor / business decision-maker** | Is it worth it? Whose problem does it solve, at what cost? | the size of the problem, number of users, cost, return        | technology details (React, FastAPI) |
| **fellow students** (users)            | What do I gain? Is it easy to use?                         | live demo, time saved, "here's how you build it in 2 minutes" | architecture, business model        |

The most common mistake is that the developer gives **everyone the technical-jury version**, because that's their own viewpoint. Before the talk ask yourself: "What is the **one sentence** this audience takes home?" – and select from the content accordingly.

## Summary

- Calculate the word budget: net time × pace (e.g. 13 minutes × 130 words/minute ≈ 1700 words); leave a reserve.
- On average 1–2 minutes go to a slide; break a crowded slide (many points, many words) into a diagram and spoken explanation.
- Attention is highest at the beginning and the end; put the main message there, and liven up the middle with an interactive element.
- Present the same project with a different emphasis for each audience: what is the one sentence they take home?

## Lesson exercise

```quiz required
? You give a 15-minute talk at 130 words per minute, with no reserve. How many words fit in?
= 1950
! $15 \cdot 130 = 1950$ words.

? For a 20-minute talk you plan 1.5 minutes per slide on average. How many slides should there be (rounded down to a whole number)?
= 13
! $20 / 1.5 \approx 13.3$, so 13 slides.

? A slide has 8 points and 60 words in total. What's the best fix?
- a smaller font so everything fits
+ a simple diagram of the essentials, with details spoken or on an appendix slide
- speak faster so there's time to read it
- read out the slide's full text
! Listeners either read or listen to you – break up the crowded slide.

? Where is it worth putting the talk's most important message?
- only in the middle, because by then everyone is paying attention
+ at the beginning and the end (repeated in the closing)
- on an appendix slide
- nowhere, it'll come across anyway
! Primacy and recency effects: we remember the beginning and the end best.

? What is worth highlighting in a presentation for investors?
- the version of the frontend framework
+ the size of the problem, the users, the cost and the expected return
- the structure of the database tables
- the coding conventions
! Investors want to know whether it's worth it.
```
