---
title: Webszerver, konténer, üzemeltetés
summary: nginx telepítése és beállítása, HTTPS Let's Encrypttel, Docker és Docker Compose, monitorozás, naplók, mentés, rendelkezésre állás.
minutes: 22
---

## Amit ebben a leckében megtanulsz

- hogyan teszel fel egy **webszervert** (nginx) és **HTTPS**-t,
- mire jó a **konténer** (Docker), és hogyan indítasz el vele egy alkalmazást,
- mi az **üzemeltetés**: monitorozás, naplók, mentés, **rendelkezésre állás**.

## Webszerver: nginx

```bash
sudo apt install nginx
systemctl status nginx
curl http://localhost          # az alapértelmezett „Welcome to nginx!” oldal
```

A weboldal fájljai a `/var/www/…` mappába kerülnek, a beállítás a `/etc/nginx/sites-available/` mappában van:

```nginx
server {
    listen 80;
    server_name pelda.hu www.pelda.hu;
    root /var/www/pelda;
    index index.html;

    # Az /api kéréseket a háttérben futó alkalmazásnak adja tovább
    location /api/ {
        proxy_pass http://127.0.0.1:3000;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/pelda /etc/nginx/sites-enabled/
sudo nginx -t                  # a beállítás ellenőrzése
sudo systemctl reload nginx    # újratöltés leállás nélkül
```

**HTTPS:** a **Let's Encrypt** ingyenes tanúsítványt ad; a `certbot` beszerzi, beállítja és automatikusan meg is újítja:

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d pelda.hu -d www.pelda.hu
```

## Konténerek: Docker

A **konténer** egy alkalmazást a **függőségeivel együtt** csomagol (könyvtárak, futtatókörnyezet), és elkülönítve futtat. Ugyanaz a konténer fut a fejlesztő laptopján, a tesztkörnyezetben és az éles szerveren – vége a „nálam működik” problémának. A virtuális géppel szemben nincs benne külön operációs rendszer, ezért **másodpercek** alatt indul, és kevés memóriát eszik.

```bash
sudo apt install docker.io docker-compose-v2
sudo docker run -d --name web -p 8080:80 nginx   # egy nginx-konténer a 8080-as porton
sudo docker ps                                    # futó konténerek
sudo docker logs web                              # a konténer naplója
```

Több összetartozó konténert (pl. alkalmazás + adatbázis) a **Docker Compose** egy fájlból indít:

```yaml
services:
  app:
    image: ghcr.io/pelda/app:1.4.2
    ports: ["3000:3000"]
    environment:
      DATABASE_URL: postgres://app:titok@db:5432/app
    depends_on: [db]
  db:
    image: postgres:18
    environment:
      POSTGRES_PASSWORD: titok
    volumes: ["dbdata:/var/lib/postgresql/data"] # az adat túléli a konténer cseréjét
volumes:
  dbdata:
```

```bash
sudo docker compose up -d      # minden szolgáltatás indítása a háttérben
```

Sok konténert sok gépen a **Kubernetes** szervez (automatikus újraindítás, skálázás, terheléselosztás).

## Üzemeltetés

**Monitorozás:** folyamatosan figyeld a processzort, a memóriát, a lemezt, a válaszidőt, és kérj **riasztást**, ha valami határérték fölé megy (pl. Prometheus + Grafana, Zabbix, Uptime Kuma, felhős monitorozás).

```bash
htop                 # processzor, memória, folyamatok
df -h                # lemezhasználat
free -h              # memória
```

**Naplók:** a hibák nyoma a naplókban van (`journalctl`, `/var/log/nginx/error.log`). Nagyobb rendszerekben egy központi naplógyűjtőbe kerülnek.

**Mentés:** adatbázis-mentés (pl. `pg_dump`) naponta, a 3-2-1 szabály szerint, **máshová**, és rendszeres **visszaállítási próba**.

**Rendelkezésre állás:** azt mutatja, az idő hány százalékában érhető el a szolgáltatás. A szerződésben (SLA) rögzítik:

```python run
# Mennyi leállás fér bele egy évbe az egyes rendelkezésre állási szinteknél?
perc_evente = 365 * 24 * 60
for szint in [99.0, 99.9, 99.99, 99.999]:
    leallas = perc_evente * (100 - szint) / 100
    print(f"{szint}% → {leallas:8.1f} perc/év ({leallas / 60:.1f} óra)")
```

A 99,9% („három kilences”) évente kb. 8,8 óra leállást enged. A magasabb szinthez **redundancia** kell: több szerver **terheléselosztó** mögött, adatbázis-replika, akár több adatközpont.

## Összefoglalás

- nginx: weboldalak és fordított proxy; `nginx -t`, `reload`; HTTPS Let's Encrypttel (`certbot`).
- Docker: az alkalmazás függőségeivel, gyors, hordozható; Compose több konténerhez; Kubernetes nagy méretben.
- Üzemeltetés: monitorozás és riasztás, naplók, tesztelt mentés, rendelkezésre állás (SLA), redundancia.

## A lecke feladata

```quiz required
? Melyik paranccsal ellenőrzöd az nginx beállítását az újratöltés előtt?
= nginx -t
= sudo nginx -t
! Hibás beállítással ne töltsd újra a szervert.

? Melyik szolgáltatás ad **ingyenes** HTTPS-tanúsítványt?
- DHCP
+ Let's Encrypt
- Docker Hub
- ufw
! A certbot automatikusan meg is újítja.

? Mi a konténer fő előnye a virtuális géppel szemben?
+ nincs benne külön operációs rendszer, így gyorsabban indul és kevesebb erőforrást eszik
- teljesen más kernelt futtathat
- nem kell hozzá szerver
- nem lehet benne hiba
! A konténerek a gazdagép kernelét használják.

? Kerekítve hány óra leállás fér bele egy évbe 99,9%-os rendelkezésre állásnál?
= 9
= 8.8
! 525 600 perc · 0,1% ≈ 525,6 perc ≈ 8,8 óra.
```
