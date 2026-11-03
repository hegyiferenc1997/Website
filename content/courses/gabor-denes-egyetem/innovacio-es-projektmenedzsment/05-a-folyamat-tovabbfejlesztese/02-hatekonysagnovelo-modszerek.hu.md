---
title: Hatékonyságnövelő módszerek
summary: Lean és a hét veszteség, értékáram-térkép, Six Sigma és a DMAIC, 5S, a Pareto-elv és az 5 miért módszer – informatikai példákkal.
minutes: 25
---

## Amit ebben a leckében megtanulsz

- mi a **Lean** szemlélet, és melyik a **hét veszteség**,
- mire jó az **értékáram-térkép**,
- mi a **Six Sigma**, és hogyan működik a **DMAIC**,
- hogyan használd az **5S**-t, a **Pareto-elvet** és az **5 miért** módszert.

## Lean

A **Lean** (karcsú) szemlélet a **Toyota termelési rendszerből** (Taiichi Ohno) ered. Lényege: mindent, ami a vevő szempontjából **nem teremt értéket**, veszteségnek (japánul _muda_) tekintünk, és kiküszöbölünk.

### A hét veszteség (TIMWOOD)

| Veszteség                        | Gyártásban                 | Szoftverfejlesztésben                          |
| -------------------------------- | -------------------------- | ---------------------------------------------- |
| **T**ransport – szállítás        | felesleges anyagmozgatás   | feladat átadása csapatok között                |
| **I**nventory – készlet          | raktáron álló alkatrész    | félkész, ki nem adott funkciók                 |
| **M**otion – mozgás              | felesleges kézmozdulatok   | váltogatás sok eszköz és feladat között        |
| **W**aiting – várakozás          | a gép áll, alkatrészre vár | jóváhagyásra, kódátnézésre várás               |
| **O**verproduction – túltermelés | több, mint amit kérnek     | senki által nem kért funkciók                  |
| **O**verprocessing – túlmunka    | felesleges megmunkálás     | túlbonyolított megoldás, felesleges dokumentum |
| **D**efects – hibák              | selejt, javítás            | programhibák, visszadobott feladatok           |

Gyakran nyolcadikként említik a **ki nem használt emberi tudást** is.

### Értékáram-térkép

Az **értékáram-térkép** (_Value Stream Mapping_) a folyamat összes lépését felrajzolja a megrendeléstől a szállításig, és minden lépésnél jelöli az **értékteremtő időt** és a **várakozást**. Gyakran kiderül, hogy az átfutási idő nagy része várakozás.

> **Folyamathatékonyság = értékteremtő idő / teljes átfutási idő**. Ha egy funkció 2 nap munkával készül el, de 20 nap telik el a kéréstől a kiadásig, a hatékonyság 2 / 20 = **10%**.

## Six Sigma

A **Six Sigma** (Motorola, 1986; később a General Electric tette híressé) a folyamat **szórásának** és **hibáinak** csökkentésére épülő, statisztikai módszertan. A cél: legfeljebb **3,4 hiba egymillió lehetőségre** (DPMO, _Defects Per Million Opportunities_).

Fejlesztési ciklusa a **DMAIC**:

1. **Define** – a probléma, a cél és a vevő igényeinek meghatározása.
2. **Measure** – a jelenlegi teljesítmény mérése.
3. **Analyze** – a hibák gyökérokainak elemzése.
4. **Improve** – megoldások kidolgozása és kipróbálása.
5. **Control** – az eredmény fenntartása (mérés, szabványosítás).

A **Lean Six Sigma** a két módszert ötvözi: Lean a gyorsaságért (veszteségek), Six Sigma a pontosságért (hibák).

## 5S

A munkahely (vagy egy kódtár, mappa, felhőfiók) rendben tartásának öt lépése:

| Japán        | Magyarul              | Példa egy kódtárban                        |
| ------------ | --------------------- | ------------------------------------------ |
| **Seiri**    | szortírozás           | a használaton kívüli fájlok, ágak törlése  |
| **Seiton**   | rendszerezés          | logikus mappaszerkezet                     |
| **Seiso**    | tisztítás             | kódformázó, figyelmeztetések javítása      |
| **Seiketsu** | szabványosítás        | közös kódolási szabályok                   |
| **Shitsuke** | fenntartás (fegyelem) | automatikus ellenőrzés minden módosításnál |

## Pareto-elv és 5 miért

- **Pareto-elv** (80/20 szabály): a hatások kb. **80%-át** az okok kb. **20%-a** okozza. Pl. a felhasználói panaszok 80%-a a funkciók 20%-ából jön – ezekkel kezdjük a javítást. A **Pareto-diagram** csökkenő sorrendben ábrázolja az okokat.
- **5 miért** (Toyota): addig kérdezünk rá egymás után a „miért?”-re, amíg el nem jutunk a **gyökérokig**.

Példa: _Leállt az oldal. Miért?_ Megtelt a lemez. _Miért?_ A naplófájlok nem törlődtek. _Miért?_ Nincs naplórotáció. _Miért?_ Kimaradt a telepítési ellenőrzőlistából. _Miért?_ Nincs is ilyen lista. → Gyökérok: hiányzik a telepítési ellenőrzőlista.

## Összefoglalás

- Lean: a vevő szempontjából értéket nem teremtő tevékenységek (hét veszteség, TIMWOOD) kiküszöbölése.
- Értékáram-térkép: értékteremtő idő és várakozás láthatóvá tétele.
- Six Sigma: hibák és szórás csökkentése, cél 3,4 DPMO, DMAIC-ciklus.
- 5S: szortírozás, rendszerezés, tisztítás, szabványosítás, fenntartás.
- Pareto (80/20) és 5 miért: a legfontosabb okok és a gyökérok megtalálása.

## A lecke feladata

```quiz required
? A Lean melyik veszteségtípusa a „**senki által nem kért funkciók** fejlesztése”?
- várakozás
+ túltermelés
- szállítás
- hibák
! Többet gyártunk, mint amire a vevőnek szüksége van.

? Hány hiba megengedett egymillió lehetőségre a Six Sigma szerint?
= 3,4
= 3.4
! 3,4 DPMO.

? Mi a DMAIC **negyedik** lépése?
- Define
- Measure
- Analyze
+ Improve
! Define → Measure → Analyze → Improve → Control.

? Egy funkció 3 nap munkával készül el, de a kéréstől a kiadásig 30 nap telik el. Hány százalék a folyamathatékonyság?
= 10
= 10%
! 3 / 30 · 100.

? A Pareto-elv szerint a hatások kb. hány százalékát okozza az okok 20%-a?
= 80
= 80%
! 80/20 szabály.

? Melyik módszer kérdez rá ismételten a „miért?”-re a gyökérok megtalálásához?
+ 5 miért
- 5S
- Kaizen
- értékáram-térkép
! A Toyota módszere.
```
