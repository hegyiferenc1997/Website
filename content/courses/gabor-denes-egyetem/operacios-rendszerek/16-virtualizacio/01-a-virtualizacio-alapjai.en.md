---
title: Basics of Virtualisation
summary: Host and guest, the two types of hypervisor, full, para- and hardware-assisted virtualisation, and Intel VT-x and AMD-V.
minutes: 25
---

## What you will learn

- what **virtualisation** means and what the **host** and the **guest** are,
- the difference between **type 1 and type 2 hypervisors**,
- how **full**, **para-** and **hardware-assisted** virtualisation work.

## What is virtualisation?

**Virtualisation** is the **software emulation** of a physical resource (machine, processor, memory, disk, network) so that several isolated **virtual machines** (VMs) can run on one physical machine. You did exactly this in topic 1: on the Windows or Linux **host**, VirtualBox ran two **guest** operating systems.

The guest OS believes it runs on its own hardware: it has a "processor", "memory" and a "disk" (actually a `.vdi` file on the host). This illusion is created by the **hypervisor** (_virtual machine monitor_, VMM).

Why is it useful?

- **Isolation**: if the guest crashes or gets infected, the host is untouched.
- **Better utilisation**: ten small services in ten VMs on one server instead of ten machines.
- **Experimenting**: snapshots, restoring, several OSes on one machine – ideal for learning.
- **Portability**: a VM is a bundle of files that can be moved to another machine.

## The two types of hypervisor

|               | **Type 1** (_bare-metal_)                                              | **Type 2** (_hosted_)                                 |
| ------------- | ---------------------------------------------------------------------- | ----------------------------------------------------- |
| where it runs | **directly on the hardware**                                           | on a **host OS**, as an application                   |
| examples      | VMware ESXi, Microsoft **Hyper-V**, Xen, **KVM** (Linux kernel module) | **VirtualBox**, VMware Workstation, Parallels Desktop |
| typical use   | faster, on servers and in the cloud                                    | easy to install, on desktops                          |

KVM is an interesting case: it turns the Linux kernel itself into a hypervisor, so it counts as type 1 even though a full Linux runs beneath it. On Windows, when Hyper-V is enabled, Windows itself is moved into a "privileged" VM above the hypervisor.

## Modes of virtualisation

The difficulty: the guest kernel wants to run in **kernel mode** and execute privileged instructions (e.g. switching page tables, disabling interrupts) – but the real kernel mode belongs to the host (see topic 13).

1. **Full virtualisation in software** (_binary translation_): at run time the hypervisor rewrites the guest's dangerous instructions into safe versions. Any unmodified OS runs, but more slowly.
2. **Paravirtualisation**: the guest kernel is **modified** so that instead of dangerous instructions it calls the hypervisor directly (a **hypercall**). Fast, but requires a modified guest (e.g. early versions of Xen).
3. **Hardware-assisted virtualisation**: the processor gets a separate "guest mode" (**Intel VT-x**, **AMD-V**) in which the guest kernel can run in kernel mode, while on sensitive operations the CPU automatically hands control to the hypervisor (a _VM exit_). Memory is sped up by **second-level address translation** (Intel EPT, AMD NPT). Today this is the standard.

In practice modern hypervisors **mix** the modes: the CPU is hardware-assisted, but I/O devices are often **paravirtualised** (e.g. **virtio** network card and disk on KVM, or VirtualBox's Guest Additions), because fully emulating a real network card is slow.

That is why in topic 1 you had to enable **VT-x / AMD-V** (SVM) in the BIOS/UEFI: without it VirtualBox cannot run a 64-bit guest.

## Allocating resources

RAM given to a VM is **lost** to the host while the VM runs, so always leave enough memory for the host. The hypervisor shares processor cores by **time-sharing** (the guest's virtual CPUs, vCPUs, are threads on the host), so more vCPUs can be allocated than there are physical cores – this is called **overcommit**.

## Summary

- Virtualisation: emulating hardware in software; host + guest; the hypervisor creates the illusion.
- Type 1: directly on the hardware (ESXi, Hyper-V, KVM); type 2: on a host OS (VirtualBox).
- Full (binary translation), para- (hypercalls), hardware-assisted (VT-x, AMD-V, EPT/NPT).
- For I/O, often paravirtualised devices (virtio, Guest Additions).

## Exercise

```quiz required
? A host has 16 GB of RAM, and you leave 4 GB for the host. How many 3 GB virtual machines can you run at the same time?
= 4
! (16 − 4) / 3 = 4.

? Which is a type 2 (hosted) hypervisor?
- VMware ESXi
- Xen
+ VirtualBox
- Hyper-V
! VirtualBox runs as an application on a host operating system.

? What is the essence of paravirtualisation?
+ the guest kernel is modified to call the hypervisor directly (hypercall)
- the guest kernel runs unmodified and the CPU translates its instructions
- the guest and the host use the same kernel
- all I/O operations are disabled
! Containers share a kernel, not paravirtualisation.

? What is the name of the hardware virtualisation extension of Intel processors?
= VT-x
= vtx
! On AMD it is AMD-V (SVM).
```
