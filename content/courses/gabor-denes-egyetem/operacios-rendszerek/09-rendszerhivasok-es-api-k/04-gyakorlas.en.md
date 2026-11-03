---
title: Practice – System Calls
summary: Tracing system calls with strace, review questions and a summary worksheet.
minutes: 25
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
