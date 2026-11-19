---
title: Practice – Processes and Threads
summary: Review questions, experiments in the Ubuntu VM and a summary worksheet.
minutes: 50
kind: practice
---

## Experiments in the Ubuntu VM

1. Start three `sleep 600 &` commands, then look at them: `jobs`, `ps -o pid,ppid,stat,cmd`. What is their parent's PPID? (Your shell's PID: `echo $$`.)
2. Stop one politely (`kill PID`) and another by force (`kill -9 PID`). What does the shell print?
3. Run `pstree -p $$`: you see your shell and its children.
4. Open `top` and press **H**: it switches to the thread view.

## Review questions

<details>
<summary>1. Why does fork() return different values to the parent and the child?</summary>

Because after fork both processes run the same code from the same point. From the return value (the child's PID to the parent, 0 to the child) the program decides which branch to continue on.

</details>

<details>
<summary>2. Why does a waiting process not go directly to the running state when the I/O completes?</summary>

Because another process may be running on the processor. When the I/O ends the process goes to the ready queue, and the scheduler decides when it gets the CPU again.

</details>

<details>
<summary>3. When are several threads better, and when several processes?</summary>

Threads: when the subtasks need to see a lot of shared data and fast switching is needed (e.g. a game's rendering and physics). Processes: when isolation is needed – one failure should not take the others down (e.g. Chrome runs every tab in a separate process).

</details>

<details>
<summary>4. What is the problem with many zombie processes?</summary>

Each occupies an entry (a PID) in the process table. If the parent never calls wait(), the PIDs can run out. Fix: repair or stop the parent – then PID 1 inherits the zombies and cleans them up.

</details>

## Summary worksheet

```quiz required
? Which state is a process in that is waiting for a key press?
- running
- ready
+ waiting (blocked)
- new
! A processor would not help, it waits for the event.

? Which key combination sends SIGINT to the program running in the terminal?
= Ctrl + C
= ctrl+c
= Ctrl+C
! Ctrl + Z suspends it (SIGSTOP).

? What is the signal number of SIGTERM?
= 15
! The default signal of the kill command.

? Which command shows the processes as a tree?
+ pstree
- jobs
- kill
- free
! pstree -p also prints the PIDs.

? A process starts 3 threads. How many stacks are needed in total, including the main thread?
= 4
! One stack per thread: 1 main thread + 3 new threads.

? What happens if one thread of a multithreaded process writes to an invalid memory address?
- Only that thread stops.
+ The whole process crashes.
- The kernel redirects it to another address.
- Nothing, the error is ignored.
! Threads run in a shared address space, so the error affects the whole process.
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **Valid state transition?** Write the `valid(src, dst)` function, which returns true if the process state model has such a transition: new → ready, ready → running, running → ready (time slice expired), running → waiting (waiting for I/O), waiting → ready, running → terminated.

```python starter
def valid(src, dst):
    return True
```

<details>
<summary>Solution</summary>

A waiting process can't become running directly: when the I/O finishes, the process goes to the ready queue, and the scheduler decides when it runs.

```python solution
TRANSITIONS = {
    ("new", "ready"), ("ready", "running"), ("running", "ready"),
    ("running", "waiting"), ("waiting", "ready"), ("running", "terminated"),
}

def valid(src, dst):
    return (src, dst) in TRANSITIONS
```

</details>

```python test
assert valid("ready", "running")
assert valid("running", "waiting")
assert not valid("waiting", "running")      # it must go to the ready queue first
assert not valid("new", "running")
assert not valid("terminated", "ready")
print("All checks passed!")
```

**2.** **Ancestors in the process tree.** The `parent` dictionary gives every PID's parent PID (the parent of `systemd`, PID 1, is 0). Write the `ancestors(pid, parent)` function, which returns the list of PIDs from the process up to PID 1 (like `pstree -s`)!

```python starter
def ancestors(pid, parent):
    return [pid]
```

<details>
<summary>Solution</summary>

```python solution
def ancestors(pid, parent):
    chain = [pid]
    while pid != 1:                   # go up to systemd
        pid = parent[pid]
        chain.append(pid)
    return chain
```

</details>

```python test
parent = {1: 0, 812: 1, 1500: 812, 1720: 1500, 1733: 1720, 900: 1}
assert ancestors(1733, parent) == [1733, 1720, 1500, 812, 1]
assert ancestors(900, parent) == [900, 1]
assert ancestors(1, parent) == [1]
print("All checks passed!")
```

**3.** **A race condition step by step.** Two threads (A and B) increment the same counter: each **reads** (copies the counter into its own register), then **writes** (writes back register + 1). Write the `simulate(schedule)` function, which returns the counter's value (initially 0) after a step sequence like `[("A", "read"), ("B", "read"), ...]`!

```python starter
def simulate(schedule):
    return 0
```

<details>
<summary>Solution</summary>

In the interleaved order both threads read 0 and both write back 1 – one increment is lost. A lock (mutex) prevents this.

```python solution
def simulate(schedule):
    counter = 0
    register = {}                     # every thread's own register
    for thread, op in schedule:
        if op == "read":
            register[thread] = counter
        else:                         # "write"
            counter = register[thread] + 1
    return counter
```

</details>

```python test
in_order = [("A", "read"), ("A", "write"), ("B", "read"), ("B", "write")]
interleaved = [("A", "read"), ("B", "read"), ("A", "write"), ("B", "write")]
assert simulate(in_order) == 2
assert simulate(interleaved) == 1     # an increment was lost!
assert simulate([]) == 0
print("All checks passed!")
```

### Quick check questions

```quiz
? Which of these do a process's threads NOT share with each other?
- the code
- the global variables
- the open files
+ the stack
! Every thread has its own stack and registers.

? What happens after the fork() call?
+ the process copies itself; the parent gets the child's PID, the child gets 0 as the return value
- the process stops and a new program starts in its place
- two threads are created in the same process
! Replacing the program is exec()'s job.

? What is a zombie process?
- a process infected by a virus
+ a terminated process whose exit code its parent hasn't read yet (wait)
- a process using 100% of the CPU
! It shows as a Z in the ps STAT column.

? Which signal politely asks a process to stop (the process can catch it and clean up)?
+ SIGTERM (15)
- SIGKILL (9)
- SIGSTOP (19)
! SIGKILL can't be caught – it stops immediately.

? Why is starting a new thread cheaper than starting a new process?
+ because the thread uses the existing address space, no new memory map is needed
- because threads use no memory
- because threads aren't managed by the kernel
! Switching between threads is also cheaper for this reason.
```
