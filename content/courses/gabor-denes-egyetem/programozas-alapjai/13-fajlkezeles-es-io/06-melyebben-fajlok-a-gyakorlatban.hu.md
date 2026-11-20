---
title: Mélyebben – fájlok a gyakorlatban
summary: Szöveges és bináris fájlok, kódolás és bájtméret, miért nem jó a split(",") CSV-re és mit tud a csv modul, beágyazott adatok mentése JSON-ba, nagy fájlok soronkénti feldolgozása, és a biztonságos (atomi) mentés – futtatható programokkal és programozós kötelező feladattal.
minutes: 50
---

## Amit ebben a leckében megtanulsz

- mi a különbség a **szöveges** és a **bináris** fájl között, és miért számít a **kódolás**,
- miért ad hibás eredményt a `split(",")` egy valódi CSV-fájlon, és hogyan kezeli ezt a `csv` modul,
- hogyan ments és tölts vissza **beágyazott** adatokat JSON-ban,
- hogyan dolgozz fel **nagy** fájlokat kevés memóriával, és hogyan ments **biztonságosan**.

## 1. Szöveg, bájtok, kódolás

Az alapleckében láttuk, hogyan nyitunk meg, olvasunk és írunk fájlt. A háttérben a fájl mindig **bájtok** sorozata; szöveges módban (`"r"`, `"w"`) a Python a megadott **kódolással** alakítja át a bájtokat karakterekké:

```python run
# Szöveges és bináris írás-olvasás, és a kódolás hatása a fájlméretre
import os

szoveg = "Árvíztűrő tükörfúrógép\n"
for kodolas in ["utf-8", "utf-16", "cp1250"]:
    with open(f"minta_{kodolas}.txt", "w", encoding=kodolas) as f:
        f.write(szoveg)
    print(f"{kodolas:>7}: {os.path.getsize(f'minta_{kodolas}.txt'):>3} bájt")

with open("minta_utf-8.txt", "rb") as f:          # bináris mód: a nyers bájtokat kapjuk
    print("első 8 bájt:", f.read(8))

# rossz kódolással olvasva:
with open("minta_cp1250.txt", encoding="utf-8", errors="replace") as f:
    print("cp1250-et utf-8-ként olvasva:", f.read().strip())
```

Ugyanaz a 23 karakteres (sortöréssel együtt) szöveg háromféle kódolással háromféle méretű fájl lesz. A régi Windows-os magyar kódolás (cp1250) egy bájtot használ betűnként, de csak a közép-európai betűket ismeri; az UTF-8 minden nyelv minden betűjét tudja. Ha rossz kódolással olvasunk, a „�” cserekarakterek jelzik a bajt. **Mindig add meg** az `encoding="utf-8"` paramétert – különben a gép alapbeállítása dönt, ami Windowson és Linuxon eltérhet.

## 2. CSV: miért nem elég a split?

A CSV (vesszővel elválasztott értékek) egyszerűnek tűnik, de egy mezőben is lehet vessző – ilyenkor a mezőt idézőjelek közé teszik. A `split(",")` ezt nem érti, a `csv` modul igen:

```python run
# CSV olvasása: a split(",") elrontja az idézőjeles mezőt, a csv modul nem
import csv

with open("termekek.csv", "w", encoding="utf-8", newline="") as f:
    iro = csv.writer(f)
    iro.writerow(["név", "ár", "leírás"])
    iro.writerow(["toll", 250, "kék"])
    iro.writerow(["füzet", 690, "A4, kockás, 80 lapos"])   # vesszők a mezőben!

with open("termekek.csv", encoding="utf-8") as f:
    print("a fájl tartalma:")
    print(f.read())

with open("termekek.csv", encoding="utf-8") as f:
    for sor in f:
        print("split:  ", sor.strip().split(","))

with open("termekek.csv", encoding="utf-8", newline="") as f:
    for rekord in csv.DictReader(f):               # minden sor egy szótár a fejléc alapján
        print("csv:    ", rekord)
```

