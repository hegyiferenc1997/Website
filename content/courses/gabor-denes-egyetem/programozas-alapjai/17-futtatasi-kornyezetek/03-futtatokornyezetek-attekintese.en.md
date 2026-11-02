---
title: Overview of Runtime Environments
summary: Operating system, JVM, .NET CLR, browser and Node.js, containers (Docker), the cloud – where and how code runs.
minutes: 14
---

## What you will learn

- what a **runtime environment** is and what it gives a program,
- how a program runs **natively**, on a **virtual machine**, in a **browser**,
- the role of **containers** (Docker) and the **cloud**,
- how a program reaches its environment (**environment variables**, platform).

## What is a runtime environment?

The runtime is everything your program needs to **run** apart from your code: the operating system, the interpreter or virtual machine, libraries, memory management (e.g. garbage collector), file and network access.

```text
  ┌────────────────────────────┐
  │        your program        │
  ├────────────────────────────┤
  │  runtime (Python           │
  │  interpreter, JVM, .NET…)  │
  ├────────────────────────────┤
  │      operating system      │
  ├────────────────────────────┤
  │          hardware          │
  └────────────────────────────┘
```

## Native execution (C, C++, Go, Rust)

The compiler produces machine code **for a specific processor and operating system** (an `.exe` on Windows). This is very fast, but a program compiled for Windows won't run on Linux – you have to compile separately for each platform.

## Virtual machines (Java, C#, Python)

- **JVM (Java Virtual Machine):** the Java compiler produces platform-independent **bytecode** (`.class`, `.jar`), which the JVM runs on any machine. It compiles frequently used parts to machine code at run time (**JIT**). Kotlin and Scala run on it too.
- **.NET CLR (Common Language Runtime):** C# compiles to intermediate code (IL), which the CLR runs with JIT – on Windows, Linux and macOS.
- **CPython:** the "official" Python. It compiles source code to bytecode (`.pyc`, in the `__pycache__` folder), then interprets it on its own virtual machine. Other implementations exist: **PyPy** (faster with JIT), **MicroPython** (for microcontrollers).

The common advantages of virtual machines are **portability** and automatic **memory management** (garbage collector).

```python run
import dis

def double(x):
    return x * 2

# Python bytecode: this is what the CPython virtual machine executes.
dis.dis(double)
```

## Browser and Node.js

- The **browser** contains a JavaScript engine (Chrome: V8, Firefox: SpiderMonkey) that runs the web page's code with JIT – in an isolated environment (_sandbox_) for security: it cannot freely access the machine's files.
- With **WebAssembly** (Wasm), other languages (C, C++, Rust, even Python – e.g. _Pyodide_) can run in the browser too. That's how Python exercises will later run on this site.
- **Node.js** runs the V8 engine outside the browser, on the server.

## Containers (Docker)

"It works on my machine!" – the classic problem: everything works on the developer's machine but not on the server, because the Python version differs or a library is missing.

A **container** packages the program **together with its whole runtime environment** (system libraries, interpreter, dependencies). **Docker** is the most widespread tool for this. A container is lighter than a full virtual machine because it shares the operating system's core (_kernel_) with the host.

```text
# Dockerfile – packaging a Python program into a container
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "main.py"]
```

## The cloud

**Cloud providers** (AWS, Microsoft Azure, Google Cloud) rent out computing capacity:

- **IaaS:** you rent a virtual machine and install everything yourself.
- **PaaS:** you just upload the code; the provider supplies the runtime.
- **Serverless (FaaS):** you run individual functions on events and pay only for the running time.

## The program and its environment

The program receives information from its runtime: which system it runs on, the working directory, which **environment variables** are set. Environment variables typically carry settings and secret keys – so these don't end up in the source code.

```python run
import os
import platform
from pathlib import Path

print("System:", platform.system() or "unknown")
print("Working directory exists:", Path.cwd().exists())

# Read an environment variable with a default value (if it isn't set).
mode = os.environ.get("APP_MODE", "development")
print("Mode:", mode)

# Set it for this run only (child processes see it too).
os.environ["APP_MODE"] = "test"
print("New mode:", os.environ["APP_MODE"])
```

## Summary

| Environment           | Example                 | Portable?                 | Speed           |
| --------------------- | ----------------------- | ------------------------- | --------------- |
| native machine code   | C, C++, Go, Rust        | must compile per platform | fastest         |
| virtual machine (JIT) | Java/JVM, C#/.NET       | yes                       | fast            |
| interpreter           | CPython, Ruby           | yes                       | slower          |
| browser               | JavaScript, WebAssembly | yes (in every browser)    | fast (JIT)      |
| container             | Docker                  | yes, with its environment | close to native |

- The runtime provides everything needed to run apart from the code.
- **Containers** solve the "works on my machine" problem.
- Pass settings and secrets in **environment variables**, not in the code.
