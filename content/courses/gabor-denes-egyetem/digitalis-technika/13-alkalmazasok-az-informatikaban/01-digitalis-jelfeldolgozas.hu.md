---
title: Digitális jelfeldolgozás
summary: A jelfeldolgozó lánc, a jel-zaj viszony decibelben, a zaj színei és hasznos szerepe (dithering, maszkolás, sztochasztikus rezonancia), digitális szűrők (mozgóátlag, FIR), a DSP-hardver: szorzó-összeadó egység, DSP-blokkok az FPGA-ban.
minutes: 40
---

## Amit ebben a leckében megtanulsz

- hogyan épül fel egy **digitális jelfeldolgozó lánc**,
- hogyan számolod ki a **jel-zaj viszonyt** decibelben,
- mik a **zaj színei**, és mikor **hasznos** a zaj (**dithering**),
- hogyan működik egy egyszerű **digitális szűrő** (mozgóátlag, FIR),
- milyen hardver végzi a jelfeldolgozást (**MAC**, **DSP-blokk**).

## A jelfeldolgozó lánc

A **digitális jelfeldolgozás** (DSP – digital signal processing) a valós világ analóg jeleit (hang, kép, rádiójel, szenzorjel) számokká alakítja, számításokkal dolgozza fel, majd szükség esetén visszaalakítja:

```text
érzékelő → erősítő → aluláteresztő → ADC → digitális feldolgozás → DAC → simító szűrő → hangszóró
(mikrofon)            (antialiasing)       (szűrés, tömörítés,               (rekonstrukció)
                                            felismerés)
```

Az ADC-t és a DAC-ot, a mintavételezést és a kvantálást a 8. témakörben tanultad. A digitális feldolgozás előnye, hogy **pontosan megismételhető**, nem öregszik, nem függ a hőmérséklettől, és a feldolgozás módja szoftverből vagy újraprogramozással **megváltoztatható**.

## Jel-zaj viszony decibelben

A **zaj** minden kéretlen jel, amely a hasznos jelre rakódik (1. témakör). A jel minőségét a **jel-zaj viszony** (SNR) méri, **decibelben**:

**SNR<sub>dB</sub> = 10 · log<sub>10</sub>(P<sub>jel</sub> / P<sub>zaj</sub>)**

Ha teljesítmény helyett **feszültségeket** (amplitúdókat) ismersz – a teljesítmény a feszültség négyzetével arányos –:

**SNR<sub>dB</sub> = 20 · log<sub>10</sub>(U<sub>jel</sub> / U<sub>zaj</sub>)**

| teljesítményarány | SNR   |
| ----------------- | ----- |
| 10                | 10 dB |
| 100               | 20 dB |
| 1000              | 30 dB |
| 1 000 000         | 60 dB |

Feszültségben a 10-szeres arány 20 dB. Az ideális N bites ADC kvantálási zajából adódó SNR ≈ 6,02·N + 1,76 dB (8. témakör): a CD 16 bitje ≈ 98 dB.

## A zaj színei

A zajokat a frekvenciaeloszlásuk alapján „színekkel” jellemzik:

- **fehér zaj:** minden frekvenciát **azonos** intenzitással tartalmaz – egyenletesen kitölti a teljes frekvenciasávot. Referenciajelként használják mérésekben (rendszerek frekvenciamenetének vizsgálata), szűrők és algoritmusok tesztelésére (jól modellezi a véletlen zavarokat), és maszkolásra (elfedi a zavaró hangokat).
- **rózsaszín zaj:** a mélyebb hangok erősebbek (a teljesítmény a frekvenciával fordítottan arányos, oktávonként egyforma energia) – az emberi fül számára „kiegyensúlyozottabb”. Koncerttermek, stúdiók akusztikai mérésére, alvássegítő gépekben, fülzúgás kezelésére használják.

## Amikor a zaj hasznos

A zajt általában zavarnak tekintjük, de bizonyos helyzetekben a mesterségesen hozzáadott zaj **javítja** a minőséget:

- **Dithering (árnyalás) képeken:** ha egy képet kevesebb színnel kell megjeleníteni, a sima átmeneteknél csúnya, lépcsőzetes **sávok** (banding) jelennek meg. Finom zaj hozzáadásával a kvantálási hiba „szétszóródik”, a sávok eltűnnek, és a szem sima átmenetet lát.
- **Dithering hangban:** amikor egy 24 bites stúdiófelvételt 16 bitre (CD) alakítanak, a halk részeken a kvantálási hiba a jellel összefüggő, hallható **torzítást** okoz. Egy halk, alig hallható alapzaj hozzáadásával a torzítás egyenletes, kevésbé zavaró zajjá alakul.
- **Textúra:** a teljesen zajmentes digitális képek „műanyagnak” hatnak; kevés szemcsézettség valóságosabbá teszi őket.
- **Sztochasztikus rezonancia:** egy nagyon gyenge, a küszöb alatti jel zaj hozzáadásával mérhetővé válik – a zaj időnként átlöki a küszöbön, mégpedig a jel ütemében. Orvosi alkalmazásokban kutatják.

A dithering lényege a digitális technika nyelvén: a kvantálás **determinisztikus** hibáját (amely mintázatot, sávot, torzítást okoz) **véletlenszerű**, egyenletes zajjá alakítja, amely sokkal kevésbé feltűnő.

