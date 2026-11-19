---
title: Mélyebben – írott szövegek ellenőrzése programmal
summary: Olvashatósági mérőszám (LIX) két változaton, egy e-mail-ellenőrző program (tárgysor, kérés az elején, határidő, homályos szavak), commit-üzenetek formai ellenőrzése, és ugyanaz a hiba három címzettnek megírva – kis programokkal.
minutes: 40
---

## Amit ebben a leckében megtanulsz

- hogyan **mérd** egy szöveg olvashatóságát egy egyszerű mutatóval,
- hogyan ellenőrizd programmal egy e-mail **alapvető hibáit**,
- hogyan néz ki egy jól formázott **commit-üzenet**, és hogyan ellenőrzik ezt a csapatok automatikusan,
- hogyan írd meg ugyanazt a hírt **különböző címzetteknek**.

## 1. Mennyire olvasható? A LIX-mutató

A **LIX** (läsbarhetsindex, svéd „olvashatósági index”) egy egyszerű, nyelvfüggetlen mutató: a mondatok átlagos hosszát és a hosszú szavak arányát adja össze:

$$\text{LIX} = \frac{\text{szavak}}{\text{mondatok}} + 100 \cdot \frac{\text{hosszú szavak (7+ betű)}}{\text{szavak}}$$

Durva értelmezés: **40 alatt** könnyű, **40–50** közepes (újságcikk), **50–60** nehéz (szakszöveg), **60 fölött** nagyon nehéz. A magyar nyelv toldalékai miatt a magyar szövegek LIX-értéke általában magasabb, mint az angoloké, ezért leginkább **két változat összehasonlítására** használd.

```python run
# LIX olvashatósági mutató két változatra: hosszú, bonyolult és rövid, egyszerű
import re

def lix(szoveg):
    szavak = re.findall(r"\w+", szoveg)
    mondatok = [m for m in re.split(r"[.!?]+", szoveg) if m.strip()]
    hosszu = [s for s in szavak if len(s) >= 7]
    return len(szavak) / len(mondatok) + 100 * len(hosszu) / len(szavak), len(szavak), len(mondatok)

eredeti = ("Tájékoztatjuk a tisztelt felhasználókat, hogy a rendszer üzemeltetésével kapcsolatos "
           "karbantartási tevékenységek következtében a szolgáltatás elérhetősége a hétvégi "
           "időszakban átmenetileg korlátozottá válhat, amelynek időtartama előreláthatólag "
           "nem haladja meg a négy órát.")
egyszeru = ("Szombaton 8 és 12 óra között karbantartást végzünk. Ilyenkor az oldal nem érhető el. "
            "Délben újra minden működik.")

for nev, szoveg in [("eredeti", eredeti), ("egyszerű", egyszeru)]:
    ertek, sz, m = lix(szoveg)
    print(f"{nev:<9} LIX = {ertek:5.1f}  ({sz} szó, {m} mondat)")
```

Az eredeti egyetlen 30 szavas mondat, tele hosszú, főnevesített szavakkal („üzemeltetésével”, „elérhetősége”). Az egyszerű változat **ugyanazt** mondja – sőt többet: konkrét időpontot ad –, de átlagosan ötször rövidebb mondatokkal (LIX 93 helyett 34). A tanulság: **a pontosság és az egyszerűség nem ellentétei egymásnak**; a homályos hivatali nyelv gyakran kevésbé pontos.

> A LIX nem méri a tartalmat: egy értelmetlen, de rövid mondatokból álló szöveg is jó értéket kaphat. Mutatóként jelzi, hol érdemes átfogalmazni – a döntés a tiéd.

## 2. E-mail-ellenőrző

Az alapleckéből ismert szabályokat (beszédes tárgysor, kérés az elején, konkrét határidő, rövidség) egy program is ellenőrizni tudja. Sok levelezőrendszer és nyelvtani segéd ugyanígy működik:

```python run
# E-mail-ellenőrző: tárgysor, kérés az elején, határidő, homályos szavak, hossz
import re

def ellenoriz(targy, torzs):
    gondok = []
    if len(targy.split()) < 3:
        gondok.append("túl rövid tárgysor – legyen benne a téma és a teendő")
    elso_ket_mondat = " ".join(re.split(r"(?<=[.!?])\s+", torzs.strip())[1:3]).lower()
    if not re.search(r"kér|tudnál|tudná|szükség|jóváhagy|döntés", elso_ket_mondat):
        gondok.append("az elején nem derül ki, mit kérsz (tedd a kérést az első bekezdésbe)")
    if not re.search(r"\b(hétfő|kedd|szerda|csütörtök|péntek|\d{1,2}\.|\d{1,2}:\d{2})", torzs.lower()):
        gondok.append("nincs konkrét határidő")
    homalyos = re.findall(r"\b(asap|minél előbb|valamikor|esetleg|talán)\b", torzs.lower())
    if homalyos:
        gondok.append(f"homályos szavak: {sorted(set(homalyos))}")
    if len(torzs.split()) > 150:
        gondok.append(f"hosszú ({len(torzs.split())} szó) – bontsd pontokba vagy beszéljétek meg")
    return gondok or ["rendben"]

levelek = [
    ("Kérdés", "Szia Péter! A múlt heti megbeszélésen sok mindenről volt szó, a projekt jól halad. "
               "Esetleg ránéznél valamikor a dokumentációra? Köszi!"),
    ("Jóváhagyás kell: API-dokumentáció v2, csütörtökig",
     "Szia Péter! Elkészült az API-dokumentáció második változata. Megkérnélek, hogy csütörtök 12:00-ig "
     "nézd át a 3. fejezetet (hitelesítés), és jelezd, jóváhagyod-e. A linket lent találod."),
]
for targy, torzs in levelek:
    print(f"Tárgy: {targy}")
    for g in ellenoriz(targy, torzs):
        print(f"   → {g}")
```

