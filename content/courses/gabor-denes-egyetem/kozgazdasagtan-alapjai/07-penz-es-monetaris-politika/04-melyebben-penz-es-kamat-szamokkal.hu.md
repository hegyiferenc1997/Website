---
title: Mélyebben – pénz és kamat számokkal
summary: A pénzteremtés körről körre (és mi csökkenti a multiplikátort), a mennyiségi egyenlet és miért nem okozott inflációt minden pénznövelés, egy kamatemelés hatása egy változó kamatozású hitelre, és a Taylor-szabály mint a jegybanki döntések ökölszabálya – csúszkás ábrával.
minutes: 40
---

## Amit ebben a leckében megtanulsz

- hogyan **sokszorozza meg** a bankrendszer a pénzt, és mi szab ennek határt,
- mikor vezet a pénzmennyiség növekedése **inflációhoz**, és mikor nem,
- hogyan érinti egy **kamatemelés** egy család havi kiadásait,
- milyen **ökölszabály** szerint gondolkodhat egy jegybank a kamatról.

## 1. Pénzteremtés körről körre

Valaki 1 millió forintot betesz egy bankba. A bank ennek egy részét tartalékban tartja, a többit kihitelezi; a hitelből vásárolnak, az eladó a pénzt beteszi egy (másik) bankba, és a kör újraindul:

```python run
# Pénzteremtés: 1 millió Ft új betét, 10%-os tartalékráta – mennyi pénz lesz belőle?
def penzteremtes(betet, tartalek, keszpenz_arany=0.0, korok=200):
    osszes_betet, kor = 0.0, betet
    for _ in range(korok):
        osszes_betet += kor
        hitel = kor * (1 - tartalek)               # a bank a tartalék feletti részt kihitelezi
        kor = hitel * (1 - keszpenz_arany)          # a hitelből ennyi kerül vissza betétként egy bankba
    return osszes_betet

print(f"10% tartalék, nincs készpénz: {penzteremtes(1e6, 0.10) / 1e6:5.2f} M Ft betét (képlet: 1/0,1 = 10×)")
print(f"10% tartalék, 20% készpénzben marad: {penzteremtes(1e6, 0.10, 0.20) / 1e6:5.2f} M Ft betét")
print(f"20% tartalék, nincs készpénz: {penzteremtes(1e6, 0.20) / 1e6:5.2f} M Ft betét")
```

10%-os tartalékráta mellett az 1 millióból végül 10 millió betét lesz (multiplikátor: $\frac{1}{r}$). Ha azonban a pénz egy része **készpénzben** marad (nem kerül vissza a bankrendszerbe), vagy magasabb a tartalékráta, a multiplikátor sokkal kisebb.

**Modern szemlélet:** a valóságban a bankok nem „várnak” a betétekre: amikor hitelt adnak, azzal egy időben **jön létre** az új betét az ügyfél számláján. A pénzteremtést ezért nem a tartalék, hanem főleg a hitelkereslet, a bank tőkéje és a jegybanki kamat korlátozza. A multiplikátor-modell jó szemléltetés, de nem pontos leírás.

## 2. Mennyiségi egyenlet: több pénz = infláció?

Az $M \cdot V = P \cdot Y$ összefüggés (pénzmennyiség × forgási sebesség = árszint × reál kibocsátás) növekedési ütemekben: $m + v \approx \pi + y$.

```python run
# Mennyiségi egyenlet: M·V = P·Y → növekedési ütemekben: m + v ≈ π + y
penzmennyiseg_nov, forgasi_seb_nov, real_nov = 10.0, 0.0, 3.0   # %/év
inflacio = (1 + penzmennyiseg_nov / 100) * (1 + forgasi_seb_nov / 100) / (1 + real_nov / 100) - 1
print(f"pénzmennyiség +{penzmennyiseg_nov}%, reál GDP +{real_nov}% → infláció ≈ {100 * inflacio:.1f}%")

# Ha válságban a forgási sebesség esik (az emberek tartják a pénzt), a pénznövelés nem okoz inflációt
for v in [0, -5, -10]:
    pi = (1.10) * (1 + v / 100) / 1.0 - 1
    print(f"pénz +10%, forgási sebesség {v:+}%, reál GDP 0% → infláció {100 * pi:5.1f}%")
```

Ha a forgási sebesség állandó, a reál GDP növekedését meghaladó pénznövekedés inflációt okoz. 2008 után és 2020-ban viszont a jegybankok hatalmas mennyiségű pénzt bocsátottak ki, mégsem lett azonnal infláció – mert a **forgási sebesség esett**: a bankok és a cégek tartották a pénzt, nem költötték el. Amikor 2021–2022-ben a kereslet megugrott (és az energiaárak is), az infláció is megjelent. A tanulság: a pénzmennyiség csak **egy** tényező, a viselkedés legalább annyira számít.

## 3. A kamatemelés a konyhaasztalnál

Egy család 15 millió forintos, 20 éves, **változó** kamatozású hitelt vett fel 3%-on. Mi történik, ha az alapkamat emelése miatt a hitel kamata megemelkedik?

