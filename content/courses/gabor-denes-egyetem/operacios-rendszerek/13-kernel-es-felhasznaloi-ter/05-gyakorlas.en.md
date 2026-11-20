---
title: Practice – Kernel and User Space
summary: Kernel discovery in the Ubuntu VM, review questions and a summary worksheet.
minutes: 50
kind: practice
---

## Kernel discovery

```bash
uname -a                               # kernel name, version, architecture
lsmod | grep -i vbox                   # the VirtualBox guest additions modules
sudo dmesg | grep -i -m5 virtualbox    # what the kernel said about the virtual hardware
ps -eo pid,user,comm | head -15        # [kthreadd] and the other kernel threads
cat /proc/sys/kernel/hostname          # the host name from the kernel
```

Questions: How many modules starting with `vbox` are loaded? Who is the process with PID 2 (`ps -p 2 -o comm`)? (It is `kthreadd`, the "parent" of kernel threads.)

## Review questions

<details>
<summary>1. Why can a faulty driver be more dangerous than a faulty application?</summary>

Because the driver runs in kernel mode with full access to memory and hardware. Its bug can overwrite kernel data and stop the whole system. An application's bug only stops the application.

</details>

<details>
<summary>2. Why does part of the Windows graphics subsystem run in kernel mode if that is risky?</summary>

For performance: in kernel mode drawing needs fewer mode switches and messages. This is the typical compromise of a hybrid kernel between speed and reliability.

</details>

<details>
<summary>3. What is the difference between /proc/cpuinfo and an ordinary text file?</summary>

/proc/cpuinfo takes no space on disk: when you open it, the kernel generates its contents at that moment from current data.

</details>

<details>
<summary>4. Why must the machine be rebooted after a kernel update, but after a browser update only the browser?</summary>

Because the running kernel cannot be replaced on the fly (the new kernel is loaded only at boot), while the browser is a user process that can simply be restarted with the new version.

</details>

## Summary worksheet

```quiz required
? Which kernel type does Windows NT (Windows 10/11) belong to?
- monolithic
- microkernel
+ hybrid
- exokernel
! Modular structure, but many services in kernel mode.

? The correctness of which kernel has been proven mathematically?
= seL4
! A microkernel of the L4 family.

? What is the file extension of Linux kernel modules?
= .ko
= ko
! kernel object

? What is the kernel's stop due to a fatal error called on Linux?
= kernel panic
= panic
! On Windows: blue screen (BSOD).

? Which file is the Windows kernel?
+ ntoskrnl.exe
- explorer.exe
- winlogon.exe
- svchost.exe
! C:\Windows\System32\ntoskrnl.exe

? In which folder can Linux kernel parameters (sysctl) be tuned?
= /proc/sys
! e.g. /proc/sys/vm/swappiness
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **Which kernel is newer?** Kernel versions (e.g. `"6.8.0"`, `"6.11.2"`) can't be compared as text: as text `"6.8" > "6.11"`, yet 6.11 is newer! Write the `newer(a, b)` function, which returns true if version `a` is newer than `b`! (Versions are dot-separated integers; ignore a suffix like `-generic`.)

```python starter
def newer(a, b):
    return a > b
```

<details>
<summary>Solution</summary>

```python solution
def newer(a, b):
    def numbers(v):
        v = v.split("-")[0]                  # "6.8.0-45-generic" → "6.8.0"
        return [int(x) for x in v.split(".")]
    return numbers(a) > numbers(b)           # lists compare element by element
```

</details>

```python test
assert newer("6.11.2", "6.8.0") is True
assert newer("6.8.0", "6.11.2") is False
assert newer("6.8.0-45-generic", "6.8.0") is False
assert newer("7.0", "6.19.3") is True
assert newer("6.8.1", "6.8.0-45-generic") is True
print("All checks passed!")
```

**2.** **Who requests the most interrupts?** Each line of `/proc/interrupts` has an interrupt's name, then the count per core, and finally the device name. Write the `most(lines)` function, which returns the name of the device requesting the most interrupts (summed over all cores)!

```python starter
def most(lines):
    return lines[0].split()[-1]
```

<details>
<summary>Solution</summary>

```python solution
def most(lines):
    best, max_count = None, -1
    for line in lines:
        parts = line.split()
        counts = [int(x) for x in parts[1:] if x.isdigit()]   # per-core counts
        if sum(counts) > max_count:
            best, max_count = parts[-1], sum(counts)
    return best
```

</details>

```python test
lines = [
    "1:      9      0   i8042",
    "16:   120   3400   ehci_hcd",
    "19:  8800   9100   enp0s3",
    "20:   500    700   ahci",
]
assert most(lines) == "enp0s3"
assert most(["5: 1 1 a", "6: 3 0 b"]) == "b"
print("All checks passed!")
```

**3.** **Monolithic versus microkernel.** Write the `mode_switches(requests, messages_per_request)` function, which returns a pair: how many mode switches a monolithic kernel needs (2 per request), and how many a microkernel needs (`messages_per_request` messages per request, 2 mode switches per message)!

```python starter
def mode_switches(requests, messages_per_request):
    return (0, 0)
```

<details>
<summary>Solution</summary>

```python solution
def mode_switches(requests, messages_per_request):
    mono = requests * 2
    micro = requests * messages_per_request * 2
    return (mono, micro)
```

</details>

```python test
assert mode_switches(1000, 4) == (2000, 8000)
assert mode_switches(1, 1) == (2, 2)
assert mode_switches(0, 4) == (0, 0)
print("All checks passed!")
```

### Quick check questions

```quiz
? What happens if a user program writes to an invalid memory address (e.g. a null pointer)?
+ the CPU raises an exception, the kernel terminates the program (Segmentation fault), the system keeps running
- the whole system stops
- nothing, the program keeps running
! User mode isolates the error.

? Which command lists the loaded kernel modules on Linux?
+ lsmod
- ls /home
- ps
- df
! modinfo: a module's details, modprobe: loading/removing.

? What does the /proc directory contain?
+ files generated on the fly by the kernel, not actually on disk (processes, hardware, settings)
- the users' own files
- the installed programs
! E.g. /proc/cpuinfo, /proc/meminfo.

? Which operating system has a hybrid kernel?
- Linux
+ Windows NT
- MINIX 3
! macOS' XNU kernel is hybrid too.

? What is a kernel panic?
+ a fatal kernel error after which the system stops
- a program freezing
- the disk filling up
! On Windows the blue screen (BSOD) corresponds to it.
```
