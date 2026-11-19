---
title: Mélyebben – a hálózat számokkal
summary: IP-cím és alhálózati maszk kiszámolása programmal, hány eszköz fér egy hálózatba, mennyi ideig tart egy letöltés (sávszélesség és késleltetés), egy URL szétszedése részeire, és mit árulnak el az állapotkódok egy szerver naplójában – kis programokkal és interaktív ábrával.
minutes: 45
---

## Amit ebben a leckében megtanulsz

- hogyan olvasd ki egy IP-címből és **maszkból** a hálózatot és a gépek számát,
- miért nem csak a **sávszélesség** számít egy letöltésnél, hanem a **késleltetés** is,
- hogyan szedi szét a böngésző az **URL**-t részeire,
- hogyan elemezz egy szerver **naplóját** az állapotkódok alapján.

## 1. IP-cím és alhálózat

Az alapleckében láttuk, hogy egy IPv4-cím 4 bájt, pl. `192.168.1.37`. De honnan tudja a gép, hogy egy másik cím **ugyanabban a helyi hálózatban** van-e (és közvetlenül elérheti), vagy a routeren keresztül kell küldenie? Ebben segít az **alhálózati maszk**, rövid alakban a `/24` jelölés: az első 24 bit a hálózatot, a maradék 8 bit a gépet azonosítja.

```python run
# IP-cím és alhálózat a beépített ipaddress modullal
import ipaddress

gep = ipaddress.ip_interface("192.168.1.37/24")
halo = gep.network
print("hálózat:       ", halo)
print("maszk:         ", halo.netmask)
print("kiosztható cím:", halo.num_addresses - 2)       # hálózat- és szórási cím nélkül
print("első és utolsó:", list(halo.hosts())[0], "–", list(halo.hosts())[-1])

for masik in ["192.168.1.200", "192.168.2.5", "8.8.8.8"]:
    helyi = ipaddress.ip_address(masik) in halo
    print(f"{masik:<14} {'helyi hálózat, közvetlenül' if helyi else 'másik hálózat → a routeren át'}")

# a cím kettesben: az első 24 bit a hálózat
print(".".join(format(int(b), "08b") for b in "192.168.1.37".split(".")))
```

A `/24`-es hálózatban 254 eszköz fér el (256 címből a csupa 0 a hálózat, a csupa 1 a szórási cím). Ha kevesebb kell, a maszk hosszabb lehet: `/26` → 62 gép, `/30` → 2 gép (két router összekötésére). Egy kollégiumi szint vagy egy iroda tervezésénél ezt kell előre kiszámolni.

```python run
# Hány gép fér el különböző maszkokkal?
for elotag in [16, 20, 24, 26, 28, 30]:
    print(f"/{elotag}: {2 ** (32 - elotag) - 2:>6} kiosztható cím")
```

## 2. Mennyi ideig tart egy letöltés?

A szolgáltató „100 Mbit/s”-ot hirdet. Egy 50 MB-os fájl letöltése akkor $50 \cdot 8 / 100 = 4$ másodperc? Nagy fájlnál nagyjából igen. Egy **weboldal** viszont sok kis fájlból áll, és minden kéréshez kell egy oda-vissza út (**késleltetés**, RTT) – ilyenkor a késleltetés dominál:

$$\text{idő} \approx \text{kérések száma} \cdot \text{RTT} + \frac{\text{méret}}{\text{sávszélesség}}$$

```plot
title: Egy 2 MB-os, 40 fájlból álló oldal betöltési ideje (s) a sávszélesség (Mbit/s) függvényében
x: 1, 200
y: 0, 10
param: r = 50, 5, 300, 5
f: 40*r/1000 + 2*8/x # 40 kérés · RTT + méret / sávszélesség (RTT = r ms)
```

A csúszkával az RTT-t állíthatod (5 ms: jó vezetékes kapcsolat; 50 ms: átlagos mobil; 300 ms: műholdas internet). Figyeld meg: kb. 50 Mbit/s fölött a gyorsabb előfizetés **alig** segít, a késleltetés csökkentése viszont sokat. Ezért egyesítik a fejlesztők a fájlokat, használnak **CDN**-t (a tartalom a felhasználóhoz közeli szerverről jön), és ezért fontos, hogy egy oldal kevés kéréssel töltődjön be.

```python run
# Nagy fájl vs. sok kis fájl: mikor számít a sávszélesség, mikor a késleltetés?
def ido(meret_mb, keresek, mbit, rtt_ms):
    return keresek * rtt_ms / 1000 + meret_mb * 8 / mbit

for nev, meret, keres in [("film (1 fájl, 2000 MB)", 2000, 1), ("weboldal (40 fájl, 2 MB)", 2, 40)]:
    for mbit in [50, 500]:
        print(f"{nev:<26} {mbit:>3} Mbit/s, 50 ms: {ido(meret, keres, mbit, 50):7.2f} s")
```

A film letöltésénél a tízszeres sávszélesség tízszer gyorsabb; a weboldalnál szinte semmit sem változtat. (A valóságban a böngésző párhuzamosan is tölt, ami javít a helyzeten, de az elv ugyanaz.)

## 3. Egy URL részei

Mielőtt a böngésző bármit lekérne, szétszedi az URL-t: a **protokoll** megmondja, hogyan, a **gépnév** (domain), hogy kitől – ezt a DNS fordítja IP-címre –, a **port**, hogy melyik szolgáltatástól, az **útvonal** és a **paraméterek**, hogy mit:

