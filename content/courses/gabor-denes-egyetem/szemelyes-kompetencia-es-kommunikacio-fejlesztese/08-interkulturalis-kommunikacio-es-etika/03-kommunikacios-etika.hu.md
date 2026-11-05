---
title: A kommunikáció etikája
summary: Őszinteség és átláthatóság, adatvédelem és titoktartás, a szakmai etikai kódexek (ACM), befogadó nyelvhasználat és a mesterséges intelligencia felelős használata.
minutes: 20
---

## Amit ebben a leckében megtanulsz

- az **etikus kommunikáció** alapelveit,
- miért fontos az **adatvédelem** és a **titoktartás** a kommunikációban,
- mit mond egy **szakmai etikai kódex**,
- a **befogadó nyelvhasználat** szerepét,
- hogyan használd **felelősen** a mesterséges intelligenciát.

## Alapelvek

- **Őszinteség**: ne állíts valótlant, és ne hallgass el lényeges információt (pl. egy ismert hibát a megrendelő elől).
- **Átláthatóság**: legyen világos, ki mondja, milyen érdekből, és mi a forrás.
- **Tisztelet**: a másik méltóságát a vitában is megőrizzük.
- **Felelősség**: vállald a kimondott szavaid következményeit – és a hibáidat is.

> „Nem tudom, de utánanézek” vagy „Ezt én rontottam el, így javítom” – ezek a mondatok hosszú távon növelik a hitelességedet.

## Adatvédelem és titoktartás

Mérnökinformatikusként gyakran férsz hozzá **személyes adatokhoz** és **üzleti titkokhoz**.

- Az EU-ban a **GDPR** szabályozza a személyes adatok kezelését: csak a szükséges adatot, csak a megadott célra, biztonságosan.
- Ne küldj személyes adatot (pl. ügyféllistát) titkosítás nélkül, nyílt e-mailben vagy nyilvános csatornán.
- Hibajelentésbe, képernyőképre, nyilvános fórumra (pl. Stack Overflow) ne kerüljön valódi felhasználói adat, jelszó, API-kulcs.
- A munkáltatóval gyakran **titoktartási megállapodást** (NDA) kötsz: a belső információ nem mehet ki a közösségi médiába sem.

## Szakmai etikai kódexek

Az informatikusok nemzetközi szervezete, az **ACM** etikai kódexe (_ACM Code of Ethics and Professional Conduct_) többek között ezt kéri:

1. járulj hozzá a társadalom és az emberek **jólétéhez**,
2. **ne okozz kárt**,
3. légy **őszinte** és megbízható,
4. légy **igazságos**, ne diszkriminálj,
5. tiszteld a munkát, amely új ötleteket, találmányokat hoz létre (szerzői jog),
6. tiszteld a **magánszférát**,
7. tartsd tiszteletben a **titoktartást**.

## Befogadó nyelvhasználat

A szavak kizárhatnak vagy bevonhatnak.

- Kerüld a lekezelő, sztereotip megjegyzéseket („ezt még a nagymamám is érti”, „a lányok nem szeretik a kódolást”).
- Ne feltételezd mások nemét, hátterét: „a fejlesztő” helyett nem kell mindig „ő (férfi)”.
- Szakmai közösségekben egyre több helyen használnak semlegesebb kifejezéseket (pl. a _master/slave_ helyett _primary/replica_, a _blacklist_ helyett _blocklist_).
- A lényeg: a másik **méltóságát** tiszteld, és hallgasd meg, ha valakit egy kifejezés bánt.

## A mesterséges intelligencia felelős használata

Az MI-eszközök (chatbotok, kódsegédek) hasznosak, de etikai kérdéseket vetnek fel:

- **Átláthatóság**: ha egy szöveget vagy kódot jelentős részben MI-vel készítettél, és ez a felhasználás szempontjából lényeges (pl. egyetemi munka, publikáció), jelezd az adott hely szabályai szerint.
- **Ellenőrzés**: az MI magabiztosan is tévedhet (kitalált forrás, hibás kód) – a felelősség a tiéd.
- **Adatvédelem**: ne másolj be bizalmas céges kódot, személyes adatot egy olyan MI-eszközbe, amelyet a munkáltatód nem engedélyezett.
- **Szerzői jog és tisztesség**: a mások munkájának saját munkaként való feltüntetése akkor is plágium, ha egy MI „fogalmazta át”.

## Összefoglalás

- Etikus kommunikáció: őszinteség, átláthatóság, tisztelet, felelősség.
- Személyes adat és üzleti titok csak biztonságosan, a szükséges mértékben és célra (GDPR, NDA).
- Az ACM kódexe: jólét, ne árts, őszinteség, igazságosság, magánszféra, titoktartás.
- Befogadó nyelv: a másik méltóságának tisztelete.
- MI: átláthatóság, ellenőrzés, adatvédelem, tisztesség.

## A lecke feladata

```quiz required
? Egy hibajelentéshez képernyőképet csatolsz. Mire figyelj?
- minél több valódi felhasználói adat látszódjon, hogy reális legyen
+ ne látszódjon rajta valódi személyes adat, jelszó vagy API-kulcs
- a képernyőkép mindig legyen elmosódott
- csak fekete-fehér kép lehet
! Adatvédelem.

? Melyik uniós rendelet szabályozza a személyes adatok kezelését?
- NDA
+ GDPR
- ACM
- ISO 8601
! General Data Protection Regulation.

? Melyik az etikus viselkedés, ha egy általad írt hiba miatt leállt a szolgáltatás?
- hallgatsz, hátha senki nem veszi észre
- egy kollégára mutatsz
+ elmondod, hogy a te hibád volt, és mit teszel a javításért
- törlöd a naplókat
! Felelősség és őszinteség.

? Egy MI-eszköz által javasolt kódrészletet használsz. Kié a felelősség, ha hibás?
- az MI-eszközé
- senkié
+ a tiéd, aki beépítette
- a felhasználóé
! Ellenőrizd, mielőtt használod.
```
