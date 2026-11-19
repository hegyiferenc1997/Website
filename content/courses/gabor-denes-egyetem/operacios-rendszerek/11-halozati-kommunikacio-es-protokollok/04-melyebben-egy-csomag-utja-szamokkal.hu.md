---
title: Mélyebben – egy csomag útja számokkal
summary: Alhálózat-számolás bitenként és Pythonnal, hogyan dönti el a kernel az útválasztó táblából, merre menjen egy csomag (leghosszabb előtag), a beágyazás rezsije, egy IPv4-fejléc bájtonként és az ellenőrzőösszeg, a késleltetés és a fénysebesség korlátja, valamint a sávszélesség–késleltetés szorzat és a TCP-ablak.
minutes: 45
---

## Amit ebben a leckében megtanulsz

- **bitenként** és Pythonnal kiszámolni egy alhálózat címeit,
- hogyan dönt a kernel az **útválasztó táblából** (_routing table_), merre küldjön egy csomagot,
- mekkora a **beágyazás rezsije**, és miért drága sok apró csomag,
- hogyan néz ki egy **IPv4-fejléc** bájtonként, és hogyan működik az **ellenőrzőösszeg**,
- miért tart egy weboldal megnyitása **több körutazásig**, és mit tesz hozzá a **fénysebesség**,
- mi a **sávszélesség–késleltetés szorzat**, és miért kell nagy TCP-ablak a gyors, távoli letöltéshez.

## 1. Alhálózat-számolás bitenként

Az alapleckében láttad a `/24`, `/26` jelölést. Nézzük meg, mit csinál a gép valójában: a cím és a **maszk** között bitenkénti **ÉS** műveletet végez – ami megmarad, az a **hálózat címe**.

```text
cím:      192.168.10.77   = 11000000.10101000.00001010.01001101
maszk /26 255.255.255.192 = 11111111.11111111.11111111.11000000
ÉS:       192.168.10.64   = 11000000.10101000.00001010.01000000   ← hálózat
```

Az utolsó bájtban a maszk felső 2 bitje 1 (128 + 64 = 192), így a hálózatok 64-esével lépnek: .0, .64, .128, .192. A .77 a **.64–.127** tartományba esik.

```python run
# Alhálózat-számolás a beépített ipaddress modullal
import ipaddress

gep = ipaddress.ip_interface("192.168.10.77/26")
halo = gep.network
print("hálózat:       ", halo)
print("maszk:         ", halo.netmask)
print("első gép:      ", halo[1])
print("utolsó gép:    ", halo[-2])
print("szórási cím:   ", halo.broadcast_address)
print("kiosztható:    ", halo.num_addresses - 2)

# Ugyanez kézzel, bitműveletekkel
cim = int(ipaddress.ip_address("192.168.10.77"))
maszk = (0xFFFFFFFF << (32 - 26)) & 0xFFFFFFFF      # 26 darab 1-es bit balról
print("kézzel számolt hálózat:", ipaddress.ip_address(cim & maszk))

# Egy /24 felosztása négy /26-ra
for al in ipaddress.ip_network("192.168.10.0/24").subnets(new_prefix=26):
    print("  alhálózat:", al)
```

Miért fontos ez az operációs rendszernek? Mert ebből dönti el, hogy a címzett **ugyanazon a helyi hálózaton** van-e (akkor közvetlenül küldi neki), vagy az **átjárón** (_gateway_, a router) keresztül kell küldenie.

## 2. Az útválasztó tábla – merre menjen a csomag?

Minden gépnek van **útválasztó táblája**, a kernel minden kimenő csomagnál ebben keres. Nézd meg az Ubuntu VM-ben:

```bash
ip route          # pl.: default via 10.0.2.2 dev enp0s3
                  #      10.0.2.0/24 dev enp0s3 proto kernel scope link src 10.0.2.15
ip route get 8.8.8.8      # konkrétan merre menne egy csomag a 8.8.8.8 felé?
```

A szabály: ha több bejegyzés is illeszkedik, a **leghosszabb előtag** nyer (_longest prefix match_) – vagyis a legpontosabb. A `default` (0.0.0.0/0) minden címre illeszkedik, de csak akkor használja, ha nincs pontosabb.

