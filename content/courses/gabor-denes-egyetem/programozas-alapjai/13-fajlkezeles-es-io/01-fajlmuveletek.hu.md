---
title: Fájlkezelési műveletek
summary: Megnyitás, olvasás, írás, zárás – megnyitási módok, karakterkódolás és a with utasítás.
minutes: 18
---

## Amit ebben a leckében megtanulsz

- a fájlkezelés négy lépését: **megnyitás, olvasás/írás, zárás**,
- a **megnyitási módokat** (`r`, `w`, `a`, `x`, `b`),
- miért fontos a **karakterkódolás** (`utf-8`),
- miért használjuk a `with` utasítást.

## Miért kellenek fájlok?

A változók a **memóriában** élnek, és a program végén elvesznek. Ha az adatot meg akarjuk őrizni (beállítások, eredmények, naplók), **fájlba** kell írni, ami a háttértáron (SSD, merevlemez) marad meg.

## A négy lépés

```python run
# 1. megnyitás írásra
f = open("jegyzet.txt", "w", encoding="utf-8")
# 2. írás
f.write("Első sor\n")
f.write("Második sor\n")
# 3. bezárás – enélkül az adat egy része a pufferben maradhat!
f.close()

# 1. megnyitás olvasásra, 2. olvasás, 3. bezárás
f = open("jegyzet.txt", "r", encoding="utf-8")
tartalom = f.read()
f.close()
print(tartalom)
```

## A with utasítás

A `with` blokk végén a fájl **automatikusan bezáródik** – akkor is, ha közben kivétel történt. Mindig ezt használd!

```python run
with open("jegyzet.txt", "w", encoding="utf-8") as f:
    f.write("alma\nkörte\nszilva\n")
# itt a fájl már be van zárva

with open("jegyzet.txt", encoding="utf-8") as f:
    print(f.read())
```

## Megnyitási módok

| Mód                        | Jelentés                  | Ha nem létezik      | Ha létezik               |
| -------------------------- | ------------------------- | ------------------- | ------------------------ |
| `"r"`                      | olvasás (alapértelmezett) | `FileNotFoundError` | olvassa                  |
| `"w"`                      | írás                      | létrehozza          | **kiüríti** (felülírja)! |
| `"a"`                      | hozzáfűzés a végére       | létrehozza          | a végére ír              |
| `"x"`                      | kizárólagos létrehozás    | létrehozza          | `FileExistsError`        |
| `"r+"`                     | olvasás és írás           | `FileNotFoundError` | olvassa/írja             |
| `"b"` (pl. `"rb"`, `"wb"`) | bináris mód (képek, zip)  |                     |                          |

```python run
with open("naplo.txt", "w", encoding="utf-8") as f:
    f.write("1. bejegyzés\n")

with open("naplo.txt", "a", encoding="utf-8") as f:   # hozzáfűzés: a régi tartalom megmarad
    f.write("2. bejegyzés\n")

with open("naplo.txt", encoding="utf-8") as f:
    print(f.read())
```

## Olvasási módszerek

```python run
with open("gyumolcs.txt", "w", encoding="utf-8") as f:
    f.write("alma\nkörte\nszilva\n")

with open("gyumolcs.txt", encoding="utf-8") as f:
    print(repr(f.read()))           # az egész fájl egy szövegként

with open("gyumolcs.txt", encoding="utf-8") as f:
    print(f.readline().strip())     # egy sor
    print(f.readlines())            # a maradék sorok listaként

# A legjobb módszer: soronkénti bejárás – nagy fájlnál sem tölti be az egészet a memóriába.
with open("gyumolcs.txt", encoding="utf-8") as f:
    for sorszam, sor in enumerate(f, start=1):
        print(sorszam, sor.rstrip("\n"))
```

> A beolvasott sorok végén ott van a `\n` sortörés. A `strip()` vagy `rstrip("\n")` levágja.

## Írási módszerek

```python run
sorok = ["első", "második", "harmadik"]
with open("ki.txt", "w", encoding="utf-8") as f:
    for s in sorok:
        f.write(s + "\n")               # a write nem tesz sortörést magától!
    f.writelines(["negyedik\n", "ötödik\n"])
    print("hatodik", file=f)            # a print is írhat fájlba

with open("ki.txt", encoding="utf-8") as f:
    print(f.read())
```

## Karakterkódolás

A fájl bájtokat tárol; a **kódolás** mondja meg, melyik bájtsorozat melyik karakter. Az ékezetes betűk miatt **mindig add meg** az `encoding="utf-8"` paramétert! Enélkül Windowson a régi, helyi kódolás (pl. cp1250) lehet az alapértelmezett, és az „ő”, „ű” betűk elromolhatnak más gépen.

```python run
szoveg = "Árvíztűrő tükörfúrógép"
print(szoveg.encode("utf-8"))       # bájtok UTF-8-ban
print(len(szoveg), len(szoveg.encode("utf-8")))   # 22 karakter, de több bájt
```

## Bináris fájlok

Képeket, hangot, tömörített fájlokat **bináris módban** kezelünk; ilyenkor `bytes` típusú adatot olvasunk és írunk, kódolás nélkül.

```python run
with open("adat.bin", "wb") as f:
    f.write(bytes([0, 1, 2, 255]))

with open("adat.bin", "rb") as f:
    adat = f.read()
print(adat, list(adat))
```

## Összefoglalás

- Lépések: **megnyitás → olvasás/írás → zárás**; a `with` automatikusan zár.
- Módok: `r` olvasás, `w` felülírás, `a` hozzáfűzés, `x` új fájl, `b` bináris.
- Olvasás soronként: `for sor in f:`; írás: `write()` (sortörést te adod hozzá), `print(..., file=f)`.
- Szöveges fájlnál mindig: `encoding="utf-8"`.
