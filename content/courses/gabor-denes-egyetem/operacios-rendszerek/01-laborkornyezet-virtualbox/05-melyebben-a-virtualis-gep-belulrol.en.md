---
title: Deeper – The Virtual Machine from the Inside and Your First Hour in the Terminal
summary: How the hypervisor works, what happens to the virtual disk and snapshots, how to share the host's resources wisely, how to log in to the guest with SSH – and a guided first hour in the Ubuntu terminal and PowerShell.
minutes: 40
---

## What you will learn in this lesson

- how a **guest operating system** runs inside another OS (type 1 and type 2 hypervisors),
- what a **dynamically allocated** and a **fixed-size** virtual disk are, and how a **snapshot** is built,
- how to **share** the processor and memory between the host and the guests,
- how to reach the guest from the host with **SSH** (port forwarding in NAT mode),
- and a guided **first hour in the terminal**, which every later topic of the course builds on.

## 1. Three viewpoints: what is a virtual machine?

**From the user's viewpoint** a virtual machine is a window with a whole computer running inside: its own desktop, its own files, its own restart.

**From the host's viewpoint** a virtual machine is a few **files** on the disk (the settings in a `.vbox` file, the disk in a `.vdi` file) and a **process** that asks for memory and processor time – just like a browser.

**From the guest OS's viewpoint** there's nothing special at all: it "sees" a processor, memory, a disk and a network card, and believes it runs on real hardware. The hypervisor's job is to maintain this illusion.

**Analogy:** a virtual machine is like a theatre set. The actor (the guest OS) feels they're in a real room, while behind the walls the stagehand (the hypervisor) moves things around.

## 2. How does the guest run? – the hypervisor

The **hypervisor** (virtual machine monitor) is the software that runs virtual machines. There are two main kinds:

| Type                      | Where does it run?                             | Examples                            | Typical use                |
| ------------------------- | ---------------------------------------------- | ----------------------------------- | -------------------------- |
| **Type 1** ("bare metal") | directly on the hardware, no other OS below it | VMware ESXi, Microsoft Hyper-V, KVM | servers, cloud             |
| **Type 2** ("hosted")     | as an application on an ordinary OS            | **VirtualBox**, VMware Workstation  | desktop, learning, testing |

Most guest code runs **directly on the processor**, at full speed – that's why a virtual machine isn't slow. Only for **sensitive instructions** (e.g. accessing hardware, switching the memory map) does the hypervisor need to step in. The processor's **hardware virtualisation** extension (Intel **VT-x**, AMD **AMD-V**) makes this efficient: when the guest tries to execute such an instruction, the processor sets a "trap" and hands control to the hypervisor. That's why you had to enable virtualisation in the BIOS/UEFI in lesson 1.

The disk, network and display, however, are **emulated** or **paravirtualised** devices: the guest sends data to a "made-up" network card, and the hypervisor forwards it on the host's real card. **Guest Additions** are drivers that know they're running in a virtual machine, so they communicate with the hypervisor faster and with fewer tricks.

## 3. The virtual disk and snapshots

### Dynamic or fixed size?

When you specified a 25 GB disk while creating the machine, VirtualBox offered two options:

| Disk type                 | How big is the file at first? | Advantage           | Disadvantage                                 |
| ------------------------- | ----------------------------- | ------------------- | -------------------------------------------- |
| **dynamically allocated** | a few MB, and it grows        | takes little space  | slightly slower writes, grows "unexpectedly" |
| **fixed size**            | the full 25 GB at once        | faster, predictable | takes the space immediately                  |

Important: a dynamic disk **doesn't shrink by itself**. If you download 5 GB in the guest and then delete it, the `.vdi` file on the host stays 5 GB larger – the guest only "marks the blocks as free", and the hypervisor doesn't know about it.

### How does a snapshot work?

A snapshot **doesn't copy** the whole disk (that would take minutes). Instead, VirtualBox **freezes** the original disk file, and from then on writes every change to a new **differencing image**.

```text
[ base.vdi ]  ←  [ {snapshot-1}.vdi ]  ←  [ {snapshot-2}.vdi ]  ←  current state
  frozen           only the changes          only the changes        writes go here
```

