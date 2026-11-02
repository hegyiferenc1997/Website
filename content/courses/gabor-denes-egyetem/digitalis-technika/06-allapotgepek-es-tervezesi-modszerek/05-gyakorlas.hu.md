---
title: Gyakorlás – állapotgépek
summary: Ellenőrző kérdések és összefoglaló feladatlap: Moore- és Mealy-gép, állapottábla, sorozatfelismerő, állapotkódolás és minimalizálás.
minutes: 35
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Miből áll egy szinkron állapotgép, és melyik része kombinációs?</summary>

Következőállapot-logikából (kombinációs), állapotregiszterből (flip-flopok, sorrendi) és kimeneti logikából (kombinációs). Az állapotregiszter minden órajel élén átveszi a következőállapot-logika által kiszámolt kódot.

</details>

<details>
<summary>2. Honnan ismered fel az egyenletekből, hogy Moore- vagy Mealy-gépről van szó?</summary>

Ha a kimenet függvényében csak állapotváltozók (flip-flop kimenetek) szerepelnek, Moore-gép; ha valamelyik bemenet is szerepel benne, Mealy-gép.

</details>

<details>
<summary>3. Miért kell a „101” Moore-felismerőnek eggyel több állapot, mint a Mealy-változatnak?</summary>

Mert a Moore-gép kimenete csak az állapottól függhet, így a „megtaláltam” helyzetet egy külön, 1-es kimenetű állapotnak kell jelölnie. A Mealy-gép ezt az átmenetre (C állapot + 1 bemenet) írhatja, ezért nem kell hozzá új állapot.

</details>

<details>
<summary>4. Mi történhet, ha az állapotgráfban egy állapotból nem minden bemenetre rajzolunk nyilat?</summary>

A specifikáció hiányos lesz: nem tudni, mit tegyen a gép abban az esetben, és a megvalósítás „véletlenszerűen” fog viselkedni (amit éppen az egyszerűsítés kiad). Minden állapotból minden bemeneti kombinációra meg kell adni a következő állapotot – akkor is, ha az a helyben maradás.

</details>

<details>
<summary>5. Mikor érdemes Gray-kódolást választani?</summary>

Ha az állapotgép jellemzően egymás utáni állapotokon halad végig (számlálószerűen): ekkor lépésenként csak egy flip-flop vált, ami kisebb fogyasztást és kevesebb hazárdot jelent az állapotkódból dekódolt jeleken.

</details>

## Összefoglaló feladatlap

```quiz required
? Egy állapotgép kimenete y = Q1 · x, ahol Q1 állapotváltozó, x bemenet. Milyen gép ez?
- Moore-gép
+ Mealy-gép
- kombinációs hálózat
- aszinkron számláló

? Legalább hány flip-flop kell egy 10 állapotú géphez bináris kódolással?
= 4

? Egy egyetlen D flip-flopos gép állapota minden órajelnél megfordul, ha x = 1, és változatlan marad, ha x = 0. Töltsd ki az állapottáblát (DN a következő állapot)!
table: D, X -> DN = D ⊕ X

? A „101” Moore-felismerő (A, B, C, D állapotok) A-ból indul, és sorban 1, 1, 0, 1 érkezik. Melyik állapotban lesz?
= D
! A → B → B → C → D.

? A „101” Mealy-felismerő bemenetére sorban 1, 0, 1, 1, 0, 1 érkezik. Mi a kimeneti sorozat? (Írd egybe!)
= 001001

? A „101” Moore-felismerő kódolása: A = 00, B = 01, C = 10, D = 11 (Q1 Q0). Add meg az y kimenet függvényét!
expr: Q1, Q0 -> Q1·Q0
! Csak a D állapot kimenete 1.

? Mi a szabály az állapotgráf felrajzolásakor?
- Minden állapotból pontosan egy nyíl indulhat.
+ Minden állapotból minden bemeneti kombinációra meg kell adni a következő állapotot.
- A kezdőállapotba nem vezethet nyíl.
- Csak Moore-gépnek lehet állapotgráfja.
```
