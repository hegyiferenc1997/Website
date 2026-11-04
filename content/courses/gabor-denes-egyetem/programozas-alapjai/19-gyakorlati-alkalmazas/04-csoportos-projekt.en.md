---
title: The Group Project – Organisation and Documentation
summary: Roles, splitting tasks, working together with Git, and project documentation (specification, README, developer and user guides, test report).
minutes: 20
---

## What you will learn

- how to organise a **group programming project** from idea to presentation,
- how to work **together on the same code** (Git),
- what **documentation** to produce and what goes into it – in a good project **the documentation matters too**!

## Project phases

| Phase             | What to do                                    | Result                              |
| ----------------- | --------------------------------------------- | ----------------------------------- |
| 1. Idea and goals | pick a topic, decide what the program will do | a one-paragraph project description |
| 2. Specification  | requirements, inputs–outputs, constraints     | requirements specification          |
| 3. Design         | modules, data structures, task assignment     | design + task list                  |
| 4. Implementation | coding in small steps, regular check-ins      | a working program                   |
| 5. Testing        | unit tests, trying it out, bug fixing         | test report                         |
| 6. Documentation  | README, developer and user documentation      | finished documentation              |
| 7. Presentation   | short demo, who did what                      | presentation                        |

> **Don't leave documentation to the end**: the specification and the design are done at the start, and the rest is written alongside development.

## Roles and splitting tasks

In a small team everyone codes, but it's worth assigning responsibilities:

- **Project lead:** deadlines, meetings, keeping the task list.
- **Developers:** each responsible for a module (e.g. data handling, logic, user interface).
- **Test lead:** organises the tests and the test report.
- **Documentation lead:** keeps the documentation consistent (everyone writes the content for their own part).

Split the work into **small, unambiguous** tasks ("write `read_csv()` with tests", not "data handling"). A simple table or a Kanban board (e.g. GitHub Projects, Trello: _To do – In progress – Done_) helps a lot.

Fix **the boundaries between modules** in advance: which functions there will be, with which parameters and return values. Then everyone can work in parallel.

## Working together with Git

**Git** is a version control system: it stores every change, lets you go back to earlier states, and lets several people work on the same code. **GitHub** (or GitLab) is the shared repository in the cloud.

```bash
git clone https://github.com/team/project.git     # download the shared repository
git checkout -b reading                            # your own branch for the task
# ... work ...
git add .                                          # stage the changes
git commit -m "CSV reading and its tests"          # save with a message
git push -u origin reading                         # upload
# On GitHub: Pull Request → the others review → merge into the main branch
git checkout main && git pull                      # the latest shared state
```

Rules that save you headaches:

- **Small, frequent commits** with meaningful messages.
- Only **reviewed** code goes onto `main`.
- Always `git pull` before you start – that way **merge conflicts** happen less often. If one does happen, agree on which version stays.
- Shared **coding rules**: PEP 8, consistent names, one language for identifiers (Hungarian or English – but not mixed).

## The parts of the documentation

| Document                       | Audience                          | Contents                                                                                      |
| ------------------------------ | --------------------------------- | --------------------------------------------------------------------------------------------- |
| **Requirements specification** | client, team                      | what the program does: features, inputs–outputs, constraints, acceptance criteria             |
| **README.md**                  | anyone who opens the repository   | short description, installation, running, example, authors                                    |
| **Developer documentation**    | whoever develops the code further | structure (modules), data structures, key algorithms, function descriptions (from docstrings) |
| **User documentation**         | whoever uses the program          | step-by-step guide, screenshots, what error messages mean                                     |
| **Test report**                | team, instructor                  | test cases: input, expected and actual result, pass/fail                                      |
| **Project log**                | team, instructor                  | who did what and when; short summaries of meetings                                            |

### README template

```text
# Project name

One or two sentences about what the program does and for whom.

## Features
- ...

## Installation
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt

## Usage
python main.py data.csv
(with sample output)

## Structure
- main.py – entry point, menu
- data.py – reading and saving
- logic.py – calculations
- tests/ – unit tests

## Authors
- Name 1 – data handling, tests
- Name 2 – logic, documentation
```

### Sample test report

| #   | Test case                | Input         | Expected result     | Actual result       | Pass      |
| --- | ------------------------ | ------------- | ------------------- | ------------------- | --------- |
| 1   | average with normal data | `[4, 5, 3]`   | `4.0`               | `4.0`               | ✔         |
| 2   | average of an empty list | `[]`          | `0.0`, no error     | `ZeroDivisionError` | ✘ → fixed |
| 3   | missing file             | `missing.csv` | clear error message | "File not found"    | ✔         |

### Developer documentation from docstrings

