---
title: Gyakorlás – PM-szoftverek és összefoglalás
summary: Ellenőrző kérdések és összefoglaló feladatlap a tizenötödik témakörhöz, a tárgy egészét átfogó számolós feladatokkal.
minutes: 25
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Egy 4 fős hallgatói csapat féléves beadandóján dolgozik. Milyen eszközt javasolnál, és miért?</summary>

Egy egyszerű Kanban-táblát, például Trellót vagy GitHub Projectst: ingyenes, gyorsan tanulható, és GitHub Projects esetén a feladatok közvetlenül a kódhoz kapcsolódnak. Egy MS Project vagy egy túlkonfigurált Jira ekkora csapatnak felesleges teher.

</details>

<details>
<summary>2. Miért veszélyes a túlkonfigurálás egy PM-eszköz bevezetésénél?</summary>

Mert ha túl sok az állapot és a kötelező mező, a csapat nem frissíti a jegyeket, így az eszköz elavult képet mutat a projektről, és a vezetés rossz adatok alapján dönt. Egyszerűen kell kezdeni, és csak valós igény esetén bővíteni.

</details>

<details>
<summary>3. Az új eszköz bevezetése után a vezetőség továbbra is Excel-riportot kér. Melyik ADKAR-lépés sérül, és mi a teendő?</summary>

A megerősítés (Reinforcement): ha a riport a régi úton készül, a csapatnak nem éri meg az új eszközt naprakészen tartani. A vezetőségnek az eszköz irányítópultjáról kell tájékozódnia, a régi táblázatokat pedig le kell zárni.

</details>

<details>
<summary>4. Az összefoglaló projektben a CPI = 0,8. Mondj két lehetséges projektvezetői döntést!</summary>

Terjedelem csökkentése (egy funkció halasztása a következő verzióra) vagy pótlólagos keret kérése a szponzortól – mindkettőt a változáskezelési folyamaton keresztül. Emellett érdemes megvizsgálni a túlköltés okát (pl. alulbecslés, szakértelemhiány).

</details>

## Összefoglaló feladatlap

```quiz required
? Súlyok: funkciók 0,6, költség 0,4. Az „X” eszköz pontjai: 3 és 5. Mennyi a súlyozott pontszáma?
= 3,8
= 3.8
! 0,6 · 3 + 0,4 · 5 = 1,8 + 2,0.

? Egy eszköz ára felhasználónként havi 10 euró. Mennyi egy 25 fős szervezet éves licencköltsége euróban?
= 3000
! 10 · 25 · 12.

? Melyik eszköz inkább a projekt **dokumentációjának** („memóriájának”) helye?
- Trello
- MS Project
+ Confluence
- Jira
! Tudásbázis: jegyzőkönyvek, döntési napló, okirat.

? Hogyan gépesíthető a Definition of Done egy Jira-szerű eszközben?
- több kötelező mezővel minden jegyen
+ munkafolyamat-szabállyal: „Kész” csak zöld tesztek és jóváhagyott kódellenőrzés után
- a jegyek törlésével sprint végén
- a burndown-diagram elrejtésével
! Átmeneti feltétel a munkafolyamatban.

? Tevékenységek: A 2 nap; B 5 nap (A után); C 3 nap (A után); D 2 nap (B és C után). Hány napos a projekt?
= 9
= 9 nap
! A–B–D: 2 + 5 + 2.

? EV = 30, PV = 40. Mennyi az SPI?
= 0,75
= 0.75
! EV / PV.
```
