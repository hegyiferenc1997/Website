---
title: Practice – Virtualisation
summary: A live migration simulation in Python, a hands-on task in VirtualBox and with Docker, review questions and a summary worksheet.
minutes: 50
kind: practice
---

## Live migration in numbers

Live migration from the previous lesson proceeds in rounds: first the whole memory is sent, then only what was modified meanwhile. Run it, then try other values (e.g. `dirty_rate = 900`)!

```python run
# Live migration simulation: each round we send the dirty pages, while new ones appear.
memory = 4096         # the VM's memory (MB)
bandwidth = 1000      # network speed (MB/s)
dirty_rate = 200      # this many MB of memory are modified per second while running

to_send = memory      # first round: the whole memory
rnd = 1
while to_send > 50:   # below 50 MB we can pause the VM
    t = to_send / bandwidth                  # this round takes this long
    print(f"round {rnd}: {to_send:7.1f} MB, {t:.3f} s")
    to_send = dirty_rate * t                 # meanwhile this many pages became dirty again
    rnd += 1
print(f"pause: {to_send:.1f} MB left, about {to_send / bandwidth * 1000:.0f} ms downtime")
```

If the VM "dirties" memory faster than the network can transfer it (`dirty_rate >= bandwidth`), the migration would never end – in that case the hypervisor slows the VM down or pauses it earlier.

## Hands-on task

1. In VirtualBox, look at the settings of the Ubuntu VM: **System → Acceleration** – which paravirtualisation interface (_KVM_, _Hyper-V_) is selected?
2. In the Ubuntu VM run: `lscpu | grep -i hypervisor` and `systemd-detect-virt`. What do they print?
3. Install Docker (previous lesson), start a container (`docker run -it --rm ubuntu bash`), and run `ps aux` and `hostname` in it. Compare with the results in the VM.

<details>
<summary>What should you see?</summary>

1. For a Linux guest the default is the **KVM** interface, for Windows **Hyper-V**: through it the guest OS knows it runs in a VM and gets a faster clock and interrupts.
2. `Hypervisor vendor: KVM` and `oracle` (VirtualBox) – the guest knows it is virtualised.
3. In the container only `bash` and `ps` are visible, and the host name is a random ID: the effect of the PID and UTS namespaces. The kernel (`uname -r`), however, is the same as the VM's.

</details>

## Review questions

<details>
<summary>1. Why does a container start faster than a virtual machine?</summary>

Because no kernel has to be loaded and no full operating system started: a container is just a new process on the already running host kernel, with its own namespaces and cgroups limits.

</details>

<details>
<summary>2. Can Windows run in a Linux container? And in a Linux virtual machine?</summary>

Not in a Linux container, because the container uses the host's Linux kernel. In a virtual machine yes, because the VM runs its own kernel on virtual hardware.

</details>

<details>
<summary>3. Why does VirtualBox not run a 64-bit guest if VT-x is disabled in the BIOS?</summary>

Because modern VirtualBox relies on hardware-assisted virtualisation: the guest kernel runs in the CPU's separate guest mode. It no longer offers software binary translation for 64-bit guests.

</details>

## Summary worksheet

```quiz required
? You migrate a VM with 2048 MB of memory over a 1000 MB/s network, and the VM dirties 250 MB per second. How many MB are sent in round 2?
= 512
! Round 1: 2048 MB, 2.048 s; meanwhile 250 × 2.048 = 512 MB became dirty.

? In the same migration, after how many rounds is the data to send below 50 MB (when the VM can be paused)?
= 3
! 2048 → 512 → 128 → 32 MB: after round 3, 32 MB remain.

? Which type 1 hypervisor is built into the Linux kernel?
+ KVM
- VirtualBox
- VMware Workstation
- Parallels Desktop
! Kernel-based Virtual Machine.

? What does it mean that Linux containers share the host's kernel?
+ every container uses the same kernel, separated only by namespaces and cgroups
- every container starts its own kernel
- containers do not use system calls
- containers only run on Windows
! That is why they are fast, but their isolation is weaker.

? In which model do you get a finished application usable from the browser?
- IaaS
- PaaS
+ SaaS
- none of them
! Software as a Service, e.g. Gmail.
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **Run time with a cgroups limit.** Write the `runtime(work_s, quota_us, period_us, threads=1)` function: the number of cores from the `cpu.max` value is quota / period, but one thread can use at most one core. How long does `work_s` seconds of CPU work take (one decimal)?

```python starter
def runtime(work_s, quota_us, period_us, threads=1):
    return work_s
