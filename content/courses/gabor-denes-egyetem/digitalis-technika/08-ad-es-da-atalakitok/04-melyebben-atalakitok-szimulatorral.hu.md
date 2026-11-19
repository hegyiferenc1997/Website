---
title: Mélyebben – AD és DA átalakítók szimulátorral
summary: Az aliasing számokkal (miért látszik egy 7 kHz-es jel 1 kHz-esnek 8 kHz-es mintavételnél), egy szukcesszív közelítéses AD átalakító bitről bitre, a kvantálási zaj szimulálva és összevetve a 6,02·N + 1,76 dB képlettel, valamint egy delta–szigma modulátor, amely egyetlen bitből állít elő analóg értéket.
minutes: 40
---

## Amit ebben a leckében megtanulsz

- **mintánként** látni, hogyan „álcázza” magát egy túl gyors jel lassúnak (aliasing), és kiszámolni a látszólagos frekvenciát,
- végigkövetni egy **SAR** AD átalakító bináris keresését bitről bitre,
- **szimulációval** ellenőrizni, hogy minden plusz bit kb. 6 dB-lel javítja a jel-zaj viszonyt,
- megérteni, hogyan ad egy **delta–szigma** modulátor egyetlen bitből pontos átlagértéket.

## 1. Aliasing mintáról mintára

A Nyquist–Shannon-tétel szerint a mintavételi frekvenciának a jel legnagyobb frekvenciájának **több mint kétszeresének** kell lennie. Mi történik, ha ezt megsértjük? Mintavételezzünk 8 kHz-cel egy 7 kHz-es szinuszt, és vessük össze egy 1 kHz-es (fázisfordított) szinusszal:

```python run
# Aliasing: egy 7 kHz-es és egy 1 kHz-es szinusz 8 kHz-es mintavételezéssel
import math

FS = 8000                                            # Hz, mintavételi frekvencia
def minta(f, n):
    return math.sin(2 * math.pi * f * n / FS)

print(" n |  7 kHz minta | −1 kHz minta")
for n in range(8):
    print(f"{n:>2} | {minta(7000, n):>11.3f} | {minta(-1000, n):>11.3f}")

def latszolagos(f, fs):
    # a mintákból "látszó" frekvencia: a legközelebbi fs-többszöröstől mért távolság
    return abs(f - fs * round(f / fs))

for f in [1000, 3000, 5000, 7000, 9000]:
    print(f"{f:>5} Hz jel {FS} Hz-es mintavétellel → {latszolagos(f, FS):>5} Hz-nek látszik")
```

A két oszlop **mintáról mintára megegyezik**! A mintákból tehát lehetetlen eldönteni, hogy 7 kHz-es vagy 1 kHz-es jelet mértünk – a rekonstrukció az 1 kHz-et fogja visszaadni. Ez az **aliasing** (álnevesülés): a Nyquist-frekvencia (itt 4 kHz) feletti jel „visszahajlik” alá. Szabály: a látszólagos frekvencia = |f − k · f<sub>s</sub>|, ahol k · f<sub>s</sub> a jelhez legközelebbi mintavételi többszörös.

Ugyanez a jelenség, amikor filmen a kocsikerék **visszafelé forog**: a kamera képkockái (mintavétel) túl ritkák a küllők mozgásához képest. Ezért van minden AD átalakító előtt egy **aliasing-szűrő** (aluláteresztő szűrő), amely a Nyquist-frekvencia feletti összetevőket a mintavétel **előtt** levágja – utólag már nem lehet szétválasztani őket.

## 2. A SAR átalakító bitről bitre

A szukcesszív közelítéses (SAR) átalakító **bináris kereséssel** dolgozik, mint a „gondoltam egy számot” játék: az MSB-től kezdve minden bitet próbaképp 1-be állít, a belső DA átalakítóval előállítja a próbafeszültséget, és egy komparátorral eldönti, hogy megtartja-e.

```python run
# Szukcesszív közelítéses (SAR) AD átalakító: bináris keresés bitenként
U_REF = 5.0
BITEK = 8
U_BE = 3.21                                          # V, a mérendő feszültség

kod = 0
for i in reversed(range(BITEK)):                     # az MSB-től az LSB felé
    proba = kod | (1 << i)                           # próbaképp 1-be állítjuk a bitet
    u_dac = proba * U_REF / 2 ** BITEK               # a belső DA átalakító feszültsége
    marad = U_BE >= u_dac                            # komparátor: elég kicsi a próba?
    if marad:
        kod = proba
    print(f"bit {i}: próba {proba:08b} = {u_dac:.4f} V → {'megtart' if marad else 'töröl'}")

print(f"eredmény: {kod:08b} = {kod} → {kod * U_REF / 2 ** BITEK:.4f} V "
      f"(LSB = {U_REF / 2 ** BITEK * 1000:.1f} mV)")
```

8 bithez pontosan **8 lépés** kell (n bithez n), függetlenül a bemenettől. Az eredmény 3,2031 V, a hiba kisebb, mint egy LSB (19,5 mV) – ennél pontosabban 8 biten nem is lehet. Ezért a SAR a mikrokontrollerek tipikus ADC-je: közepesen gyors (néhány MS/s), pontos, kevés áramot fogyaszt. A flash átalakító ezzel szemben **egy lépésben** dönt, de 8 bithez 2<sup>8</sup> − 1 = 255 komparátor kell.

