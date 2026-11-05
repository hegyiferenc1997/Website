---
title: A bankrendszer és a pénzteremtés
summary: Hogyan teremtenek pénzt a kereskedelmi bankok? A kétszintű bankrendszer, a hitelezés és a betétek kapcsolata, a tartalékráta és a pénzmultiplikátor, a bankpánik és a betétbiztosítás.
minutes: 25
---

## Amit ebben a leckében megtanulsz

- mi a **kétszintű bankrendszer**,
- mit csinál egy **kereskedelmi bank**,
- hogyan **teremtenek pénzt** a bankok hitelezéssel,
- mi a **tartalékráta** és a **pénzmultiplikátor**,
- miért veszélyes a **bankpánik**, és mit véd a **betétbiztosítás**.

## A kétszintű bankrendszer

| Szint    | Ki?                                  | Feladat                                                                              |
| -------- | ------------------------------------ | ------------------------------------------------------------------------------------ |
| 1. szint | **jegybank** (Magyarországon az MNB) | készpénzkibocsátás, monetáris politika, a bankok bankja, felügyelet                  |
| 2. szint | **kereskedelmi bankok**              | betétgyűjtés, hitelezés, fizetési szolgáltatások a háztartásoknak és a vállalatoknak |

Magyarországon 1987-ben jött létre újra a kétszintű bankrendszer (előtte az MNB volt a jegybank és a kereskedelmi bank egyben).

## Mit csinál egy kereskedelmi bank?

A bank **pénzügyi közvetítő**: összeköti a megtakarítókat és a hitelfelvevőket.

- A betétekért **betéti kamatot** fizet, a hitelekért **hitelkamatot** kér.
- A kettő különbsége (**kamatmarzs**) és a díjak adják a bevételét.
- **Lejárati transzformáció:** rövid lejáratú betétekből hosszú lejáratú hiteleket (pl. 20 éves lakáshitelt) ad – ez hasznos, de kockázatos.

## Hogyan teremtenek pénzt a bankok?

A meglepő igazság: **amikor egy bank hitelt ad, új pénz keletkezik**. A bank nem a betétesek pénzét „adja oda”, hanem a hitelfelvevő számláján jóváír egy új betétet.

**Egyszerűsített példa** 10%-os tartalékrátával:

1. Anna 1 000 000 Ft készpénzt betesz az A bankba.
2. Az A bank 100 000 Ft-ot tartalékban tart, **900 000 Ft-ot** hitelként kiad Bencének.
3. Bence kifizet vele egy szoftverfejlesztőt, aki a B bankba teszi. A B bank ebből 90 000 Ft-ot tartalékol, **810 000 Ft-ot** újra kihitelez.
4. És így tovább…

A végén az összes betét: $1\,000\,000 + 900\,000 + 810\,000 + \dots = 10\,000\,000$ Ft.

## A pénzmultiplikátor

$$ \text{pénzmultiplikátor} = \frac{1}{\text{tartalékráta}} $$

10%-os tartalékrátánál a multiplikátor **10**: 1 Ft új jegybankpénzből elméletben 10 Ft számlapénz lehet.

A valóságban a pénzteremtést nem a tartalékráta korlátozza elsősorban, hanem a **hitelkereslet** (kell, aki felveszi), a bankok **tőkéje** és **kockázatvállalási hajlandósága**, valamint a jegybank **kamatpolitikája**. A hitel visszafizetésekor a pénz megszűnik.

## Bankpánik és betétbiztosítás

Mivel a bankok a betétek nagy részét kihitelezik, egyszerre **nem tudnak mindenkinek** kifizetni. Ha a betétesek elveszítik a bizalmukat, és egyszerre akarják kivenni a pénzüket (**bankroham**), egy egyébként egészséges bank is csődbe mehet – és a pánik átterjedhet más bankokra.

Védőhálók:

- **Betétbiztosítás:** az EU-ban bankonként és betétesenként **100 000 euróig** garantált a betét (Magyarországon az OBA, az Országos Betétbiztosítási Alap fizet).
- **Végső hitelező:** a jegybank válságban likviditást (rövid hitelt) ad a fizetőképes bankoknak.
- **Szabályozás és felügyelet:** tőkekövetelmények (Bázel III), stressztesztek – erről a 11. témakörben lesz szó.

**Példa:** 2023 márciusában a kaliforniai Silicon Valley Bank, a startupok és technológiai cégek kedvelt bankja, napok alatt összeomlott, amikor az ügyfelek egyetlen nap alatt több mint 40 milliárd dollárt próbáltak kivenni – a közösségi média és a mobilbankok miatt a bankroham soha nem látott gyorsasággal zajlott.

## Összefoglalás

- Kétszintű bankrendszer: jegybank + kereskedelmi bankok.
- A bankok pénzügyi közvetítők; bevételük a kamatmarzs és a díjak.
- A hitelezés új számlapénzt teremt; a visszafizetés megszünteti.
- Pénzmultiplikátor = 1 / tartalékráta (elméleti felső határ).
- Bankpánik ellen: betétbiztosítás (100 000 euró), végső hitelező, szabályozás.

## A lecke feladata

```quiz required
? Mi történik a pénzmennyiséggel, amikor egy bank új hitelt folyósít?
+ nő
- csökken
- nem változik
! A hitelfelvevő számláján új betét keletkezik.

? A tartalékráta 20%. Mennyi az egyszerű pénzmultiplikátor?
= 5
! 1 / 0,2.

? Valaki 500 000 Ft-ot betesz egy bankba, a tartalékráta 10%. Legfeljebb mennyit hitelezhet ki ebből a bank az első lépésben (Ft)?
= 450000
! 500 000 − 50 000.

? Meddig garantált az EU-ban egy betét bankonként és betétesenként?
- 10 000 euróig
- 50 000 euróig
+ 100 000 euróig
- korlátlanul
! Magyarországon az OBA fizet.

? Mi a kétszintű bankrendszer első szintje?
+ a jegybank
- a kereskedelmi bankok
- a biztosítók
- a tőzsde
! A bankok bankja.
```
