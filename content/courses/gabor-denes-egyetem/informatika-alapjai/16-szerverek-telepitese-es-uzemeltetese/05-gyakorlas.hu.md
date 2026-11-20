---
title: Gyakorlás – szerverek telepítése és üzemeltetése
summary: Ellenőrző kérdések, egy laborfeladat és a tárgy záró összefoglaló feladatlapja.
minutes: 50
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

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **Hány szerver kell?** Írd meg a `szerverek(csucs, kapacitas, kihasznaltsag, tartalek)` függvényt, amely megadja a szükséges szerverek számát: $\lceil csucs / (kapacitas \cdot kihasznaltsag) \rceil$ + a tartalék gépek száma!

```python starter
def szerverek(csucs, kapacitas, kihasznaltsag, tartalek):
    return csucs // kapacitas
```

<details>
<summary>Megoldás</summary>

```python solution
from math import ceil

def szerverek(csucs, kapacitas, kihasznaltsag, tartalek):
    return ceil(csucs / (kapacitas * kihasznaltsag)) + tartalek   # felfelé kerekítünk: fél gép nincs
```

</details>

```python test
assert szerverek(840, 150, 0.7, 0) == 8
assert szerverek(840, 150, 0.7, 1) == 9
assert szerverek(100, 150, 0.7, 1) == 2
print("Minden ellenőrzés sikeres!")
```

**2.** **Percentilis.** Írd meg a `percentilis(idok, p)` függvényt a legegyszerűbb („nearest rank”) módszerrel: rendezd sorba az értékeket, és add vissza a $\lceil p/100 \cdot n \rceil$-edik elemet (1-től számolva)!

```python starter
def percentilis(idok, p):
    return sum(idok) / len(idok)
```

<details>
<summary>Megoldás</summary>

```python solution
from math import ceil

def percentilis(idok, p):
    rendezett = sorted(idok)
    k = max(1, ceil(p / 100 * len(rendezett)))   # a rang legalább 1
    return rendezett[k - 1]
```

</details>

```python test
t = [120, 80, 95, 2000, 85, 90, 100, 110, 88, 92]
assert percentilis(t, 50) == 92
assert percentilis(t, 90) == 120
assert percentilis(t, 100) == 2000
assert percentilis([5], 95) == 5
print("Minden ellenőrzés sikeres!")
```

**3.** **Visszaállítható-e?** Írd meg a `visszaallithato(napja, napi, heti, havi)` függvényt egy nagyapa–apa–fiú mentési rendhez! Adja vissza: `"napi"`, ha `napja <= napi`; `"heti"`, ha `napja <= heti * 7`; `"havi"`, ha `napja <= havi * 30`; különben `"nincs"`.

```python starter
def visszaallithato(napja, napi, heti, havi):
    return "napi"
```

<details>
<summary>Megoldás</summary>

```python solution
def visszaallithato(napja, napi, heti, havi):
    if napja <= napi:
        return "napi"
    if napja <= heti * 7:
        return "heti"
    if napja <= havi * 30:
        return "havi"
    return "nincs"                      # régebbi mentést nem tartunk meg
```

</details>

```python test
assert visszaallithato(3, 7, 4, 12) == "napi"
assert visszaallithato(20, 7, 4, 12) == "heti"
assert visszaallithato(200, 7, 4, 12) == "havi"
assert visszaallithato(400, 7, 4, 12) == "nincs"
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Egy kérés kiszolgálása 20 ms. Mennyi az átlagos válaszidő 95%-os kihasználtságnál (ms)?
= 400
! $20 / (1 - 0{,}95) = 400$ ms.

? Mit jelent az N+1 elv?
- mindig eggyel több felhasználót engedünk be
+ annyi gép van, hogy egy kiesése esetén is elbírja a rendszer a csúcsot
- minden mentésből eggyel több példány van
- a szerverek száma mindig páratlan
! Karbantartáskor is fontos: egy gépet le lehet állítani.

? Egy RAID 6 tömb hány lemez egyidejű kiesését viseli el adatvesztés nélkül?
= 2
! A RAID 5 egyet, a RAID 6 kettőt.

? Mi a legfontosabb teendő egy mentési renddel kapcsolatban, amit sokan kihagynak?
- a mentéseket minél tömörebben tárolni
+ rendszeresen kipróbálni a visszaállítást
- minden mentést ugyanarra a lemezre tenni
- a mentéseket csak évente ellenőrizni
! Egy sosem kipróbált mentésről csak a baj napján derül ki, hogy használhatatlan.
```
