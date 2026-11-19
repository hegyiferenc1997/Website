---
title: Mélyebben – jelfeldolgozás és hibajavítás számokkal
summary: A mozgóátlag-szűrő frekvenciaválasza (melyik frekvenciát mennyire engedi át) és egy zajos jel megszűrése, fixpontos szorzás-összeadás Q15 formátumban telítéssel, ahogy egy DSP-blokk számol, valamint hány ellenőrzőbit kell az ECC memóriához, és miért 72 bites egy szervermemória szava.
minutes: 40
---

## Amit ebben a leckében megtanulsz

- **kiszámolni**, hogy egy mozgóátlag-szűrő melyik frekvenciát mennyire engedi át, és látni, hogyan tünteti el a zúgást,
- hogyan számol egy DSP-blokk **fixpontos** számokkal (Q15), és miért kell **telítés** a túlcsordulás helyett,
- **kiszámolni**, hány ellenőrzőbit kell egy adott szóhosszhoz ECC-hez – és ebből megérteni, miért 72 bites egy szervermemória szava.

## 1. A mozgóátlag mint szűrő

Az N pontos mozgóátlag a legutóbbi N minta átlagát adja ki: **y[n] = (x[n] + x[n−1] + … + x[n−N+1]) / N**. Ez egy **FIR szűrő**, amelynek minden együtthatója 1/N. De mit csinál a különböző frekvenciákkal? A frekvenciaválasz megmutatja, mennyit enged át belőlük (1 = mindent, 0 = semmit):

```python run
# Mozgóátlag-szűrő mint FIR: hogyan erősít különböző frekvenciákon?
import cmath, math

def fir_erosites(egyutthatok, f, fs):
    # a frekvenciaválasz nagysága: |Σ h[k] · e^(−j·2π·f·k/fs)|
    return abs(sum(h * cmath.exp(-2j * math.pi * f * k / fs) for k, h in enumerate(egyutthatok)))

FS = 1000                                            # Hz, mintavételi frekvencia
for n in [4, 8]:
    h = [1 / n] * n                                  # N pontos mozgóátlag: minden együttható 1/N
    sor = ", ".join(f"{f} Hz: {fir_erosites(h, f, FS):.2f}" for f in [0, 10, 50, 125, 250])
    print(f"{n} pontos mozgóátlag → {sor}")

# Zajos jel szűrése: 10 Hz-es szinusz + 250 Hz-es "zúgás"
jel = [math.sin(2 * math.pi * 10 * n / FS) + 0.5 * math.sin(2 * math.pi * 250 * n / FS) for n in range(40)]
szurt = [sum(jel[n - k] for k in range(4)) / 4 for n in range(3, 40)]
print("\nszűretlen eleje:", " ".join(f"{x:+.2f}" for x in jel[3:11]))
print("4 pontos átlag: ", " ".join(f"{x:+.2f}" for x in szurt[:8]))
```

- A lassú jelek (0–10 Hz) szinte **változatlanul** átjutnak, a gyorsabbak egyre jobban **csillapodnak** – ez egy **aluláteresztő** szűrő.
- A 4 pontos átlag a 250 Hz-et **teljesen kioltja** (0,00): ennek a frekvenciának a periódusa pontosan 4 minta, és 4 egymást követő minta összege mindig 0. A 8 pontos már a 125 Hz-et is kioltja.
- A zajos jel példáján a 250 Hz-es zúgás eltűnik, és csak a 10 Hz-es szinusz marad (egy kis **késéssel**: az átlag „lemarad” a jel mögött, ez minden szűrő ára).

Ha egy hálózati 50 Hz-es zúgást kell eltüntetni, olyan N-t választunk, amelynél az 50 Hz periódusa pontosan N minta – például 1000 Hz-es mintavételnél **N = 20**. A digitális mérlegek, hőmérők és sok szenzor pontosan ilyen egyszerű átlagolással szűri a kijelzett értéket.

## 2. Fixpontos aritmetika: így számol egy DSP-blokk

A lebegőpontos szorzó nagy és drága. A DSP-k és az FPGA-k DSP-blokkjai ezért gyakran **fixpontos** számokkal dolgoznak. A **Q15** formátum egy 16 bites egész számot −1 … +1 közötti törtként értelmez: az érték = egész / 32 768. Két Q15 szám szorzata Q30 lesz, és a szorzatokat egy **széles akkumulátor** gyűjti (szorzás-összeadás, _MAC_):

```python run
# Fixpontos szorzás-összeadás (MAC) Q15 formátumban, ahogy egy DSP-blokk számol
def q15(x):
    return max(-32768, min(32767, round(x * 32768)))  # −1 ≤ x < 1 → 16 bites egész, telítéssel

def q15_vissza(n):
    return n / 32768

minta = [0.5, -0.25, 0.75, 0.125]
egyutthato = [0.3, 0.3, 0.2, 0.2]

akku = 0                                             # széles (pl. 40 bites) akkumulátor
for x, h in zip(minta, egyutthato):
    akku += q15(x) * q15(h)                          # egész szorzás: Q15 · Q15 = Q30
fix = akku / 2 ** 30
lebego = sum(x * h for x, h in zip(minta, egyutthato))
print(f"Q15-ben: 0,5 = {q15(0.5)}, −0,25 = {q15(-0.25)}, 0,3 ≈ {q15(0.3)}")
print(f"fixpontos eredmény {fix:.6f}, lebegőpontos {lebego:.6f}, eltérés {abs(fix - lebego):.1e}")

# Telítés kontra túlcsordulás: 0,75 + 0,75 nem fér el a −1…1 tartományban
nyers = (q15(0.75) + q15(0.75) + 32768) % 65536 - 32768   # 16 bites körbefordulás
print(f"0,75 + 0,75 túlcsordulással: {q15_vissza(nyers):+.3f}, telítéssel: {q15_vissza(q15(1.5)):+.3f}")
```

