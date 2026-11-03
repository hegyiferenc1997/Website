---
title: Gyakorlás – ütemezés és konkurencia
summary: Ellenőrző kérdések és egy számolós összefoglaló feladatlap ütemezésből, szemaforokból és holtpontból.
minutes: 30
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Miért nem használható a gyakorlatban a tiszta SJF?</summary>

Mert a következő CPU-löket hosszát nem ismerjük előre. Becsülni lehet (pl. a korábbi löketek exponenciális átlagával), de pontosan nem tudható.

</details>

<details>
<summary>2. Mi történik Round Robinnál, ha a kvantum nagyobb, mint a leghosszabb löket?</summary>

Minden folyamat egyetlen kvantumban lefut, és soha nem szakítják meg, tehát az ütemezés pontosan FCFS-sé válik.

</details>

<details>
<summary>3. Miért nem elég egy sima `if (szabad) szabad = false;` a zároláshoz?</summary>

Mert a vizsgálat és a beállítás két külön lépés: két szál is láthatja egyszerre, hogy szabad, és mindkettő belép. Atomi hardverutasítás (pl. test-and-set, compare-and-swap) vagy az OS által adott mutex kell.

</details>

<details>
<summary>4. Mi a különbség a holtpont és a kiéheztetés között?</summary>

Holtpontnál a résztvevők közül senki sem halad, körben várnak egymásra. Kiéheztetésnél a rendszer halad, csak egy (alacsony prioritású) folyamat nem kerül sorra soha.

</details>

<details>
<summary>5. Hogyan töri meg a holtpontot az étkező filozófusoknál, ha legfeljebb négyen ülhetnek le egyszerre?</summary>

Négy filozófus és öt villa esetén legalább egyikük biztosan megkapja mindkét villát, megeszik, és visszaadja őket – így nem alakulhat ki körkörös várakozás.

</details>

## Összefoglaló feladatlap

Három folyamat érkezik a 0. ms-ban ebben a sorrendben: **P1 = 4 ms**, **P2 = 8 ms**, **P3 = 2 ms**.

```quiz required
? Mennyi az összes várakozási idő (ms) FCFS-sel?
= 16
! Várakozás: P1 = 0, P2 = 4, P3 = 12 → 16.

? Mennyi az összes várakozási idő (ms) SJF-fel?
= 8
! Sorrend: P3 (0–2), P1 (2–6), P2 (6–14). Várakozás: 0 + 2 + 6 = 8.

? Mennyi az összes várakozási idő (ms) Round Robinnal, q = 4 ms?
= 14
! P1 0–4, P2 4–8, P3 8–10, P2 10–14. Várakozás: P1 = 0, P2 = 14 − 8 = 6, P3 = 10 − 2 = 8 → 14.

? Egy szemafor kezdőértéke 2. Négy szál hívja a `wait()`-et, majd egy szál a `signal()`-t. Hány szál blokkolt ezután?
= 1
! Ketten bejutnak, ketten várnak; a signal az egyiket felébreszti.

? Melyik NEM a holtpont szükséges feltétele?
- kölcsönös kizárás
- foglalva várakozás
- körkörös várakozás
+ preemptív ütemezés
! A negyedik feltétel a „nincs erőszakos elvétel”.

? Melyik ütemezés adja a legkisebb átlagos várakozási időt, ha a löketeket ismerjük és mindenki egyszerre érkezik?
+ SJF
- FCFS
- Round Robin
- prioritásos, véletlen prioritással
! Bizonyítható, hogy az SJF optimális az átlagos várakozásra.
```
