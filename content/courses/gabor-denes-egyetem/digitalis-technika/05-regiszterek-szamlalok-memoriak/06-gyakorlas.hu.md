---
title: Gyakorlás – regiszterek, számlálók, memóriák
summary: Ellenőrző kérdések és összefoglaló feladatlap: léptetőregiszter, gyűrűs és Johnson-számláló, aszinkron és szinkron számlálók, memóriák.
minutes: 35
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Hogyan alakít át egy léptetőregiszter soros adatot párhuzamossá?</summary>

A soros bemenetre bitenként érkező adatot minden órajel egy hellyel tovább lépteti; n órajel után mind az n bit a regiszterben van, és a flip-flopok kimenetein egyszerre (párhuzamosan) kiolvasható (SIPO).

</details>

<details>
<summary>2. Miért nincs dekódolási tüske a Johnson-számlálónál?</summary>

Mert két egymást követő állapota között mindig csak egy bit változik (mint a Gray-kódnál), így nincs olyan pillanat, amikor a bitek eltérő késése miatt egy harmadik, hamis kód jelenne meg.

</details>

<details>
<summary>3. Miért jelenik meg egy rövid hamis állapot az aszinkron törlésű modulo-N számlálóban?</summary>

Mert a törlést maga az N állapot váltja ki: a számlálónak előbb el kell érnie az N kódot, a dekódoló kapunak érzékelnie kell, és csak ezután törlődnek a flip-flopok. Erre a rövid időre az N kód (pl. tízes számlálónál az 1010) megjelenik a kimeneteken.

</details>

<details>
<summary>4. Miért használnak a szinkron számlálók tervezésénél szívesen JK flip-flopot?</summary>

Mert a JK vezérlési táblájában minden átmenetnél van egy közömbös bejegyzés, így a K-táblákban sok az X, és a vezérlő logika egyszerűbb (a modulo-5 számlálónál egyetlen ÉS kapu elég).

</details>

<details>
<summary>5. Mit jelent, hogy egy számláló önindító, és miért kell ellenőrizni?</summary>

Azt, hogy bármely – a ciklusban nem szereplő – állapotból néhány órajel után a számlálási ciklusba ér. Bekapcsoláskor a flip-flopok véletlen állapotban lehetnek; ha egy nem használt állapotból zárt hurok indulna, a számláló sosem kezdene el helyesen számolni.

</details>

<details>
<summary>6. Miért használnak a processzorok gyorsítótárnak SRAM-ot, operatív memóriának pedig DRAM-ot?</summary>

Az SRAM gyors és nem kell frissíteni, de cellánként 6 tranzisztor kell, ezért drága és kis kapacitású – a kis, gyors cache-hez ideális. A DRAM cellája 1 tranzisztor + 1 kondenzátor, ezért nagyon sűrű és olcsó, így GiB-os operatív memória építhető belőle, bár lassabb és frissíteni kell.

</details>

## Összefoglaló feladatlap

```quiz required
? Egy 4 bites léptetőregiszter kezdetben 1111; a soros bemenet a bal szélső bitbe lép, a tartalom jobbra tolódik. A bemenetre sorban 0, 0, 1, 0 érkezik. Mi a tartalom a 4. él után?
= 0100
! 0111 → 0011 → 1001 → 0100.

? Hány állapota van egy 3 flip-flopos Johnson-számlálónak?
= 6

? Egy 8 fokozatú aszinkron számláló 1,024 MHz-es órajelet kap. Hány kHz az utolsó fokozat (Q7) kimenetének frekvenciája?
= 4
! 1024 kHz / 2^8.

? Aszinkron modulo-6 számlálót készítünk aktív alacsony CLR̅ bemenetekkel. Melyik kapu kell a törléshez?
+ NAND(Q2, Q1)
- NAND(Q2, Q0)
- NAND(Q1, Q0)
- NAND(Q2, Q1, Q0)
! 6 = 110.

? Egy 2 bites szinkron lefelé számláló (00 → 11 → 10 → 01 → 00) D flip-flopokkal készül. Add meg a D1 bemenet függvényét!
expr: Q1, Q0 -> Q1 ⊙ Q0
! Q1 akkor vált, amikor Q0 = 0.

? A 000 → 010 → 100 → 110 sorrendű JK számlálóban J2 értékei: 000 → 0, 010 → 1, a többi sor közömbös. Add meg J2-t!
expr: Q2, Q1, Q0 -> Q1
limit: 1
dc: 1, 3, 4, 5, 6, 7

? Hány címvezeték kell egy 16K × 8 bites memóriához?
= 14
! 16K = 2^14.

? Milyen technológiájú a processzorok gyorsítótára (cache)?
+ SRAM
- DRAM
- NAND Flash
- EEPROM
```