- A fixpontos eredmény csak **10<sup>−5</sup> nagyságrendben** tér el a lebegőpontostól – hangfeldolgozáshoz bőven elég, és a hardver töredék akkora.
- A 0,75 + 0,75 = 1,5 nem fér el a −1 … +1 tartományban. Sima egész túlcsordulásnál az eredmény **−0,5** lesz – egy hangjelben ez egy hatalmas kattanás! Ezért a DSP-k **telítő** aritmetikát használnak: a túl nagy érték a legnagyobb ábrázolhatóra (≈ +1) áll be. Ez is torzítás (a jel „levágódik”), de sokkal kevésbé feltűnő.

Egy 32 együtthatós FIR szűrő 48 kHz-es hangon mintánként 32 MAC-műveletet igényel, azaz másodpercenként **1,5 millió** MAC-ot csatornánként. Egy FPGA-ban több száz DSP-blokk van, mindegyik órajelenként egy MAC-ot végez – ezért tud egy FPGA egyszerre több tucat csatornát valós időben szűrni.

## 3. ECC memória: miért 72 bites a szó?

A 2. témakörben láttad a Hamming(7,4) kódot. A szerverek memóriájában ugyanezt az elvet használják nagyobb szavakra, plusz egy paritásbittel (**SECDED**: egy hibát javít, kettőt jelez). Hány ellenőrzőbit kell m adatbithez? A Hamming-bitek szindrómájának meg kell tudnia nevezni **mind** az m + r bitet, plusz a „nincs hiba” esetet: **2<sup>r</sup> ≥ m + r + 1**.

```python run
# ECC memória: hány ellenőrzőbit kell m adatbithez (Hamming + 1 bit a SECDED-hez)?
def ellenorzo_bitek(m):
    r = 0
    while 2 ** r < m + r + 1:                        # a szindrómának meg kell neveznie minden bitet + "nincs hiba"
        r += 1
    return r

for m in [4, 8, 32, 64, 128]:
    r = ellenorzo_bitek(m)
    print(f"{m:>3} adatbit: {r} Hamming-bit + 1 = {r + 1} ellenőrzőbit (SECDED) → "
          f"{m + r + 1} bites szó, többlet {(r + 1) / m:.1%}")
```

64 adatbithez 7 Hamming-bit + 1 SECDED-bit = **8 ellenőrzőbit** kell, a szó így **72 bites**. Ezért van egy ECC-s memóriamodulon 8 helyett **9 memóriachip** (soronként), és ezért drágább kb. 12,5%-kal. Figyeld meg: minél hosszabb a szó, annál kisebb a **többlet** – 4 adatbitnél még 100%, 128-nál már csak 7%.

Miért kell ez? Egy nagy adatközpontban a kozmikus sugárzás és az elektromos zaj miatt a memóriában **naponta** több bit átbillen. ECC nélkül ezek csendes adatsérülést vagy összeomlást okoznak; ECC-vel a memóriavezérlő menet közben kijavítja őket, és csak naplózza az eseményt. A digitális technika kódjai így védik a felhőben tárolt adataidat.

## Összefoglalás

- A mozgóátlag egy aluláteresztő FIR szűrő; az N pontos átlag kioltja azt a frekvenciát, amelynek periódusa pontosan N minta (és többszöröseit).
- Q15: 16 bites egész, értéke egész / 32 768; a DSP széles akkumulátorral szoroz-összead, és túlcsordulás helyett **telít**.
- ECC: 2<sup>r</sup> ≥ m + r + 1 Hamming-bit + 1 SECDED-bit; 64 adatbit → 8 ellenőrzőbit → 72 bites szó.

## A lecke feladata

```quiz required
? Egy 4 pontos mozgóátlag bemenete: 2, 4, 6, 8. Mennyi a kimenet, amikor mind a négy minta megérkezett?
= 5
! (2 + 4 + 6 + 8) / 4 = 5.

? 1000 Hz-es mintavételnél hány pontos mozgóátlag oltja ki pontosan az 50 Hz-es hálózati zúgást?
= 20
! Az 50 Hz periódusa 20 ms = 20 minta.

? Melyik 16 bites egész szám ábrázolja Q15 formátumban a 0,5-öt?
= 16384
! 0,5 · 32 768 = 16 384.

? Miért használnak a DSP-k telítő aritmetikát?
- mert gyorsabb, mint az összeadás
+ mert túlcsordulásnál a körbeforduló érték (pl. +1,5 → −0,5) hatalmas hibát okozna
- mert így nincs szükség szorzóra
- mert a telítés pontosabb, mint a lebegőpontos számítás
! A telítés is torzít, de sokkal kevésbé feltűnően.

? Hány ellenőrzőbit kell 32 adatbithez SECDED ECC-vel (Hamming-bitek + 1)?
= 7
! 2^6 = 64 ≥ 32 + 6 + 1 = 39, tehát 6 Hamming-bit + 1 = 7.
```
