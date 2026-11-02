---
title: Kivételek dobása és saját kivételek
summary: A raise utasítás, saját kivételosztályok, kivételek továbbadása és láncolása, valamint az assert.
minutes: 15
---

## Amit ebben a leckében megtanulsz

- hogyan **dobsz** kivételt a `raise` utasítással,
- hogyan készítesz **saját kivételosztályt**,
- hogyan **adsz tovább** egy kivételt,
- mire való az `assert`.

## raise – kivétel dobása

Ha a függvény olyan helyzetbe kerül, amit nem tud értelmesen kezelni (pl. érvénytelen bemenet), **jelezze kivétellel** – ne adjon vissza csendben hibás értéket.

```python run
def negyzetgyok(x):
    if x < 0:
        raise ValueError(f"Negatív számnak nincs valós négyzetgyöke: {x}")
    return x ** 0.5

print(negyzetgyok(16))
try:
    negyzetgyok(-4)
except ValueError as hiba:
    print("Hiba:", hiba)
```

Melyik beépített kivételt válaszd?

- `ValueError` – jó típus, de érvénytelen érték (negatív életkor, üres név),
- `TypeError` – rossz típusú paraméter,
- `KeyError` / `IndexError` – nem létező kulcs / index,
- `NotImplementedError` – még nincs megírva (pl. alaposztály metódusa).

## Saját kivételosztály

Nagyobb programban érdemes saját kivételeket definiálni, hogy a hívó pontosan tudja, mi történt. A saját kivétel az `Exception` (vagy egy leszármazottja) **leszármazottja**.

```python run
class BankHiba(Exception):
    """A banki műveletek közös kivétel-őse."""


class FedezetHiany(BankHiba):
    def __init__(self, egyenleg, osszeg):
        super().__init__(f"Nincs elég fedezet: egyenleg {egyenleg}, kért összeg {osszeg}")
        self.egyenleg = egyenleg
        self.osszeg = osszeg


def kivesz(egyenleg, osszeg):
    if osszeg <= 0:
        raise ValueError("Az összegnek pozitívnak kell lennie.")
    if osszeg > egyenleg:
        raise FedezetHiany(egyenleg, osszeg)
    return egyenleg - osszeg


try:
    kivesz(5000, 8000)
except FedezetHiany as hiba:
    print(hiba)
    print("Hiányzik:", hiba.osszeg - hiba.egyenleg)
except BankHiba:
    print("Egyéb banki hiba.")
```

## Kivétel továbbadása

Előfordul, hogy a kivételt elkapjuk (pl. naplózzuk), de a kezelést a hívóra bízzuk. Ilyenkor az üres `raise` **újra dobja** ugyanazt a kivételt:

```python run
def beolvas(szoveg):
    try:
        return int(szoveg)
    except ValueError:
        print(f"Napló: hibás bemenet: {szoveg!r}")
        raise   # továbbdobjuk a hívónak

try:
    beolvas("x12")
except ValueError:
    print("A hívó kezelte a hibát.")
```

## Kivételek láncolása

Ha egy alacsony szintű kivételből egy beszédesebb, magasabb szintűt csinálunk, a `raise … from …` megőrzi az eredeti okot:

```python run
class KonfigHiba(Exception):
    pass

def port_beolvas(beallitasok):
    try:
        return int(beallitasok["port"])
    except (KeyError, ValueError) as eredeti:
        raise KonfigHiba("Hibás vagy hiányzó port beállítás") from eredeti

try:
    port_beolvas({"port": "nyolcvan"})
except KonfigHiba as hiba:
    print(hiba, "| eredeti ok:", repr(hiba.__cause__))
```

## assert – belső ellenőrzés

Az `assert feltétel, "üzenet"` `AssertionError`-t dob, ha a feltétel hamis. Fejlesztés közbeni **önellenőrzésre** és **tesztekre** való – arra, hogy „ennek itt biztosan igaznak kell lennie”.

```python run
def atlag(jegyek):
    assert len(jegyek) > 0, "Az átlaghoz legalább egy jegy kell"
    return sum(jegyek) / len(jegyek)

print(atlag([4, 5]))
```

> **Felhasználói bemenet ellenőrzésére ne `assert`-et használj!** A Python `-O` kapcsolóval futtatva az `assert` sorokat kihagyja. Bemenetre `if` + `raise ValueError` való.

## Összefoglalás

- `raise Kivetel("üzenet")` – kivétel dobása érvénytelen helyzetben.
- Saját kivétel: `class SajatHiba(Exception): ...`; érdemes közös őst adni a rokon hibáknak.
- Üres `raise` – továbbdobás; `raise Uj(...) from eredeti` – láncolás.
- `assert` – belső ellenőrzés és tesztek, nem bemenet-ellenőrzés.
