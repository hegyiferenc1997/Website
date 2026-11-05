---
title: A munkanélküliség fajtái és kezelése
summary: Miért van mindig munkanélküliség? Súrlódásos, strukturális, ciklikus és szezonális munkanélküliség, a természetes ráta, az Okun-törvény, a Phillips-görbe és a foglalkoztatáspolitika eszközei.
minutes: 25
---

## Amit ebben a leckében megtanulsz

- a munkanélküliség **négy fajtáját**,
- mi a **természetes munkanélküliségi ráta**,
- mit mond az **Okun-törvény**,
- mit mutat a **Phillips-görbe**,
- mik az **aktív** és a **passzív** foglalkoztatáspolitikai eszközök.

## A munkanélküliség fajtái

| Fajta            | Oka                                                            | Példa                                                         | Kezelése                              |
| ---------------- | -------------------------------------------------------------- | ------------------------------------------------------------- | ------------------------------------- |
| **súrlódásos**   | az álláskeresés időbe telik                                    | a frissen diplomázott fejlesztő a 3. interjúnál tart          | álláskereső portálok, jobb információ |
| **strukturális** | a keresett és a meglévő készségek, helyek **nem illeszkednek** | a bezárt szénbánya bányászai, miközben programozókat keresnek | átképzés, mobilitás támogatása        |
| **ciklikus**     | a gazdaság **visszaesése** miatt kevés a munka                 | recesszióban elbocsátások                                     | fiskális és monetáris élénkítés       |
| **szezonális**   | az évszakok                                                    | téli építőipar, nyári turizmus                                | –                                     |

A **technológiai munkanélküliség** a strukturális egy fajtája: az automatizálás egyes munkaköröket megszüntet (3. lecke és 12. témakör).

## A természetes munkanélküliségi ráta

A súrlódásos és a strukturális munkanélküliség **mindig** létezik – még egy jól működő gazdaságban is. Ezek együtt adják a **természetes rátát**. Ha a tényleges ráta a természetes rátán van, a gazdaság a **teljes foglalkoztatás** szintjén működik (ez nem 0% munkanélküliséget jelent!).

- **Ciklikus munkanélküliség** = tényleges ráta − természetes ráta.
- Recesszióban pozitív, túlfűtött gazdaságban negatív is lehet.

## Az Okun-törvény

Arthur Okun megfigyelése: a munkanélküliség és a kibocsátás együtt mozog. Egy gyakran használt ökölszabály:

> Ha a munkanélküliségi ráta **1 százalékponttal** a természetes ráta fölött van, a GDP kb. **2%-kal** marad el a lehetséges (potenciális) szinttől.

A ciklikus munkanélküliség tehát nemcsak az érintetteknek, hanem az egész társadalomnak **elvesztett termelést** jelent.

## A Phillips-görbe

A. W. Phillips 1958-ban azt találta, hogy rövid távon **alacsony munkanélküliség magas inflációval** jár együtt, és fordítva. Ha kevés a szabad munkaerő, a cégek versenyeznek a dolgozókért, nőnek a bérek, és ezt az árakba is beépítik.

A modern változat szerint a görbe helyzete a **várt inflációtól** ($\pi^e$) függ: $\pi = \pi^e - b \cdot (u - u^{\ast})$. Az ábrán a természetes ráta $u^{\ast} = 5\%$, $b = 2$:

```plot
title: Rövid távú Phillips-görbe
x: 0, 12
y: -6, 20
param: e = 3, 0, 10, 0.5
f: e - 2(x - 5) # Phillips-görbe
point: 5, e # természetes ráta
value: infláció a természetes rátánál = e
```

Ha a várakozások emelkednek (**e** csúszka), az egész görbe felfelé tolódik: ugyanakkora munkanélküliség mellett magasabb az infláció. Hosszú távon a munkanélküliség a természetes rátához tér vissza – a tartósan magas infláció **nem** vásárol tartósan alacsony munkanélküliséget (Friedman és Phelps, 1960-as évek; az 1970-es évek stagflációja ezt igazolta).

## Foglalkoztatáspolitika

| Passzív eszközök                                          | Aktív eszközök                       |
| --------------------------------------------------------- | ------------------------------------ |
| a munkanélküliek **jövedelmének pótlása**                 | a **munkába állás segítése**         |
| álláskeresési járadék (Magyarországon legfeljebb 3 hónap) | átképzés, felnőttképzés              |
|                                                           | bértámogatás a munkáltatónak         |
|                                                           | álláskeresési tanácsadás, közvetítés |
|                                                           | vállalkozóvá válás támogatása        |
|                                                           | közfoglalkoztatás                    |

A túl bőkezű és hosszú ellátás csökkentheti a keresési kedvet, a túl szűkös viszont arra kényszeríthet, hogy valaki az első, a képzettségének nem megfelelő állást fogadja el. A jó rendszer a biztonságot és az ösztönzést **egyensúlyozza**.

## Összefoglalás

- Fajták: súrlódásos, strukturális, ciklikus, szezonális.
- Természetes ráta = súrlódásos + strukturális; teljes foglalkoztatás ≠ 0% munkanélküliség.
- Okun: 1 százalékpont ciklikus munkanélküliség ≈ 2% GDP-rés.
- Phillips-görbe: rövid távon átváltás infláció és munkanélküliség között; hosszú távon nincs.
- Passzív (jövedelempótlás) és aktív (munkába segítés) eszközök.

## A lecke feladata

```quiz required
? Egy friss diplomás két hónapja keresi az első állását. Milyen munkanélküliség ez?
+ súrlódásos
- strukturális
- ciklikus
- szezonális
! A keresés időbe telik.

? Egy régióban bezár egy gyár, a dolgozók képzettségére máshol sincs kereslet. Milyen munkanélküliség ez?
- súrlódásos
+ strukturális
- szezonális
! Nem illeszkednek a készségek.

? A tényleges ráta 7%, a természetes 4%. Mennyi a ciklikus munkanélküliség (százalékpont)?
= 3
! 7 − 4.

? Az Okun-törvény ökölszabálya szerint ekkor kb. hány százalékkal marad el a GDP a potenciálistól?
= 6
= 6%
! 3 · 2.

? Melyik **aktív** foglalkoztatáspolitikai eszköz?
- álláskeresési járadék
+ ingyenes programozói átképzés munkanélkülieknek
- munkanélküli-segély
- végkielégítés
! A munkába állást segíti.
```
