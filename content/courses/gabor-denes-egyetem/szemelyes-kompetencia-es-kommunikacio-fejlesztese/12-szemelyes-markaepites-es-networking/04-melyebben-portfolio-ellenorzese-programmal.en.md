---
title: Deeper – Checking Your Portfolio with a Program
summary: Auditing a portfolio project with a small program (README sections, leaked secrets, licence), the regularity of GitHub activity, matching CV keywords against a job ad, and the same profile through the eyes of three readers – the recruiter, the tech lead and the automated filter.
minutes: 40
---

## What you will learn in this lesson

- how to **audit** a portfolio project before you show it,
- why a **leaked password or API key** in a public repository is dangerous,
- why **regularity** matters in GitHub activity,
- how to **tailor** your CV to a job ad while staying honest.

## 1. Portfolio audit

In the basic lesson we saw what makes a good portfolio project: a clear description, installation steps, a screenshot or live demo, a licence. A small program tells you what's missing – and meanwhile looks for the most serious mistake: **secrets uploaded** to a public repository.

```python run
# Auditing a portfolio project: README sections, licence and searching for leaked secrets
import re

project = {  # file name: content (an invented repository)
    "README.md": """# Timetable Planner
A web app that builds a clash-free timetable.
## Installation
pnpm install && pnpm dev
## Usage
Pick your courses and click the Build button.
""",
    "src/config.py": 'DB_URL = "postgres://admin:Secret123@db.example.com/timetable"\nDEBUG = True\n',
    ".env": "API_KEY=sk-test-51Habc123\n",
    "src/app.py": "print('hi')\n",
}

readme = project.get("README.md", "").lower()
required = {"installation": "## installation", "usage": "## usage",
            "screenshot or demo": "![", "licence": "## licen"}
for name, marker in required.items():
    print(f"{'✓' if marker in readme else '✗'} README: {name}")
print(f"{'✓' if any(f.upper().startswith('LICENSE') for f in project) else '✗'} LICENSE file")

secret_patterns = [r"api_key\s*=", r"password\s*=", r"://[^:\s]+:[^@\s]+@", r"secret\s*="]
for file, content in project.items():
    for pattern in secret_patterns:
        if re.search(pattern, content.lower()):
            print(f"⚠ POSSIBLE SECRET: {file} (pattern: {pattern})")
if ".env" in project:
    print("⚠ the .env file is committed – add it to .gitignore!")
```

The program finds two important things:

- **The screenshot and the licence are missing.** A recruiter or tech lead spends on average only a few minutes on a project; an image or a live link shows immediately what the program does. And without a licence, legally nobody may use your code.
- **There are secrets in the code.** A database password in `config.py` and an API key in the `.env` file – in a public repository, automated bots can find and abuse these **within minutes**. And deleting isn't enough: they remain in the old commits!

What should you do if you've already committed a secret?

1. **Revoke it immediately** (new password, new API key) – this is the most important step.
2. Read secrets from **environment variables**, add the `.env` file to `.gitignore`, and provide a `.env.example` template without values.
3. Turn on the host's **secret scanning** (e.g. GitHub's secret scanning feature), which will warn you in the future.

> A security-conscious portfolio is **a reference in itself**: for a tech lead, carefully handled configuration is a better signal than one more feature.

## 2. Regularity in GitHub activity

Many students upload everything in one week at the end of the semester. Tech leads, however, prefer to see **regular, small steps**: it suggests the developer works in small, well-thought-out changes. Let's analyse two commit histories (by week of the semester):

```python run
# Weekly distribution of commits: regularity vs an end-of-semester rush
from statistics import mean, pstdev

history = {
    "Student A": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 25, 31],
    "Student B": [3, 4, 2, 5, 3, 4, 3, 2, 4, 5, 3, 4, 6, 5],
}
for name, weeks in history.items():
    active = sum(1 for w in weeks if w > 0)
    print(f"{name}: {sum(weeks)} commits in total, active weeks: {active}/{len(weeks)}, "
          f"weekly mean {mean(weeks):.1f}, std dev {pstdev(weeks):.1f}")
    print("   " + "".join("█" if w >= 10 else "▆" if w >= 4 else "▂" if w > 0 else "·" for w in weeks))
```