If every function has a good docstring, part of the developer documentation can be generated **automatically** (that's what tools like `pydoc`, Sphinx or MkDocs are for). A short program shows the idea:

```python run
import inspect

def read(filename: str) -> list[dict]:
    """Read the CSV file and return a list of dictionaries, one per row."""

def average(numbers: list[float]) -> float:
    """The average of the numbers; 0.0 for an empty list."""

def report(data: list[dict]) -> str:
    """A text summary for the user."""

# Build a simple API description (Markdown) from the module's functions.
print("## Functions\n")
for name, function in [("read", read), ("average", average), ("report", report)]:
    print(f"- `{name}{inspect.signature(function)}` – {inspect.getdoc(function)}")
```

## Project ideas

- **Grade tracker:** courses, grades, weighted average, statistics, saving to a file.
- **Quiz game:** questions from a JSON file, score, leaderboard.
- **Expense tracker:** expenses by category, monthly summary, CSV export.
- **Robot simulator:** grid map from a file, commands, path finding (topic 18).
- **Library system:** books, loans, due dates, late fees.
- **Text analysis tool:** mini project 2 extended with a command-line interface.

## What makes a good team project?

- the program **works** and meets the specification,
- **code quality**: readable, well structured, commented, PEP 8,
- **tests** exist and pass,
- **documentation**: complete, clear, polished,
- **teamwork**: an even division of work (Git history, project log),
- **presentation**: clear, and everyone can answer questions about their own part.

## Summary

- Specification and design **at the start**, documentation **continuously**.
- Small, unambiguous tasks, fixed module boundaries, a Kanban board.
- Git: your own branch, small commits, Pull Request, review.
- The parts of the documentation: **specification, README, developer and user documentation, test report, project log**.

## Lesson exercise: Commit message checker

Your team agreed on a format for commit messages (a simplified version of the popular _Conventional Commits_ standard). Write a `commit_errors(message)` function that returns the **codes** of the broken rules in a list, in the order below (an empty list for a valid message):

1. `"format"`: the first line is not of the form `type: description` or `type(scope): description`, where `type` is one of `feat`, `fix`, `docs`, `test`, `refactor`, `chore`, the scope consists of lowercase letters and hyphens, and the colon is followed by **exactly one** space and a non-empty description,
2. `"length"`: the first line is longer than 72 characters,
3. `"period"`: the first line ends with a period,
4. `"blank_line"`: in a multi-line message the second line is not empty.

Tip: a regular expression is the easiest way to check the format, e.g. `re.fullmatch(...)`.

```python starter required
def commit_errors(message):
    errors = []
    first = message.splitlines()[0]
    if ":" not in first:
        errors.append("format")
    return errors


print(commit_errors("feat(reader): CSV reading and its tests"))
print(commit_errors("fixed some stuff."))
```

<details>
<summary>Solution</summary>

```python solution
import re

# type, optional (scope), colon, one space, non-empty description
PATTERN = re.compile(r"(feat|fix|docs|test|refactor|chore)(\([a-z-]+\))?: \S.*")


def commit_errors(message):
    lines = message.splitlines() or [""]
    first = lines[0]
    errors = []
    if not PATTERN.fullmatch(first):
        errors.append("format")
    if len(first) > 72:
        errors.append("length")
    if first.endswith("."):
        errors.append("period")
    if len(lines) > 1 and lines[1].strip():
        errors.append("blank_line")
    return errors


print(commit_errors("feat(reader): CSV reading and its tests"))
print(commit_errors("fixed some stuff."))
```

</details>

```python test
assert commit_errors("feat(reader): CSV reading and its tests") == [], "A valid message with a scope."
assert commit_errors("fix: division by zero in the average") == [], "A valid message without a scope."
assert commit_errors("docs: README\n\nAdded installation steps.") == [], "Multi-line with an empty second line: valid."
assert commit_errors("fixed some stuff.") == ["format", "period"], "Wrong format and a trailing period."
assert commit_errors("feature: new menu") == ["format"], "Only the allowed types are valid."
assert commit_errors("fix:missing space") == ["format"] and commit_errors("fix:  two spaces") == ["format"], "Exactly one space must follow the colon."
assert commit_errors("fix(Menu): capital scope") == ["format"] and commit_errors("fix: ") == ["format"], "The scope is lowercase and the description is not empty."
assert commit_errors("feat: " + "x" * 70) == ["length"], "A first line longer than 72 characters."
assert commit_errors("feat: " + "x" * 66) == [], "Exactly 72 characters is still fine."
assert commit_errors("test: new tests\nDetails here.") == ["blank_line"], "The second line must be empty."
assert commit_errors("") == ["format"], "An empty message is a format error."
```
