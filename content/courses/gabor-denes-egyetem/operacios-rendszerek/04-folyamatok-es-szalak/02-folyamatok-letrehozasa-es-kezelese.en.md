---
title: Creating and Managing Processes
summary: fork, exec and wait, the process tree, signals, and the ps, top and kill commands.
minutes: 25
---

## What you will learn

- how a process creates a new process on UNIX (**fork**, **exec**, **wait**) and on Windows,
- what the **process tree**, an **orphan** and a **zombie** process are,
- how to monitor and stop processes (**ps**, **top**, **kill**, Task Manager).

## fork, exec, wait

On UNIX a new process is always born from an existing one:

1. **`fork()`** – the process **copies itself**. There are now two almost identical processes: the **parent** and the **child**. `fork` returns the child's PID to the parent and **0** to the child – that is how they know which is which.
2. **`exec()`** – the child **replaces** its own memory with another program (e.g. `ls`).
3. **`wait()`** – the parent waits until the child finishes and receives its **exit code**.

```c
// Simplified shell: starts the ls program and waits for it.
#include <stdio.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    pid_t pid = fork();                 // the process splits here
    if (pid == 0) {                     // child branch
        execlp("ls", "ls", "-l", NULL); // replaces itself with ls
        perror("exec");                 // only reached on error
        return 1;
    }
    int status;
    waitpid(pid, &status, 0);           // parent: waits for the child
    printf("Child exit code: %d\n", WEXITSTATUS(status));
    return 0;
}
```

This is exactly how the shell works: `fork` + `exec`, then `wait` for every typed command.

On **Windows** a single call, **`CreateProcess`**, creates and starts the new process (there is no separate fork and exec).

## The process tree

Since every process has a parent, processes form a **tree** whose root on Linux is **systemd** (PID 1):

```bash
pstree -p | head -20   # the process tree with PIDs
ps -o pid,ppid,cmd     # your shell's processes: PID and parent PID
```

- **Orphan process**: the parent ended before the child. On Linux the orphan is **adopted** by PID 1 (or a designated "subreaper").
- **Zombie process**: the child has finished, but the parent has not yet called `wait()`, so its PCB (with the exit code) remains. The `Z` state in `ps` output shows it.

## Signals

A **signal** is a short notification sent to a process by the kernel or another process.

| Signal    | No. | Meaning                                | When?                        |
| --------- | --- | -------------------------------------- | ---------------------------- |
| `SIGINT`  | 2   | interrupt request                      | **Ctrl + C** in the terminal |
| `SIGTERM` | 15  | polite request to exit (can be caught) | default of `kill PID`        |
| `SIGKILL` | 9   | immediate stop (**cannot** be caught)  | `kill -9 PID`                |
| `SIGSTOP` | 19  | suspend                                | **Ctrl + Z**                 |

## Monitoring processes

```bash
ps aux | head            # every process: user, PID, %CPU, %MEM, command
top                      # live list (quit: q); more comfortable: htop
sleep 300 &              # a process started in the background
jobs                     # the shell's background jobs
kill %1                  # SIGTERM to background job 1
pgrep sleep              # PID of a program by name
```

On Windows the **Details** tab of **Task Manager** (Ctrl + Shift + Esc) shows the PIDs; in PowerShell:

```powershell
Get-Process | Sort-Object CPU -Descending | Select-Object -First 5
Stop-Process -Name notepad     # stop Notepad
```

## Summary

- UNIX: `fork` copies the process, `exec` replaces the program, `wait` waits for the child; Windows: `CreateProcess`.
- Processes form a tree (root: PID 1); orphan = dead parent, zombie = the parent has not called `wait` yet.
- Signals: Ctrl + C = `SIGINT`, `kill` = `SIGTERM` (15), `kill -9` = `SIGKILL`.

## Lesson exercise

```quiz required
? What does `fork()` return to the child process?
= 0
! The parent receives the child's PID.

? Which call replaces the process's memory with another program?
- fork
+ exec
- wait
- kill
! fork + exec = starting a new program in a new process.

? What do we call a finished process whose parent has not yet called `wait()`?
= zombie
! Z state in ps output.

? Which signal does `kill -9` send, which the process cannot catch?
+ SIGKILL
- SIGTERM
- SIGINT
- SIGSTOP
! SIGTERM is a polite request, SIGKILL an immediate stop.

? Which Windows API call creates and starts a new process?
= CreateProcess
! Windows has no separate fork and exec.
```
