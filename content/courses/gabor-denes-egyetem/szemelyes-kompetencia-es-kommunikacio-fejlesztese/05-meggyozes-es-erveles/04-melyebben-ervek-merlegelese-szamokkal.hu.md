---
title: Mélyebben – érvek mérlegelése számokkal
summary: Mennyit ér egy bizonyíték? Meggyőződés frissítése esélyhányadossal (Bayes), miért nem győz meg egy anekdota, a túlélési torzítás egy startup-statisztikán, a Toulmin-modell hiányzó elemeinek ellenőrzése programmal, és az „acélember” módszer: a másik fél legerősebb érve – kis programokkal és interaktív ábrával.
minutes: 40
---

## Amit ebben a leckében megtanulsz

- hogyan **frissíts** egy meggyőződést egy új bizonyíték erejének megfelelően,
- miért gyenge érv az **anekdota**, és mi a **túlélési torzítás**,
- hogyan ellenőrizd, hogy egy érvből **hiányzik-e** valamelyik Toulmin-elem,
- hogyan érvelj tisztességesen az **acélember** (steelman) módszerrel.

## 1. Mennyit ér egy bizonyíték? Az esélyhányados

A csapatod azon vitatkozik, hogy érdemes-e a régi, saját fejlesztésű bejelentkezést egy kész, bevált könyvtárra cserélni. Kezdetben bizonytalan vagy: 50% esélyt adsz arra, hogy megéri. Aztán bizonyítékok érkeznek. Minden bizonyíték erejét egy **esélyhányadossal** (likelihood ratio) jellemezhetjük:

$$\text{esélyhányados} = \frac{P(\text{ezt látnánk} \mid \text{igaz})}{P(\text{ezt látnánk} \mid \text{hamis})}$$

Ha egy bizonyíték 3-szor valószínűbb akkor, ha az állítás igaz, az esélyhányadosa 3. A Bayes-tétel „esély” alakja nagyon egyszerű: **új esély = régi esély × esélyhányados**, ahol az esély $= p / (1 - p)$.

```python run
# Meggyőződés frissítése esélyhányadosokkal (Bayes-tétel esély alakban)
def frissit(p, esely_hanyados):
    esely = p / (1 - p) * esely_hanyados
    return esely / (1 + esely)

p = 0.50                                     # kezdeti meggyőződés: megéri a csere?
bizonyitekok = [
    ("egy kolléga szerint 'a könyvtárak mindig jobbak'", 1.2),
    ("a könyvtárat 3 éve aktívan karbantartják, 200 közreműködő", 2.0),
    ("a saját kódunkban tavaly 2 biztonsági hibát találtak", 3.0),
    ("a könyvtár nem támogatja az egyik egyedi belépési módunkat", 0.4),
]
print(f"kiindulás: {p:.0%}")
for leiras, eh in bizonyitekok:
    p = frissit(p, eh)
    print(f"{leiras:<58} ×{eh:<4} → {p:.0%}")
```

Figyeld meg:

- A **véleményt** („a könyvtárak mindig jobbak”) alig vesszük figyelembe: ezt akkor is hallanánk, ha nem lenne igaz (esélyhányados ≈ 1).
- Az **ellenbizonyíték** (0,4) csökkenti a meggyőződést, de nem nullázza le – a döntés a bizonyítékok **összességén** múlik.
- A végeredmény nem „igen” vagy „nem”, hanem egy **fokozat**: ez segít abban, hogy ne ragaszkodj görcsösen az álláspontodhoz.

Az ábrán azt látod, hogyan változik a meggyőződés egy adott erősségű bizonyíték hatására a kiinduló értéktől függően:

```plot
title: Meggyőződés a bizonyíték után a kiinduló meggyőződés függvényében
x: 0, 1
y: 0, 1
param: r = 3, 0.1, 10, 0.1
f: r*x/(1 - x + r*x) # meggyőződés a bizonyíték után
f: x # bizonyíték nélkül (változatlan)
```

