---
title: Gyakorlás – folyamatok és szálak
summary: Ellenőrző kérdések, kísérletek az Ubuntu VM-ben és összefoglaló feladatlap.
minutes: 25
kind: practice
---

## Kísérletek az Ubuntu VM-ben

1. Indíts el három `sleep 600 &` parancsot, majd nézd meg őket: `jobs`, `ps -o pid,ppid,stat,cmd`. Mi a szülőjük PPID-je? (A shelled PID-je: `echo $$`.)
2. Állítsd le az egyiket udvariasan (`kill PID`), egy másikat erőből (`kill -9 PID`). Mit ír ki a shell?
3. Futtasd a `pstree -p $$` parancsot: látod a shelled és a gyerekeit.
4. Nyisd meg a `top` programot, és nyomd meg a **H** billentyűt: szálnézetre vált.

## Ellenőrző kérdések

<details>
<summary>1. Miért ad a fork() mást vissza a szülőnek és a gyereknek?</summary>

Mert a fork után a két folyamat ugyanazt a kódot futtatja ugyanonnan. A visszatérési értékből (szülőnek a gyerek PID-je, gyereknek 0) dönti el a program, hogy melyik ágon folytassa.

</details>

<details>
<summary>2. Miért nem kerül a várakozó folyamat közvetlenül futó állapotba, amikor az I/O befejeződik?</summary>

Mert lehet, hogy éppen egy másik folyamat fut a processzoron. Az I/O végén a folyamat a kész sorba kerül, és az ütemező dönti el, mikor kapja meg újra a CPU-t.

</details>

<details>
<summary>3. Mikor jobb több szál, és mikor több folyamat?</summary>

Szál: ha a részfeladatoknak sok közös adatot kell látniuk, és gyors váltás kell (pl. egy játék rajzolása és fizikája). Folyamat: ha elszigetelés kell – egy hiba ne vigye magával a többit (pl. a Chrome minden fület külön folyamatban futtat).

</details>

<details>
<summary>4. Mi a baj a sok zombi folyamattal?</summary>

Mindegyik elfoglal egy bejegyzést a folyamattáblában (PID-et). Ha a szülő sosem hív wait()-et, elfogyhatnak a PID-ek. Megoldás: a szülő javítása vagy leállítása – ekkor a zombikat a PID 1 örökli és eltakarítja.

</details>

## Összefoglaló feladatlap

```quiz required
? Melyik állapotban van az a folyamat, amely billentyűleütésre vár?
- fut
- kész
+ várakozik (blokkolt)
- új
! Processzort hiába kapna, az eseményre vár.

? Melyik billentyűkombináció küld SIGINT jelzést a terminálban futó programnak?
= Ctrl + C
= ctrl+c
= Ctrl+C
! A Ctrl + Z felfüggeszti (SIGSTOP).

? Hány jelzésszámú (szám) a SIGTERM?
= 15
! A kill parancs alapértelmezett jelzése.

? Melyik parancs mutatja a folyamatokat fa alakban?
+ pstree
- jobs
- kill
- free
! pstree -p a PID-eket is kiírja.

? Egy folyamat 3 szálat indít. Hány veremre (stack) van szükség összesen, a fő szállal együtt?
= 4
! Szálanként egy verem: 1 fő szál + 3 új szál.

? Mi történik, ha egy többszálú folyamat egyik szála érvénytelen memóriacímre ír?
- Csak az a szál áll le.
+ Az egész folyamat összeomlik.
- A kernel átirányítja egy másik címre.
- Semmi, a hibát figyelmen kívül hagyja.
! A szálak közös címtérben futnak, ezért a hiba az egész folyamatot érinti.
```
