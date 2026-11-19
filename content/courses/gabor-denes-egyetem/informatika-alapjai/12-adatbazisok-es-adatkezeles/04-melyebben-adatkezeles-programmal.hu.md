---
title: Mélyebben – adatkezelés programmal
summary: Mi romlik el egy nem normalizált táblában (módosítási anomália), hogyan működik egy JOIN és miért gyorsít az index, mit jelent az atomi tranzakció egy átutalásnál, és hogyan ellenőrizd egy adathalmaz minőségét – Python-szimulációkkal és interaktív ábrával.
minutes: 45
---

## Amit ebben a leckében megtanulsz

- milyen **hibákat** okoz, ha ugyanaz az adat több helyen van (és miért normalizálunk),
- mit csinál az adatbázis egy **JOIN**-nál, és miért gyorsít ennyit egy **index**,
- miért kell egy átutalásnak **atominak** lennie,
- hogyan **ellenőrizd** egy adathalmaz minőségét, mielőtt elemzed.

## 1. Miért normalizálunk? Az anomáliák

Az alapleckében láttuk, hogy a jó adatbázisban egy adat **egy helyen** szerepel. Nézzük meg, mi történik, ha nem így van! Egy rendelési táblában minden sorban ott a vásárló neve és címe:

```python run
# Nem normalizált tábla: a vásárló címe minden rendelésnél ismétlődik
rendelesek = [
    {"id": 1, "vasarlo": "Kiss Anna", "cim": "Győr, Fő u. 1.", "termek": "egér"},
    {"id": 2, "vasarlo": "Kiss Anna", "cim": "Győr, Fő u. 1.", "termek": "billentyűzet"},
    {"id": 3, "vasarlo": "Nagy Béla", "cim": "Pécs, Tó u. 5.", "termek": "monitor"},
]

# Anna elköltözik – de valaki csak az egyik sorát javítja (módosítási anomália)
rendelesek[0]["cim"] = "Budapest, Új u. 9."
cimek = {r["cim"] for r in rendelesek if r["vasarlo"] == "Kiss Anna"}
print("Anna címei:", cimek, "← melyik az igazi?")

# törlési anomália: ha Béla egyetlen rendelését töröljük, a címe is elveszik
rendelesek = [r for r in rendelesek if r["id"] != 3]
print("ismerjük-e még Béla címét?", any(r["vasarlo"] == "Nagy Béla" for r in rendelesek))

# normalizálva: a vásárló adatai egy helyen, a rendelés csak hivatkozik rá
vasarlok = {1: {"nev": "Kiss Anna", "cim": "Budapest, Új u. 9."}, 2: {"nev": "Nagy Béla", "cim": "Pécs, Tó u. 5."}}
rendelesek_n = [{"id": 1, "vasarlo_id": 1, "termek": "egér"}, {"id": 2, "vasarlo_id": 1, "termek": "billentyűzet"}]
vasarlok[1]["cim"] = "Szeged, Kert u. 3."               # egyetlen helyen kell módosítani
print([(r["termek"], vasarlok[r["vasarlo_id"]]["cim"]) for r in rendelesek_n])
```

A normalizált változatban a cím **egyetlen** helyen van, így nem lehet ellentmondásos, és a vásárló adatai akkor is megmaradnak, ha nincs rendelése. Az ár: a lekérdezésnél össze kell kapcsolni a táblákat (**JOIN**).

## 2. Mi történik egy JOIN-nál? És mit tesz az index?

A legegyszerűbb JOIN minden rendelés mellé végigkeresi az összes vásárlót (**beágyazott ciklus**). Ha a vásárlók táblájában van **index** (egy kulcs szerint rendezett, gyorsan kereshető szerkezet, mint egy könyv tárgymutatója), a keresés gyors:

