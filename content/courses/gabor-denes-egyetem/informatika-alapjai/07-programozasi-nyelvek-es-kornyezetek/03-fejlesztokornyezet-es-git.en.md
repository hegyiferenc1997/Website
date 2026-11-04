---
title: Development Environment and Version Control
summary: Text editor, IDE, debugger, terminal; git basics: commit, branch, GitHub.
minutes: 18
---

## What you will learn

- the difference between a **code editor** and an **IDE**,
- what a **debugger** is for,
- what **version control** is and how to use the basic **git** commands.

## Code editor and IDE

- **Code editor** (VS Code, Sublime Text, Vim): light and fast; syntax highlighting, completion, extensions.
- **IDE** (Integrated Development Environment: PyCharm, IntelliJ IDEA, Visual Studio, Android Studio): everything in one – editor, compiler/runner, **debugger**, test runner, refactoring, project management.

**VS Code** can almost become an IDE with extensions, which is why it is the most popular today.

Typical parts of a development environment:

| Part              | What for?                                               |
| ----------------- | ------------------------------------------------------- |
| editor            | writing code, highlighting, auto-completion             |
| terminal          | running commands (e.g. `python program.py`)             |
| **debugger**      | breakpoints, step-by-step execution, watching variables |
| linter, formatter | flagging errors and style (e.g. Ruff, ESLint, Prettier) |
| AI assistant      | code suggestions, explanations (e.g. Copilot, Claude)   |

## Debugger

At a **breakpoint** the program stops and you can look at the values of variables, then step on **line by line**. Much more effective than writing `print` everywhere.

## Version control: git

A **version control system** keeps every saved state of the project: you can always look back at who changed what and why, and return to an older version. The most widespread is **git**; repositories live online e.g. on **GitHub** or **GitLab**.

Concepts:

- **repository**: the project folder with its full history,
- **commit**: a saved state with a short message (“Fix login button”),
- **branch**: a parallel line of development; a new feature is built on its own branch,
- **merge**: merging a branch into the main branch (`main`),
- **push / pull**: upload to the remote repository / download from it,
- **pull request**: a request for the team to review and merge your branch.

```bash
git init                         # new repository in the folder
git add program.py               # stage the file for saving
git commit -m "First version"    # save with a message
git log --oneline                # the history
git switch -c new-feature        # create a new branch and switch to it
git push -u origin new-feature   # upload to GitHub
```

## Summary

- Code editor: light (VS Code); IDE: everything in one (PyCharm, Visual Studio).
- Debugger: breakpoints, line-by-line execution, watching variables.
- Git: commit = saved state, branch = parallel line, merge = combining, push/pull = sync with GitHub.

## Exercise

```quiz required
? What does the abbreviation IDE stand for?
= Integrated Development Environment
! Editor, runner and debugger in one.

? What is the point called where the debugger stops the program?
= breakpoint
! There you can look at the variables' values.

? Which git command saves a new state with a message?
- git init
- git log
+ git commit -m "message"
- git switch
! A commit is a saved state in the history.

? What is git's parallel line of development called?
- commit
+ branch
- repository
- merge
! A new feature is built on its own branch, then merged.
```
