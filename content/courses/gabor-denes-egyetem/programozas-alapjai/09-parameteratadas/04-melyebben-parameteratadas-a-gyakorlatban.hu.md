---
title: Mélyebben – paraméterátadás a gyakorlatban
summary: Mit lát a függvény a kapott listából – módosítás vagy átállítás, a módosítható alapértelmezett paraméter csapdája és javítása, *args és **kwargs, csak kulcsszavas és csak pozicionális paraméterek, valamint a mohó és a lusta kiértékelés – futtatható programokkal és programozós kötelező feladattal.
minutes: 50
---

## Amit ebben a leckében megtanulsz

- mi történik pontosan, amikor egy függvény **listát** kap, és mi a különbség a **módosítás** és az **átállítás** között,
- miért veszélyes a **módosítható alapértelmezett** paraméter, és mi a bevált javítása,
- hogyan írj **tetszőleges számú** paramétert fogadó függvényt (`*args`, `**kwargs`),
- mit jelent, hogy a Python **mohón** értékeli ki a paramétereket, és mikor jobb a **lusta** kiértékelés.

## 1. Módosítás vagy átállítás?

Az alapleckében láttuk, hogy a Python **objektumhivatkozással** adja át a paramétert: a függvény paramétere egy új név ugyanarra az objektumra. Ebből két, nagyon különböző eset következik:

```python run
# Módosítás (a hívó is látja) kontra átállítás (a hívó NEM látja)
def modosit(lista):
    lista.append(99)              # az objektumot változtatjuk: a hívó listája is változik

def atallit(lista):
    lista = [1, 2, 3]             # a helyi nevet állítjuk át egy új listára: a hívóé marad
    lista.append(99)

def szam_novel(n):
    n += 1                        # a szám nem módosítható: ez is csak átállítás
    return n

adat = [10, 20]
modosit(adat)
print("modosit után:  ", adat)
atallit(adat)
print("atallit után:  ", adat)

x = 5
szam_novel(x)
print("szam_novel után x =", x, "| a visszaadott értékkel:", szam_novel(x))
```

Az ökölszabály: ha a függvény a kapott objektum **metódusát** hívja (`append`, `sort`, `[i] = …`), az a hívónál is látszik; ha a paraméternevet **új értékre** állítja (`=`), az nem. Számokat és szövegeket ezért mindig **visszatérési értékkel** adunk vissza. Ha egy függvény szándékosan módosítja a kapott listát, azt a neve és a dokumentációja is jelezze (pl. a `lista.sort()` helyben rendez és `None`-t ad, a `sorted(lista)` új listát ad).

## 2. A módosítható alapértelmezett paraméter csapdája

Az alapértelmezett érték **egyszer**, a függvény definiálásakor jön létre – nem minden hívásnál újra. Listánál ez meglepő hibát okoz:

```python run
# A klasszikus csapda: a [] alapérték minden hívásnál UGYANAZ a lista
def kosarba_rossz(termek, kosar=[]):
    kosar.append(termek)
    return kosar

print("Anna kosara:", kosarba_rossz("alma"))
print("Béla kosara:", kosarba_rossz("tej"), " ← Béla kosarában ott van Anna almája!")

# a javítás: None az alapérték, és a függvényen belül hozunk létre új listát
def kosarba_jo(termek, kosar=None):
    if kosar is None:
        kosar = []                 # minden hívásnál friss lista
    kosar.append(termek)
    return kosar

print("Anna kosara:", kosarba_jo("alma"))
print("Béla kosara:", kosarba_jo("tej"))
```

Egy webáruházban ez azt jelentené, hogy a vásárlók egymás termékeit látják a kosarukban – adatvédelmi incidens egyetlen sor miatt. A szabály: alapértelmezett értéknek csak **nem módosítható** értéket adj (szám, szöveg, `None`, tuple); lista vagy szótár helyett `None`-t, és a függvényben hozd létre.

## 3. *args, **kwargs és a paraméterfajták

A `*args` tetszőleges számú **pozicionális** paramétert gyűjt egy tuple-be, a `**kwargs` tetszőleges számú **kulcsszavas** paramétert egy szótárba. A `*` után álló paramétert csak névvel lehet megadni, a `/` előttit csak pozíció szerint:

```python run
# Paraméterfajták: pozicionális, kulcsszavas, *args, **kwargs, csak kulcsszavas
def naplo(szint, *uzenetek, elvalaszto=" | ", **adatok):
    sor = f"[{szint}] " + elvalaszto.join(uzenetek)
    if adatok:
        sor += "  {" + ", ".join(f"{k}={v}" for k, v in adatok.items()) + "}"
    print(sor)

naplo("INFO", "szerver elindult")
naplo("HIBA", "adatbázis", "időtúllépés", felhasznalo="anna", ms=5000)
naplo("INFO", "a", "b", "c", elvalaszto=" → ")

# kicsomagolás híváskor: * a listát, ** a szótárt bontja paraméterekre
uzenetek = ["mentés", "kész"]
extra = {"fajl": "jegyek.csv", "sor": 120}
naplo("INFO", *uzenetek, **extra)

def terulet(szelesseg, magassag, /, *, egyseg="m"):    # / előtt csak pozíció, * után csak név
    return f"{szelesseg * magassag} {egyseg}²"
print(terulet(3, 4), "|", terulet(3, 4, egyseg="cm"))
try:
    terulet(3, 4, "cm")
except TypeError as e:
    print("TypeError:", e)
```

