---
title: Hogyan működik az emlékezet?
summary: Munkamemória és hosszú távú memória, kognitív terhelés, a felejtési görbe interaktív ábrán, és miért erősít az ismétlés és a felidézés.
minutes: 20
---

## Amit ebben a leckében megtanulsz

- a **munkamemória** és a **hosszú távú memória** szerepét,
- mi a **kognitív terhelés**,
- mit mutat Ebbinghaus **felejtési görbéje**,
- miért erősíti az emléket az **ismétlés** és a **felidézés**.

## Kétféle memória

| Memória                 | Kapacitás                            | Időtartam           | Példa                                      |
| ----------------------- | ------------------------------------ | ------------------- | ------------------------------------------ |
| **munkamemória**        | nagyon kicsi: egyszerre kb. 4 egység | másodpercek, percek | egy telefonszám fejben tartása tárcsázásig |
| **hosszú távú memória** | gyakorlatilag korlátlan              | akár egy életen át  | az anyanyelved, a ciklus fogalma           |

A tanulás lényege: az információt a szűk munkamemóriából **átjuttatni** a hosszú távú memóriába, és úgy **rendezni**, hogy később elő is tudd hívni.

## Kognitív terhelés

John Sweller kognitív terhelés elmélete szerint a munkamemória könnyen **túlterhelődik**. Ha egyszerre túl sok új dolgot kell feldolgoznod (új szintaxis, új fogalom, új fejlesztőkörnyezet, zajos környezet), nem marad kapacitás a megértésre.

Mit tehetsz?

- **Kis lépésekben** tanulj, egy új dologgal egyszerre.
- Nézz **kidolgozott példákat**, mielőtt egyedül oldasz meg feladatot.
- Szüntesd meg a **zavaró tényezőket** (telefon, értesítések).
- Kapcsold az újat ahhoz, amit **már tudsz** – a meglévő tudás „sémái” tehermentesítik a munkamemóriát.

## A felejtési görbe

Hermann Ebbinghaus német pszichológus az 1880-as években értelmetlen szótagok tanulásával mérte, milyen gyorsan felejtünk. Az eredmény: a felejtés **az elején a leggyorsabb**, aztán lelassul.

Egy egyszerűsített modell: a megtartott tudás aránya $R = e^{-t/S}$, ahol $t$ az eltelt idő (nap), $S$ pedig az emlék **erőssége**. Minél erősebb az emlék, annál lassabban felejtünk.

```plot
title: Felejtési görbe (egyszerűsített modell)
x: 0, 30
y: 0, 100
param: S = 2, 1, 30, 1
f: 100*exp(-x/S) # megtartott tudás (%)
value: megtartott tudás 7 nap után (%) = 100*exp(-7/S)
```

Mozgasd az **S** csúszkát: egyszeri olvasás után az emlék gyenge (kicsi S), és egy hét alatt szinte minden elvész. Minden sikeres **ismétlés és felidézés** növeli az emlék erősségét – a görbe egyre laposabb lesz.

> A pontos számok embertől, anyagtól és értelmességtől függenek. Egy megértett, a meglévő tudáshoz kapcsolt fogalmat sokkal tovább megjegyzünk, mint egy értelmetlen szótagot.

## Miért erősít a felidézés?

Amikor egy emléket **előhívsz** (nem csak újraolvasod), az agy megerősíti a hozzá vezető kapcsolatokat. Ezt nevezik **tesztelési hatásnak** (testing effect): a gyakorló kérdések megválaszolása többet ér, mint ugyanannyi idő újraolvasással.

A „kellemes nehézség” (Robert Bjork: _desirable difficulty_): az a tanulás, amely **kicsit megerőltető** (pl. emlékezetből felidézni, hibázni, javítani), tartósabb tudást ad, mint a kényelmes, „minden ismerősnek tűnik” érzés.

## Összefoglalás

- A munkamemória kicsi és rövid távú, a hosszú távú memória nagy és tartós.
- Kerüld a kognitív túlterhelést: kis lépések, kidolgozott példák, kapcsolódás a meglévő tudáshoz.
- A felejtés az elején a leggyorsabb; az ismétlés és a felidézés erősíti az emléket.
- A felidézés (tesztelési hatás) hatékonyabb, mint az újraolvasás.

## A lecke feladata

```quiz required
? Nagyjából hány egységet tud egyszerre kezelni a munkamemória?
= 4
! Ezért könnyű túlterhelni.

? Mit mutat Ebbinghaus felejtési görbéje?
- hogy soha nem felejtünk
+ hogy a felejtés az elején a leggyorsabb, utána lelassul
- hogy a felejtés egyenletes
- hogy csak idősebb korban felejtünk
! Ezért kell időben ismételni.

? Melyik tanulási tevékenység erősíti leginkább az emléket?
- a jegyzet többszöri újraolvasása
+ emlékezetből felidézni (pl. gyakorlókérdésekre válaszolni)
- a szöveg kiemelése szövegkiemelővel
- a tankönyv a párna alatt
! Tesztelési hatás.

? Egy új programozási nyelvet, egy új fejlesztőkörnyezetet és egy új algoritmust próbálsz egyszerre megtanulni, zajos helyen. Mi a fő probléma?
+ a munkamemória kognitív túlterhelése
- a hosszú távú memória megtelt
- túl kevés az új információ
- a felejtési görbe megfordul
! Egyszerre egy új dolog, nyugodt környezetben.
```
