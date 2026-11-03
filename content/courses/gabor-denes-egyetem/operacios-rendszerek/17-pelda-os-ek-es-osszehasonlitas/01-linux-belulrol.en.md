---
title: Linux from the Inside
summary: The concepts learned in Linux – booting and systemd, processes, the EEVDF scheduler, memory and the OOM killer, directory layout, permissions and package management.
minutes: 25
---

## What you will learn

- how **Linux** implements the main concepts of the course: processes, scheduling, memory, file system, security,
- what is where in the Linux **directory layout**,
- how to look into all this on your Ubuntu VM.

## Booting and process number 1

UEFI → the **GRUB** boot loader → the **kernel** (`/boot/vmlinuz-…`) and a temporary root file system (**initramfs**) → the kernel starts the process with **PID 1**, which on Ubuntu is **systemd**. Every other process is its descendant.

```bash
ps -p 1 -o pid,comm       # process 1: systemd
pstree -p | head          # the process tree
journalctl -b | head      # log of the current boot
```

## Processes and threads

Linux creates a process with the `fork()` + `exec()` pair (topic 4). To the kernel a thread is also just a **task** (`task_struct`) that shares its memory with its parent – that is why threads also appear in the `ps -eLf` list. You can read about every process as files: `/proc/<PID>/status`, `/proc/<PID>/maps`.

## Scheduling

Since Linux 6.6 (2023) it has used the **EEVDF** (_Earliest Eligible Virtual Deadline First_) scheduler, the successor of the earlier **CFS**. Both aim to give every task a **fair share** of CPU time. Priority is given by the **nice** value between **−20** (most important) and **19** (least important), default **0**; real-time processes have separate `SCHED_FIFO` and `SCHED_RR` classes.

```bash
nice -n 10 python3 long.py     # start with lower priority
renice -n 5 -p 1234            # change the priority of a running process
```

## Memory

Demand paging with 4 KiB pages (topic 6). Linux **overcommits**: it promises programs more than the available RAM, because most programs never use it all. If RAM and swap do run out, the **OOM killer** selects and kills a process. Swap can be a partition or a file (`/swap.img` on Ubuntu).

## File system and directory layout

A single root tree (`/`) without drive letters; further disks are attached by **mounting**. Default file system: **ext4** (**Btrfs** on Fedora). "Everything is a file": devices too (`/dev/sda`).

| Directory | What is in it? |
| --- | --- |
| `/etc` | system-wide settings (text files) |
| `/home/<name>` | users' own files |
| `/usr/bin`, `/usr/lib` | programs and libraries |
| `/var/log` | log files |
| `/proc`, `/sys` | the kernel's live data as files (virtual file systems) |
| `/dev` | device files |
| `/tmp` | temporary files |

## Security

Users and groups, `rwx` permissions for owner, group and others (topic 12); **root** can do anything, so we work with `sudo`. Additional mandatory access control: **AppArmor** on Ubuntu, **SELinux** on Fedora.

## Installing software

A package manager with central repositories and signed packages: `sudo apt update && sudo apt upgrade`. Alongside it, distribution-independent formats: **Snap** (Ubuntu), **Flatpak**.

## Summary

- Boot: UEFI → GRUB → kernel + initramfs → systemd (PID 1).
- Thread = task with shared memory; every process is visible in `/proc`.
- Scheduler: EEVDF (since 6.6), nice −20…19; real-time classes.
- Overcommit and the OOM killer; ext4, a single directory tree; `rwx`, sudo, AppArmor/SELinux; apt, Snap, Flatpak.

## Exercise

```quiz required
? How many different nice values exist on Linux (from −20 to 19, including both ends)?
= 40
! 20 negative values, plus 0 and 19 positive ones.

? Which process gets PID 1 on a current Ubuntu system?
= systemd
! Every other process is its descendant.

? Which directory holds the system-wide configuration files on Linux?
+ /etc
- /home
- /tmp
- /dev
! For example /etc/fstab, /etc/hosts.

? What does the OOM killer do?
+ when memory runs out, it selects and kills a process
- it deletes old log files
- it turns off swap
- it reboots the machine
! OOM = Out Of Memory.
```
