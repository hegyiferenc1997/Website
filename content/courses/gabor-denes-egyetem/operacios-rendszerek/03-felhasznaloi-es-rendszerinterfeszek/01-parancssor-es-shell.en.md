---
title: The Command Line and the Shell
summary: What a shell is, the difference between terminal and shell, and the most important Bash and PowerShell commands.
minutes: 25
---

## What you will learn

- what the **command-line interface** (CLI), the **terminal** and the **shell** are,
- the most important **Bash** commands for managing files and folders,
- the same in **PowerShell**, and what the **pipe** (`|`) and **redirection** (`>`) are for.

## Terminal, shell, command

- The **terminal** (terminal emulator) is the window you type in (Ubuntu: _Terminal_, Windows: _Windows Terminal_).
- The **shell** is the program that **interprets** and executes the typed command. On Linux it is usually **Bash**, on Windows **PowerShell** (or the old `cmd.exe`).
- It is called a "shell" because it is the outer layer around the kernel: through it the user asks for the OS's services.

Why learn it when there is a graphical interface? Because it is **faster**, **automatable** (can be written into a script), and servers often have **no** graphical interface at all.

The structure of a command: `command -options arguments`, e.g. `ls -l /home`.

## Basic commands in Bash (try them in the Ubuntu VM!)

```bash
pwd                     # where am I? (print working directory)
ls -la                  # folder contents, with hidden files, in detail
cd /etc                 # enter a folder; cd ~ = home folder, cd .. = one level up
mkdir lab               # new folder
cd ~/lab
echo "hello OS" > a.txt # write text to a file (overwrites)
echo "second line" >> a.txt   # append to the end of the file
cat a.txt               # file contents
cp a.txt b.txt          # copy
mv b.txt c.txt          # rename / move
rm c.txt                # delete (no recycle bin!)
man ls                  # the manual of ls (quit: q)
```

### Pipe and redirection

- `>` writes the output to a file, `>>` appends, `<` reads from a file.
- The **pipe** (`|`) connects one program's output to the next one's input:

```bash
ls /etc | wc -l               # how many entries are in /etc?
ps aux | grep firefox         # is Firefox running?
history | tail -5             # your last 5 commands
```

The UNIX philosophy: **small programs that do one thing well** and can be connected with pipes.

## The same in PowerShell

| Task           | Bash        | PowerShell (short alias)             |
| -------------- | ----------- | ------------------------------------ |
| where am I     | `pwd`       | `Get-Location` (`pwd`)               |
| listing        | `ls -la`    | `Get-ChildItem -Force` (`ls`, `dir`) |
| change folder  | `cd folder` | `Set-Location folder` (`cd`)         |
| file contents  | `cat a.txt` | `Get-Content a.txt` (`cat`)          |
| copy           | `cp a b`    | `Copy-Item a b` (`cp`)               |
| delete         | `rm a`      | `Remove-Item a` (`rm`, `del`)        |
| search in text | `grep word` | `Select-String word`                 |
| help           | `man ls`    | `Get-Help Get-ChildItem`             |

PowerShell commands (_cmdlets_) have a **Verb-Noun** form (`Get-Process`, `Stop-Service`), and they pass **objects**, not text, through the pipe:

```powershell
# The 3 processes using the most memory.
Get-Process | Sort-Object WorkingSet -Descending | Select-Object -First 3 Name, WorkingSet
```

## Summary

- The terminal is the window, the shell is the command interpreter (Bash, PowerShell).
- Basic commands: `pwd`, `ls`, `cd`, `mkdir`, `cat`, `cp`, `mv`, `rm`, `man`.
- `>` overwrites, `>>` appends, `|` connects programs.
- PowerShell uses Verb-Noun commands and object pipelines.

## Lesson exercise

```quiz required
? Which Bash command prints the full path of the current folder?
= pwd
! print working directory

? What is the difference between `>` and `>>`?
- `>` appends, `>>` overwrites.
+ `>` overwrites the file, `>>` appends to its end.
- There is no difference.
- `>>` writes to two files at once.
! echo "x" >> a.txt writes x to the end of the file.

? Which symbol connects one program's output to another one's input?
= |
! This is the pipe, e.g. ls | wc -l

? Which PowerShell cmdlet corresponds to Bash's `cat` command?
+ Get-Content
- Get-ChildItem
- Set-Location
- Select-String
! Get-Content a.txt – cat is also its alias.

? Which command opens the manual of `ls` on Linux?
= man ls
! Quit with the q key.
```
