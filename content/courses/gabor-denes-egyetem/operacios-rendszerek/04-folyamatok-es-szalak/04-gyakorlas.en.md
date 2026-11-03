---
title: Practice – Processes and Threads
summary: Review questions, experiments in the Ubuntu VM and a summary worksheet.
minutes: 25
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