```python run
# JOIN beágyazott ciklussal vs. indexszel (szótár) – összehasonlítások száma
import random

random.seed(5)
vasarlok = [{"id": i, "nev": f"vásárló{i}"} for i in range(1, 2001)]
rendelesek = [{"id": j, "vasarlo_id": random.randint(1, 2000)} for j in range(1, 501)]

# 1) beágyazott ciklus: minden rendelésnél végigkeressük a vásárlókat
lepes, eredmeny1 = 0, []
for r in rendelesek:
    for v in vasarlok:
        lepes += 1
        if v["id"] == r["vasarlo_id"]:
            eredmeny1.append((r["id"], v["nev"]))
            break
print(f"index nélkül: {lepes:,} összehasonlítás".replace(",", " "))

# 2) index: egyszer felépítjük (id → vásárló), utána minden keresés egy lépés
index = {v["id"]: v for v in vasarlok}
eredmeny2 = [(r["id"], index[r["vasarlo_id"]]["nev"]) for r in rendelesek]
print(f"indexszel:    {len(vasarlok)} lépés az építés + {len(rendelesek)} keresés")
print("ugyanaz az eredmény:", eredmeny1 == eredmeny2)
```

Egy keresés index nélkül átlagosan a tábla felét nézi végig, egy B-fa indexszel (ezt használják a relációs adatbázisok) kb. $\log_2 n$ lépést:

```plot
title: Egy rekord megkeresésének lépésszáma a tábla sorainak számától függően
x: 1, 100
y: 0, 60
f: x/2 # index nélkül: átlagosan n/2 lépés
f: log2(x) # indexszel: kb. log2(n) lépés
```

Már száz sornál is 50 lépés áll szemben kb. 7-tel; százezer sornál pedig index nélkül átlagosan 50 000 lépés, indexszel kb. 17. **De** az indexnek is ára van: helyet foglal, és minden beszúrásnál, módosításnál frissíteni kell. Ezért nem teszünk indexet minden oszlopra – csak azokra, amelyek szerint gyakran keresünk vagy kapcsolunk (pl. idegen kulcsok, e-mail cím a bejelentkezéshez).

## 3. Tranzakció: minden vagy semmi

Egy átutalás két lépés: Annától levonunk 10 000 Ft-ot, Bélához hozzáadjuk. Mi történik, ha a kettő között leáll a szerver? Tranzakció nélkül a pénz **eltűnik**. A tranzakció garantálja, hogy vagy mindkét lépés megtörténik, vagy egyik sem (**atomicitás**, az ACID „A”-ja):

```python run
# Átutalás tranzakcióval és anélkül: hiba a két lépés között
import copy

def atutal(szamlak, honnan, hova, osszeg, hiba_kozben=False, tranzakcio=True):
    mentes = copy.deepcopy(szamlak) if tranzakcio else None   # visszaállítási pont
    try:
        if szamlak[honnan] < osszeg:
            raise ValueError("nincs elég fedezet")
        szamlak[honnan] -= osszeg
        if hiba_kozben:
            raise RuntimeError("leállt a szerver")
        szamlak[hova] += osszeg
    except Exception as e:
        if tranzakcio:
            szamlak.clear(); szamlak.update(mentes)            # ROLLBACK: mintha meg sem történt volna
        print(f"  hiba: {e} → {'visszagörgetve' if tranzakcio else 'NINCS visszagörgetés'}")
    return szamlak

for tranz in (False, True):
    szamlak = {"Anna": 50_000, "Béla": 20_000}
    print(f"tranzakció: {tranz}")
    atutal(szamlak, "Anna", "Béla", 10_000, hiba_kozben=True, tranzakcio=tranz)
    print(f"  egyenlegek: {szamlak}, összesen {sum(szamlak.values())} Ft (eredetileg 70000)")
```

Tranzakció nélkül 10 000 Ft eltűnt a rendszerből; tranzakcióval minden visszaállt. A valódi adatbázisok ezt `BEGIN` … `COMMIT` (vagy hiba esetén `ROLLBACK`) utasításokkal végzik – és a többi ACID-tulajdonságot is biztosítják (következetesség, elkülönítés, tartósság).

## 4. Adatminőség: mielőtt elemzel

„Szemét be, szemét ki” – egy elemzés csak olyan jó, mint az adat, amelyből készül. Néhány gyors ellenőrzés minden adathalmaznál megéri:

