---
title: Költségvetés és a megszerzett érték módszere
summary: Költségbecslés és költségvetés, tartalékok, költség-alapterv, valamint az earned value (megszerzett érték) módszer mutatói – PV, EV, AC, CV, SV, CPI, SPI, EAC, VAC – kidolgozott példával.
minutes: 30
---

## Amit ebben a leckében megtanulsz

- hogyan épül fel egy projekt **költségvetése**,
- mi a különbség a **kockázati** és a **vezetői tartalék** között,
- hogyan méri az **earned value** (megszerzett érték) módszer egyszerre az időt és a költséget.

## Költségbecslés és költségvetés

- **Alulról felfelé** (_bottom-up_) becslés: minden munkacsomag költségét megbecsüljük, majd összegezzük – pontos, de munkaigényes.
- **Felülről lefelé** (analóg vagy paraméteres) becslés: gyors, a projekt elején használjuk.

Egy informatikai projekt tipikus költségei: **bérek** (gyakran a legnagyobb tétel), licencek, felhő és hardver, alvállalkozók, képzés, utazás.

```text
 munkacsomagok költsége
 + kockázati tartalék (ismert kockázatokra)      → költség-alapterv
 + vezetői tartalék (előre nem látható dolgokra) → teljes költségvetés
```

- **Kockázati tartalék** (_contingency reserve_): az **azonosított** kockázatokra (pl. EMV alapján, 4. témakör); a PM használhatja.
- **Vezetői tartalék** (_management reserve_): az **előre nem látható** eseményekre; csak a vezetés engedélyével használható, és **nem része** a költség-alaptervnek.

## A megszerzett érték módszere (EVM)

Az egyszerű „mennyit költöttünk?” kérdés félrevezető: ha a költségvetés felét elköltöttük, az jó vagy rossz? Attól függ, **mennyi munka készült el**. Az **EVM** (_Earned Value Management_) három alapértéke:

| Rövidítés | Név                                          | Jelentés                                                  |
| --------- | -------------------------------------------- | --------------------------------------------------------- |
| **PV**    | tervezett érték (_Planned Value_)            | a mostanáig **tervezett** munka költségvetése             |
| **EV**    | megszerzett érték (_Earned Value_)           | a mostanáig **ténylegesen elvégzett** munka költségvetése |
| **AC**    | tényleges költség (_Actual Cost_)            | a mostanáig **ténylegesen elköltött** pénz                |
| **BAC**   | teljes költségvetés (_Budget at Completion_) | a teljes projekt tervezett költsége                       |

> **EV = elkészültségi arány · BAC**

### Eltérések és indexek

| Mutató                             | Képlet  | Értelmezés                                         |
| ---------------------------------- | ------- | -------------------------------------------------- |
| **költségeltérés** (CV)            | EV − AC | < 0: túlköltés                                     |
| **ütemeltérés** (SV)               | EV − PV | < 0: késés                                         |
| **költségteljesítési index** (CPI) | EV / AC | < 1: túlköltés (1 Ft-ért kevesebb mint 1 Ft munka) |
| **ütemteljesítési index** (SPI)    | EV / PV | < 1: késés                                         |

### Előrejelzés

| Mutató                            | Képlet    | Jelentés                               |
| --------------------------------- | --------- | -------------------------------------- |
| **várható teljes költség** (EAC)  | BAC / CPI | ha a költséghatékonyság így marad      |
| **hátralévő költség** (ETC)       | EAC − AC  | még ennyi pénz kell                    |
| **várható eltérés a végén** (VAC) | BAC − EAC | < 0: a projekt túllépi a költségvetést |

## Kidolgozott példa

Egy szoftverprojekt teljes költségvetése **BAC = 100 millió Ft**, 10 hónap, egyenletes ütemezéssel. Az 5. hónap végén:

- a terv szerint a munka 50%-ának kellene kész lennie → **PV = 50**,
- valójában csak 40% készült el → **EV = 0,4 · 100 = 40**,
- eddig **AC = 50** millió Ft-ot költöttünk.

| Mutató | Számítás  | Eredmény | Értelmezés                         |
| ------ | --------- | -------- | ---------------------------------- |
| CV     | 40 − 50   | **−10**  | 10 millióval túlköltöttünk         |
| SV     | 40 − 50   | **−10**  | 10 millió értékű munkával késünk   |
| CPI    | 40 / 50   | **0,8**  | 1 Ft-ért csak 0,8 Ft munka         |
| SPI    | 40 / 50   | **0,8**  | a tervezett ütem 80%-ával haladunk |
| EAC    | 100 / 0,8 | **125**  | várhatóan 125 millióba kerül       |
| VAC    | 100 − 125 | **−25**  | 25 millió túllépés várható         |

```text
 költség ▲
         │                         ╱ PV (terv)
    50 ──┤ · · · · · · · · · · ● AC, PV
         │                ╱   │
    40 ──┤ · · · · · · ● EV   │  CV = EV − AC < 0
         │          ╱         │  SV = EV − PV < 0
         │      ╱             │
         └──────────────────── 5. hónap ──▶ idő
```

> A projekt **piros**: késik és drágább is. Beavatkozás kell (pl. terjedelemcsökkentés, hatékonyságnövelés) vagy változáskérés a költségvetésre.

## Összefoglalás

- Költségvetés = munkacsomagok + kockázati tartalék (= költség-alapterv) + vezetői tartalék.
- PV: tervezett, EV: elvégzett munka értéke, AC: tényleges költség.
- CV = EV − AC, SV = EV − PV, CPI = EV / AC, SPI = EV / PV.
- EAC = BAC / CPI, ETC = EAC − AC, VAC = BAC − EAC.
- Negatív eltérés, illetve 1 alatti index = rossz hír.

## A lecke feladata

```quiz required
? BAC = 200, a munka 30%-a készült el. Mennyi az EV?
= 60
! EV = 0,3 · 200.

? EV = 60, AC = 75. Mennyi a CPI?
= 0,8
= 0.8
! CPI = EV / AC.

? EV = 60, PV = 50. Mennyi az SPI?
= 1,2
= 1.2
! SPI = EV / PV.

? Az előző két kérdés adatai alapján (CPI = 0,8, SPI = 1,2) mi igaz a projektre?
+ előrébb tart a tervnél, de túlköltésben van
- késik, és túlköltésben van
- késik, de olcsóbb a tervezettnél
- előrébb tart, és olcsóbb is
! SPI > 1: gyorsabb; CPI < 1: drágább.

? BAC = 200, CPI = 0,8. Mennyi a várható teljes költség (EAC)?
= 250
! EAC = BAC / CPI = 200 / 0,8.

? Melyik tartalék **nem** része a költség-alaptervnek, és csak vezetői engedéllyel használható?
- kockázati tartalék
+ vezetői tartalék
- puffer
- munkacsomag-költség
! Management reserve: az előre nem látható eseményekre.
```
