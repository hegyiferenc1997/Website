---
title: Gyakorlás – Digitális technika az informatikában
summary: Ellenőrző kérdések és összefoglaló feladatlap: jel-zaj viszony, dithering, digitális szűrők, DSP-hardver, ECC, gyorsítók, a stopperprojekt tervezési döntései – és néhány tárgyzáró ismétlő kérdés.
minutes: 60
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

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **Mozgóátlag-szűrő.** Írd meg a `mozgoatlag(jel, n)` függvényt, amely visszaadja az n pontos mozgóátlag kimeneteit attól a mintától kezdve, ahol már n minta áll rendelkezésre (két tizedesre kerekítve)!

```python starter
def mozgoatlag(jel, n):
    return jel
```

<details>
<summary>Megoldás</summary>

Az utolsó teszt a mintavételi frekvencia felénél lévő (leggyorsabb lehetséges) jelet mutatja: a 2 pontos átlag teljesen kioltja.

```python solution
def mozgoatlag(jel, n):
    ki = []
    for i in range(n - 1, len(jel)):
        ablak = jel[i - n + 1:i + 1]          # az utolsó n minta
        ki.append(round(sum(ablak) / n, 2))
    return ki
```

</details>

```python test
assert mozgoatlag([2, 4, 6, 8], 4) == [5.0]
assert mozgoatlag([1, 2, 3, 4, 5], 2) == [1.5, 2.5, 3.5, 4.5]
assert mozgoatlag([1, -1, 1, -1, 1, -1], 2) == [0.0, 0.0, 0.0, 0.0, 0.0]   # a leggyorsabb jel eltűnik
print("Minden ellenőrzés sikeres!")
```

**2.** **Q15 telítéssel.** Írd meg a `q15(x)` függvényt (valós szám → 16 bites egész, kerekítve, −32768 … 32767 közé telítve) és a `q15_osszead(a, b)` függvényt, amely két Q15 egészet ad össze **telítéssel**!

```python starter
def q15(x):
    return round(x * 32768)

def q15_osszead(a, b):
    return a + b
```

<details>
<summary>Megoldás</summary>

```python solution
def q15(x):
    return max(-32768, min(32767, round(x * 32768)))

def q15_osszead(a, b):
    return max(-32768, min(32767, a + b))     # túlcsordulás helyett a szélső érték
```

</details>

```python test
assert q15(0.5) == 16384
assert q15(-0.25) == -8192
assert q15(1.0) == 32767                      # +1 már nem ábrázolható: telítés
assert q15_osszead(q15(0.75), q15(0.75)) == 32767
assert q15_osszead(-30000, -10000) == -32768
assert q15_osszead(1000, 2000) == 3000
print("Minden ellenőrzés sikeres!")
```

**3.** **ECC-bitek.** Írd meg a `secded_bitek(m)` függvényt, amely megadja, hány ellenőrzőbit kell m adatbithez SECDED kóddal (a legkisebb r, amelyre 2^r ≥ m + r + 1, plusz 1 paritásbit)!

```python starter
def secded_bitek(m):
    return 8
```

<details>
<summary>Megoldás</summary>

```python solution
def secded_bitek(m):
    r = 0
    while 2 ** r < m + r + 1:      # a szindróma minden bitet + a "nincs hiba" esetet megnevezi
        r += 1
    return r + 1                   # + egy paritásbit a kettős hiba jelzéséhez
```

</details>

```python test
assert secded_bitek(64) == 8       # 72 bites szervermemória
assert secded_bitek(32) == 7
assert secded_bitek(4) == 4
assert secded_bitek(128) == 9
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Hány MAC-műveletet végez másodpercenként egy 32 együtthatós FIR szűrő 48 kHz-es mintavételnél (egy csatornán)?
= 1536000
! 32 · 48 000 = 1 536 000.

? Melyik alkalmazásban NEM szokás ECC memóriát használni?
- adatközponti szerverben
- repülőgép vezérlőjében
+ olcsó játékkonzolban
! Az ECC drágább, ezért ott használják, ahol egy csendes adathiba komoly kárt okozhat.

? Mi a dithering?
+ kis, szándékos zaj hozzáadása a kvantálás előtt, hogy a kvantálási hiba ne legyen a jellel összefüggő torzítás
- a jel felerősítése
- a zaj teljes eltávolítása
! Halk hangoknál a torzítás helyett egyenletes, kevésbé zavaró zaj hallható.

? Mi a szorzó-összeadó (MAC) egység feladata egy DSP-ben?
+ egy lépésben kiszámolja az akku + a · b értéket
- két számot hasonlít össze
- a memóriát címzi
! A FIR szűrő, a mátrixszorzás és a neurális hálók alapművelete.

? Hány bites egy szervermemória szava 64 adatbittel és SECDED ECC-vel?
= 72
! 64 adatbit + 8 ellenőrzőbit.
```
