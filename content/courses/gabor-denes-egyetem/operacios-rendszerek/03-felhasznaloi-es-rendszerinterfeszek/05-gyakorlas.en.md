---
title: Practice – Interfaces
summary: Review questions, command-line mini exercises and a summary worksheet.
minutes: 25
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