Ha $r > 1$, a görbe az átló fölött van (a bizonyíték erősíti az állítást), ha $r < 1$, alatta. Az is látszik, hogy **erős előfeltevésen** (0,05 vagy 0,95 közelében) egy közepes bizonyíték keveset változtat – ezért nehéz meggyőzni valakit, aki már „biztos a dolgában”.

> Ez nem azt jelenti, hogy egy vita előtt számolni kell. A szemlélet a lényeg: **kérdezd meg, mennyivel valószínűbb ez a bizonyíték, ha igaz az állítás, mint ha nem.** Ha alig, akkor gyenge érv – akármilyen hangosan mondják.

## 2. Az anekdota és a túlélési torzítás

„Ismerek valakit, aki egyetem nélkül lett szenior fejlesztő, tehát az egyetem felesleges.” Ez **anekdota**: egyetlen eset, amely az általános állításról szinte semmit sem mond. A rokona a **túlélési torzítás**: csak a „túlélőket” látjuk, a kiesőket nem.

Egy cikk szerint „a sikeres startupok 80%-a használt agilis módszertant – tehát az agilis módszer a siker kulcsa”. Nézzük a teljes képet egy kitalált, de jellemző adatsoron:

```python run
# Túlélési torzítás: a sikeresek között gyakori valami – de a sikertelenek között is?
startupok = {  # (agilis-e, sikeres-e): darab
    (True, True): 80, (True, False): 720,
    (False, True): 20, (False, False): 180,
}
sikeresek = startupok[(True, True)] + startupok[(False, True)]
print(f"a sikeresek közül agilis: {startupok[(True, True)] / sikeresek:.0%}")

for agilis in (True, False):
    osszes = startupok[(agilis, True)] + startupok[(agilis, False)]
    print(f"{'agilis' if agilis else 'nem agilis':<11} startupok sikeraránya: {startupok[(agilis, True)] / osszes:.0%}")
```

A sikeresek 80%-a valóban agilis – de **minden** startup 80%-a az, és a sikerarány a két csoportban **ugyanannyi** (10%). Az állítás tehát semmit sem bizonyít. A tanulság: ha valaki a sikeresek közös vonásával érvel, kérdezd meg: **„És a sikertelenek között mennyi volt ilyen?”**

## 3. Hiányzik valami az érvből? Toulmin-ellenőrzés

Az alapleckéből ismert Toulmin-modell elemei: **állítás**, **adat** (bizonyíték), **garancia** (miért következik az adatból az állítás), **alátámasztás** (miért érvényes a garancia), **minősítő** („valószínűleg”, „a legtöbb esetben”) és **ellenvetés** (mikor nem igaz). A hétköznapi érvekből gyakran hiányzik a garancia, a minősítő vagy az ellenvetés:

```python run
# Toulmin-ellenőrzés: melyik elem hiányzik egy érvből?
elemek = ["állítás", "adat", "garancia", "alátámasztás", "minősítő", "ellenvetés"]
fontos = {"állítás", "adat", "garancia"}        # ezek nélkül nincs érv

ervek = {
    "Kód-review kötelezővé tétele": {
        "állítás": "Vezessük be a kötelező kód-review-t.",
        "adat": "Az elmúlt negyedévben 14 hiba jutott élesbe, ebből 9-et egy második szem kiszűrt volna.",
        "garancia": "Ha egy hibatípust egy átnézés nagy eséllyel megfog, az átnézés csökkenti az éles hibákat.",
        "minősítő": "valószínűleg legalább a felére",
        "ellenvetés": "kivéve a sürgős javításokat, ahol utólagos review is elég",
    },
    "Átállás új nyelvre": {
        "állítás": "Írjuk át az egészet Rustban.",
        "adat": "A Rust gyors.",
    },
}
for nev, erv in ervek.items():
    hianyzik = [e for e in elemek if e not in erv]
    sulyos = [e for e in hianyzik if e in fontos]
    print(f"{nev}: hiányzik {hianyzik or 'semmi'}")
    if sulyos:
        print(f"   ⚠ alapelem hiányzik: {sulyos} – így ez még nem érv, csak vélemény")
```

