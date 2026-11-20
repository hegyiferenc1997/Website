---
title: Gyakorlás – adatbázisok és adatkezelés
summary: Ellenőrző kérdések és összefoglaló feladatlap a relációs modellről, az SQL-ről, a NoSQL-ről és a GDPR-ról.
minutes: 45
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Tervezz táblákat egy könyvtár számára: könyvek, olvasók, kölcsönzések. Mik a kulcsok?</summary>

`konyvek(isbn PK, cim, szerzo, ev)`, `olvasok(olvasojegy PK, nev, email)`, `kolcsonzesek(id PK, isbn FK, olvasojegy FK, kiadva, visszahozva)`. A kölcsönzés köti össze a könyvet és az olvasót (N : M kapcsolat kapcsolótáblával).

</details>

<details>
<summary>2. Írj SQL-lekérdezést, amely kilistázza a 4.0-nál jobb átlagú hallgatók nevét ábécérendben!</summary>

```sql
SELECT nev FROM hallgatok WHERE atlag > 4.0 ORDER BY nev;
```

</details>

<details>
<summary>3. Egy webshop a rendeléshez a vásárló születési dátumát és anyja nevét is kötelezően bekéri. Melyik GDPR-elvet sérti?</summary>

Az adattakarékosságot (és a célhoz kötöttséget): a rendelés teljesítéséhez ezekre az adatokra nincs szükség.

</details>

```python run
# GROUP BY Pythonban: szakonkénti létszám és átlag
hallgatok = [
    ("Kiss Anna", "mérnökinf", 4.5),
    ("Nagy Béla", "mérnökinf", 3.8),
    ("Tóth Cili", "gazdinfo", 4.1),
    ("Kovács Dénes", "mérnökinf", 3.2),
]
csoport = {}
for nev, szak, atlag in hallgatok:
    csoport.setdefault(szak, []).append(atlag)
for szak, atlagok in csoport.items():
    print(szak, len(atlagok), round(sum(atlagok) / len(atlagok), 2))
```

## Összefoglaló feladatlap

```quiz required
? Mi az elsődleges kulcs két fő tulajdonsága?
+ egyedi és nem lehet üres
- mindig szöveg és rövid
- mindig az első oszlop és szám
- bárki módosíthatja
! Egyértelműen azonosít egy rekordot.

? Melyik SQL-utasítás **módosít** meglévő sorokat?
- INSERT
+ UPDATE
- SELECT
- JOIN
! UPDATE … SET … WHERE …

? Mennyi a mérnökinf szak átlaga a fenti Python-példa szerint (két tizedesre)?
= 3.83
! (4.5 + 3.8 + 3.2) / 3 = 3.83.

? Melyik SQL-záradék csoportosít egy oszlop értékei szerint?
= GROUP BY
! Pl. GROUP BY szak.

? Melyik adatbázis jellemzően **memóriában** tárolt kulcs–érték tár, gyorsítótárnak?
- PostgreSQL
- Neo4j
+ Redis
- MongoDB
! Nagyon gyors, gyakran gyorsítótárként használják.

? Melyik jog **nem** illeti meg az érintettet a GDPR szerint?
- hozzáférés a saját adataihoz
- az adatok helyesbítése
- az adatok törlése
+ más személyek adatainak lekérése
! Csak a saját adataira vonatkoznak a jogai.
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **JOIN szótárral.** Írd meg az `osszekapcsol(rendelesek, vasarlok)` függvényt, amely `(rendelés-azonosító, vásárló-azonosító)` párokból és egy `{vásárló-azonosító: név}` szótárból `(rendelés-azonosító, név)` párok listáját adja! A nem létező vásárlóra hivatkozó rendelés maradjon ki (mint egy INNER JOIN-nál).

```python starter
def osszekapcsol(rendelesek, vasarlok):
    return [(r, vasarlok[v]) for r, v in rendelesek]
