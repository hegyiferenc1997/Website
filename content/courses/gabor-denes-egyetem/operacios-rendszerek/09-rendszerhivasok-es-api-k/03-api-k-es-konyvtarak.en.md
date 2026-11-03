---
title: APIs and Libraries
summary: The difference between an API and a system call, the C library, the POSIX standard, the Win32 API and ntdll, and how a program can be portable.
minutes: 20
---

## What you will learn

- the difference between an **API** and a **system call**,
- what the **C library** (libc), the **POSIX** standard and the **Win32 API** are,
- what an **ABI** is and why a Linux program does not run on Windows (and vice versa).

## API versus system call

An **API** (_Application Programming Interface_) is a **documented set** of functions, types and rules that the programmer uses. A system call is a **lower level**: the kernel's actual entry point.

```text
your program:     fopen("a.txt", "r")      ← API (C standard library)
        ↓
libc:             open("a.txt", O_RDONLY)  ← POSIX API, a thin wrapper
        ↓
kernel:           syscall #257 (openat)    ← the system call
```

Why is the middle layer good?

- **portability**: the same API can work on several OSes, while system call numbers and methods may differ,
- **convenience**: the API buffers, handles errors and offers simpler parameters,
- **stability**: the system calls behind it may change, the API stays.

Not every API call involves a system call: `strlen` or `sqrt` run entirely in user mode; `printf` calls `write` only when the buffer is full.

## The most important APIs

| API                     | Where?            | Characteristic                                                                                  |
| ----------------------- | ----------------- | ----------------------------------------------------------------------------------------------- |
| **C standard library**  | everywhere        | `printf`, `fopen`, `malloc` – part of the C language                                            |
| **POSIX**               | Linux, macOS, BSD | an IEEE standard: `fork`, `open`, `pthread_create`, shell commands                              |
| **Win32 (Windows API)** | Windows           | `CreateProcess`, `CreateFile`, window management; provided by `kernel32.dll`, `user32.dll` etc. |
| **Native API**          | Windows, internal | `ntdll.dll` – the little-documented layer below Win32 that calls the kernel directly            |
| high-level libraries    | anywhere          | Python `os`, Java `java.io`, .NET – in the end these call the above too                         |

On Linux the C library is usually **glibc** (on Alpine Linux the smaller musl). You can check which libraries a program uses:

```bash
ldd /bin/ls          # dynamically loaded libraries (libc.so.6 …)
```

## ABI and portability

The **ABI** (_Application Binary Interface_) is the agreement between a **compiled** program and the system: how parameters are passed, the format of the executable file, the system call numbers.

| System  | Executable format       | System calls      |
| ------- | ----------------------- | ----------------- |
| Linux   | **ELF**                 | Linux numbering   |
| Windows | **PE** (`.exe`, `.dll`) | NT kernel (ntdll) |
| macOS   | **Mach-O**              | XNU kernel        |

That is why a program compiled for Linux does not run on Windows: the file format and the kernel interface are different. **Source code**, however, is portable if it uses a standard API (e.g. POSIX or the C standard library) – it only has to be recompiled. Exceptions: **WSL** runs Linux on Windows (WSL 2 with a real Linux kernel in a virtual machine), and **Wine** implements the Win32 API on Linux.

```bash
file /bin/ls         # ELF 64-bit LSB … x86-64
```

## Summary

- The API is the programmer's interface, the system call is the kernel's entry point; libc connects them.
- Main APIs: C standard library, POSIX, Win32 (with ntdll below).
- ABI: the binary agreement (ELF, PE, Mach-O) – that is why binaries do not run on other OSes; source code with a standard API is portable.

## Lesson exercise

```quiz required
? Which IEEE standard defines the common API of UNIX-like systems?
= POSIX
! Portable Operating System Interface.

? Which call runs entirely in user mode, without a system call?
+ strlen
- open
- fork
- write
! It only counts characters in memory.

? What is the name of the Linux executable file format?
= ELF
! Executable and Linkable Format; PE on Windows, Mach-O on macOS.

? Which Windows DLL is the "native" layer below Win32 that calls the kernel directly?
+ ntdll.dll
- user32.dll
- explorer.exe
- notepad.exe
! kernel32.dll calls it too.

? Which command shows which dynamic libraries a Linux program uses?
= ldd
! ldd /bin/ls
```
