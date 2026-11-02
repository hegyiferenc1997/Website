---
title: CMOS-kapuk és a chipgyártás
summary: A MOSFET mint kapcsoló, a CMOS inverter, NAND és NOR kapu tranzisztoros felépítése, összetett kapuk; a chipgyártás lépései (szilíciumszelet, fotolitográfia, rétegek), technológiai csomópont, kihozatal, a Moore-törvény.
minutes: 40
---

## Amit ebben a leckében megtanulsz

- hogyan működik a **MOSFET** kapcsolóként,
- hogyan épül fel tranzisztorokból a **CMOS inverter**, **NAND** és **NOR** kapu,
- hogyan olvasod le egy **összetett CMOS-kapu** függvényét,
- milyen lépésekből áll a **chipgyártás**,
- mit mond a **Moore-törvény**, és mit jelent a „nm-es technológia”.

## A MOSFET mint kapcsoló

A **VLSI** (very large scale integration – nagyon nagy integráltságú) áramkörökben milliárdnyi **MOSFET** tranzisztor dolgozik. Digitális szempontból mindegyik egy **feszültségvezérelt kapcsoló**:

- **nMOS:** a gate-en **1** (magas) → **zár** (vezet); 0 → nyit. Jól húz **le**, a föld felé.
- **pMOS:** a gate-en **0** (alacsony) → **zár** (vezet); 1 → nyit. Jól húz **fel**, a táp felé.

A **CMOS** (complementary MOS) logika mindkettőt használja: egy **pMOS felhúzó hálózat** (a táp és a kimenet között) és egy **nMOS lehúzó hálózat** (a kimenet és a föld között). A két hálózat mindig **ellentétesen** működik: amikor az egyik vezet, a másik szakadás – így nyugalomban nem folyik áram a táptól a földig (ezért kicsi a CMOS statikus fogyasztása, 3. témakör).

## Az inverter, a NAND és a NOR

**Inverter** (2 tranzisztor): egy pMOS felül, egy nMOS alul, a gate-ek összekötve.

```text
      VDD
       |
  A ──o[pMOS]          A = 0: a pMOS vezet → Y = 1
       |
       ├──── Y
       |
  A ───[nMOS]          A = 1: az nMOS vezet → Y = 0
       |
      GND
```

**NAND2** (4 tranzisztor): a két nMOS **sorosan** (csak akkor húz le, ha A **és** B is 1), a két pMOS **párhuzamosan** (bármelyik 0 bemenet felhúz).

**NOR2** (4 tranzisztor): fordítva – az nMOS-ok **párhuzamosan** (bármelyik 1 lehúz), a pMOS-ok **sorosan**.

A szabály: **soros nMOS = ÉS, párhuzamos nMOS = VAGY**, és a kimenet a lehúzó hálózat függvényének **negáltja**. A pMOS hálózat ennek a **duálisa** (soros ↔ párhuzamos). Egy n bemenetű NAND vagy NOR **2n** tranzisztorból áll.

Ezért a CMOS-ban a **NAND és a NOR** (és az inverter) a „természetes”, legolcsóbb kapu; egy ÉS kapu valójában NAND + inverter (6 tranzisztor).

## Összetett kapuk

Egyetlen CMOS-fokozatban bonyolultabb, invertáló függvény is megvalósítható (**AOI** – AND-OR-INVERT, **OAI**). Ha az nMOS hálózatban A és B sorosan, és ezzel párhuzamosan C van, akkor a lehúzó hálózat függvénye AB + C, a kimenet:

**Y = (A·B + C)'** – ez egy AOI21 kapu, mindössze 6 tranzisztorral (külön kapukból 10 kellene).

## A chipgyártás lépései

1. **Szilíciumszelet** (wafer): nagy tisztaságú egykristály szilíciumból vágott, 300 mm átmérőjű korong; egy szeleten több száz chip (die) készül egyszerre.
2. **Fotolitográfia:** a szeletre fényérzékeny réteget (fotoreziszt) visznek, és egy **maszkon** keresztül megvilágítják; az előhívás után a mintázat szerint marják, adalékolják vagy fémezik a felületet. A legkisebb mintázatokhoz ma **EUV** (extrém ultraibolya, 13,5 nm-es) fényt használnak.
3. Ezt **sokszor megismétlik**: alul a tranzisztorok rétegei, felettük akár 10–15 **fémréteg** a huzalozáshoz – egy modern chiphez 50–100 maszk kell.
4. **Tesztelés a szeleten**, darabolás, **tokozás**, végső tesztelés.

