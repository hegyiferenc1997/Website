---
title: IoT, peremszámítás, Ipar 4.0, digitális iker
summary: A dolgok internete, szenzoroktól a felhőig, peremszámítás, okosgyár, prediktív karbantartás, digitális iker, 5G.
minutes: 16
---

## Amit ebben a leckében megtanulsz

- mi a **dolgok internete** (IoT), és hogyan jut el az adat a szenzortól a felhőig,
- mi a **peremszámítás** (edge computing),
- mit jelent az **Ipar 4.0** és a **digitális iker**.

## A dolgok internete (IoT)

Az **IoT** (Internet of Things) olyan hétköznapi eszközök hálózata, amelyek **szenzorokkal** mérnek, és az interneten keresztül **adatot küldenek** vagy **vezérelhetők**: okosóra, termosztát, okosmérő, gyári gép, mezőgazdasági talajszenzor, nyomkövetővel ellátott szállítmány.

```text
 szenzorok ──► átjáró / perem ──► felhő ──► elemzés, irányítópult, riasztás
 (hőmérséklet,   (helyi előfeldolgozás)   (tárolás,     (ember vagy automatikus
  rezgés, GPS)                             MI-modell)     beavatkozás)
```

Tipikus protokollok: **MQTT** (könnyű üzenetküldés), Wi-Fi, Bluetooth Low Energy, **LoRaWAN** és NB-IoT (kis energia, nagy hatótáv), **5G**.

**Biztonság:** az IoT-eszközök gyakran gyenge pontok (gyári jelszó, sosem frissített firmware). Alapszabály: változtasd meg a gyári jelszót, frissíts, és tedd az eszközöket külön hálózati szegmensbe.

## Peremszámítás (edge computing)

Ha minden nyers adatot a felhőbe küldenénk, az lassú és drága lenne. A **peremszámítás** az adatot **a keletkezés helyén vagy annak közelében** dolgozza fel (a gépen, a gyárcsarnokban, egy átjárón), és csak a lényeget küldi tovább. Előnye: **kis késleltetés** (egy önvezető autónak ezredmásodpercek alatt kell döntenie), kisebb hálózati forgalom, és működik akkor is, ha megszakad az internet.

## Ipar 4.0

Az **Ipar 4.0** a negyedik ipari forradalom: a gyártás **összekapcsolt, adatvezérelt** és részben **önszabályozó** lesz.

| Forradalom | Fő újítás                                   |
| ---------- | ------------------------------------------- |
| 1.         | gőzgép, gépesítés (18. század)              |
| 2.         | elektromosság, futószalag                   |
| 3.         | számítógép, automatizálás, PLC              |
| **4.**     | **IoT, felhő, MI, kiberfizikai rendszerek** |

Példák: **prediktív karbantartás** (a rezgésszenzor adataiból az MI előre jelzi, mikor romlik el egy csapágy, így azelőtt cserélik, hogy leállna a sor), automatikus minőségellenőrzés kamerával, robotok és cobotok, valós idejű készletkövetés.

## Digitális iker

A **digitális iker** (digital twin) egy fizikai objektum (gép, gyár, épület, akár város) **élő, virtuális mása**, amelyet a valós szenzoradatok folyamatosan frissítenek. Rajta kockázat nélkül ki lehet próbálni a változtatásokat („mi lenne, ha 20%-kal gyorsabban járna a szalag?”), és előre látni a problémákat.

## Összefoglalás

- IoT: szenzoros, hálózatra kötött eszközök; szenzor → perem → felhő → elemzés.
- Peremszámítás: helyi feldolgozás, kis késleltetés, kevesebb forgalom.
- Ipar 4.0: összekapcsolt, adatvezérelt gyártás; digitális iker: élő virtuális másolat.

## A lecke feladata

```quiz required
? Mit jelent az IoT rövidítés?
= Internet of Things
= dolgok internete
! Hálózatra kötött, szenzoros eszközök.

? Mi a peremszámítás legfontosabb előnye egy önvezető autónál?
- olcsóbb a felhő
+ kis késleltetés: helyben, azonnal dönt
- szebb a kijelző
- nem kell szenzor
! Ezredmásodperceken múlhat egy döntés.

? Hányadik ipari forradalomhoz köthető az IoT, a felhő és az MI a gyártásban?
= 4
= negyedik
! Ipar 4.0.

? Hogy hívják egy gép vagy gyár valós adatokkal frissülő, virtuális mását?
+ digitális iker
- biztonsági mentés
- drótváz
- virtuális gép
! Digital twin.
```
