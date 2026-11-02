---
title: The Steps of Problem Solving
summary: From understanding the task to a tested, documented program – on a worked example (weighted grade average).
minutes: 18
---

## What you will learn

- the **steps** for solving a programming task,
- how to break a task into **smaller parts**,
- how to proceed in **small, tested steps**.

## The six steps

1. **Understand:** what is the input, what is the output, what are the rules and the edge cases?
2. **Plan:** split into subtasks, choose data structures, design the algorithm (pseudocode).
3. **Implement:** code the subtasks one by one, organised into functions.
4. **Test:** check every function, including the edge cases.
5. **Fix and refine:** debugging, refactoring.
6. **Document:** docstrings, README, user guide.

These steps don't follow each other strictly: while testing you often find that you misunderstood something and have to go back.

## Worked example: weighted grade average

**Task:** write a program that, from a student's courses (name, credits, grade), computes

- the **weighted grade average** (Σ credits · grade / Σ credits),
- the **completed credits** (where the grade is at least 2),
- and prints the courses in descending order of grade.

### 1. Understand – questions to ask

- What form does the data come in? → A list for now, from a file later.
- What counts towards the average? → Every enrolled course, including a fail (1).
- What is the edge case? → An empty list (no courses) – there must be no division by zero!
- What is invalid data? → The grade must be between 1 and 5, credits a positive integer.

### 2. Plan – subtasks

| Subtask           | Function                     | Input → output                         |
| ----------------- | ---------------------------- | -------------------------------------- |
| validate data     | `validate(course)`           | course → `ValueError` on error         |
| weighted average  | `weighted_average(courses)`  | list → `float` (0.0 for an empty list) |
| completed credits | `completed_credits(courses)` | list → `int`                           |
| sorted list       | `ranking(courses)`           | list → new, sorted list                |

**Data structure:** a course is a `dataclass` (name, credits, grade) – more readable than a tuple.

### 3–4. Implement and test step by step

We try out every function **right after** writing it with an `assert` or two:

```python run
from dataclasses import dataclass

@dataclass
class Course:
    """An enrolled course."""
    name: str
    credits: int
    grade: int

def validate(course: Course) -> None:
    """Raise ValueError if the course's data is invalid."""
    if not 1 <= course.grade <= 5:
        raise ValueError(f"Invalid grade: {course.grade} ({course.name})")
    if course.credits <= 0:
        raise ValueError(f"Invalid credits: {course.credits} ({course.name})")

def weighted_average(courses: list[Course]) -> float:
    """Credit-weighted average to two decimals; 0.0 for an empty list."""
    total_credits = sum(c.credits for c in courses)
    if total_credits == 0:
        return 0.0
    return round(sum(c.credits * c.grade for c in courses) / total_credits, 2)

def completed_credits(courses: list[Course]) -> int:
    """Sum of credits of courses with at least a pass (2)."""
    return sum(c.credits for c in courses if c.grade >= 2)

def ranking(courses: list[Course]) -> list[Course]:
    """Descending by grade; for equal grades, by name."""
    return sorted(courses, key=lambda c: (-c.grade, c.name))

# --- quick tests right after writing ---
sample = [Course("Programming Basics", 8, 5), Course("Mathematics I", 6, 3), Course("Physics", 4, 1)]
assert weighted_average(sample) == 3.44        # (40 + 18 + 4) / 18
assert weighted_average([]) == 0.0             # edge case
assert completed_credits(sample) == 14
assert [c.name for c in ranking(sample)] == ["Programming Basics", "Mathematics I", "Physics"]
try:
    validate(Course("Broken", 5, 7))
    assert False
except ValueError as e:
    print("Caught error:", e)

# --- the main program ---
for c in sample:
    validate(c)
print(f"Weighted average: {weighted_average(sample)}")
print(f"Completed credits: {completed_credits(sample)}")
for c in ranking(sample):
    print(f"  {c.grade}  {c.name} ({c.credits} cr)")
```

### 5. Refine