**Analogy:** layers of tracing paper on a drawing. You don't touch the base drawing; every change is drawn on a transparent sheet laid on top. To restore, you simply lift off the top sheets.

Several practical consequences follow:

- **Restoring** = throwing away the top differencing image – that's why it's fast.
- Many snapshots → a long chain → every read has to look through more files, and it takes **a lot of space**.
- When you **delete** a snapshot, its changes must be **merged** with the neighbouring layer – this can take a while; don't switch the machine off meanwhile.
- If **base.vdi** is damaged or lost, all snapshots are useless. That's why it's not a backup!

### Clones: full or linked

**Cloning** makes a new machine from an existing one. A **full clone** copies every disk (slow, lots of space, but independent); a **linked clone** builds on the original disk with a differencing image, like a snapshot (fast, little space, but doesn't work without the original machine). A linked clone is good when you want several experimental machines from the same clean installation.

## 4. Sharing resources – let's calculate!

The guests live on the host's resources. If you give them too much, **the host** slows down (and the guests with it); if too little, the guest becomes unusable.

Rules of thumb:

- **Memory:** the host should keep at least 4–6 GB for its own system and the browser. The total memory of the guests **running at the same time** shouldn't exceed about half to two thirds of the physical memory.
- **Processor:** give a guest at most half of the **physical cores**. Two vCPUs are plenty for a learning Ubuntu.
- **Disk:** the **total** maximum size of the dynamic disks + the snapshots must fit on the host.

A small Python planner that tells you whether your two machines fit at the same time. Change it to your own computer's data!

```python run
# Virtual machine planner: do the guests fit on the host at the same time?
host_ram_gb = 16           # the host's physical memory
host_cores = 8             # physical processor cores
host_keeps_gb = 6          # what the host needs (OS + browser)

guests = {                 # name: (RAM GB, vCPU)
    "Ubuntu-OS": (4, 2),
    "Windows11": (6, 2),
}

ram_total = sum(ram for ram, _ in guests.values())
cpu_total = sum(cpu for _, cpu in guests.values())

print(f"Total guest memory: {ram_total} GB")
print(f"Left for the host: {host_ram_gb - ram_total} GB (at least {host_keeps_gb} needed)")
print(f"Total vCPUs: {cpu_total} / {host_cores} cores")

if host_ram_gb - ram_total < host_keeps_gb:
    print("⚠ Don't run them at the same time, or give them less memory!")
elif cpu_total > host_cores:
    print("⚠ You've assigned more vCPUs than you have cores – it will be slow.")
else:
    print("✓ The two machines can comfortably run at the same time.")
```

## 5. Logging in to the guest with SSH (NAT + port forwarding)

In NAT mode the guest can reach the internet outwards, but it isn't visible **from outside** (not even from the host). If you'd still like to run commands on Ubuntu from the host's terminal – convenient copy-paste, several windows –, you can set up **port forwarding**: VirtualBox forwards a connection arriving at a port of the host to a port of the guest.

1. In the Ubuntu guest, install and start the SSH server:

   ```bash
   sudo apt install openssh-server
   systemctl status ssh        # should be "active (running)"
   ```

2. In VirtualBox: the machine's **Settings → Network → Adapter 1 (NAT) → Advanced → Port Forwarding**, new rule: host port **2222**, guest port **22**, protocol TCP.
3. From the host's terminal (Windows PowerShell has `ssh` too):

   ```powershell
   ssh -p 2222 username@127.0.0.1
   ```

`127.0.0.1` is the host's own address; VirtualBox "redirects" port 2222 to the guest's port 22 (SSH). With the same method you can also reach a web server running in a guest from the host's browser (e.g. host 8080 → guest 80).

**Security note:** by default port forwarding may listen on all of the host's network addresses. If you enter `127.0.0.1` in the "Host IP" field, connections are only possible from your own computer – so strangers on the café Wi-Fi can't try your guest's password.

## 6. Your first hour in the terminal – a guided tour

Almost every topic of the course asks for a command or two on the lab machines. This tour takes you through the most important ones in 20 minutes. Open a terminal on Ubuntu (**Ctrl + Alt + T**) and type them in order!

### Where am I, what's here?

```bash
whoami              # who am I? (your username)
pwd                 # where am I? (print working directory) – e.g. /home/anna
ls                  # what's here?
ls -la              # in detail, including hidden files (starting with a dot)
cd /etc             # go to the /etc directory (system settings)
cd ~                # back to your own folder (~ is short for "home")
```

### Creating and reading files

```bash
mkdir lab                       # new folder
cd lab
echo "Hello, OS!" > first.txt   # write text to a file (> overwrites, >> appends)
cat first.txt                   # the file's contents
nano first.txt                  # simple text editor (save: Ctrl+O, exit: Ctrl+X)
cp first.txt copy.txt           # copy
mv copy.txt renamed.txt         # move / rename
rm renamed.txt                  # delete – there is NO recycle bin!
```

### What can this machine do?

```bash
uname -r                 # the kernel version
cat /etc/os-release      # the distribution's name and version
nproc                    # number of processor cores
free -h                  # memory (-h: human-readable, e.g. 3.8Gi)
df -h /                  # free space on the root file system
ip -brief address        # network interfaces and IP addresses
```

### Getting help

```bash
man ls          # the command's manual (quit: q, search: /word)
ls --help       # short help
```

### The same on Windows 11 (PowerShell)

| Task          | Ubuntu (bash)         | Windows (PowerShell)                                          |
| ------------- | --------------------- | ------------------------------------------------------------- |
| where am I?   | `pwd`                 | `Get-Location` (short: `pwd`)                                 |
| what's here?  | `ls -la`              | `Get-ChildItem -Force` (short: `ls`)                          |
| change folder | `cd /etc`             | `Set-Location C:\Windows` (`cd`)                              |
| file contents | `cat first.txt`       | `Get-Content first.txt` (`cat`)                               |
| OS version    | `cat /etc/os-release` | `Get-ComputerInfo -Property OsName, OsVersion`                |
| processors    | `nproc`               | `(Get-CimInstance Win32_Processor).NumberOfLogicalProcessors` |
| help          | `man ls`              | `Get-Help Get-ChildItem`                                      |

PowerShell knows many bash command names as **aliases**, but something different works in the background: PowerShell passes **objects** between commands, bash passes **text**. There's more about this in the user interfaces topic.

**Tip:** the **Tab** key completes command and file names, and the **↑** arrow brings back previous commands. These two keys save half of the typing.

## Summary

- To the host, a virtual machine is files + a process; to the guest, a real computer.
- VirtualBox is a **type 2** hypervisor; guest code runs directly on the processor with VT-x/AMD-V, and the hypervisor only steps in for sensitive instructions.
- A **snapshot** is a chain of differencing images: restoring is fast, deleting involves merging, and without the base disk it's worth nothing.
- When sharing resources, the host must keep enough memory and cores too.
- In NAT mode you can reach the guest with SSH through **port forwarding** (e.g. 2222 → 22).
- The basic terminal commands (`pwd`, `ls`, `cd`, `cat`, `nano`, `free`, `df`, `man`) accompany you through the course.

## Exercise

```quiz required
? What type of hypervisor is VirtualBox?
- type 1 (runs directly on the hardware)
+ type 2 (runs as an application on an ordinary OS)
! You install VirtualBox on Windows, macOS or Linux, like a program.

? What does VirtualBox do when you take a snapshot?
- copies the whole virtual disk
+ freezes the disk and writes further changes to a differencing image
- saves the disk to the cloud
- compresses the disk file
! That's why taking a snapshot and restoring are fast.

? In a guest with a dynamic disk you download and then delete a 5 GB file. What happens to the size of the .vdi file on the host?
- it shrinks by 5 GB
+ it stays roughly the same
- it doubles
! A dynamic disk doesn't shrink by itself: the guest only marks the blocks as free.

? The host has 16 GB of memory, and it must keep at least 6 GB. At most how many GB of memory can the guests running at the same time get in total?
= 10
! 16 − 6 = 10 GB.

? In NAT mode you set up port forwarding: host 2222 → guest 22. Which command logs you in to the guest from the host?
- ssh username@10.0.2.15
+ ssh -p 2222 username@127.0.0.1
- ssh -p 22 username@2222
! You connect to port 2222 of the host's own address, which VirtualBox forwards to the guest's port 22.

? Which command tells you on Ubuntu which directory you're in?
= pwd
! print working directory
```
