# Programozási alapok – tananyag

Ebben a mappában van a tárgy tananyaga. Indításkor (és `pnpm db:seed` futtatásakor) az oldal innen tölti be
az adatbázisba a témaköröket és a leckéket.

A szerkezet a GDE hivatalos tantárgyleírásának (B-PROGAL) 19 témakörét követi: `01-alapelvek-es-koncepciok` …
`19-gyakorlati-alkalmazas`. Minden témakör végén egy `gyakorlas` lecke van ellenőrző kérdésekkel és feladatokkal.

## Szerkezet

```
01-alapelvek-es-koncepciok/   ← témakör: a szám a sorrend, utána az URL-ben látszó név (ékezet nélkül)
  topic.json                  ← a témakör címe és leírása magyarul és angolul
  01-mi-a-programozas.hu.md   ← lecke magyarul (kötelező)
  01-mi-a-programozas.en.md   ← ugyanaz angolul (ha hiányzik, a magyar jelenik meg)
```

## Egy lecke fájl

````markdown
---
title: Mi a programozás?
summary: Egy mondat a leckéről (a listákban látszik).
minutes: 10
---

Ide jön a lecke szövege Markdown formában: **félkövér**, `kód`, listák, táblázatok, linkek.

```python
print("A kódrészletek színezve jelennek meg.")
```
````

- A `minutes` (becsült idő percben) a magyar fájlból számít.
- Gyakorló leckénél a fejlécbe `kind: practice` kerül.
- Új lecke: új fájlpár a témakör mappájában. Új témakör: új mappa `topic.json`-nal.
- Átnevezéskor az URL is megváltozik, és a lecke „kész” jelölése elvész, ezért a már élő leckéket ne nevezd át.

## Kódblokk-szerepek (a beépített Python-futtatóhoz)

A ` ```python ` után írt második szó a blokk szerepét adja meg. Az oldalon a fejlécben is megjelenik
(pl. „Python · futtatható példa”). A `run` és `starter` blokkok a böngészőben futtatható szerkesztővé
alakulnak (Pyodide, `src/features/python/`).

| Jelölés                        | Jelentés                                                                                           |
| ------------------------------ | -------------------------------------------------------------------------------------------------- |
| ` ```python run `              | önállóan futtatható példa                                                                          |
| ` ```python starter `          | egy feladat kiinduló kódja                                                                         |
| ` ```python solution `         | a feladat megoldása (egy `<details><summary>Megoldás</summary>` blokkban, üres sorokkal körülvéve) |
| ` ```python test `             | `assert`-ekkel ellenőrzés, a közvetlenül előtte lévő megoldás után fut                             |
| ` ```python starter required ` | a lecke **kötelező feladata** (leckénként pontosan egy); a sikeres ellenőrzés teljesíti a leckét   |
| ` ```python `                  | csak megjelenített kód (pl. szándékosan hibás vagy hardvert igénylő példa)                         |

Szabályok, hogy a blokkok tényleg fussanak:

- Minden `run` blokk **önálló**: nem támaszkodhat másik blokkban definiált változóra vagy fájlra.
- Nem írhat a hibakimenetre (stderr) – pl. `logging`-nál `stream=sys.stdout`, `unittest`-nél
  `TextTestRunner(stream=sys.stdout)`. A szándékosan hibát dobó példák sima ` ```python ` blokkok.
- A `pnpm test` (`tests/python-examples.test.ts`) minden `run` blokkot, és minden `solution` + `test` párt
  lefuttat egy üres ideiglenes mappában; ha bármelyik hibázik, a teszt elbukik.
- A `starter required` blokk utáni első `test` blokk az ellenőrzése. A kiinduló kódnak **el kell buknia**
  az ellenőrzésen (ezt is teszteljük), a megoldásnak át kell mennie. Az `assert` üzenete a hallgatónak
  szól, ezért legyen érthető tipp (hu/en).
- A `test` blokk eléri a futás kimenetét a `kimenet` (angolul `output`) változóban.
- Minden leckének van kötelező feladata; a témakör utolsó (gyakorló) leckéjéé az összefoglaló feladat.
  A leckék sorban nyílnak: a következő csak az előzőek teljesítése után.