The program works – now the extensions can come, **one at a time, with tests**: reading data from a file (topic 13), unit tests with `unittest` (topic 14), a menu for the user.

### 6. Document

Every function has a docstring. A finished project also needs a README: what the program does, how to run it, what the input format is (see topic 15 and the lesson on the group project).

## Common beginner mistakes

- **Starting to code immediately** without understanding and a plan.
- **Writing everything at once** and running it only at the end – then the bug is hard to find.
- **Forgetting the edge cases** (empty list, zero, negative number, missing file).
- **One huge function** instead of many small, well-named ones.

## Summary

- Understand → plan → implement → test → refine → document.
- Break the task into **small functions** and test each one immediately.
- Think about **edge cases** and **invalid data**.

## Lesson exercise: Credit index and adjusted credit index

Solve it following the six steps! At Hungarian universities scholarships are often awarded by the **credit index**:

- **credit index** = Σ(credits · grade) over the **passed** courses (grade ≥ 2), divided by **30**,
- **adjusted credit index** = credit index · passed credits / enrolled credits.

Write a `credit_indices(courses)` function where `courses` is a list of `(name, credits, grade)` triples. The result is the `(credit_index, adjusted)` pair, both rounded to 2 decimals.

- For an empty list the result is `(0.0, 0.0)` – without dividing by zero!
- For invalid data (the grade is not an integer between 1 and 5, or the credits are not a positive integer) raise `ValueError`.

```python starter required
def credit_indices(courses):
    total = sum(credits * grade for name, credits, grade in courses)
    return (total / 30, total / 30)


COURSES = [("Programming basics", 6, 5), ("Mathematics", 5, 3), ("Physics", 4, 1)]
print(credit_indices(COURSES))
```

<details>
<summary>Solution</summary>

```python solution
def validate(course):
    """Raise ValueError for invalid data."""
    name, credits, grade = course
    if not isinstance(grade, int) or not 1 <= grade <= 5:
        raise ValueError(f"{name}: the grade must be an integer between 1 and 5.")
    if not isinstance(credits, int) or credits <= 0:
        raise ValueError(f"{name}: the credits must be a positive integer.")


def credit_indices(courses):
    for course in courses:
        validate(course)
    enrolled = sum(credits for _, credits, _ in courses)
    if enrolled == 0:
        return (0.0, 0.0)
    # Only passed courses (grade 2 or better) count
    passed = [(credits, grade) for _, credits, grade in courses if grade >= 2]
    ci = sum(credits * grade for credits, grade in passed) / 30
    passed_credits = sum(credits for credits, _ in passed)
    aci = ci * passed_credits / enrolled
    return (round(ci, 2), round(aci, 2))


COURSES = [("Programming basics", 6, 5), ("Mathematics", 5, 3), ("Physics", 4, 1)]
print(credit_indices(COURSES))
```

</details>

```python test
COURSES = [("Programming basics", 6, 5), ("Mathematics", 5, 3), ("Physics", 4, 1)]
assert credit_indices(COURSES) == (1.5, 1.1), "A failed course doesn't count in the credit index (45 / 30 = 1.5), but it does in the enrolled credits (1.5 · 11 / 15 = 1.1)."
assert credit_indices([("A", 30, 5)]) == (5.0, 5.0), "30 credits with all fives: 5.0 and 5.0."
assert credit_indices([("A", 4, 1), ("B", 2, 1)]) == (0.0, 0.0), "All failed: 0.0 and 0.0."
assert credit_indices([]) == (0.0, 0.0), "For an empty list (0.0, 0.0), without dividing by zero."
assert credit_indices([("A", 5, 4), ("B", 3, 3)]) == (0.97, 0.97), "Round to 2 decimals."
for bad in ([("A", 5, 6)], [("A", 5, 0)], [("A", 0, 3)], [("A", -2, 3)], [("A", 5, 4.5)]):
    try:
        credit_indices(bad)
        assert False, f"Invalid data ({bad}) should raise ValueError."
    except ValueError:
        pass
```
