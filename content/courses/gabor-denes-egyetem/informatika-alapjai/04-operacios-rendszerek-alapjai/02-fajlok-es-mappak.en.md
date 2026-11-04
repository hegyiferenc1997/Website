---
title: Files, Folders, Paths
summary: File name and extension, absolute and relative paths, Windows and Linux file systems, permissions.
minutes: 16
---

## What you will learn

- what a **file**, a **folder** and an **extension** are,
- what a **path** looks like on Windows and Linux, and what a **relative** path is,
- what **file systems** (NTFS, ext4, APFS) and **permissions** are.

## Files and folders

A **file** is a named piece of data on storage. A **folder** (directory) contains files and further folders, which forms a **tree**.

The **extension** at the end of the file name shows its type: `.txt` (text), `.docx` (Word), `.pdf`, `.png`, `.py` (Python), `.exe` (Windows program). On Windows it is worth turning on showing extensions, so nobody can trick you with a malware called `invoice.pdf.exe`.

## Paths

A **path** tells where a file is in the tree.

| System        | Root          | Separator | Example                             |
| ------------- | ------------- | --------- | ----------------------------------- |
| Windows       | drive (`C:\`) | `\`       | `C:\Users\anna\Documents\notes.txt` |
| Linux / macOS | `/`           | `/`       | `/home/anna/Documents/notes.txt`    |

- **Absolute** path: starts at the root (as above).
- **Relative** path: starts at the **current** folder. `.` is the current folder, `..` the parent. If you are in `Documents`, `../Pictures/kep.png` means the image in the neighbouring `Pictures` folder.

```text
/home/anna
├── Documents
│   └── notes.txt
└── Pictures
    └── kep.png
```

On Linux case matters (`Notes.txt` ≠ `notes.txt`), on Windows it does not.

## File systems

The **file system** organises how files are placed on the disk's blocks.

| File system   | Where?               | Note                                                     |
| ------------- | -------------------- | -------------------------------------------------------- |
| NTFS          | Windows              | permissions, journaling                                  |
| ext4          | Linux                | default of most Linux systems                            |
| APFS          | macOS, iOS           | optimised for SSDs                                       |
| FAT32 / exFAT | USB sticks, SD cards | every system reads it; on FAT32 one file is at most 4 GB |

## Permissions

Every file has an **owner** and **rights**: read (**r**), write (**w**), execute (**x**). On Linux you see it like this:

```bash
ls -l notes.txt
# -rw-r--r-- 1 anna anna 120 Nov  4 10:00 notes.txt
#  owner: rw-, group: r--, everyone else: r--
```

## Summary

- File = named data; the extension shows its type.
- Windows: `C:\…\…`, Linux: `/…/…`; in a relative path `.` = current, `..` = parent folder.
- File systems: NTFS, ext4, APFS, exFAT; rights: r, w, x.

## Exercise

```quiz required
? Which character separates folders in a **Linux** path?
- `\`
+ `/`
- `:`
- `|`
! E.g. /home/anna/Documents.

? You are in `/home/anna/Documents`. What is the relative path of `kep.png` if it is in `/home/anna/Pictures`?
= ../Pictures/kep.png
! `..` is the parent folder (/home/anna).

? At most how large can a file be on a FAT32 file system (in GB)?
= 4
! That is why a big video doesn't fit on a FAT32 USB stick.

? What does the `x` right mean on Linux?
- read
- write
+ execute
- delete
! r = read, w = write, x = execute.
```