```python run
# Leghosszabb előtag egyezés: a kernel útválasztási döntése leegyszerűsítve
import ipaddress

tabla = [
    ("0.0.0.0/0",      "átjáró 10.0.2.2 (internet)"),
    ("10.0.2.0/24",    "közvetlenül, enp0s3"),
    ("10.8.0.0/16",    "VPN-alagút, tun0"),
    ("10.8.5.0/24",    "irodai szerverek, VPN-en át"),
]

def utvonal(cel):
    cel = ipaddress.ip_address(cel)
    illeszkedok = [(ipaddress.ip_network(h), merre) for h, merre in tabla
                   if cel in ipaddress.ip_network(h)]
    halo, merre = max(illeszkedok, key=lambda x: x[0].prefixlen)   # a leghosszabb nyer
    return f"{str(cel):<12} → {merre:<30} (illeszkedő: {len(illeszkedok)}, nyertes: {halo})"

for cel in ["10.0.2.40", "10.8.1.1", "10.8.5.20", "8.8.8.8"]:
    print(utvonal(cel))
```

A `10.8.5.20` három bejegyzésre is illeszkedik (/0, /16, /24) – a /24 a legpontosabb, ezért az nyer.

**Hasonlat:** a postás először megnézi, hogy a cím a saját utcájában van-e (helyi hálózat); ha nem, de a kerületben, a kerületi postára viszi (pontosabb útvonal); ha végképp nem tudja, a központi postára (alapértelmezett átjáró).

## 3. A beágyazás ára

Minden réteg hozzáteszi a saját **fejlécét**. Egy tipikus Etherneten át küldött TCP-szegmensnél:

| Réteg    | Fejléc   |
| -------- | -------- |
| Ethernet | 14 bájt  |
| IPv4     | 20 bájt  |
| TCP      | 20 bájt  |
| Összesen | 54 bájt  |

Az Ethernet **MTU**-ja (a legnagyobb hasznos teher a keretben) **1500 bájt**; ebből az IP és a TCP fejléce után **1460 bájt** marad adatra. A hatékonyság csomagmérettől függ:

```python run
# A hasznos adat aránya a teljes keretben, különböző adatméreteknél
FEJLEC = 14 + 20 + 20          # Ethernet + IPv4 + TCP (bájt)

for adat in [1, 40, 200, 536, 1460]:
    keret = adat + FEJLEC
    print(f"{adat:>5} B adat → {keret:>5} B keret, hatékonyság {adat / keret:6.1%}")
```

Egy teljes csomagnál **96%** a hatékonyság, de ha SSH-n minden leütött betű külön csomagban megy, **1 bájt** adathoz 54 bájt fejléc tartozik (kevesebb mint 2%). Ezért gyűjti össze a TCP a kis írásokat (**Nagle-algoritmus**) – ami viszont késleltetést okozhat, ezért interaktív programok néha kikapcsolják (`TCP_NODELAY`). Az előző témakör pufferelési tanulsága itt is visszaköszön.

## 4. Egy IPv4-fejléc bájtonként

Az IP-fejléc 20 bájtja szigorú szerkezetű; a kernel ezeket a mezőket olvassa és írja. A Python `struct` modulja pont erre való: bájtokat mezőkre bont (a `!` a hálózati, _big-endian_ bájtsorrendet jelenti).

```python run
# Egy IPv4-fejléc felbontása és az ellenőrzőösszeg kiszámítása
import struct

def ellenorzo_osszeg(fejlec):
    # 16 bites szavak összege, a túlcsordulást visszahajtjuk, végül negáljuk
    s = 0
    for i in range(0, len(fejlec), 2):
        s += (fejlec[i] << 8) + fejlec[i + 1]
    while s >> 16:
        s = (s & 0xFFFF) + (s >> 16)
    return ~s & 0xFFFF

# Fejléc ellenőrzőösszeg nélkül (a 10–11. bájt egyelőre 0)
fejlec = bytes.fromhex("4500003c1c4640004006" + "0000" + "c0a80119" + "5db8d822")
osszeg = ellenorzo_osszeg(fejlec)
fejlec = fejlec[:10] + struct.pack("!H", osszeg) + fejlec[12:]
print("kiszámolt ellenőrzőösszeg:", hex(osszeg))

ver_ihl, tos, hossz, azon, flag_off, ttl, proto, chk, forras, cel = \
    struct.unpack("!BBHHHBBH4s4s", fejlec)
print("verzió:       ", ver_ihl >> 4)
print("fejléchossz:  ", (ver_ihl & 0x0F) * 4, "bájt")
print("teljes hossz: ", hossz, "bájt")
print("TTL:          ", ttl)
print("protokoll:    ", proto, "(6 = TCP, 17 = UDP, 1 = ICMP)")
print("forrás:       ", ".".join(map(str, forras)))
print("cél:          ", ".".join(map(str, cel)))

# A fogadó oldal: a teljes fejléc ellenőrzőösszege 0, ha nem sérült
print("ellenőrzés a fogadónál:", ellenorzo_osszeg(fejlec))
serult = bytearray(fejlec); serult[8] = 63   # a TTL 64 → 63 lett, de az összeget senki nem frissítette
print("sérült fejléc ellenőrzése:", ellenorzo_osszeg(bytes(serult)))
```

