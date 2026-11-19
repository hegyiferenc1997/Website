---
title: Mélyebben – vezérlés a gyakorlatban
summary: Mikor while és mikor for, egy parancsértelmező match-csel, a beágyazott ciklusok ára (lépésszám-ábrával) és a gyorsabb halmazos megoldás, a for–else keresés, és több programozási tétel egyetlen bejárással – futtatható programokkal és programozós kötelező feladattal.
minutes: 50
---

## Amit ebben a leckében megtanulsz

- mikor válassz **while** és mikor **for** ciklust,
- hogyan írj kis **parancsértelmezőt** a `match` utasítással,
- miért lassú a **beágyazott ciklus** nagy adatnál, és hogyan lehet elkerülni,
- hogyan végezz el **több programozási tételt** egyetlen bejárással, és mire jó a `for–else`.

## 1. While vagy for?

Az alapleckékben láttuk mindkét ciklust. A szabály egyszerű: a **for** akkor jó, ha előre tudjuk, min megyünk végig (egy lista elemein, 1-től 10-ig); a **while** akkor, ha csak a **leállási feltételt** ismerjük, azt nem, hányszor fut le. Hány év alatt duplázódik meg a pénzünk?

```python run
# While: nem tudjuk előre, hányszor fut le – csak azt, mikor álljon meg
def duplazodas(kamat_szazalek):
    osszeg, ev = 1.0, 0
    while osszeg < 2:
        osszeg *= 1 + kamat_szazalek / 100
        ev += 1
    return ev

for kamat in [2, 4, 6, 9, 12]:
    print(f"{kamat:>2}% kamatnál {duplazodas(kamat):>2} év alatt duplázódik (72-es szabály: kb. {72 / kamat:.0f})")
```

A „72-es szabály” (72 osztva a kamattal) jó fejszámolós becslés, a ciklus pedig pontosan kiszámolja. A `while` veszélye a **végtelen ciklus**: ha a feltétel sosem lesz hamis (pl. 0% kamatnál), a program sosem áll meg. Ezért mindig gondold végig: biztosan közeledik-e a ciklus a leálláshoz? Ha nem biztos, tegyél bele egy maximális lépésszámot is.

## 2. Parancsértelmező match-csel

A `match` (Python 3.10 óta) nemcsak értékeket hasonlít össze, hanem **mintákat** is felismer: szét tudja szedni a bemenetet részekre. Egy kis raktárkezelő parancsai:

```python run
# Parancsértelmező: a match a parancs szerkezetét is felismeri
keszlet = {"alma": 10}

def parancs(sor):
    match sor.split():
        case ["listaz"]:
            return ", ".join(f"{k}: {v}" for k, v in keszlet.items())
        case ["hozzaad", nev, db] if db.isdigit():          # minta + feltétel (guard)
            keszlet[nev] = keszlet.get(nev, 0) + int(db)
            return f"+{db} {nev}"
        case ["elvesz", nev, db] if db.isdigit() and keszlet.get(nev, 0) >= int(db):
            keszlet[nev] -= int(db)
            return f"-{db} {nev}"
        case ["elvesz", nev, _]:
            return f"nincs elég {nev}"
        case []:
            return "üres parancs"
        case _:
            return f"ismeretlen parancs: {sor}"

for sor in ["hozzaad korte 5", "elvesz alma 3", "elvesz korte 9", "listaz", "", "torol mindent"]:
    print(f"{sor!r:20} → {parancs(sor)}")
```

A `case ["hozzaad", nev, db]` egyszerre ellenőrzi, hogy három szó jött-e, az első `"hozzaad"`-e, és **változókba** is teszi a másik kettőt. Az `if` utáni rész (**guard**) további feltételt ad. Ugyanez `if–elif` láncokkal jóval hosszabb és nehezebben olvasható lenne. A sorrend számít: az első illeszkedő `case` nyer, ezért az általános `_` (bármi) mindig a végére kerül.

## 3. Beágyazott ciklusok ára

Feladat: van-e a listában két szám, amelynek összege pontosan egy adott érték (pl. két termék, amely együtt pont kimeríti a keretet)? A kézenfekvő megoldás két egymásba ágyazott ciklus – minden párt kipróbálunk:

```plot
title: Lépésszám n elemű listánál
x: 0, 1000
y: 0, 50000
f: x*(x - 1)/2 # beágyazott ciklus: minden pár
f: x # egy bejárás halmazzal
```

```python run
# Pár keresése adott összeggel: beágyazott ciklus kontra egy bejárás halmazzal
def par_lassu(szamok, cel):
    lepes = 0
    for i in range(len(szamok)):
        for j in range(i + 1, len(szamok)):     # minden párt kipróbálunk
            lepes += 1
            if szamok[i] + szamok[j] == cel:
                return (szamok[i], szamok[j]), lepes
    return None, lepes

def par_gyors(szamok, cel):
    latott, lepes = set(), 0
    for x in szamok:
        lepes += 1
        if cel - x in latott:                    # láttuk már a "párját"?
            return (cel - x, x), lepes
        latott.add(x)
    return None, lepes

szamok = list(range(1, 2001))
print("lassú:", par_lassu(szamok, 3999))
print("gyors:", par_gyors(szamok, 3999))
```

