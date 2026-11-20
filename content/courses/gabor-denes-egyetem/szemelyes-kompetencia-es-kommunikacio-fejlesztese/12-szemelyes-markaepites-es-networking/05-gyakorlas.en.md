---
title: Practice – Personal Branding
summary: Review questions and a summary worksheet on personal branding, portfolios and LinkedIn; your own value proposition and a profile check.
minutes: 55
kind: practice
---

## Review questions

<details>
<summary>1. Phrase your own value proposition!</summary>

Use the template: "I help [whom] [achieve what] by [how / what I'm strong at]." As a student you can also write: "I'm a [programme] student interested in [field]; I'm currently working on [project]." Make it specific and authentic, and update it as you grow.

</details>

<details>
<summary>2. Make a checklist for your GitHub profile!</summary>

Profile photo and name, short bio, profile README, 4–6 pinned repos, a README in every repo (what it does, how to start it, a screenshot), licence, meaningful commit messages, `.gitignore`, no secrets anywhere (passwords, keys, `.env`).

</details>

<details>
<summary>3. Search for your name in a private browser window. What do you see, and what would you change?</summary>

Look at what appears on the first page: professional profiles or old private content? Adjust the privacy of old profiles, update the professional ones, and think about what you'd like a recruiter to see first.

</details>

<details>
<summary>4. Why is a finished small project better than an abandoned big one?</summary>

Because it shows you can see something through: planning, implementation, testing, documentation, release. An abandoned project doesn't show whether it works, and may suggest you don't finish what you start.

</details>

## Summary worksheet

> First-year student Ben Kiss is looking for an internship. This is what you find about him online.

```quiz required
? Ben's LinkedIn headline: "Student". What would you suggest?
- leave it, it's enough
+ include his programme, his field of interest and that he's looking for an internship
- write "senior developer"
- delete the profile
! A telling, authentic headline.

? His GitHub has 12 repos, all without READMEs, most half-finished. What is the best first step?
- delete them all
+ choose the best 2–3, finish them, write READMEs and pin them
- create 10 more repos
- make the whole profile private and leave it out of his CV
! Few, but finished and presentable.

? In a team project Ben built the user interface. What should he write in his portfolio?
- that he built the whole app
+ that in a four-person team he was responsible for the user interface, and what he achieved with it
- nothing, because it was teamwork
- the others' names and mistakes
! Exactly his own part.

? An offensive public comment he wrote 4 years ago appears on the first page of Google. What should he do?
- nothing
+ delete or hide it if he can, and post consciously from now on
- write more like it
- change his name
! A digital footprint can be managed, but prevention is best.

? Ben wants to highlight his 8 most important skills on LinkedIn and ask for 2 endorsements for each. How many endorsements is he asking for in total?
= 16
! 8 · 2 = 16.
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **Keyword match.** Write the function `match(keywords, cv)`, which gives what percentage of the keywords appear (lowercased, as substrings) in the CV, rounded to a whole number!

```python starter
def match(keywords, cv):
    return round(100 * sum(1 for k in keywords if k in cv) / len(keywords))
```

<details>
<summary>Solution</summary>

```python solution
def match(keywords, cv):
    text = cv.lower()                                   # case shouldn't matter
    hits = sum(1 for k in keywords if k.lower() in text)
    return round(100 * hits / len(keywords))
```

</details>

```python test
k = ["python", "sql", "git", "docker"]
assert match(k, "Python and SQL project, version control with Git.") == 75
assert match(["Linux"], "developed on linux") == 100
assert match(k, "Java") == 0
print("All checks passed!")
```

**2.** **Secret finder.** Write the function `secrets(files)`, which from a `{file name: content}` dictionary returns in alphabetical order the names of the files whose content (lowercased) contains the pattern `api_key=`, `password=` or `secret=` (there may be spaces before the equals sign), **or** whose name is exactly `.env`!

```python starter
def secrets(files):
    return sorted(f for f, c in files.items() if "password=" in c)
```

<details>
<summary>Solution</summary>

```python solution
import re

PATTERN = re.compile(r"(api_key|password|secret)\s*=")

def secrets(files):
    found = [f for f, c in files.items() if f == ".env" or PATTERN.search(c.lower())]
    return sorted(found)
```

</details>

```python test
f = {"README.md": "# Project", ".env": "DEBUG=1", "config.py": "API_KEY = 'abc'", "app.py": "print(1)", "db.py": "Password='x'"}
assert secrets(f) == [".env", "config.py", "db.py"]
assert secrets({"main.py": "x = 1"}) == []
print("All checks passed!")
```

**3.** **Consistency.** Write the function `activity(weeks)`, which from a list of weekly commit counts returns the `(number of active weeks, longest consecutive active streak)` pair (a week is active if it had at least 1 commit)!

```python starter
def activity(weeks):
    active = sum(1 for w in weeks if w > 0)
    return (active, active)
```

<details>
<summary>Solution</summary>

```python solution
def activity(weeks):
    active = sum(1 for w in weeks if w > 0)
    longest = now = 0
    for w in weeks:
        now = now + 1 if w > 0 else 0          # the streak grows, or restarts
        longest = max(longest, now)
    return (active, longest)
```

</details>

```python test
assert activity([0, 0, 2, 25, 31]) == (3, 3)
assert activity([3, 0, 2, 5, 0, 1]) == (4, 2)
assert activity([0, 0]) == (0, 0)
print("All checks passed!")
```

### Quick check questions

```quiz
? What is the value proposition of a personal brand?
+ a short sentence about whom you can give value to, in what, and how
- the number of LinkedIn connections
- the profile picture
- listing as many technologies as possible
! E.g. "I'm a junior backend developer who solves real problems with Python and databases."

? 7 of a job ad's 10 keywords appear in your CV. What percentage is the match?
= 70
! $7/10 = 70\%$.

? What should you do if you accidentally pushed a password to a public repository?
- delete it in a new commit, and you're done
+ change (invalidate) it immediately, and read secrets from environment variables from then on
- make the repository private in a month
- nothing
! The password remains in the old commits.

? What is the "show, don't tell" principle in a portfolio?
- writing as many adjectives about yourself as possible
+ proving things with working projects, code and results instead of claims
- listing only your degree
- writing a long motivation letter
! A working demo says more than "I'm creative".
```
