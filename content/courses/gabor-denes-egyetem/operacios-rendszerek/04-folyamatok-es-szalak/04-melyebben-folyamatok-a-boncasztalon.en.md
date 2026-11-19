---
title: Deeper – Processes and Threads on the Dissecting Table
summary: A process from the inside in the /proc file system, the cost of fork and copy-on-write, creating a zombie and an orphan process yourself, job control with signals (Ctrl+Z, bg, fg, kill), counting threads on Linux and Windows, and a Python simulation of the five-state model.
minutes: 45
---

## What you will learn in this lesson

- how to look inside a running process through the **`/proc`** file system,
- why `fork()` is cheap: the **copy-on-write** trick,
- how to create a zombie and an orphan process **yourself** – and how they disappear,
- how to **manage running programs** with signals (Ctrl + Z, `bg`, `fg`, `kill`),
- how to count a program's **threads** on Linux and Windows,
- and how a process "steps" between the **five states** – in a small simulation.

## 1. A process from the inside: /proc

On Linux there's a **folder** under `/proc` for every running process, named after its PID. These aren't real files on the disk: the kernel **generates their contents on the fly** when you read them. `/proc/self` is always the folder of the process that is reading it.

Try it in the Ubuntu VM:

```bash
echo $$                          # your shell's PID
ls /proc/$$                      # your shell's "dissected" data
grep -E 'Name|State|PPid|Threads|VmRSS' /proc/$$/status
                                 # name, state, parent, number of threads, real memory use
ls -l /proc/$$/fd                # open file descriptors: 0 = input, 1 = output, 2 = error output
cat /proc/$$/maps | head         # map of the address space: code, libraries, heap, stack
cat /proc/$$/limits | head -5    # limits: max open files, stack size…
```

What you see here is exactly part of the **process control block** (PCB) and the **address space** you learned about in the first lesson:

| PCB element              | Where do you see it?                |
| ------------------------ | ----------------------------------- |
| ID, parent               | `status`: `Pid`, `PPid`             |
| state                    | `status`: `State` (R, S, D, Z, T)   |
| open files               | the `fd/` folder                    |
| memory (address space)   | `maps`, `status`: `VmRSS`, `VmSize` |
| scheduling data          | `sched`, `stat`                     |

`VmSize` is the size of the **virtual** address space (what the process has "reserved"), `VmRSS` (_resident set size_) is what's **actually in RAM**. The difference between the two is often large – the reason comes up in the memory management topic.

## 2. Why is fork cheap? – copy-on-write

In the previous lesson you saw that `fork()` **copies** the process. If a program using 2 GB of memory forks, does the kernel really copy 2 GB? That would be slow and pointless too – the child usually calls `exec()` immediately, i.e. throws the whole thing away.

The solution is **copy-on-write**: after the fork, parent and child use **the same physical memory pages**, just marked "read-only" for both. As long as neither of them writes, nothing has to be copied. If one of them **writes** to a page, the processor signals the kernel, and the kernel copies **only that one page** for the writing side.

**Analogy:** two siblings get a shared textbook. As long as they only read it, one copy is enough. If one of them wants to take notes in it, they get their own photocopy **of that one page** they want to write on.

That's why on Linux creating a process typically takes only **a few tenths of a millisecond**, and the shell can safely fork for every command you type.

## 3. Zombie and orphan – made by hand

### Zombie

A zombie is created when the child finishes but the parent **doesn't call `wait()`**. Let's create one:

```bash
bash -c 'sleep 2 & exec sleep 60' &
```

What happens here? A new `bash` starts a `sleep 2` child in the background, then **replaces itself** (`exec`) with a `sleep 60` program. `sleep 60` doesn't know it has a child, so it never calls `wait()`. Wait 3 seconds, then:

```bash
ps -o pid,ppid,stat,cmd -C sleep      # all sleep processes
```

In the line of `sleep 2` (whose parent, `PPID`, is `sleep 60`) the `STAT` column shows **`Z`**, and next to the command name there's `<defunct>`. The zombie no longer runs and uses no processor, it just occupies an entry in the process table. When the parent (`sleep 60`) ends, the system inherits the zombie and cleans it up – look again in a minute!

### Orphan

An orphan is the opposite case: the parent dies first.

```bash
bash -c 'sleep 120 &' ; ps -o pid,ppid,cmd -C sleep
```

The inner `bash` starts `sleep 120`, then exits immediately. In the `ps` output the parent (`PPID`) of `sleep` is **no longer** the deceased bash but an "adopting" process: `systemd` (PID 1) or the `systemd --user` belonging to your login. Check who it is: `ps -p <PPID> -o pid,cmd`.

**Lesson:** an orphan is fine, the system takes care of it. **Many** zombies, however, point to a faulty parent program (not calling `wait()`), and if PIDs run out, no new process can start.

## 4. Job control with signals

The shell can manage several programs at once: one is in the **foreground** (it gets the keyboard), the others run in the **background** or wait **suspended**.

```bash
sleep 300            # runs in the foreground – the terminal is "busy"
# press: Ctrl + Z  → SIGTSTP: suspended ("Stopped")
jobs                 # list of jobs: [1]+ Stopped  sleep 300
bg %1                # continue in the background (SIGCONT)
jobs                 # [1]+ Running  sleep 300 &
fg %1                # back to the foreground
# press: Ctrl + C  → SIGINT: interrupt
```