**Technológiai csomópont** („7 nm”, „3 nm”): eredetileg a tranzisztor csatornahossza volt, ma inkább csak a generáció neve – minél kisebb, annál több, gyorsabb és takarékosabb tranzisztor fér el egységnyi területen. A mai tranzisztorok már nem síkbeliek: **FinFET**, illetve **GAA** (gate-all-around) szerkezetűek.

**Kihozatal** (yield): a jó chipek aránya. Egy kristályhiba tönkreteheti a chipet, ezért a nagy chipeknek rosszabb a kihozatala. Pl. 600 chip/szelet és 80 % kihozatal → 480 jó chip.

## A Moore-törvény

Gordon Moore (az Intel egyik alapítója) 1965-ös megfigyelése, 1975-ös pontosításával: az egy chipen elhelyezhető tranzisztorok száma **kb. kétévente megduplázódik**. Ez évtizedekig igaz volt: az 1971-es Intel 4004-ben 2300 tranzisztor volt, a mai csúcsprocesszorokban több tízmilliárd van. 10 év alatt ez 2<sup>5</sup> = **32-szeres** növekedés. Mára a méretcsökkentés lassul (fizikai határok, költség), ezért egyre fontosabb a 3D-s tokozás és a chipletek (3. lecke).

```python run
# CMOS-kapu kiértékelése a lehúzó (nMOS) hálózatból: Y = (A·B + C)'
from itertools import product

def aoi21(a, b, c):
    lehuz = (a and b) or c          # vezet-e az nMOS hálózat a föld felé
    return 0 if lehuz else 1        # ha lehúz → 0, különben a pMOS hálózat felhúz → 1

print("A B C | Y")
for a, b, c in product((0, 1), repeat=3):
    print(a, b, c, "|", aoi21(a, b, c))

# Moore-törvény: kétévenkénti duplázódás az Intel 4004-től
for ev in (1971, 1981, 1991, 2001, 2011, 2021):
    print(ev, f"{2300 * 2 ** ((ev - 1971) / 2):,.0f}")
```

## Összefoglalás

- nMOS: 1-re vezet, jól húz le; pMOS: 0-ra vezet, jól húz fel; CMOS = pMOS felhúzó + nMOS lehúzó hálózat, ellentétes működéssel.
- Inverter: 2 tranzisztor; n bemenetű NAND/NOR: 2n; NAND: soros nMOS, párhuzamos pMOS; NOR: fordítva.
- Összetett kapu: a kimenet a lehúzó hálózat függvényének negáltja (soros = ÉS, párhuzamos = VAGY).
- Gyártás: szilíciumszelet, fotolitográfia maszkokkal, sok réteg, tokozás; kihozatal; Moore-törvény: kétévente duplázódás.

## A lecke feladata

```quiz required
? Hány tranzisztorból áll egy hárombemenetű CMOS NAND kapu?
= 6

? Hogyan kapcsolódnak az nMOS tranzisztorok egy CMOS NAND kapuban?
+ sorosan
- párhuzamosan
- nincsenek benne nMOS tranzisztorok
- keresztbe csatolva, mint egy tárolóban

? Egy CMOS-kapu nMOS hálózatában A és B sorosan van kötve, ezzel párhuzamosan C. Mi a kimenet függvénye?
expr: A, B, C -> (A·B + C)'
! A lehúzó hálózat függvénye AB + C, a kimenet ennek negáltja.

? Egy szeleten 600 chip készül, a kihozatal 80 %. Hány jó chipet kapunk?
= 480

? A Moore-törvény szerint (kétévenkénti duplázódás) hányszorosára nő a tranzisztorszám 10 év alatt?
= 32
! 10 év = 5 duplázódás.

? Miért kicsi a CMOS-kapuk nyugalmi (statikus) fogyasztása?
- Mert csak nMOS tranzisztorokból állnak.
+ Mert a felhúzó és a lehúzó hálózat közül nyugalomban mindig csak az egyik vezet, így nincs áramút a táptól a földig.
- Mert nagyon kicsi a tápfeszültségük.
- Mert nincs bennük fémréteg.
```
