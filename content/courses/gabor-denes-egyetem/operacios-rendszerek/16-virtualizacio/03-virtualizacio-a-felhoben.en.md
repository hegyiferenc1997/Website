---
title: Virtualisation in the Cloud
summary: IaaS, PaaS and SaaS, virtual machines in the cloud, snapshots and backups, live migration, and the security questions of virtualisation.
minutes: 20
---

## What you will learn

- what the **cloud** is and what **IaaS**, **PaaS** and **SaaS** mean,
- how virtualisation helps with **snapshots**, **backups** and **live migration**,
- what **security** questions arise when many customers share one machine.

## The cloud = virtualisation at scale

The **cloud** is computing capacity running in huge data centres that can be **rented on demand** over the internet. On the provider's (e.g. Amazon Web Services, Microsoft Azure, Google Cloud) millions of servers, type 1 hypervisors (e.g. KVM-based systems, Hyper-V) and containers run; the customer gets a virtual machine within minutes and pays for it by the hour or second.

## The three service models

| Model | What do you get? | What do you manage? | Example |
| --- | --- | --- | --- |
| **IaaS** (_Infrastructure as a Service_) | virtual machine, disk, network | the OS, updates, the application | AWS EC2, Azure Virtual Machines |
| **PaaS** (_Platform as a Service_) | a ready runtime environment | only the application's code | Heroku, Google App Engine, Azure App Service |
| **SaaS** (_Software as a Service_) | a finished application in the browser | only your own data | Gmail, Microsoft 365, Neptun |

The further down the table you go, the less you have to operate, but the less you can customise the system. This website will have a cloud version too: its database will be PostgreSQL running in the cloud (PaaS).

## Snapshot, backup, template

A VM's disk is a file (or a storage object), so:

- **snapshot**: the state at a moment can be recorded and restored – the same thing you did in VirtualBox in topic 1. A snapshot is **not a backup**: if the physical disk fails, it is lost with it.
- **backup**: a copy of the VM's disk on **another** storage or data centre.
- **template / image**: a hundred identical VMs can be started from one configured VM – this is how a new server starts within minutes in the cloud.

## Live migration

In **live migration** a running VM is moved to another physical machine **without shutting it down**:

1. the hypervisor copies the VM's memory to the target machine in the background while the VM keeps running;
2. it resends the pages modified meanwhile ("dirty" pages), fewer and fewer each round;
3. for a short moment (typically milliseconds) it pauses the VM, sends the rest and the CPU state, then continues on the target machine.

This lets the provider replace or update hardware without customers noticing. It is another application of paging (topic 6).

## Security and isolation

On a cloud server the VMs of **several customers** run side by side (_multi-tenancy_), so it is critical that none can see into another.

- A hypervisor bug (**VM escape**: breaking out of the guest onto the host) is the most serious bug a cloud provider can have.
- Because of side-channel flaws in processors (e.g. **Spectre**, **Meltdown**, 2018), kernels and hypervisors received many defences, which also cost some performance.
- Container isolation is weaker (shared kernel), so clouds often wrap containers in a **lightweight VM** (e.g. AWS Firecracker or gVisor).

## Summary

- Cloud: virtualised capacity rented on demand in large data centres.
- IaaS: you get a VM; PaaS: a runtime environment; SaaS: a finished application.
- Snapshot ≠ backup; new machines start quickly from templates.
- Live migration: memory copied while running, with a short pause.
- Several customers on one machine: hypervisor and CPU flaws are the most dangerous.

## Exercise

```quiz required
? A cloud VM costs €0.05 per hour. How much does it cost if it runs day and night for 30 days (in euros)?
= 36
! 30 × 24 = 720 hours; 720 × 0.05 = €36.

? Which service model is it when the provider gives you a virtual machine and you update the operating system?
+ IaaS
- PaaS
- SaaS
- none of them
! Infrastructure as a Service.

? Why does a snapshot not replace a backup?
+ because it is on the same storage as the VM, so it can be lost together with it in a disk failure
- because a snapshot only saves the memory
- because snapshots can only be taken of a stopped VM
- because a snapshot cannot be restored
! A backup must be on another storage.

? What happens during live migration?
- the VM stops and restarts on the other machine
+ the running VM's memory is copied in the background, then after a short pause it continues on the target machine
- the VM's disk is deleted
- the guest OS is reinstalled
! Users typically do not even notice.
```