You can also send a signal to any process by its PID:

```bash
sleep 300 &                  # & puts it in the background immediately; the shell prints the PID
kill -STOP $!                # suspend ($! = PID of the last background process)
ps -o pid,stat,cmd -p $!     # STAT: T (stopped)
kill -CONT $!                # continue – STAT: S (sleeping, waiting for time)
kill $!                      # polite termination (SIGTERM)
```

If you want to start a program so that it keeps running after the terminal is closed, use `nohup` (`nohup ./long_job.sh &`): it makes the program ignore the `SIGHUP` signal it would get when the terminal closes.

On Windows, right-click → **End task** on Task Manager's **Details** page corresponds to `kill`, and in PowerShell: `Stop-Process -Id 1234` (there's no separate polite request: graphical programs get the "close" message, `Stop-Process` terminates immediately).

## 5. Counting threads

Which program runs on how many threads? On Linux:

```bash
ps -eo pid,nlwp,comm --sort=-nlwp | head    # NLWP = number of threads; programs with most threads first
ls /proc/$(pgrep -n firefox)/task | wc -l   # Firefox's threads (if it's running)
top -H -p $(pgrep -n firefox)               # shows processor use per thread (quit: q)
```

On Windows, on Task Manager's **Details** page right-click the column header → **Select columns** → **Threads**. In PowerShell:

```powershell
Get-Process | Sort-Object { $_.Threads.Count } -Descending |
  Select-Object -First 5 Name, @{ n = 'Threads'; e = { $_.Threads.Count } }
```

It may be surprising that a browser or a game uses **dozens to hundreds** of threads: separate threads handle the network, sound, disk I/O and the interface, and several threads work on web pages' JavaScript or the graphics. Creating a thread is **cheaper** than creating a process (no new address space is needed), and threads communicate quickly through **shared memory** – in exchange, one thread's bug can bring down the whole process. That's why modern browsers use a **mixed** solution: every tab is a separate **process** (if a tab crashes, the others survive), with many threads inside.

## 6. Simulating the five-state model

In the first lesson you saw the five states: **new → ready → running → waiting → ready → … → terminated**. Not every transition is allowed: for example, a waiting process can't go **directly** to running; it first has to go back to the ready queue.

The simulation follows a process's life event by event and complains if a transition is illegal. Run it, then try your own event sequences!

```python run
# The five-state process model: which event takes the process to which state?
TRANSITIONS = {
    ("new", "admitted"): "ready",               # the OS puts it in the ready queue
    ("ready", "scheduler dispatch"): "running",
    ("running", "time slice expired"): "ready", # timer interrupt
    ("running", "waits for I/O"): "waiting",    # e.g. disk read
    ("waiting", "I/O done"): "ready",           # interrupt: the data has arrived
    ("running", "exit"): "terminated",
}

def life(events):
    state = "new"
    print(f"start: {state}")
    for e in events:
        new = TRANSITIONS.get((state, e))
        if new is None:
            print(f"  ✗ illegal: in state {state} this can't happen: \"{e}\"")
            return
        print(f"  {state:10} --[{e}]--> {new}")
        state = new
    print(f"end: {state}")

life(["admitted", "scheduler dispatch", "waits for I/O", "I/O done",
      "scheduler dispatch", "time slice expired", "scheduler dispatch", "exit"])
print()
life(["admitted", "scheduler dispatch", "waits for I/O", "scheduler dispatch"])
```

The second life is illegal because the scheduler can't pick a waiting process: until the data arrives, there's nothing to run.

## Summary

- The **`/proc/<PID>`** folders are "windows", generated by the kernel on the fly, onto processes' PCBs and address spaces (`status`, `fd`, `maps`).
- Thanks to **copy-on-write**, `fork()` is fast: only the page someone writes to is copied.
- **Zombie**: finished, but the parent hasn't called `wait()` (`Z`, `<defunct>`); **orphan**: the parent died earlier, the system adopts it.
- **Job control:** Ctrl + Z (suspend), `bg`, `fg`, `jobs`, `kill -STOP/-CONT`, `nohup`.
- Modern programs run on many threads; browsers use both processes and threads for security and stability.
- In the five-state model not every transition is allowed – e.g. from waiting you can only go to ready.

## Exercise

```quiz required
? In which folder do you find the data of the process with PID 1234 on Linux?
= /proc/1234
= /proc/1234/
! The kernel generates its contents on the fly.

? What does copy-on-write mean after fork()?
- the kernel immediately copies the parent's entire memory
+ parent and child share the pages, and a copy is made only of a page that is written
- the child may not write to memory
! This makes fork fast, and with the common fork + exec almost nothing needs copying.

? In the ps output a process's STAT column shows Z, with <defunct> next to it. What kind of process is this?
- orphan
+ zombie
- suspended
! It has finished, but its parent hasn't called wait() yet.

? A process's parent has died, and the process keeps running. Who becomes its new parent on Linux?
+ an adopting process, e.g. systemd (PID 1)
- nobody, the process continues without a parent
- the kernel stops it immediately
! The system adopts orphans.

? You suspended a foreground program in the terminal with Ctrl + Z. Which command continues it in the background?
= bg
= bg %1
! fg would bring it back to the foreground.

? In the five-state model a waiting process receives its I/O data. Which state does it go to?
- running
+ ready
- terminated
! It first has to go back to the ready queue; the scheduler picks it again.
```
