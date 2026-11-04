---
title: Processes and the Command Line
summary: Program and process, the Task Manager, and first commands in PowerShell and bash.
minutes: 16
---

## What you will learn

- the difference between a **program** and a **process**,
- how to view and stop processes (**Task Manager**, `top`),
- the first, most important **command-line** commands.

## Program and process

A **program** is a file on the disk (e.g. `chrome.exe`). When you start it, the OS loads it into memory and a **process** is created: a running instance with its own memory and identifier (**PID**). One program can run as several processes: Chrome starts a separate process for every tab, so a frozen page doesn't take the others down with it.

## Task Manager

On Windows the **Task Manager** (`Ctrl + Shift + Esc`) shows how much processor, memory, disk and network each process uses. You can stop a frozen program with the **End task** button. On macOS the same is **Activity Monitor**, on Linux the `top` command or the friendlier `htop`.

## First steps on the command line

On the command line you are always in a **current folder**. The most important commands:

| Task                 | Windows PowerShell      | Linux / macOS bash |
| -------------------- | ----------------------- | ------------------ |
| where am I?          | `pwd` / `Get-Location`  | `pwd`              |
| list folder contents | `ls` / `dir`            | `ls`               |
| enter a folder       | `cd Documents`          | `cd Documents`     |
| one level up         | `cd ..`                 | `cd ..`            |
| new folder           | `mkdir test`            | `mkdir test`       |
| show a file          | `cat notes.txt`         | `cat notes.txt`    |
| copy                 | `cp a.txt b.txt`        | `cp a.txt b.txt`   |
| delete               | `rm a.txt`              | `rm a.txt`         |
| processes            | `Get-Process`           | `ps aux`           |
| stop a process       | `Stop-Process -Id 1234` | `kill 1234`        |

```bash
pwd                 # /home/anna
mkdir test          # new folder
cd test
echo "hello" > hello.txt
cat hello.txt       # hello
cd ..
```

**Careful:** deleting on the command line (`rm`) does not use the Recycle Bin; the file is gone at once.

## Why learn it?

The command line can be **automated**: what you have to do ten times goes into a script. Servers, the cloud and developer tools (git, pnpm, pip) are all driven from the command line.

## Summary

- Program = a file on disk; process = a running instance with its own memory and PID.
- Task Manager (Windows), Activity Monitor (macOS), `top`/`htop` (Linux).
- Basic commands: `pwd`, `ls`, `cd`, `mkdir`, `cat`, `cp`, `rm`.

## Exercise

```quiz required
? What is a running instance of a program called?
= process
! Every process has its own identifier (PID).

? Which key combination opens the Task Manager directly on Windows?
- Ctrl + C
- Alt + F4
+ Ctrl + Shift + Esc
- Win + D
! It is also reachable from the Ctrl + Alt + Del menu.

? Which command takes you one level up in the folder structure?
= cd ..
! `..` is the parent folder.

? Which command prints the current folder on Linux?
+ pwd
- ls
- cat
- mkdir
! print working directory.
```