```python run
# Adatminőség-ellenőrzés: hiányzó értékek, duplikátumok, érvénytelen formátum, kiugró érték
import re
from collections import Counter

hallgatok = [
    {"neptun": "ABC123", "email": "anna@pelda.hu", "kor": 20},
    {"neptun": "XYZ789", "email": "bela@pelda", "kor": 21},
    {"neptun": "ABC123", "email": "anna@pelda.hu", "kor": 20},
    {"neptun": "QWE456", "email": None, "kor": 19},
    {"neptun": "RTZ111", "email": "dora@pelda.hu", "kor": 210},
]

hianyzo = [h["neptun"] for h in hallgatok if not h["email"]]
duplikat = [k for k, db in Counter(h["neptun"] for h in hallgatok).items() if db > 1]
rossz_email = [h["email"] for h in hallgatok if h["email"] and not re.fullmatch(r"[^@\s]+@[^@\s]+\.[a-z]{2,}", h["email"])]
gyanus_kor = [(h["neptun"], h["kor"]) for h in hallgatok if not 16 <= h["kor"] <= 99]
print("hiányzó e-mail:", hianyzo)
print("duplikált kód: ", duplikat)
print("hibás e-mail:  ", rossz_email)
print("gyanús életkor:", gyanus_kor, "← valószínűleg elírás (21?)")
```

Az ellenőrzés után dönteni kell, mit kezdünk a hibákkal – és ez már **nézőpont** kérdése: az elemző kihagyhatja a hibás sorokat, a rendszer gazdája viszont a forrásnál javítaná őket (pl. az űrlap már ne engedjen 210 éves kort). És ne feledd a **GDPR** szempontját: csak azt az adatot gyűjtsd, amire tényleg szükség van, és csak addig tárold, ameddig kell.

| Nézőpont                | Mire figyel az adatbázisnál?                                           |
| ----------------------- | ---------------------------------------------------------------------- |
| **fejlesztő**           | normalizált szerkezet, indexek, tranzakciók, paraméterezett lekérdezés |
| **elemző**              | adatminőség, hiányzó értékek, megbízható összesítések                  |
| **üzemeltető**          | mentés, helyreállítás, teljesítmény, tárhely                           |
| **adatvédelmi felelős** | milyen személyes adat van, ki fér hozzá, meddig tároljuk               |

## Összefoglalás

- A nem normalizált táblában az ismétlődő adat ellentmondásossá válhat (módosítási anomália), és törléskor elveszhet (törlési anomália).
- A JOIN index nélkül sok összehasonlítást igényel; az index ($\approx \log_2 n$ lépés) gyorsít, de helyet foglal és lassítja az írást.
- A tranzakció atomi: egy átutalás vagy teljesen megtörténik, vagy egyáltalán nem (ROLLBACK).
- Elemzés előtt ellenőrizd a hiányzó, duplikált, hibás formátumú és kiugró értékeket.

## A lecke feladata

```quiz required
? Egy rendelési táblában a vásárló címe 50 sorban ismétlődik. Hány sort kell módosítani, ha a vásárló elköltözik?
= 50
! Normalizált szerkezetben csak 1 sort kellene.

? Egy indexelt, kb. 1 000 000 soros táblában nagyjából hány lépés egy rekord megkeresése? ($\log_2$, egészre kerekítve)
= 20
! $\log_2 10^6 \approx 19{,}9$.

? Mi az atomicitás egy tranzakcióban?
- a tranzakció nagyon gyors
+ a tranzakció lépései vagy mind megtörténnek, vagy egyik sem
- a tranzakció csak egy sort módosíthat
- a tranzakciót nem lehet visszavonni
! Hiba esetén ROLLBACK állítja vissza az eredeti állapotot.

? Miért nem érdemes minden oszlopra indexet tenni?
- mert az index lassítja a keresést
+ mert minden index helyet foglal, és minden írásnál frissíteni kell
- mert az SQL nem engedi
- mert az index törli az adatokat
! Csak a gyakran keresett, kapcsolt oszlopokra érdemes.

? Egy adathalmazban egy hallgató életkora 210. Mi a helyes lépés?
- benne hagyni, mert ez az adat
+ megjelölni gyanúsként, ellenőrizni a forrást, és az űrlapon is korlátozni a tartományt
- az egész adathalmazt törölni
- 21-re javítani ellenőrzés nélkül
! Az adatminőséget a forrásnál érdemes biztosítani.
```
