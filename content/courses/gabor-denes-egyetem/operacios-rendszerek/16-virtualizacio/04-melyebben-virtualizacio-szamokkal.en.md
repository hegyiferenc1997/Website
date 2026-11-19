---
title: Deeper – Virtualisation in Numbers: Address Translation, Overcommit, Migration, Containers
summary: Why a TLB miss is more expensive in a virtual machine (two-dimensional page walk, 24 memory reads), overcommit and memory sharing (KSM) by calculation, the pre-copy algorithm of live migration with a simulator (how long is the downtime?), cgroups CPU and memory limits calculated, and the density of VMs and containers on a server.
minutes: 45
---

## What you will learn in this lesson

- why a **TLB miss** in a virtual machine can cost up to six times as many memory reads,
- how **overcommit** is calculated, and how much memory **sharing** identical pages (KSM) saves,
- step by step, with a **simulator**, how a running VM moves to another machine, and what the length of the **downtime** depends on,
- how containers' cgroups limits (`cpu.max`, `memory.max`) are **calculated**,
- how many VMs and how many containers **fit** on a server.

## 1. The cost of address translation in a virtual machine

In the memory management topic you saw that translating a virtual address means walking a **4-level page table** – on a TLB miss, **4 memory reads**. In a virtual machine, however, **two** translations are stacked on top of each other:

1. the **guest's** page table: guest virtual address → guest "physical" address,
2. the hypervisor's **EPT/NPT** table: guest physical address → real (host) physical address.

The trap: every level of the guest's page table is **itself** at a guest physical address – so before each step the host table must be walked too. This is the **two-dimensional page walk**.

```python run
# Memory reads on a TLB miss: native and virtualised
def native(levels):
    return levels                                 # one read per level

def two_dimensional(guest_levels, host_levels):
    # the address of every guest level (and the final data address) must be translated through
    # the host table: (guest levels + 1) host walks, plus the guest table reads themselves
    return (guest_levels + 1) * host_levels + guest_levels

for n in [4, 5]:
    print(f"{n}-level page table: native {native(n):>2} reads, "
          f"in a VM at most {two_dimensional(n, n):>2} reads "
          f"({two_dimensional(n, n) / native(n):.0f}×)")
```

With a 4-level table, the worst case takes **24** memory reads instead of the native 4! That's why the **TLB** and **large pages** (2 MB _huge pages_) matter even more in virtualised systems: a large page means fewer levels and far fewer TLB misses. In practice processors skip most of the steps using dedicated caches (_page walk cache_), so the real slowdown is much smaller – but the difference is measurable.

## 2. Overcommit and memory sharing