```python run
# URL szétszedése részeire
from urllib.parse import urlsplit, parse_qs

url = "https://www.pelda-egyetem.hu:8443/orarend/keres?szak=mernokinfo&felev=1#hetfo"
r = urlsplit(url)
print("protokoll:", r.scheme)
print("gépnév:   ", r.hostname)
print("port:     ", r.port or {"http": 80, "https": 443}[r.scheme])
print("útvonal:  ", r.path)
print("paraméter:", parse_qs(r.query))
print("horgony:  ", r.fragment, "(ezt el sem küldi a szervernek)")
```

A **horgony** (`#` utáni rész) a böngészőnél marad, a szerver nem is látja. A paraméterekben viszont a felhasználó **bármit** elküldhet – egy jól megírt szervernek ezért minden bejövő paramétert ellenőriznie kell.

## 4. Egy szerver naplója: mit árulnak el az állapotkódok?

Az alapleckében megismerted az állapotkódokat: 2xx siker, 3xx átirányítás, 4xx a kliens hibája, 5xx a szerver hibája. Egy üzemeltető a naplóból azonnal látja, baj van-e:

```python run
# Webszerver-napló elemzése: állapotkódok osztályonként és a gyanús kérések
from collections import Counter

naplo = """10.0.0.5 GET /index.html 200
10.0.0.7 GET /orarend 200
10.0.0.5 GET /regi-oldal 301
10.0.0.9 GET /nincs-ilyen 404
10.0.0.66 GET /wp-admin 404
10.0.0.66 GET /.env 404
10.0.0.66 GET /admin.php 404
10.0.0.7 POST /api/foglalas 500
10.0.0.8 GET /orarend 200
10.0.0.5 GET /kepek/logo.png 304"""

sorok = [s.split() for s in naplo.splitlines()]
osztalyok = Counter(f"{kod[0]}xx" for _, _, _, kod in sorok)
print("állapotkód-osztályok:", dict(sorted(osztalyok.items())))
hibak = Counter(ip for ip, _, _, kod in sorok if kod == "404")
for ip, db in hibak.items():
    if db >= 3:
        print(f"gyanús: {ip} {db} nem létező oldalt próbált (pl. /.env, /wp-admin) – valószínűleg automatikus szkenner")
print("szerverhibák:", [ut for _, _, ut, kod in sorok if kod.startswith("5")])
```

A naplóból **két nézőpont** olvasható ki. Az **üzemeltető** az 5xx hibákat keresi (itt: a foglalási API elromlott – ezt azonnal javítani kell). A **biztonsági** szakember a mintázatokat: egy IP-cím sorban próbálgat tipikus sebezhető útvonalakat (`/.env`, `/wp-admin`) – ez egy automatikus szkenner, amely ellen a szerver például rate limitinggel (kérésszám-korláttal) védekezhet.

| Nézőpont                 | Mit lát a hálózatból?                 | Mire figyel?                                          |
| ------------------------ | ------------------------------------- | ----------------------------------------------------- |
| **felhasználó**          | „gyors” vagy „lassú” az oldal         | sávszélesség, Wi-Fi jel, mobilnet                     |
| **fejlesztő**            | kérések száma és mérete, állapotkódok | kevesebb kérés, tömörítés, CDN, gyorsítótár           |
| **üzemeltető**           | címek, alhálózatok, napló, terhelés   | 5xx hibák, kapacitás, címkiosztás                     |
| **biztonsági szakember** | gyanús mintázatok, nyitott portok     | szkennelés, túlterheléses támadás, titkosítás (HTTPS) |

## Összefoglalás

- Az alhálózati maszk (pl. `/24`) mondja meg, mely címek vannak a helyi hálózatban; $n$ bites gépazonosítóval $2^n - 2$ cím osztható ki.
- Egy letöltés ideje ≈ kérések · RTT + méret / sávszélesség: nagy fájlnál a sávszélesség, sok kis fájlnál a késleltetés dominál.
- Az URL protokollból, gépnévből, portból, útvonalból, paraméterekből és horgonyból áll; a paramétereket a szervernek mindig ellenőriznie kell.
- A szervernapló állapotkódjaiból a hibák (5xx) és a gyanús mintázatok (sok 404 egy címről) is kiolvashatók.

## A lecke feladata

```quiz required
? Hány kiosztható cím van egy `/26`-os hálózatban?
= 62
! $2^{32-26} - 2 = 64 - 2 = 62$.

? A gép címe `10.1.5.20/24`. Melyik cím van ugyanabban a helyi hálózatban?
+ `10.1.5.200`
- `10.1.6.20`
- `10.2.5.20`
- `192.168.5.20`
! Az első 24 bit (`10.1.5`) egyezik.

? Mennyi ideig tart egy 100 MB-os fájl letöltése 200 Mbit/s-on, ha a késleltetést elhanyagoljuk (másodperc)?
= 4
! $100 \cdot 8 / 200 = 4$ s.

? Egy oldal 60 kis fájlból áll, az RTT 100 ms. Mit javít a leginkább a betöltési időn?
- kétszer gyorsabb előfizetés
+ kevesebb kérés (fájlok egyesítése) és a felhasználóhoz közelebbi szerver (CDN)
- nagyobb képernyő
- új böngészőfül
! Sok kis fájlnál a késleltetés dominál.

? A naplóban egy IP-cím percenként tucatnyi 404-es választ kap `/.env` és `/wp-admin` kérésekre. Mi ez valószínűleg?
- egy elfelejtett jelszó
+ automatikus sebezhetőség-szkenner
- a szerver túlmelegedése
- egy normális felhasználó
! Ellene pl. kérésszám-korláttal és a gyanús címek tiltásával lehet védekezni.
```
