---
title: Practice – Closing Summary of the Course
summary: A Linux–Windows command dictionary, a comparison task on your two virtual machines, review questions and a closing worksheet covering the whole course.
minutes: 30
kind: practice
---

## Command dictionary: the same task on two systems

| Task | Linux (bash) | Windows (PowerShell) |
| --- | --- | --- |
| list files | `ls -l` | `Get-ChildItem` (`dir`) |
| change directory | `cd /tmp` | `cd C:\Temp` |
| file contents | `cat a.txt` | `Get-Content a.txt` (`type`) |
| copy / delete | `cp`, `rm` | `Copy-Item`, `Remove-Item` |
| processes | `ps aux`, `top` | `Get-Process`, Task Manager |
| stop a process | `kill 1234` | `Stop-Process -Id 1234` |
| network addresses | `ip a` | `ipconfig` |
| services | `systemctl status ssh` | `Get-Service` |
| install software | `sudo apt install git` | `winget install Git.Git` |
| administrator rights | `sudo …` | "Run as administrator" (UAC) |

A small Python program that looks things up in the same dictionary – run it and extend it with your own rows:

```python run
# Linux → Windows command dictionary: looks up the PowerShell equivalent of a Linux command.
dictionary = {
    "ls": "Get-ChildItem",
    "cat": "Get-Content",
    "ps": "Get-Process",
    "kill": "Stop-Process",
    "ip a": "ipconfig",
}

for linux, windows in dictionary.items():
    print(f"{linux:6} → {windows}")

wanted = "ps"
print(f"\nThe Windows equivalent of '{wanted}': {dictionary.get(wanted, 'not in the dictionary')}")
```

## Comparison task on your two virtual machines

Start the Ubuntu and the Windows 11 VM one after the other and fill in the table:

1. What is the name and PID of the first process? (Ubuntu: `ps -p 1`; Windows: Task Manager → Details, sort by PID.)
2. How much total and free memory is there, and how big is the swap / page file? (`free -h`; Task Manager → Performance → Memory.)
3. Which file system is on the system disk? (`df -T /`; File Explorer → C: → Properties.)
4. How many processes are running? (`ps -e | wc -l`; `(Get-Process).Count`.)

<details>
<summary>What to expect</summary>

1. Ubuntu: `systemd`, PID 1. Windows: the **System** process with PID 4 (only the PID 0 "System Idle Process" comes before it).
2. Windows typically uses more memory when idle; the page file size changes automatically.
3. Ubuntu: `ext4`; Windows: `NTFS`.
4. A fresh Ubuntu desktop typically runs 200–300 processes, Windows 11 100–200 – Linux also lists many kernel threads as processes.

</details>

## Review questions

<details>
<summary>1. Why can we say that the concepts learned in this course are the same in all three systems?</summary>

Because they solve the same tasks: they schedule processes and threads, manage virtual memory with paging, provide a file system and permissions, and serve programs through system calls. Only the implementation and the names differ.

</details>

<details>
<summary>2. From a programmer's point of view, what is the difference between Linux overcommit and the Windows commit limit?</summary>

On Linux a memory allocation almost always succeeds, and the trouble comes later, on use (the OOM killer may kill the program). On Windows the allocation fails immediately if it would exceed the limit, so the program can handle the situation itself.

</details>

<details>
<summary>3. Why don't we study macOS in VirtualBox?</summary>

Because the macOS licence only allows it to run on Apple hardware, and VirtualBox does not officially support it as a guest either.

</details>

## Closing worksheet

```quiz required
? A system uses 4096-byte (4 KiB) pages. Which page number does virtual address 20000 fall on (pages are numbered from 0)?
= 4
! 20000 / 4096 = 4.88 → page 4, offset: 20000 − 16384 = 3616.

? Which PowerShell command corresponds to the Linux ps command?
+ Get-Process
- Get-Content
- Get-ChildItem
- Stop-Process
! Stop-Process is the counterpart of kill.

? Which file system is the default on macOS?
- NTFS
- ext4
+ APFS
- FAT32
! Apple File System, since 2017.

? On which system are settings stored in a hierarchical database (the registry)?
- Linux
+ Windows
- macOS
- all three
! Linux uses text files (/etc), macOS uses .plist files.

? Which operating system runs on most cloud servers and supercomputers?
+ Linux
- Windows
- macOS
- FreeRTOS
! Free, open and easy to automate.
```
