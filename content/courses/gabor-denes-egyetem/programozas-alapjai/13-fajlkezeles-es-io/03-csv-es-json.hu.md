---
title: CSV és JSON fájlok
summary: Táblázatos adatok (CSV) és strukturált adatok (JSON) olvasása és írása a beépített modulokkal.
minutes: 15
---

## Amit ebben a leckében megtanulsz

- mi a **CSV** és a **JSON** formátum,
- hogyan olvasod és írod őket a `csv` és `json` modullal,
- mikor melyiket érdemes használni.

## CSV – vesszővel elválasztott értékek

A **CSV** (*Comma-Separated Values*) egyszerű szöveges táblázat: soronként egy rekord, a mezőket elválasztó jel (vessző vagy pontosvessző) választja el. Excel is meg tudja nyitni.

```text
nev,neptun,pont
Kiss Anna,ABC123,92
Nagy Béla,XYZ789,61
```

### CSV írása

```python run
import csv

hallgatok = [
    ["nev", "neptun", "pont"],
    ["Kiss Anna", "ABC123", 92],
    ["Nagy Béla", "XYZ789", 61],
    ["Szabó, Csilla", "QWE456", 78],     # a vessző a névben: a csv modul idézőjelezi
]
with open("hallgatok.csv", "w", newline="", encoding="utf-8") as f:
    csv.writer(f).writerows(hallgatok)

print(open("hallgatok.csv", encoding="utf-8").read())
```

> CSV írásakor add meg a `newline=""` paramétert, különben Windowson üres sorok jelenhetnek meg a sorok között.

### CSV olvasása

```python run
import csv

# Egy kis próbafájl, hogy a példa önmagában is futtatható legyen.
with open("hallgatok.csv", "w", newline="", encoding="utf-8") as f:
    f.write('nev,neptun,pont\nKiss Anna,ABC123,92\n"Szabó, Csilla",QWE456,78\n')

with open("hallgatok.csv", newline="", encoding="utf-8") as f:
    olvaso = csv.DictReader(f)          # az első sor a fejléc → minden sor szótár lesz
    for sor in olvaso:
        print(sor["nev"], int(sor["pont"]))   # minden érték szövegként jön!
```

Miért ne `split(",")`-tel? Mert a mezőkben is lehet vessző vagy idézőjel (pl. `"Szabó, Csilla"`), amit a `csv` modul helyesen kezel.

## JSON – strukturált adatok

A **JSON** (*JavaScript Object Notation*) egymásba ágyazott adatokat (objektumok, listák) ír le olvasható szövegként. A webes API-k és a konfigurációs fájlok szabványos formátuma.

| JSON | Python |
| --- | --- |
| objektum `{}` | `dict` |
| tömb `[]` | `list` |
| szöveg `"..."` | `str` |
| szám | `int`, `float` |
| `true`, `false` | `True`, `False` |
| `null` | `None` |

### JSON írása és olvasása

```python run
import json

kurzus = {
    "nev": "Programozási alapok",
    "kredit": 8,
    "aktiv": True,
    "hallgatok": [{"nev": "Anna", "pont": 92}, {"nev": "Béla", "pont": 61}],
}

with open("kurzus.json", "w", encoding="utf-8") as f:
    json.dump(kurzus, f, ensure_ascii=False, indent=2)   # ékezetek megtartása, szép behúzás

with open("kurzus.json", encoding="utf-8") as f:
    betoltott = json.load(f)

print(betoltott["hallgatok"][0]["nev"])
print(betoltott == kurzus)   # True – ugyanaz az adat
```

### Szöveg ↔ JSON

```python run
import json

szoveg = '{"homerseklet": 21.5, "napos": true, "varos": null}'
adat = json.loads(szoveg)      # szövegből Python objektum
print(adat, type(adat))
print(json.dumps(adat))        # Python objektumból szöveg
```

## CSV vagy JSON?

| Szempont | CSV | JSON |
| --- | --- | --- |
| szerkezet | lapos táblázat | egymásba ágyazott |
| típusok | minden szöveg | szám, logikai, null, lista, objektum |
| megnyitható | Excel, táblázatkezelők | szövegszerkesztő, böngésző |
| tipikus használat | adatexport, mérési adatok | API-k, beállítások, mentett állapot |

## Összefoglalás

- **CSV**: táblázat soronként; `csv.writer` / `csv.DictReader`, `newline=""`.
- **JSON**: egymásba ágyazott adat; `json.dump` / `json.load` fájlhoz, `dumps` / `loads` szöveghez.
- Ne darabold kézzel `split(",")`-tel – használd a modulokat.