```

<details>
<summary>Solution</summary>

```python solution
def runtime(work_s, quota_us, period_us, threads=1):
    cores = quota_us / period_us
    usable = min(cores, threads)              # one thread = at most one core
    return round(work_s / usable, 1)
```

</details>

```python test
assert runtime(10, 50000, 100000) == 20.0
assert runtime(10, 200000, 100000) == 10.0
assert runtime(10, 200000, 100000, threads=4) == 5.0
assert runtime(6, 25000, 100000, threads=2) == 24.0
print("All checks passed!")
```

**2.** **Rounds of live migration.** Write the `migrate(memory_mb, bandwidth, dirty, threshold=50, max_rounds=30)` function: each round sends the remainder (time = remainder / bandwidth), during which dirty · time MB become dirty (at most the whole memory) – that's the new remainder. Stop if the remainder ≤ threshold or the maximum number of rounds is reached. Return the pair `(number of rounds, downtime in ms rounded to a whole number)`; downtime = remainder / bandwidth.

```python starter
def migrate(memory_mb, bandwidth, dirty, threshold=50, max_rounds=30):
    return (1, 0)
```

<details>
<summary>Solution</summary>

In the third case dirtying is faster than the network: the remainder never shrinks, after every round the whole memory is dirty – then the VM must be throttled, or switched to post-copy.

```python solution
def migrate(memory_mb, bandwidth, dirty, threshold=50, max_rounds=30):
    remaining, rounds = memory_mb, 0
    while rounds < max_rounds:
        rounds += 1
        t = remaining / bandwidth
        remaining = min(dirty * t, memory_mb)       # got dirty meanwhile
        if remaining <= threshold:
            break
    return (rounds, round(remaining / bandwidth * 1000))
```

</details>

```python test
assert migrate(8192, 1250, 200) == (3, 27)
assert migrate(4000, 1000, 100) == (2, 40)
assert migrate(8192, 1250, 1300, max_rounds=5) == (5, 6554)
print("All checks passed!")
```

**3.** **KSM saving.** Write the `memory_need(num_vms, vm_gb, shared_gb)` function, which returns a pair: the memory needed without KSM, and with KSM if `shared_gb` of identical pages per VM need to be stored only once (one decimal)!

```python starter
def memory_need(num_vms, vm_gb, shared_gb):
    return (num_vms * vm_gb, num_vms * vm_gb)
```

<details>
<summary>Solution</summary>

```python solution
def memory_need(num_vms, vm_gb, shared_gb):
    without = num_vms * vm_gb
    with_ksm = num_vms * (vm_gb - shared_gb) + shared_gb   # the shared part once
    return (round(without, 1), round(with_ksm, 1))
```

</details>

```python test
assert memory_need(20, 4, 1.2) == (80, 57.2)
assert memory_need(1, 4, 1) == (4, 4)
assert memory_need(10, 2, 0) == (20, 20)
print("All checks passed!")
```

### Quick check questions

```quiz
? What is the difference between a type 1 and a type 2 hypervisor?
+ type 1 runs directly on the hardware (e.g. Hyper-V, ESXi, KVM), type 2 is a program running on a host OS (e.g. VirtualBox)
- type 1 runs only Linux
- type 2 is faster
! Type 1 is the norm on servers.

? Which two Linux kernel features are containers built on?
+ namespaces and cgroups
- TLB and MMU
- swap and cache
! Namespaces control what a process sees, cgroups how much it may use.

? Of IaaS, PaaS and SaaS, which is the one where the provider gives only the virtual machine, and everything else (OS, application) is your job?
+ IaaS
- PaaS
- SaaS
! SaaS is a ready-made application (e.g. web mail).

? Why does a container start much faster than a virtual machine?
+ because it uses the host's kernel, no operating system has to boot
- because it has fewer files
- because the container uses no CPU
! The price: every container uses the same kernel.

? What does the "st" (steal time) column of top show in the guest system?
+ how much time the VM waited because the hypervisor gave the physical CPU to other VMs
- how much memory was stolen
- the disk's waiting time
! A high value points to an overcommitted host.
```
