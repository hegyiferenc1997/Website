---
title: Practice – Installing and Operating Servers
summary: Review questions, a lab task and the course's closing summary worksheet.
minutes: 50
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

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **How many servers?** Write the `servers(peak, capacity, utilisation, spare)` function, which gives the number of servers needed: $\lceil peak / (capacity \cdot utilisation) \rceil$ + the number of spare machines!

```python starter
def servers(peak, capacity, utilisation, spare):
    return peak // capacity
```

<details>
<summary>Solution</summary>

```python solution
from math import ceil

def servers(peak, capacity, utilisation, spare):
    return ceil(peak / (capacity * utilisation)) + spare   # round up: there's no half machine
```

</details>

```python test
assert servers(840, 150, 0.7, 0) == 8
assert servers(840, 150, 0.7, 1) == 9
assert servers(100, 150, 0.7, 1) == 2
print("All checks passed!")
```

**2.** **Percentile.** Write the `percentile(times, p)` function with the simplest ("nearest rank") method: sort the values and return the $\lceil p/100 \cdot n \rceil$-th element (counting from 1)!

```python starter
def percentile(times, p):
    return sum(times) / len(times)
```

<details>
<summary>Solution</summary>

```python solution
from math import ceil

def percentile(times, p):
    ordered = sorted(times)
    k = max(1, ceil(p / 100 * len(ordered)))   # the rank is at least 1
    return ordered[k - 1]
```

</details>

```python test
t = [120, 80, 95, 2000, 85, 90, 100, 110, 88, 92]
assert percentile(t, 50) == 92
assert percentile(t, 90) == 120
assert percentile(t, 100) == 2000
assert percentile([5], 95) == 5
print("All checks passed!")
```

**3.** **Can it be restored?** Write the `restorable(days_ago, daily, weekly, monthly)` function for a grandfather–father–son backup scheme! Return `"daily"` if `days_ago <= daily`; `"weekly"` if `days_ago <= weekly * 7`; `"monthly"` if `days_ago <= monthly * 30`; otherwise `"none"`.

```python starter
def restorable(days_ago, daily, weekly, monthly):
    return "daily"
```

<details>
<summary>Solution</summary>

```python solution
def restorable(days_ago, daily, weekly, monthly):
    if days_ago <= daily:
        return "daily"
    if days_ago <= weekly * 7:
        return "weekly"
    if days_ago <= monthly * 30:
        return "monthly"
    return "none"                       # we don't keep older backups
```

</details>

```python test
assert restorable(3, 7, 4, 12) == "daily"
assert restorable(20, 7, 4, 12) == "weekly"
assert restorable(200, 7, 4, 12) == "monthly"
assert restorable(400, 7, 4, 12) == "none"
print("All checks passed!")
```

### Quick check questions

```quiz
? Serving a request takes 20 ms. What is the average response time at 95% utilisation (ms)?
= 400
! $20 / (1 - 0.95) = 400$ ms.

? What does the N+1 principle mean?
- we always let in one more user
+ there are enough machines that the system handles the peak even if one fails
- every backup has one extra copy
- the number of servers is always odd
! It matters for maintenance too: one machine can be taken down.

? How many simultaneous disk failures does a RAID 6 array survive without data loss?
= 2
! RAID 5 survives one, RAID 6 two.

? What is the most important thing about a backup scheme that many skip?
- storing the backups as compressed as possible
+ regularly testing the restore
- putting every backup on the same disk
- checking the backups only once a year
! With a never-tested backup, you only find out on the day of disaster that it's unusable.
```
