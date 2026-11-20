---
title: Gyakorlás – operációs rendszerek alapjai
summary: Ellenőrző kérdések és összefoglaló feladatlap az OS feladatairól, a fájlokról és a parancssorról.
minutes: 43
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Miért futtat a böngésző minden fület külön folyamatban?</summary>

Mert a folyamatok memóriája el van választva: ha egy oldal lefagy vagy összeomlik, csak az ő folyamata áll le, a többi fül működik tovább. Ez biztonsági előny is.

</details>

<details>
<summary>2. Mi a különbség a `C:\Users\anna\a.txt` és a `..\a.txt` út között?</summary>

Az első abszolút: a meghajtó gyökerétől indul, bárhonnan ugyanazt jelenti. A második relatív: az aktuális mappa szülőjében lévő `a.txt`-t jelenti, tehát attól függ, hol állsz.

</details>

<details>
<summary>3. Egy 6 GB-os videót nem tudsz rámásolni a pendrive-ra, pedig van rajta 20 GB szabad hely. Mi lehet az oka?</summary>

A pendrive valószínűleg FAT32-re van formázva, ahol egy fájl legfeljebb 4 GB lehet. exFAT-ra formázva (adatmentés után!) a gond megszűnik.

</details>

Próbáld ki a saját gépeden (PowerShell):

```powershell
pwd
mkdir proba
cd proba
"szia" > hello.txt
cat hello.txt
cd ..
Get-Process | Sort-Object CPU -Descending | Select-Object -First 5
```

## Összefoglaló feladatlap

```quiz required
? Melyik operációs rendszer fut a legtöbb webszerveren?
- Windows 11
+ Linux
- iOS
- macOS
! A felhő és a szerverek nagy része Linuxon fut.

? Melyik fájlrendszer a Windows alapértelmezett fájlrendszere?
= NTFS
! New Technology File System.

? Mi az a `PID`?
+ egy folyamat azonosító száma
- egy fájl kiterjesztése
- a processzor típusa
- a jelszó rövidítése
! Process ID.

? Melyik parancs hoz létre új mappát?
= mkdir
! make directory.

? Mit jelent a `-rw-r--r--` jogosultság a **tulajdonos** számára?
+ olvashatja és írhatja, de nem futtathatja
- csak olvashatja
- mindent megtehet
- semmit sem tehet
! Az első hármas (rw-) a tulajdonosé.

? Mi történik egy fájllal, amit Linuxon az `rm` paranccsal törölsz?
- a Lomtárba kerül
+ azonnal törlődik, a Lomtárba nem kerül
- csak elrejtődik
- átkerül a gyökérkönyvtárba
! A parancssori törlés végleges.
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **Jogosultság oktálisan.** Írd meg az `oktalis(jogok)` függvényt, amely egy 9 karakteres `rwx` szövegből (pl. `"rwxr-xr-x"`) a 3 jegyű oktális alakot adja vissza szövegként (pl. `"755"`)!

```python starter
def oktalis(jogok):
    return str(jogok.count("r")) + str(jogok.count("w")) + str(jogok.count("x"))
```

<details>
<summary>Megoldás</summary>

```python solution
def oktalis(jogok):
    ertek = {"r": 4, "w": 2, "x": 1, "-": 0}
    jegyek = []
    for i in (0, 3, 6):                       # tulajdonos, csoport, mások
        jegyek.append(str(sum(ertek[c] for c in jogok[i:i + 3])))
    return "".join(jegyek)
```

</details>

```python test
assert oktalis("rwxr-xr-x") == "755"
assert oktalis("rw-r--r--") == "644"
assert oktalis("rw-------") == "600"
assert oktalis("---------") == "000"
print("Minden ellenőrzés sikeres!")
```

**2.** **Elérési út feloldása.** Írd meg a `felold(aktualis, relativ)` függvényt, amely egy Linux-stílusú relatív utat (benne `.` és `..` is lehet) az aktuális mappához képest abszolút úttá alakít! A gyökérből nem lehet feljebb lépni.

```python starter
def felold(aktualis, relativ):
    return aktualis + "/" + relativ
```

<details>
<summary>Megoldás</summary>

```python solution
def felold(aktualis, relativ):
    reszek = [r for r in aktualis.split("/") if r]
    for r in relativ.split("/"):
        if r in ("", "."):
            continue
        if r == "..":
            if reszek:
                reszek.pop()                  # egy szinttel feljebb
        else:
            reszek.append(r)
    return "/" + "/".join(reszek)
```

</details>

```python test
assert felold("/home/anna", "jegyzet.txt") == "/home/anna/jegyzet.txt"
assert felold("/home/anna/egyetem", "../kepek/a.png") == "/home/anna/kepek/a.png"
assert felold("/home", "./x/../y") == "/home/y"
assert felold("/home", "../../../etc") == "/etc"
print("Minden ellenőrzés sikeres!")
```

**3.** **Átlagos várakozás érkezési sorrendben.** Írd meg az `atlagos_varakozas(igenyek)` függvényt, amely egyszerre érkező feladatok CPU-igényeinek listájából (érkezési sorrendben futtatva) kiszámolja az átlagos **várakozási** időt – mennyit vár egy feladat, mielőtt elindul (2 tizedesre)!

```python starter
def atlagos_varakozas(igenyek):
    return round(sum(igenyek) / len(igenyek), 2)
```

<details>
<summary>Megoldás</summary>

```python solution
def atlagos_varakozas(igenyek):
    ido, varakozasok = 0, []
    for igeny in igenyek:
        varakozasok.append(ido)              # ennyit várt az indulásig
        ido += igeny
    return round(sum(varakozasok) / len(varakozasok), 2)
```

</details>

```python test
assert atlagos_varakozas([6, 2, 1]) == 4.67
assert atlagos_varakozas([1, 2, 6]) == 1.33
assert atlagos_varakozas([5]) == 0.0
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Melyik elérési út abszolút?
- `../dokumentumok`
- `kepek/logo.png`
+ `/var/log/syslog`
- `./start.sh`
! Az abszolút út a gyökértől indul.

? Mi a `640` jogosultság `rwx` alakja?
+ `rw-r-----`
- `rwxr-----`
- `rw-rw----`
- `r--r-----`
! 6 = rw-, 4 = r--, 0 = ---.

? Egy program az ideje 90%-ában vár. Hány százalék a CPU-kihasználtság egyetlen ilyen programmal?
= 10
! $1 - 0{,}9 = 0{,}1$.

? Melyik paranccsal listázod ki egy mappa tartalmát Linuxon?
+ `ls`
- `cd`
- `rm`
- `pwd`
! A `pwd` az aktuális mappát írja ki, a `cd` mappát vált.
```
