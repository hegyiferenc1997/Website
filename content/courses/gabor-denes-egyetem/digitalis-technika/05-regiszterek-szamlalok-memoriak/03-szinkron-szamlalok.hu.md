---
title: Szinkron számlálók tervezése
summary: Közös órajelű számlálók, a tervezés lépései vezérlési táblával és Karnaugh-táblával, modulo-5 számláló JK flip-flopokkal, tetszőleges sorrendű számláló, önindulás ellenőrzése.
minutes: 40
---

## Amit ebben a leckében megtanulsz

- miben más a **szinkron** számláló, mint az aszinkron,
- a szinkron számláló **tervezésének lépéseit**,
- egy **modulo-5** számláló teljes megtervezését **JK flip-flopokkal**,
- egy **tetszőleges sorrendű** számláló tervezését (intuitív megoldással is),
- hogyan ellenőrzöd, hogy a számláló a **nem használt állapotokból** is visszatalál-e.

## Közös órajel

A **szinkron** számlálóban **minden flip-flop ugyanazt az órajelet** kapja, így egyszerre váltanak. Hogy melyik billen, azt a flip-flopok bemenetei elé tett **kombinációs logika** dönti el a jelenlegi állapot alapján.

- **Előny:** nincs halmozódó késleltetés, nincsenek átmeneti hamis állapotok; a kimenetek egyszerre, egy t<sub>cq</sub> után érvényesek.
- **Ár:** kiegészítő kapuk kellenek.

**4 bites bináris felfelé számláló** T flip-flopokkal: egy bit akkor billen, ha **az összes alatta lévő bit 1**:

T0 = 1, T1 = Q0, T2 = Q1·Q0, **T3 = Q2·Q1·Q0**

(JK flip-floppal ugyanez J = K = T bekötéssel.) Ismert IC-k: **74161** (4 bites bináris, szinkron betöltéssel), **74160** (decimális), **74193** (fel/le).

## A tervezés lépései

1. Az **állapotsorrend** felírása (állapotgráf).
2. A szükséges **flip-flopok száma**: legkisebb n, amelyre 2<sup>n</sup> ≥ N.
3. **Állapottábla**: jelenlegi állapot → következő állapot.
4. Minden flip-flopra a **vezérlési tábla** (előző téma) alapján a szükséges bemenetek (J, K vagy D, T).
5. A **nem használt állapotok** közömbösek (X).
6. **K-táblák**, egyszerűsítés → a bemenetek függvényei.
7. **Kapcsolási rajz**, és az **önindulás** ellenőrzése.

## Példa: modulo-5 számláló JK flip-flopokkal

Sorrend: 000 → 001 → 010 → 011 → 100 → 000. Öt állapothoz 3 flip-flop kell (Q2 Q1 Q0); a 101, 110, 111 nem használt.

A JK vezérlési táblája emlékeztetőül: 0→0: J=0, K=X; 0→1: J=1, K=X; 1→0: J=X, K=1; 1→1: J=X, K=0.

| Q2 Q1 Q0    | következő | J2 K2 | J1 K1 | J0 K0 |
| ----------- | --------- | ----- | ----- | ----- |
| 0 0 0       | 0 0 1     | 0 X   | 0 X   | 1 X   |
| 0 0 1       | 0 1 0     | 0 X   | 1 X   | X 1   |
| 0 1 0       | 0 1 1     | 0 X   | X 0   | 1 X   |
| 0 1 1       | 1 0 0     | 1 X   | X 1   | X 1   |
| 1 0 0       | 0 0 0     | X 1   | 0 X   | 0 X   |
| 1 0 1–1 1 1 | –         | X X   | X X   | X X   |

A K-táblák (sok X-szel) egyszerűsítése után:

- **J0 = Q̅2**, **K0 = 1** (K0 = Q̅2 is jó lenne)
- **J1 = Q0**, **K1 = Q0**
- **J2 = Q1·Q0**, **K2 = 1**

Mindössze **egy ÉS kapu és egy inverter** (Q̅2 a flip-flop negált kimenetéről közvetlenül is vehető).

### Önindulás

Bekapcsoláskor a számláló egy **nem használt** állapotban is lehet. Számoljuk ki a kapott egyenletekkel, hová lép onnan:

- 101 → 010, 110 → 010, 111 → 000

