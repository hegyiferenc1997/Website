---
title: Practice – Operating System Basics
summary: Review questions and a summary worksheet on OS tasks, files and the command line.
minutes: 43
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

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **Permissions in octal.** Write the `octal(perms)` function, which turns a 9-character `rwx` string (e.g. `"rwxr-xr-x"`) into the 3-digit octal form as a string (e.g. `"755"`)!

```python starter
def octal(perms):
    return str(perms.count("r")) + str(perms.count("w")) + str(perms.count("x"))
```

<details>
<summary>Solution</summary>

```python solution
def octal(perms):
    value = {"r": 4, "w": 2, "x": 1, "-": 0}
    digits = []
    for i in (0, 3, 6):                       # owner, group, others
        digits.append(str(sum(value[c] for c in perms[i:i + 3])))
    return "".join(digits)
```

</details>

```python test
assert octal("rwxr-xr-x") == "755"
assert octal("rw-r--r--") == "644"
assert octal("rw-------") == "600"
assert octal("---------") == "000"
print("All checks passed!")
```

**2.** **Resolving a path.** Write the `resolve(current, relative)` function, which turns a Linux-style relative path (which may contain `.` and `..`) into an absolute path relative to the current folder! You can't go above the root.

```python starter
def resolve(current, relative):
    return current + "/" + relative
```

<details>
<summary>Solution</summary>

```python solution
def resolve(current, relative):
    parts = [p for p in current.split("/") if p]
    for p in relative.split("/"):
        if p in ("", "."):
            continue
        if p == "..":
            if parts:
                parts.pop()                   # one level up
        else:
            parts.append(p)
    return "/" + "/".join(parts)
```

</details>

```python test
assert resolve("/home/anna", "notes.txt") == "/home/anna/notes.txt"
assert resolve("/home/anna/uni", "../pictures/a.png") == "/home/anna/pictures/a.png"
assert resolve("/home", "./x/../y") == "/home/y"
assert resolve("/home", "../../../etc") == "/etc"
print("All checks passed!")
```

**3.** **Average waiting in arrival order.** Write the `average_wait(demands)` function, which, from a list of CPU demands of tasks arriving at the same time (run in arrival order), computes the average **waiting** time – how long a task waits before it starts (to 2 decimals)!

```python starter
def average_wait(demands):
    return round(sum(demands) / len(demands), 2)
```

<details>
<summary>Solution</summary>

```python solution
def average_wait(demands):
    time, waits = 0, []
    for demand in demands:
        waits.append(time)                   # it waited this long before starting
        time += demand
    return round(sum(waits) / len(waits), 2)
```

</details>

```python test
assert average_wait([6, 2, 1]) == 4.67
assert average_wait([1, 2, 6]) == 1.33
assert average_wait([5]) == 0.0
print("All checks passed!")
```

### Quick check questions

```quiz
? Which path is absolute?
- `../documents`
- `pictures/logo.png`
+ `/var/log/syslog`
- `./start.sh`
! An absolute path starts from the root.

? What is the `rwx` form of the `640` permission?
+ `rw-r-----`
- `rwxr-----`
- `rw-rw----`
- `r--r-----`
! 6 = rw-, 4 = r--, 0 = ---.

? A program waits 90% of its time. What is the CPU utilisation in percent with a single such program?
= 10
! $1 - 0.9 = 0.1$.

? Which command lists the contents of a folder on Linux?
+ `ls`
- `cd`
- `rm`
- `pwd`
! `pwd` prints the current folder, `cd` changes folder.
```