A `csv.writer` automatikusan idézőjelbe tette a vesszős mezőt, a `DictReader` pedig helyesen, három mezőre bontotta – és rögtön a fejléc szerinti szótárt adta. A `split` öt darabra vágta a sort. A `newline=""` paraméter a `csv` modul kérése: így a sortöréseket ő kezeli, és Windowson nem keletkeznek üres sorok.

## 3. JSON: beágyazott adatok

A CSV táblázatos adatra jó; ha az adat **beágyazott** (listák a szótárban, szótárak a listában), a JSON a szokásos formátum. A webes API-k és a beállítófájlok nagy része is JSON:

```python run
# Beágyazott adat mentése JSON-ba és visszatöltése
import json

orarend = {
    "hallgato": "Kiss Anna",
    "felev": 1,
    "targyak": [
        {"nev": "Matematika", "kredit": 6, "napok": ["hétfő", "szerda"]},
        {"nev": "Programozási alapok", "kredit": 8, "napok": ["kedd"]},
    ],
}

with open("orarend.json", "w", encoding="utf-8") as f:
    json.dump(orarend, f, ensure_ascii=False, indent=2)   # olvasható, ékezetes kimenet

with open("orarend.json", encoding="utf-8") as f:
    betoltve = json.load(f)

print(open("orarend.json", encoding="utf-8").read()[:120], "...")
print("visszatöltve ugyanaz?", betoltve == orarend)
print("összes kredit:", sum(t["kredit"] for t in betoltve["targyak"]))
print("ensure_ascii=True esetén:", json.dumps("Árvíztűrő"))
```

Az `ensure_ascii=False` megtartja az ékezeteket (alapból `Á` alakban escape-eli őket), az `indent=2` pedig behúzással, olvashatóan írja ki. Figyelem: a JSON nem ismer minden Python-típust – a tuple-ből lista lesz, a halmazt és a dátumot pedig magunknak kell szöveggé vagy listává alakítani.

## 4. Nagy fájlok és biztonságos mentés

Egy több gigabájtos naplófájlt nem érdemes egyben beolvasni (`f.read()`): elfogyhat a memória. A fájl objektum **soronként** is bejárható, így egyszerre csak egy sor van a memóriában. Mentéskor pedig az a veszély, hogy írás közben megszakad a program, és a régi fájl is elvész – ezért előbb egy ideiglenes fájlba írunk, és csak a végén **cseréljük** le az eredetit:

```python run
# Nagy fájl soronkénti feldolgozása generátorral, és atomi mentés os.replace-szel
import os

with open("naplo.txt", "w", encoding="utf-8") as f:            # egy "nagy" naplófájl előállítása
    for i in range(10_000):
        szint = "HIBA" if i % 97 == 0 else "INFO"
        f.write(f"{i} {szint} kérés feldolgozva\n")

def hibasorok(fajlnev):
    with open(fajlnev, encoding="utf-8") as f:
        for sor in f:                                         # egyszerre csak egy sor a memóriában
            if " HIBA " in sor:
                yield sor.split()[0]

hibak = list(hibasorok("naplo.txt"))
print(f"{len(hibak)} hibás sor, az első öt: {hibak[:5]}")

def biztonsagos_mentes(fajlnev, tartalom):
    ideiglenes = fajlnev + ".tmp"
    with open(ideiglenes, "w", encoding="utf-8") as f:
        f.write(tartalom)
        f.flush()
        os.fsync(f.fileno())                                  # tényleg kerüljön a lemezre
    os.replace(ideiglenes, fajlnev)                           # egyetlen lépésben cseréli le

biztonsagos_mentes("osszesito.txt", f"hibák száma: {len(hibak)}\n")
print(open("osszesito.txt", encoding="utf-8").read().strip())
```

