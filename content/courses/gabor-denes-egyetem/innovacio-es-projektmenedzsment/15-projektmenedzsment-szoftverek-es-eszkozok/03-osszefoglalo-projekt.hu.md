---
title: Összefoglaló projekt – egy kis szoftverprojekt teljes tervezése
summary: A tárgy módszereinek alkalmazása egyetlen példán – egy tanulócsoport-szervező alkalmazás projektje: ötlet és üzleti modell, projektalapító okirat, SMART cél és KPI-k, stakeholderek, WBS, hálóterv és kritikus út, RACI, kockázatok és tartalék, megszerzett érték, eszköz és lezárás.
minutes: 40
---

## Amit ebben a leckében megtanulsz

- hogyan kapcsolódnak össze a tárgy témakörei egy **valódi** projektben,
- hogyan készül el lépésről lépésre egy kis szoftverprojekt **teljes terve**,
- hogyan **ellenőrizd** a projekt állapotát félúton.

## 1. Az ötlet (1–3. témakör)

Egy hallgatói csapat észreveszi, hogy évfolyamtársaik nehezen találnak **tanulócsoportot** a vizsgaidőszakban. Az ötlet: egy **webes alkalmazás**, ahol tárgy és időpont szerint lehet csoportot keresni vagy indítani.

- **innováció típusa**: termékinnováció, **inkrementális** (meglévő megoldások – csevegők, naptárak – jobb kombinációja).
- **üzleti modell vászon** (röviden): _ügyfélszegmens_: egyetemi hallgatók; _értékajánlat_: 2 perc alatt tanulótárs; _csatornák_: hallgatói önkormányzat, közösségi média; _bevétel_: ingyenes alapverzió, prémium funkciók (**freemium**).

## 2. Projektalapító okirat (6–8. témakör)

| Elem         | Tartalom                                                                                              |
| ------------ | ----------------------------------------------------------------------------------------------------- |
| cél          | a webalkalmazás első verziójának (MVP) kiadása                                                        |
| SMART cél    | a félév 10. hetéig kiadott MVP, amelyen a vizsgaidőszak első hetében legalább 200 hallgató regisztrál |
| terjedelem   | regisztráció, csoportkeresés, csoport indítása, értesítés – **nem** része: mobilalkalmazás, fizetés   |
| költségvetés | 4 millió Ft (BAC)                                                                                     |
| szponzor     | a kar innovációs alapja                                                                               |
| KPI-k        | regisztrált hallgatók száma, létrejött csoportok száma, átlagos keresési idő                          |

## 3. Stakeholderek (13. témakör)

| Stakeholder            | Hatalom  | Érdekeltség | Stratégia                                      |
| ---------------------- | -------- | ----------- | ---------------------------------------------- |
| szponzor (kari alap)   | magas    | magas       | szorosan együttműködni                         |
| hallgatói önkormányzat | magas    | alacsony    | elégedetten tartani                            |
| hallgatók              | alacsony | magas       | folyamatosan tájékoztatni                      |
| egyetemi informatika   | magas    | alacsony    | elégedetten tartani (üzemeltetés, adatvédelem) |

## 4. WBS és hálóterv (7. témakör)

```text
 1 Tanulócsoport-alkalmazás MVP
 ├── 1.1 Követelmények (A)
 ├── 1.2 Felhasználói felület terve (B)
 ├── 1.3 Backend és adatbázis (C)
 ├── 1.4 Frontend (D)
 ├── 1.5 Integráció és tesztelés (E)
 └── 1.6 Kiadás (F)
```

| Tevékenység | Időtartam (nap) | Megelőző |
| ----------- | --------------- | -------- |
| A           | 3               | –        |
| B           | 4               | A        |
| C           | 6               | A        |
| D           | 5               | B        |
| E           | 3               | C, D     |
| F           | 1               | E        |

Utak:

- A–B–D–E–F: 3 + 4 + 5 + 3 + 1 = **16 nap**
- A–C–E–F: 3 + 6 + 3 + 1 = 13 nap

A **kritikus út** A–B–D–E–F, a projekt **16 nap**. C tartalékideje: 16 − 13 = **3 nap** – a backend fejlesztő tehát legfeljebb 3 napot csúszhat a projekt veszélyeztetése nélkül (erőforrás-simításra is használható, 14. témakör).

## 5. Szerepek – RACI (12. témakör)

