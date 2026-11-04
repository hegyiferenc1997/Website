---
title: NoSQL és az adatkezelés szabályai
summary: Dokumentum-, kulcs–érték-, gráf- és oszlopadatbázisok; adatminőség, tranzakciók, mentés, GDPR.
minutes: 16
---

## Amit ebben a leckében megtanulsz

- milyen **NoSQL**-adatbázisok vannak, és mikor jobbak a relációsnál,
- mi a **tranzakció**, és mit jelent az **ACID**,
- melyek az adatkezelés szabályai: **adatminőség**, **mentés**, **GDPR**.

## NoSQL

A **NoSQL** („not only SQL”) adatbázisok nem tábla-alapúak, és rugalmasabb szerkezetet vagy nagyobb skálázhatóságot adnak.

| Típus            | Hogyan tárol?                        | Példa     | Mire jó?                                   |
| ---------------- | ------------------------------------ | --------- | ------------------------------------------ |
| **dokumentum**   | JSON-szerű dokumentumokban           | MongoDB   | változó szerkezetű adatok, webalkalmazások |
| **kulcs–érték**  | kulcshoz tartozó érték, a memóriában | Redis     | gyorsítótár, munkamenetek                  |
| **gráf**         | csúcsok és élek                      | Neo4j     | közösségi háló, ajánlórendszer             |
| **oszlopcsalád** | nagy, elosztott táblák               | Cassandra | hatalmas írási terhelés, idősorok          |

```json
{
  "neptun": "ABC123",
  "nev": "Kiss Anna",
  "targyak": ["Informatika alapjai", "Matematika"],
  "elerhetoseg": { "email": "anna@pelda.hu" }
}
```

Nincs „jobb”: a relációs adatbázis erős a **konzisztenciában** és az összetett lekérdezésekben; a NoSQL a **rugalmasságban** és a **vízszintes skálázásban** (sok szerverre osztva). Sok rendszer mindkettőt használja.

## Tranzakciók és ACID

A **tranzakció** műveletek olyan csoportja, amely **vagy egészben, vagy egyáltalán nem** hajtódik végre. Átutalásnál a pénz levonása az egyik számláról és jóváírása a másikon együtt kell sikerüljön.

| Betű  | Jelentés                    | Röviden                                                     |
| ----- | --------------------------- | ----------------------------------------------------------- |
| **A** | Atomicity (atomosság)       | mind vagy semmi                                             |
| **C** | Consistency (konzisztencia) | a szabályok (kulcsok, megkötések) mindig teljesülnek        |
| **I** | Isolation (elkülönítés)     | a párhuzamos tranzakciók nem zavarják egymást               |
| **D** | Durability (tartósság)      | a jóváhagyott (commit) változás áramszünet után is megmarad |

## Az adatkezelés szabályai

**Adatminőség:** a rossz adatból rossz döntés lesz („garbage in, garbage out”). Ellenőrizd a bevitelt (formátum, kötelező mezők), kerüld a duplikációt, és tartsd naprakészen az adatot.

**Mentés és hozzáférés:** rendszeres, tesztelt mentés (3-2-1 szabály), és csak az férjen hozzá egy adathoz, akinek a munkájához kell.

**GDPR** (az EU általános adatvédelmi rendelete, 2018 óta) a **személyes adatok** (név, e-mail, IP-cím, fénykép…) kezelését szabályozza. Fő elvei:

- **jogalap** kell az adatkezeléshez (pl. hozzájárulás, szerződés),
- **célhoz kötöttség** és **adattakarékosság**: csak a szükséges adatot, csak a megadott célra,
- **korlátozott tárolás**: ne őrizd tovább, mint szükséges,
- az érintett **jogai**: hozzáférés, helyesbítés, **törlés** („elfeledtetés”), adathordozhatóság,
- adatvédelmi incidenst **72 órán belül** jelenteni kell a hatóságnak (Magyarországon a NAIH-nak).

## Összefoglalás

- NoSQL: dokumentum (MongoDB), kulcs–érték (Redis), gráf (Neo4j), oszlopcsalád (Cassandra).
- Tranzakció: mind vagy semmi; ACID = atomosság, konzisztencia, elkülönítés, tartósság.
- Adatkezelés: adatminőség, mentés, jogosultság; GDPR: jogalap, adattakarékosság, törlési jog, 72 órás jelentés.

## A lecke feladata

```quiz required
? Milyen típusú adatbázis a MongoDB?
- relációs
+ dokumentum
- gráf
- kulcs–érték
! JSON-szerű dokumentumokat tárol.

? Melyik ACID-tulajdonság jelenti, hogy a tranzakció „mind vagy semmi”?
+ atomosság
- konzisztencia
- elkülönítés
- tartósság
! Atomicity.

? Hány órán belül kell jelenteni egy adatvédelmi incidenst a GDPR szerint?
= 72
! Magyarországon a NAIH-nak.

? Melyik adatbázis-típus a legalkalmasabb egy közösségi háló ismerősi kapcsolataihoz?
- kulcs–érték
- oszlopcsalád
+ gráf
- táblázatkezelő
! A személyek csúcsok, az ismeretségek élek.
```
