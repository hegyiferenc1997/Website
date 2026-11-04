# Matematika – tananyag

Ebben a mappában van az 1. féléves Matematika (B-MATEMA) tárgy tananyaga. Indításkor (és
`pnpm db:seed` futtatásakor) az oldal innen tölti be az adatbázisba a témaköröket és a leckéket.

A szerkezet a tantárgyleírás 10 fő témakörét követi: `01-algebrai-alapfogalmak` …
`10-matematikai-modellezes`. Minden témakör végén egy gyakorló lecke van (`kind: practice`) ellenőrző
kérdésekkel és összefoglaló feladatlappal; az utolsó lecke egy vegyes feladatsor a teljes anyagból. A
mappák, a `topic.json` és a lecke fájlok felépítése ugyanaz, mint a Programozási alapoknál (lásd
`../programozas-alapjai/README.md`).

**Szabály:** a tárgy követelményei (jegyszerzés, ZH-k, pontok, aláírás, oktató) soha nem kerülnek a
tananyagba, egyik tárgynál sem.

## Képletek

A leckékben a képleteket LaTeX-szel írjuk, a szerver KaTeX-szel rajzolja ki (így nincs villanás):

- sorközi: `$x^2 + 1$` (a nyitó `$` után és a záró előtt nem lehet szóköz, a záró után nem állhat számjegy),
- kiemelt: `$$ … $$` külön sorokban.

A KaTeX stílusa és betűtípusai csak azokon a leckéken töltődnek be, ahol van képlet.

## Interaktív ábra: ```plot

````markdown
```plot
title: Az eltolt parabola
x: -5, 5
y: -2, 8
param: a = 1, -3, 3, 0.1
f: a*(x - 1)^2 # f(x)
dash: x^2 # alap
tangent: a*(x - 1)^2 @ 2
area: x^2 @ 0, 1
riemann: x^2 @ 0, 1, 8
seq: 1/n @ 1, 30
point: 1, 0 # csúcs
value: f(2) = a
```
````

| Sor                                   | Jelentés                                                     |
| ------------------------------------- | ------------------------------------------------------------ |
| `x:`, `y:`                            | a tengelyek tartománya                                       |
| `param: név = kezdő, min, max, lépés` | csúszka (az `x` és az `n` foglalt név)                       |
| `f:` / `dash:`                        | folytonos / szaggatott görbe, `#` után a felirat             |
| `tangent: kif @ pont`                 | érintő a meredekség kiírásával                               |
| `area: kif @ a, b`                    | terület a görbe alatt, az integrál értékével                 |
| `riemann: kif @ a, b, n`              | n téglalapos közelítő összeg                                 |
| `seq: kif(n) @ n0, n1`                | sorozat pontjai                                              |
| `point: x, y`                         | pont                                                         |
| `value: felirat = kif`                | kiírt érték a csúszkák alatt (csak a paraméterektől függhet) |

A kifejezésekben: `+ - * / ^`, egymás mellé írt szorzás (`2x`, `a sin x`), `|x|`, `sqrt`, `ln`, `lg`,
`log(a, x)`, `e`, `pi`, trigonometrikus és hiperbolikus függvények, `fact`, `binom`, `floor`, `mod`,
`sgn`, és összeg: `sum(k, 1, N, kif)`. A magyar és az angol ábra csak a címben és a feliratokban
különbözhet (a teszt ellenőrzi).

## Kötelező feladat: kvíz

Leckénként pontosan egy ` ```quiz required ` blokk kell. A Digitális technika kvízsorai mellett
(lásd `../digitalis-technika/README.md`) itt van egy új feladattípus is: **függvény beírása**.

````markdown
```quiz required
? Deriváld: $x^2 \sin x$.
fn: x -> 2x sin(x) + x^2 cos(x)
domain: -3, 3

? Számold ki: $\int x\cos x\,dx$.
fn: x -> x sin(x) + cos(x)
+C
```
````

| Sor            | Jelentés                                                                                            |
| -------------- | --------------------------------------------------------------------------------------------------- |
| `fn: x -> kif` | a helyes kifejezés; a hallgató bármilyen vele egyenlő alakot beírhat (24 próbapontban vetjük össze) |
| `domain: a, b` | a próbapontok tartománya (alapból −3 … 3), pl. ha a függvény csak `x > 0`-ra értelmes               |
| `+C`           | határozatlan integrál: egy állandó eltérés megengedett                                              |

A rövid számválaszoknál (`=`) tizedes vessző és pont is jó, és ha a válaszban tizedespont vagy
törtvonal van, számként is összevetjük (`0.5` = `1/2` = `0,50`).

A magyar és az angol fájl kvíze ugyanazokat a válaszokat tartalmazza ugyanabban a sorrendben, és minden
`fn` helyes kifejezését önmagával is ellenőrzi a teszt.
