---
title: Gyakorlás – Digitális tervezés és szimuláció
summary: Ellenőrző kérdések és összefoglaló feladatlap: tervezési lépések, setup és hold, kritikus út, szinkron tervezés, testbench, tesztvektorok, hibakeresés és mérés.
minutes: 60
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

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **Időzítési tartalék.** Írd meg a `slack(t_clk, t_cq, t_logika, t_setup)` függvényt (ns-ban, két tizedesre kerekítve), és a `legrosszabb(t_clk, t_cq, t_setup, utak)` függvényt, amely egy `{név: logikai késleltetés}` szótárból visszaadja a legkisebb tartalékú út nevét és tartalékát!

```python starter
def slack(t_clk, t_cq, t_logika, t_setup):
    return 0

def legrosszabb(t_clk, t_cq, t_setup, utak):
    return ("", 0)
```

<details>
<summary>Megoldás</summary>

```python solution
def slack(t_clk, t_cq, t_logika, t_setup):
    return round(t_clk - t_setup - (t_cq + t_logika), 2)

def legrosszabb(t_clk, t_cq, t_setup, utak):
    nev = min(utak, key=lambda n: slack(t_clk, t_cq, utak[n], t_setup))   # a kritikus út
    return (nev, slack(t_clk, t_cq, utak[nev], t_setup))
```

</details>

```python test
assert slack(8, 1, 6, 0.5) == 0.5
assert slack(10, 0.5, 9.5, 0.3) == -0.3
utak = {"szorzó": 9.5, "ALU": 8.5, "számláló": 3.2}
assert legrosszabb(10, 0.5, 0.3, utak) == ("szorzó", -0.3)
print("Minden ellenőrzés sikeres!")
```

**2.** **Önellenőrző teszt.** Írd meg a `teszt(dut, referencia, n_bit)` függvényt, amely két n bites bemenetű függvényt **minden** bemenetpárra összehasonlít, és visszaadja a hibás `(a, b)` párok listáját!

```python starter
def teszt(dut, referencia, n_bit):
    return []
```

<details>
<summary>Megoldás</summary>

```python solution
def teszt(dut, referencia, n_bit):
    hibak = []
    for a in range(2 ** n_bit):
        for b in range(2 ** n_bit):          # teljes körű teszt: minden kombináció
            if dut(a, b) != referencia(a, b):
                hibak.append((a, b))
    return hibak
```

</details>

```python test
jo = lambda a, b: a + b
rossz = lambda a, b: (a + b) & 0x0F           # elfelejtett átvitel
assert teszt(jo, jo, 4) == []
assert len(teszt(rossz, jo, 4)) == 120        # ennyi esetben van átvitel
assert teszt(rossz, jo, 4)[0] == (1, 15)
print("Minden ellenőrzés sikeres!")
```

**3.** **Logikai analizátor beállítása.** Írd meg az `analizator(minta_per_s, memoria, jel_hz)` függvényt, amely visszaadja a rögzítési időt ms-ban (egy tizedesre kerekítve), és azt, hogy jut-e legalább 4 minta a jel egy periódusára: `(idő_ms, elég_e)`!

```python starter
def analizator(minta_per_s, memoria, jel_hz):
    return (0, True)
```

<details>
<summary>Megoldás</summary>

```python solution
def analizator(minta_per_s, memoria, jel_hz):
    ido_ms = round(memoria / minta_per_s * 1000, 1)     # mikor telik meg a memória
    eleg = minta_per_s / jel_hz >= 4                     # ökölszabály: ≥ 4 minta / periódus
    return (ido_ms, eleg)
```

</details>

```python test
assert analizator(24e6, 1e6, 1e6) == (41.7, True)
assert analizator(24e6, 1e6, 10e6) == (41.7, False)
assert analizator(100e6, 10e6, 25e6) == (100.0, True)
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Mi a különbség a funkcionális és az időzítési szimuláció között?
+ a funkcionális késleltetések nélkül, a logikai működést nézi; az időzítési a valódi késleltetésekkel
- a funkcionális lassabb
- az időzítési csak az órajelet szimulálja
! Ezért nem derül ki a funkcionális szimulációból egy negatív slack.

? Mi a DUT egy testbenchben?
- a gerjesztő jeleket előállító modul
+ a tesztelt áramkör
- a referenciamodell
! A testbench gerjeszti a DUT-ot, és ellenőrzi a kimeneteit.

? Mit jelent a hold-idő megsértése?
- a jel túl későn érkezik az órajel-él előtt
+ a jel túl hamar változik meg az órajel-él után
- az órajel túl lassú
! A hold-hibát nem lehet az órajel lassításával javítani.

? Mire való a trigger egy logikai analizátoron?
+ hogy a rögzítés egy adott esemény bekövetkezésekor induljon
- hogy gyorsabban mintavételezzen
- hogy több memóriát használjon
! Ritka hibák elkapásának legfontosabb eszköze.

? Egy 4 bites összeadó teljes körű tesztjéhez hány bemeneti kombináció kell (két 4 bites bemenet)?
= 256
! 2^4 · 2^4 = 256.
```