**CPU overcommit**: the hypervisor shares the physical cores by time-sharing, so more vCPUs can be assigned than there are cores. The **overcommit ratio** = assigned vCPUs / physical cores. Since most VMs are idle most of the time, 3:1–4:1 ratios are common; but if every VM works at once, they all slow down (the vCPUs wait in the ready queue – inside the guest, `top`'s **st**, _steal time_ column shows this).

**Memory**: if 20 VMs run the same Ubuntu, their memory contains lots of **identical** pages (kernel code, libraries). Linux's **KSM** (_Kernel Samepage Merging_) finds pages with identical content and keeps only one copy, shared **read-only**. If a VM wants to write to it, it gets its own copy through **copy-on-write** – the same trick you learned with `fork()`.

```python run
# KSM: how much does merging identical pages save?
num_vms = 20
vm_mem_gb = 4.0
shared_gb = 1.2             # identical pages per VM (OS, libraries)
physical_gb = 64

without = num_vms * vm_mem_gb
with_ksm = num_vms * (vm_mem_gb - shared_gb) + shared_gb   # the shared part is needed only once
print(f"without KSM: {without:.1f} GB needed → {'fits' if without <= physical_gb else 'does NOT fit'} "
      f"in {physical_gb} GB")
print(f"with KSM:    {with_ksm:.1f} GB needed → {'fits' if with_ksm <= physical_gb else 'does NOT fit'} "
      f"(saving: {without - with_ksm:.1f} GB, {1 - with_ksm / without:.0%})")

# CPU overcommit
vcpu, cores = 20 * 2, 16
print(f"\nCPU overcommit: {vcpu} vCPU / {cores} cores = {vcpu / cores:.1f} : 1")
```

KSM has a price too: comparing pages costs CPU time, and a security risk has come up – an attacking VM can infer from the **timing** of a write whether a page was shared with another VM (_side channel_). That's why cloud providers usually **disable** it between VMs of different customers.

The third tool is the **balloon driver**: a driver running in the guest "inflates" memory at the hypervisor's request (allocates it inside the guest), and the hypervisor can give that memory to other VMs. This way the guest OS decides itself what to page out – more cleverly than the hypervisor would blindly.

## 3. Live migration – with a simulator

In the base lesson you saw that in live migration the VM moves while running. The most widespread method is **pre-copy**:

1. the VM keeps running, the hypervisor copies the **entire** memory,
2. meanwhile the VM **modifies** some pages (dirty pages) – these must be sent again,
3. it **repeats** this until the remaining dirty part is small enough,
4. then it **pauses** the VM for a moment, sends the rest and the CPU state, and starts it on the target machine.

```python run
# Live migration with pre-copy: how many rounds, how long, how much downtime?
def migrate(memory_mb, bandwidth_mb_s, dirty_mb_s, threshold_mb=50, max_rounds=10):
    remaining = memory_mb
    total_time = 0.0
    for rnd in range(1, max_rounds + 1):
        t = remaining / bandwidth_mb_s                # time to send this round
        total_time += t
        new_dirty = min(dirty_mb_s * t, memory_mb)    # pages modified in the meantime
        print(f"  round {rnd}: sending {remaining:7.0f} MB takes {t:6.2f} s, "
              f"meanwhile {new_dirty:6.0f} MB got dirty")
        remaining = new_dirty
        if remaining <= threshold_mb:
            break
    else:
        print(f"  (hit the {max_rounds}-round maximum – the rest must be sent while paused)")
    downtime_ms = remaining / bandwidth_mb_s * 1000
    print(f"  → downtime: {downtime_ms:.0f} ms, total time: {total_time + downtime_ms / 1000:.1f} s\n")

print("8 GB VM, 10 Gbit/s (1250 MB/s), 200 MB/s dirtying:")
migrate(8192, 1250, 200)
print("the same, but the VM writes a lot (1200 MB/s):")
migrate(8192, 1250, 1200)
```

In the first case, after **3 rounds** the downtime is about **27 ms** – the user doesn't even notice. In the second case the VM dirties memory almost as fast as the network can carry it, so the remainder hardly shrinks per round: even after 10 rounds gigabytes remain, and the final downtime lasts **seconds**. The **convergence condition**: the dirtying rate must be well below the bandwidth. If it isn't, the hypervisor **throttles** the VM (gives it less CPU time so it writes less), or switches to **post-copy**: it moves the VM immediately, and the target machine fetches missing pages from the source on page faults.

**Analogy:** moving house while still living there. First you carry over every box, but meanwhile you use things that have to be carried over again. If you don't make much mess, after a few rounds only one bag is left – you walk over with it at the last moment.

## 4. cgroups: how are a container's limits calculated?

`docker run --cpus 0.5 --memory 256m` writes **cgroups v2** files behind the scenes (`/sys/fs/cgroup/…`):

- **`cpu.max`**: two numbers, **quota** and **period** in microseconds. `50000 100000` means: at most 50 ms of CPU time every 100 ms, i.e. **0.5 cores**. `200000 100000` = 2 cores (across several threads).
- **`memory.max`**: the memory limit in bytes; if exceeded, the kernel's OOM killer terminates a process in the cgroup.
- **`pids.max`**: the maximum number of processes – protects against a "fork bomb".

```python run
# Effect of cgroups cpu.max: how long does a CPU-bound task run?
def runtime(work_s, quota_us, period_us, threads=1):
    cores = quota_us / period_us                    # this many "cores" of CPU allowed
    usable = min(cores, threads)                    # one thread uses at most one core
    return work_s / usable, cores

for quota, thr in [(50000, 1), (100000, 1), (200000, 1), (200000, 4)]:
    t, cores = runtime(10, quota, 100000, thr)
    print(f"cpu.max = '{quota} 100000' ({cores:.1f} cores), {thr} thread(s): "
          f"10 s of CPU work → {t:.1f} s")
```

Notice: the 2-core limit doesn't help a **single-threaded** program (it stays 10 s) – a thread can only run on one core at a time. The same lesson as with Amdahl's law.

```bash
# Ubuntu VM: look at your own shell's cgroup and limits
cat /proc/self/cgroup                          # e.g. 0::/user.slice/user-1000.slice/…
cat /sys/fs/cgroup/user.slice/cpu.max 2>/dev/null   # "max 100000" = no limit
systemd-cgls --no-pager | head -20             # the cgroup tree
# Try a PID namespace without a container:
sudo unshare --pid --fork --mount-proc bash -c 'ps aux'   # only 2 processes, bash is PID 1!
```

## 5. How many VMs or containers fit on a server?

```python run
# Density: VMs and containers on a 64 GB server
SERVER_GB = 64
HOST_GB = 4                      # reserved for the host OS and hypervisor
APP_GB = 0.5                     # the application itself (e.g. a small web service)

vm_overhead_gb = 1.0             # every VM runs a full guest OS
container_overhead_gb = 0.02     # a container brings only the process and its libraries

available = SERVER_GB - HOST_GB
print(f"VMs:         {int(available // (APP_GB + vm_overhead_gb)):>4} "
      f"(one VM {APP_GB + vm_overhead_gb:.2f} GB, start-up ~30 s)")
print(f"containers:  {int(available // (APP_GB + container_overhead_gb)):>4} "
      f"(one container {APP_GB + container_overhead_gb:.2f} GB, start-up ~1 s)")
```

Containers pack **two to three times** more densely and start in seconds, because no OS has to boot. The price: every container uses **the same kernel**, so a kernel bug endangers all of them, and a Linux container only runs on a Linux kernel (on Windows and macOS, Docker Desktop starts a small Linux VM in the background). That's why the cloud often **combines** the two: every customer gets their own VM (strong isolation), and inside it services run in containers (density, fast start-up). AWS Firecracker's "micro-VMs" blur this line: a VM that starts in ~125 ms.

## Summary

- In a VM address translation is **two-dimensional**: with a 4-level table a TLB miss takes at most **24** memory reads (4 natively) – that's why the TLB and large pages matter.
- Overcommit: vCPU / cores (3:1–4:1 typical; overload shows as **steal time**); **KSM** stores identical pages once, with copy-on-write.
- Live migration with **pre-copy**: each round resends only dirty pages; if dirtying is much slower than the network, downtime is a few tens of ms.
- cgroups: `cpu.max` = quota / period (e.g. 50000/100000 = 0.5 cores), `memory.max`, `pids.max`; more cores only help multi-threaded programs.
- Containers are denser and start faster, VMs isolate more strongly – the cloud often combines them.

## Lesson exercise

```quiz required
? A container's cgroup setting is cpu.max = "25000 100000". How many cores' worth of CPU time may it use?
= 0.25
= 0,25
! 25,000 / 100,000 = 0.25 cores – 25 ms every 100 ms.

? A host has 12 physical cores and runs 6 VMs, each with 6 vCPUs. What is the CPU overcommit ratio? (for 2 : 1 write: 2)
= 3
! 6 · 6 = 36 vCPUs / 12 cores = 3 : 1.

? In a live migration the network carries 1000 MB/s and the VM dirties memory at 100 MB/s. In the first round 4000 MB must be sent. How many MB get dirty meanwhile?
= 400
! 4000 / 1000 = 4 s, in which 4 · 100 = 400 MB.

? Why is a TLB miss more expensive in a virtual machine than natively?
- because the VM has no TLB
+ because every level of the guest's page table must also be translated through the hypervisor's EPT/NPT table
- because the hypervisor serves every memory read from disk
! Two-dimensional walk: at most 24 reads with 4 levels.

? What does KSM (Kernel Samepage Merging) do?
+ it finds memory pages with identical content and keeps a single, write-protected copy of them
- it compresses the VMs' memory on disk
- it writes unused pages to swap
! On a write, the writer gets its own copy via copy-on-write.

? A single-threaded program runs in a container whose cpu.max is "200000 100000" (2 cores). Will it be faster than with a 1-core limit?
- yes, twice as fast
+ no, a thread can only run on one core at a time
- yes, but only by half
! Extra cores only help multi-threaded programs.
```