## 3. Minden bit 6 dB – szimulációval

A kvantálás kerekít, és a kerekítési hiba úgy viselkedik, mint egy zaj. Egy teljes kivezérlésű szinusznál a jel-zaj viszony közelítő képlete: **SNR ≈ 6,02 · N + 1,76 dB**. Ellenőrizzük: kvantáljunk egy szinuszt N biten, és mérjük meg, mekkora a hiba teljesítménye a jelhez képest!

```python run
# Kvantálási zaj: szimulált jel-zaj viszony kontra a 6,02·N + 1,76 dB képlet
import math

def snr_db(bitek, mintak=10000):
    szintek = 2 ** bitek
    jel_e = zaj_e = 0.0
    for n in range(mintak):
        x = math.sin(2 * math.pi * n * 0.01234)              # teljes kivezérlésű szinusz (−1…1)
        q = round((x + 1) / 2 * (szintek - 1)) / (szintek - 1) * 2 - 1   # kvantálás
        jel_e += x * x
        zaj_e += (x - q) ** 2                                # a kerekítési hiba = zaj
    return 10 * math.log10(jel_e / zaj_e)

for n in [4, 8, 12, 16]:
    print(f"{n:>2} bit: szimulált SNR ≈ {snr_db(n):5.1f} dB, képlet: {6.02 * n + 1.76:5.1f} dB")
```

A szimuláció tized dB pontossággal egyezik a képlettel. Gyakorlati jelentése:

- **8 bit** (~50 dB): egyszerű szenzor, telefonos hang régen,
- **16 bit** (~98 dB): CD-minőségű hang – a halk és a hangos rész közötti különbség nagyobb, mint egy csendes szoba és egy rockkoncert között,
- **24 bit** (~146 dB elméletileg): stúdió – itt már az analóg áramkörök zaja a korlát, nem a bitszám.

Minden plusz bit **megduplázza** a szintek számát, és ez **6 dB** javulás (20 · lg 2 ≈ 6,02).

## 4. Delta–szigma: egy bit, de nagyon gyorsan

A delta–szigma átalakító fordított stratégiát követ: **egyetlen bites** kvantálót használ, de sokkal gyorsabban mintavételez, mint ami szükséges (túlmintavételezés), és a hibát folyamatosan **visszacsatolja**. A kimeneti bitfolyam **átlaga** adja a mért értéket:

```python run
# Elsőrendű delta–szigma modulátor: egyetlen bitből "analóg" érték
def delta_szigma(x, n=40):
    integralo, kimenet = 0.0, []
    for _ in range(n):
        bit = 1 if integralo >= 0 else 0             # 1 bites kvantáló (komparátor)
        integralo += x - bit                         # a hibát összegezzük, és visszacsatoljuk
        kimenet.append(bit)
    return kimenet

for x in [0.25, 0.5, 0.8]:
    bitek = delta_szigma(x)
    print(f"bemenet {x:.2f}: {''.join(map(str, bitek))}  → átlag {sum(bitek) / len(bitek):.3f}")
```

A 0,25-ös bemenetnél minden negyedik bit 1, a 0,8-nál öt bitből négy – az átlag **pontosan** a bemenet. Ha ezt a bitfolyamot egy digitális szűrő átlagolja (és ritkítja), nagy felbontású számot kapunk. Ezért delta–szigma a legtöbb **hangkártya** és precíziós mérőeszköz átalakítója: egyszerű analóg rész (egy komparátor és egy integráló), a pontosságot a digitális feldolgozás adja. Vedd észre a rokonságot a PWM-mel (1. témakör): ott is 0-k és 1-ek átlaga ad analóg értéket.

## Összefoglalás

- Aliasing: a Nyquist-frekvencia feletti jel **visszahajlik**; látszólagos frekvencia = |f − k · f<sub>s</sub>|. Ellene csak a mintavétel **előtti** szűrő véd.
- SAR: bináris keresés, n bithez n lépés; a flash egy lépés, de 2<sup>n</sup> − 1 komparátor.
- SNR ≈ 6,02 · N + 1,76 dB: minden bit kb. **6 dB**.
- Delta–szigma: 1 bites kvantáló + túlmintavételezés + visszacsatolás; a bitfolyam átlaga a mért érték.

## A lecke feladata

```quiz required
? Egy 9 kHz-es szinuszt 8 kHz-cel mintavételezünk. Hány Hz-esnek látszik a mintákból?
= 1000
! |9000 − 1 · 8000| = 1000 Hz.

? Hány lépésben (komparátor-döntésben) végez egy 12 bites SAR átalakító?
= 12
! n bithez n lépés, az MSB-től az LSB-ig.

? Kb. mekkora egy ideális 12 bites átalakító jel-zaj viszonya (dB, egészre kerekítve)?
= 74
! 6,02 · 12 + 1,76 ≈ 74 dB.

? Mi történik a kvantálási jel-zaj viszonnyal, ha a bitszámot eggyel növeljük?
- megduplázódik
+ kb. 6 dB-lel javul
- kb. 3 dB-lel romlik
- nem változik
! A szintek száma duplázódik: 20 · lg 2 ≈ 6 dB.

? Egy delta–szigma modulátor kimenete: 1011 1011 1011 1011 (16 bit). Mekkora a bemenet (a 0…1 tartományban, tizedes alakban)?
= 0.75
= 0,75
! 16 bitből 12 darab 1-es: 12 / 16 = 0,75.
```
