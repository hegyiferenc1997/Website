---
title: Gyakorlás – szerverek telepítése és üzemeltetése
summary: Ellenőrző kérdések, egy laborfeladat és a tárgy záró összefoglaló feladatlapja.
minutes: 25
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Egy cég egyetlen szerveren futtatja a webshopját, RAID 1-gyel, mentés nélkül. Milyen kockázatokat látsz?</summary>

A RAID 1 csak egy lemez kiesése ellen véd. Ha a szerver más része (táp, alaplap) romlik el, leáll a bolt (nincs redundancia). Ha valaki töröl vagy zsarolóvírus titkosít, mindkét lemezen elvész az adat, és nincs mentés, amiből vissza lehetne állni.

</details>

<details>
<summary>2. Bekapcsoltad a tűzfalat egy felhős szerveren, és azóta nem tudsz SSH-val belépni. Mi történt, és hogyan javítod?</summary>

A tűzfal bekapcsolása előtt nem engedélyezted az SSH-t (`ufw allow OpenSSH`), így kizártad magad. A szolgáltató webes konzolján (vagy a távfelügyeleti kártyán) keresztül lépj be, és engedélyezd.

</details>

<details>
<summary>3. Miért jobb az alkalmazást és az adatbázist Docker Compose-zal futtatni, mint kézzel telepíteni a szerverre?</summary>

Mert a teljes környezet egy fájlban van leírva, verziókezelhető, bármely gépen ugyanúgy elindul (fejlesztés, teszt, éles), és egy frissítés vagy visszaállás egy paranccsal megoldható.

</details>

**Laborfeladat (VirtualBoxban vagy felhős próbagépen):**

1. Telepíts egy Ubuntu Server 26.04 LTS-t OpenSSH-szerverrel.
2. Lépj be a saját gépedről SSH-kulccsal, és tiltsd le a jelszavas belépést.
3. Frissítsd a csomagokat, kapcsold be a tűzfalat (SSH + 80-as port).
4. Telepítsd az nginx-et, és cseréld le a nyitóoldalt egy saját `index.html`-re.
5. Nézd meg a `journalctl -u nginx` és a `/var/log/nginx/access.log` naplót, miközben megnyitod az oldalt a böngészőben.

```python run
# Egy hozzáférési napló (access.log) sorainak elemzése: állapotkódok száma
naplo = [
    '192.168.56.1 - - [04/Nov/2026:10:00:01] "GET / HTTP/1.1" 200 612',
    '192.168.56.1 - - [04/Nov/2026:10:00:02] "GET /logo.png HTTP/1.1" 404 153',
    '192.168.56.7 - - [04/Nov/2026:10:00:05] "GET / HTTP/1.1" 200 612',
    '192.168.56.7 - - [04/Nov/2026:10:00:09] "POST /api/login HTTP/1.1" 500 87',
    '192.168.56.9 - - [04/Nov/2026:10:01:00] "GET /rolunk HTTP/1.1" 200 1840',
]
kodok = {}
for sor in naplo:
    kod = sor.split('"')[2].split()[0]
    kodok[kod] = kodok.get(kod, 0) + 1
print(kodok)
```

## Összefoglaló feladatlap

```quiz required
? Melyik szerverfajta tárolja és kérdezi le az adatokat (pl. PostgreSQL)?
- webszerver
+ adatbázis-szerver
- DHCP-szerver
- levelezőszerver
! Az alkalmazás SQL-lel kérdezi le.

? Melyik memóriatípus ismeri fel és javítja a memóriahibákat a szerverekben?
= ECC
! Error-Correcting Code.

? Hány darab 200-as állapotkódú kérés van a fenti naplóban?
= 3
! Két kérés hibás: egy 404 és egy 500.

? Melyik eszköz szervez sok konténert sok gépen (újraindítás, skálázás)?
- nginx
- certbot
+ Kubernetes
- ufw
! Konténer-orkesztráció.

? Melyik fájlba kerül a nyilvános SSH-kulcs a szerveren?
+ ~/.ssh/authorized_keys
- /etc/nginx/nginx.conf
- /var/log/syslog
- ~/Documents/kulcs.txt
! Az ott felsorolt kulcsokkal lehet belépni.

? Mi kell a nagyon magas (pl. 99,99%-os) rendelkezésre álláshoz?
+ redundancia: több szerver terheléselosztóval, adatbázis-replika
- egyetlen, nagyon erős szerver
- RAID 0
- a tűzfal kikapcsolása
! Egy gép kiesése se állítsa le a szolgáltatást.
```
