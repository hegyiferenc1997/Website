---
title: Gyakorlás – VLSI-áramkörök és SoC
summary: Ellenőrző kérdések és összefoglaló feladatlap: CMOS-kapuk tranzisztoros felépítése, gyártás és kihozatal, Moore-törvény, ASIC vagy FPGA, VLSI-tervezési lépések, tesztelhetőség, SoC, IP-blokkok, AMBA, energiagazdálkodás.
minutes: 35
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Miért a NAND és a NOR a „természetes” kapu CMOS-ban, és miért drágább az ÉS kapu?</summary>

Mert egy CMOS-fokozat mindig invertál: a kimenet a lehúzó nMOS hálózat függvényének negáltja. A NAND (soros nMOS) és a NOR (párhuzamos nMOS) egyetlen fokozat, 2n tranzisztorral. Az ÉS kapuhoz a NAND után még egy inverter kell, így 2 bemenetnél 4 helyett 6 tranzisztor.

</details>

<details>
<summary>2. Miért éri meg egy termék prototípusát FPGA-n, a tömeggyártását ASIC-en készíteni?</summary>

Az FPGA-nak nincs egyszeri költsége, és bármikor javítható – a fejlesztés alatt ez a fontos. Nagy darabszámnál viszont az ASIC kis darabára és jobb sebessége/fogyasztása miatt olcsóbb és jobb; a megtérülési darabszám felett a nagy NRE megtérül. A prototípuson közben a terv ki is próbálható, mielőtt a drága tape-out megtörténik.

</details>

<details>
<summary>3. Miért a verifikáció a VLSI-tervezés legnagyobb része?</summary>

Mert a gyártás után egy hiba javítása új maszkokat és újragyártást jelent (milliós költség, hónapos késés), a kiszállított termékben pedig visszahívást. Ezért a tape-out előtt minden lehetséges működési esetet szimulációval, formális ellenőrzéssel, FPGA-s prototípussal ellenőriznek.

</details>

<details>
<summary>4. Hogyan teszi tesztelhetővé a scan lánc a chip belsejét?</summary>

Tesztüzemmódban a flip-flopok egy léptetőregiszterré kapcsolódnak, amelynek eleje és vége egy-egy lábon érhető el. A teszter ezen keresztül tetszőleges állapotot léptet be, egy órajelig normál módban működteti a kombinációs logikát, majd kilépteti az eredményt, és összeveti a várt értékkel. Így minden belső csomópont vezérelhető és megfigyelhető.

</details>

<details>
<summary>5. Miért csökkenti olyan hatékonyan a fogyasztást a DVFS?</summary>

Mert a dinamikus fogyasztás P = α·C·V²·f: a frekvenciával lineárisan, a feszültséggel négyzetesen arányos. Kisebb frekvencián a tranzisztorok kisebb feszültséggel is elég gyorsak, így a kettő együtt csökkenthető – pl. 0,8-szoros feszültség és fél frekvencia a fogyasztást kb. az egyharmadára csökkenti.

</details>

## Összefoglaló feladatlap

```quiz required
? Hány tranzisztorból áll egy kétbemenetű CMOS NOR kapu?
= 4

? Egy CMOS-kapu nMOS hálózatában A és B párhuzamosan van kötve, ezzel sorosan C. Mi a kimenet függvénye?
expr: A, B, C -> ((A + B)·C)'
! Párhuzamos = VAGY, soros = ÉS; a kimenet a lehúzó hálózat függvényének negáltja.

? Hogyan kapcsolódnak a pMOS tranzisztorok egy CMOS NOR kapuban?
+ sorosan
- párhuzamosan
- nincsenek benne pMOS tranzisztorok
- az nMOS-okkal sorba kötve, felváltva

? Egy ASIC NRE-je 1 500 000 €, darabára 5 €; az FPGA darabára 35 €. Hány darabnál egyezik meg az összköltség?
= 50000
= 50 000

? Egy szeleten 400 chip készül, ebből 300 jó. Hány százalék a kihozatal?
= 75

? Egy SoC-blokk dinamikus fogyasztása 2 W. Mennyi lesz W-ban, ha a frekvenciáját a felére csökkentjük (a feszültség változatlan)?
= 1

? Melyik lépés ellenőrzi, hogy a chip rajzolata valóban a kapcsolási rajzot valósítja meg?
- DRC
+ LVS
- CTS
- ATPG

? Melyik állítás igaz a SoC-ra?
- Csak egyetlen processzormagot tartalmazhat.
+ Egy chipen egyesíti a processzormagokat, a gyorsítókat, a memóriavezérlőt és a perifériákat.
- Mindig FPGA-n valósítják meg.
- Nem tartalmazhat memóriavezérlőt.
```
