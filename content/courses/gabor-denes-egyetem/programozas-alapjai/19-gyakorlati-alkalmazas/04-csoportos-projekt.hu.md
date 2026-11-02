---
title: A csoportos projekt – szervezés és dokumentáció
summary: Szerepek, feladatbontás, közös munka Gittel, és a projekt dokumentációja (specifikáció, README, fejlesztői és felhasználói leírás, tesztjegyzőkönyv).
minutes: 20
---

## Amit ebben a leckében megtanulsz

- hogyan szervezz meg egy **csoportos programozási projektet** az ötlettől a bemutatásig,
- hogyan dolgozzatok **közösen ugyanazon a kódon** (Git),
- milyen **dokumentációt** kell készíteni, és mi kerüljön bele – a tárgy értékelésében **a dokumentáció is számít**!

## A projekt szakaszai

| Szakasz | Teendő | Eredmény |
| --- | --- | --- |
| 1. Ötlet és célkitűzés | téma kiválasztása, mit fog tudni a program | 1 bekezdéses projektleírás |
| 2. Specifikáció | követelmények, bemenetek–kimenetek, korlátok | követelmény-specifikáció |
| 3. Tervezés | modulok, adatszerkezetek, feladatok kiosztása | terv + feladatlista |
| 4. Megvalósítás | kódolás kis lépésekben, rendszeres egyeztetés | működő program |
| 5. Tesztelés | egységtesztek, kipróbálás, hibajavítás | tesztjegyzőkönyv |
| 6. Dokumentálás | README, fejlesztői és felhasználói dokumentáció | kész dokumentáció |
| 7. Bemutatás | rövid demó, ki mit csinált | prezentáció |

> A dokumentációt **ne a végére hagyd**: a specifikáció és a terv már az elején elkészül, a többit a fejlesztéssel párhuzamosan írjátok.

## Szerepek és feladatbontás

Kis csapatban mindenki programoz, de érdemes felelősöket kijelölni:

- **Projektvezető:** határidők, egyeztetések, feladatlista vezetése.
- **Fejlesztők:** egy-egy modul felelősei (pl. adatkezelés, logika, felhasználói felület).
- **Tesztfelelős:** a tesztek megszervezése, a tesztjegyzőkönyv.
- **Dokumentációfelelős:** a dokumentáció egységes formája (a tartalmat mindenki írja a saját részéhez).

A feladatokat bontsátok **kicsi, egyértelmű** részekre („a `beolvas_csv()` függvény megírása tesztekkel”, nem „az adatkezelés”). Egy egyszerű táblázat vagy egy Kanban-tábla (pl. GitHub Projects, Trello: *Teendő – Folyamatban – Kész*) sokat segít.

**A modulok közötti határ** legyen előre rögzítve: milyen függvények lesznek, milyen paraméterekkel és visszatérési értékkel. Így mindenki párhuzamosan dolgozhat.

## Közös munka Gittel

A **Git** verziókezelő: minden változtatást eltárol, vissza lehet állni korábbi állapotra, és többen dolgozhatnak ugyanazon a kódon. A **GitHub** (vagy GitLab) a közös tároló a felhőben.

```bash
git clone https://github.com/csapat/projekt.git   # a közös tároló letöltése
git checkout -b beolvasas                          # saját ág a feladathoz
# ... munka ...
git add .                                          # változások kijelölése
git commit -m "CSV beolvasás és tesztjei"          # mentés üzenettel
git push -u origin beolvasas                       # feltöltés
# GitHubon: Pull Request → a többiek átnézik → összefésülés (merge) a main ágba
git checkout main && git pull                      # a legfrissebb közös állapot
```

Szabályok, amelyek megkímélnek a fejfájástól:

- **Kis, gyakori commitok** beszédes üzenettel.
- A `main` ágra csak **átnézett** (review) kód kerüljön.
- Munka előtt mindig `git pull` – így ritkábban lesz **ütközés** (*merge conflict*). Ha mégis, beszéljétek meg, melyik változat maradjon.
- Közös **kódolási szabályok**: PEP 8, egységes nevek, nyelv (magyar vagy angol azonosítók – de ne keverve).

## A dokumentáció részei

