# Programozási alapok – tananyag

Ebben a mappában van a tárgy tananyaga. Indításkor (és `pnpm db:seed` futtatásakor) az oldal innen tölti be
az adatbázisba a témaköröket és a leckéket.

## Szerkezet

```
01-bevezetes/                 ← témakör: a szám a sorrend, utána az URL-ben látszó név (ékezet nélkül)
  topic.json                  ← a témakör címe és leírása magyarul és angolul
  01-mi-a-program.hu.md       ← lecke magyarul (kötelező)
  01-mi-a-program.en.md       ← ugyanaz angolul (ha hiányzik, a magyar jelenik meg)
```

## Egy lecke fájl

````markdown
---
title: Mi a program és az algoritmus?
summary: Egy mondat a leckéről (a listákban látszik).
minutes: 10
---

Ide jön a lecke szövege Markdown formában: **félkövér**, `kód`, listák, táblázatok, linkek.

```python
print("A kódrészletek színezve jelennek meg.")
```
````

- A `minutes` (becsült idő percben) a magyar fájlból számít.
- Új lecke: új fájlpár a témakör mappájában. Új témakör: új mappa `topic.json`-nal.
- Átnevezéskor az URL is megváltozik, és a lecke „kész” jelölése elvész, ezért a már élő leckéket ne nevezd át.
