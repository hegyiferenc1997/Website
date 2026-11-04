---
title: Installing and Securing a Linux Server
summary: Installing Ubuntu Server, SSH key login, users and sudo, updates, firewall (ufw), services with systemd.
minutes: 20
---

## What you will learn

- how to install **Ubuntu Server** (on a virtual machine or in the cloud),
- how to log in securely with an **SSH key**,
- the first steps: **user**, **updates**, **firewall**, **services**.

## Installation

Servers usually get an **LTS** (long-term support) release, because it receives security fixes for years. The installer of **Ubuntu Server 26.04 LTS** is text-based, without a graphical interface:

1. download the ISO from ubuntu.com and boot the machine from it (or create a VM in VirtualBox, or a cloud machine),
2. choose language, keyboard, network (DHCP is usually enough; a server gets a fixed address later),
3. disk: “use an entire disk”, with LVM,
4. enter a user name, a host name (e.g. `web01`) and a strong password,
5. **tick installing the OpenSSH server**,
6. after the reboot, log in.

## Logging in with SSH

**SSH** (Secure Shell, port 22) is an encrypted remote command line. From your own machine (Windows PowerShell too):

```powershell
ssh anna@192.168.56.10
```

Safer than password login is a **key pair**: the private key stays on your machine, the public key goes to the server.

```powershell
ssh-keygen -t ed25519                 # create a key pair on your own machine
ssh-copy-id anna@192.168.56.10        # Linux/macOS; on Windows copy the content of the .pub file
                                      # into the server's ~/.ssh/authorized_keys file
```

Once key login works, turn off password and root login on the server (`/etc/ssh/sshd_config`: `PasswordAuthentication no`, `PermitRootLogin no`), then `sudo systemctl restart ssh`.

## First steps on the server

```bash
sudo apt update && sudo apt upgrade -y        # update every package
sudo apt install unattended-upgrades          # automatic security updates

sudo adduser bela                              # new user
sudo usermod -aG sudo bela                     # administrator rights (sudo) for them

sudo ufw allow OpenSSH                         # firewall: keep SSH reachable!
sudo ufw allow 80,443/tcp                      # web
sudo ufw enable
sudo ufw status
```

`sudo` runs one command with administrator rights; do everyday work as a normal user (principle of least privilege).

## Services: systemd

Background programs (**services**, daemons) are managed by **systemd**:

```bash
systemctl status ssh             # is it running, since when, last log lines
sudo systemctl restart ssh       # restart
sudo systemctl enable nginx      # start together with the system
journalctl -u ssh --since today  # the service's log for today
```

## Summary

- Servers get an LTS release (Ubuntu Server 26.04 LTS), installed with the OpenSSH server.
- SSH key login, password and root login disabled.
- Updates (`apt`), a separate user with `sudo`, firewall (`ufw`), services (`systemctl`, `journalctl`).

## Exercise

```quiz required
? On which port does SSH run by default?
= 22
! Secure Shell.

? Which command creates an SSH key pair on your own machine?
- ssh-copy-id
+ ssh-keygen -t ed25519
- sudo ufw enable
- systemctl status ssh
! The private key stays with you, the public one is copied to the server.

? What must you allow on the firewall **before** turning it on on a remote server?
+ SSH (otherwise you lock yourself out)
- printing
- Bluetooth
- nothing
! sudo ufw allow OpenSSH.

? Which command checks whether a service (e.g. ssh) is running?
= systemctl status ssh
! systemd manages services.
```
