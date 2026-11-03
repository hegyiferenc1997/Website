---
title: Gyakorlás – fejlesztés és optimalizálás
summary: Mérési gyakorlat a virtuális gépeden, ellenőrző kérdések és összefoglaló feladatlap az Amdahl-törvénnyel.
minutes: 25
kind: practice
---

## Mérési gyakorlat a virtuális gépeden

Indítsd el az 1. témakörben telepített Ubuntu virtuális gépet, és végezd el a lépéseket:

1. `uptime` – jegyezd fel a terhelési átlagot, és vesd össze a VM magjainak számával (`nproc`).
2. `systemd-analyze` és `systemd-analyze blame | head` – mennyi ideig tartott az indulás, és mi volt a leglassabb?
3. `free -h` – mennyi a **used**, a **buff/cache** és az **available** memória?
4. Egy másik terminálban indíts terhelést: `yes > /dev/null` (Ctrl + C állítja le), és figyeld a `top` kimenetét. Melyik oszlop nő?
5. Windows 11 VM-en nyisd meg a Feladatkezelő **Indítás** fülét: mely programok vannak „Magas” hatással?

<details>
<summary>Mire figyelj?</summary>

- 2 magos VM-en a 2,0 körüli terhelési átlag teljes kihasználtságot jelent.
- A `yes` egy magot 100%-ra terhel; a `top`-ban a `us` (felhasználói idő) nő, a terhelési átlag lassan 1-gyel emelkedik.
- Az indulási időt a VM-ben a virtuális lemez sebessége is befolyásolja; SSD-n lévő VM gyorsabban indul.

</details>

## Ellenőrző kérdések

<details>
<summary>1. Miért kerül előbb egy új kernelfunkció az -rc kiadásokba, mint a stabil verzióba?</summary>

Mert a beolvasztási ablak után hetekig csak tesztelés és hibajavítás folyik. A kiadásra jelölt (rc) verziókat sokan kipróbálják, így a hibák még a stabil kiadás előtt kiderülnek.

</details>

<details>
<summary>2. Miért nem érdemes egy lassú gépen „vakon” mindent kikapcsolni?</summary>

Mert lehet, hogy nem az a szűk keresztmetszet, és fontos funkciót (pl. biztonsági frissítést, víruskeresőt) kapcsolsz ki. Előbb mérj, aztán célzottan változtass, egyszerre egy dolgot.

</details>

<details>
<summary>3. Egy program 50%-a soros. Megéri-e 64 magos gépet venni hozzá?</summary>

Nem igazán: az Amdahl-törvény szerint a gyorsulás felső határa 1 / 0,5 = 2, és 64 maggal is csak kb. 1,97-szeres. Előbb a soros részt kell csökkenteni.

</details>

## Összefoglaló feladatlap

```quiz required
? Egy program 90%-a párhuzamosítható. Hányszoros gyorsulást ad 9 mag az Amdahl-törvény szerint?
= 5
! 1 / (0,1 + 0,9/9) = 1 / (0,1 + 0,1) = 5.

? Mennyi ugyanennek a programnak az elméleti felső gyorsulása?
= 10
! 1 / (1 − 0,9) = 10.

? Egy 2 magos gépen a terhelési átlag 2,0. Mit jelent ez?
+ mindkét mag teljesen dolgozik, de nem vár senki
- a gép kétszeresen túlterhelt
- a gép félig terhelt
- a gép áll
! A terhelési átlagot a magok számához kell viszonyítani.

? Mi a Linux swappiness alapértéke Ubuntun?
= 60
! 0 és 200 között állítható.

? Melyik NEM szükséges egy SSD karbantartásához?
+ töredezettségmentesítés
- TRIM
- firmware-frissítés
- elegendő szabad hely
! SSD-n a töredezettség nem lassít, a felesleges írás csak koptatja.
```
