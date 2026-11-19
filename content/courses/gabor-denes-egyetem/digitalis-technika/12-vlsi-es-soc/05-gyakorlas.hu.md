---
title: Gyakorlás – VLSI-áramkörök és SoC
summary: Ellenőrző kérdések és összefoglaló feladatlap: CMOS-kapuk tranzisztoros felépítése, gyártás és kihozatal, Moore-törvény, ASIC vagy FPGA, VLSI-tervezési lépések, tesztelhetőség, SoC, IP-blokkok, AMBA, energiagazdálkodás.
minutes: 60
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

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **Kihozatal és ár.** Írd meg a `kihozatal(d_per_cm2, terulet_mm2)` függvényt (Poisson-modell, Y = e^(−D·A), az eredmény %-ban, egy tizedesre), és az `ar_jo_chipre(szelet_ar, chip_db, kihozatal_szazalek)` függvényt, amely két tizedesre megadja egy hibátlan chip árát!

```python starter
def kihozatal(d_per_cm2, terulet_mm2):
    return 100.0

def ar_jo_chipre(szelet_ar, chip_db, kihozatal_szazalek):
    return szelet_ar / chip_db
```

<details>
<summary>Megoldás</summary>

```python solution
import math

def kihozatal(d_per_cm2, terulet_mm2):
    a_cm2 = terulet_mm2 / 100                      # 100 mm² = 1 cm²
    return round(100 * math.exp(-d_per_cm2 * a_cm2), 1)

def ar_jo_chipre(szelet_ar, chip_db, kihozatal_szazalek):
    jo = chip_db * kihozatal_szazalek / 100        # a szelet árát csak a jó chipek viszik
    return round(szelet_ar / jo, 2)
```

</details>

```python test
assert kihozatal(0.1, 100) == 90.5
assert kihozatal(0.1, 600) == 54.9
assert kihozatal(0, 600) == 100.0
assert ar_jo_chipre(10000, 640, 90.5) == 17.27
print("Minden ellenőrzés sikeres!")
```

**2.** **Megtérülési darabszám.** Írd meg a `megterules(nre, c_fpga, c_asic)` függvényt, amely megadja azt a **legkisebb egész** darabszámot, amelytől az ASIC összköltsége (NRE + n · c_asic) már nem nagyobb az FPGA-énál (n · c_fpga)! Ha az ASIC darabára nem kisebb, adj vissza `None`-t.

```python starter
def megterules(nre, c_fpga, c_asic):
    return nre / (c_fpga - c_asic)
```

<details>
<summary>Megoldás</summary>

```python solution
import math

def megterules(nre, c_fpga, c_asic):
    if c_asic >= c_fpga:
        return None                               # sosem térül meg
    return math.ceil(nre / (c_fpga - c_asic))     # felfelé kerekítés: egész darab kell
```

</details>

```python test
assert megterules(1_000_000, 25, 5) == 50000
assert megterules(2_000_000, 40, 4) == 55556
assert megterules(100, 10, 10) is None
print("Minden ellenőrzés sikeres!")
```

**3.** **DVFS energiája.** Írd meg az `energia_j(c_farad, u_volt, ciklusok)` függvényt (E = C · U² · ciklusszám, három tizedesre), és a `megtakaritas(u_regi, u_uj)` függvényt, amely %-ban (egészre kerekítve) megadja, mennyivel kevesebb energia kell egy feladathoz az alacsonyabb feszültségen!

```python starter
def energia_j(c_farad, u_volt, ciklusok):
    return 0

def megtakaritas(u_regi, u_uj):
    return 0
```

<details>
<summary>Megoldás</summary>

```python solution
def energia_j(c_farad, u_volt, ciklusok):
    return round(c_farad * u_volt ** 2 * ciklusok, 3)   # a frekvencia kiesik!

def megtakaritas(u_regi, u_uj):
    return round(100 * (1 - (u_uj / u_regi) ** 2))      # E ∝ U²
```

</details>

```python test
assert energia_j(1e-9, 1.2, 3e9) == 4.32
assert energia_j(1e-9, 0.7, 3e9) == 1.47
assert megtakaritas(1.2, 0.6) == 75
assert megtakaritas(1.0, 0.9) == 19
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Mit jelent egy technológiai csomópont (pl. „3 nm”) megnevezése ma?
- a tranzisztor pontos kapuhosszát
+ inkább egy generáció nevét; a valódi méretek ettől eltérnek
- a chip teljes méretét
! A régi technológiáknál még egyezett a kapuhosszal, ma már marketingnév.

? Mire való a scan lánc egy ASIC-ben?
+ a flip-flopok léptetőregiszterbe fűzése gyártás utáni teszteléshez
- az órajel elosztására
- a fogyasztás csökkentésére
! Így minden belső állapot beállítható és kiolvasható.

? Mi a „tape-out”?
- a chip tokozása
+ a kész tervadatok átadása a gyártónak
- a chip első bekapcsolása
! Ezután készülnek a maszkok – egy hiba innen már nagyon drága.

? Mit csinál az órajelkapuzás (clock gating)?
+ lekapcsolja az órajelet a pillanatnyilag nem használt blokkokról, így ott nincs dinamikus fogyasztás
- megduplázza az órajel-frekvenciát
- szinkronizálja az órajeleket
! A P = C · U² · f képletben így f = 0 a pihenő blokkra.

? Melyik nyílt utasításkészlet-architektúrát (ISA) használhatja bárki licencdíj nélkül?
= RISC-V
= risc-v
! Az ARM és az x86 licenchez kötött.
```
