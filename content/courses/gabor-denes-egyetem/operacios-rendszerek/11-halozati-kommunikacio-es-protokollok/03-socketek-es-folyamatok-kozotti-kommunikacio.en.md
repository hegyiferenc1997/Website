---
title: Sockets and Inter-Process Communication
summary: The steps of the socket API on server and client, a mini Python server, and pipes, shared memory and message queues.
minutes: 25
---

## What you will learn

- what a **socket** is and with which **system calls** a TCP connection is built,
- how to write a simple **server** and **client** in a few lines,
- in which ways two processes can communicate **within one machine** (IPC).

## The socket

A **socket** is an **endpoint** of communication: the gate between the program and the kernel's network stack. To the program it looks like a file – it gets a **file descriptor** to write to and read from. The **Berkeley socket API** (1983, BSD UNIX) works the same way on almost every system today; on Windows it is called **Winsock**.

```text
SERVER                                  CLIENT
socket()     ← create endpoint          socket()
bind(port)   ← bind to address, port
listen()     ← listen
accept()  ◄──── three-way handshake ───  connect(address, port)
recv() / send()  ◄──── data ────►        send() / recv()
close()                                 close()
```

`accept` is a **blocking** call: the server waits until a client shows up. It returns a **new socket** for every new connection, so a server can serve many clients (with threads or asynchronous I/O).

## Mini echo server in Python

Save it in the Ubuntu VM as `server.py` and run it: `python3 server.py`.

```python
# Simple TCP echo server: sends back in upper case whatever the client sends.
import socket

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:   # IPv4 + TCP
    s.bind(("127.0.0.1", 5000))     # reachable only from this machine, on port 5000
    s.listen()
    print("Waiting for a client…")
    conn, addr = s.accept()         # blocks until someone connects
    with conn:
        print("Connected:", addr)
        data = conn.recv(1024)
        conn.sendall(data.upper())
```

In **another** terminal the client can be the `nc` (netcat) program, or a similar few-line Python program using `connect`:

```bash
echo "hello kernel" | nc 127.0.0.1 5000    # reply: HELLO KERNEL
ss -tlnp | grep 5000                       # while the server runs: LISTEN state
```

## Inter-process communication (IPC)

If two processes run **on the same machine**, there are faster, simpler tools than the network:

| Method                | Description                                                                                                 | Example                    |
| --------------------- | ----------------------------------------------------------------------------------------------------------- | -------------------------- |
| **pipe**              | one-way byte stream between parent and child                                                                | `ls \| wc -l` in the shell |
| **named pipe** (FIFO) | the pipe has a name in the file system, anyone can open it                                                  | `mkfifo pipe`              |
| **UNIX socket**       | a socket, but with a file path, without networking                                                          | `/run/docker.sock`         |
| **shared memory**     | the same memory page in both processes' address spaces – the fastest, but must be synchronised (semaphore!) | `mmap`, `shm_open`         |
| **message queue**     | the kernel stores the messages and delivers them in order                                                   | POSIX `mq_open`            |
| **signals**           | a short notification (a number), carries no data                                                            | `kill -TERM`               |

Windows has their equivalents too: anonymous and named pipes, shared memory (`CreateFileMapping`), and Windows messages between windows.

## Summary

- A socket is an endpoint of communication; the program handles it as a file descriptor.
- Server: socket → bind → listen → accept → recv/send; client: socket → connect → send/recv.
- IPC on one machine: pipe, named pipe, UNIX socket, shared memory (the fastest), message queue, signals.

## Lesson exercise

```quiz required
? With which socket call does the server bind the socket to a port?
- listen
+ bind
- accept
- connect
! bind(("127.0.0.1", 5000))

? With which call does the client initiate a connection?
= connect
! On the server side accept corresponds to it.

? Which call blocks on the server until a client connects?
+ accept
- bind
- socket
- close
! It returns a new socket for every connection.

? Which IPC method is the fastest but needs separate synchronisation?
- pipe
- message queue
+ shared memory
- signal
! No copying, but race conditions must be handled with a semaphore.

? Which Linux command creates a named pipe?
= mkfifo
! mkfifo pipe – then it can be written and read from two terminals.
```