| Tevékenység        | Projektvezető | Fejlesztők | UI-tervező | Szponzor |
| ------------------ | ------------- | ---------- | ---------- | -------- |
| követelmények      | **A**         | C          | C          | I        |
| UI-terv            | A             | C          | **R**      | I        |
| fejlesztés         | A             | **R**      | C          | –        |
| kiadás jóváhagyása | R             | I          | I          | **A**    |

Minden sorban **pontosan egy A** van; a követelményeknél a projektvezető egyszerre felel (R) és elszámoltatható (A).

## 6. Kockázatok és tartalék (4., 14. témakör)

| Kockázat                                                                  | Valószínűség | Hatás    | Várható érték |
| ------------------------------------------------------------------------- | ------------ | -------- | ------------- |
| a kulcs backend fejlesztő hetekre kiesik                                  | 20%          | 1,5 M Ft | 0,3 M Ft      |
| az egyetemi informatika nem engedélyezi a bejelentkezést egyetemi fiókkal | 30%          | 0,5 M Ft | 0,15 M Ft     |

A **kockázati tartalék** (contingency reserve) a várható értékek összege: 0,3 + 0,15 = **0,45 M Ft**. Válaszok: tudásmegosztás és páros programozás (mérséklés), korai egyeztetés az informatikával, tartalékként e-mailes regisztráció.

## 7. Állapot félúton – megszerzett érték (9. témakör)

A 8. napon: **PV** = 2,0 M Ft, **EV** = 1,6 M Ft, **AC** = 2,0 M Ft.

- CV = EV − AC = −0,4 M Ft (túlköltés), SV = EV − PV = −0,4 M Ft (késés)
- **CPI** = EV / AC = 1,6 / 2,0 = **0,8**, **SPI** = EV / PV = **0,8**
- **EAC** = BAC / CPI = 4 / 0,8 = **5 M Ft**

Teendő: a változáskezelési folyamat (14. témakör) szerint a projektvezető javaslatot tesz a szponzornak – például a „csoportértesítés” funkciót a következő verzióra halasztják (terjedelem csökkentése), vagy pótlólagos keretet kérnek.

## 8. Eszköz és csapatmunka (11., 15. témakör)

A csapat **hibrid** módon dolgozik: a fő mérföldköveket Gantt-diagramon követik, a fejlesztést kéthetes **sprintekben** végzik. Eszköz: **GitHub Projects** (a kód mellett, ingyenes) – a súlyozott mátrixon a Jirát kis különbséggel megelőzte a költség és a Git-integráció miatt. Munkafolyamat: Teendő → Folyamatban → Kódellenőrzés → Kész.

## 9. Lezárás (10. témakör)

- **átadás**: elfogadási teszt a szponzorral, üzemeltetés átadása az egyetemi informatikának,
- **értékelés**: a SMART cél és a KPI-k mérése a vizsgaidőszak első hetében,
- **tanulságok** (lessons learned): pl. „az egyetemi fiókos bejelentkezést már a követelményfázisban egyeztetni kell”,
- **archiválás** és a csapat elismerése.

## Összefoglalás

- Egy projekt során a tárgy összes témaköre előkerül: innováció → üzleti modell → okirat és célok → stakeholderek → WBS és ütemterv → szerepek → kockázatok → kontroll (EVM) → eszközök → lezárás.
- A számítások (kritikus út, tartalék, CPI, EAC) mögött mindig **döntés** áll: mit csináljon a projektvezető?

## A lecke feladata

```quiz required
? Hány napos a projekt a hálóterv alapján?
= 16
= 16 nap
! A kritikus út: A–B–D–E–F.

? Hány nap a C (backend) tevékenység tartalékideje?
= 3
= 3 nap
! 16 − 13.

? Mennyi a kockázati tartalék millió forintban?
= 0,45
= 0.45
! 0,2 · 1,5 + 0,3 · 0,5.

? A 8. napon EV = 1,6 M Ft, AC = 2,0 M Ft. Mennyi a CPI?
= 0,8
= 0.8
! EV / AC.

? BAC = 4 M Ft, CPI = 0,8. Mennyi az EAC millió forintban?
= 5
! BAC / CPI.

? Hány „A” (elszámoltatható) lehet egy RACI-mátrix egy sorában?
- akárhány
+ pontosan egy
- legalább kettő
- egy sem
! Egy tevékenységnek egy gazdája van.
```