A **csak kulcsszavas** paraméter (`*` után) azért hasznos, mert a hívás olvashatóbb, és nem lehet véletlenül összekeverni a sorrendet: a `terulet(3, 4, egyseg="cm")` egyértelmű, a `terulet(3, 4, "cm")` nem is fut le. A `print` függvény `sep` és `end` paramétere is így működik.

## 4. Mohó és lusta kiértékelés

A Python a paramétereket **mohón** értékeli ki: a függvény meghívása **előtt** minden paraméter kiszámolódik, balról jobbra. Ez általában természetes, de néha felesleges munkát okoz:

```python run
# Mohó kiértékelés: a paraméter akkor is kiszámolódik, ha a függvény nem használja
def draga_szamitas():
    print("   ...drága számítás fut...")
    return 42

def naplo_mohon(bekapcsolva, uzenet):
    if bekapcsolva:
        print("napló:", uzenet)

def naplo_lustan(bekapcsolva, uzenet_fuggveny):
    if bekapcsolva:
        print("napló:", uzenet_fuggveny())        # csak akkor számolunk, ha kell

print("mohón, kikapcsolt naplóval:")
naplo_mohon(False, draga_szamitas())
print("lustán, kikapcsolt naplóval:")
naplo_lustan(False, draga_szamitas)                # a függvényt adjuk át, nem az eredményét
print("lustán, bekapcsolt naplóval:")
naplo_lustan(True, lambda: draga_szamitas() * 2)

# a generátor is lusta: csak annyit számol, amennyit elkérünk
negyzetek = (x * x for x in range(10**12))       # nem jön létre billió elemű lista!
print("az első négyzetszám 1000 fölött:", next(n for n in negyzetek if n > 1000))
```

A kikapcsolt naplózás a mohó változatnál is lefuttatta a drága számítást, a lustánál nem. A trükk: nem az **eredményt**, hanem a **függvényt** adjuk át, és csak akkor hívjuk meg, ha tényleg kell. A generátorkifejezés ugyanezt csinálja sorozatokkal: a billió elemű „lista” egy pillanat alatt kész, mert csak az első néhány elemét számolja ki.

| Nézőpont           | Mire figyel a paraméterátadásnál?                                                    |
| ------------------ | ------------------------------------------------------------------------------------ |
| **hívó**           | módosítja-e a függvény a listámat? – a névnek és a dokumentációnak ezt jeleznie kell |
| **függvény írója** | `None` alapérték lista helyett, csak kulcsszavas paraméter a félreérthető helyeken   |
| **olvasó**         | `kuld(cim, ujra=True)` többet mond, mint `kuld(cim, True)`                           |
| **teljesítmény**   | drága paramétert csak akkor számolj ki, ha kell (lusta kiértékelés)                  |

## Összefoglalás

- A függvény a kapott objektumot látja: a metódusos módosítás a hívónál is látszik, a `=` átállítás nem.
- Az alapértelmezett érték egyszer jön létre; módosítható alapérték helyett `None`-t használj.
- A `*args` és a `**kwargs` tetszőleges számú paramétert gyűjt; a `*` utáni paraméter csak névvel adható meg.
- A paraméterek mohón, a hívás előtt értékelődnek ki; függvény vagy generátor átadásával lusta lehet a kiértékelés.

## A lecke feladata: rugalmas átlagoló

Írd meg az `atlag(*szamok, kerekites=2)` függvényt, amely tetszőleges számú számot kap, és az átlagukat adja vissza `kerekites` tizedesjegyre kerekítve! A `kerekites` csak kulcsszavas paraméter (a `*szamok` után áll, így automatikusan az). Ha egyetlen szám sem érkezett, dobjon `ValueError`-t.

```python starter required
def atlag(*szamok, kerekites=2):
    return sum(szamok) / len(szamok)


print(atlag(1, 2, 4))
```

<details>
<summary>Megoldás</summary>

```python solution
def atlag(*szamok, kerekites=2):
    if not szamok:
        raise ValueError("legalább egy szám kell")
    return round(sum(szamok) / len(szamok), kerekites)


print(atlag(1, 2, 4))
```

</details>

```python test
assert atlag(1, 2, 4) == 2.33, "(1 + 2 + 4) / 3 két tizedesre 2.33"
assert atlag(1, 2, 4, kerekites=0) == 2.0, "nulla tizedesre 2.0"
assert atlag(5) == 5.0, "egyetlen szám átlaga önmaga"
try:
    atlag()
    assert False, "szám nélkül ValueError kell"
except ValueError:
    pass
```