Néhány mező jelentése:

- **TTL** (_time to live_): minden router eggyel csökkenti; ha 0 lesz, eldobja a csomagot. Így egy rossz útvonalon körbe-körbe járó csomag nem kering örökké. A `traceroute` épp erre épít: 1, 2, 3… TTL-lel küld csomagokat, és megnézi, melyik router dobja el őket.
- **protokoll**: a felsőbb réteg – innen tudja a kernel, hogy a TCP vagy az UDP kódnak adja tovább.
- **ellenőrzőösszeg**: mivel a TTL routerenként változik, **minden router újraszámolja**.

## 5. Késleltetés: miért nem azonnali egy weboldal?

Egy HTTPS-oldal első megnyitásához több **körutazás** (_RTT_, _round-trip time_: oda-vissza idő) kell, mielőtt az első hasznos bájt megérkezik:

1. **DNS** – a név feloldása IP-címre: 1 RTT (a DNS-szerverig),
2. **TCP kézfogás** (SYN, SYN-ACK, ACK): 1 RTT,
3. **TLS 1.3 kézfogás** (titkosítás egyeztetése): 1 RTT,
4. **HTTP kérés és válasz**: 1 RTT.

A **fénysebesség** szab alsó korlátot: üvegszálban a fény kb. **200 000 km/s**-mal halad (a vákuumbeli kétharmada). Budapest–New York kb. 7000 km, így az oda-vissza út elméleti minimuma 2 · 7000 / 200 000 = **70 ms** – ennél gyorsabb kapcsolat fizikailag lehetetlen.

```python run
# Az első hasznos bájtig eltelt idő: körutazások × RTT
FENY_KM_S = 200_000                 # fény sebessége üvegszálban (km/s)
korutak = {"DNS": 1, "TCP": 1, "TLS 1.3": 1, "HTTP": 1}
osszes = sum(korutak.values())

for hova, km in [("Budapest–Szeged", 170), ("Budapest–Frankfurt", 1000),
                 ("Budapest–New York", 7000), ("Budapest–Sydney", 16000)]:
    min_rtt = 2 * km / FENY_KM_S * 1000              # ms, csak a fény útja
    valos_rtt = min_rtt * 1.5 + 5                     # útvonal-kerülők + routerek (becslés)
    print(f"{hova:<20} min. RTT {min_rtt:5.1f} ms, becsült RTT {valos_rtt:5.1f} ms → "
          f"első bájt ≈ {osszes * valos_rtt:6.0f} ms")
```

Ezért használnak a nagy oldalak **CDN**-t (a tartalom a felhasználóhoz közeli szerverről jön), és ezért spórol a TLS 1.3 egy teljes körutat a régebbi TLS 1.2-höz képest. A sávszélesség növelése ezen **nem** segít: a késleltetés és a sávszélesség két különböző dolog.

**Hasonlat:** a sávszélesség az autópálya sávjainak száma, a késleltetés a távolság. Hiába van 10 sáv, Szegedről Budapestre akkor is idő odaérni.

## 6. Sávszélesség–késleltetés szorzat és a TCP-ablak

A TCP nem küld vakon: legfeljebb annyi **nyugtázatlan** adat lehet úton, amennyi az **ablak** (_window_). Utána meg kell várnia a nyugtát – ami egy RTT múlva jön. Így az elérhető sebesség felső határa:

**sebesség ≤ ablak / RTT**

