---
title: Build Systems and Code Optimisation
summary: Why compilation is automated (make, Maven, Gradle, pip), and how the compiler and the programmer speed things up.
minutes: 15
---

## What you will learn

- what the **build** process is and what **build systems** are for,
- which **optimisations** the compiler performs automatically,
- how you can write more efficient code yourself – and when not to optimise.

## What is a build?

A real program consists of many source files, external libraries and resources (images, configuration). The **build** is the process that turns these into an executable or installable product:

1. downloading dependencies (libraries),
2. compiling the source files,
3. linking, packaging,
4. running tests,
5. producing the final package (e.g. `.exe`, `.jar`, installer, Python wheel).

Doing this by hand after every change is slow and error-prone, so we use **build systems**.

| Tool             | Language / area         | Description file                     |
| ---------------- | ----------------------- | ------------------------------------ |
| Make             | C, C++ (classic)        | `Makefile`                           |
| CMake            | C, C++ (cross-platform) | `CMakeLists.txt`                     |
| Maven, Gradle    | Java, Kotlin            | `pom.xml`, `build.gradle`            |
| MSBuild / dotnet | C#                      | `.csproj`                            |
| pip, uv, Poetry  | Python                  | `pyproject.toml`, `requirements.txt` |
| npm, pnpm        | JavaScript, TypeScript  | `package.json`                       |

A simple `Makefile` excerpt:

```text
program: main.o util.o
	gcc -o program main.o util.o

main.o: main.c util.h
	gcc -c main.c
```

Make only recompiles what changed (**incremental build**) – in big projects this saves hours.

> This website has a build step too: the `pnpm build` command compiles and prepares the code.

## Compiler optimisations

The compiler produces faster code without changing its meaning. Some typical techniques:

- **Constant folding:** `60 * 60 * 24` becomes `86400` at compile time.
- **Dead code elimination:** code that can never run is left out.
- **Inlining:** calls to small functions are replaced by the function body.
- **Loop optimisation:** calculations that don't change inside a loop are moved before it.

The Python compiler does constant folding too:

```python run
import dis

def seconds_per_day():
    return 60 * 60 * 24

# The bytecode already contains 86400, not the three multiplications.
dis.dis(seconds_per_day)
```

For C compilers the level is set with a flag: `gcc -O0` (no optimisation, easier debugging) … `gcc -O3` (aggressive optimisation).

## What you can do: a better algorithm

The biggest speed-up usually comes not from small tricks but from a **better algorithm and data structure**.

```python run
import time

names_list = [f"user{i}" for i in range(100_000)]
names_set = set(names_list)

start = time.perf_counter()
for _ in range(200):
    "user99999" in names_list       # list: must scan everything (O(n))
list_time = time.perf_counter() - start

start = time.perf_counter()
for _ in range(200):
    "user99999" in names_set        # set: about one step (O(1))
set_time = time.perf_counter() - start

print(f"list: {list_time:.4f} s")
print(f"set:  {set_time:.6f} s")
```

> **"Premature optimisation is the root of all evil."** (Donald Knuth) – First write **correct and readable** code, measure where it is slow (profiling), and only optimise there.

## Summary

- A **build** produces the final product from the source; build systems: Make, CMake, Maven, Gradle, pip, npm.
- The compiler optimises automatically (constant folding, inlining, dead code elimination).
- The biggest gain is a good algorithm; optimise only after measuring.
