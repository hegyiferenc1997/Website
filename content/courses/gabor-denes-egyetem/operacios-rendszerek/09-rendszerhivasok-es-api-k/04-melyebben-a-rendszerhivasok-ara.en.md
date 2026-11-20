---
title: Deeper – The Cost of System Calls, Buffering and File Descriptors
summary: How much a system call costs and how buffering saves (calculation and a dd experiment), line buffering on a terminal and full buffering in a pipe, the secrets of file descriptors and redirection (the order of 2>&1), error codes (errno), and the vDSO, which lets some calls run without entering the kernel.
minutes: 40
---

## What you will learn in this lesson

- **in numbers**, how much buffering saves on system calls,
- why a program behaves **differently** in a terminal and in a pipe (line buffering versus full buffering),
- how **redirection** works behind the scenes, and why the position of `2>&1` matters,
- how the kernel signals **errors** (errno), and how to read them,
- what the **vDSO** is, which lets you query the time without entering the kernel.

## 1. How much does buffering save? – let's calculate!

In the basic lesson you saw: a system call is roughly **100 to 1000 times** more expensive than a function call, because the processor has to switch to kernel mode, the kernel has to check the parameters, then return. So it matters **in how many pieces** we transfer an amount of data.

A simple cost model: every `write()` call costs a fixed **1 µs**, plus **0.1 ns** per byte of copying. How long does it take to write **1 MB** with different buffer sizes?

```python run
# Writing 1 MB with different buffer sizes: how many system calls, how much time?
DATA = 1024 * 1024              # 1 MB
CALL_US = 1.0                   # fixed cost of one system call (µs)
BYTE_NS = 0.1                   # copying per byte (ns)

for buf in [1, 16, 512, 4096, 65536, 1024 * 1024]:
    calls = -(-DATA // buf)                          # division rounded up
    time_ms = (calls * CALL_US * 1000 + DATA * BYTE_NS) / 1_000_000
    print(f"buffer {buf:>8} B: {calls:>8} write() calls, ≈ {time_ms:8.2f} ms")
```

Writing byte by byte needs more than a million system calls (**~1 second**), with a 4 KB buffer only **256** (about 0.4 ms) – a **thousandfold** difference, even though we wrote the same amount of data! Above 64 KB there's hardly any gain: there the copying cost dominates. That's why libraries typically choose a 4–64 KB buffer.

Try it live in the Ubuntu VM – the same 2 MB, once byte by byte, once in 4 KB pieces:

```bash
time dd if=/dev/zero of=/dev/null bs=1 count=2000000       # 2 million reads + 2 million writes
time dd if=/dev/zero of=/dev/null bs=4096 count=489        # the same amount of data, ~500 + 500 calls
strace -c dd if=/dev/zero of=/dev/null bs=1 count=100000 2>&1 | tail -15   # summary of the calls
```

`/dev/zero` gives endless zeros, `/dev/null` swallows everything – so we only measure the cost of the system calls, without a disk.

## 2. Line buffering and full buffering

The C library (and Python too) uses **three** kinds of buffering for standard output:

| Mode               | When does it write out?             | When is it used?                                     |
| ------------------ | ----------------------------------- | ---------------------------------------------------- |
| **unbuffered**     | immediately                         | error output (`stderr`) – errors mustn't be lost     |
| **line-buffered**  | at every line end (`\n`)            | if the output is a **terminal** – see it immediately |
| **fully buffered** | when the buffer fills (e.g. 4–8 KB) | if the output is a **file or pipe** – faster         |

A common surprise follows: a program that prints its progress line by line in the terminal prints everything **at once at the end** when connected to a **pipe**. Look at it in the system calls:

```bash
strace -e trace=write python3 -c "for i in range(3): print(i)"            # terminal: 3 writes
strace -e trace=write python3 -c "for i in range(3): print(i)" | cat      # pipe: 1 write!
strace -e trace=write python3 -u -c "for i in range(3): print(i)" | cat   # -u: unbuffered → 3 writes
```

