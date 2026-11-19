---
title: Mélyebben – változók és kifejezések belülről
summary: A változó egy név, amely egy objektumra mutat – mi következik ebből listáknál és számoknál, a műveleti sorrend és a rövidzáras kiértékelés, az egész osztás negatív számokkal, a kamatos kamat kifejezése interaktív ábrán, és az f-stringek formázási trükkjei.
minutes: 50
---

## Amit ebben a leckében megtanulsz

- hogy a Pythonban a változó egy **név**, amely egy **objektumra** mutat – és miért fontos ez,
- hogyan értékel ki a gép egy bonyolult kifejezést (**műveleti sorrend**, **rövidzár**),
- hogyan viselkedik az egész osztás és a maradék **negatív** számokkal,
- hogyan **formázd** a kimenetet úgy, hogy táblázatszerű, olvasható legyen.

## 1. Név és objektum

Az alapleckében a változót egy „dobozként” képzeltük el, amibe értéket teszünk. Pythonban pontosabb a **címke** hasonlat: az objektum valahol a memóriában van, a változó pedig egy név, amely rá mutat. Ha két név ugyanarra a **módosítható** objektumra mutat, az egyiken keresztüli változás a másikon is látszik:

```python run
# A változó egy név, amely egy objektumra mutat
a = [1, 2, 3]
b = a                     # NEM másolat: b ugyanarra a listára mutat
b.append(4)
print("a =", a, "| b =", b, "| ugyanaz az objektum?", a is b)

c = a.copy()              # valódi másolat
c.append(5)
print("a =", a, "| c =", c, "| ugyanaz az objektum?", a is c)

# a szám nem módosítható: az "x += 1" egy ÚJ objektumra állítja át a nevet
x = 10
y = x
x += 1
print("x =", x, "| y =", y)
```

A lista **módosítható** (mutable), ezért a `b.append(4)` az „eredeti” listát is megváltoztatja. A szám, a szöveg és a tuple **nem módosítható** (immutable): az `x += 1` nem a 10-et írja át 11-re, hanem az `x` nevet egy új, 11 értékű objektumra állítja – az `y` marad 10. Ez a különbség a leggyakoribb kezdő hibák egyike.

## 2. Műveleti sorrend és rövidzár

A kifejezéseket a gép a **precedencia** szerint értékeli ki: hatványozás, előjel, szorzás/osztás, összeadás/kivonás, összehasonlítás, `not`, `and`, `or`. Néhány meglepő eset:

```python run
# Műveleti sorrend és rövidzáras kiértékelés
print("-2 ** 2     =", -2 ** 2, " ← előbb a hatvány, aztán az előjel")
print("(-2) ** 2   =", (-2) ** 2)
print("2 ** 3 ** 2 =", 2 ** 3 ** 2, " ← a hatvány jobbról balra köt: 2 ** 9")
print("10 - 4 - 3  =", 10 - 4 - 3, " ← a kivonás balról jobbra")

x = 7
print("1 < x < 10  =", 1 < x < 10, " ← láncolt összehasonlítás")

# rövidzár: ha az "and" bal oldala hamis, a jobb oldal LE SEM FUT
for oszto in [5, 0]:
    print(f"osztó = {oszto}:", oszto != 0 and 100 / oszto > 10)

def hangos(ertek):
    print("   (kiértékelve:", ertek, ")")
    return ertek
print("eredmény:", hangos(True) or hangos(False))
```

A **rövidzár** azt jelenti: az `and` megáll az első hamisnál, az `or` az első igaznál. Ezért nem ad nullával osztás hibát az `oszto != 0 and 100 / oszto > 10` – nulla osztónál a jobb oldal le sem fut. A `hangos` példa megmutatja: az `or` jobb oldala nem is értékelődött ki. Ha bizonytalan vagy a sorrendben, **tegyél zárójelet** – az olvasónak is segít.

## 3. Egész osztás és maradék negatív számokkal

A `//` (egész osztás) Pythonban mindig **lefelé** kerekít (a mínusz végtelen felé), a `%` (maradék) pedig az osztóval azonos előjelű. Ezt ki is használhatjuk, pl. a hét napjainak körbeforgatására:

```python run
# Egész osztás és maradék, negatív számokkal is
for a, b in [(7, 2), (-7, 2), (7, -2)]:
    print(f"{a:>3} // {b:>2} = {a // b:>3}   {a:>3} % {b:>2} = {a % b:>3}   ellenőrzés: {(a // b) * b + a % b}")

# alkalmazás: a hét napjai körbeforognak, visszafelé is
napok = ["hétfő", "kedd", "szerda", "csütörtök", "péntek", "szombat", "vasárnap"]
ma = 2                                          # szerda
for eltolas in [1, 5, -3, 100]:
    print(f"ma + {eltolas:>3} nap: {napok[(ma + eltolas) % 7]}")
```

