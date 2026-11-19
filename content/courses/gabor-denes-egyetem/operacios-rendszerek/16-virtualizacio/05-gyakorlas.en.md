---
title: Practice – Virtualisation
summary: A live migration simulation in Python, a hands-on task in VirtualBox and with Docker, review questions and a summary worksheet.
minutes: 25
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
