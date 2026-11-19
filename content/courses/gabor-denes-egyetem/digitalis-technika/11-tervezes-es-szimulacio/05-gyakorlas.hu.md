---
title: Gyakorlás – Digitális tervezés és szimuláció
summary: Ellenőrző kérdések és összefoglaló feladatlap: tervezési lépések, setup és hold, kritikus út, szinkron tervezés, testbench, tesztvektorok, hibakeresés és mérés.
minutes: 35
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Miért éri meg minél korábban, már szimulációban megtalálni a hibákat?</summary>

Mert minden későbbi lépés drágább: a szimulációban minden belső jel látszik, és a javítás percek alatt újrafuttatható. A valódi panelen csak a lábakon mérhetsz, egy újraprogramozás percekig tart, egyedi chipnél pedig egy gyártás után felfedezett hiba akár milliós költségű újragyártást jelent.

</details>

<details>
<summary>2. Mit tehetsz, ha egy út nem fér bele az órajelperiódusba (negatív slack)?</summary>

Csökkentheted az órajel frekvenciáját; egyszerűsítheted vagy átszervezheted a kombinációs logikát (pl. gyorsabb összeadó); vagy pipeline-regiszterrel két rövidebb útra vághatod a hosszú utat – ekkor nagyobb órajel érhető el, de az eredmény egy órajellel később jön.

</details>

<details>
<summary>3. Miért kell egy gombról érkező jelet szinkronizálni és pergésmentesíteni is?</summary>

A gomb az órajeltől függetlenül vált, ezért megsértheti a flip-flop setup/hold idejét, és metastabilitást okozhat – ez ellen véd a kétflipflopos szinkronizáló. Emellett a mechanikus érintkező néhány ms-ig pattog, így egy nyomás több impulzusnak látszana – ez ellen a pergésmentesítés véd.

</details>

<details>
<summary>4. Mi a különbség a logikai analizátor és az oszcilloszkóp között?</summary>

A logikai analizátor sok csatornán csak a logikai szintet (0/1) rögzíti, triggerel mintázatra és protokollokat dekódol – a működés logikájának vizsgálatára való. Az oszcilloszkóp kevés csatornán a valódi feszültségalakot mutatja (szintek, élek, zaj, túllövés) – jelintegritási, analóg jellegű problémákhoz.

</details>

<details>
<summary>5. Hogyan teszteled egy 32 bites összeadót, ha a teljes körű teszt lehetetlen?</summary>

Véletlen bemeneti vektorokkal (sok ezer vagy millió), kiegészítve a határesetekkel: 0, maximális érték, túlcsordulás, átvitel végigfutása minden biten (pl. 0xFFFFFFFF + 1). Az eredményt egy referenciamodell (pl. egész számos összeadás) értékével veti össze az önellenőrző testbench.

</details>

## Összefoglaló feladatlap

```quiz required
? Egy úton t_cq = 0,5 ns, a logika 3,5 ns, t_su = 1 ns. Hány MHz a maximális órajel-frekvencia?
= 200
! 1 / 5 ns.

? Hány tesztvektor kell egy 6 bemenetű kombinációs áramkör teljes körű teszteléséhez?
= 64

? A testbench teljes körű tesztje alapján töltsd ki a modul igazságtábláját! assign Y = A ^ (B & C);
table: A, B, C -> Y = A ⊕ B·C

? Egy Verilog-testbenchben (timescale 1ns/1ps): always #10 clk = ~clk; Hány MHz az órajel?
= 50
! A periódus 20 ns.

? Mekkora a bitidő μs-ban egy 9600 bit/s-os UART-jelnél? (Kerekítsd egészre!)
= 104

? Egy szkóp memóriája 1 MSa, a mintavételi sebessége 100 MSa/s. Hány ms-ot tud rögzíteni?
= 10

? Egy vezeték a mérés szerint mindig 0, akármit csinál az áramkör. Mi a legvalószínűbb hiba?
- lebegő bemenet
+ beragadt jel (pl. rövidzár a földre)
- metastabilitás
- túl nagy mintavételi sebesség

? Melyik a helyes eljárás egy órajelről leválasztani kívánt regiszternél?
- ÉS-kapuval kapuzni az órajelét.
+ Engedélyező (enable) bemenetet használni, az órajelet változatlanul hagyni.
- Egy invertert tenni az órajelbe.
- Lekötni az órajel bemenetét a földre.
```
