---
title: Gyakorlás – mikroprocesszorok és mikrokontrollerek
summary: Ellenőrző kérdések és összefoglaló feladatlap: CPU felépítése, buszok, flag-ek, utasításciklus, pipeline, megszakítás, bitkezelés és illesztés.
minutes: 30
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Melyik eddig tanult építőelemekből áll össze egy processzor?</summary>

Az ALU összeadó-kivonóból, logikai kapukból és multiplexerekből (kombinációs hálózat) áll; a regiszterek D flip-flopokból; az utasításszámláló egy betölthető számláló; a címdekódolás dekóderekkel történik; a vezérlőegység pedig egy állapotgép.

</details>

<details>
<summary>2. Mi a „Neumann-palacknyak”?</summary>

A Neumann-architektúrában a program és az adat ugyanazon a buszon jön a memóriából, így a processzor egyszerre csak az egyiket olvashatja; a busz sebessége korlátozza a teljesítményt. A Harvard-architektúra (és a külön utasítás- és adat-gyorsítótár) ezt enyhíti.

</details>

<details>
<summary>3. Miért szükséges a verem a szubrutinhíváshoz?</summary>

Mert a CALL-nak el kell mentenie a visszatérési címet. Ha a szubrutin újabb szubrutint hív, annak a címét is menteni kell anélkül, hogy az előzőt felülírná – a LIFO verem pont a megfelelő sorrendben adja vissza a címeket.

</details>

<details>
<summary>4. Miért nem lesz egy 5 fokozatú pipeline pontosan ötször gyorsabb?</summary>

Mert a feltöltéshez k − 1 órajel kell, és a hazárdok (adatfüggés, ugrások) miatt néha várni kell vagy el kell dobni lehívott utasításokat. Ráadásul a fokozatok közé tett regiszterek is késleltetnek.

</details>

<details>
<summary>5. Miért kell maszkkal módosítani egy perifériaregiszter bitjét?</summary>

Mert a regiszter többi bitje más funkciókat (más lábakat, beállításokat) vezérel. Ha egyszerűen új értéket írnánk bele, azokat is felülírnánk; az OR / AND NOT / XOR maszk csak a kiválasztott bitet változtatja.

</details>

## Összefoglaló feladatlap

```quiz required
? Hány KiB memóriát címezhet egy 16 bites címbusz (bájtos címzésnél)?
= 64
! 2^16 = 65 536 bájt.

? Egy 8 bites ALU előjeles számként összeadja a 100-at és a 100-at (eredmény 200 = 11001000). Mi lesz a V (overflow) jelző értéke?
= 1
! Két pozitív szám összege negatívnak (legfelső bit 1) látszik.

? Hány órajel alatt fut le 20 utasítás egy 4 fokozatú pipeline-on (ideális esetben)?
= 23

? Mit csinál a CALL utasítás?
- Kiveszi a visszatérési címet a veremből.
+ A visszatérési címet a verembe menti, és a szubrutin címére ugrik.
- Megszakítást kér.
- Törli a PC-t.

? Egy regiszter értéke 10100000. Mi lesz az értéke, ha a 2. bitet XOR-ral átbillentjük? (8 biten)
= 10100100

? Az akkumulátoros gép programja: LOAD 7, SUB 3, SHL, SHL, HALT. Mennyi az akkumulátor a végén?
= 16
! (7 − 3) · 2 · 2.

? Miben jobb a megszakításos kezelés a lekérdezésesnél (polling)?
+ A processzornak nem kell folyamatosan a perifériát figyelnie, így időt és energiát takarít meg.
- Egyszerűbb a hardvere, mert nincs szükség veremre.
- Nem kell hozzá program.
- Mindig pontosan egy órajel alatt lefut.

? Milyen architektúrájú az Arduino Uno ATmega328P mikrokontrollere?
- Neumann
+ Harvard
- CISC Neumann
- nincs benne CPU
```
