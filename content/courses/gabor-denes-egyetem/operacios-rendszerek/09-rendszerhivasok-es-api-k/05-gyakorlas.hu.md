---
title: Gyakorlás – rendszerhívások
summary: Rendszerhívások nyomon követése strace-szel, ellenőrző kérdések és összefoglaló feladatlap.
minutes: 50
kind: practice
---

## Nyomozás strace-szel (Ubuntu VM)

1. `strace -c echo szia` – hány `write` hívás volt? Mennyi az összes hívás?
2. `strace -e trace=openat cat /etc/hostname` – melyik fájlokat nyitja meg a `cat` a `/etc/hostname`-en kívül? (Tipp: a C könyvtárat és a nyelvi beállításokat.)
3. `strace -f -e trace=clone,execve bash -c "ls"` – látod a `clone` (a fork Linuxos megvalósítása) és az `execve` hívásokat?
4. `ls /nincs 2> /dev/null; echo $?` – a kilépési kód (2) jelzi a hibát, a hibaüzenet pedig a „semmibe” ment.

## Ellenőrző kérdések

<details>
<summary>1. Miért ellenőrzi a kernel a rendszerhívás összes paraméterét?</summary>

Mert a felhasználói program lehet hibás vagy rosszindulatú. Ha a kernel ellenőrzés nélkül írna egy megadott címre, egy program a kernel vagy más folyamat memóriáját írhatná felül.

</details>

<details>
<summary>2. Miért nem írnak a programozók közvetlenül rendszerhívásokat (syscall utasítással)?</summary>

Mert az nem hordozható (a számozás OS-enként és architektúránként eltér), kényelmetlen, és lemondanánk a könyvtár pufferezéséről és hibakezeléséről. A libc és a POSIX API ezt elfedi.

</details>

<details>
<summary>3. Miért van szükség külön stderr-re, ha van stdout?</summary>

Hogy a program kimenete és a hibaüzenetek szétválaszthatók legyenek: például `program > eredmeny.txt` mellett a hibák továbbra is a terminálon jelennek meg, nem keverednek az eredménybe.

</details>

## Összefoglaló feladatlap

```quiz required
? Melyik fájlleíró a szabványos kimenet (stdout)?
= 1
! 0 = stdin, 1 = stdout, 2 = stderr.

? Mi a POSIX `fork` + `exec` páros Win32 megfelelője?
= CreateProcess
! Egy hívással létrehozza és elindítja az új folyamatot.

? Melyik formátumú egy Windows `.exe` fájl?
- ELF
+ PE
- Mach-O
- ISO
! Portable Executable.

? Mit ad vissza egy sikertelen POSIX rendszerhívás jellemzően?
= -1
! A hiba okát az errno változó tárolja.

? Melyik shell-átirányítás küldi a hibaüzeneteket egy fájlba?
- > hibak.txt
+ 2> hibak.txt
- < hibak.txt
- | hibak.txt
! A 2-es fájlleíró a stderr.

? Melyik csoportba tartozik a `chmod` rendszerhívás?
- információ
- kommunikáció
+ védelem
- eszközkezelés
! A fájl jogosultságait állítja.
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **Hány rendszerhívás?** Írd meg a `write_hivasok(sorok, mod, puffer=4096)` függvényt. A `sorok` a kiírandó sorok listája (mindegyik `\n`-nel végződik). `"sor"` módban (terminál) minden sor egy `write()`, `"teljes"` módban (cső, fájl) a puffer betelésekor és a végén van `write()` – vagyis az összes bájt / puffer, felfelé kerekítve. `"nincs"` módban minden **bájt** külön hívás.

```python starter
def write_hivasok(sorok, mod, puffer=4096):
    return len(sorok)
