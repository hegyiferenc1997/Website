---
title: Deeper – The Shell as a Programming Language and Text-Processing Machine
summary: What happens after you press Enter, quotes and wildcards, exit codes and conditional execution, environment variables and PATH, a log-analysis pipeline step by step (in Bash, PowerShell and Python), and a real backup script.
minutes: 45
---

## What you will learn in this lesson

- what happens behind the scenes when you press **Enter** after a command,
- the difference between `'…'` and `"…"`, and how the `*` wildcard works,
- what an **exit code** means, and how to chain commands conditionally (`&&`, `||`),
- what **PATH** is, and why a command is sometimes "not found",
- how to build a **text-processing pipeline** step by step – from three viewpoints,
- how to write a script with **conditions and loops**.

## 1. What happens after Enter?

Type into the Ubuntu terminal: `ls -l *.txt`. The shell doesn't simply "hand over" the text to the operating system; it performs several steps:

1. **Splitting:** it breaks the line into words: `ls`, `-l`, `*.txt`.
2. **Expansion:** it replaces `*.txt` with the matching file names (e.g. `a.txt b.txt`), `$USER` with the variable's value, `~` with the path of your home folder.
3. **Lookup:** it finds where the program called `ls` is – in the folders listed in the **PATH** variable (e.g. `/usr/bin/ls`).
4. **New process:** it creates a child process (`fork`) and starts the program in it (`exec`) with the expanded arguments.
5. **Waiting:** it waits until the program finishes, stores its **exit code**, and prints a new prompt.

**Analogy:** the shell is like an interpreter in a restaurant. You say: "I'd like every soup"; the interpreter looks at the menu, expands this to "goulash, chicken soup, mushroom soup", finds which cook makes them, passes on the order, and waits until it's ready.

You can try this out:

```bash
type ls          # what is "ls"? (alias, built-in command or program?)
which python3    # where is the program on the disk?
echo $PATH       # which folders the shell searches, separated by colons
echo *.txt       # what the shell expands the pattern to (echo just prints it)
```

Step 4 (fork + exec) comes up in detail in the processes topic: every command you type becomes a **new process**.

## 2. Quotes and wildcards

Expansion is useful, but it can also cause surprises. Quotes control it:

| Notation         | What happens?                                              | Example                       | Result                    |
| ---------------- | ---------------------------------------------------------- | ----------------------------- | ------------------------- |
| no quotes        | every expansion happens, spaces separate words             | `echo $HOME *.txt`            | `/home/anna a.txt b.txt`  |
| `"…"` (double)   | variables expand, `*` and spaces don't                     | `echo "$HOME *.txt"`          | `/home/anna *.txt`        |
| `'…'` (single)   | **nothing** expands, it stays literally                    | `echo '$HOME *.txt'`          | `$HOME *.txt`             |

A common mistake: a file name containing a space. `rm My document.txt` tries to delete **two** files (`My` and `document.txt`)! Correctly: `rm "My document.txt"`. In scripts, always put variables in double quotes: `"$file"`.

Wildcards (_globs_):

| Pattern    | Meaning                           | Example                                |
| ---------- | --------------------------------- | -------------------------------------- |
| `*`        | any number of (even 0) characters | `*.log` – every file ending in `.log`  |
| `?`        | exactly one character             | `day?.txt` – `day1.txt`, `day2.txt`    |
| `[abc]`    | one character from the list       | `[ab]*.txt` – starting with `a` or `b` |

Careful: a glob is **not** a regular expression! Here `*` means "anything", in a regex "the previous character any number of times".

## 3. Exit codes and conditional execution

Every program ends with an **exit code**: **0 = success**, anything else = some error. The last command's code is in the `$?` variable:

```bash
ls /etc > /dev/null ; echo $?        # 0 – succeeded
ls /no-such-dir     ; echo $?        # 2 – error (no such folder)
```

