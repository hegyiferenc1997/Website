---
title: Gyakorlás – mikroprocesszorok és mikrokontrollerek
summary: Ellenőrző kérdések és összefoglaló feladatlap: CPU felépítése, buszok, flag-ek, utasításciklus, pipeline, megszakítás, bitkezelés és illesztés.
minutes: 55
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

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **Regiszterbitek maszkokkal.** Egy mikrokontroller perifériáit regiszterbitekkel vezérled. Írd meg a `bit_be(reg, n)`, `bit_ki(reg, n)`, `bit_valt(reg, n)` és `bit_e(reg, n)` függvényt (1-be állítás, törlés, átbillentés, lekérdezés)! A többi bit nem változhat.

```python starter
def bit_be(reg, n):
    return reg

def bit_ki(reg, n):
    return reg

def bit_valt(reg, n):
    return reg

def bit_e(reg, n):
    return 0
```

<details>
<summary>Megoldás</summary>

```python solution
def bit_be(reg, n):
    return reg | (1 << n)            # VAGY: csak az n. bit lesz 1

def bit_ki(reg, n):
    return reg & ~(1 << n)           # ÉS a negált maszkkal: csak az n. bit törlődik

def bit_valt(reg, n):
    return reg ^ (1 << n)            # XOR: az n. bit átbillen

def bit_e(reg, n):
    return (reg >> n) & 1
```

</details>

```python test
assert bit_be(0b0000_0000, 5) == 0b0010_0000
assert bit_ki(0b1111_1111, 0) == 0b1111_1110
assert bit_valt(0b1010_0000, 7) == 0b0010_0000
assert bit_e(0b0000_1000, 3) == 1 and bit_e(0b0000_1000, 2) == 0
assert bit_be(0b1000_0001, 0) == 0b1000_0001     # ami már 1, az 1 marad
print("Minden ellenőrzés sikeres!")
```

**2.** **Időzítő beállítása.** Írd meg az `idozito(f_cpu, f_cel, max_top=255)` függvényt, amely az `[1, 8, 64, 256, 1024]` előosztók közül megkeresi a **legkisebbet**, amellyel a `TOP = f_cpu / (előosztó · f_cel) − 1` érték **egész szám** és legfeljebb `max_top`. Add vissza az `(előosztó, TOP)` párt, vagy `None`-t, ha egyik sem jó!

```python starter
def idozito(f_cpu, f_cel, max_top=255):
    return None
```

<details>
<summary>Megoldás</summary>

```python solution
def idozito(f_cpu, f_cel, max_top=255):
    for eloszto in [1, 8, 64, 256, 1024]:
        oszto = eloszto * f_cel
        if f_cpu % oszto == 0:                 # pontos, egész számú osztás kell
            top = f_cpu // oszto - 1
            if 0 <= top <= max_top:
                return (eloszto, top)
    return None
```

</details>

```python test
assert idozito(16_000_000, 1000) == (64, 249)
assert idozito(16_000_000, 1000, max_top=65535) == (1, 15999)   # 16 bites időzítő
assert idozito(16_000_000, 50_000) == (8, 39)     # 1-es előosztóval a TOP 319 lenne: nem fér el
assert idozito(8_000_000, 100) is None           # egyik előosztóval sem jön ki pontosan
print("Minden ellenőrzés sikeres!")
```

**3.** **Pipeline futásideje.** Írd meg a `pipeline_utem(n, fokozat, buborek=0)` függvényt (n utasítás, k fokozat, plusz várakozási ütemek) és a `gyorsulas(n, fokozat, buborek=0)` függvényt, amely két tizedesre kerekítve megadja, hányszor gyorsabb a pipeline a pipeline nélküli (n · k ütemes) futásnál!

```python starter
def pipeline_utem(n, fokozat, buborek=0):
    return n * fokozat

def gyorsulas(n, fokozat, buborek=0):
    return 1.0
```

<details>
<summary>Megoldás</summary>

```python solution
def pipeline_utem(n, fokozat, buborek=0):
    return fokozat + (n - 1) + buborek        # feltöltés, aztán ütemenként egy kész

def gyorsulas(n, fokozat, buborek=0):
    return round(n * fokozat / pipeline_utem(n, fokozat, buborek), 2)
```

</details>

```python test
assert pipeline_utem(100, 5) == 104
assert pipeline_utem(1, 5) == 5
assert gyorsulas(1000, 5) == 4.98
assert gyorsulas(1000, 5, buborek=200) == 4.15
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Mi a Harvard-architektúra lényege?
- a program és az adat ugyanabban a memóriában van
+ a programmemória és az adatmemória külön busszal érhető el
- nincs benne utasításszámláló
! Így egyszerre olvasható utasítás és adat – sok mikrokontroller ilyen.

? Mit tartalmaz az utasításszámláló (PC)?
+ a következő végrehajtandó utasítás címét
- az eddig végrehajtott utasítások számát
- az utolsó művelet eredményét
! Ugrásnál a PC értéke felülíródik.

? Mire való a watchdog időzítő egy mikrokontrollerben?
- pontos idő mérésére
+ ha a program lefagy és nem „eteti” időben, újraindítja a mikrokontrollert
- a fogyasztás csökkentésére
! Beágyazott rendszerekben ez a végső védelem a lefagyás ellen.

? Mi történik egy megszakítás (interrupt) beérkezésekor?
+ a CPU elmenti, hol tartott, lefuttatja a kiszolgáló rutint, majd onnan folytatja
- a CPU újraindul
- a program véget ér
! A visszatérési cím a verembe kerül.

? Egy regiszter értéke 0b0000_0110. Mennyi lesz 0b0000_0100-zel vett ÉS után (tízes számrendszerben)?
= 4
! Csak a 2. bit marad meg: 0b0000_0100 = 4.
```
