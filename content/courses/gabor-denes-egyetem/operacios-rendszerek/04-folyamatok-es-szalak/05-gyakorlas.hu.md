---
title: Gyakorlás – folyamatok és szálak
summary: Ellenőrző kérdések, kísérletek az Ubuntu VM-ben és összefoglaló feladatlap.
minutes: 50
kind: practice
---

## Kísérletek az Ubuntu VM-ben

1. Indíts el három `sleep 600 &` parancsot, majd nézd meg őket: `jobs`, `ps -o pid,ppid,stat,cmd`. Mi a szülőjük PPID-je? (A shelled PID-je: `echo $$`.)
2. Állítsd le az egyiket udvariasan (`kill PID`), egy másikat erőből (`kill -9 PID`). Mit ír ki a shell?
3. Futtasd a `pstree -p $$` parancsot: látod a shelled és a gyerekeit.
4. Nyisd meg a `top` programot, és nyomd meg a **H** billentyűt: szálnézetre vált.

## Ellenőrző kérdések

<details>
<summary>1. Miért ad a fork() mást vissza a szülőnek és a gyereknek?</summary>

Mert a fork után a két folyamat ugyanazt a kódot futtatja ugyanonnan. A visszatérési értékből (szülőnek a gyerek PID-je, gyereknek 0) dönti el a program, hogy melyik ágon folytassa.

</details>

<details>
<summary>2. Miért nem kerül a várakozó folyamat közvetlenül futó állapotba, amikor az I/O befejeződik?</summary>

Mert lehet, hogy éppen egy másik folyamat fut a processzoron. Az I/O végén a folyamat a kész sorba kerül, és az ütemező dönti el, mikor kapja meg újra a CPU-t.

</details>

<details>
<summary>3. Mikor jobb több szál, és mikor több folyamat?</summary>

Szál: ha a részfeladatoknak sok közös adatot kell látniuk, és gyors váltás kell (pl. egy játék rajzolása és fizikája). Folyamat: ha elszigetelés kell – egy hiba ne vigye magával a többit (pl. a Chrome minden fület külön folyamatban futtat).

</details>

<details>
<summary>4. Mi a baj a sok zombi folyamattal?</summary>

Mindegyik elfoglal egy bejegyzést a folyamattáblában (PID-et). Ha a szülő sosem hív wait()-et, elfogyhatnak a PID-ek. Megoldás: a szülő javítása vagy leállítása – ekkor a zombikat a PID 1 örökli és eltakarítja.

</details>

## Összefoglaló feladatlap

```quiz required
? Melyik állapotban van az a folyamat, amely billentyűleütésre vár?
- fut
- kész
+ várakozik (blokkolt)
- új
! Processzort hiába kapna, az eseményre vár.

? Melyik billentyűkombináció küld SIGINT jelzést a terminálban futó programnak?
= Ctrl + C
= ctrl+c
= Ctrl+C
! A Ctrl + Z felfüggeszti (SIGSTOP).

? Hány jelzésszámú (szám) a SIGTERM?
= 15
! A kill parancs alapértelmezett jelzése.

? Melyik parancs mutatja a folyamatokat fa alakban?
+ pstree
- jobs
- kill
- free
! pstree -p a PID-eket is kiírja.

? Egy folyamat 3 szálat indít. Hány veremre (stack) van szükség összesen, a fő szállal együtt?
= 4
! Szálanként egy verem: 1 fő szál + 3 új szál.

? Mi történik, ha egy többszálú folyamat egyik szála érvénytelen memóriacímre ír?
- Csak az a szál áll le.
+ Az egész folyamat összeomlik.
- A kernel átirányítja egy másik címre.
- Semmi, a hibát figyelmen kívül hagyja.
! A szálak közös címtérben futnak, ezért a hiba az egész folyamatot érinti.
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **Érvényes állapotátmenet?** Írd meg az `ervenyes(honnan, hova)` függvényt, amely igazat ad, ha a folyamat-állapotmodellben létezik ilyen átmenet: új → kész, kész → futó, futó → kész (lejárt az időszelet), futó → várakozó (I/O-ra vár), várakozó → kész, futó → befejezett.

```python starter
def ervenyes(honnan, hova):
    return True
```

<details>
<summary>Megoldás</summary>

A várakozóból nem lehet közvetlenül futó: ha az I/O befejeződött, a folyamat a kész sorba kerül, és az ütemező dönt, mikor fut.

```python solution
ATMENETEK = {
    ("új", "kész"), ("kész", "futó"), ("futó", "kész"),
    ("futó", "várakozó"), ("várakozó", "kész"), ("futó", "befejezett"),
}

