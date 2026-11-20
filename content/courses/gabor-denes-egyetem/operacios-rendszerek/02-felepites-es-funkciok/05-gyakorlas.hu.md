---
title: Gyakorlás – felépítés és funkciók
summary: Ellenőrző kérdések és összefoglaló feladatlap az operációs rendszerek felépítéséhez.
minutes: 45
kind: practice
---

## Ellenőrző kérdések

Előbb próbálj meg fejben válaszolni, csak utána nyisd le a választ!

<details>
<summary>1. Mondj egy példát arra, amikor az OS erőforrás-kezelőként, és egyet, amikor kiterjesztett gépként viselkedik!</summary>

Erőforrás-kezelő: a böngésző és a zenelejátszó felváltva kapja a processzort, és mindkettő külön memóriaterületet kap. Kiterjesztett gép: a programok fájlokat nyitnak meg név szerint, nem lemezblokkokat címeznek.

</details>

<details>
<summary>2. Miért kell az időzítő megszakítás egy többfeladatos rendszerben?</summary>

Mert enélkül egy program, amely sosem hív rendszerhívást (pl. végtelen ciklusban fut), soha nem adná vissza a vezérlést az OS-nek, és a többi program nem futhatna.

</details>

<details>
<summary>3. Sorold fel a rendszerindítás lépéseit Linuxon!</summary>

Bekapcsolás → UEFI firmware (POST, indítóeszköz) → GRUB rendszerbetöltő → a kernel betöltése és inicializálása → a systemd (PID 1) elindítja a szolgáltatásokat → bejelentkező képernyő.

</details>

<details>
<summary>4. Miért gyorsítja a gépet, ha az OS a gyakran használt adatokat a RAM-ban tartja?</summary>

Mert a RAM elérése nagyságrendekkel gyorsabb, mint az SSD-é vagy a HDD-é (kb. 100 ns kontra 0,1–10 ms).

</details>

Próbáld ki az Ubuntu VM-ben:

```bash
cat /proc/cpuinfo | grep "model name" | head -1   # milyen processzort lát a vendég
cat /proc/meminfo | head -3                        # memória
systemd-analyze                                    # az indítás ideje
```

## Összefoglaló feladatlap

```quiz required
? Mi a régi BIOS mai utódja, amely a számítógép indítását végzi?
= UEFI
! Unified Extensible Firmware Interface.

? Melyik Linux rendszerbetöltő a legelterjedtebb (Ubuntu is ezt használja)?
+ GRUB
- NTLDR
- systemd
- POST
! GRand Unified Bootloader.

? Melyik a leggyorsabb tár a memóriahierarchiában?
+ regiszter
- L3 cache
- RAM
- SSD
! A regiszterek a processzorban vannak, 1 ns alatt elérhetők.

? Melyik fajta megszakítást váltja ki szándékosan egy program, amikor az OS szolgáltatását kéri?
- hardveres megszakítás
- kivétel
+ szoftveres megszakítás (trap, rendszerhívás)
- időzítő megszakítás
! A rendszerhívásokról külön témakör szól.

? Melyik rendszer a mai Linux és macOS szellemi őse (1970-es évek, Bell Labs)?
= UNIX
! Ken Thompson és Dennis Ritchie, 1969–1973.

? Hány nanoszekundum nagyságrendileg a RAM elérési ideje a lecke táblázata szerint?
= 100
! Regiszter < 1 ns, RAM ~100 ns, SSD ~100 000 ns.
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **Lekérdezés vagy megszakítás?** Egy eszköz másodpercenként `esemeny` eseményt jelez. Lekérdezésnél (polling) a CPU másodpercenként `lekerdezes` alkalommal megnézi az eszközt, alkalmanként 1 µs-ért; megszakításnál eseményenként 5 µs a költség. Írd meg a `jobb_modszer(esemeny, lekerdezes)` függvényt, amely `"lekérdezés"`-t vagy `"megszakítás"`-t ad vissza – azt, amelyik kevesebb CPU-időt visz (egyenlőségnél a megszakítást)!

```python starter
def jobb_modszer(esemeny, lekerdezes):
    return "lekérdezés"
