---
title: Szerepek és felelősségek a projektcsapatban
summary: Szponzor, irányítóbizottság, projektmenedzser, csapattagok, szakértők, megrendelő és felhasználók; a projektmenedzser kompetenciái; a felelősségek rögzítése RACI-mátrixszal.
minutes: 20
---

## Amit ebben a leckében megtanulsz

- kik a projekt **kulcsszereplői**, és mi a felelősségük,
- milyen **kompetenciák** kellenek egy projektmenedzsernek,
- hogyan rögzítsd a felelősségeket egy **RACI-mátrixban**.

## A projekt szerepei

```text
              Irányítóbizottság (steering committee)
                       │  ← benne: szponzor (elnök), megrendelő, kulcs-szállító
                       ▼
               Projektmenedzser
          ┌────────────┼────────────┐
      Csapatvezető  Csapatvezető  Szakértők
       ●  ●  ●       ●  ●          (SME)
```

| Szerep                                      | Felelőssége                                                                                                      |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **szponzor** (megbízó)                      | a projekt „gazdája”: biztosítja a pénzt és a támogatást, jóváhagyja az alapító okiratot, felel az üzleti esetért |
| **irányítóbizottság**                       | a legfontosabb döntések (fáziskapuk, nagy változások, eszkaláció)                                                |
| **projektmenedzser** (PM)                   | a projektcél elérése: tervezés, irányítás, kommunikáció, kockázatkezelés                                         |
| **csapattagok**                             | a munkacsomagok elvégzése, becslés, jelentés                                                                     |
| **szakértő** (SME, _Subject Matter Expert_) | szaktudás egy területen (pl. jog, biztonság), gyakran részmunkaidőben                                            |
| **megrendelő / felhasználók**               | követelmények, visszajelzés, elfogadás                                                                           |
| **vonalbeli vezetők**                       | az erőforrások (emberek) biztosítása a projekthez                                                                |

> Az agilis projekteknél (11. témakör) a **Product Owner** veszi át a megrendelői igények képviseletét és a priorizálást, a **Scrum Master** a folyamat támogatását.

## A projektmenedzser kompetenciái

Az **IPMA** és a **PMI** egyaránt három területre osztja a szükséges tudást (PMI: **„Talent Triangle”**):

1. **Szakmai, módszertani** tudás (_Ways of Working_): tervezés, ütemezés, költségvetés, kockázatkezelés, agilis és hagyományos módszerek.
2. **Emberi készségek** (_Power Skills_): vezetés, kommunikáció, tárgyalás, konfliktuskezelés, motiválás.
3. **Üzleti érzék** (_Business Acumen_): a stratégia és az üzleti környezet megértése, értékközpontú gondolkodás.

## A RACI-mátrix

A **RACI-mátrix** (felelősségi mátrix) a tevékenységeket és a szerepeket egy táblázatban kapcsolja össze. A betűk jelentése:

| Betű  | Jelentés                            | Szabály                                   |
| ----- | ----------------------------------- | ----------------------------------------- |
| **R** | _Responsible_ – **végrehajtó**      | elvégzi a munkát; lehet több is           |
| **A** | _Accountable_ – **elszámoltatható** | jóváhagy, végső felelős; **pontosan egy** |
| **C** | _Consulted_ – **konzultált**        | véleményét kikérik (kétirányú)            |
| **I** | _Informed_ – **tájékoztatott**      | értesítik az eredményről (egyirányú)      |

Példa:

| Tevékenység             | Szponzor | PM  | Fejlesztő | Tesztelő | Megrendelő |
| ----------------------- | -------- | --- | --------- | -------- | ---------- |
| követelményspecifikáció | I        | A   | C         | C        | R          |
| adatbázis megtervezése  |          | I   | **A, R**  | C        |            |
| tesztterv elkészítése   |          | A   | C         | R        | I          |
| átadás-átvétel          | A        | R   | I         | I        | C          |

Ellenőrzési szabályok:

- minden sorban **pontosan egy A** legyen (ha több van, senki sem felel igazán),
- minden sorban legyen **legalább egy R**,
- ha egy oszlopban túl sok az **A** vagy az **R**, az a személy túlterhelt lehet,
- ha egy oszlop üres, kérdés, kell-e az a szerep a projektbe.

## Összefoglalás

- Szponzor: pénz, támogatás, üzleti eset; irányítóbizottság: nagy döntések; PM: a cél elérése.
- PM-kompetenciák (PMI Talent Triangle): módszertani tudás, emberi készségek, üzleti érzék.
- RACI: Responsible (végrehajtó), Accountable (elszámoltatható – soronként pontosan egy), Consulted, Informed.

## A lecke feladata

```quiz required
? Ki biztosítja a projekt **pénzügyi forrását**, és felel az üzleti esetért?
+ a szponzor
- a tesztelő
- a Scrum Master
- a szakértő
! A szponzor a projekt „gazdája”.

? A RACI-mátrixban melyik betűből kell soronként **pontosan egy**?
- R
+ A
- C
- I
! Accountable: a végső felelős.

? Mit jelent a RACI „C” betűje?
- Controlling – ellenőrző
+ Consulted – konzultált, a véleményét kikérik
- Certified – minősített
- Customer – megrendelő
! Kétirányú kommunikáció.

? Egy RACI-mátrix 6 tevékenységet és 5 szerepet tartalmaz. Legalább hány „A” betűnek kell benne lennie?
= 6
! Soronként (tevékenységenként) pontosan egy.

? Melyik testület hozza meg a projekt **legfontosabb döntéseit** (pl. fáziskapuk, nagy változások)?
- a fejlesztőcsapat
+ az irányítóbizottság
- az ügyfélszolgálat
- a PMO támogató típusa
! Steering committee.
```