def ervenyes(honnan, hova):
    return (honnan, hova) in ATMENETEK
```

</details>

```python test
assert ervenyes("kész", "futó")
assert ervenyes("futó", "várakozó")
assert not ervenyes("várakozó", "futó")     # előbb kész sorba kell kerülnie
assert not ervenyes("új", "futó")
assert not ervenyes("befejezett", "kész")
print("Minden ellenőrzés sikeres!")
```

**2.** **Ősök a folyamatfában.** A `szulo` szótár minden PID-hez megadja a szülő PID-jét (a `systemd`, 1-es PID szülője 0). Írd meg az `osok(pid, szulo)` függvényt, amely a folyamattól az 1-es PID-ig visszaadja a PID-ek listáját (mint a `pstree -s`)!

```python starter
def osok(pid, szulo):
    return [pid]
```

<details>
<summary>Megoldás</summary>

```python solution
def osok(pid, szulo):
    lanc = [pid]
    while pid != 1:                   # a systemd-ig megyünk felfelé
        pid = szulo[pid]
        lanc.append(pid)
    return lanc
```

</details>

```python test
szulo = {1: 0, 812: 1, 1500: 812, 1720: 1500, 1733: 1720, 900: 1}
assert osok(1733, szulo) == [1733, 1720, 1500, 812, 1]
assert osok(900, szulo) == [900, 1]
assert osok(1, szulo) == [1]
print("Minden ellenőrzés sikeres!")
```

**3.** **Versenyhelyzet lépésenként.** Két szál (A és B) ugyanazt a számlálót növeli: mindegyik **olvas** (a számlálót a saját regiszterébe másolja), majd **ír** (a regiszter + 1 értéket visszaírja). Írd meg a `szimulal(utemezes)` függvényt, amely egy `[("A", "olvas"), ("B", "olvas"), ...]` lépéssorozat után visszaadja a számláló értékét (kezdetben 0)!

```python starter
def szimulal(utemezes):
    return 0
```

<details>
<summary>Megoldás</summary>

Az összefont sorrendben mindkét szál 0-t olvas, és mindkettő 1-et ír vissza – az egyik növelés elveszik. Ezt előzi meg a zár (mutex).

```python solution
def szimulal(utemezes):
    szamlalo = 0
    regiszter = {}                    # minden szál saját regisztere
    for szal, muvelet in utemezes:
        if muvelet == "olvas":
            regiszter[szal] = szamlalo
        else:                         # "ír"
            szamlalo = regiszter[szal] + 1
    return szamlalo
```

</details>

```python test
sorban = [("A", "olvas"), ("A", "ír"), ("B", "olvas"), ("B", "ír")]
osszefonva = [("A", "olvas"), ("B", "olvas"), ("A", "ír"), ("B", "ír")]
assert szimulal(sorban) == 2
assert szimulal(osszefonva) == 1      # elveszett egy növelés!
assert szimulal([]) == 0
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Melyiket NEM osztják meg egy folyamat szálai egymással?
- a kódot
- a globális változókat
- a nyitott fájlokat
+ a vermet (stack)
! Minden szálnak saját verme és regiszterei vannak.

? Mi történik a fork() hívás után?
+ a folyamat lemásolja magát; a szülő a gyermek PID-jét, a gyermek 0-t kap visszatérési értékként
- a folyamat leáll, és egy új program indul a helyén
- két szál jön létre ugyanabban a folyamatban
! A program cseréje az exec() dolga.

? Mi a zombi folyamat?
- egy vírus által megfertőzött folyamat
+ befejeződött folyamat, amelynek kilépési kódját a szülője még nem olvasta ki (wait)
- a CPU-t 100%-ig használó folyamat
! A ps STAT oszlopában Z betű jelzi.

? Melyik jel kéri udvariasan egy folyamat leállását (a folyamat elkaphatja és rendet rakhat)?
+ SIGTERM (15)
- SIGKILL (9)
- SIGSTOP (19)
! A SIGKILL-t nem lehet elkapni – azonnal leállít.

? Miért olcsóbb új szálat indítani, mint új folyamatot?
+ mert a szál a meglévő címteret használja, nem kell új memóriatérkép
- mert a szálak nem használnak memóriát
- mert a szálakat nem a kernel kezeli
! A szálak közötti váltás is olcsóbb emiatt.
```