## Digitális szűrők

A legegyszerűbb digitális szűrő a **mozgóátlag**: minden kimeneti minta az utolsó néhány bemeneti minta átlaga. Négy mintára:

**y[n] = (x[n] + x[n−1] + x[n−2] + x[n−3]) / 4**

Ez **aluláteresztő** szűrő: a gyors ingadozásokat (zajt) kisimítja, a lassú változásokat átengedi. Pl. a 4, 8, 6, 2 minták átlaga 5.

Általánosan az **FIR** (finite impulse response) szűrő a bemeneti minták **súlyozott** összege:

**y[n] = h<sub>0</sub>·x[n] + h<sub>1</sub>·x[n−1] + … + h<sub>k−1</sub>·x[n−k+1]**

A h együtthatók határozzák meg, milyen szűrő lesz (alul-, felül-, sáváteresztő). Egy k együtthatós (k „tap”-es) FIR szűrő **mintánként k szorzást és összeadást** végez – hardverben a minták egy **léptetőregiszterben** (5. témakör) haladnak végig.

## A DSP hardvere

A jelfeldolgozás alapművelete a **szorzás és összeadás** (MAC – multiply-accumulate): acc ← acc + h·x.

- **DSP-processzorok:** egy órajel alatt egy (vagy több) MAC-műveletet végeznek, speciális címzéssel (körpuffer).
- **FPGA DSP-blokkok:** az FPGA-ban beépített, gyors szorzó-összeadó egységek vannak (9. témakör), akár több ezer. Mivel párhuzamosan működnek, egy FPGA egy órajel alatt több száz MAC-műveletet is elvégezhet – ezért népszerű rádiós, képfeldolgozó és mérőeszközökben.
- **Fixpontos számábrázolás:** a hardveres DSP gyakran nem lebegőpontos, hanem fixpontos számokkal dolgozik (a bináris pont helye rögzített) – kisebb és gyorsabb hardver, de figyelni kell a túlcsordulásra és a kerekítésre.

```python run
# Mozgóátlag-szűrő egy zajos jelen, és az SNR kiszámítása
import math, random

random.seed(1)
jel = [math.sin(2 * math.pi * n / 40) for n in range(200)]      # tiszta szinusz
zajos = [s + random.gauss(0, 0.3) for s in jel]                 # hozzáadott zaj

def mozgoatlag(x, k=4):
    return [sum(x[max(0, n - k + 1): n + 1]) / min(k, n + 1) for n in range(len(x))]

def snr_db(tiszta, mert):
    p_jel = sum(s * s for s in tiszta)
    p_zaj = sum((m - s) ** 2 for s, m in zip(tiszta, mert))
    return 10 * math.log10(p_jel / p_zaj)

szurt = mozgoatlag(zajos, 4)
print(f"SNR szűrés előtt:  {snr_db(jel, zajos):.1f} dB")
print(f"SNR szűrés után:   {snr_db(jel, szurt):.1f} dB")
print("a 4, 8, 6, 2 minták átlaga:", (4 + 8 + 6 + 2) / 4)
print("10 log10(1000) =", 10 * math.log10(1000), "dB")
```

## Összefoglalás

- Lánc: érzékelő → antialiasing szűrő → ADC → digitális feldolgozás → DAC → rekonstrukció.
- SNR = 10·lg(P<sub>jel</sub>/P<sub>zaj</sub>) = 20·lg(U<sub>jel</sub>/U<sub>zaj</sub>) dB.
- Fehér zaj: minden frekvencia egyformán; rózsaszín: mélyebb hangok erősebbek. Dithering: a kvantálási hibát egyenletes zajjá alakítja (sávok, torzítás ellen).
- Mozgóátlag és FIR szűrő: súlyozott összeg, k tap → k MAC mintánként; hardver: DSP-processzor, FPGA DSP-blokkok, fixpontos számok.

## A lecke feladata

```quiz required
? A hasznos jel teljesítménye 1000-szerese a zajénak. Hány dB a jel-zaj viszony?
= 30
! 10 · lg 1000.

? A jel amplitúdója (feszültsége) 10-szerese a zajénak. Hány dB a jel-zaj viszony?
= 20
! Feszültségaránynál 20 · lg.

? Egy négymintás mozgóátlag-szűrő bemenetén az utolsó négy minta 4, 8, 6, 2. Mennyi a kimenet?
= 5

? Hány szorzást végez mintánként egy 8 együtthatós (8 tap-es) FIR szűrő?
= 8

? Mire jó a dithering, amikor egy képet kevesebb színnel jelenítünk meg?
- Növeli a kép felbontását.
+ Finom zajjal szétszórja a kvantálási hibát, így a lépcsőzetes sávok helyett sima átmenetet látunk.
- Tömöríti a képet.
- Eltávolítja a képből az összes zajt.

? Melyik zaj tartalmaz minden frekvenciát azonos intenzitással?
+ fehér zaj
- rózsaszín zaj
- kvantálási zaj
- egyik sem

? Melyik az a művelet, amelyre a DSP-processzorok és az FPGA DSP-blokkjai optimalizálva vannak?
- osztás
+ szorzás és összeadás (MAC)
- karakterlánc-összehasonlítás
- lebegőpontos gyökvonás
```