Mindegyik visszatér a számlálási ciklusba, a számláló tehát **önindító**. Ha valamelyik nem használt állapot önmagába vagy egy másik nem használt állapotba vezetne (zárt hurok), a közömbös bejegyzések egy részét rögzítenünk kellene.

## Tetszőleges sorrend: 000 → 010 → 100 → 110

A számláló nem csak egyesével léphet. Ennél a sorrendnél:

- **Q0** mindig 0 → **J0 = 0**, K0 = X (pl. 1)
- **Q1** minden lépésnél vált (0, 1, 0, 1) → billen: **J1 = K1 = 1**
- **Q2** akkor vált, amikor Q1 = 1 → **J2 = K2 = Q1**

Ezt az **intuitív megoldást** a táblázatos módszer is pontosan így adja ki. Valójában ez egy kétbites számláló, amely az 1-es és 2-es bitpozíción számol. Fordított sorrendhez (110 → 100 → 010 → 000) a J2 = K2 = Q̅1 bekötés kell.

## D flip-floppal

D flip-floppal a vezérlési tábla triviális (**D = Q<sup>+</sup>**), így a K-táblákba közvetlenül a következő állapot bitjei kerülnek. Egy 2 bites felfelé számláló: **D0 = Q̅0**, **D1 = Q1 ⊕ Q0**. FPGA-n ezt a megoldást használjuk, mert ott minden flip-flop D típusú.

```python run
# A modulo-5 számláló ellenőrzése a kapott JK egyenletekkel, a nem használt állapotokból is
def jk(j, k, q):
    return (j & (1 - q)) | ((1 - k) & q)

def kovetkezo(s):
    q2, q1, q0 = (s >> 2) & 1, (s >> 1) & 1, s & 1
    j0, k0 = 1 - q2, 1
    j1 = k1 = q0
    j2, k2 = q1 & q0, 1
    return (jk(j2, k2, q2) << 2) | (jk(j1, k1, q1) << 1) | jk(j0, k0, q0)

for s in range(8):
    print(f"{s:03b} → {kovetkezo(s):03b}")
```

## Összefoglalás

- Szinkron számláló: közös órajel, a billenést kombinációs logika vezérli; gyors, nincs átmeneti állapot.
- Tervezés: állapottábla → vezérlési tábla → K-tábla (nem használt állapotok = X) → egyenletek.
- Modulo-5 JK-val: J0 = Q̅2, K0 = 1, J1 = K1 = Q0, J2 = Q1Q0, K2 = 1.
- Mindig ellenőrizd az önindulást!

## A lecke feladata

```quiz required
? A modulo-5 számlálóban a J0 bemenet értékei: 000 → 1, 010 → 1, 100 → 0, a többi sor közömbös. Add meg J0 legegyszerűbb alakját!
expr: Q2, Q1, Q0 -> Q2'
limit: 1
dc: 1, 3, 5, 6, 7
! Az 1-esek mind a Q2 = 0 oldalon vannak, a 0 a Q2 = 1 oldalon.

? A modulo-5 számlálóban J2 csak a 011 állapotban 1, a 000, 001, 010 állapotban 0, a többi közömbös. Add meg J2-t!
expr: Q2, Q1, Q0 -> Q1·Q0
limit: 2
dc: 4, 5, 6, 7

? A modulo-5 számlálóban K1 a 010 állapotban 0, a 011 állapotban 1, a többi közömbös. Add meg K1-et!
expr: Q2, Q1, Q0 -> Q0
limit: 1
dc: 0, 1, 4, 5, 6, 7

? Egy szinkron 4 bites bináris felfelé számlálóban mikor kell a Q3 bitnek billennie? Add meg T3-at!
expr: Q2, Q1, Q0 -> Q2·Q1·Q0
! Egy bit akkor billen, ha az összes alatta lévő bit 1.

? Egy 2 bites szinkron felfelé számlálót D flip-flopokkal építünk. Mi a D1 bemenet függvénye?
expr: Q1, Q0 -> Q1 ⊕ Q0
! Q1 akkor vált, amikor Q0 = 1.

? A megtervezett modulo-5 számláló bekapcsoláskor a nem használt 101 állapotban van. Melyik állapotba lép a következő órajelnél? (Tízes számrendszerben add meg!)
= 2
! J0 = 0, K0 = 1 → Q0 = 0; J1 = K1 = 1 → Q1 billen; J2 = 0, K2 = 1 → Q2 = 0.
```
