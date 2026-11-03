---
title: Versenyhelyzet és kölcsönös kizárás
summary: Miért ad rossz eredményt két szál, amely ugyanazt a változót növeli, és hogyan védi ezt a mutex és a szemafor.
minutes: 25
---

## Amit ebben a leckében megtanulsz

- mi a **versenyhelyzet** (_race condition_) és a **kritikus szakasz**,
- milyen **feltételeket** kell teljesítenie egy jó megoldásnak,
- hogyan működik a **mutex**, a **szemafor**, és mi a **termelő–fogyasztó** probléma.

## A versenyhelyzet

Két szál ugyanazt a `szamlalo` változót növeli. A `szamlalo++` a processzor szintjén **három** lépés:

```text
1. betölt:  R ← szamlalo
2. növel:   R ← R + 1
3. visszaír: szamlalo ← R
```

Ha az ütemező rossz pillanatban vált, egy növelés **elvész**:

| Idő | 1. szál               | 2. szál               | szamlalo |
| --- | --------------------- | --------------------- | -------- |
| 1   | betölt (R = 5)        |                       | 5        |
| 2   |                       | betölt (R = 5)        | 5        |
| 3   | növel, visszaír (6)   |                       | 6        |
| 4   |                       | növel, visszaír (6)   | **6** (7 lenne a jó) |

**Versenyhelyzetről** beszélünk, ha az eredmény a szálak **végrehajtási sorrendjétől** függ. Ezek a hibák alattomosak: ritkán, véletlenszerűen jönnek elő.

```c
// Két szál egyenként egymilliószor növel – védelem nélkül ritkán lesz 2000000 az eredmény.
#include <pthread.h>
#include <stdio.h>

long szamlalo = 0;

void *novel(void *arg) {
    for (int i = 0; i < 1000000; i++) szamlalo++;   // kritikus szakasz, védelem nélkül!
    return NULL;
}

int main(void) {
    pthread_t a, b;
    pthread_create(&a, NULL, novel, NULL);
    pthread_create(&b, NULL, novel, NULL);
    pthread_join(a, NULL);
    pthread_join(b, NULL);
    printf("%ld\n", szamlalo);   // pl. 1338204
    return 0;
}
```

## A kritikus szakasz

A **kritikus szakasz** az a kódrész, amely közös adatot ér el. Egy jó megoldás feltételei:

1. **kölcsönös kizárás**: egyszerre legfeljebb **egy** szál lehet a kritikus szakaszban,
2. **haladás**: ha senki sincs bent, a belépni kívánók közül valaki belátható időn belül bejut,
3. **korlátozott várakozás**: senki sem vár örökké (nincs kiéheztetés).

## Mutex

A **mutex** (_mutual exclusion_, kölcsönös kizárás) egy zár: `lock()` – ha szabad, lefoglalja; ha foglalt, a szál **vár**. `unlock()` – elengedi.

```c
pthread_mutex_t zar = PTHREAD_MUTEX_INITIALIZER;

void *novel(void *arg) {
    for (int i = 0; i < 1000000; i++) {
        pthread_mutex_lock(&zar);     // belépés a kritikus szakaszba
        szamlalo++;
        pthread_mutex_unlock(&zar);   // kilépés
    }
    return NULL;
}
```

Most mindig **2000000** lesz az eredmény. A zárolás ára a lassulás, ezért a kritikus szakasz legyen **minél rövidebb**.

## Szemafor

A **szemafor** (Dijkstra, 1965) egy egész számláló két **atomi** (oszthatatlan) művelettel:

- **`wait()`** (P, _down_): csökkenti az értéket; ha negatív lenne (nincs szabad erőforrás), a szál **blokkolódik**.
- **`signal()`** (V, _up_): növeli az értéket, és ha valaki vár, **felébreszt** egyet.

Kezdőértéke az erőforrások száma: egy 3 helyes parkolóhoz `S = 3`. A negyedik autó `wait()`-je már várakoztat. Az 1 kezdőértékű (**bináris**) szemafor úgy működik, mint egy mutex.

## A termelő–fogyasztó probléma

Egy **termelő** elemeket tesz egy véges, N méretű **pufferbe**, a **fogyasztó** kiveszi őket (pl. egy letöltő és egy lejátszó). Három szemafor kell:

- `ures = N` – hány szabad hely van,
- `teli = 0` – hány elem van,
- `mutex = 1` – a puffer kezelése egyszerre csak egynek.

```text
termelő:                    fogyasztó:
  wait(ures)                  wait(teli)
  wait(mutex)                 wait(mutex)
  elem a pufferbe             elem ki a pufferből
  signal(mutex)               signal(mutex)
  signal(teli)                signal(ures)
```

Ha a puffer tele, a termelő a `wait(ures)`-nél vár; ha üres, a fogyasztó a `wait(teli)`-nél.

## Összefoglalás

- Versenyhelyzet: az eredmény a végrehajtási sorrendtől függ; oka a nem atomi műveletek közös adaton.
- A kritikus szakasz feltételei: kölcsönös kizárás, haladás, korlátozott várakozás.
- Mutex: zár (lock/unlock); szemafor: számláló wait/signal műveletekkel.
- A termelő–fogyasztó probléma két számláló és egy mutex szemaforral oldható meg.

## A lecke feladata

```quiz required
? Hogy hívjuk azt a hibát, amikor az eredmény a szálak végrehajtási sorrendjétől függ?
= versenyhelyzet
= race condition
! Tipikusan nem atomi műveletek közös adaton.

? A szamlalo értéke 10. Két szál egyszerre hajtja végre a `szamlalo++` műveletet védelem nélkül, a táblázatban látott rossz sorrendben. Mi lesz az értéke?
= 11
! Mindkét szál 10-et tölt be, és 11-et ír vissza – egy növelés elvész.

? Melyik feltétel mondja ki, hogy egyszerre legfeljebb egy szál lehet a kritikus szakaszban?
+ kölcsönös kizárás
- haladás
- korlátozott várakozás
- öregítés
! Mutual exclusion – innen a mutex neve.

? Egy szemafor kezdőértéke 3. Öt szál egymás után meghívja a `wait()`-et (senki sem hív `signal()`-t). Hány szál blokkolódik?
= 2
! Az első három bejut, a negyedik és ötödik vár.

? A termelő–fogyasztó megoldásban mi a `teli` szemafor kezdőértéke?
+ 0
- 1
- N
- −1
! Kezdetben nincs elem a pufferben.
```
