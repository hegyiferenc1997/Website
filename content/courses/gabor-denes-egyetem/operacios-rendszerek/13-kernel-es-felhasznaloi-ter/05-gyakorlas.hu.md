---
title: Gyakorlás – kernel és felhasználói tér
summary: Kernelfelderítés az Ubuntu VM-ben, ellenőrző kérdések és összefoglaló feladatlap.
minutes: 50
kind: practice
---

## Kernelfelderítés

```bash
uname -a                               # kernel neve, verziója, architektúrája
lsmod | grep -i vbox                   # a VirtualBox vendégkiegészítő moduljai
sudo dmesg | grep -i -m5 virtualbox    # mit írt a kernel a virtuális hardverről
ps -eo pid,user,comm | head -15        # a [kthreadd] és a többi kernelszál
cat /proc/sys/kernel/hostname          # a gépnév a kernelből
```

Kérdések: Hány `vbox` kezdetű modul van betöltve? Ki a 2-es PID-ű folyamat (`ps -p 2 -o comm`)? (Ez a `kthreadd`, a kernelszálak „szülője”.)

## Ellenőrző kérdések

<details>
<summary>1. Miért lehet egy hibás illesztőprogram veszélyesebb egy hibás alkalmazásnál?</summary>

Mert az illesztőprogram kernel módban fut, teljes hozzáféréssel a memóriához és a hardverhez. A hibája felülírhatja a kernel adatait, és az egész rendszert leállíthatja. Egy alkalmazás hibája csak az alkalmazást állítja le.

</details>

<details>
<summary>2. Miért fut a Windows grafikus alrendszerének egy része kernel módban, ha ez kockázatos?</summary>

Teljesítmény miatt: kernel módban kevesebb módváltás és üzenetküldés kell a rajzoláshoz. Ez a hibrid kernel tipikus kompromisszuma a sebesség és a megbízhatóság között.

</details>

<details>
<summary>3. Mi a különbség a /proc/cpuinfo és egy közönséges szövegfájl között?</summary>

A /proc/cpuinfo nem foglal helyet a lemezen: amikor megnyitod, a kernel abban a pillanatban generálja a tartalmát az aktuális adatokból.

</details>

<details>
<summary>4. Miért kell újraindítani a gépet egy kernelfrissítés után, de egy böngészőfrissítés után nem a gépet, csak a böngészőt?</summary>

Mert a futó kernel nem cserélhető le menet közben (az új kernel csak indításkor töltődik be), a böngésző viszont egy felhasználói folyamat, amelyet egyszerűen újra lehet indítani az új verzióval.

</details>

## Összefoglaló feladatlap

```quiz required
? Melyik kerneltípusba tartozik a Windows NT (Windows 10/11)?
- monolitikus
- mikrokernel
+ hibrid
- exokernel
! Moduláris felépítés, de sok szolgáltatás kernel módban.

? Melyik kernel helyességét bizonyították matematikailag?
= seL4
! Egy L4-családba tartozó mikrokernel.

? Mi a Linux-kernelmodulok fájlkiterjesztése?
= .ko
= ko
! kernel object

? Hogy hívják a kernel végzetes hiba miatti leállását Linuxon?
= kernel panic
= pánik
= panic
! Windowson: kék halál (BSOD).

? Melyik fájl a Windows kernelje?
+ ntoskrnl.exe
- explorer.exe
- winlogon.exe
- svchost.exe
! C:\Windows\System32\ntoskrnl.exe

? Melyik mappában állíthatók a Linux kernel paraméterei (sysctl)?
= /proc/sys
! pl. /proc/sys/vm/swappiness
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **Melyik kernel újabb?** A kernelverziókat (pl. `"6.8.0"`, `"6.11.2"`) nem lehet szövegként összehasonlítani: szövegként `"6.8" > "6.11"`, pedig a 6.11 az újabb! Írd meg az `ujabb(a, b)` függvényt, amely igazat ad, ha az `a` verzió újabb, mint a `b`! (A verziók pontokkal elválasztott egész számok; a `-generic`-hez hasonló utótagot hagyd figyelmen kívül.)

```python starter
def ujabb(a, b):
    return a > b
