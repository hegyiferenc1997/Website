---
title: Gyakorlás – memóriakezelés
summary: Ellenőrző kérdések, számolós feladatok címfordításból és lapcseréből, kísérlet a VM-ben.
minutes: 30
kind: practice
---

## Kísérlet: kevés memória a VM-ben

1. Készíts **pillanatképet** az Ubuntu VM-ről.
2. Állítsd le, és a **Beállítások → Rendszer** alatt vedd le a memóriát **2048 MB**-ra.
3. Indítsd el, nyiss meg sok böngészőfület, és figyeld egy terminálban: `vmstat 1`. Látod, ahogy az `si`/`so` oszlopok (lapozás) megnőnek?
4. Állítsd vissza a memóriát (vagy a pillanatképet).

## Ellenőrző kérdések

<details>
<summary>1. Miért nincs külső töredezettség lapozásnál, de belső igen?</summary>

Mert bármely lap bármely szabad keretbe kerülhet, így minden szabad keret felhasználható. A belső töredezettség viszont megmarad: a folyamat utolsó lapja általában nincs tele.

</details>

<details>
<summary>2. Miért kell a laphibát okozó utasítást újra végrehajtani?</summary>

Mert az utasítás nem tudott lefutni: a hivatkozott adat nem volt a memóriában. A lap betöltése után ugyanaz az utasítás most már sikeresen lefut.

</details>

<details>
<summary>3. Miért nem használják a valódi rendszerek a pontos LRU-t?</summary>

Mert minden egyes memória-hozzáférésnél frissíteni kellene, melyik lapot mikor használták – ez túl drága. Ehelyett a hardver csak egy „használt” bitet állít, és az OS ebből közelít (óra algoritmus).

</details>

<details>
<summary>4. Mit tanácsolnál egy diáknak, akinek a laptopja folyamatosan „tekeri a lemezt” és nagyon lassú?</summary>

Valószínűleg vergődés: kevés a RAM a futó programokhoz. Zárjon be programokat (különösen sok böngészőfület), a Feladatkezelőben nézze meg a memóriahasználatot, és ha lehet, bővítse a RAM-ot.

</details>

## Összefoglaló feladatlap

```quiz required
? Lyukak sorban: 100, 500, 200, 300, 600 KB. Melyiket választja a worst fit egy 212 KB-os kérésre? (KB-ban)
= 600
! A legnagyobbat.

? A lapméret 4096 bájt, a 2. lap a 6. keretben van. Mi a 8300-as logikai cím fizikai címe?
= 24684
! p = 2, d = 8300 − 8192 = 108; 6 · 4096 + 108 = 24 684.

? 32 bites címtér, 4 KB-os lapok: hány bites a lapszám?
= 20
! 32 − 12 = 20.

? Egy 10 000 bájtos program 4096 bájtos lapokat kap. Hány lapot foglal?
= 3
! 10 000 / 4096 ≈ 2,44, felfelé kerekítve 3.

? Melyik lapot cseréli az LRU algoritmus?
- a legrégebben betöltöttet
+ a legrégebben használtat
- azt, amelyikre a legkésőbb lesz szükség
- egy véletlenszerűen választottat
! Least Recently Used.

? Mi a Windows lapozófájljának neve?
= pagefile.sys
! Linuxon swap partíció vagy swapfile.
```