Az `os.replace` az operációs rendszer szintjén **atomi**: vagy a régi, vagy az új fájl van ott, félig írt soha. A szövegszerkesztők és az adatbázisok is ezzel a trükkel védik az adatot áramszünet vagy összeomlás ellen.

| Nézőpont        | Mire figyel a fájlkezelésnél?                                                            |
| --------------- | ---------------------------------------------------------------------------------------- |
| **programozó**  | `with` és `encoding` mindig; CSV-hez `csv`, beágyazott adathoz `json` modul              |
| **felhasználó** | a mentett fájl ne sérüljön meg, és más programban (Excel, szerkesztő) is jól nyíljon meg |
| **üzemeltető**  | nagy fájlok soronként; a lemez ne teljen meg ideiglenes fájlokkal                        |
| **biztonság**   | a felhasználótól kapott fájlnévvel ne lehessen kilépni a mappából (`../../etc`)          |

## Összefoglalás

- A fájl bájtok sorozata; szöveges módban mindig add meg a kódolást (`encoding="utf-8"`).
- CSV-hez a `csv` modult használd: kezeli az idézőjeles, vesszős mezőket is.
- Beágyazott adathoz a JSON a szokásos; `ensure_ascii=False` és `indent` az olvashatósághoz.
- Nagy fájlt soronként dolgozz fel; mentéskor ideiglenes fájl + `os.replace` védi az adatot.

## A lecke feladata: kategóriánkénti összesítés CSV-ből

Írd meg a `kategoria_osszegek(fajlnev)` függvényt, amely beolvas egy UTF-8 kódolású CSV-fájlt, amelynek fejléce `kategoria,osszeg`, és egy szótárt ad vissza: kategória → az összegek összege (egész szám)! Használd a `csv.DictReader`-t – a kategória neve vesszőt is tartalmazhat (idézőjelek között).

```python starter required
import csv


def kategoria_osszegek(fajlnev):
    eredmeny = {}
    # nyisd meg a fájlt (encoding="utf-8", newline=""), és olvasd DictReaderrel
    return eredmeny


with open("kiadasok.csv", "w", encoding="utf-8", newline="") as f:
    f.write("kategoria,osszeg\nélelmiszer,3000\nutazás,1500\nélelmiszer,2500\n")
print(kategoria_osszegek("kiadasok.csv"))
```

<details>
<summary>Megoldás</summary>

```python solution
import csv


def kategoria_osszegek(fajlnev):
    eredmeny = {}
    with open(fajlnev, encoding="utf-8", newline="") as f:
        for sor in csv.DictReader(f):
            kat = sor["kategoria"]
            eredmeny[kat] = eredmeny.get(kat, 0) + int(sor["osszeg"])
    return eredmeny


with open("kiadasok.csv", "w", encoding="utf-8", newline="") as f:
    f.write("kategoria,osszeg\nélelmiszer,3000\nutazás,1500\nélelmiszer,2500\n")
print(kategoria_osszegek("kiadasok.csv"))
```

</details>

```python test
with open("teszt1.csv", "w", encoding="utf-8", newline="") as f:
    f.write("kategoria,osszeg\nélelmiszer,3000\nutazás,1500\nélelmiszer,2500\n")
assert kategoria_osszegek("teszt1.csv") == {"élelmiszer": 5500, "utazás": 1500}, "kategóriánként összeadva"
with open("teszt2.csv", "w", encoding="utf-8", newline="") as f:
    f.write('kategoria,osszeg\n"könyv, jegyzet",4000\nmozi,2000\n"könyv, jegyzet",1000\n')
assert kategoria_osszegek("teszt2.csv") == {"könyv, jegyzet": 5000, "mozi": 2000}, "az idézőjeles, vesszős kategória egy mező"
with open("teszt3.csv", "w", encoding="utf-8", newline="") as f:
    f.write("kategoria,osszeg\n")
assert kategoria_osszegek("teszt3.csv") == {}, "csak fejléc esetén üres szótár"
```