```

<details>
<summary>Megoldás</summary>

```python solution
def ujabb(a, b):
    def szamok(v):
        v = v.split("-")[0]                  # "6.8.0-45-generic" → "6.8.0"
        return [int(x) for x in v.split(".")]
    return szamok(a) > szamok(b)             # a listák elemenként hasonlítódnak
```

</details>

```python test
assert ujabb("6.11.2", "6.8.0") is True
assert ujabb("6.8.0", "6.11.2") is False
assert ujabb("6.8.0-45-generic", "6.8.0") is False
assert ujabb("7.0", "6.19.3") is True
assert ujabb("6.8.1", "6.8.0-45-generic") is True
print("Minden ellenőrzés sikeres!")
```

**2.** **Ki kéri a legtöbb megszakítást?** A `/proc/interrupts` minden sorában egy megszakítás neve, utána magonként a darabszám, végül az eszköz neve áll. Írd meg a `legtobb(sorok)` függvényt, amely visszaadja a legtöbb megszakítást (az összes magon összesen) kérő eszköz nevét!

```python starter
def legtobb(sorok):
    return sorok[0].split()[-1]
```

<details>
<summary>Megoldás</summary>

```python solution
def legtobb(sorok):
    legjobb, max_db = None, -1
    for sor in sorok:
        reszek = sor.split()
        szamok = [int(x) for x in reszek[1:] if x.isdigit()]   # magonkénti számok
        if sum(szamok) > max_db:
            legjobb, max_db = reszek[-1], sum(szamok)
    return legjobb
```

</details>

```python test
sorok = [
    "1:      9      0   i8042",
    "16:   120   3400   ehci_hcd",
    "19:  8800   9100   enp0s3",
    "20:   500    700   ahci",
]
assert legtobb(sorok) == "enp0s3"
assert legtobb(["5: 1 1 a", "6: 3 0 b"]) == "b"
print("Minden ellenőrzés sikeres!")
```

**3.** **Monolitikus kontra mikrokernel.** Írd meg a `modvaltasok(keresek, uzenet_per_keres)` függvényt, amely egy párt ad vissza: hány módváltás kell monolitikus kernelben (kérésenként 2), és hány mikrokernelben (kérésenként `uzenet_per_keres` üzenet, üzenetenként 2 módváltás)!

```python starter
def modvaltasok(keresek, uzenet_per_keres):
    return (0, 0)
```

<details>
<summary>Megoldás</summary>

```python solution
def modvaltasok(keresek, uzenet_per_keres):
    mono = keresek * 2
    mikro = keresek * uzenet_per_keres * 2
    return (mono, mikro)
```

</details>

```python test
assert modvaltasok(1000, 4) == (2000, 8000)
assert modvaltasok(1, 1) == (2, 2)
assert modvaltasok(0, 4) == (0, 0)
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Mi történik, ha egy felhasználói program hibás memóriacímre ír (pl. nullmutató)?
+ a CPU kivételt vált ki, a kernel leállítja a programot (Segmentation fault), a rendszer fut tovább
- az egész rendszer leáll
- semmi, a program tovább fut
! A felhasználói mód elszigeteli a hibát.

? Melyik paranccsal listázod a betöltött kernelmodulokat Linuxon?
+ lsmod
- ls /home
- ps
- df
! modinfo: egy modul adatai, modprobe: betöltés/eltávolítás.

? Mit tartalmaz a /proc könyvtár?
+ a kernel által menet közben előállított, valójában nem a lemezen lévő fájlokat (folyamatok, hardver, beállítások)
- a felhasználók saját fájljait
- a telepített programokat
! Pl. /proc/cpuinfo, /proc/meminfo.

? Melyik operációs rendszer kernele hibrid?
- Linux
+ Windows NT
- MINIX 3
! A macOS XNU kernele is hibrid.

? Mi a kernel panic?
+ a kernel végzetes hibája, amely után a rendszer leáll
- egy program lefagyása
- a lemez megtelése
! Windowson a kék halál (BSOD) felel meg neki.
```
