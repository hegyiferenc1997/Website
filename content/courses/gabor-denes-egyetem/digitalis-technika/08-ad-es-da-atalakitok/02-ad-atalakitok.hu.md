---
title: AD átalakítók
summary: Mintavevő-tartó áramkör, flash (komparátoros), szukcesszív közelítéses (SAR), integráló (dual-slope) és delta–szigma AD átalakító működése, összehasonlítása.
minutes: 35
---

## Amit ebben a leckében megtanulsz

- mire való a **mintavevő-tartó** áramkör,
- a **flash** (párhuzamos, komparátoros) ADC működését,
- a **szukcesszív közelítéses** (SAR) ADC felező keresését,
- az **integráló** (dual-slope) és a **delta–szigma** (ΔΣ) ADC elvét,
- melyik típus mire való.

## Mintavevő-tartó (sample & hold)

Az átalakítás időbe telik, közben a bemenet nem változhat. A **mintavevő-tartó** egy kapcsoló és egy kondenzátor: „mintavétel” fázisban a kondenzátor követi a bemenetet, „tartás” fázisban a kapcsoló nyit, és a kondenzátor **megőrzi a feszültséget** az átalakítás végéig.

## Flash (párhuzamos) ADC

Egy ellenállásosztó létra **2<sup>N</sup> − 1** referenciafeszültséget állít elő, mindegyikhez egy **komparátor** tartozik. Amelyik referencia kisebb a bemenetnél, annak komparátora 1-et ad – a kimenet egy „hőmérő-kód” (pl. 0000111), amelyből egy **prioritáskóder** (4. témakör) bináris számot készít.

- **Leggyorsabb** típus: egyetlen lépésben (egy órajel alatt) kész – GS/s sebesség, **videó**, oszcilloszkóp, radar.
- **Hátrány:** a komparátorok száma exponenciálisan nő (8 bit → **255**, 10 bit → 1023 komparátor): nagy chipfelület, fogyasztás, bemeneti kapacitás; a nem sorrendhelyes „buborékos” kód hibákat okozhat.

## Szukcesszív közelítéses (SAR) ADC

Egy **komparátor**, egy **DAC** és egy **SAR regiszter** (successive approximation register) **felező kereséssel** (bináris kereséssel) határozza meg a kódot – bitenként, a legfelső bittől kezdve:

1. A legfelső bitet 1-re állítja (a tartomány fele), a DAC ezt feszültséggé alakítja.
2. A komparátor összeveti a bemenettel: ha a bemenet **nagyobb vagy egyenlő**, a bit **1 marad**, különben **0** lesz.
3. A következő bittel ugyanígy – a keresési tartomány minden lépésben **feleződik**.

N bit → **N lépés** (N órajel).

**Példa** (4 bit, a DAC lépése 1 V, V<sub>in</sub> = 11,3 V):

| lépés | próba | DAC  | V<sub>in</sub> ≥ DAC? | eredmény |
| ----- | ----- | ---- | --------------------- | -------- |
| 1     | 1000  | 8 V  | igen                  | 1xxx     |
| 2     | 1100  | 12 V | nem                   | 10xx     |
| 3     | 1010  | 10 V | igen                  | 101x     |
| 4     | 1011  | 11 V | igen                  | **1011** |

- **Közepes sebesség** (kHz–MS/s), **8–18 bit**, kis fogyasztás → a **mikrokontrollerek** beépített ADC-je szinte mindig SAR.

## Integráló (dual-slope) ADC

A bemenetet **időtartammá** alakítja, amelyet egy számláló mér:

1. **Integrálás:** a bemeneti feszültséget egy integrátor **rögzített ideig** (T<sub>1</sub>) integrálja – a kimenet a bemenettel arányos meredekséggel nő.
2. **Visszaintegrálás:** a bemenet helyére egy ellentétes polaritású, ismert **U<sub>ref</sub>** kerül; az integrátor kimenete **állandó meredekséggel** visszatér nullára.
3. **Időmérés:** a visszaintegrálás T<sub>2</sub> ideje arányos a bemenettel: **V<sub>in</sub> = U<sub>ref</sub> · T<sub>2</sub> / T<sub>1</sub>**. Egy számláló az órajellel méri.