A második „érvből” hiányzik a **garancia**: miért következne abból, hogy a Rust gyors, hogy nekünk át kell írni mindent? Lehet, hogy a mi alkalmazásunk lassúsága az adatbázis-lekérdezésekből jön, és ott a nyelvcsere semmit sem segít. A hiányzó garancia kimondatása („Miért következik ebből, hogy…?”) a legjobb kritikai kérdés.

## 4. Az acélember: érvelj a legerősebb ellenvetés ellen

Az **szalmabáb** érvelési hiba az, amikor a másik fél álláspontjának egy gyenge, eltorzított változatát cáfolod. Az ellentéte az **acélember** (steelman): mielőtt vitatkozol, fogalmazd meg a másik álláspontját **a lehető legerősebb formában** – olyan jól, hogy ő maga is azt mondja: „Igen, pontosan erről van szó.”

Példa egy csapatvitában:

| Szalmabáb                                              | Acélember                                                                                                                                                 |
| ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| „Te azért nem akarsz teszteket írni, mert lusta vagy.” | „Ha jól értem, azt mondod, hogy a demóig két hét van, és a tesztírás most a funkciók elől venné el az időt, a demón pedig a funkciókat fogják értékelni.” |

Az acélember három dolgot ad:

1. A másik fél **meghallgatva érzi magát**, ezért nyitottabb lesz a te érveidre.
2. **Te magad** is jobban megérted a helyzetet – lehet, hogy kiderül: neki van igaza, vagy egy harmadik megoldás a legjobb (pl. csak a kritikus részekre írtok tesztet).
3. Ha a legerősebb ellenérvet is meg tudod válaszolni, a te érvelésed **valóban erős**.

## Összefoglalás

- Egy bizonyíték erejét az esélyhányados méri: mennyivel valószínűbb, ha igaz az állítás; új esély = régi esély × esélyhányados.
- A vélemény és az anekdota gyenge bizonyíték; a sikeresek közös vonása csak akkor érv, ha a sikertelenek között ritkább (túlélési torzítás).
- Egy érvhez állítás, adat és garancia kell; a minősítő és az ellenvetés teszi hitelessé.
- Az acélember módszer: a másik álláspontját a legerősebb formájában fogalmazd meg, mielőtt vitatkozol.

## A lecke feladata

```quiz required
? Kezdetben 50%-ra becsülsz egy állítást (esély 1:1). Érkezik egy bizonyíték, amelynek esélyhányadosa 3. Mekkora lesz a meggyőződésed? (tizedes törtként)
= 0,75
= 0.75
! Új esély $1 \cdot 3 = 3$, tehát $p = 3 / (1 + 3) = 0{,}75$.

? 1000 startupból 800 agilis, ezek közül 80 sikeres. Hány százalék az agilis startupok sikeraránya? (csak a számot írd)
= 10
! $80 / 800 = 10\%$.

? „A Rust gyors, ezért írjuk át az egészet Rustban.” Melyik Toulmin-elem hiányzik a legnyilvánvalóbban?
- az állítás
- az adat
+ a garancia (miért következik az adatból az állítás)
- semmi, ez teljes érv
! Nem derül ki, hogy a mi problémánkat a nyelv gyorsasága oldaná-e meg.

? Melyik az acélember (steelman) módszer?
- a másik fél álláspontjának egy gyenge változatát cáfolni
+ a másik fél álláspontját a lehető legerősebb formában megfogalmazni, mielőtt vitatkozol
- a vitát a másik fél személyének kritizálásával megnyerni
- a saját érvet egyre hangosabban ismételni
! Az acélember a szalmabáb ellentéte.

? Melyik bizonyítéknak a legkisebb az esélyhányadosa (vagyis a leggyengébb támogatás)?
+ egy kolléga általános véleménye, amelyet akkor is hallanánk, ha nem lenne igaz
- egy mért hibastatisztika a saját projektünkből
- egy független biztonsági audit eredménye
- egy kísérleti csapat mérhető eredménye
! Ha egy bizonyítékot igaz és hamis állítás mellett is ugyanúgy látnánk, az esélyhányadosa ≈ 1.
```