Az első levél tipikus: a címzett a tárgysorból nem tudja, miről van szó, a kérés a végén bujkál, és a „valamikor” miatt soha nem lesz sürgős. A második levél tárgysora egyedül is elég ahhoz, hogy Péter tudja, **mit, miről és mikorra** kérsz.

## 3. Commit-üzenetek: írásbeli kommunikáció a kódban

A verziókezelő története a csapat **közös naplója**: fél év múlva ebből derül ki, miért változott valami. Sok csapat a **Conventional Commits** formát használja: `típus(hatókör): rövid leírás`, ahol a típus pl. `feat` (új funkció), `fix` (javítás), `docs`, `refactor`, `test`. Ezt egy CI-lépés automatikusan ellenőrizheti:

```python run
# Commit-üzenetek ellenőrzése a Conventional Commits forma szerint
import re

minta = re.compile(r"^(feat|fix|docs|refactor|test|chore)(\([a-z0-9-]+\))?: .{3,72}$")
uzenetek = [
    "fix(login): üres e-mail cím esetén ne dobjon 500-as hibát",
    "feat(foglalas): online lemondás az ügyfélnek",
    "javítások",
    "WIP",
    "docs: README telepítési lépései Windowsra",
    "Fix: valami nem ment, most már megy talán",
]
for u in uzenetek:
    jo = bool(minta.match(u))
    print(f"{'✓' if jo else '✗'} {u}")
```

A „javítások” vagy „WIP” üzenetből fél év múlva senki sem tudja meg, mi történt. A jó commit-üzenet **egy mondatban** mondja meg, mit változtat, és a hatókörrel jelzi, hol. (Az utolsó üzenet nagybetűs `Fix`-szel kezdődik, ezért a szigorú minta elutasítja – és a tartalma is semmitmondó.)

## 4. Egy hír, három címzett

Az éjszaka 40 percig nem működött a foglalórendszer egy hibás adatbázis-frissítés miatt. Ugyanazt a tényt három címzettnek kell megírni – a **piramis-elv** (a lényeg elöl) mindháromnál érvényes, de a lényeg más:

| Címzett             | Mi a lényeg neki?                                         | Részlet                                                                                   | Hangnem                              |
| ------------------- | --------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------ |
| **ügyfelek**        | Érint-e engem? Megmaradt-e a foglalásom? Mit kell tennem? | „A foglalásaid megmaradtak, nincs teendőd.” Technikai ok nélkül.                          | egyszerű, megnyugtató                |
| **vezetőség**       | Mekkora a kár? Megoldódott? Megismétlődhet?               | 40 perc kiesés, kb. 25 elmaradt foglalás, javítva; megelőző lépés: frissítés előtti teszt | tömör, számokkal                     |
| **fejlesztőcsapat** | Mi történt pontosan? Hogyan előzzük meg?                  | a migrációs szkript lépései, naplórészlet, a hiba oka, teendők felelősökkel               | technikai, pontos, hibáztatás nélkül |

Figyeld meg: egyik változat sem „jobb” a másiknál – mindegyik a **címzett kérdésére** válaszol. A leggyakoribb hiba, hogy a fejlesztői változat megy ki az ügyfeleknek (érthetetlen és ijesztő), vagy az ügyfélváltozat a fejlesztőknek (semmit sem lehet belőle tanulni).

## Összefoglalás

- A LIX = átlagos mondathossz + a hosszú szavak százaléka; két változat összehasonlítására hasznos, a rövid mondat és a konkrét szó általában pontosabb is.
- Egy e-mail alapellenőrzése automatizálható: beszédes tárgysor, kérés az elején, konkrét határidő, homályos szavak nélkül.
- A commit-üzenet a csapat közös naplója; a Conventional Commits forma (`típus(hatókör): leírás`) gépileg ellenőrizhető.
- Ugyanazt a hírt címzettenként más lényeggel, részletességgel és hangnemmel írd meg.

## A lecke feladata

```quiz required
? Egy szöveg 100 szóból és 10 mondatból áll, ebből 30 szó hosszú (7+ betű). Mennyi a LIX-értéke?
= 40
! $100 / 10 + 100 \cdot 30 / 100 = 10 + 30 = 40$.

? Melyik a legjobb tárgysor?
- „Kérdés”
- „Szia!”
+ „Jóváhagyás kell: API-dokumentáció v2, csütörtökig”
- „Fontos!!!”
! A tárgysorból kiderül a téma, a teendő és a határidő.

? Melyik commit-üzenet felel meg a Conventional Commits formának?
- „javítások”
- „WIP”
+ „fix(login): üres e-mail cím esetén ne dobjon 500-as hibát”
- „Fix: valami nem ment”
! típus(hatókör): rövid leírás – kisbetűs típussal.

? Egy éjszakai kiesésről az ügyfeleknek írsz. Mi kerüljön az első mondatba?
- a migrációs szkript hibás sora
- a felelős fejlesztő neve
+ hogy a foglalásaik megmaradtak, és nincs teendőjük
- az adatbázis verziószáma
! Az ügyfél kérdése: érint-e engem, és mit kell tennem?

? Mi a gond a „Esetleg ránéznél valamikor a dokumentációra?” mondattal?
- túl udvarias
+ homályos: nincs konkrét kérés és határidő, ezért könnyen elsikkad
- túl rövid
- nincs benne megszólítás
! Az „esetleg” és a „valamikor” miatt soha nem lesz sürgős.
```
