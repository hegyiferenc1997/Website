---
title: Users and Permissions
summary: Users and groups, rwx permissions and chmod with octal calculation, root and sudo, Windows UAC and ACLs.
minutes: 30
---

## What you will learn

- how Linux handles **users** and **groups**,
- how to read and set **rwx** permissions and compute the octal **chmod** code,
- what **root** and **sudo** are, and how the same works on Windows (**UAC**, **ACL**).

## Users and groups

Every user has an **identifier** (UID) and at least one **group** (GID). **root** (UID 0) is the administrator: it can do anything.

```bash
id                       # your UID, GID and groups
cat /etc/passwd | tail -3   # users (name:x:UID:GID:description:home:shell)
groups                   # your groups (e.g. sudo, vboxsf)
sudo adduser guest       # new user
sudo usermod -aG lab guest   # add to the lab group
```

## rwx permissions

Every file has an **owner** and a **group**, and it defines three kinds of permission for three kinds of actor:

```bash
ls -l notes.sh
-rwxr-x---  1  anna  lab  120  Nov 3 10:00  notes.sh
│└┬┘└┬┘└┬┘     │     │
│ │  │  │      │     └ group
│ │  │  │      └ owner
│ │  │  └ everyone else (others): ---
│ │  └ the group: r-x
│ └ the owner (user): rwx
└ file type: - = file, d = directory, l = symbolic link
```

| Perm. | On a file                | On a directory                              |
| ----- | ------------------------ | ------------------------------------------- |
| **r** | you may read it          | you may list its contents                   |
| **w** | you may modify it        | you may create and delete files in it       |
| **x** | you may execute it       | you may **enter** it (`cd`)                 |

## chmod in octal

Each permission is a **number**: **r = 4**, **w = 2**, **x = 1**. We add them per actor and write the three digits side by side (owner, group, others):

| Permissions  | Calculation                      | Code    |
| ------------ | -------------------------------- | ------- |
| `rwxr-x---`  | (4+2+1) (4+0+1) (0+0+0)          | **750** |
| `rw-r--r--`  | (4+2) (4) (4)                    | **644** |
| `rwxr-xr-x`  | 7 5 5                            | **755** |
| `rw-------`  | 6 0 0                            | **600** |

```bash
chmod 644 notes.txt       # usual file: I write it, everyone reads it
chmod 755 script.sh       # executable program
chmod 600 ~/.ssh/id_ed25519   # secret key: only me
chmod u+x,g-w file        # symbolically: +x for the owner, −w from the group
sudo chown anna:lab file  # change owner and group
```

The default permissions of new files are set by the **umask** (on Ubuntu usually `0002` or `0022` → a new file gets 664 or 644).

## root and sudo

**sudo** runs a single command with root rights – with **your own** password, and logged (`/var/log/auth.log`). Ubuntu has no separate root password: members of the `sudo` group are administrators. This is the principle of least privilege: you are root only when it is really needed.

## Windows: UAC and ACL

- **UAC** (_User Account Control_): even an administrator works with **restricted rights**; if a program asks for administrator rights, a dimmed screen asks for **approval** (similar to `sudo`).
- **ACL** (_Access Control List_): on NTFS every file has a **list** that grants fine-grained rights (read, write, modify, full control, deny) to arbitrary users and groups. You see it on the file's **Properties → Security** tab.

```powershell
whoami /groups              # which groups you are in
icacls C:\Users\Public      # a folder's ACL
```

(Linux also has ACLs next to classic rwx: `getfacl`, `setfacl`.)

## Summary

- User: UID, group: GID; root's UID is 0.
- Permissions: r = 4, w = 2, x = 1; owner, group, others → e.g. `rwxr-x---` = 750.
- sudo runs one command with root rights, logged.
- Windows: UAC approval and NTFS ACLs.

## Lesson exercise

```quiz required
? What is the octal code of the permissions `rw-rw-r--`?
= 664
! (4+2)(4+2)(4) = 6 6 4.

? What is the octal code of the permissions `rwx------`?
= 700
! Only the owner may read, write and execute.

? What does the `x` permission mean on a directory?
- The directory can be deleted.
+ You may enter the directory (cd).
- The directory can be run as a program.
- The directory is hidden.
! Listing the contents needs the r permission.

? What is the UID of the root user?
= 0
! The administrator's identifier is always 0.

? What is the Windows feature called that asks for approval before an administrator action?
= UAC
= User Account Control
! The Windows equivalent of sudo.
```
