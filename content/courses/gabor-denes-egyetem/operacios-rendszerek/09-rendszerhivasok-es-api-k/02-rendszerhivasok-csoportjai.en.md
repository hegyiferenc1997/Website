---
title: Categories of System Calls
summary: Process, file, device, information, communication and protection calls with their POSIX and Win32 equivalents, and the file descriptor.
minutes: 20
---

## What you will learn

- into which **categories** system calls can be grouped,
- which UNIX/POSIX call corresponds to which **Windows (Win32)** call,
- what a **file descriptor** is and what the three standard streams are.

## The six categories

| Category              | What for?                        | POSIX (Linux, macOS)                       | Win32 (Windows)                                                    |
| --------------------- | -------------------------------- | ------------------------------------------ | ------------------------------------------------------------------ |
| **process control**   | start, terminate, wait           | `fork`, `exec`, `exit`, `wait`             | `CreateProcess`, `ExitProcess`, `WaitForSingleObject`              |
| **file management**   | open, read, write, close, delete | `open`, `read`, `write`, `close`, `unlink` | `CreateFile`, `ReadFile`, `WriteFile`, `CloseHandle`, `DeleteFile` |
| **device management** | controlling, reserving a device  | `ioctl`, `read`, `write`                   | `DeviceIoControl`                                                  |
| **information**       | time, identifiers, system data   | `getpid`, `time`, `uname`                  | `GetCurrentProcessId`, `GetSystemTime`                             |
| **communication**     | pipes, shared memory, network    | `pipe`, `mmap`, `socket`                   | `CreatePipe`, `MapViewOfFile`, `socket`                            |
| **protection**        | querying and setting permissions | `chmod`, `chown`, `umask`                  | `SetFileSecurity`, `SetSecurityInfo`                               |

A current Linux kernel knows **more than 300** system calls, but the vast majority of programs use a few dozen.

## The file descriptor

On UNIX an open file is identified by a small **integer**, the **file descriptor**. `open` returns it; `read`, `write` and `close` receive it. On Windows the **handle** plays the same role.

Every process starts with **three** open file descriptors:

| No. | Name       | Where does it point by default? |
| --- | ---------- | ------------------------------- |
| 0   | **stdin**  | keyboard (standard input)       |
| 1   | **stdout** | terminal (standard output)      |
| 2   | **stderr** | terminal (error output)         |

That is why a newly opened file typically gets descriptor **3**. The shell's redirections also replace these:

```bash
ls /no-such-dir 2> errors.txt  # descriptor 2 (stderr) into a file
ls /etc > list.txt 2>&1        # stdout into a file, and stderr to wherever 1 points
ls /proc/$$/fd                 # your shell's open file descriptors
```

## Low-level file handling

Python's `os` module offers the system calls almost one to one – run it and look at the descriptor you get!

```python run
# Low-level file handling: the functions of the os module are almost one-to-one system calls.
import os

fd = os.open("test.txt", os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o644)  # open()
print("file descriptor received:", fd)
os.write(fd, b"Hello, kernel!\n")                                      # write()
os.close(fd)                                                           # close()

fd = os.open("test.txt", os.O_RDONLY)
data = os.read(fd, 100)                                                # read()
os.close(fd)
print("read back:", data.decode().strip())
print("process ID (getpid):", os.getpid())
os.remove("test.txt")                                                  # unlink()
```

(Python in the browser uses a simulated file system, but the calls are the same.)

## Summary

- Categories: process, file, device, information, communication, protection.
- POSIX `fork/exec` ↔ Win32 `CreateProcess`; `open/read/write/close` ↔ `CreateFile/ReadFile/WriteFile/CloseHandle`.
- A file descriptor is a small integer; 0 = stdin, 1 = stdout, 2 = stderr.

## Lesson exercise

```quiz required
? Which category does the `getpid` system call belong to?
- process control
- file management
+ information
- protection
! It queries the running process's identifier.

? What is the Win32 equivalent of the POSIX `open` call?
= CreateFile
! Despite its name, existing files are opened with it too.

? Which file descriptor number is the standard error output (stderr)?
= 2
! 0 = stdin, 1 = stdout, 2 = stderr.

? A program opens a file for the first time (it has closed nothing). Which descriptor does it typically get?
= 3
! 0, 1 and 2 are already taken.

? Which system call belongs to the communication category?
- chmod
+ pipe
- getpid
- unlink
! A pipe is a data channel between two processes.
```
