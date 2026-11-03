---
title: Hálótervezés és a kritikus út
summary: A hálóterv, az előre- és visszafelé számítás (ES, EF, LS, LF), a tartalékidő és a kritikus út módszere (CPM) lépésről lépésre, egy kidolgozott példán.
minutes: 30
---

## Amit ebben a leckében megtanulsz

- hogyan rajzolj **hálótervet** a tevékenységekből,
- hogyan számold ki a **legkorábbi** és **legkésőbbi** kezdési és befejezési időket,
- mi a **tartalékidő** (float), és mi a **kritikus út**.

## A hálóterv

A **hálóterv** (_network diagram_) a tevékenységeket és a köztük lévő függőségeket ábrázolja. A legelterjedtebb a **tevékenység a csomóponton** (AON, _Activity on Node_) forma: minden doboz egy tevékenység, a nyilak a függőségek (általában FS).

## A kidolgozott példa

Egy kis webes projekt tevékenységei:

| Tevékenység | Leírás                   | Időtartam (nap) | Megelőző |
| ----------- | ------------------------ | --------------- | -------- |
| A           | követelmények felmérése  | 3               | –        |
| B           | adatbázis tervezése      | 2               | A        |
| C           | felület tervezése        | 4               | A        |
| D           | szerveroldal fejlesztése | 3               | B        |
| E           | integráció és tesztelés  | 2               | C, D     |

```text
            ┌───► B (2) ───► D (3) ───┐
 A (3) ─────┤                         ├───► E (2)
            └───► C (4) ──────────────┘
```

## 1. Előrefelé számítás – legkorábbi időpontok

- **ES** (_Early Start_): legkorábbi kezdés = a megelőzők **EF**-jeinek **maximuma** (az első tevékenységnél 0).
- **EF** (_Early Finish_): legkorábbi befejezés = **ES + időtartam**.

| Tev. | ES            | EF         |
| ---- | ------------- | ---------- |
| A    | 0             | 0 + 3 = 3  |
| B    | 3             | 3 + 2 = 5  |
| C    | 3             | 3 + 4 = 7  |
| D    | 5             | 5 + 3 = 8  |
| E    | max(7, 8) = 8 | 8 + 2 = 10 |

A projekt **legrövidebb átfutási ideje** az utolsó tevékenység EF-je: **10 nap**.

## 2. Visszafelé számítás – legkésőbbi időpontok

- **LF** (_Late Finish_): legkésőbbi befejezés = a követők **LS**-einek **minimuma** (az utolsónál a projekt vége, 10).
- **LS** (_Late Start_): legkésőbbi kezdés = **LF − időtartam**.

| Tev. | LF            | LS         |
| ---- | ------------- | ---------- |
| E    | 10            | 10 − 2 = 8 |
| D    | 8             | 8 − 3 = 5  |
| C    | 8             | 8 − 4 = 4  |
| B    | 5             | 5 − 2 = 3  |
| A    | min(3, 4) = 3 | 3 − 3 = 0  |

## 3. Tartalékidő és kritikus út

A **teljes tartalékidő** (_total float_) azt mutatja, mennyit csúszhat egy tevékenység anélkül, hogy a projekt vége csúszna:

> **tartalékidő = LS − ES = LF − EF**

| Tev. | ES  | LS  | Tartalék |
| ---- | --- | --- | -------- |
| A    | 0   | 0   | **0**    |
| B    | 3   | 3   | **0**    |
| C    | 3   | 4   | 1        |
| D    | 5   | 5   | **0**    |
| E    | 8   | 8   | **0**    |

A **kritikus út** a **nulla tartalékidejű** tevékenységek láncolata, egyben a hálóterv **leghosszabb** útja: **A → B → D → E** (3 + 2 + 3 + 2 = 10 nap). A másik út, A → C → E, csak 9 nap.

> A kritikus úton lévő tevékenységek **minden napnyi csúszása** a projekt befejezését is csúsztatja. Ezért ezeket figyeljük a legjobban. A C tevékenység 1 napot csúszhat „büntetlenül”.

## Egy dobozban: a csomópont jelölése

```text
 ┌──────┬──────┬──────┐
 │  ES  │ idő  │  EF  │
 ├──────┴──────┴──────┤
 │    tevékenység     │
 ├──────┬──────┬──────┤
 │  LS  │tartal│  LF  │
 └──────┴──────┴──────┘
```

## Összefoglalás

- Előrefelé: ES = max(megelőzők EF), EF = ES + időtartam.
- Visszafelé: LF = min(követők LS), LS = LF − időtartam.
- Tartalékidő = LS − ES; a kritikus út a nulla tartalékú, leghosszabb út.
- A projekt átfutási ideje a kritikus út hossza.

## A lecke feladata

```quiz required
? Hány nap a fenti példaprojekt legrövidebb átfutási ideje?
= 10
= 10 nap
! Az E tevékenység legkorábbi befejezése (EF).

? Mennyi a C tevékenység tartalékideje (nap)?
= 1
= 1 nap
! LS − ES = 4 − 3.

? Melyik a példa kritikus útja?
- A → C → E
+ A → B → D → E
- A → B → C
- B → D → E
! A nulla tartalékú tevékenységek láncolata, 10 nap.

? Egy tevékenység megelőzőinek EF-je 6 és 9 nap. Mennyi a tevékenység ES-e?
= 9
= 9 nap
! ES = a megelőzők EF-jeinek maximuma.

? Ha a D tevékenység 2 napot csúszik, hány napos lesz a projekt?
= 12
= 12 nap
! D a kritikus úton van (tartalék 0), így a csúszás teljes egészében a projekt végét tolja.
```
