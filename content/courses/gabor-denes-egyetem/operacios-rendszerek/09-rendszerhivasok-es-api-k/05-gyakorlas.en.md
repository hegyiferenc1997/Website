---
title: Practice – System Calls
summary: Tracing system calls with strace, review questions and a summary worksheet.
minutes: 50
kind: practice
---

## Investigating with strace (Ubuntu VM)

1. `strace -c echo hi` – how many `write` calls were there? How many calls in total?
2. `strace -e trace=openat cat /etc/hostname` – which files does `cat` open besides `/etc/hostname`? (Hint: the C library and the locale settings.)
3. `strace -f -e trace=clone,execve bash -c "ls"` – do you see the `clone` (Linux's implementation of fork) and `execve` calls?
4. `ls /none 2> /dev/null; echo $?` – the exit code (2) signals the error, and the error message went "nowhere".

## Review questions

<details>
<summary>1. Why does the kernel check every parameter of a system call?</summary>

Because the user program may be buggy or malicious. If the kernel wrote to a given address without checking, a program could overwrite the memory of the kernel or another process.

</details>

<details>
<summary>2. Why do programmers not write system calls directly (with the syscall instruction)?</summary>

Because it is not portable (numbering differs per OS and architecture), it is inconvenient, and we would give up the library's buffering and error handling. libc and the POSIX API hide this.

</details>

<details>
<summary>3. Why is a separate stderr needed if there is stdout?</summary>

So that the program's output and the error messages can be separated: e.g. with `program > result.txt` errors still appear on the terminal instead of mixing into the result.

</details>

## Summary worksheet

```quiz required
? Which file descriptor is the standard output (stdout)?
= 1
! 0 = stdin, 1 = stdout, 2 = stderr.

? What is the Win32 equivalent of the POSIX `fork` + `exec` pair?
= CreateProcess
! One call creates and starts the new process.

? What format is a Windows `.exe` file?
- ELF
+ PE
- Mach-O
- ISO
! Portable Executable.

? What does a failed POSIX system call typically return?
= -1
! The errno variable stores the reason for the error.

? Which shell redirection sends error messages into a file?
- > errors.txt
+ 2> errors.txt
- < errors.txt
- | errors.txt
! File descriptor 2 is stderr.

? Which category does the `chmod` system call belong to?
- information
- communication
+ protection
- device management
! It sets a file's permissions.
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **How many system calls?** Write the `write_calls(lines, mode, buffer=4096)` function. `lines` is the list of lines to print (each ends with `\n`). In `"line"` mode (terminal) every line is one `write()`, in `"full"` mode (pipe, file) there's a `write()` when the buffer fills and at the end – i.e. total bytes / buffer, rounded up. In `"none"` mode every **byte** is a separate call.

```python starter
def write_calls(lines, mode, buffer=4096):
    return len(lines)
```

<details>
<summary>Solution</summary>

```python solution
def write_calls(lines, mode, buffer=4096):
    total = sum(len(s.encode()) for s in lines)     # count in bytes
    if mode == "line":
        return len(lines)
    if mode == "full":
        return -(-total // buffer)                   # rounded up
    return total                                     # "none": byte by byte
```

</details>

```python test
lines = [f"line {i}\n" for i in range(1000)]          # 8890 bytes in total
assert write_calls(lines, "line") == 1000
assert write_calls(lines, "full") == 3
assert write_calls(lines, "none") == 8890
assert write_calls([], "full") == 0
print("All checks passed!")
```

**2.** **Redirection in the file descriptor table.** Initially the table is `{0: "tty", 1: "tty", 2: "tty"}`. Write the `redirect(steps)` function, which executes the steps in order and returns the table! A step is `("file", fd, name)` – points fd to the file (like `>`), or `("dup", target, source)` – `target` should point wherever `source` points **right now** (like `2>&1`).

```python starter
def redirect(steps):
    return {0: "tty", 1: "tty", 2: "tty"}
```

<details>
<summary>Solution</summary>

```python solution
def redirect(steps):
    table = {0: "tty", 1: "tty", 2: "tty"}
    for kind, a, b in steps:
        if kind == "file":
            table[a] = b              # e.g. > out.txt: fd 1 points to the file
        else:
            table[a] = table[b]       # e.g. 2>&1: fd 2 to where fd 1 points NOW
    return table
```

</details>

```python test
# ls > out.txt 2>&1
assert redirect([("file", 1, "out.txt"), ("dup", 2, 1)]) == {0: "tty", 1: "out.txt", 2: "out.txt"}
# ls 2>&1 > out.txt  – the order matters!
assert redirect([("dup", 2, 1), ("file", 1, "out.txt")]) == {0: "tty", 1: "out.txt", 2: "tty"}
# sort < in.txt
assert redirect([("file", 0, "in.txt")])[0] == "in.txt"
print("All checks passed!")
```

**3.** **How much time does the buffer save?** A system call has a fixed cost of `call_us` µs. Write the `saving(nbytes, buffer, call_us=1.0)` function: how many µs do we save by writing in pieces of size `buffer` instead of byte by byte? (Count only the calls' fixed cost.)

```python starter
def saving(nbytes, buffer, call_us=1.0):
    return 0
```

<details>
<summary>Solution</summary>

```python solution
def saving(nbytes, buffer, call_us=1.0):
    byte_by_byte = nbytes * call_us
    buffered = -(-nbytes // buffer) * call_us
    return byte_by_byte - buffered
```

</details>

```python test
assert saving(1048576, 4096) == 1048576 - 256
assert saving(100, 100, 2.0) == 198.0
assert saving(0, 4096) == 0
print("All checks passed!")
```

### Quick check questions

```quiz
? Which is the correct description of a system call?
+ a program's request to the kernel to perform a protected operation (e.g. opening a file), with a switch to kernel mode
- calling a function from another program
- the user's request to the administrator
! The program can't access the hardware directly itself.

? Which command traces a program's system calls on Linux?
+ strace
- top
- ls
- grep
! E.g. strace -c ls gives a summary.

? What value does the write() system call return on error?
= -1
! The errno variable holds the cause of the error.

? What is the role of POSIX?
+ it describes a standard system call and command interface, so a program can be compiled on several Unix-like systems
- the name of a Linux distribution
- a file system
! Windows uses its own API (Win32).

? Which is not a system call but a library function (which may use a system call behind the scenes)?
- open
- read
+ printf
- fork
! printf buffers and calls write() from time to time.
```