2000 elemnél a beágyazott ciklus majdnem **kétmillió** párt próbál végig, a halmazos megoldás kétezer lépésből megvan. A trükk: a halmazban a „benne van-e?” kérdés egyetlen lépés (erről az Adatszerkezetek témakörben lesz szó). Beágyazott ciklusra persze sokszor szükség van (pl. táblázat sorai és oszlopai), de ha nagy adaton fut, mindig érdemes megkérdezni: kell-e tényleg minden párt megnézni?

## 4. Több tétel egy bejárással, és a for–else

Az alapleckében egyenként láttuk a programozási tételeket (összegzés, megszámlálás, maximumkeresés, eldöntés, kiválogatás). Nagy adatnál – pl. egy fájl, amit csak egyszer akarunk végigolvasni – egyetlen ciklusban is elvégezhetjük mindet:

```python run
# Öt programozási tétel egyetlen bejárással, és keresés for–else-szel
homersekletek = [12.5, 14.0, 9.5, 17.5, 21.0, 19.5, 8.0]

osszeg, meleg_db, maximum, max_nap, hideg_napok = 0, 0, None, None, []
for nap, t in enumerate(homersekletek, start=1):
    osszeg += t                                  # összegzés
    if t > 15:
        meleg_db += 1                            # megszámlálás
    if maximum is None or t > maximum:
        maximum, max_nap = t, nap                # maximumkiválasztás
    if t < 10:
        hideg_napok.append(nap)                  # kiválogatás
print(f"átlag {osszeg / len(homersekletek):.1f} °C, {meleg_db} meleg nap, max {maximum} °C a(z) {max_nap}. napon, hideg napok: {hideg_napok}")

# keresés: a for–else "else" ága akkor fut le, ha a ciklus NEM break-kel ért véget
for nap, t in enumerate(homersekletek, start=1):
    if t >= 25:
        print("az első nyári nap:", nap)
        break
else:
    print("nem volt 25 °C feletti nap")
```

A `for–else` sokaknak szokatlan, de a keresésnél pont erre van szükség: az `else` ág a „nem találtuk” eset, és nem kell külön `talalt = False` jelzőváltozó.

| Nézőpont        | Mire figyel a vezérlési szerkezeteknél?                                      |
| --------------- | ---------------------------------------------------------------------------- |
| **programozó**  | a feladathoz illő szerkezet: for ismert bejárásra, while leállási feltételre |
| **olvasó**      | kevés beágyazási szint; a mély `if`-tornyokat érdemes függvényekre bontani   |
| **tesztelő**    | a határesetek: üres lista, egyetlen elem, a feltétel pont a határon          |
| **felhasználó** | a program ne fagyjon le (végtelen ciklus), és nagy adatnál se legyen lassú   |

## Összefoglalás

- For: ha tudjuk, min megyünk végig; while: ha csak a leállási feltételt ismerjük – vigyázz a végtelen ciklusra.
- A `match` mintákat ismer fel és szed szét; az első illeszkedő `case` nyer, a `_` a végére kerül.
- A beágyazott ciklus lépésszáma négyzetesen nő; sokszor egy halmazzal egy bejárás is elég.
- Több tétel elvégezhető egyetlen bejárással; a `for–else` `else` ága a „nem találtuk” eset.

## A lecke feladata: a Collatz-sorozat

A Collatz-sorozatban egy pozitív egész számból indulunk: ha páros, elosztjuk 2-vel, ha páratlan, megszorozzuk 3-mal és hozzáadunk 1-et. A sejtés szerint minden számból előbb-utóbb az 1-hez érünk – ezt máig senki nem bizonyította, de minden kipróbált számra igaz. Írd meg a `collatz_lepesek(n)` függvényt, amely megadja, hány lépés alatt jut el `n` az 1-ig! (Az 1-ből 0 lépés kell.) Ez tipikus `while`-feladat: nem tudjuk előre, hányszor fut le.

```python starter required
def collatz_lepesek(n):
    lepes = 0
    # amíg n nem 1: páros → n // 2, páratlan → 3 * n + 1, és számold a lépéseket
    return lepes


print(collatz_lepesek(6))
```

<details>
<summary>Megoldás</summary>

```python solution
def collatz_lepesek(n):
    lepes = 0
    while n != 1:
        if n % 2 == 0:
            n = n // 2
        else:
            n = 3 * n + 1
        lepes += 1
    return lepes


print(collatz_lepesek(6))
```

</details>

```python test
assert collatz_lepesek(1) == 0, "az 1-ből 0 lépés"
assert collatz_lepesek(6) == 8, "6 → 3 → 10 → 5 → 16 → 8 → 4 → 2 → 1: 8 lépés"
assert collatz_lepesek(7) == 16, "a 7-ből 16 lépés"
assert collatz_lepesek(27) == 111, "a 27-ből 111 lépés"
```