- **Nagyon pontos**, az R és C értéke kiesik a képletből; ha T<sub>1</sub> a hálózati periódus (20 ms) egész számú többszöröse, az **50 Hz-es zavar** kiintegrálódik.
- **Lassú** (néhány–néhány tíz mérés/s) → **digitális multiméterek** (pl. ICL7106/7107 – 3½ digites kijelzőhöz).

## Delta–szigma (ΔΣ) ADC

A **modulátor** a bemenetet nagyon nagy frekvencián (**túlmintavételezés**) hasonlítja össze egy 1 bites DAC visszacsatolt jelével, a különbséget (**delta**) integrálja (**szigma**), és egy **1 bites bitfolyamot** ad ki. A bitfolyamban az 1-esek aránya a bemenet nagyságával arányos. Ezt egy **digitális szűrő** (decimáló szűrő) alakítja lassabb, de **sokbites** (akár **24 bites**) értékké.

- A kvantálási zajt a modulátor a nagy frekvenciák felé „tolja” (**zajformálás**), ahol a digitális szűrő levágja.
- **Nagy felbontás**, kiváló zajelnyomás, de közepes sebesség és késleltetés → **hangtechnika**, precíziós mérés (mérleg, hőmérő).

## Összehasonlítás

| típus          | sebesség           | felbontás | tipikus felhasználás           |
| -------------- | ------------------ | --------- | ------------------------------ |
| **flash**      | leggyorsabb (GS/s) | 6–8 bit   | videó, oszcilloszkóp, radar    |
| **SAR**        | közepes (MS/s)     | 8–18 bit  | mikrokontrollerek, adatgyűjtés |
| **ΔΣ**         | kis–közepes        | 16–24 bit | hang, precíziós mérés          |
| **dual-slope** | lassú (Hz)         | 12–20 bit | multiméter, panelmérő          |

```python run
# Szukcesszív közelítéses ADC szimulációja: felező keresés bitenként
def sar_adc(v_in, v_ref, n):
    kod = 0
    for bit in range(n - 1, -1, -1):          # a legfelső bittől lefelé
        proba = kod | (1 << bit)              # a vizsgált bitet 1-re állítjuk
        dac = proba * v_ref / 2 ** n          # a belső DAC kimenete
        megtart = v_in >= dac
        print(f"próba {proba:0{n}b} → DAC {dac:5.2f} V  {'megtart' if megtart else 'elvet'}")
        if megtart:
            kod = proba
    return kod

kod = sar_adc(11.3, 16.0, 4)
print("eredmény:", f"{kod:04b}")
```

## Összefoglalás

- A mintavevő-tartó az átalakítás idejére rögzíti a bemenetet.
- Flash: 2<sup>N</sup> − 1 komparátor, egy lépés, leggyorsabb, drága.
- SAR: komparátor + DAC + felező keresés, N lépés; mikrokontrollerek.
- Dual-slope: idő mérése, pontos, 50 Hz-et elnyom, lassú; ΔΣ: túlmintavételezés + digitális szűrő, 24 bit.

## A lecke feladata

```quiz required
? Hány komparátor kell egy 8 bites flash ADC-hez?
= 255
! 2^N − 1.

? Hány lépésben (órajel alatt) végez egy 12 bites szukcesszív közelítéses ADC?
= 12

? Egy 4 bites SAR ADC belső DAC-jának lépése 1 V (tehát a kód = volt). A bemenet 6,7 V. Mi az eredmény binárisan?
= 0110
! 1000 (8 V) → elvet; 0100 (4 V) → megtart; 0110 (6 V) → megtart; 0111 (7 V) → elvet.

? Melyik ADC-típus a leggyorsabb?
+ flash
- szukcesszív közelítéses
- dual-slope
- delta–szigma

? Melyik ADC-típust használják a digitális multiméterekben a pontossága és az 50 Hz-es zavar elnyomása miatt?
- flash
- szukcesszív közelítéses
+ integráló (dual-slope)
- R–2R

? Mire való a mintavevő-tartó áramkör?
- Az órajel előállítására.
+ Az átalakítás idejére állandó értéken tartja a bemeneti feszültséget.
- A kimeneti kód tárolására.
- A tápfeszültség stabilizálására.
```
