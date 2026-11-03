---
title: System Programs, Services and Scripts
summary: Utilities, background services (daemons), systemctl and Windows services, and your first shell script.
minutes: 20
---

## What you will learn

- what **system programs** (utilities) are and how they differ from the kernel,
- what a **service** / **daemon** is and how to manage it with `systemctl` and on Windows,
- how to write a simple **shell script** that automates commands.

## System programs

**System programs** (_system utilities_) come with the OS but do **not run in the kernel**. They provide a convenient interface to the kernel's services.

| Group                | Linux example              | Windows example                   |
| -------------------- | -------------------------- | --------------------------------- |
| file management      | `ls`, `cp`, Files          | Explorer, `robocopy`              |
| status information   | `top`, `df`, `free`        | Task Manager, Resource Monitor    |
| text editing         | `nano`, `vim`              | Notepad                           |
| program development  | `gcc`, `python3`, `make`   | Visual Studio, `py`               |
| package management   | `apt`, `snap`              | `winget`, Microsoft Store         |
| communication        | `ssh`, `curl`              | Remote Desktop, `curl`            |

## Services (daemons)

A **service** (traditionally a **daemon** on Linux) is a program that runs **in the background**, without a user window, often started at boot: e.g. the network manager, the print queue, time sync, logging, a web server. On Linux daemon names often end in **d**: `sshd`, `systemd-journald`, `cupsd`.

### Linux: systemd and systemctl

```bash
systemctl list-units --type=service --state=running   # running services
systemctl status ssh                                   # status of one service
sudo systemctl start ssh        # start now
sudo systemctl stop ssh         # stop
sudo systemctl enable ssh       # start together with the system
journalctl -u ssh --since today # today's log of the service
```

(The `ssh` server has to be installed first: `sudo apt install openssh-server`.)

### Windows: services

In the **services.msc** window (Win + R → `services.msc`) you see the services; the **Startup type** can be _Automatic_, _Manual_ or _Disabled_. In PowerShell:

```powershell
Get-Service | Where-Object Status -eq Running | Select-Object -First 5
Get-Service -Name Spooler          # the print queue
# As administrator: Restart-Service Spooler
```

## Your first shell script

A **script** is a sequence of commands in a file that the shell executes one after another. Create it in the Ubuntu VM:

```bash
nano sysinfo.sh
```

```bash
#!/bin/bash
# Short system report: who am I, what runs, how much space is left.
echo "User: $USER"
echo "Host name: $(hostname)"
echo "Kernel: $(uname -r)"
echo "Number of running processes: $(ps -e --no-headers | wc -l)"
df -h / | tail -1
```

```bash
chmod +x sysinfo.sh   # make it executable
./sysinfo.sh          # run it
```

The first line, the **shebang** (`#!/bin/bash`), tells which interpreter should run the file. `$( … )` inserts a command's output into the text. On Windows, `.ps1` PowerShell scripts serve the same purpose.

## Summary

- System programs are utilities running above the kernel (file management, status, development, package management).
- A service/daemon runs in the background; on Linux `systemctl`, on Windows `services.msc` / `Get-Service` manages it.
- A shell script automates commands; the first line is the shebang (`#!/bin/bash`); run `chmod +x` before executing.

## Lesson exercise

```quiz required
? What are background services traditionally called on Linux?
= daemon
= demon
! Their names often end in d: sshd, cupsd.

? Which command makes a service start together with the system?
- sudo systemctl start ssh
+ sudo systemctl enable ssh
- sudo systemctl status ssh
- sudo systemctl list-units
! start only starts it now, enable makes it start at every boot.

? What is the first line `#!/bin/bash` of a script called?
= shebang
! It tells which interpreter should run the file.

? Which command makes the file `sysinfo.sh` executable?
= chmod +x sysinfo.sh
! Permissions are covered in detail in the security topic.

? In which Windows tool (Win + R) do you see and set the startup type of services?
+ services.msc
- notepad.exe
- explorer.exe
- winver
! Startup type: Automatic, Manual or Disabled.
```
