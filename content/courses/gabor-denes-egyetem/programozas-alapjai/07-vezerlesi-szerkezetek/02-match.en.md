---
title: Multi-way Branching – switch and match
summary: The switch-case known from other languages, and Python 3.10's match statement with pattern matching.
minutes: 12
---

## What you will learn

- how the **switch** statement works in C, Java and C#,
- how to write the same in Python with the **match** statement,
- when match is better and when if-elif is.

## switch in other languages

In many languages **switch** chooses a branch based on a variable's value:

```java
// Java
switch (day) {
    case 6:
    case 7:
        System.out.println("weekend");
        break;          // without break the next branch would run too ("fall-through")
    default:
        System.out.println("weekday");
}
```

> In C and Java forgetting `break` is a classic bug: execution "falls through" to the next `case`.

## match in Python (3.10+)

Since version 3.10 Python offers the `match` statement. There is no fall-through and no `break` needed.

```python run
def day_name(number):
    match number:
        case 1:
            return "Monday"
        case 2:
            return "Tuesday"
        case 3:
            return "Wednesday"
        case 4:
            return "Thursday"
        case 5:
            return "Friday"
        case 6 | 7:              # several values: with |
            return "weekend"
        case _:                  # the default branch
            return "invalid day"

for n in [1, 6, 9]:
    print(n, day_name(n))
```

## A condition in the branch (guard)

```python run
def rate(score):
    match score:
        case s if s >= 89:
            return "excellent"
        case s if s >= 50:
            return "passed"
        case _:
            return "failed"

print(rate(92), rate(60), rate(10))
```

## Pattern matching on structures

`match` can do more: it examines the **structure** too and unpacks data into variables.

```python run
def command(instruction):
    match instruction.split():
        case ["forward", steps]:
            return f"Forward {steps} steps."
        case ["turn", ("left" | "right") as direction]:
            return f"Turning {direction}."
        case ["stop"]:
            return "Stopping."
        case _:
            return "Unknown command."

for c in ["forward 3", "turn left", "stop", "jump"]:
    print(c, "→", command(c))
```

## With older Python: a dictionary

Before 3.10 (and still today for simple mappings) a dictionary is a good alternative:

```python run
DAYS = {1: "Monday", 2: "Tuesday", 3: "Wednesday", 4: "Thursday", 5: "Friday", 6: "Saturday", 7: "Sunday"}
print(DAYS.get(3, "invalid"))
print(DAYS.get(9, "invalid"))
```

## Which one when?

| Situation                                     | Recommended             |
| --------------------------------------------- | ----------------------- |
| comparing one value with many specific values | `match` or a dictionary |
| ranges, complex conditions                    | `if-elif-else`          |
| deciding by the shape of a data structure     | `match`                 |

## Summary

- **switch** (C, Java, C#) chooses a branch by value; beware of `break`.
- In Python **match-case** (3.10+) is the equivalent; `|` for several values, `_` for the default, `if` for a guard.
- For simple mappings a **dictionary** works well too.

## Lesson exercise: Robot commands with pattern matching

Write an `interpret(command)` function that interprets a text robot command with the `match` statement. Split the command on spaces (`split()`) and match patterns against the resulting list:

| Command         | Result                              |
| --------------- | ----------------------------------- |
| `"forward 3"`   | `("move", 3)` – the number as an int |
| `"turn left"`   | `("turn", "left")`                  |
| `"turn right"`  | `("turn", "right")`                 |
| `"stop"`        | `("stop", None)`                    |
| anything else   | `("unknown", command)`              |

```python starter required
def interpret(command):
    match command.split():
        case ["stop"]:
            return ("stop", None)
        # more cases: ["forward", steps], ["turn", "left"], ...
        case _:
            return ("unknown", command)


print(interpret("forward 3"))   # ('move', 3)
```

<details>
<summary>Solution</summary>

```python solution
def interpret(command):
    match command.split():
        case ["stop"]:
            return ("stop", None)
        case ["forward", steps] if steps.isdigit():
            return ("move", int(steps))
        case ["turn", ("left" | "right") as side]:
            return ("turn", side)
        case _:
            return ("unknown", command)


print(interpret("forward 3"))   # ('move', 3)
```

</details>

```python test
assert interpret("forward 3") == ("move", 3), "\"forward 3\" → (\"move\", 3) – the number must be an int!"
assert interpret("forward 12") == ("move", 12), "\"forward 12\" → (\"move\", 12)"
assert interpret("turn left") == ("turn", "left"), "\"turn left\" → (\"turn\", \"left\")"
assert interpret("turn right") == ("turn", "right"), "\"turn right\" → (\"turn\", \"right\")"
assert interpret("stop") == ("stop", None), "\"stop\" → (\"stop\", None)"
assert interpret("jump") == ("unknown", "jump"), "An unknown command."
assert interpret("forward lots") == ("unknown", "forward lots"), "If forward is not followed by a number, it is unknown."
```