(`/dev/null` is a "black hole": whatever you write into it disappears. Useful when you don't care about the output.)

Building on the exit code, you can chain commands:

| Chaining   | Meaning                                           | Example                                         |
| ---------- | ------------------------------------------------- | ----------------------------------------------- |
| `a ; b`    | `a`, then `b` in any case                         | `cd /tmp ; ls`                                  |
| `a && b`   | `b` only runs if `a` **succeeded**                | `sudo apt update && sudo apt upgrade`           |
| `a \|\| b` | `b` only runs if `a` **failed**                   | `ping -c1 example.com \|\| echo "No network!"`  |

`apt update && apt upgrade` is a good habit because if updating the package list fails (e.g. no internet), the upgrade doesn't even start.

## 4. Environment variables and PATH

**Environment variables** are name–value pairs that every started program receives from its parent:

```bash
echo $USER $HOME $SHELL      # a few built-in variables
env | head                   # all environment variables (the start)
export COLOUR=blue           # your own variable that child processes see too
bash -c 'echo $COLOUR'       # a new shell (child process) sees it too: blue
```

The most important of them is **PATH**: if you type `python3`, the shell looks through the PATH folders in order and starts the **first** match. If you install a program into a folder that isn't on the PATH, the shell gives a "command not found" error – even though the program is there. Solution: start it with its full path (`./program` or `/opt/tool/bin/program`), or add the folder to PATH:

```bash
export PATH="$PATH:$HOME/bin"     # put the ~/bin folder at the end of the list
```

**Security note:** never put the current folder (`.`) at the **start** of PATH! If someone leaves malware called `ls` in a folder and you type `ls` there, their program would run instead of the real one. (That's why on Linux you have to start your own program as `./program`.)

Windows has a PATH too (`$env:Path` in PowerShell), and it works the same way; you can also edit environment variables in the *System → Advanced system settings → Environment Variables* window.

## 5. Case study: log analysis with a pipeline

**Task:** in a web server's log every line is a request. Which IP address sent **the most** requests? (This is a real system administrator question: this is how you can spot an attacker, for example.)

Create a sample log in the Ubuntu VM:

```bash
cat > access.log << 'END'
10.0.0.5 GET /index.html 200
10.0.0.7 GET /login 200
10.0.0.5 GET /images/logo.png 200
192.168.1.66 POST /login 401
192.168.1.66 POST /login 401
10.0.0.9 GET /index.html 200
192.168.1.66 POST /login 401
10.0.0.5 GET /about 404
END
```

(`<< 'END'` is a so-called _here document_: it sends the following lines up to the `END` line to the command's input.)

Build the pipeline **step by step**, and look at the output after every step:

```bash
cut -d ' ' -f 1 access.log                                   # 1. only the first field (IP address)
cut -d ' ' -f 1 access.log | sort                            # 2. sorted (identical ones end up next to each other)
cut -d ' ' -f 1 access.log | sort | uniq -c                  # 3. adjacent identical lines counted
cut -d ' ' -f 1 access.log | sort | uniq -c | sort -nr       # 4. by count descending
cut -d ' ' -f 1 access.log | sort | uniq -c | sort -nr | head -1   # 5. only the first
```

Each program does **one thing**, and the pipe connects them. `uniq` only merges **adjacent** duplicates – that's why `sort` is needed before it.

One more question: who got a **401** (failed login) response?

```bash
grep ' 401$' access.log | cut -d ' ' -f 1 | sort -u          # -u: every address once
```

### The same in PowerShell – with objects

PowerShell passes objects, not text lines, so the "fields" get names:

```powershell
Get-Content access.log |
  ForEach-Object { ($_ -split ' ')[0] } |        # the first field of every line
  Group-Object |                                  # grouping (sort + uniq -c in one)
  Sort-Object Count -Descending |
  Select-Object -First 1 Count, Name
```

### The same in Python – as a program

You can write the same line of thought in a programming language too. Run it and compare the steps!

```python run
# The pipeline's steps in Python: cut the field → count → sort → first.
from collections import Counter

log = """10.0.0.5 GET /index.html 200
10.0.0.7 GET /login 200
10.0.0.5 GET /images/logo.png 200
192.168.1.66 POST /login 401
192.168.1.66 POST /login 401
10.0.0.9 GET /index.html 200
192.168.1.66 POST /login 401
10.0.0.5 GET /about 404"""

ips = [line.split(" ")[0] for line in log.splitlines()]      # cut -d ' ' -f 1
counter = Counter(ips)                                        # sort | uniq -c
for ip, cnt in counter.most_common():                         # sort -nr
    print(f"{cnt:3} {ip}")
print("Most requests:", counter.most_common(1)[0])            # head -1

failed = sorted({line.split(" ")[0] for line in log.splitlines() if line.endswith(" 401")})
print("Failed logins from:", failed)                          # grep ' 401$' | cut | sort -u
```

**Three viewpoints, one task:** Bash transforms text lines through a chain of small programs, PowerShell transforms objects, and Python transforms data structures (list, dictionary). For a quick one-off question the pipeline is fastest; if the logic gets complicated (several conditions, error handling), it's worth writing a program.

## 6. A script with conditions and loops – a real backup script

In the previous lesson you saw a simple script. Now let's write a useful one: **back up** all `.txt` files of the `~/lab` folder into a folder marked with the date.

```bash
nano backup.sh
```

```bash
#!/bin/bash
# Back up the .txt files of the ~/lab folder into a dated folder.
set -euo pipefail                      # stop on error, don't use non-existent variables

source_dir="$HOME/lab"
target="$HOME/backups/$(date +%Y-%m-%d_%H%M)"   # e.g. backups/2026-11-19_1430

if [ ! -d "$source_dir" ]; then        # if there's no source folder, exit with an error code
  echo "No such folder: $source_dir" >&2
  exit 1
fi

mkdir -p "$target"                     # -p: creates parent folders too
count=0
for file in "$source_dir"/*.txt; do    # loop over all .txt files
  [ -e "$file" ] || continue           # if there are none, the pattern stays literal – skip it
  cp "$file" "$target/"
  count=$((count + 1))                 # arithmetic: $(( ... ))
done

echo "$count files backed up to: $target"
```

```bash
chmod +x backup.sh
./backup.sh
ls ~/backups
```

A few new elements:

- `if [ condition ]; then … fi` – a branch; `-d` = existing folder, `-e` = existing file, `!` = negation.
- `for x in list; do … done` – a loop.
- `>&2` – the error message goes to the error output (_stderr_), not the normal output.
- `set -euo pipefail` – a "seat belt": the script stops at the first error instead of blindly continuing.

## Summary

- After Enter, the shell **splits, expands, looks up (PATH), starts a new process, waits**.
- In `"…"` variables expand, in `'…'` nothing does; always quote file names with spaces.
- **Exit code** 0 = success; `&&` runs the next command only after success, `||` only after an error.
- **PATH** tells where the shell looks for programs; `.` must never be at its start.
- Pipeline: `cut | sort | uniq -c | sort -nr | head` – every program does one thing well. The same in PowerShell with objects, in Python with data structures.
- In scripts, `if`, `for`, variables and `set -euo pipefail` make the work reliable.

## Exercise

```quiz required
? What does the command `echo '$HOME'` print?
- the path of your home folder, e.g. /home/anna
+ literally $HOME
- nothing
! Nothing expands between single quotes.

? Which command correctly deletes the file called "My document.txt"?
- rm My document.txt
+ rm "My document.txt"
- rm My_document.txt
! Without quotes, the shell would treat it as two separate file names.

? Which exit code means that a program ran successfully?
= 0
! Any other value signals some error.

? In the command `ping -c1 example.com || echo "No network!"`, when does echo run?
- always
- if ping succeeded
+ if ping failed
! || only runs the right-hand side on an error.

? Why is `sort` needed before `uniq -c` in the pipeline?
+ because uniq only merges adjacent duplicates
- because uniq only works with sorted numbers
- because sort deletes duplicates
! After sorting, identical lines end up next to each other.

? Which environment variable lists the folders where the shell looks for programs?
= PATH
= $PATH
! E.g. /usr/local/bin:/usr/bin:/bin
```