Hogy a vezetéket teljesen kihasználjuk, legalább a **sávszélesség–késleltetés szorzatnyi** adatnak kell úton lennie (ennyi „fér a csőbe”):

```python run
# Mekkora ablak kell, és mennyit érünk el egy adott ablakkal?
savszel = 100e6          # 100 Mbit/s
rtt = 0.050              # 50 ms

szukseges = savszel * rtt / 8
print(f"szükséges ablak: {szukseges / 1000:.0f} KB (sávszélesség × RTT)")

for ablak in [64 * 1024, 256 * 1024, 1024 * 1024]:
    seb = min(ablak * 8 / rtt, savszel)
    print(f"ablak {ablak // 1024:>5} KB → legfeljebb {seb / 1e6:6.1f} Mbit/s")
```

A klasszikus **64 KB**-os maximális ablakkal 50 ms RTT mellett hiába van 100 Mbit/s-os vonalad: legfeljebb kb. **10,5 Mbit/s**-ot érhetsz el! Ezért vezették be az **ablakskálázást** (_window scaling_), és ezért állítja a Linux kernel automatikusan a socket-puffereket (`net.ipv4.tcp_rmem`).

```bash
sysctl net.ipv4.tcp_rmem          # min, alapértelmezett, max fogadó puffer bájtban
sysctl net.ipv4.tcp_window_scaling   # 1 = bekapcsolva
ss -ti | head -20                  # élő kapcsolatok: rtt, cwnd (torlódási ablak)
```

## Összefoglalás

- A hálózat címe = cím **ÉS** maszk; a kernel ebből tudja, hogy a címzett helyi-e, vagy az átjárón át kell küldeni.
- Az útválasztó táblában a **leghosszabb előtag** nyer; a `default` csak végső menedék.
- A beágyazás rezsije csomagonként ~54 bájt: nagy csomagnál 96% hatékonyság, egybájtosnál 2% alatt.
- Az IPv4-fejléc mezőit (TTL, protokoll, címek) a kernel olvassa; az **ellenőrzőösszeget** minden router újraszámolja, mert a TTL változik.
- Egy HTTPS-oldal első bájtja ~**4 RTT**; a fénysebesség alsó korlátot szab (Budapest–New York ≥ 70 ms).
- **sebesség ≤ ablak / RTT**; a vonal kihasználásához sávszélesség × RTT méretű ablak kell.

## A lecke feladata

```quiz required
? Melyik hálózatba tartozik a 192.168.10.150/26 cím? (add meg a hálózat címét, pl. 192.168.10.0)
= 192.168.10.128
! A /26 hálózatok 64-esével lépnek: .0, .64, .128, .192 – a 150 a .128–.191 tartományba esik.

? Hány kiosztható gépcím van egy /27-es alhálózatban?
= 30
! 32 − 27 = 5 gépbit → 2⁵ − 2 = 30.

? Az útválasztó táblában van egy 0.0.0.0/0, egy 10.8.0.0/16 és egy 10.8.5.0/24 bejegyzés. Melyik szerint megy a 10.8.5.9 felé küldött csomag?
- 0.0.0.0/0, mert az illeszkedik mindenre
- 10.8.0.0/16, mert az van előbb
+ 10.8.5.0/24, mert az a leghosszabb illeszkedő előtag
! Longest prefix match.

? Mi történik egy IP-csomaggal, amelynek a TTL-je egy routernél 0-ra csökken?
+ a router eldobja (és általában ICMP-üzenettel jelez a feladónak)
- a router visszaállítja 64-re és továbbküldi
- a router a csomagot a célállomás helyett a DNS-szervernek küldi
! A traceroute erre épít.

? A TCP-ablak 64 KB, az RTT 100 ms. Legfeljebb hány KB/s-mal tölthetünk le, akármilyen gyors is a vonal?
= 640
= 640 KB/s
! sebesség ≤ ablak / RTT = 64 KB / 0,1 s = 640 KB/s.

? Miért nem lehet Budapest és New York (kb. 7000 km) között 50 ms-nál kisebb az RTT?
- mert a routerek legalább 50 ms-ig tárolják a csomagot
+ mert a fény üvegszálban kb. 200 000 km/s-mal halad, így már az oda-vissza út is legalább 70 ms
- mert a TCP kézfogás pontosan 50 ms-ig tart
! 2 · 7000 / 200 000 s = 0,07 s.
```
