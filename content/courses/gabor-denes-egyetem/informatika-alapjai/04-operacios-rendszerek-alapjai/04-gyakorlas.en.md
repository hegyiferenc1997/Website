---
title: Practice – Operating System Basics
summary: Review questions and a summary worksheet on OS tasks, files and the command line.
minutes: 18
kind: practice
---

## Review questions

<details>
<summary>1. Why does the browser run every tab in a separate process?</summary>

Because the memory of processes is separated: if a page freezes or crashes, only its process stops, and the other tabs keep working. It is a security benefit too.

</details>

<details>
<summary>2. What is the difference between the paths `C:\Users\anna\a.txt` and `..\a.txt`?</summary>

The first is absolute: it starts at the drive's root and means the same from anywhere. The second is relative: it means `a.txt` in the parent of the current folder, so it depends on where you are.

</details>

<details>
<summary>3. You can't copy a 6 GB video onto a USB stick even though it has 20 GB free. What may be the reason?</summary>

The stick is probably formatted as FAT32, where a single file can be at most 4 GB. Formatting it as exFAT (after backing up!) solves the problem.

</details>

Try it on your own machine (PowerShell):

```powershell
pwd
mkdir test
cd test
"hello" > hello.txt
cat hello.txt
cd ..
Get-Process | Sort-Object CPU -Descending | Select-Object -First 5
```

## Summary worksheet

```quiz required
? Which operating system runs on most web servers?
- Windows 11
+ Linux
- iOS
- macOS
! Most of the cloud and servers run Linux.

? What is the default file system of Windows?
= NTFS
! New Technology File System.

? What is a `PID`?
+ the identifier number of a process
- a file extension
- the processor type
- short for password
! Process ID.

? Which command creates a new folder?
= mkdir
! make directory.

? What does the permission `-rw-r--r--` mean for the **owner**?
+ they can read and write it, but not execute it
- they can only read it
- they can do anything
- they can do nothing
! The first triple (rw-) belongs to the owner.

? What happens to a file you delete with `rm` on Linux?
- it goes to the Recycle Bin
+ it is deleted immediately, not moved to the Recycle Bin
- it is only hidden
- it moves to the root directory
! Deleting on the command line is final.
```
