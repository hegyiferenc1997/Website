---
title: Gyakorlás – programozási nyelvek és környezetek
summary: Ellenőrző kérdések és összefoglaló feladatlap a nyelvekről, a fordításról és a fejlesztőeszközökről.
minutes: 18
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Miért írják az operációs rendszereket C-ben, és miért nem Pythonban?</summary>

Mert a C fordított, alacsony szinthez közeli nyelv: gyors, közvetlenül kezeli a memóriát és a hardvert, és nem kell hozzá értelmező. A Python értelmezett és lassabb, és a futtatásához már egy működő rendszer kell.

</details>

<details>
<summary>2. Mondj egy példát mindhárom hibafajtára!</summary>

Szintaktikai: `if x > 3` kettőspont nélkül Pythonban. Futásidejű: `int("alma")`. Logikai: a kör területét `2 * r * pi`-vel számolod `r * r * pi` helyett.

</details>

<details>
<summary>3. Miért érdemes egy új funkciót külön git-ágon fejleszteni?</summary>

Mert a főág (`main`) közben működőképes marad; az ágat át lehet nézni (pull request), és csak akkor olvasztják be, ha kész és tesztelt.

</details>

```python run
# Egy logikai hiba és a javítása
szamok = [4, 8, 6]
rossz_atlag = sum(szamok) / 2          # hibás: fix 2-vel oszt
jo_atlag = sum(szamok) / len(szamok)   # helyes
print(rossz_atlag, jo_atlag)
```

## Összefoglaló feladatlap

```quiz required
? Mit ír ki a fenti példa második értékként (a helyes átlagot)?
= 6.0
= 6
! (4 + 8 + 6) / 3 = 6.0.

? Melyik nyelv **értelmezett**?
- C
- Rust
+ Python
- Go
! A Python-értelmező futás közben hajtja végre a kódot.

? Melyik paradigma épít osztályokra és öröklésre?
+ objektumorientált
- funkcionális
- deklaratív
- gépi kód
! Pl. Java, C#.

? Melyik git-parancs tölti fel a helyi commitokat a GitHubra?
- git pull
+ git push
- git init
- git log
! A pull letölt, a push feltölt.

? Hogy hívják a git-tárolók egyik legnépszerűbb online szolgáltatását (Microsoft tulajdonában)?
= GitHub
! A GitLab és a Bitbucket a fő vetélytársai.

? Mit csinál a JIT-fordító?
+ futás közben gépi kódra fordítja a bájtkódot
- előre lefordítja a teljes programot exe-fájllá
- kijavítja a logikai hibákat
- formázza a kódot
! Just-in-time: éppen időben.
```
