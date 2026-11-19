---
title: Practice – Closing Summary of the Course
summary: A Linux–Windows command dictionary, a comparison task on your two virtual machines, review questions and a closing worksheet covering the whole course.
minutes: 55
kind: practice
---

## Command dictionary: the same task on two systems

| Task                 | Linux (bash)           | Windows (PowerShell)         |
| -------------------- | ---------------------- | ---------------------------- |
| list files           | `ls -l`                | `Get-ChildItem` (`dir`)      |
| change directory     | `cd /tmp`              | `cd C:\Temp`                 |
| file contents        | `cat a.txt`            | `Get-Content a.txt` (`type`) |
| copy / delete        | `cp`, `rm`             | `Copy-Item`, `Remove-Item`   |
| processes            | `ps aux`, `top`        | `Get-Process`, Task Manager  |
| stop a process       | `kill 1234`            | `Stop-Process -Id 1234`      |
| network addresses    | `ip a`                 | `ipconfig`                   |
| services             | `systemctl status ssh` | `Get-Service`                |
| install software     | `sudo apt install git` | `winget install Git.Git`     |
| administrator rights | `sudo …`               | "Run as administrator" (UAC) |

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

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **Boot time with parallel start-up.** The `services` dictionary maps each name to a `(start_up_time, list_of_dependencies)` pair. Write the `boot_time(services)` function: a service can start once all its dependencies have finished; return when the last one finishes (the length of the critical path)!

```python starter
def boot_time(services):
    return sum(t for t, _ in services.values())
```

<details>
<summary>Solution</summary>

```python solution
def boot_time(services):
    done = {}
    def end(name):
        if name not in done:
            t, deps = services[name]
            start = max((end(d) for d in deps), default=0)
            done[name] = start + t
        return done[name]
    return max(end(n) for n in services)
```

</details>

```python test
s = {"A": (2, []), "B": (3, ["A"]), "C": (4, ["A"])}
assert boot_time(s) == 6
s2 = {"disk": (1, []), "net": (2, ["disk"]), "db": (3, ["disk"]), "web": (1, ["net", "db"])}
assert boot_time(s2) == 5
assert boot_time({"one": (7, [])}) == 7
print("All checks passed!")
```

**2.** **Valid Windows file name?** Write the `ok_on_windows(name)` function: false if the name contains any of the characters `<>:"/\|?*`, if its part before the dot is (case-insensitively) a reserved device name (`CON`, `PRN`, `AUX`, `NUL`, `COM1`–`COM9`, `LPT1`–`LPT9`), or if it ends with a space or a dot; otherwise true.

```python starter
def ok_on_windows(name):
    return True
```

<details>
<summary>Solution</summary>

```python solution
FORBIDDEN = set('<>:"/\\|?*')
RESERVED = {"CON", "PRN", "AUX", "NUL"} | {f"COM{i}" for i in range(1, 10)} \
         | {f"LPT{i}" for i in range(1, 10)}

def ok_on_windows(name):
    if FORBIDDEN & set(name):
        return False
    if name.split(".")[0].upper() in RESERVED:
        return False
    return not name.endswith((" ", "."))
```

</details>

```python test
assert ok_on_windows("notes.md") is True
assert ok_on_windows("draft:1.md") is False
assert ok_on_windows("con.txt") is False
assert ok_on_windows("Com3") is False
assert ok_on_windows("console.txt") is True
assert ok_on_windows("data.csv ") is False
print("All checks passed!")
```

**3.** **CRLF to LF.** Write the `to_lf(data)` function: replace every `\r\n` in the byte sequence with `\n`, and return the pair `(new bytes, number of replacements)` – this is what `dos2unix` does.

```python starter
def to_lf(data):
    return (data, 0)
```

<details>
<summary>Solution</summary>

```python solution
def to_lf(data):
    n = data.count(b"\r\n")
    return (data.replace(b"\r\n", b"\n"), n)
```

</details>

```python test
assert to_lf(b"echo hello\r\necho bye\r\n") == (b"echo hello\necho bye\n", 2)
assert to_lf(b"already fine\n") == (b"already fine\n", 0)
assert to_lf(b"") == (b"", 0)
print("All checks passed!")
```

### Quick check questions

```quiz
? Which is the first user process (PID 1) on today's Ubuntu?
+ systemd
- init.exe
- launchd
- bash
! On macOS launchd, on Windows the System process is PID 4.

? Where does Windows store most system and program settings?
+ in the registry
- in the /etc directory
- in .plist files
! On Linux text files in /etc, on macOS .plist files.

? Which file system is the default on today's macOS?
- NTFS
- ext4
+ APFS
! Windows: NTFS, Linux: ext4.

? What is WSL?
+ the Windows Subsystem for Linux: running Linux programs on Windows (WSL 2 with a real Linux kernel)
- a Windows antivirus
- a Linux distribution
! It gives computer engineers a comfortable Linux environment on Windows too.

? Which package manager lets you install programs from the command line on Windows?
+ winget
- apt
- Homebrew
! Ubuntu: apt, macOS: Homebrew (installed separately).
```
