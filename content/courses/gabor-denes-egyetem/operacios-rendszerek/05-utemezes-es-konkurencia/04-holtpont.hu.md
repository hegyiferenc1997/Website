---
title: Holtpont
summary: A holtpont négy szükséges feltétele, az erőforrás-foglalási gráf, az étkező filozófusok és a kezelési stratégiák (bankár-algoritmus).
minutes: 25
---

## Amit ebben a leckében megtanulsz

- mi a **holtpont** (_deadlock_), és mi a **négy szükséges feltétele** (Coffman-feltételek),
- hogyan látszik a holtpont egy **erőforrás-foglalási gráfon**,
- hogyan **előzhető meg**, **kerülhető el** (bankár-algoritmus), **észlelhető** és **szüntethető meg**.

## Mi a holtpont?

**Holtpont** akkor van, ha folyamatok egy csoportjában **mindegyik** egy olyan eseményre (erőforrásra) vár, amelyet csak a csoport egy **másik** tagja tudna kiváltani – így soha senki nem halad tovább.

Klasszikus példa két folyamattal és két zárral:

```text
A folyamat:  lock(nyomtató)  →  lock(szkenner)   ← vár, mert B-nél van
B folyamat:  lock(szkenner)  →  lock(nyomtató)   ← vár, mert A-nál van
```

A hétköznapokban: egy kereszteződés, ahol négy autó egyszerre érkezett, és mindenki a jobbról jövőt várja.

## A négy szükséges feltétel (Coffman, 1971)

Holtpont csak akkor alakulhat ki, ha **mind a négy** egyszerre teljesül:

1. **Kölcsönös kizárás**: az erőforrást egyszerre csak egy folyamat használhatja.
2. **Foglalva várakozás** (_hold and wait_): egy folyamat már tart erőforrást, és közben újabbra vár.
3. **Nincs erőszakos elvétel** (_no preemption_): az erőforrást nem lehet elvenni, csak önként adják vissza.
4. **Körkörös várakozás**: van egy P1 → P2 → … → Pn → P1 kör, ahol mindenki a következőnél lévő erőforrásra vár.

## Erőforrás-foglalási gráf

- kör = folyamat, négyzet = erőforrás,
- **erőforrás → folyamat** él: a folyamat **tartja** az erőforrást,
- **folyamat → erőforrás** él: a folyamat **kéri** az erőforrást.

```text
   ┌────┐  tartja   (A)   kéri   ┌────┐
   │ R1 │ ───────►  ( )  ──────► │ R2 │
   └────┘                        └────┘
     ▲                             │
     │ kéri       (B)      tartja  │
     └──────────  ( )  ◄───────────┘
```

Ha minden erőforrásból **egy** példány van, a gráfban lévő **kör** = holtpont.

## Az étkező filozófusok

Öt filozófus ül egy kerek asztalnál, köztük öt villa. Enni csak **két** villával lehet (bal és jobb). Ha mind az öten egyszerre felveszik a **bal** villát, mindenki a jobbra vár → holtpont. Egy megoldás: az egyik filozófus fordított sorrendben (először jobbra) nyúl – ez megtöri a kört.

## Kezelési stratégiák

| Stratégia                | Ötlet                                                                                                                    |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| **megelőzés**            | a négy feltétel közül egyet lehetetlenné teszünk, pl. **rögzített sorrendben** foglaljuk a zárakat (nincs kör)           |
| **elkerülés**            | minden kérésnél ellenőrizzük, hogy **biztonságos** állapotban maradunk-e (bankár-algoritmus)                             |
| **észlelés és feloldás** | engedjük kialakulni, időnként keresünk kört, és egy folyamatot leállítunk vagy visszaléptetünk                           |
| **strucc-algoritmus**    | nem foglalkozunk vele – ritka, és a kezelés drága. A legtöbb asztali OS így tesz, a felhasználó újraindítja a programot. |

### A bankár-algoritmus röviden

Egy állapot **biztonságos**, ha létezik olyan sorrend, amelyben minden folyamat megkaphatja a **maximálisan bejelentett** igényét, és befejeződhet.

Példa: 12 egységnyi erőforrás (pl. 12 szalagos egység).

| Folyamat | Maximum | Most tartja | Még kellhet |
| -------- | ------- | ----------- | ----------- |
| P0       | 10      | 5           | 5           |
| P1       | 4       | 2           | 2           |
| P2       | 9       | 2           | 7           |

Szabad: 12 − (5 + 2 + 2) = **3**.

- P1-nek még 2 kell ≤ 3 → lefut, visszaad 4-et → szabad **5**.
- P0-nak 5 kell ≤ 5 → lefut, visszaad 10-et → szabad **10**.
- P2-nek 7 kell ≤ 10 → lefut.

A **⟨P1, P0, P2⟩** sorrend működik, tehát az állapot **biztonságos**. A bankár egy kérést csak akkor teljesít, ha utána is biztonságos marad az állapot.

## Összefoglalás

- Holtpont: mindenki egy másikra vár, senki sem halad.
- Négy szükséges feltétel: kölcsönös kizárás, foglalva várakozás, nincs elvétel, körkörös várakozás.
- Kezelés: megelőzés (pl. rögzített zársorrend), elkerülés (bankár), észlelés és feloldás, vagy strucc-algoritmus.

## A lecke feladata

```quiz required
? Hány feltételnek kell egyszerre teljesülnie a holtponthoz (Coffman-feltételek)?
= 4
= négy
! Kölcsönös kizárás, foglalva várakozás, nincs elvétel, körkörös várakozás.

? Melyik feltételt szünteti meg, ha minden folyamat ugyanabban a rögzített sorrendben foglalja a zárakat?
- kölcsönös kizárás
- foglalva várakozás
- nincs erőszakos elvétel
+ körkörös várakozás
! Rögzített sorrendnél nem alakulhat ki kör.

? A bankár-példában (12 egység; P0 tart 5-öt, P1 2-t, P2 2-t) hány egység szabad kezdetben?
= 3
! 12 − 9 = 3.

? Melyik folyamat tud elsőként lefutni a példában?
- P0
+ P1
- P2
- egyik sem
! P1-nek még csak 2 egység kell, és 3 szabad.

? Hogy hívják azt a stratégiát, amikor az OS egyszerűen nem foglalkozik a holtponttal?
= strucc-algoritmus
= strucc
= ostrich
! A homokba dugja a fejét – ritka hibára drága lenne a védekezés.
```