```

<details>
<summary>Megoldás</summary>

```python solution
def jobb_modszer(esemeny, lekerdezes):
    polling_us = lekerdezes * 1       # minden ellenőrzés 1 µs, akár volt esemény, akár nem
    irq_us = esemeny * 5              # minden esemény egy megszakítás, 5 µs
    return "lekérdezés" if polling_us < irq_us else "megszakítás"
```

</details>

```python test
assert jobb_modszer(10, 1000) == "megszakítás"       # ritka esemény: kár folyton nézni
assert jobb_modszer(100000, 100000) == "lekérdezés"   # nagyon sűrű esemény
assert jobb_modszer(200, 1000) == "megszakítás"
print("Minden ellenőrzés sikeres!")
```

**2.** **DMA nélkül és DMA-val.** Egy 1 MB-os (1 048 576 bájtos) átvitelnél DMA nélkül a CPU minden **4 bájtért** egy műveletet végez (egyenként 0,01 µs), DMA-val csak a beállítás (2 µs) és a végén egy megszakítás (5 µs) terheli. Írd meg a `cpu_ido_us(bajt, dma)` függvényt, amely megadja a CPU-terhelést µs-ban!

```python starter
def cpu_ido_us(bajt, dma):
    return 0
```

<details>
<summary>Megoldás</summary>

```python solution
def cpu_ido_us(bajt, dma):
    if dma:
        return 2 + 5                  # beállítás + befejező megszakítás
    return bajt / 4 * 0.01            # minden 4 bájt egy CPU-művelet
```

</details>

```python test
assert cpu_ido_us(1048576, True) == 7
assert round(cpu_ido_us(1048576, False), 2) == 2621.44
assert round(cpu_ido_us(400, False), 2) == 1.0
print("Minden ellenőrzés sikeres!")
```

**3.** **Melyik tároló, mennyi idő?** Írd meg a `nagysagrend(ns)` függvényt, amely egy elérési időből (nanoszekundumban) megmondja, melyik tárolószintre jellemző: 1 ns alatt `"regiszter"`, 10 ns alatt `"gyorsítótár"`, 1000 ns alatt `"RAM"`, 1 000 000 ns alatt `"SSD"`, különben `"merevlemez"`.

```python starter
def nagysagrend(ns):
    return "RAM"
```

<details>
<summary>Megoldás</summary>

```python solution
def nagysagrend(ns):
    # a határok sorban, a leggyorsabbtól
    for hatar, nev in [(1, "regiszter"), (10, "gyorsítótár"), (1000, "RAM"), (1_000_000, "SSD")]:
        if ns < hatar:
            return nev
    return "merevlemez"
```

</details>

```python test
assert nagysagrend(0.3) == "regiszter"
assert nagysagrend(4) == "gyorsítótár"
assert nagysagrend(80) == "RAM"
assert nagysagrend(100_000) == "SSD"
assert nagysagrend(8_000_000) == "merevlemez"
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Mi indítja el elsőként az operációs rendszert a gép bekapcsolása után?
- a kernel saját magát
+ az alaplapi firmware (UEFI/BIOS), amely betölti a rendszerbetöltőt
- a felhasználó első programja
! UEFI → rendszerbetöltő (pl. GRUB, Windows Boot Manager) → kernel.

? Mi a megszakítás (interrupt)?
+ egy eszköz jelzése a CPU-nak, hogy figyelmet kér; a CPU félbehagyja, amit csinál, és lefuttatja a kezelőt
- egy program hibás leállása
- a tápellátás megszakadása
! Utána a CPU ott folytatja, ahol abbahagyta.

? Melyik NEM az operációs rendszer alapfeladata?
- erőforrások (CPU, memória, eszközök) kezelése
- folyamatok elszigetelése egymástól
+ táblázatok formázása
- fájlok kezelése
! Az egy alkalmazás (táblázatkezelő) dolga.

? Mi a DMA előnye?
- gyorsabbá teszi a processzor órajelét
+ az eszköz a CPU közreműködése nélkül másol adatot a memóriába, a CPU közben mást csinálhat
- titkosítja az adatokat
! Direct Memory Access.

? Melyik a leggyorsabb tárolószint?
+ a CPU regiszterei
- a RAM
- az SSD
- a gyorsítótár
! Regiszter < gyorsítótár < RAM < SSD < merevlemez.
```
