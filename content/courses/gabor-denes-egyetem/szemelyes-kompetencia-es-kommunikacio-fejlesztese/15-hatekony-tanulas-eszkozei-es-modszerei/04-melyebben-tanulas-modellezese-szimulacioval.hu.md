---
title: Mélyebben – a tanulás modellezése szimulációval
summary: Egy egyszerű emlékezetmodell (megtartás és stabilitás), a bifláz és az elosztott ismétlés összevetése a vizsga napján és egy hónappal később, a Leitner-dobozos kártyarendszer szimulációja, és a tanulási módszerek három nézőpontból – kis programokkal és interaktív ábrával.
minutes: 40
---

## Amit ebben a leckében megtanulsz

- hogyan írható le a felejtés egy **stabilitás** nevű mennyiséggel, és mitől nő,
- miért működik a **biflázás** a vizsgán, és miért nem működik utána,
- hogyan működik a **Leitner-doboz**, a kártyás alkalmazások őse,
- miért érdemes a „hatékony tanulás” állításait is **kritikusan** kezelni.

## 1. Egy egyszerű emlékezetmodell: megtartás és stabilitás

Az alapleckében láttuk a felejtési görbét: a megtartott tudás $R = e^{-t/S}$ szerint csökken, ahol $t$ az eltelt idő, $S$ pedig az emlék **stabilitása** (minél nagyobb, annál lassabban felejtünk). A kulcskérdés: **mitől nő a stabilitás?** A kutatások szerint minden sikeres felidézés növeli – és annál jobban, minél **nehezebb** volt a felidézés (minél inkább „felejtőben” volt már az emlék). Ezt nevezik **kívánatos nehézségnek**.

Az ábra azt mutatja, hogyan lassul a felejtés ismétlésenként, ha minden ismétlés $g$-szeresére növeli a stabilitást:

```plot
title: Megtartott tudás (%) ismétlések után (egyszerűsített modell)
x: 0, 30
y: 0, 100
param: g = 2.5, 1, 5, 0.1
f: 100*exp(-x/2) # ismétlés nélkül
f: 100*exp(-x/(2*g)) # 1 ismétlés után
f: 100*exp(-x/(2*g^2)) # 2 ismétlés után
f: 100*exp(-x/(2*g^3)) # 3 ismétlés után
```

Minden ismétlés „kinyújtja” a görbét – ezért lehet az ismétlések között egyre **hosszabb szünetet** tartani. Ez az időközös ismétlés (spaced repetition) matematikai alapja.

## 2. Biflázás vagy elosztott ismétlés?

Szimuláljunk egy tanulót, aki egy anyagot 30 nap múlva vizsgán kell, hogy tudjon. A modellben a stabilitás minden ismétléskor annál jobban nő, minél többet felejtett addigra ($1 - R$):

```python run
# Emlékezetmodell: bifláz vs. elosztott ismétlés – megtartás a vizsga napján és egy hónappal később
from math import exp

def tanul(ismetlesek, kezdo_s=2.0, erosites=4.0):
    # visszaadja a stabilitást és az utolsó ismétlés napját
    s, utolso = kezdo_s, 0
    for nap in ismetlesek:
        r = exp(-(nap - utolso) / s)               # mennyire emlékszik az ismétlés pillanatában
        s = s * (1 + erosites * (1 - r)) + 0.5      # nehezebb felidézés → nagyobb erősödés
        utolso = nap
    return s, utolso

def megtartas(s, utolso, nap):
    return exp(-(nap - utolso) / s)

tervek = {
    "egy napon háromszor (zsúfolt)": [0.1, 0.2, 0.3],
    "bifláz az utolsó 3 napon": [27, 28, 29],
    "elosztott: 1., 3., 7., 14. nap": [1, 3, 7, 14],
    "elosztott + átnézés a 28. napon": [1, 3, 7, 14, 28],
}
for nev, ism in tervek.items():
    s, u = tanul(ism)
    print(f"{nev:<34} vizsganap (30.): {megtartas(s, u, 30):4.0%}   egy hónappal később (60.): {megtartas(s, u, 60):4.0%}")
```

Négy tanulság egy egyszerű modellből (a pontos számok a feltételezésektől függenek, a tendencia viszont a kutatásokkal egyezik):

- Az **egy napon zsúfolt** ismétlés szinte semmit sem ér: az emlék még friss, ezért a felidézés könnyű, és alig erősít.
- A **biflázás** az utolsó napokban a vizsga napján **működik** (magas megtartás) – ezért olyan népszerű. Egy hónappal később viszont az anyag nagy része eltűnt. Egy mérnökinformatikus képzésben ez nagy baj, mert a tárgyak **egymásra épülnek**: amit a matekból elfelejtettél, azt a valószínűségszámításnál újra kell tanulnod.
- Az **elosztott** ismétlés a vizsga napján valamivel gyengébb lehet, de **tartósabb** tudást épít.
- A legjobb a **kombináció**: elosztott ismétlés a félév során, és egy rövid átnézés közvetlenül a vizsga előtt.

## 3. A Leitner-doboz

Sebastian Leitner a hetvenes években papírkártyákkal valósította meg az időközös ismétlést. Öt doboz van, mindegyikhez egy ismétlési gyakoriság (pl. 1, 2, 4, 8, 16 naponta). Ha jól tudod a kártyát, **egy dobozzal feljebb** kerül (ritkábban látod), ha nem, **visszakerül az elsőbe**. A modern kártyás alkalmazások (pl. az Anki) ennek a finomított változatai.

