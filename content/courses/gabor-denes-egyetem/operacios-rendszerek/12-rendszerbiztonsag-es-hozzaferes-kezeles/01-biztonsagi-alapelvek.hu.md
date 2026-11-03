---
title: Biztonsági alapelvek és fenyegetések
summary: A CIA-hármas, a kártevők fajtái, a hitelesítés (jelszó, hash, MFA) és a legkisebb jogosultság elve.
minutes: 20
---

## Amit ebben a leckében megtanulsz

- mi a biztonság három célja (**CIA**: bizalmasság, sértetlenség, rendelkezésre állás),
- milyen **fenyegetések** és **kártevők** léteznek,
- hogyan működik a **hitelesítés** (jelszó, hash, többfaktoros azonosítás), és mi a **legkisebb jogosultság elve**.

## A CIA-hármas

| Cél                                  | Jelentés                                         | Ha sérül…                          |
| ------------------------------------ | ------------------------------------------------ | ---------------------------------- |
| **bizalmasság** (_Confidentiality_)  | az adatot csak az láthatja, akinek szabad        | kiszivárognak a jelszavak          |
| **sértetlenség** (_Integrity_)       | az adatot csak az módosíthatja, akinek szabad    | valaki átírja a jegyeidet          |
| **rendelkezésre állás** (_Availability_) | a rendszer elérhető, amikor kell             | túlterheléses (DoS) támadás leállítja a Neptunt |

Ehhez jön a **hitelesítés** (ki vagy?) és az **engedélyezés** (mit tehetsz?): előbb az OS megállapítja, hogy tényleg te vagy-e, aztán azt, hogy hozzáférhetsz-e egy fájlhoz.

## Fenyegetések és kártevők

| Kártevő                | Mit csinál?                                                          |
| ---------------------- | -------------------------------------------------------------------- |
| **vírus**              | más programokba ágyazza magát, azok futtatásakor terjed             |
| **féreg** (_worm_)     | önállóan, a hálózaton terjed (pl. biztonsági résen át)               |
| **trójai**             | hasznos programnak álcázza magát                                     |
| **zsarolóvírus** (_ransomware_) | titkosítja a fájljaidat, és váltságdíjat kér                |
| **kémprogram**, **billentyűzetfigyelő** | adatokat, jelszavakat lop                           |
| **rootkit**            | mélyen (akár a kernelben) elrejti magát és más kártevőket           |

A leggyakoribb belépési pont ma nem a technika, hanem az **ember**: az **adathalászat** (_phishing_) hamis e-mailekkel, oldalakkal csal ki jelszavakat. A másik nagy kapu a **frissítetlen** szoftver ismert biztonsági rései.

## Hitelesítés

Az OS három dolog alapján azonosíthat:

- amit **tudsz** – jelszó, PIN,
- ami **nálad van** – telefon (hitelesítő alkalmazás), biztonsági kulcs, intelligens kártya,
- ami **vagy** – ujjlenyomat, arc (Windows Hello).

A **többfaktoros hitelesítés** (MFA) legalább kettőt kér a háromból – így egy ellopott jelszó önmagában kevés.

### Hogyan tárolja az OS a jelszót?

**Soha nem** sima szövegként! A rendszer a jelszó **hash**-ét (egyirányú függvénnyel képzett lenyomatát) tárolja, egy véletlen **sóval** (_salt_) kiegészítve. Belépéskor a beírt jelszóból ugyanígy hash készül, és ezt hasonlítja össze.

```bash
sudo grep "^$USER:" /etc/shadow    # a hash: $y$… (yescrypt) – maga a jelszó nincs ott
```

A hash-ből nem lehet visszafejteni a jelszót, csak **próbálgatni** – ezért számít a hossz: egy 12 karakteres, betűket, számokat, jeleket tartalmazó jelszó próbálgatással gyakorlatilag feltörhetetlen, egy 6 karakteres percek alatt megvan. Windowson a jelszó-hash-eket a **SAM** adatbázis tárolja.

## A legkisebb jogosultság elve

Minden felhasználó és program **csak annyi jogot** kapjon, amennyi a feladatához feltétlenül kell. Ezért:

- a napi munkát **ne rendszergazdaként** (root) végezd,
- a szolgáltatások saját, korlátozott felhasználóval fussanak (pl. `www-data`),
- egy telefonos alkalmazás ne kérjen hozzáférést a névjegyekhez, ha nincs rá szüksége.

Ha így egy program fertőződik meg, a kár a **jogaira korlátozódik**.

## Összefoglalás

- CIA: bizalmasság, sértetlenség, rendelkezésre állás; plusz hitelesítés és engedélyezés.
- Kártevők: vírus, féreg, trójai, zsarolóvírus, kémprogram, rootkit; a fő kapu az adathalászat és a frissítetlen szoftver.
- A jelszót sózott hash-ként tárolják; MFA: legalább két faktor.
- A legkisebb jogosultság elve korlátozza a kárt.

## A lecke feladata

```quiz required
? A CIA-hármas melyik eleme sérül, ha egy túlterheléses (DoS) támadás leállítja a weboldalt?
- bizalmasság
- sértetlenség
+ rendelkezésre állás
- hitelesítés
! A rendszer nem érhető el, amikor kell.

? Melyik kártevő titkosítja a fájlokat, és váltságdíjat követel?
= zsarolóvírus
= ransomware
! Ellene a legjobb védelem a 3-2-1 szabály szerinti mentés.

? Hogyan tárolja egy jól megírt OS a jelszavakat?
- sima szövegként, rejtett fájlban
- titkosítva, a kulccsal együtt
+ sózott, egyirányú hash-ként
- a BIOS-ban
! A hash-ből a jelszó nem fejthető vissza.

? Melyik Linux-fájlban vannak a felhasználói jelszavak hash-ei?
= /etc/shadow
! Csak a root olvashatja.

? Telefonos kód + jelszó: hány faktoros ez a hitelesítés?
= 2
! Amit tudsz (jelszó) + ami nálad van (telefon).
```
