---
title: Mélyebben – felhasználói élmény számokkal
summary: A WCAG kontrasztarány kiszámítása programmal, Fitts és Hick törvénye a gombok és menük tervezésében, hány felhasználóval érdemes tesztelni, és a SUS-pontszám kiértékelése – kis programokkal és interaktív ábrával.
minutes: 45
---

## Amit ebben a leckében megtanulsz

- hogyan **számold ki**, elég-e a kontraszt egy szöveg és a háttere között,
- miért legyenek a fontos gombok **nagyok és közel** (Fitts törvénye), és miért ne legyen túl sok menüpont (Hick törvénye),
- **hány felhasználóval** érdemes egy felületet tesztelni,
- hogyan értékeld ki a **SUS** kérdőívet.

## 1. Kontraszt számokkal

Az alapleckében láttuk, hogy a WCAG minimum **4,5:1** kontrasztarányt ír elő a normál szövegre (nagy szövegnél 3:1-et). De hogyan jön ki ez a szám? A két szín **relatív fényessége** ($L$) alapján: $(L_1 + 0{,}05) / (L_2 + 0{,}05)$, ahol $L_1$ a világosabb.

```python run
# WCAG kontrasztarány két szín között
def fenyesseg(hex_szin):
    r, g, b = (int(hex_szin[i:i + 2], 16) / 255 for i in (1, 3, 5))
    def lin(c):                                   # a képernyő gamma-korrekciójának visszafordítása
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)   # a szem a zöldre a legérzékenyebb

def kontraszt(a, b):
    l1, l2 = sorted([fenyesseg(a), fenyesseg(b)], reverse=True)
    return (l1 + 0.05) / (l2 + 0.05)

parok = [("#000000", "#ffffff"), ("#767676", "#ffffff"), ("#999999", "#ffffff"), ("#ffffff", "#ffcc00"), ("#0b5394", "#ffffff")]
for szoveg, hatter in parok:
    k = kontraszt(szoveg, hatter)
    print(f"{szoveg} a {hatter}-en: {k:5.2f}:1 → {'megfelel (AA)' if k >= 4.5 else 'csak nagy szövegnek' if k >= 3 else 'NEM felel meg'}")
```

Meglepő lehet, hogy a világosszürke (`#999999`) fehéren **nem** felel meg – pedig sok weboldal használja „elegáns” mellékszövegnek. A fehér szöveg sárga háttéren pedig szinte olvashatatlan. **Nézőpontok**: a tervezőnek a halvány szín „letisztult”, egy gyengénlátó felhasználónak, vagy bárkinek napsütésben a telefonján, olvashatatlan. A kontrasztot ezért nem szemre, hanem **mérve** kell ellenőrizni (erre a böngészők fejlesztői eszközei is képesek).

## 2. Fitts és Hick törvénye

**Fitts törvénye** szerint egy célpont (pl. gomb) elérésének ideje annál hosszabb, minél **messzebb** van, és minél **kisebb**:

$$T = a + b \cdot \log_2\left(\frac{D}{W} + 1\right)$$

ahol $D$ a távolság, $W$ a célpont mérete, $a$ és $b$ kísérletileg mért állandók.

```plot
title: Egy gomb eléréséhez szükséges idő (ms) a távolság (px) függvényében
x: 10, 1000
y: 0, 1200
param: w = 40, 10, 200, 10
f: 100 + 150*log2(x/w + 1) # Fitts törvénye, w px széles gombbal
```

A csúszkával a gomb méretét állíthatod: egy 10 px-es gombhoz ugyanakkora távolságról sokkal több idő kell, mint egy 100 px-eshez. Ezért nagyok a mobilos gombok (az irányelvek kb. 44–48 px-es érintési felületet javasolnak), és ezért van a képernyő **szélén** a menü: a szélen „megáll” az egér, ott a célpont gyakorlatilag végtelen nagy.

**Hick törvénye** szerint a döntési idő a választási lehetőségek számának **logaritmusával** nő:

```python run
# Hick törvénye: döntési idő a menüpontok számától függően (szemléltető állandókkal)
from math import log2

a, b = 200, 150                                  # ms
for n in [2, 4, 8, 16, 32]:
    print(f"{n:>2} menüpont: {a + b * log2(n + 1):4.0f} ms")

# Fitts: mennyit nyer egy nagyobb gomb?
for w in [10, 24, 48]:
    print(f"{w:>2} px széles gomb 600 px-ről: {100 + 150 * log2(600 / w + 1):4.0f} ms")
```

A gyakorlati tanulság: a **gyakori** műveletek legyenek nagyok, közel és kevés lehetőség között; a ritkák mehetnek egy „Továbbiak” menübe. Fontos viszont: Hick törvénye a **véletlenszerűen** keresgélt listákra igaz – egy ábécérendbe vagy logikusan csoportosított, ismert menüben a felhasználó nem egyenként mérlegel.

## 3. Hány felhasználóval teszteljünk?

Az alapleckében láttuk a felhasználói tesztet. Jakob Nielsen és Tom Landauer vizsgálata szerint egy tesztelő átlagosan a használhatósági problémák kb. **31%-át** ($L = 0{,}31$) találja meg. $n$ tesztelővel a megtalált problémák aránya:

$$1 - (1 - L)^n$$

