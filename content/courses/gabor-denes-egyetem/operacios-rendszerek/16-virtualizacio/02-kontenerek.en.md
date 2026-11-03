---
title: Containers
summary: What a container is and how it differs from a virtual machine; namespaces, cgroups, layered images, Docker and Podman in practice.
minutes: 25
---

## What you will learn

- what a **container** is and how it differs from a **virtual machine**,
- the two kernel features it is built on: **namespaces** and **cgroups**,
- how to start a container with **Docker** on your Ubuntu VM.

## Virtual machine or container?

A virtual machine runs a **complete operating system** with its own kernel. A **container**, in contrast, is only an **isolated group of processes** on the host kernel: it sees its own file system, network and process list, but the kernel is **shared**.

|               | **Virtual machine**              | **Container**                                                    |
| ------------- | -------------------------------- | ---------------------------------------------------------------- |
| kernel        | its own                          | the host's, shared                                               |
| start-up      | ten seconds to minutes           | typically under a second                                         |
| size          | several GB (full OS)             | a few MB to a few hundred MB                                     |
| isolation     | strong (hardware boundary)       | weaker (shared kernel)                                           |
| OS it can run | anything (even Windows on Linux) | one built on the same kernel (Linux container on a Linux kernel) |

That is why on Windows and macOS Docker Desktop starts a small **Linux virtual machine** in the background (WSL 2 on Windows), and the Linux containers run inside it.

## What a container is built on

A container is not a separate technology but the combination of two Linux kernel features:

- **Namespaces**: isolate **what a process sees**. In its own **PID** namespace the container's first process has PID 1 and sees no other processes; in the **mount** namespace it has its own root file system; in the **net** namespace its own network card and IP address; there are also **UTS** (host name), **IPC** and **user** namespaces.
- **cgroups** (_control groups_): limit **how much it can use**: CPU time, memory, disk I/O, number of processes. If the container exceeds its memory limit, the kernel kills it (OOM).

On top of this comes the **layered image**: the container's file system consists of read-only layers (e.g. Ubuntu base + Python + the application), and the container gets a thin writable layer above them. So ten containers built on the same image store the shared layers only once.

## Docker in practice

On your Ubuntu VM (topic 1):

```bash
sudo apt install docker.io         # install Docker from the Ubuntu package
sudo usermod -aG docker $USER      # use without sudo (then sign out and back in)
docker run hello-world             # test: downloads and runs the image
docker run -it --rm ubuntu bash    # interactive Ubuntu container; deleted on exit
docker run -d -p 8080:80 --name web nginx   # web server in the background, on host port 8080
docker ps                          # running containers
docker stop web && docker rm web   # stop, delete
docker images                      # downloaded images
```

Run `ps aux` inside the container: you see only one or two processes – that is the effect of the PID namespace. The `--memory 256m` and `--cpus 0.5` options set the cgroups limits.

Your own image is described by a **Dockerfile**:

```dockerfile
# base layer
FROM python:3.13-slim
# the application's layer
COPY hello.py /app/hello.py
# what starts in the container
CMD ["python", "/app/hello.py"]
```

```bash
docker build -t hello .        # build the image
docker run --rm hello          # run it
```

**Podman** is an alternative compatible with Docker's commands that runs without a background daemon, even as a normal user (_rootless_). **Kubernetes** orchestrates many containers in the cloud.

## Summary

- Container: isolated group of processes on the shared host kernel; VM: full OS with its own kernel.
- Namespaces: what it sees (PID, mount, net, UTS, IPC, user); cgroups: how much it can use.
- Layered images: read-only layers + a thin writable layer.
- Docker: `run`, `ps`, `stop`, `build`; alternative: Podman; orchestration: Kubernetes.

## Exercise

```quiz required
? Which Linux kernel feature limits a container's memory and CPU use?
+ cgroups
- namespaces
- paging
- system call table
! Namespaces control what a process sees, cgroups how much it can use.

? In its own PID namespace, which PID does a container's first process get inside the container?
= 1
! Meanwhile it has a completely different PID on the host.

? Why does Docker Desktop on Windows need a Linux virtual machine for Linux containers?
+ because containers use the host's kernel, and a Linux container needs a Linux kernel
- because Windows cannot store files
- because Docker only runs on 32-bit systems
- because containers always bring their own kernel
! The container and the host share the kernel.

? Which Docker command starts an interactive Ubuntu container that is deleted on exit?
- docker ps -a ubuntu
+ docker run -it --rm ubuntu bash
- docker build ubuntu
- docker stop ubuntu
! -it: interactive terminal, --rm: delete on exit.
```
