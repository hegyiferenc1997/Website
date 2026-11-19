---
title: Practice – Installing and Operating Servers
summary: Review questions, a lab task and the course's closing summary worksheet.
minutes: 25
kind: practice
---

## Review questions

<details>
<summary>1. A company runs its web shop on a single server with RAID 1 and no backups. What risks do you see?</summary>

RAID 1 only protects against one disk failing. If another part of the server (power supply, motherboard) fails, the shop goes down (no redundancy). If someone deletes data or ransomware encrypts it, the data is lost on both disks, and there is no backup to restore from.

</details>

<details>
<summary>2. You turned on the firewall on a cloud server and since then you can't log in with SSH. What happened, and how do you fix it?</summary>

You didn't allow SSH (`ufw allow OpenSSH`) before turning the firewall on, so you locked yourself out. Log in through the provider's web console (or the remote management card) and allow it.

</details>

<details>
<summary>3. Why is it better to run the application and database with Docker Compose than to install them on the server by hand?</summary>

Because the whole environment is described in one file, it can be version-controlled, it starts the same way on any machine (development, staging, production), and an update or rollback takes one command.

</details>

**Lab task (in VirtualBox or on a trial cloud machine):**

1. Install Ubuntu Server 26.04 LTS with the OpenSSH server.
2. Log in from your own machine with an SSH key, and disable password login.
3. Update the packages, turn on the firewall (SSH + port 80).
4. Install nginx and replace the welcome page with your own `index.html`.
5. Watch `journalctl -u nginx` and `/var/log/nginx/access.log` while opening the page in a browser.

```python run
# Analysing the lines of an access log: count of status codes
log = [
    '192.168.56.1 - - [04/Nov/2026:10:00:01] "GET / HTTP/1.1" 200 612',
    '192.168.56.1 - - [04/Nov/2026:10:00:02] "GET /logo.png HTTP/1.1" 404 153',
    '192.168.56.7 - - [04/Nov/2026:10:00:05] "GET / HTTP/1.1" 200 612',
    '192.168.56.7 - - [04/Nov/2026:10:00:09] "POST /api/login HTTP/1.1" 500 87',
    '192.168.56.9 - - [04/Nov/2026:10:01:00] "GET /about HTTP/1.1" 200 1840',
]
codes = {}
for line in log:
    code = line.split('"')[2].split()[0]
    codes[code] = codes.get(code, 0) + 1
print(codes)
```

## Summary worksheet

```quiz required
? Which server type stores and queries data (e.g. PostgreSQL)?
- web server
+ database server
- DHCP server
- mail server
! The application queries it with SQL.

? Which memory type detects and corrects memory errors in servers?
= ECC
! Error-Correcting Code.

? How many requests with status code 200 are in the log above?
= 3
! Two requests failed: a 404 and a 500.

? Which tool orchestrates many containers on many machines (restarts, scaling)?
- nginx
- certbot
+ Kubernetes
- ufw
! Container orchestration.

? Into which file on the server does the public SSH key go?
+ ~/.ssh/authorized_keys
- /etc/nginx/nginx.conf
- /var/log/syslog
- ~/Documents/key.txt
! Keys listed there can log in.

? What is needed for very high (e.g. 99.99%) availability?
+ redundancy: several servers behind a load balancer, database replicas
- a single, very powerful server
- RAID 0
- turning off the firewall
! The loss of one machine shouldn't stop the service.
```
