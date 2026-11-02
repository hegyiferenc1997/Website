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

| Forrás                          | Példa                                              |
| ------------------------------- | -------------------------------------------------- |
| félreértett követelmény         | „az átlag” – számtani vagy súlyozott?              |
| logikai hiba                    | `<` helyett `<=`                                   |
| nem kezelt határeset            | üres lista, 0, nagyon nagy szám                    |
| hibás feltételezés a bemenetről | a felhasználó szöveget ír szám helyett             |
| környezeti különbség            | más operációs rendszer, kódolás, időzóna           |
| módosítás mellékhatása          | egy javítás elront egy másik funkciót (regresszió) |

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

## A lecke feladata: Javítsd a bejelentett hibát

Hibajelentés érkezett a csapat hibakövetőjébe:

> **Cím:** Az `ido_formaz()` rossz szöveget ad kerek óráknál és 0 percnél
>
> **Lépések:** `ido_formaz(60)`, `ido_formaz(0)`, `ido_formaz(-5)`
>
> **Elvárt:** `"1 óra"`, `"0 perc"`, illetve `ValueError` negatív értékre
>
> **Tapasztalt:** `"1 óra 0 perc"`, `""` (üres szöveg), `"55 perc"`
>
> **Súlyosság:** közepes – a felhasználói felületen furcsa feliratok jelennek meg

Javítsd ki a függvényt úgy, hogy a jelentésben leírt elvárt viselkedést adja, és a többi eset (pl. `ido_formaz(125)` → `"2 óra 5 perc"`, `ido_formaz(59)` → `"59 perc"`) se romoljon el.

```python starter required
def ido_formaz(perc):
    ora = perc // 60
    maradek = perc % 60
    if ora > 0:
        return f"{ora} óra {maradek} perc"
    return f"{maradek} perc" if maradek else ""


for p in [125, 60, 0, 59]:
    print(p, "→", repr(ido_formaz(p)))
```

<details>
<summary>Megoldás</summary>

```python solution
def ido_formaz(perc):
    if perc < 0:
        raise ValueError("Az időtartam nem lehet negatív.")
    ora, maradek = divmod(perc, 60)
    reszek = []
    if ora > 0:
        reszek.append(f"{ora} óra")
    if maradek > 0 or ora == 0:
        reszek.append(f"{maradek} perc")
    return " ".join(reszek)


for p in [125, 60, 0, 59]:
    print(p, "→", repr(ido_formaz(p)))
```

</details>

```python test
assert ido_formaz(60) == "1 óra", "60 perc → \"1 óra\" (a hibajelentés 1. pontja)"
assert ido_formaz(0) == "0 perc", "0 perc → \"0 perc\" (a hibajelentés 2. pontja)"
try:
    ido_formaz(-5)
    assert False, "Negatív értékre ValueError kell (a hibajelentés 3. pontja)."
except ValueError:
    pass
assert ido_formaz(125) == "2 óra 5 perc", "125 perc → \"2 óra 5 perc\" – ez nem romolhat el!"
assert ido_formaz(59) == "59 perc", "59 perc → \"59 perc\""
assert ido_formaz(180) == "3 óra", "180 perc → \"3 óra\""
```
