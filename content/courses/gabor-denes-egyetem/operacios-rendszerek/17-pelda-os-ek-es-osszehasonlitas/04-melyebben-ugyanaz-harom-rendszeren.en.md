---
title: Deeper – The Same Task on Three Systems
summary: Parallel boot and the critical path (systemd simulator), the cost of fork() and CreateProcess, paths and letter case with Python (collisions when copying to Windows, forbidden file names), line endings (CRLF versus LF) and git, and the "promise" of memory – Linux overcommit and the Windows commit limit by calculation.
minutes: 45
---

## What you will learn in this lesson

- how **parallel** start-up speeds up booting, and what the **critical path** is,
- why `fork()` is cheap even for a large process, and how Windows' `CreateProcess` differs,
- what traps await when you move files between **Linux, Windows and macOS** (letter case, forbidden names, paths),
- why a script "breaks" if you saved it on Windows (**CRLF** versus **LF**), and how git handles this,
- how Linux and Windows **promise** memory – and what happens when the promise can't be kept.

This lesson also sums up the course: each point shows a concept from an earlier topic (processes, file systems, memory) through the **differences** between the three systems.

## 1. Parallel start-up and the critical path

The old Linux init (SysV) started services **one after another**. `systemd` (and macOS' `launchd`) starts **in parallel** everything whose dependencies are already ready. Then the boot time isn't the sum but the **critical path**: the length of the longest chain in the dependency graph.

```python run
# Starting services one after another and in parallel (with dependencies)
services = {
    # name: (start-up time in s, dependencies)
    "disks":       (1.0, []),
    "logging":     (0.5, ["disks"]),
    "network":     (2.0, ["disks"]),
    "time_sync":   (0.5, ["network"]),
    "ssh":         (0.3, ["network"]),
    "database":    (3.0, ["disks", "logging"]),
    "web_server":  (1.0, ["network", "database"]),
    "desktop":     (2.5, ["disks"]),
}

done = {}                                         # name → when it finished
def done_time(name):
    if name not in done:
        t, deps = services[name]
        start = max((done_time(d) for d in deps), default=0)   # once all dependencies are done
        done[name] = start + t
    return done[name]

sequential = sum(t for t, _ in services.values())
parallel = max(done_time(n) for n in services)
print(f"one after another (SysV): {sequential:.1f} s")
print(f"in parallel (systemd):    {parallel:.1f} s")

# Trace the critical path back from the last one to finish
name = max(done, key=done.get)
path = [name]
while services[name][1]:
    name = max(services[name][1], key=lambda d: done[d])        # the latest dependency
    path.append(name)
print("critical path:", " → ".join(reversed(path)))
```

If you want to speed up booting, only speeding up a service **on the critical path** helps – the `desktop`'s 2.5 s doesn't matter, because it runs in parallel with the longer chain. The same idea as the critical path method in project management. On a real system:

```bash
systemd-analyze                      # how long the boot took (kernel + user space)
systemd-analyze blame | head -10     # the slowest units
systemd-analyze critical-chain       # the critical path!
```

On Windows, Task Manager's **Startup** tab shows each program's "startup impact"; on macOS `launchctl list` shows the services managed by `launchd`.

## 2. fork() versus CreateProcess – what does a new process cost?

On Linux and macOS, starting a new program takes two steps: **`fork()`** (the process copies itself), then **`exec()`** (the copy replaces itself with the new program). At first it sounds wasteful: why copy a 1 GB process if we throw it away right after? The answer is **copy-on-write**: `fork()` actually copies only the **page table**, and the two processes share the pages, write-protected.

```python run
# What actually has to be copied on fork()?
PAGE = 4096                       # page size (bytes)
ENTRY = 8                         # size of one page table entry (bytes)

for size_gb in [0.1, 1, 8]:
    pages = int(size_gb * 1024**3 / PAGE)
    table_mb = pages * ENTRY / 1024**2
    print(f"{size_gb:>4} GB process: {pages:>9,} pages → only ~{table_mb:6.1f} MB "
          f"of page table copied ({table_mb / (size_gb * 1024):.2%})")
```

For a 1 GB process, `fork()` copies about **2 MB** of page table – 0.2% of the memory. And if the child calls `exec()` immediately, nobody ever writes the shared pages, so nothing gets copied at all.

**Windows** thinks differently: `CreateProcess` creates an **empty** process in a single call and loads the new program into it straight away – there's no "copy myself" step. This is cleaner, but it's why Windows can't cheaply imitate `fork()`: Cygwin's (a Unix layer for Windows) `fork()` is slow, and that's why **WSL 2** runs a real Linux kernel in a lightweight VM. Modern Unix programs increasingly use **`posix_spawn()`**, which follows the Windows-style "one step" approach.

| Aspect                     | `fork()` + `exec()`                                   | `CreateProcess`                             |
| -------------------------- | ----------------------------------------------------- | ------------------------------------------- |
| steps                      | 2: copy, then replace                                 | 1: new, empty process with the new program  |
| what does the child inherit? | almost everything (open files, environment)         | what you specify in the parameters          |
| redirection in the shell   | rewires descriptors between `fork` and `exec`         | in the call's parameters (STARTUPINFO)      |
| cheap?                     | yes, with copy-on-write                               | yes, but there's no cheap "copy" operation  |

## 3. File names: letter case, forbidden names, paths

The three systems treat file names differently. **Linux** (ext4) distinguishes upper and lower case, **Windows** (NTFS) and **macOS** (APFS) by default **don't** (but preserve what you typed). If a Linux project has both `Readme.txt` and `README.txt`, copying it to Windows or a Mac makes one **overwrite** the other!

```python run
# File name checker: what would cause trouble on Windows or macOS?
FORBIDDEN_CHARS = set('<>:"/\\|?*')
RESERVED = {"CON", "PRN", "AUX", "NUL"} | {f"COM{i}" for i in range(1, 10)} | {f"LPT{i}" for i in range(1, 10)}

def windows_problems(name):
    problems = []
    if FORBIDDEN_CHARS & set(name):
        problems.append("forbidden char: " + "".join(sorted(FORBIDDEN_CHARS & set(name))))
    if name.split(".")[0].upper() in RESERVED:
        problems.append("reserved device name")
    if name.endswith((" ", ".")):
        problems.append("ends with a space or dot")
    return problems

files = ["Readme.txt", "README.txt", "notes:draft.md", "con.txt",
         "data.csv ", "café.png", "Café.png", "fine.py"]

for f in files:
    p = windows_problems(f)
    print(f"{f!r:<20} {'; '.join(p) if p else 'fine'}")

# Looking for letter-case collisions (Windows, macOS default)
seen = {}
for f in files:
    key = f.casefold()
    if key in seen:
        print(f"COLLISION: {seen[key]!r} and {f!r} would be the same on Windows and macOS")
    seen[key] = f
```

**`con.txt`** is especially sneaky: since the DOS era Windows has reserved the name `CON` (console) as a device name, so traditionally you can't create such a file even with an extension (Windows 11 has relaxed this in part, but many programs and tools still fail on it). So if your project runs on **several systems**, use lower-case file names without accents or spaces – that's the safest.

Don't build paths by hand with `"/"` or `"\\"` either: Python's `pathlib` module knows the rules of each system.

```python run
# Paths in the two worlds – with pathlib "pure" (text-only) paths
from pathlib import PurePosixPath, PureWindowsPath

linux = PurePosixPath("/home/anna/project") / "data" / "measurement.csv"
windows = PureWindowsPath("C:/Users/Anna/project") / "data" / "measurement.csv"
print("Linux:  ", linux, "  parts:", linux.parts)
print("Windows:", windows, "  parts:", windows.parts)

# Letter case: comparing Windows paths is case-insensitive
print(PureWindowsPath(r"C:\Users\Anna\DOC.txt") == PureWindowsPath(r"c:\users\anna\doc.txt"))
print(PurePosixPath("/home/anna/DOC.txt") == PurePosixPath("/home/anna/doc.txt"))
```

## 4. Line endings: CRLF versus LF

In a text file, the end of a line is marked by one (or two) **invisible** control characters:

- **Linux, macOS**: `\n` (LF, _line feed_, byte 10),
- **Windows**: `\r\n` (CR LF, _carriage return + line feed_, bytes 13 and 10) – from the typewriter era: carriage back, then line feed.

```python run
# The same two lines with two kinds of line ending – byte by byte
text = "echo hello\necho bye\n"
linux_bytes = text.encode()
windows_bytes = text.replace("\n", "\r\n").encode()
print("LF   :", linux_bytes, len(linux_bytes), "bytes")
print("CRLF :", windows_bytes, len(windows_bytes), "bytes")

# What does bash see from a script saved on Windows? The \r is part of the command!
first_line = windows_bytes.split(b"\n")[0].decode()
print("bash gets this as the first line:", repr(first_line))
print("if the shebang is CRLF too:      ", repr("#!/bin/bash\r"), "→ '/bin/bash\\r' doesn't exist!")
```

The classic error: a shell script edited on Windows stops on Linux with `bad interpreter: /bin/bash^M` – `^M` is the visible form of `\r`. The fix:

```bash
file script.sh                # "with CRLF line terminators" → that's the problem
sed -i 's/\r$//' script.sh    # remove the trailing \r (or: dos2unix script.sh)
```

**git** can handle this automatically: on Windows, with `core.autocrlf true`, LF goes into the repository and CRLF into the working directory. The cleanest solution is a **`.gitattributes`** file in the project, because it applies to everyone who clones it:

```text
* text=auto
*.sh text eol=lf
*.bat text eol=crlf
```

You can also see and switch it in the bottom right corner of VS Code (`CRLF` / `LF`).

## 5. The "promise" of memory: overcommit and the commit limit

When a program asks for memory (`malloc`, `VirtualAlloc`), the OS doesn't hand out a physical page yet – it only **promises** one. The page is actually allocated on the first write (page fault). The question: how much may be promised?

- **Windows**: strict accounting. The **commit limit** = physical RAM + page file (`pagefile.sys`) size. If all promises would reach it, a new allocation **fails immediately** – the program can handle the error.
- **Linux**: by default it **overcommits**: it promises more than it has, because programs rarely use everything they asked for. If memory does run out, the **OOM killer** terminates a process – possibly one that wasn't at fault.

```python run
# Promise versus reality: Windows-style strict accounting and Linux-style overcommit
RAM_GB, SWAP_GB = 16, 4
commit_limit = RAM_GB + SWAP_GB                    # Windows: RAM + page file

requests = [("browser", 6, 3), ("IDE", 4, 2), ("database", 8, 6), ("game", 6, 5)]
# (name, requested GB, actually used GB)

promised = used = 0
for name, req, real in requests:
    promised += req
    used += real
    win = "OK" if promised <= commit_limit else "ERROR: commit limit reached"
    lin = "OK" if used <= commit_limit else "OOM killer steps in!"
    print(f"{name:<9} asks {req} GB (uses {real}) → promised total {promised:>2} GB, "
          f"real {used:>2} GB | Windows: {win:<27} | Linux: {lin}")
```

When the game starts, Windows **refuses** the allocation (the promises add up to 24 GB > 20 GB), while Linux **allows** it, because the 16 GB actually used still fits – and if the programs later really started using what they asked for, the OOM killer would come. Which is better? It's a trade-off: Windows is more predictable, Linux uses memory more fully. On Linux the behaviour is adjustable:

```bash
cat /proc/sys/vm/overcommit_memory   # 0 = heuristic (default), 1 = always allow, 2 = strict
grep -i commit /proc/meminfo         # CommitLimit and Committed_AS: the limit and the promises
```

## Summary

- With a parallel boot, the time is the **critical path** of the dependency graph; only speeding up a service on it matters (`systemd-analyze critical-chain`).
- Thanks to **copy-on-write**, `fork()` copies only the page table (~2 MB for 1 GB); Windows' `CreateProcess` starts a new program in one step, and `posix_spawn()` follows this on Unix.
- On Linux file names are case-sensitive, on Windows and macOS by default not → **collisions**; Windows also has forbidden characters and reserved names (`CON`, `NUL`); handle paths with `pathlib`.
- Line ending: Linux/macOS **LF**, Windows **CRLF**; `.gitattributes` and `dos2unix` prevent the `^M` error.
- Windows does strict accounting with the **commit limit** (RAM + page file), Linux **overcommits** and if needed reaches for the **OOM killer**.

## Lesson exercise

```quiz required
? Three services: A (2 s, no dependencies), B (3 s, depends on A), C (4 s, depends on A). How many seconds until all have started with parallel start-up?
= 6
! A is done at 2 s, B and C start in parallel: B finishes at 5, C at 6 s – the critical path is A → C.

? A 2 GB process calls fork(). The page size is 4 KB and a page table entry is 8 bytes. About how many MB of page table are copied?
= 4
! 2 GB / 4 KB = 524,288 pages · 8 bytes = 4 MB.

? A Linux project has both Kep.png and kep.png. What happens if you copy it to Windows with default settings?
- both remain, because their names differ
+ they collide: Windows treats them as the same, one overwrites the other (or the copy reports an error)
- Windows automatically renames them to kep1.png and kep2.png
! NTFS doesn't distinguish upper and lower case by default.

? A script saved on Windows stops on Linux with: bad interpreter: /bin/bash^M. What is the cause?
+ the line endings are CRLF, and the \r became part of the command name
- bash isn't installed
- the script has no execute permission
! sed -i 's/\r$//' script.sh or dos2unix.

? Which system refuses a memory allocation immediately if all promises would exceed the size of RAM + page file?
- Linux with default settings
+ Windows
- both
! Linux overcommits by default, and if needed the OOM killer steps in.
```