The two students made roughly the same number of commits, but **B** worked in 14 out of 14 weeks, with a small spread; **A** in a single rush. In an interview B's story is far more convincing: "I made progress week by week and recorded every step in a separate commit." Important: this doesn't mean collecting "green squares" with meaningless commits – the goal is **real, regular work** that the history reflects.

## 3. CV and job ad: keywords

Many companies use an **automated filter** (ATS, applicant tracking system) that compares the CV with the keywords of the ad. Let's see how well a CV matches an internship ad:

```python run
# Keyword match between the CV and the job ad
ad = {"python", "sql", "git", "rest api", "docker", "linux", "teamwork", "english"}
cv = """Developed a Python and SQL based timetable planner in a team (4 people),
version control with Git, REST API in the backend. English: B2."""

text = cv.lower()
found = {k for k in ad if k in text or (k == "teamwork" and "in a team" in text)}
print(f"match: {len(found)}/{len(ad)} = {len(found) / len(ad):.0%}")
print(f"present: {sorted(found)}")
print(f"missing: {sorted(ad - found)}")
```

Two keywords are missing: **Docker** and **Linux**. What should you do?

- If you **really** used them (e.g. you ran the project in a Docker container, developed on Linux), **add them** – concretely, in the project description.
- If you **didn't**, don't add them! It will come out in the interview anyway, and dishonesty is worse than a missing keyword. Learn it instead: a weekend mini-project with Docker is already real experience.
- Use the ad's **wording**: if it asks for "teamwork", the sentence "I worked in a 4-person team" is better than "I'm a good team player" – because it states a fact.

## 4. One profile, three readers

The same profile (CV + GitHub + LinkedIn) is viewed by three very different "readers":

| Reader                     | How much time do they spend?               | What are they looking for?                                                   | What to watch out for?                                                  |
| -------------------------- | ------------------------------------------ | ---------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| **automated filter (ATS)** | a fraction of a second                     | keywords, a simple, machine-readable structure                               | text-based PDF, standard section headings, no text embedded as images   |
| **recruiter (HR)**         | often just a few seconds on the first scan | fit for the role, understandable results, tidiness                           | the essentials in the first third; concrete numbers ("40% fewer calls") |
| **tech lead**              | minutes, if their interest is caught       | code quality, the README, the commit history, the reasoning behind decisions | 2–3 highlighted, well-documented projects; clean, secure code           |

The lesson: the profile has to work **on all three levels**. What's a keyword for the machine is a result for the recruiter, and working code one click away for the tech lead. Consistency (the same name, title and links everywhere) helps all three readers.

## Summary

- Before showing your portfolio, audit it: README sections, screenshot or demo, licence – and never a password or API key in it.
- Revoke a leaked secret immediately; deleting isn't enough, because it stays in the old commits.
- Regular work in small steps is more convincing than an end-of-semester rush.
- Tailor your CV to the ad's keywords – but only with real experience; the profile must work for the automated filter, the recruiter and the tech lead.

## Lesson exercise

```quiz required
? 6 of a job ad's 8 keywords appear in your CV. What is the match in percent? (number only)
= 75
! $6 / 8 = 75\%$.

? You accidentally committed an API key to a public repository. What's the very first thing to do?
- delete the file in a new commit
+ revoke the key immediately and generate a new one
- make the repository private in a week
- nothing, nobody will notice
! The key remains in old commits, and bots can find it within minutes – only revoking protects you.

? Where should secrets (passwords, keys) go in a project?
- in the README, so everyone sees how to set them up
- in the source code, as constants
+ in environment variables; the .env file in .gitignore, with a .env.example without values next to it
- in a public Gist
! Only the template goes into the repository, never the real value.

? Of two students' commit histories, which is more convincing to a tech lead?
- the one who uploaded everything in the last two weeks
+ the one who worked week by week, in small, well-described steps
- the one with the most commits, whatever the messages
- the one with a single big commit
! Regular small steps show a good way of working.

? The ad asks for Docker, but you've never used it. What's the right step?
- put it in the CV, the automated filter won't check anyway
+ don't put it in, but learn it (e.g. with a small project) and then list it as real experience
- never apply for the job
- hide the word in white text in the CV
! Dishonesty comes out in the interview, and it's worse than a missing keyword.
```