```

<details>
<summary>Megoldás</summary>

```python solution
def write_hivasok(sorok, mod, puffer=4096):
    osszes = sum(len(s.encode()) for s in sorok)    # bájtokban számolunk
    if mod == "sor":
        return len(sorok)
    if mod == "teljes":
        return -(-osszes // puffer)                  # felfelé kerekítve
    return osszes                                     # "nincs": bájtonként
```

</details>

```python test
sorok = [f"{i}. sor\n" for i in range(1000)]          # összesen 8890 bájt
assert write_hivasok(sorok, "sor") == 1000
assert write_hivasok(sorok, "teljes") == 3
assert write_hivasok(sorok, "nincs") == 8890
assert write_hivasok([], "teljes") == 0
print("Minden ellenőrzés sikeres!")
```

**2.** **Átirányítás a fájlleíró-táblában.** Kezdetben a tábla: `{0: "tty", 1: "tty", 2: "tty"}`. Írd meg az `atiranyit(lepesek)` függvényt, amely sorban végrehajtja a lépéseket, és visszaadja a táblát! Egy lépés `("fajl", fd, nev)` – az fd-t a fájlra irányítja (mint a `>`), vagy `("dup", cel, forras)` – a `cel` oda mutasson, ahová a `forras` **éppen most** mutat (mint a `2>&1`).

```python starter
def atiranyit(lepesek):
    return {0: "tty", 1: "tty", 2: "tty"}
```

<details>
<summary>Megoldás</summary>

```python solution
def atiranyit(lepesek):
    tabla = {0: "tty", 1: "tty", 2: "tty"}
    for tipus, a, b in lepesek:
        if tipus == "fajl":
            tabla[a] = b              # pl. > ki.txt: az 1-es a fájlra mutat
        else:
            tabla[a] = tabla[b]       # pl. 2>&1: a 2-es oda, ahová az 1-es MOST mutat
    return tabla
```

</details>

```python test
# ls > ki.txt 2>&1
assert atiranyit([("fajl", 1, "ki.txt"), ("dup", 2, 1)]) == {0: "tty", 1: "ki.txt", 2: "ki.txt"}
# ls 2>&1 > ki.txt  – a sorrend számít!
assert atiranyit([("dup", 2, 1), ("fajl", 1, "ki.txt")]) == {0: "tty", 1: "ki.txt", 2: "tty"}
# sort < be.txt
assert atiranyit([("fajl", 0, "be.txt")])[0] == "be.txt"
print("Minden ellenőrzés sikeres!")
```

**3.** **Mennyi időt nyerünk a pufferrel?** Egy rendszerhívás fix költsége `hivas_us` µs. Írd meg a `megtakaritas(bajt, puffer, hivas_us=1.0)` függvényt: hány µs-t spórolunk, ha `puffer` méretű darabokban írunk bájtonkénti írás helyett? (Csak a hívások fix költségét számold.)

```python starter
def megtakaritas(bajt, puffer, hivas_us=1.0):
    return 0
```

<details>
<summary>Megoldás</summary>

```python solution
def megtakaritas(bajt, puffer, hivas_us=1.0):
    bajtonkent = bajt * hivas_us
    pufferrel = -(-bajt // puffer) * hivas_us
    return bajtonkent - pufferrel
```

</details>

```python test
assert megtakaritas(1048576, 4096) == 1048576 - 256
assert megtakaritas(100, 100, 2.0) == 198.0
assert megtakaritas(0, 4096) == 0
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Melyik a rendszerhívás helyes leírása?
+ egy program kérése a kerneltől egy védett művelet elvégzésére (pl. fájl megnyitása), kernel módba váltással
- egy függvény meghívása egy másik programból
- a felhasználó kérése a rendszergazdától
! A program maga nem érheti el közvetlenül a hardvert.

? Melyik paranccsal követed nyomon egy program rendszerhívásait Linuxon?
+ strace
- top
- ls
- grep
! Pl. strace -c ls összesítést ad.

? Milyen értékkel tér vissza a write() rendszerhívás hiba esetén?
= -1
! A hiba okát az errno változó tartalmazza.

? Mi a POSIX szerepe?
+ szabványos rendszerhívás- és parancsfelületet ír le, így egy program több Unix-szerű rendszeren is lefordítható
- egy Linux-disztribúció neve
- egy fájlrendszer
! A Windows saját API-t (Win32) használ.

? Melyik nem rendszerhívás, hanem könyvtári függvény (ami a háttérben rendszerhívást használhat)?
- open
- read
+ printf
- fork
! A printf pufferel, és időnként write()-ot hív.
```
