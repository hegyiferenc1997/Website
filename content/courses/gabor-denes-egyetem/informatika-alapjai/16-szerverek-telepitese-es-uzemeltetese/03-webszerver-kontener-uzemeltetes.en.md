---
title: Web Server, Containers, Operations
summary: Installing and configuring nginx, HTTPS with Let's Encrypt, Docker and Docker Compose, monitoring, logs, backups, availability.
minutes: 22
---

## What you will learn

- how to set up a **web server** (nginx) and **HTTPS**,
- what a **container** (Docker) is for and how to start an application with it,
- what **operations** is: monitoring, logs, backups, **availability**.

## Web server: nginx

```bash
sudo apt install nginx
systemctl status nginx
curl http://localhost          # the default “Welcome to nginx!” page
```

The site's files go into `/var/www/…`, the configuration lives in `/etc/nginx/sites-available/`:

```nginx
server {
    listen 80;
    server_name example.com www.example.com;
    root /var/www/example;
    index index.html;

    # Pass /api requests on to the application running in the background
    location /api/ {
        proxy_pass http://127.0.0.1:3000;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/example /etc/nginx/sites-enabled/
sudo nginx -t                  # check the configuration
sudo systemctl reload nginx    # reload without downtime
```

**HTTPS:** **Let's Encrypt** gives free certificates; `certbot` obtains, configures and automatically renews them:

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d example.com -d www.example.com
```

## Containers: Docker

A **container** packages an application **together with its dependencies** (libraries, runtime) and runs it isolated. The same container runs on the developer's laptop, in staging and on the production server – the end of “it works on my machine”. Unlike a virtual machine it contains no separate operating system, so it starts in **seconds** and uses little memory.

```bash
sudo apt install docker.io docker-compose-v2
sudo docker run -d --name web -p 8080:80 nginx   # an nginx container on port 8080
sudo docker ps                                    # running containers
sudo docker logs web                              # the container's log
```

**Docker Compose** starts several related containers (e.g. app + database) from one file:

```yaml
services:
  app:
    image: ghcr.io/example/app:1.4.2
    ports: ["3000:3000"]
    environment:
      DATABASE_URL: postgres://app:secret@db:5432/app
    depends_on: [db]
  db:
    image: postgres:18
    environment:
      POSTGRES_PASSWORD: secret
    volumes: ["dbdata:/var/lib/postgresql/data"] # data survives replacing the container
volumes:
  dbdata:
```

```bash
sudo docker compose up -d      # start every service in the background
```

Many containers on many machines are orchestrated by **Kubernetes** (automatic restarts, scaling, load balancing).

## Operations

**Monitoring:** continuously watch CPU, memory, disk and response time, and get **alerts** when something crosses a threshold (e.g. Prometheus + Grafana, Zabbix, Uptime Kuma, cloud monitoring).

```bash
htop                 # CPU, memory, processes
df -h                # disk usage
free -h              # memory
```

**Logs:** traces of errors are in the logs (`journalctl`, `/var/log/nginx/error.log`). In larger systems they go to a central log collector.

**Backups:** database backups (e.g. `pg_dump`) daily, following the 3-2-1 rule, **elsewhere**, with regular **restore tests**.

**Availability:** the percentage of time the service is reachable. It is fixed in the contract (SLA):

```python run
# How much downtime fits into a year at each availability level?
minutes_per_year = 365 * 24 * 60
for level in [99.0, 99.9, 99.99, 99.999]:
    down = minutes_per_year * (100 - level) / 100
    print(f"{level}% → {down:8.1f} min/year ({down / 60:.1f} hours)")
```

99.9% (“three nines”) allows about 8.8 hours of downtime a year. Higher levels need **redundancy**: several servers behind a **load balancer**, database replicas, even several data centres.

## Summary

- nginx: web pages and reverse proxy; `nginx -t`, `reload`; HTTPS with Let's Encrypt (`certbot`).
- Docker: the app with its dependencies, fast and portable; Compose for several containers; Kubernetes at scale.
- Operations: monitoring and alerts, logs, tested backups, availability (SLA), redundancy.

## Exercise

```quiz required
? Which command checks the nginx configuration before reloading?
= nginx -t
= sudo nginx -t
! Don't reload the server with a broken configuration.

? Which service gives **free** HTTPS certificates?
- DHCP
+ Let's Encrypt
- Docker Hub
- ufw
! certbot renews them automatically too.

? What is the main advantage of a container over a virtual machine?
+ it has no separate operating system, so it starts faster and uses fewer resources
- it can run a completely different kernel
- it needs no server
- it can't have bugs
! Containers use the host's kernel.

? Rounded, how many hours of downtime fit into a year at 99.9% availability?
= 9
= 8.8
! 525,600 minutes · 0.1% ≈ 525.6 minutes ≈ 8.8 hours.
```