(`strace` writes its own output to the error output, so you see it in the terminal even when the program's output goes into the pipe.) If a logging program "writes nothing" in a pipe, it's often just buffering; in Python `print(..., flush=True)` or the `-u` switch helps.

## 3. File descriptors and the secrets of redirection

Every process has a **file descriptor table**: small integers pointing to open files, pipes, the terminal. The first three are always the same:

| Number | Name     | Default  |
| ------ | -------- | -------- |
| 0      | `stdin`  | keyboard |
| 1      | `stdout` | terminal |
| 2      | `stderr` | terminal |

Redirection is really **rewriting** this table before the shell starts the program (with the `dup2()` system call):

- `> out.txt` – descriptor **1** should point to the file `out.txt`,
- `2> err.txt` – descriptor **2** to `err.txt`,
- `2>&1` – descriptor **2** should point **where descriptor 1 points right now**.

Because of the last one **the order matters**, since the shell executes from left to right:

```bash
ls /etc /nope > out.txt 2>&1     # 1 → out.txt, then 2 → where 1 is (out.txt): EVERYTHING goes to the file
ls /etc /nope 2>&1 > out.txt     # 2 → where 1 is (the terminal!), then 1 → out.txt: the error stays on the TERMINAL
```

**Analogy:** two mailboxes (1 and 2) each get a forwarding slip. `2>&1` says: "mail for 2 should go where mail for 1 goes **now**" – if you only redirect 1 afterwards, 2 stays at the old address.

You can see the descriptors live too:

```bash
ls -l /proc/self/fd                        # ls's own descriptors: 0, 1, 2 → /dev/pts/0 (the terminal)
ls -l /proc/self/fd > fds.txt; cat fds.txt # 1 now points to fds.txt
ls -l /proc/self/fd | cat                  # 1 points to a pipe: pipe:[…]
```

## 4. Error codes: errno

If a system call fails, the kernel returns a **negative number**, and the C library puts it into the **`errno`** variable. The most common ones:

| Code     | Number | Meaning                   | Typical cause                        |
| -------- | ------ | ------------------------- | ------------------------------------ |
| `ENOENT` | 2      | no such file or directory | mistyped path                        |
| `EACCES` | 13     | permission denied         | you have no right to read/write      |
| `EEXIST` | 17     | the file already exists   | `mkdir` with an existing name        |
| `ENOSPC` | 28     | no space left on device   | the disk is full (or inodes ran out) |
| `EMFILE` | 24     | too many open files       | the program doesn't close its files  |

`strace` prints them:

```bash
strace -e trace=openat cat /no/such 2>&1 | tail -3        # ... = -1 ENOENT (No such file or directory)
strace -e trace=openat cat /etc/shadow 2>&1 | tail -3     # ... = -1 EACCES (Permission denied)
```

In Python a system call's error arrives as an `OSError` exception, with the `errno` inside:

```python run
# Error codes of system calls from Python: the errno field of OSError.
import errno
import os

for path in ["/no/such.txt", "/"]:
    try:
        fd = os.open(path, os.O_WRONLY)          # open for writing
        os.close(fd)
    except OSError as err:
        print(f"{path}: errno {err.errno} = {errno.errorcode[err.errno]} ({err.strerror})")
```

(The first is a non-existent file; the second is a directory, which can't be opened for writing – `EISDIR`.) The error code's **name** (e.g. `ENOENT`) is the same on every UNIX-like system, so it's worth learning the most common ones: from an error message you'll immediately know where to look for the problem.

## 5. The vDSO – a system call without entering the kernel

Some calls are used **very often** by programs but only read from the kernel: the most typical is **querying the time** (`clock_gettime`, `gettimeofday`). A web server or a game may ask for it up to a million times a second.

So Linux loads a tiny library prepared by the kernel into every process's address space: the **vDSO** (_virtual dynamic shared object_). The kernel continuously updates the current time on a shared, read-only memory page, and the vDSO function simply **reads** it – without a mode switch, in a few nanoseconds.

```bash
cat /proc/self/maps | grep vdso      # it's in every process: [vdso]
strace -e trace=clock_gettime date   # date's time query does NOT appear as a system call!
```

This is a good example of how crossing the boundary between the kernel and user space is so expensive that tricks to avoid it pay off.

## Summary

- Because of a system call's fixed cost, **buffering** can make a thousandfold difference: 1 MB byte by byte is ~1 million calls, with a 4 KB buffer 256.
- Standard output is **line-buffered** on a terminal and **fully buffered** to a file or pipe; error output is unbuffered.
- Redirection is rewriting the **file descriptor table**; `2>&1` binds 2 to where 1 points **at that moment** – that's why the order matters.
- Errors are signalled by **errno** codes (`ENOENT`, `EACCES`, `ENOSPC`…); `strace` and Python's `OSError` show them too.
- The **vDSO** serves frequent, read-only calls (time) without entering the kernel.

## Exercise

```quiz required
? How many write() system calls are needed to write 1 MB (1,048,576 bytes) with a 4096-byte buffer?
= 256
! 1,048,576 / 4096 = 256.

? A Python program prints its progress line by line in the terminal, but connected to a pipe it prints everything only at the end. Why?
- the pipe is slower than the terminal
+ the output is fully buffered for a pipe and line-buffered for a terminal
- the pipe only opens at the end of the program
! flush=True or python -u helps.

? Which command writes both the normal output and the error output to the file out.txt?
+ ls /etc /nope > out.txt 2>&1
- ls /etc /nope 2>&1 > out.txt
! 2>&1 binds 2 to where 1 points at that moment.

? Which file descriptor is standard error (stderr)?
= 2
! 0 = stdin, 1 = stdout, 2 = stderr.

? In the strace output you see: openat(..., "/etc/shadow", ...) = -1 EACCES. What is the cause of the error?
- no such file
+ you have no permission to open the file
- the disk is full
! EACCES = Permission denied.

? Why doesn't the date command's time query appear as a system call in the strace output?
- because date doesn't query the time
+ because the vDSO reads it from a shared memory page without entering the kernel
- because strace can't trace time
! The kernel loads the vDSO into every process's address space.
```