```plot
title: A megtalált problémák aránya (%) a tesztelők számának függvényében
x: 0, 15
y: 0, 100
param: l = 0.31, 0.1, 0.6, 0.01
f: 100*(1 - (1 - l)^x) # megtalált problémák
dash: 85 # öt tesztelő kb. ennyit talál
```

```python run
# Megtalált problémák aránya és a tesztelés megtérülése
L = 0.31
elozo = 0
for n in range(1, 11):
    talalt = 1 - (1 - L) ** n
    print(f"{n:>2} tesztelő: {talalt:5.1%} (az utolsó tesztelő hozzájárulása: +{talalt - elozo:5.1%})")
    elozo = talalt
```

Öt tesztelő a problémák kb. 85%-át megtalálja, a hatodik már csak 5%-ot tesz hozzá. Ezért szól a javaslat úgy, hogy **több kis kör** (5 fő, javítás, újabb 5 fő) jobb, mint egy nagy, 15 fős teszt. Két figyelmeztetés: ha a felhasználóid **nagyon különbözők** (pl. diákok és tanárok), csoportonként kell néhány tesztelő; és egy statisztikai összehasonlításhoz (pl. A/B teszt) jóval több ember kell.

## 4. A SUS-kérdőív kiértékelése

A **System Usability Scale** (SUS) egy 10 kérdéses, szabványos kérdőív, 1–5-ös skálával. A páratlan kérdések pozitívak („Könnyűnek találtam a rendszert”), a párosak negatívak („Szükségem lenne segítségre a használatához”). A pontozás:

- páratlan kérdésnél: válasz − 1,
- páros kérdésnél: 5 − válasz,
- az összeget 2,5-del szorozzuk → 0–100 közötti pontszám (a 68 körüli érték átlagosnak számít).

```python run
# SUS-pontszám kiszámítása, és több válaszadó átlaga
from statistics import mean

def sus(valaszok):
    pont = 0
    for i, v in enumerate(valaszok, start=1):
        pont += (v - 1) if i % 2 == 1 else (5 - v)   # páratlan: pozitív, páros: negatív állítás
    return pont * 2.5

kitoltok = [
    [4, 2, 5, 1, 4, 2, 5, 2, 4, 1],
    [3, 3, 4, 2, 3, 3, 4, 2, 3, 2],
    [5, 1, 5, 1, 5, 1, 5, 1, 5, 1],
    [2, 4, 3, 4, 2, 3, 3, 4, 2, 4],
]
pontok = [sus(v) for v in kitoltok]
print("egyéni pontszámok:", pontok)
atlag = mean(pontok)
print(f"átlag: {atlag:.1f} → {'átlag feletti' if atlag > 68 else 'átlag alatti'} használhatóság")
```

A SUS egyetlen számban mutatja a felhasználók **érzését**, ezért jól követhető, hogy egy átalakítás javított-e. De nem mondja meg, **mi** a gond – ehhez a megfigyelés és a „hangos gondolkodás” kell. A két módszer együtt adja a teljes képet: a szám a „mennyire”, a megfigyelés a „miért”.

| Nézőpont             | Mit jelent neki a jó UX?                                                                |
| -------------------- | --------------------------------------------------------------------------------------- |
| **felhasználó**      | gyorsan és hiba nélkül eléri a célját, nem kell gondolkodnia                            |
| **akadálymentesség** | gyengénlátók, színtévesztők, billentyűzetes és képernyőolvasós használók is boldogulnak |
| **fejlesztő**        | következetes komponensek, kevesebb hibabejelentés                                       |
| **üzlet**            | több befejezett vásárlás vagy regisztráció, kevesebb ügyfélszolgálati hívás             |

## Összefoglalás

- A kontrasztarány a két szín relatív fényességéből számolható; normál szövegnél legalább 4,5:1 kell.
- Fitts törvénye: a nagy, közeli célpont gyorsabban elérhető; Hick törvénye: a döntési idő a lehetőségek számának logaritmusával nő.
- Egy tesztelő a problémák kb. 31%-át találja meg; öttel kb. 85%-ot – ezért jobb több kis tesztkör.
- A SUS 0–100-as pontszámot ad (68 körül átlagos); a „miért”-et a megfigyelés mutatja meg.

## A lecke feladata

```quiz required
? A WCAG szerint legalább mekkora kontrasztarány kell normál méretű szövegnél? (tizedes törtként, a „:1” nélkül)
= 4,5
= 4.5
! Nagy szövegnél 3:1 is elég.

? Egy gomb 300 px-re van, és 30 px széles. Mennyi a $\log_2(D/W + 1)$ értéke? (egészre kerekítve)
= 3
! $\log_2(11) \approx 3{,}46$, egészre kerekítve 3.

? Ha egy tesztelő a problémák 31%-át találja meg, kb. hány százalékot talál meg két tesztelő együtt? (egészre)
= 52
! $1 - 0{,}69^2 \approx 0{,}524$.

? Egy SUS-kérdőív minden páratlan kérdésére 5-öt, minden párosra 1-et válaszoltak. Mennyi a pontszám?
= 100
! Minden kérdés 4 pontot ér, $40 \cdot 2{,}5 = 100$.

? Miért kerül gyakran a képernyő szélére a menü (pl. a macOS menüsora)?
- mert ott szebb
+ mert az egér a szélen megáll, így a célpont gyakorlatilag végtelen nagy, és gyorsan elérhető
- mert a WCAG előírja
- mert ott kevesebb helyet foglal
! Fitts törvénye: a nagyobb célpont gyorsabban elérhető.
```
