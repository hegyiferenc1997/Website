---
title: Build rendszerek és kódoptimalizáció
summary: Miért kell a fordítást automatizálni (make, Maven, Gradle, pip), és hogyan gyorsít a fordító és a programozó.
minutes: 15
---

## Amit ebben a leckében megtanulsz

- mi a **build** folyamat, és mire valók a **build rendszerek**,
- milyen **optimalizációkat** végez el automatikusan a fordító,
- hogyan írhatsz te magad hatékonyabb kódot – és mikor ne optimalizálj.

## Mi a build?

Egy valódi program sok forrásfájlból, külső könyvtárakból és erőforrásokból (képek, konfiguráció) áll. A **build** az a folyamat, amely ezekből elkészíti a futtatható vagy telepíthető terméket:

1. függőségek (könyvtárak) letöltése,
2. a forrásfájlok fordítása,
3. linkelés, csomagolás,
4. tesztek futtatása,
5. a kész csomag előállítása (pl. `.exe`, `.jar`, telepítő, Python wheel).

Kézzel ezt minden módosítás után megcsinálni lassú és hibalehetőségekkel teli, ezért **build rendszereket** használunk.

| Eszköz           | Nyelv / terület            | Leíró fájl                           |
| ---------------- | -------------------------- | ------------------------------------ |
| Make             | C, C++ (klasszikus)        | `Makefile`                           |
| CMake            | C, C++ (platformfüggetlen) | `CMakeLists.txt`                     |
| Maven, Gradle    | Java, Kotlin               | `pom.xml`, `build.gradle`            |
| MSBuild / dotnet | C#                         | `.csproj`                            |
| pip, uv, Poetry  | Python                     | `pyproject.toml`, `requirements.txt` |
| npm, pnpm        | JavaScript, TypeScript     | `package.json`                       |

Egy egyszerű `Makefile` részlet:

```text
program: main.o util.o
	gcc -o program main.o util.o

main.o: main.c util.h
	gcc -c main.c
```

A Make csak azt fordítja újra, aminek a forrása megváltozott (**inkrementális build**) – nagy projekteknél ez órákat spórol.

> Ennek a weboldalnak is van build lépése: a `pnpm build` parancs fordítja le és készíti elő a kódot.

## A fordító optimalizációi

A fordító a jelentés megváltoztatása nélkül gyorsabb kódot készít. Néhány tipikus módszer:

- **Konstans összevonás (constant folding):** a `60 * 60 * 24` már fordításkor `86400` lesz.
- **Halott kód eltávolítása:** az a kód, ami soha nem futhat le, kimarad.
- **Függvény beágyazása (inlining):** kis függvények hívása helyére maga a függvénytörzs kerül.
- **Ciklusoptimalizálás:** a ciklusban nem változó számítások kikerülnek a ciklus elé.

A Python fordító is végez konstans összevonást:

```python run
import dis

def masodpercek_egy_napban():
    return 60 * 60 * 24

# A bájtkódban már a kész 86400 szerepel, nem a három szorzás.
dis.dis(masodpercek_egy_napban)
```

C fordítóknál a szintet kapcsolóval adjuk meg: `gcc -O0` (nincs optimalizálás, könnyebb hibakeresés) … `gcc -O3` (erős optimalizálás).

## Amit te tehetsz: jobb algoritmus

A legnagyobb gyorsulás általában nem apró trükkökből, hanem **jobb algoritmusból és adatszerkezetből** jön.

```python run
import time

nevek_lista = [f"user{i}" for i in range(100_000)]
nevek_halmaz = set(nevek_lista)

start = time.perf_counter()
for _ in range(200):
    "user99999" in nevek_lista       # lista: végig kell nézni (O(n))
lista_ido = time.perf_counter() - start

start = time.perf_counter()
for _ in range(200):
    "user99999" in nevek_halmaz      # halmaz: kb. egy lépés (O(1))
halmaz_ido = time.perf_counter() - start

print(f"lista:  {lista_ido:.4f} s")
print(f"halmaz: {halmaz_ido:.6f} s")
```

> **„A korai optimalizálás minden rossz gyökere.”** (Donald Knuth) – Először írj **helyes és olvasható** kódot, mérd meg, hol lassú (profilozás), és csak ott optimalizálj.

## Összefoglalás

- A **build** a forrásból kész terméket állít elő; build rendszerek: Make, CMake, Maven, Gradle, pip, npm.
- A fordító automatikusan optimalizál (konstans összevonás, inlining, halott kód eltávolítása).
- A legnagyobb nyereség a jó algoritmus; optimalizálni csak mérés után érdemes.
