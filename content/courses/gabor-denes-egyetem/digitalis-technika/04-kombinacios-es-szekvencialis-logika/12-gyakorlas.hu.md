---
title: Gyakorlás – kombinációs és szekvenciális logika
summary: Ellenőrző kérdések és összefoglaló feladatlap: Karnaugh-tábla, hazárdok, összeadók, multiplexer, dekóder, tárolók és flip-flopok.
minutes: 40
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Miért Gray-kód szerint követik egymást a Karnaugh-tábla sorai és oszlopai?</summary>

Mert így a szomszédos cellák pontosan egy változóban térnek el, és két szomszédos 1-es összevonásakor (XY + XY̅ = X) éppen az az egy változó esik ki. Bináris sorrendben (01 → 10) két bit változna.

</details>

<details>
<summary>2. Mikor érdemes egy közömbös (X) cellát 1-nek venni?</summary>

Akkor, ha így nagyobb csoportot kapunk (rövidebb tagot), vagy kevesebb csoport is elég. Ha egyik csoporthoz sem kell, 0-nak tekintjük – lefedni nem kötelező.

</details>

<details>
<summary>3. Miért nem szüntethető meg a funkcionális hazárd redundáns taggal?</summary>

Mert nem a megvalósítás, hanem a függvény tulajdonsága: két bemenet nem pontosan egyszerre vált, így rövid ideig egy köztes bemeneti kombináció érvényes, amelyhez a függvény szerint is más kimenet tartozik. Ellene szinkron mintavételezés vagy Gray-kódolás segít.

</details>

<details>
<summary>4. Miért lassú a ripple-carry összeadó, és mit csinál másképp a carry-lookahead?</summary>

A ripple-carry összeadóban minden fokozat az előző átvitelére vár, így a késleltetés a bitszámmal arányos (n · t<sub>c</sub>). A carry-lookahead a G = AB és P = A ⊕ B jelekből kétszintű logikával, párhuzamosan állítja elő az összes átvitelt.

</details>

<details>
<summary>5. Hogyan valósítanál meg egy háromváltozós függvényt 4:1 multiplexerrel?</summary>

Két változót (pl. A, B) a kiválasztó bemenetekre kötünk; a négy adatbemenetre a harmadik változó szerinti maradék függvény kerül: 0, 1, C vagy C̅ (Shannon-kifejtés).

</details>

<details>
<summary>6. Mi a különbség a dekóder és a demultiplexer között?</summary>

Áramkörileg szinte ugyanaz: a dekóder a bemeneti kódnak megfelelő kimenetet aktiválja, a demultiplexer egy adatbemenetet irányít a kiválasztott kimenetre. Ha a dekóder engedélyező bemenetére az adatot kötjük, demultiplexerként működik.

</details>

<details>
<summary>7. Mi történik a NOR alapú SR tárolóban S = R = 1 után, ha mindkét bemenet egyszerre 0-ra vált?</summary>

S = R = 1 alatt Q = Q̅ = 0. Az egyidejű váltás után mindkét kapu 1-be akar menni, és versenyhelyzet alakul ki: a gyorsabb kapu nyer, a végállapot előre nem megjósolható. Ezért tiltott ez a kombináció.

</details>

<details>
<summary>8. Miért a JK flip-flop vezérlési táblájában van a legtöbb közömbös bejegyzés?</summary>

Mert minden átmenet kétféleképpen is elérhető: pl. 0 → 1 beírással (J = 1, K = 0) vagy billentéssel (J = 1, K = 1) is, így K közömbös. Ezért a JK-s tervezésnél a K-táblákban sok az X, és egyszerűbb a vezérlő logika.

</details>

## Összefoglaló feladatlap

```quiz required
? Egyszerűsítsd K-táblával: F = Σm(0, 1, 4, 5, 6, 7) (A, B, C)!
expr: A, B, C -> A + B'
limit: 2
same: A'B'C' + A'B'C + AB'C' + AB'C + ABC' + ABC
! Az A = 1 sor négyese és a B = 0 oszlopok négyese.

? Egyszerűsítsd a közömbös bejegyzés felhasználásával: F = Σm(1, 3, 5) + d(7) (A, B, C)!
expr: A, B, C -> C
limit: 1
dc: 7
! A 7-es cellát 1-nek véve egy négyes csoport jön ki.

? Melyik redundáns tag szünteti meg a statikus 1-es hazárdot az F = AC̅ + BC függvényben?
+ AB
- AC
- B̅C
- A̅B
! Konszenzus: XY + X̅Z → YZ, itt a C változó szerint.

? Mennyi 1011 + 0110 öt biten (az átvitellel együtt, binárisan)?
= 10001
! 11 + 6 = 17.

? Egy 4:1 MUX kiválasztó bemenetei A és B, az adatbemenetek: D0 = C̅, D1 = 0, D2 = 1, D3 = C. Írd fel a megvalósított függvényt a lehető legegyszerűbben!
expr: A, B, C -> B'C' + AC
limit: 4
same: A'B'C' + AB' + ABC
! F = Σm(0, 4, 5, 7).

? Egy T flip-flop állapota 1, és a következő élnél 0-ba kell váltania. Mekkora legyen T?
- 0
+ 1
- Közömbös.
! A változáshoz billenteni kell.

? Egy JK flip-flop kezdetben Q = 0, a bemenetei J = K = 1. Mi lesz Q három órajelél után?
= 1
! Minden élnél billen: 0 → 1 → 0 → 1.

? Egy flip-flop t_cq = 1 ns, a kombinációs út 6 ns, a setup-idő 3 ns. Mekkora a maximális órajel-frekvencia MHz-ben?
= 100
= 100MHz
! T_min = 10 ns.
```
