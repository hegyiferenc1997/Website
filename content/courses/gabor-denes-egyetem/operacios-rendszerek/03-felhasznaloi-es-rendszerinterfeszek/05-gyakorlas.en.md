---
title: Practice – Interfaces
summary: Review questions, command-line mini exercises and a summary worksheet.
minutes: 50
kind: practice
---

## Command-line mini exercises (Ubuntu VM)

1. Create an `os-practice` folder in your home folder with three files (`a.txt`, `b.txt`, `c.txt`) using one command: `touch a.txt b.txt c.txt`.
2. Write today's date into `a.txt`: `date > a.txt`, then append the host name: `hostname >> a.txt`.
3. Count its lines: `wc -l a.txt` (it should be 2).
4. List the `.conf` files of the `/etc` folder and count them with a pipe: `ls /etc/*.conf | wc -l`.
5. Change the script from the lesson so that it also prints the free memory (`free -h`).

## Review questions

<details>
<summary>1. Why is the command line common on servers?</summary>

Because it needs few resources, works well remotely (over SSH), and tasks can be automated with scripts. Many servers have no graphical interface at all.

</details>

<details>
<summary>2. What is the difference between the Bash and the PowerShell pipe?</summary>

In Bash the pipe passes text (a byte stream) that the next program interprets. In PowerShell objects with properties (e.g. Name, CPU) go through the pipe, so you can filter and sort directly.

</details>

<details>
<summary>3. Why is Wayland more secure than X11?</summary>

Under X11 any graphical program can read the other programs' keystrokes and screen contents. With Wayland the compositor isolates the windows; a program only receives its own input.

</details>

<details>
<summary>4. What is the difference between `systemctl start` and `systemctl enable`?</summary>

`start` starts the service right now (until reboot). `enable` makes it start at every boot but does not start it now (that is what `enable --now` is for).

</details>

## Summary worksheet

```quiz required
? Which program interprets the commands typed into the terminal?
+ the shell
- the kernel
- the compositor
- the boot loader
! Usually Bash on Linux, PowerShell on Windows.

? How many lines does `wc -l` print for the file written first by `date >` and then by `hostname >>`?
= 2
! > creates the first line, >> appends the second.

? Which command deletes a file on Linux?
= rm
! Careful: there is no recycle bin, deletion is final.

? Which command shows the log of a systemd service?
+ journalctl -u servicename
- systemctl enable servicename
- cat /dev/null
- service --log
! journalctl -u ssh --since today

? Which PowerShell cmdlet lists the services?
= Get-Service
! Get-Service -Name Spooler

? Which desktop environment from the lesson's examples is the lightest (few resources)?
- GNOME
- KDE Plasma
+ Xfce
- Aqua
! Xubuntu uses it; it is good for older machines too.
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **Your own `wc`.** Write the `wc(text)` function, which returns a triple: the number of **lines** (the number of `\n` characters, as with the real `wc -l`), the number of **words** (separated by spaces and line ends), and the number of **characters**.

```python starter
def wc(text):
    return (0, 0, 0)
```

<details>
<summary>Solution</summary>

```python solution
def wc(text):
    lines = text.count("\n")          # wc -l counts line endings
    words = len(text.split())         # split() without an argument: on any whitespace
    return (lines, words, len(text))
```

</details>

```python test
assert wc("hello kernel\nhi shell\n") == (2, 4, 22)
assert wc("") == (0, 0, 0)
assert wc("one  two   three") == (0, 3, 16)
print("All checks passed!")
```

**2.** **Your own `grep -c`.** Write the `grep_c(lines, pattern, ignore_case=False)` function: how many lines contain the pattern? If `ignore_case` is true (like `grep -i`), upper and lower case shouldn't matter.

```python starter
def grep_c(lines, pattern, ignore_case=False):
    return 0
```

<details>
<summary>Solution</summary>

```python solution
def grep_c(lines, pattern, ignore_case=False):
    if ignore_case:
        pattern = pattern.lower()
        lines = [s.lower() for s in lines]
    return sum(1 for s in lines if pattern in s)
```

</details>

```python test
log = ["ERROR disk", "info start-up", "error network", "Warning", "ERROR memory"]
assert grep_c(log, "ERROR") == 2
assert grep_c(log, "error", ignore_case=True) == 3
assert grep_c(log, "none") == 0
print("All checks passed!")
```

**3.** **Where does the shell look for the command?** The shell searches the directories of the `PATH` variable **in order**, and runs the **first** match. Write the `which(command, path, existing)` function: `path` is a colon-separated list of directories, `existing` is the set of full paths of existing files. Return the path of the first match, or `None`!

```python starter
def which(command, path, existing):
    return None
```

<details>
<summary>Solution</summary>

```python solution
def which(command, path, existing):
    for directory in path.split(":"):        # in order, the first wins
        candidate = directory.rstrip("/") + "/" + command
        if candidate in existing:
            return candidate
    return None
```

</details>

```python test
files = {"/usr/bin/python3", "/usr/local/bin/python3", "/bin/ls"}
assert which("python3", "/usr/local/bin:/usr/bin:/bin", files) == "/usr/local/bin/python3"
assert which("python3", "/usr/bin:/usr/local/bin", files) == "/usr/bin/python3"
assert which("ls", "/usr/bin:/bin", files) == "/bin/ls"
assert which("none", "/usr/bin:/bin", files) is None
print("All checks passed!")
```

### Quick check questions

```quiz
? What does echo $? print if the previous command ran successfully?
= 0
! Exit code 0 means success, anything else an error.

? What does command1 && command2 do?
+ command2 runs only if command1 succeeded
- command2 runs in any case
- the two commands run in parallel
! || is the opposite: it runs the second only on failure.

? Which files does the pattern *.txt match?
+ every file ending in .txt in the current directory (except hidden ones starting with a dot)
- only the file called txt
- every file in subdirectories too
! The shell expands the pattern, not the program.

? What is the difference between the > and >> redirections?
- there's no difference
+ > overwrites the file, >> appends to its end
- >> redirects the error output
! The error output is 2>.

? How can you work on a server without a graphical interface?
+ with a command-line interface, for example over SSH
- only by connecting a monitor
- you can't
! Most servers run without a graphical interface.
```
