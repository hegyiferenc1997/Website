---
title: Hibák előfordulása és kezelése
summary: Hogyan kerülnek hibák a programba, hogyan jelentjük és követjük őket, és hogyan előzhetők meg.
minutes: 12
---

## Amit ebben a leckében megtanulsz

- honnan erednek a **szoftverhibák**,
- mi a **hibajegy**, és mi a hibák **életciklusa**,
- hogyan írsz jó **hibajelentést**,
- milyen módszerek **előzik meg** a hibákat.

## Hiba, hibás működés, meghibásodás

A szakirodalom (pl. az ISTQB tesztelési szabvány) megkülönbözteti:

- **tévedés** (error, mistake) – az ember hibája: félreértett követelmény, elgépelés,
- **hiba** (defect, bug) – a tévedés nyoma a kódban,
- **meghibásodás** (failure) – amikor a hibás kód lefut, és a program rosszul működik.

Egy hiba évekig lappanghat a kódban, ha az a sor sosem fut le (pl. csak szökőnapon).

## Honnan jönnek a hibák?

| Forrás | Példa |
| --- | --- |
| félreértett követelmény | „az átlag” – számtani vagy súlyozott? |
| logikai hiba | `<` helyett `<=` |
| nem kezelt határeset | üres lista, 0, nagyon nagy szám |
| hibás feltételezés a bemenetről | a felhasználó szöveget ír szám helyett |
| környezeti különbség | más operációs rendszer, kódolás, időzóna |
| módosítás mellékhatása | egy javítás elront egy másik funkciót (regresszió) |

> Híres példa: az **Ariane 5** rakéta 1996-ban az első útján felrobbant, mert egy 64 bites valós számot 16 bites egésszé alakítottak, ami túlcsordult. A kód a korábbi, lassabb Ariane 4-ből származott, ahol ez az érték sosem lett ekkora.

## A hibák életciklusa

A csapatok a hibákat **hibakövető rendszerben** tartják nyilván (GitHub Issues, Jira):

```text
Új → Hozzárendelve → Javítás alatt → Javítva → Ellenőrizve → Lezárva
                                         ↓
                                 Újranyitva (ha mégsem jó)
```

Minden hibajegynek van **súlyossága** (mennyire nagy a baj) és **prioritása** (mennyire sürgős a javítás).

## Jó hibajelentés

Egy hibajelentésből a fejlesztőnek reprodukálnia kell tudni a hibát. Tartalmazza:

1. **Rövid, pontos cím:** „Az átlagszámítás összeomlik üres jegylistánál” (nem: „Nem működik”).
2. **Lépések a reprodukáláshoz:** 1., 2., 3.
3. **Elvárt viselkedés:** mit kellett volna történnie.
4. **Tényleges viselkedés:** mi történt – a teljes hibaüzenettel.
5. **Környezet:** operációs rendszer, Python verzió, böngésző.

## Hogyan előzzük meg a hibákat?

- **Tesztek** – minden új funkcióhoz és minden javított hibához (regressziós teszt).
- **Kódáttekintés** (code review) – egy másik ember is átnézi a változtatást.
- **Statikus elemzés** – eszközök, amelyek futtatás nélkül keresnek hibákat: `ruff`, `pylint`, `mypy`.
- **Defenzív programozás** – bemenet ellenőrzése, határesetek kezelése, egyértelmű hibaüzenetek.
- **Folyamatos integráció (CI)** – minden módosításnál automatikusan lefutnak a tesztek.
- **Kis lépések** – kis, jól tesztelt változtatások, gyakori mentés verziókezelőbe (git).

```python run
# Defenzív programozás: a függvény ellenőrzi a bemenetét, és egyértelműen jelez.
def kredit_atlag(jegyek, kreditek):
    if len(jegyek) != len(kreditek):
        raise ValueError("A jegyek és kreditek száma eltér.")
    if not jegyek:
        raise ValueError("Nincs egyetlen jegy sem.")
    if any(not 1 <= j <= 5 for j in jegyek):
        raise ValueError("A jegyeknek 1 és 5 között kell lenniük.")
    return sum(j * k for j, k in zip(jegyek, kreditek)) / sum(kreditek)

print(round(kredit_atlag([5, 4, 3], [8, 5, 3]), 2))
```

## Összefoglalás

- Tévedés → hiba a kódban → meghibásodás futás közben.
- A hibákat hibakövető rendszerben tartjuk nyilván; a jó jelentés reprodukálható.
- Megelőzés: tesztek, kódáttekintés, statikus elemzés, defenzív programozás, CI.
