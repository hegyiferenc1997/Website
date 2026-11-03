---
title: Performance Monitoring
summary: The metrics of the four main resources, the load average, top, htop, vmstat, iostat, and Task Manager and Resource Monitor.
minutes: 25
---

## What you will learn

- which **metric** tells what about the state of the CPU, memory, disk and network,
- what the Linux **load average** means,
- how to find the **bottleneck** on Linux and Windows.

## The four main resources

| Resource    | Important metrics                                           | When is it a problem?                               |
| ----------- | ----------------------------------------------------------- | --------------------------------------------------- |
| **CPU**     | utilisation (%), user / system time, I/O wait (`wa`)        | constantly ~100%, many processes in the ready queue |
| **memory**  | used, free, **cache**, **swap** usage, page faults          | swap keeps growing, the machine thrashes            |
| **disk**    | read/write throughput, **IOPS**, wait time, utilisation (%) | constantly 100% utilisation, long waits             |
| **network** | bandwidth (Mbit/s), packet loss, latency                    | the line is full, many retransmissions              |

The **bottleneck** is the resource that fills up first – the system is only as fast as its slowest link. There is no point buying a new processor if the disk is the problem.

## The load average

```bash
uptime
# 10:42:01 up 2:13, 1 user, load average: 0.52, 1.10, 0.87
```

The three numbers are the averages over the last **1, 5 and 15 minutes** of how many processes were **running or waiting** to run (on Linux, those waiting for the disk count too). Interpret it relative to the **number of cores**:

- on a 4-core machine **4.0** = every core is fully busy, but nobody waits,
- **2.0** = half loaded,
- **8.0** = double overload: on average one process waits next to every running one.

## Tools on Linux

```bash
top                 # live list; P: sort by CPU, M: by memory; 1: per core
htop                # colourful, also usable with the mouse (sudo apt install htop)
vmstat 1 5          # r: ready queue, si/so: paging, wa: I/O wait, cs: context switches
free -h             # memory and swap
iostat -x 1 3       # disk utilisation (sudo apt install sysstat)
df -h; du -sh ~/*   # where the space goes
ss -s               # network connections summarised
```

A common pattern: high `wa` (I/O wait) + low CPU usage = the processor **waits for the disk** → the disk is the bottleneck.

## Tools on Windows

- **Task Manager** (Ctrl + Shift + Esc): **Processes** (who uses how much), **Performance** (CPU, memory, disk, network, GPU graphs), **Startup** (impact of programs started at boot).
- **Resource Monitor** (`resmon`): which process writes which file, communicates on which port.
- **Performance Monitor** (`perfmon`): long-term measurement with counters, reports.
- **PowerShell**:

```powershell
Get-Counter '\Processor(_Total)\% Processor Time' -SampleInterval 1 -MaxSamples 5
Get-Process | Sort-Object WorkingSet -Descending | Select-Object -First 5 Name, CPU, WorkingSet
```

## Measure, don't guess

Before optimising, **measure**: what is slow, by how much, and when? Change **one thing at a time** and measure again. If it cannot be measured, you cannot know whether it improved.

## Summary

- Four main resources: CPU, memory, disk, network; the slowest is the bottleneck.
- Load average: 1, 5, 15-minute averages, interpreted relative to the number of cores.
- Linux: `top`/`htop`, `vmstat`, `free`, `iostat`; Windows: Task Manager, `resmon`, `perfmon`, `Get-Counter`.
- Measure first, then change – one thing at a time.

## Lesson exercise

```quiz required
? On a 4-core machine the load average is 8.0. On average, how many processes wait per running process?
= 1
! 8 processes, 4 run, 4 wait → 1 per running one.

? What does it mean if `wa` is high in the `vmstat` output but CPU usage is low?
+ The processor waits for the disk (I/O); the disk is the bottleneck.
- The processor has overheated.
- The network bandwidth has run out.
- Everything is fine.
! wa = I/O wait.

? Over how many minutes does the load average of `uptime` show averages?
+ 1, 5 and 15
- 1, 10 and 60
- 5, 15 and 30
- only the last minute
! It shows the trend too.

? Which Windows tool shows which process writes which file and communicates on which port?
+ Resource Monitor (resmon)
- Notepad
- Disk Management
- Control Panel
! The Performance tab of Task Manager also links to it.
```