| Dokumentum | Kinek szól | Tartalom |
| --- | --- | --- |
| **Követelmény-specifikáció** | megrendelő, csapat | mit tud a program: funkciók, bemenetek–kimenetek, korlátok, elfogadási feltételek |
| **README.md** | mindenki, aki megnyitja a tárolót | rövid leírás, telepítés, futtatás, példa, szerzők |
| **Fejlesztői dokumentáció** | aki a kódot továbbfejleszti | felépítés (modulok), adatszerkezetek, fontos algoritmusok, függvények leírása (docstringekből) |
| **Felhasználói dokumentáció** | aki használja a programot | lépésről lépésre útmutató, képernyőképek, hibaüzenetek jelentése |
| **Tesztjegyzőkönyv** | csapat, oktató | tesztesetek: bemenet, elvárt és kapott eredmény, megfelelt-e |
| **Projektnapló** | csapat, oktató | ki, mikor, mit csinált; megbeszélések rövid összefoglalója |

### README-sablon

```text
# Projekt neve

Egy-két mondat arról, mit csinál a program és kinek.

## Funkciók
- ...

## Telepítés
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt

## Használat
python main.py adatok.csv
(példa kimenettel)

## Felépítés
- main.py – belépési pont, menü
- adatok.py – beolvasás és mentés
- logika.py – számítások
- tests/ – egységtesztek

## Szerzők
- Név 1 – adatkezelés, tesztek
- Név 2 – logika, dokumentáció
```

### Tesztjegyzőkönyv-minta

| # | Teszteset | Bemenet | Elvárt eredmény | Kapott eredmény | Megfelelt |
| --- | --- | --- | --- | --- | --- |
| 1 | átlag normál adatokkal | `[4, 5, 3]` | `4.0` | `4.0` | ✔ |
| 2 | átlag üres listával | `[]` | `0.0`, nincs hiba | `ZeroDivisionError` | ✘ → javítva |
| 3 | hiányzó fájl | `nincs.csv` | érthető hibaüzenet | „Nem található a fájl” | ✔ |

### Fejlesztői dokumentáció a docstringekből

Ha minden függvénynek jó docstringje van, a fejlesztői dokumentáció egy része **automatikusan** előállítható (erre valók a `pydoc`, a Sphinx vagy az MkDocs eszközök). A lényeget egy rövid programmal is megmutathatjuk:

```python run
import inspect

def beolvas(fajlnev: str) -> list[dict]:
    """Beolvassa a CSV fájlt, és soronként szótárak listáját adja vissza."""

def atlag(szamok: list[float]) -> float:
    """A számok átlaga; üres listára 0.0."""

def jelentes(adatok: list[dict]) -> str:
    """Szöveges összesítő a felhasználónak."""

# A modul függvényeiből egy egyszerű API-leírás készül (Markdown).
print("## Függvények\n")
for nev, fuggveny in [("beolvas", beolvas), ("atlag", atlag), ("jelentes", jelentes)]:
    print(f"- `{nev}{inspect.signature(fuggveny)}` – {inspect.getdoc(fuggveny)}")
```

## Projektötletek

- **Tanulmányi nyilvántartó:** tárgyak, jegyek, súlyozott átlag, statisztika, mentés fájlba.
- **Kvízjáték:** kérdések JSON fájlból, pontszám, toplista.
- **Költségkövető:** kiadások kategóriánként, havi összesítés, CSV-export.
- **Robotszimulátor:** rácsos pálya fájlból, parancsok, útkeresés (18. témakör).
- **Könyvtári rendszer:** könyvek, kölcsönzés, határidők, késedelmi díj.
- **Szövegelemző eszköz:** a 2. mini projekt kibővítése parancssori felülettel.

## Az értékelés szempontjai (tipikusan)

- a program **működik**, és teljesíti a specifikációt,
- **kódminőség**: olvasható, tagolt, kommentezett, PEP 8,
- **tesztek** megléte és eredménye,
- **dokumentáció**: teljes, érthető, igényes,
- **csapatmunka**: egyenletes munkamegosztás (Git-történet, projektnapló),
- **bemutatás**: érthető, a kérdésekre mindenki tud válaszolni a saját részéről.

## Összefoglalás

- Specifikáció és terv **az elején**, dokumentáció **folyamatosan**.
- Kis, egyértelmű feladatok, rögzített modulhatárok, Kanban-tábla.
- Git: saját ág, kis commitok, Pull Request, átnézés.
- A dokumentáció részei: **specifikáció, README, fejlesztői és felhasználói dokumentáció, tesztjegyzőkönyv, projektnapló**.