```python run
# Kamatemelés a háztartás szemével: változó kamatozású, 15 millió Ft-os, 20 éves hitel
def torleszto(hitel, eves_kamat, ev):
    i, n = eves_kamat / 100 / 12, ev * 12
    return hitel * i / (1 - (1 + i) ** -n)

for kamat in [3, 6, 9, 12]:
    print(f"{kamat:>2}% kamat: havi törlesztő {torleszto(15_000_000, kamat, 20):>9,.0f} Ft")
```

3%-ról 9%-ra emelkedő kamat mellett a havi törlesztő 83 ezerről 135 ezer forintra, **több mint másfélszeresére** nő. Ez a monetáris politika egyik fő csatornája: a drágább hitel visszafogja a fogyasztást és a beruházást, így csökken a kereslet és vele az infláció – de közben sok háztartást nehéz helyzetbe hoz. Ezért vezettek be Magyarországon 2022-ben **kamatstopot**, és ezért ajánlják a fix kamatozású hiteleket.

## 4. A Taylor-szabály

Hogyan dönt egy jegybank a kamatról? John Taylor 1993-ban egy egyszerű képlettel írta le, amit a Fed valójában csinált: a kamat legyen magasabb, ha az infláció a cél fölött van, és ha a gazdaság túlfűtött (pozitív kibocsátási rés):

$$
i = r^* + \pi + 0{,}5(\pi - \pi^*) + 0{,}5 \cdot \text{rés}
$$

```python run
# Taylor-szabály: milyen alapkamatot "javasol" egy egyszerű ökölszabály?
# i = r* + π + 0,5·(π − π*) + 0,5·kibocsátási rés; r* = 2% semleges reálkamat, π* = 3% inflációs cél
def taylor(infl, res, r_semleges=2.0, cel=3.0):
    return r_semleges + infl + 0.5 * (infl - cel) + 0.5 * res

esetek = [("nyugodt idők", 3, 0), ("túlfűtött gazdaság", 6, 2), ("recesszió", 1, -4), ("inflációs sokk", 20, 1)]
for nev, infl, res in esetek:
    print(f"{nev:<20}: infláció {infl:>2}%, rés {res:+}% → javasolt kamat {taylor(infl, res):5.1f}%")
```

A szabály lényege a **Taylor-elv**: ha az infláció 1 százalékponttal nő, a kamatnak **több mint** 1 százalékponttal kell nőnie (itt 1,5-del), különben a reálkamat csökkenne, és tovább fűtené az inflációt. A valóságban a jegybankok nem gépiesen követik a képletet (inflációs sokknál a 31% irreálisan magas lenne), de jó viszonyítási pont.

```plot
title: A Taylor-szabály szerinti kamat az infláció függvényében
x: 0, 20
y: 0, 35
param: g = 0, -4, 4, 0.5
f: 2 + x + 0.5*(x - 3) + 0.5*g # javasolt kamat
dash: x # nulla reálkamat (i = π)
```

A szaggatott vonal alatt a reálkamat negatív: a jegybank ilyenkor még „lazít”, bármilyen magasnak is tűnik a kamat. A csúszkával a kibocsátási rést állíthatod.

## Összefoglalás

- Pénzmultiplikátor: $\frac{1}{r}$, de a készpénztartás és a magasabb tartalék csökkenti; valójában a hitelezés hozza létre a betétet.
- $m + v \approx \pi + y$: a pénznövelés akkor okoz inflációt, ha a forgási sebesség nem esik.
- A kamatemelés a változó kamatozású hitelek törlesztőjén keresztül közvetlenül fogja vissza a keresletet.
- Taylor-szabály: a kamat az inflációnál erősebben reagáljon; a reálkamat számít, nem a nominális.

## A lecke feladata

```quiz required
? Mennyi az egyszerű pénzmultiplikátor 5%-os tartalékráta mellett?
= 20
! $\frac{1}{0{,}05} = 20$.

? A pénzmennyiség évi 8%-kal, a reál GDP 2%-kal nő, a forgási sebesség állandó. Kb. hány százalék az infláció? (egészre kerekítve)
= 6
! $\frac{1{,}08}{1{,}02} - 1 \approx 5{,}9\% \approx 6\%$.

? A Taylor-szabály szerint ($r^* = 2\%$, $\pi^* = 3\%$) mekkora kamat javasolt, ha az infláció 5% és a kibocsátási rés 0?
= 8
! $2 + 5 + 0{,}5 \cdot 2 + 0 = 8\%$.

? Mire számíthatunk egy jelentős jegybanki kamatemelés után?
+ drágulnak a hitelek, lassul a kereslet, a hazai valuta jellemzően erősödik
- olcsóbbak lesznek a hitelek
- nő a beruházás és a fogyasztás
- gyengül a hazai valuta
! A magasabb kamat vonzza a tőkét, és visszafogja a hitelfelvételt.

? Mikor nem vezet a pénzmennyiség növelése inflációhoz a mennyiségi egyenlet szerint?
- ha a reál GDP csökken
+ ha a forgási sebesség hasonló mértékben csökken
- ha a forgási sebesség nő
- soha
! $m + v \approx \pi + y$: ha $v$ ugyanannyival esik, mint amennyivel $m$ nő, $\pi$ nem nő.
```
