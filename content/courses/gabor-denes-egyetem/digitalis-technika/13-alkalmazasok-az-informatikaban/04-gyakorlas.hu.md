---
title: Gyakorlás – Digitális technika az informatikában
summary: Ellenőrző kérdések és összefoglaló feladatlap: jel-zaj viszony, dithering, digitális szűrők, DSP-hardver, ECC, gyorsítók, a stopperprojekt tervezési döntései – és néhány tárgyzáró ismétlő kérdés.
minutes: 35
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Miért nevezhetjük „hasznos zajnak” a ditheringet?</summary>

Mert a kvantálás hibája dithering nélkül a jellel összefügg, és szabályos mintázatként jelenik meg: sávokként a képen, torzításként a hangban – ezt az ember könnyen észreveszi. A hozzáadott kis zaj ezt a hibát véletlenszerű, egyenletes zajjá alakítja, amely sokkal kevésbé feltűnő, így az összbenyomás jobb lesz, holott a jel „zajosabb”.

</details>

<details>
<summary>2. Miért alkalmas az FPGA jelfeldolgozásra?</summary>

Mert sok beépített DSP-blokkja (szorzó-összeadó egysége) párhuzamosan dolgozik, így egy FIR szűrő összes szorzását egyetlen órajel alatt elvégezheti, a minták pedig léptetőregiszterben haladnak. Egy processzor ugyanezt sorban, utasításonként végezné. Ráadásul a feldolgozás újraprogramozással megváltoztatható.

</details>

<details>
<summary>3. Mi a különbség a hibajelző (CRC) és a hibajavító (ECC) kód szerepe között?</summary>

A CRC csak észreveszi, hogy hiba történt (pl. egy hálózati keretben), és a keretet újra kell küldeni. Az ECC (pl. Hamming-kód a memóriában) a hiba helyét is meghatározza, és kijavítja – ott, ahol nincs mód újraküldésre, pl. egy memóriaolvasásnál.

</details>

<details>
<summary>4. Milyen témaköröket használ a stopperprojekt?</summary>

Kódok (BCD, hétszegmenses kód), kombinációs hálózatok (multiplexer, dekóder, kódátalakító), szinkron számlálók és regiszterek, állapotgép, hardverleíró nyelv (Verilog), FPGA és lábkiosztás, időzítés és szinkron tervezés (engedélyező jel, szinkronizáló), szimuláció testbenchcsel, hibakeresés – vagyis szinte az egész tárgyat.

</details>

<details>
<summary>5. Miért digitális szinte minden mai informatikai rendszer?</summary>

Mert a digitális jel zajtűrő: amíg a zaj a küszöb alatt marad, az információ hibátlanul visszaállítható, és hibajavító kódokkal tovább védhető. A digitális áramkörök CMOS-technológiával olcsón, kis fogyasztással, milliárdos tranzisztorszámmal gyárthatók, a működésük pontosan megismételhető, és programozással vagy újrakonfigurálással megváltoztatható.

</details>

## Összefoglaló feladatlap

```quiz required
? A jel teljesítménye 100-szorosa a zajénak. Hány dB az SNR?
= 20

? Egy kétmintás mozgóátlag-szűrő bemenetén az utolsó két minta 7 és 3. Mennyi a kimenet?
= 5

? Hány ellenőrző bit kell egy egyhibajavító Hamming-kódhoz 8 adatbit esetén?
= 4
! 2^4 = 16 ≥ 8 + 4 + 1.

? A stopperben a mod-6 számjegy (mp tízes) 5-ös állapotát kell felismerni (Q2 Q1 Q0); a 6 és 7 kódok nem fordulnak elő. Add meg a legegyszerűbb kifejezést!
expr: Q2, Q1, Q0 -> Q2·Q0
limit: 2
dc: 6, 7

? Egy 50 MHz-es panelen 1 kHz-es tick impulzus kell. Hány órajelenként jöjjön a tick?
= 50000
= 50 000

? Melyik eszköz végzi a neurális hálók számítását a legtakarékosabban egy telefonban?
- a CPU nagy teljesítményű magja
+ az NPU (neurális gyorsító)
- a memóriavezérlő
- az USB-vezérlő

? Mi a valós idejű hangszűrés helyes jelfeldolgozó lánca?
- DAC → digitális szűrő → ADC
+ antialiasing szűrő → ADC → digitális szűrő → DAC → simító szűrő
- ADC → DAC → antialiasing szűrő
- digitális szűrő → antialiasing szűrő → ADC

? Melyik állítás igaz a dithering hatására?
- A kvantálási hiba teljesen eltűnik.
+ A kvantálási hiba szabályos mintázat helyett egyenletes, kevésbé feltűnő zajként jelenik meg.
- A jel bitszáma megnő.
- A mintavételi frekvencia megduplázódik.
```