```python run
# Leitner-doboz szimuláció: 30 kártya, 5 doboz, 20 nap
import random

random.seed(7)                                       # ismételhető eredmény
idokoz = [1, 2, 4, 8, 16]                            # dobozonként hány naponta nézzük
tudas = [0.5, 0.7, 0.85, 0.93, 0.97]                 # mekkora eséllyel tudjuk a kártyát az adott dobozban
kartyak = [{"doboz": 0, "kovetkezo": 1} for _ in range(30)]

for nap in range(1, 21):
    mai = [k for k in kartyak if k["kovetkezo"] == nap]
    for k in mai:
        if random.random() < tudas[k["doboz"]]:
            k["doboz"] = min(k["doboz"] + 1, 4)       # tudta: feljebb lép
        else:
            k["doboz"] = 0                            # nem tudta: vissza az elejére
        k["kovetkezo"] = nap + idokoz[k["doboz"]]
    if nap in (1, 5, 10, 15, 20):
        eloszlas = [sum(1 for k in kartyak if k["doboz"] == d) for d in range(5)]
        print(f"{nap:>2}. nap: ma {len(mai):>2} kártya; dobozok: {eloszlas}")
```

Figyeld meg: az első napokban sokat kell ismételni, de ahogy a kártyák felkerülnek a magasabb dobozokba, a napi adag általában **csökken** (néha egy-egy napon több kártya ideje esik egybe) – a nehéz kártyák viszont gyakran visszaesnek, így azokat látod a legtöbbször. Pontosan ez a cél: az időt arra fordítod, **amit még nem tudsz**, nem arra, ami már megy.

## 4. Tanulási módszerek – három nézőpontból

| Nézőpont                    | Mit mond?                                                                                                                                                                                                 |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **A kognitív pszichológia** | A legerősebb bizonyíték a gyakorló tesztelés (aktív felidézés) és az elosztott ismétlés mellett szól (Dunlosky és munkatársai, 2013); az újraolvasás és a kiemelés kevésbé hatékony.                      |
| **A tanuló érzése**         | Az újraolvasás **könnyűnek** és ismerősnek tűnik, ezért azt hisszük, megy; a felidézés **nehéznek** tűnik, ezért úgy érezzük, kevésbé hatékony. Az érzés itt félrevezet.                                  |
| **A kritikus olvasó**       | A kutatások átlagokat mutatnak, és a tárgytól is függ, mi működik (programozni csak programozással lehet megtanulni). Érdemes kipróbálni és mérni: a gyakorló feladatok eredménye a legjobb visszajelzés. |

A „tanulási stílusok” (vizuális, auditív, kinesztetikus) elmélete jó példa arra, miért kell kritikusnak lenni: népszerű, intuitív – de a kutatások nem találtak bizonyítékot arra, hogy a „saját stílusodhoz” igazított tanulás jobb eredményt adna. Ami működik: a **tartalomhoz** illő forma (ábra a gráfhoz, kód a programozáshoz) és az aktív felidézés.

## Összefoglalás

- Egyszerű modell: megtartás $R = e^{-t/S}$; minden sikeres felidézés növeli a stabilitást, annál jobban, minél nehezebb volt (kívánatos nehézség).
- A biflázás a vizsga napján működik, de a tudás gyorsan elillan; az elosztott ismétlés tartós tudást épít; a legjobb a kettő kombinációja.
- A Leitner-dobozban a tudott kártya ritkábban jön elő, a nem tudott visszakerül az elejére – az idő arra megy, amit még nem tudsz.
- A legtöbb bizonyíték az aktív felidézés és az elosztott ismétlés mellett szól; a könnyűség érzése félrevezet, és a népszerű elméleteket (pl. tanulási stílusok) is kritikusan kell kezelni.

## A lecke feladata

```quiz required
? A Leitner-dobozok ismétlési gyakorisága 1, 2, 4, 8 és 16 nap. Egy kártya a 3. dobozba került. Hány nap múlva látod újra?
= 4
! A 3. doboz 4 naponként jön elő.

? A modellben $R = e^{-t/S}$. Mekkora a megtartás, ha $t = S$ (vagyis annyi nap telt el, amennyi a stabilitás)? (két tizedesre kerekítve)
= 0,37
= 0.37
! $e^{-1} \approx 0{,}37$.

? Egy ismétlési ütemterv minden ismétlés után megduplázza a szünetet: 1, 2, 4, 8 nap. Hány nap lesz a következő szünet?
= 16
! $8 \cdot 2 = 16$.

? Miért gyenge módszer egy anyagot egyetlen napon háromszor egymás után átismételni?
- mert túl sok idő
+ mert az emlék még friss, a felidézés könnyű, ezért alig erősíti a stabilitást
- mert háromszor nem lehet ismételni
- nem gyenge, ez a leghatékonyabb módszer
! A kívánatos nehézség hiányzik: a könnyű felidézés keveset erősít.

? Mit mondanak a kutatások a „tanulási stílusokhoz” (vizuális, auditív, kinesztetikus) igazított tanulásról?
- hogy mindenkinek a saját stílusa szerint kell tanulnia
+ hogy nincs bizonyíték arra, hogy a stílushoz igazítás jobb eredményt adna; a tartalomhoz illő forma és az aktív felidézés számít
- hogy csak a vizuális tanulás működik
- hogy a stílusok genetikailag meghatározottak
! Népszerű, de nem igazolt elmélet.
```