```

<details>
<summary>Megoldás</summary>

```python solution
def osszekapcsol(rendelesek, vasarlok):
    return [(r, vasarlok[v]) for r, v in rendelesek if v in vasarlok]   # csak a párosíthatók
```

</details>

```python test
v = {1: "Anna", 2: "Béla"}
assert osszekapcsol([(10, 1), (11, 2), (12, 1)], v) == [(10, "Anna"), (11, "Béla"), (12, "Anna")]
assert osszekapcsol([(13, 9), (14, 2)], v) == [(14, "Béla")]
print("Minden ellenőrzés sikeres!")
```

**2.** **Csoportosítás (GROUP BY).** Írd meg az `osszeg_csoportonkent(sorok)` függvényt, amely `(kategória, összeg)` párokból `{kategória: összeg}` szótárat készít, mint egy `SELECT kategoria, SUM(osszeg) … GROUP BY kategoria` lekérdezés!

```python starter
def osszeg_csoportonkent(sorok):
    return dict(sorok)
```

<details>
<summary>Megoldás</summary>

```python solution
def osszeg_csoportonkent(sorok):
    eredmeny = {}
    for kat, osszeg in sorok:
        eredmeny[kat] = eredmeny.get(kat, 0) + osszeg     # kategóriánként összeadjuk
    return eredmeny
```

</details>

```python test
s = [("élelmiszer", 3000), ("utazás", 1500), ("élelmiszer", 2500), ("szórakozás", 4000)]
assert osszeg_csoportonkent(s) == {"élelmiszer": 5500, "utazás": 1500, "szórakozás": 4000}
assert osszeg_csoportonkent([]) == {}
print("Minden ellenőrzés sikeres!")
```

**3.** **Duplikátumok.** Írd meg a `duplikaltak(rekordok, kulcs)` függvényt, amely szótárak listájából ábécérendben visszaadja azokat a `kulcs` szerinti értékeket, amelyek többször is előfordulnak!

```python starter
def duplikaltak(rekordok, kulcs):
    return []
```

<details>
<summary>Megoldás</summary>

```python solution
from collections import Counter

def duplikaltak(rekordok, kulcs):
    db = Counter(r[kulcs] for r in rekordok)
    return sorted(k for k, n in db.items() if n > 1)
```

</details>

```python test
r = [{"neptun": "ABC123"}, {"neptun": "XYZ789"}, {"neptun": "ABC123"}, {"neptun": "QWE456"}, {"neptun": "XYZ789"}]
assert duplikaltak(r, "neptun") == ["ABC123", "XYZ789"]
assert duplikaltak([{"a": 1}], "a") == []
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Mi az elsődleges kulcs?
+ egy oszlop (vagy oszlopok), amely minden sort egyértelműen azonosít
- a tábla első oszlopa
- egy másik táblára mutató hivatkozás
- a jelszó titkosítási kulcsa
! A másik táblára mutató hivatkozás az idegen kulcs.

? Egy `termekek` táblában 120 sor van, ebből 45-nek az ára 5000 Ft fölött. Hány sort ad a `SELECT * FROM termekek WHERE ar <= 5000;` lekérdezés?
= 75
! $120 - 45 = 75$.

? Milyen kapcsolat van a hallgatók és a kurzusok között, ha egy hallgató több kurzust vehet fel, és egy kurzusra több hallgató jár?
- 1:1
- 1:N
+ N:M (kapcsolótáblával)
- nincs kapcsolat
! Az N:M kapcsolatot egy harmadik táblával valósítjuk meg.

? Miért kell paraméterezett lekérdezést használni, amikor a felhasználó adatát egy SQL-lekérdezésbe tesszük?
- mert gyorsabb a gépelés
+ hogy a bemenet ne értelmeződhessen SQL-utasításként (SQL-befecskendezés ellen)
- mert az SQL másképp nem működik
- hogy szebb legyen a kód
! A szövegösszefűzéssel épített lekérdezés támadható.
```
