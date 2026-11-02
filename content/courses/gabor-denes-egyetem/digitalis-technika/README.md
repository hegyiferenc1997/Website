# Digitális technika – tananyag

Ebben a mappában van a 3. féléves Digitális technika tárgy tananyaga. Indításkor (és `pnpm db:seed`
futtatásakor) az oldal innen tölti be az adatbázisba a témaköröket és a leckéket.

A szerkezet a tantárgyleírás 13 témakörét követi: `01-digitalis-rendszerek-alapjai` …
`13-alkalmazasok-az-informatikaban`. Minden témakör végén egy `gyakorlas` lecke van ellenőrző kérdésekkel
és összefoglaló feladatlappal. A mappák, a `topic.json` és a lecke fájlok felépítése ugyanaz, mint a
Programozási alapoknál (lásd `../programozas-alapjai/README.md`).

## Kötelező feladat: kvíz

A beépített futtató csak Pythont tud, ezért a digitális technikában a leckék kötelező feladata egy
**kvízblokk**. Leckénként pontosan egy ` ```quiz required ` blokk kell (a gyakorló leckében ez az
összefoglaló feladatlap); a hibátlanul kitöltött kvíz teljesíti a leckét. A magyar és az angol fájl
kvíze ugyanazokat a kérdéseket tartalmazza ugyanabban a sorrendben (a teszt ellenőrzi).

````markdown
```quiz required
? Hány bitből áll egy bájt?
= 8
! Egy bájt = 8 bit.

? Melyik a NAND kapu?
- ÉS
+ NEM-ÉS
- VAGY

? Töltsd ki a félösszeadó igazságtábláját!
table: A, B -> S = A ⊕ B; C = A·B

? Egyszerűsítsd: A·B + A·B̅
expr: A, B -> A
limit: 1
same: A·B + A·B'
```
````

| Sor                    | Jelentés                                                                         |
| ---------------------- | -------------------------------------------------------------------------------- |
| `? kérdés`             | új kérdés (Markdown is lehet benne)                                              |
| `= válasz`             | begépelendő válasz; több `=` sor = több elfogadott alak                          |
| `+ jó` / `- rossz`     | feleletválasztás, pontosan egy `+`                                               |
| `table: A, B -> Y = …` | igazságtábla kitöltése; több kimenet `;`-vel elválasztva                         |
| `expr: A, B -> …`      | kifejezés begépelése; a logikai egyenértékűséget nézzük                          |
| `limit: N`             | (expr) legfeljebb ennyi literál lehet a válaszban – „egyszerűsítsd” feladatokhoz |
| `same: …`              | (expr) az eredeti kifejezés; a teszt ellenőrzi, hogy egyenértékű a válasszal     |
| `dc: 10, 11`           | (expr) közömbös sorok az igazságtáblában                                         |
| `! tipp`               | hibás válasz után megjelenő segítség                                             |

Szabályok:

- Változónév: nagybetű, utána számjegyek (`A`, `Q0`, `D3`); egy `table`/`expr` kérdésben 1–5 bemenet.
- Műveletek: negálás `'` vagy felülvonás (`A̅`), ÉS `·` vagy `*` vagy egymás mellé írás, VAGY `+`,
  KIZÁRÓ VAGY `⊕`, egyenértékűség `⊙`.
- A begépelt választ normalizáljuk (kisbetű, szóközök és `_` nélkül, tizedesvessző = pont), ezért a
  `= 25 600` és `= 25600` alakot is érdemes felsorolni.
- A ` ```python run ` példák itt is futnak és tesztelve vannak; a diagramok ` ```text ` blokkban vannak,
  a VHDL/Verilog/XDC kód ` ```vhdl `, ` ```verilog `, ` ```tcl ` blokkban (színezve).
