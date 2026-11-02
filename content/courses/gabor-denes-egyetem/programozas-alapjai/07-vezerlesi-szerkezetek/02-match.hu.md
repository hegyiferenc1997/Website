---
title: Többirányú elágazás – switch és match
summary: A más nyelvekből ismert switch-case, és a Python 3.10 match utasítása mintaillesztéssel.
minutes: 12
---

## Amit ebben a leckében megtanulsz

- hogyan működik a **switch** utasítás C-ben, Javában, C#-ban,
- hogyan írod le ugyanezt Pythonban a **match** utasítással,
- mikor jobb a match, és mikor az if-elif.

## switch más nyelvekben

Sok nyelvben a **switch** egy változó értéke alapján választ ágat:

```java
// Java
switch (nap) {
    case 6:
    case 7:
        System.out.println("hétvége");
        break;          // break nélkül a következő ág is lefutna („átesés”)
    default:
        System.out.println("hétköznap");
}
```

> C-ben és Javában a `break` elhagyása klasszikus hiba: a végrehajtás „átesik” a következő `case`-re.

## match Pythonban (3.10+)

A Python a 3.10-es verzió óta a `match` utasítást kínálja. Nincs átesés, nem kell `break`.

```python run
def nap_neve(szam):
    match szam:
        case 1:
            return "hétfő"
        case 2:
            return "kedd"
        case 3:
            return "szerda"
        case 4:
            return "csütörtök"
        case 5:
            return "péntek"
        case 6 | 7:              # több érték: | jellel
            return "hétvége"
        case _:                  # alapértelmezett ág (mint a default)
            return "érvénytelen nap"

for n in [1, 6, 9]:
    print(n, nap_neve(n))
```

## Feltétel az ágban (guard)

```python run
def ertekel(pont):
    match pont:
        case p if p >= 89:
            return "jeles"
        case p if p >= 50:
            return "megfelelt"
        case _:
            return "elégtelen"

print(ertekel(92), ertekel(60), ertekel(10))
```

## Mintaillesztés szerkezetekre

A `match` ennél többet tud: a **szerkezetet** is vizsgálja, és közben változókba bontja az adatot.

```python run
def parancs(utasitas):
    match utasitas.split():
        case ["elore", lepes]:
            return f"Előre {lepes} lépést."
        case ["fordul", ("balra" | "jobbra") as irany]:
            return f"Fordulás {irany}."
        case ["stop"]:
            return "Megállás."
        case _:
            return "Ismeretlen parancs."

for u in ["elore 3", "fordul balra", "stop", "ugrás"]:
    print(u, "→", parancs(u))
```

## Ha régebbi Pythonod van: szótár

3.10 előtt (és ma is, egyszerű leképezéseknél) a szótár jó alternatíva:

```python run
NAPOK = {1: "hétfő", 2: "kedd", 3: "szerda", 4: "csütörtök", 5: "péntek", 6: "szombat", 7: "vasárnap"}
print(NAPOK.get(3, "érvénytelen"))
print(NAPOK.get(9, "érvénytelen"))
```

## Mikor melyiket?

| Helyzet                                    | Javasolt            |
| ------------------------------------------ | ------------------- |
| egy érték összevetése sok konkrét értékkel | `match` vagy szótár |
| tartományok, összetett feltételek          | `if-elif-else`      |
| adatszerkezet alakja szerinti döntés       | `match`             |

## Összefoglalás

- A **switch** (C, Java, C#) érték szerint választ ágat; vigyázz a `break`-re.
- Pythonban a **match-case** (3.10+) a megfelelője; `|` több érték, `_` az alapértelmezett ág, `if` a feltétel.
- Egyszerű leképezésnél a **szótár** is jó megoldás.

## A lecke feladata: Robotparancsok mintaillesztéssel

Írj `ertelmez(parancs)` függvényt, amely egy szöveges robotparancsot a `match` utasítással értelmez. A parancsot szóközök mentén darabold (`split()`), és a kapott listára illessz mintákat:

| Parancs          | Eredmény                       |
| ---------------- | ------------------------------ |
| `"előre 3"`      | `("mozog", 3)` – a szám egészként |
| `"fordulj balra"`| `("fordul", "bal")`            |
| `"fordulj jobbra"`| `("fordul", "jobb")`          |
| `"állj"`         | `("áll", None)`                |
| bármi más        | `("ismeretlen", parancs)`      |

```python starter required
def ertelmez(parancs):
    match parancs.split():
        case ["állj"]:
            return ("áll", None)
        # további esetek: ["előre", lepes], ["fordulj", "balra"], ...
        case _:
            return ("ismeretlen", parancs)


print(ertelmez("előre 3"))   # ('mozog', 3)
```

<details>
<summary>Megoldás</summary>

```python solution
def ertelmez(parancs):
    match parancs.split():
        case ["állj"]:
            return ("áll", None)
        case ["előre", lepes] if lepes.isdigit():
            return ("mozog", int(lepes))
        case ["fordulj", "balra"]:
            return ("fordul", "bal")
        case ["fordulj", "jobbra"]:
            return ("fordul", "jobb")
        case _:
            return ("ismeretlen", parancs)


print(ertelmez("előre 3"))   # ('mozog', 3)
```

</details>

```python test
assert ertelmez("előre 3") == ("mozog", 3), "\"előre 3\" → (\"mozog\", 3) – a szám egész legyen!"
assert ertelmez("előre 12") == ("mozog", 12), "\"előre 12\" → (\"mozog\", 12)"
assert ertelmez("fordulj balra") == ("fordul", "bal"), "\"fordulj balra\" → (\"fordul\", \"bal\")"
assert ertelmez("fordulj jobbra") == ("fordul", "jobb"), "\"fordulj jobbra\" → (\"fordul\", \"jobb\")"
assert ertelmez("állj") == ("áll", None), "\"állj\" → (\"áll\", None)"
assert ertelmez("ugorj") == ("ismeretlen", "ugorj"), "Ismeretlen parancs."
assert ertelmez("előre sok") == ("ismeretlen", "előre sok"), "Ha az előre után nem szám áll, ismeretlen."
```