Mindig igaz, hogy `(a // b) * b + a % b == a`. A `% 7` azért kényelmes, mert negatív eltolásnál is 0 és 6 közötti indexet ad – a C és a Java viszont ilyenkor **negatív** maradékot ad, ezért ott külön figyelni kell rá.

## 4. Egy kifejezés, ami pénzt ér: a kamatos kamat

A kifejezések nemcsak a programban, hanem a döntésekben is számítanak. A kamatos kamat képlete $V = T \cdot (1 + r/100)^n$, ahol $T$ a tőke, $r$ az éves kamat százalékban, $n$ az évek száma. Állítsd a csúszkát!

```plot
title: 100 000 Ft értéke n év múlva, r% éves kamattal
x: 0, 30
y: 0, 600000
param: r = 5, 0, 12, 0.5
f: 100000*(1 + r/100)^x # kamatos kamat
f: 100000*(1 + r*x/100) # egyszerű kamat (csak a tőke kamatozik)
```

```python run
# Kamatos kamat táblázatosan, f-string formázással
TOKE = 100_000                  # konstans: nagybetűs név jelzi, hogy nem változtatjuk
KAMAT = 5                       # % / év
print(f"{'év':>3} | {'egyszerű':>10} | {'kamatos':>10}")
print("-" * 30)
for ev in [0, 5, 10, 20, 30]:
    egyszeru = TOKE * (1 + KAMAT * ev / 100)
    kamatos = TOKE * (1 + KAMAT / 100) ** ev
    ft = lambda x: f"{x:,.0f}".replace(",", " ")    # magyar ezres tagolás szóközzel
    print(f"{ev:>3} | {ft(egyszeru):>10} | {ft(kamatos):>10}")
```

30 év alatt a kamatos kamat hozama (kb. 332 ezer Ft) több mint kétszerese az egyszerű kamaténak (150 ezer Ft) – a különbség a **hatványozás**. A formázásban: a `:>10` 10 karakter szélesen jobbra igazít, a `,` ezres tagolást tesz (ezt a magyar szokás szerint szóközre cseréljük), a `.0f` 0 tizedesre kerekít. A `TOKE` és `KAMAT` nagybetűs neve azt jelzi, hogy **konstans** – a Python nem tiltja a módosítását, de a megállapodás szerint senki nem írja át.

| Nézőpont        | Mire figyel a változóknál és kifejezéseknél?                                    |
| --------------- | ------------------------------------------------------------------------------- |
| **programozó**  | beszédes nevek, zárójelek a kétes helyeken, konstansok a „varázsszámok” helyett |
| **olvasó**      | egy kifejezést egy pillantással megértsen – a túl hosszú sort bontsd részekre   |
| **felhasználó** | jól formázott, igazított kimenet, ezres tagolással                              |
| **hibakereső**  | a megosztott módosítható objektum (aliasing) a rejtett hibák egyik fő forrása   |

## Összefoglalás

- A változó egy név, amely egy objektumra mutat; a módosítható objektumot (listát) két név is elérheti.
- A precedencia dönti el a kiértékelés sorrendjét; az `and`/`or` rövidzáras.
- A `//` lefelé kerekít, a `%` az osztó előjelét veszi fel; a `% n` körbeforgatásra kiváló.
- Az f-string formázási jelei (`>10`, `,`, `.2f`) táblázatos, olvasható kimenetet adnak.

## A lecke feladata: másodpercből óra:perc:másodperc

Írd meg az `ido_formazas(masodperc)` függvényt, amely egy nemnegatív egész másodpercszámot `"óó:pp:mm"` alakú szöveggé alakít! Használd az egész osztást (`//`) és a maradékot (`%`), és minden részt két jegyre egészíts ki nullával (`f"{x:02d}"`). Ha az idő több mint 24 óra, az óra lehet nagyobb 23-nál (pl. 90 000 másodperc = `"25:00:00"`).

```python starter required
def ido_formazas(masodperc):
    ora = 0
    perc = 0
    mp = masodperc
    return f"{ora:02d}:{perc:02d}:{mp:02d}"


print(ido_formazas(3661))
```

<details>
<summary>Megoldás</summary>

```python solution
def ido_formazas(masodperc):
    ora = masodperc // 3600
    perc = masodperc % 3600 // 60
    mp = masodperc % 60
    return f"{ora:02d}:{perc:02d}:{mp:02d}"


print(ido_formazas(3661))
```

</details>

```python test
assert ido_formazas(3661) == "01:01:01", "3661 mp = 1 óra 1 perc 1 mp"
assert ido_formazas(0) == "00:00:00", "0 mp"
assert ido_formazas(86399) == "23:59:59", "egy nap mínusz 1 mp"
assert ido_formazas(90000) == "25:00:00", "24 óránál több is lehet"
```
