---
title: Gyakorlás – tervezés és kritikus út
summary: Ellenőrző kérdések és egy teljes kritikusút-számítás összefoglaló feladatlapként.
minutes: 30
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Miért főnevekből áll a WBS, és nem igékből?</summary>

Mert a WBS a szállítandó eredményeket (mit kell elkészíteni) bontja le, nem a munkavégzés lépéseit. A tevékenységek (igék) a munkacsomagok alatt, a tevékenységlistában jelennek meg.

</details>

<details>
<summary>2. Készíts WBS-t egy egyetemi konferencia weboldalához (2 szint elég)!</summary>

1. Konferencia weboldal: 1.1 Projektmenedzsment; 1.2 Tartalom (program, előadók, helyszín); 1.3 Arculat és felület; 1.4 Regisztrációs modul; 1.5 Tesztelés; 1.6 Indítás (domain, tárhely, közzététel).

</details>

<details>
<summary>3. Miért a kritikus út a hálóterv leghosszabb útja?</summary>

Mert a projekt csak akkor ér véget, ha minden út végigért. A leghosszabb út határozza meg a legrövidebb lehetséges átfutási időt, és ezen az úton nincs tartalék.

</details>

<details>
<summary>4. Mi a különbség a feltételezés és a korlát között?</summary>

A korlát kötött, ismert feltétel (pl. fix költségkeret, kötelező határidő). A feltételezés bizonytalan, de a tervezéshez igaznak vett állítás – ha kiderül, hogy hamis, kockázattá válik.

</details>

## Összefoglaló feladatlap

Egy mobilalkalmazás fejlesztésének tevékenységei (időtartam napokban):

| Tev. | Leírás                     | Időtartam | Megelőző |
| ---- | -------------------------- | --------- | -------- |
| A    | követelmények              | 4         | –        |
| B    | felhasználói felület terve | 3         | A        |
| C    | szerveroldal fejlesztése   | 5         | A        |
| D    | felület fejlesztése        | 2         | B        |
| E    | adatbázis és API           | 4         | C        |
| F    | tesztelés és kiadás        | 3         | D, E     |

```text
          ┌───► B (3) ───► D (2) ───┐
 A (4) ───┤                         ├───► F (3)
          └───► C (5) ───► E (4) ───┘
```

```quiz required
? Mennyi az F tevékenység legkorábbi kezdése (ES)?
= 13
= 13 nap
! ES(F) = max(EF(D), EF(E)) = max(9, 13).

? Hány nap a projekt legrövidebb átfutási ideje?
= 16
= 16 nap
! EF(F) = 13 + 3.

? Mennyi a B tevékenység tartalékideje (nap)?
= 4
= 4 nap
! LS(B) = 8, ES(B) = 4.

? Melyik a kritikus út?
- A → B → D → F
+ A → C → E → F
- A → B → C → F
- C → E → F
! 4 + 5 + 4 + 3 = 16 nap, minden tevékenység tartaléka 0.

? Ha a D tevékenység 3 napot csúszik, hány napos lesz a projekt?
= 16
= 16 nap
! D tartaléka 4 nap, így a 3 napos csúszás nem tolja ki a projekt végét.

? Melyik dokumentum vizsgálja a TELOS szempontokat?
- projekt alapító okirat
+ megvalósíthatósági tanulmány
- WBS-szótár
- Gantt-diagram
! Technikai, gazdasági, jogi, működési, ütemezési megvalósíthatóság.
```
