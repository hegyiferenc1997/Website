---
title: A kód dokumentálásának fontossága
summary: Kinek és miért írunk dokumentációt, milyen szintjei vannak, és mi kerüljön bele.
minutes: 10
---

## Amit ebben a leckében megtanulsz

- miért **elengedhetetlen** a dokumentáció,
- milyen **fajtái** vannak (kódon belüli, API, felhasználói, fejlesztői),
- mi a **jó dokumentáció** ismérve.

## Miért dokumentálunk?

> „A kódot sokkal többször olvassák, mint írják.” – Guido van Rossum, a Python megalkotója

A programot nem csak a gép „olvassa”. Olvassa:

- a **csapattársad**, aki tovább dolgozik rajta,
- a **jövőbeli önmagad** – fél év múlva a saját kódod is idegen lesz,
- a **felhasználó**, aki használni szeretné,
- az **oktató vagy értékelő**, aki a projekt beadandót pontozza.

A dokumentáció célja, hogy a kód **megérthető, használható és karbantartható** legyen. Egy rosszul dokumentált program akkor is értéktelenné válhat, ha jól működik, mert senki nem meri módosítani.

> A tárgy projektfeladatánál a **dokumentáció teljessége és szakmai megfogalmazása** külön értékelési szempont – érdemes komolyan venni!

## A dokumentáció szintjei

| Fajta | Kinek szól | Hol van | Példa |
| --- | --- | --- | --- |
| **kódon belüli** | a kódot olvasó fejlesztő | kommentek, beszédes nevek | `# A bruttó ár ÁFA-val együtt` |
| **API-dokumentáció** | aki használja a függvényt / modult | docstringek, típusjelölések | `"""Visszaadja az átlagot…"""` |
| **fejlesztői** | aki tovább fejleszti a projektet | README, architektúra leírás, `CONTRIBUTING` | telepítés, felépítés, döntések |
| **felhasználói** | a program felhasználója | kézikönyv, súgó, GYIK | „Hogyan regisztrálok?” |

## Mit dokumentálj?

- **Mit csinál** a modul / függvény (a cél, nem a megvalósítás lépései).
- **Paraméterek és visszatérési érték**: típus, jelentés, megengedett tartomány.
- **Kivételek**: mikor és milyen hibát dob.
- **Miért** készült így – a nem nyilvánvaló döntések oka.
- **Hogyan kell használni**: egy rövid példa.
- **Telepítés és futtatás**: függőségek, parancsok (README).

## Mit ne dokumentálj?

- Ami a kódból **magától értetődik**: `i += 1  # növeli i-t` – ez csak zaj.
- Elavult információt: a **rossz** dokumentáció rosszabb, mint a hiányzó. Ha módosítod a kódot, frissítsd a kommentet is!

## A legjobb dokumentáció: az olvasható kód

Sok komment feleslegessé válik, ha a kód **önmagát magyarázza**: beszédes nevek, rövid függvények, egyértelmű szerkezet.

```python run
# Nehezen érthető, komment kellene hozzá:
def f(l):
    return sum(x for x in l if x >= 50) / len([x for x in l if x >= 50])

# Önmagát magyarázza:
MINIMUM_PONT = 50

def sikeres_dolgozatok_atlaga(pontszamok):
    sikeresek = [p for p in pontszamok if p >= MINIMUM_PONT]
    return sum(sikeresek) / len(sikeresek)

print(f([40, 60, 80]), sikeres_dolgozatok_atlaga([40, 60, 80]))
```

## Összefoglalás

- A kódot sokkal többször olvassák, mint írják – a dokumentáció a karbantarthatóság alapja.
- Szintek: kódon belüli, API (docstring), fejlesztői (README), felhasználói.
- A *miért*-et dokumentáld, ne a nyilvánvalót; tartsd naprakészen.
- A legjobb kiindulópont az önmagát magyarázó, beszédes nevű kód.
