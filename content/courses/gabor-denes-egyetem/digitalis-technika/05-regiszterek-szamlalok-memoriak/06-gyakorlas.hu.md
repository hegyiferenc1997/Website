---
title: Gyakorlás – regiszterek, számlálók, memóriák
summary: Ellenőrző kérdések és összefoglaló feladatlap: léptetőregiszter, gyűrűs és Johnson-számláló, aszinkron és szinkron számlálók, memóriák.
minutes: 60
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

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **Léptetőregiszter.** Írd meg a `leptet(reg, bemenet)` függvényt, amely egy bitlistát (a regiszter tartalma, balról az első flip-flop) egy órajellel jobbra léptet: a bemeneti bit belép balra, a jobb szélső bit kiesik. Add vissza az `(új_regiszter, kilépő_bit)` párt!

```python starter
def leptet(reg, bemenet):
    return (reg, 0)
```

<details>
<summary>Megoldás</summary>

Az utolsó teszt a soros–párhuzamos átalakítás: 4 órajel után a 4 sorban érkezett bit egyszerre olvasható ki (az elsőként érkezett van a jobb szélen).

```python solution
def leptet(reg, bemenet):
    return ([bemenet] + reg[:-1], reg[-1])   # balra be, jobbra ki
```

</details>

```python test
assert leptet([0, 0, 0, 0], 1) == ([1, 0, 0, 0], 0)
assert leptet([1, 0, 1, 1], 0) == ([0, 1, 0, 1], 1)
reg = [0, 0, 0, 0]
for b in [1, 0, 1, 1]:                       # soros → párhuzamos átalakítás 4 órajel alatt
    reg, _ = leptet(reg, b)
assert reg == [1, 1, 0, 1]
print("Minden ellenőrzés sikeres!")
```

**2.** **LFSR periódusa.** Írd meg az `lfsr_periodus(bitek, csapok, kezdo=1)` függvényt! A regiszter `bitek` bites egész szám; minden lépésben az új bit a `csapok` listában megadott bitpozíciók XOR-ja, a regiszter balra lép, és az új bit a 0. helyre kerül. Add vissza, hány lépés után tér vissza a kezdőállapotba!

```python starter
def lfsr_periodus(bitek, csapok, kezdo=1):
    return 2 ** bitek
```

<details>
<summary>Megoldás</summary>

```python solution
def lfsr_periodus(bitek, csapok, kezdo=1):
    allapot, lepes = kezdo, 0
    while True:
        uj = 0
        for c in csapok:
            uj ^= (allapot >> c) & 1                         # a visszacsatolt bitek XOR-ja
        allapot = ((allapot << 1) | uj) & (2 ** bitek - 1)   # léptetés, csak n bit marad
        lepes += 1
        if allapot == kezdo:
            return lepes
```

</details>

```python test
assert lfsr_periodus(4, [3, 2]) == 15        # x^4 + x^3 + 1: maximális hosszú
assert lfsr_periodus(3, [2, 1]) == 7
assert lfsr_periodus(4, [3, 1]) < 15         # rossz csapválasztás: rövidebb periódus
print("Minden ellenőrzés sikeres!")
```

**3.** **Címvezetékek és kapacitás.** Írd meg a `memoria(cimvezetek, adatbit)` függvényt, amely visszaadja a memória kapacitását **bájtban**, és a `cimvezetek_kell(szavak)` függvényt, amely megadja, hány címvezeték kell adott számú szóhoz!

```python starter
def memoria(cimvezetek, adatbit):
    return 0

def cimvezetek_kell(szavak):
    return 0
```

<details>
<summary>Megoldás</summary>

```python solution
def memoria(cimvezetek, adatbit):
    return 2 ** cimvezetek * adatbit // 8      # szavak száma × szószélesség, bájtban

def cimvezetek_kell(szavak):
    k = 0
    while 2 ** k < szavak:                     # a legkisebb k, amelyre 2^k ≥ szavak
        k += 1
    return k
```

</details>

```python test
assert memoria(15, 8) == 32768               # 62256 SRAM: 32 KiB
assert memoria(20, 16) == 2 * 1024 * 1024    # 1 Mi szó × 16 bit = 2 MiB
assert cimvezetek_kell(65536) == 16
assert cimvezetek_kell(1000) == 10
assert cimvezetek_kell(1) == 0
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Hány flip-flop kell egy modulo-10 (0…9) számlálóhoz?
= 4
! 2^3 = 8 < 10 ≤ 16 = 2^4.

? Hány állapotú egy 4 flip-flopos gyűrűs számláló?
= 4
! A gyűrűs számlálóban egyetlen 1-es kering: n flip-flop → n állapot.

? Miért kevésbé használják ma az aszinkron (ripple) számlálót?
+ mert a késleltetések összeadódnak, és átmenetkor hamis állapotok jelennek meg
- mert több flip-flop kell hozzá
- mert csak lefelé tud számolni
! A szinkron számlálóban minden bit egyszerre vált.

? Melyik memória veszíti el a tartalmát tápfeszültség nélkül?
- Flash
- EEPROM
+ SRAM
- maszkprogramozott ROM
! A RAM-ok (SRAM, DRAM) felejtők, a ROM-családok és a Flash nem.

? Egy 3 bites szinkron számláló 111 állapotban van. Mi a következő állapota?
= 000
! Túlcsordul, és újra 0-ról indul.
```
