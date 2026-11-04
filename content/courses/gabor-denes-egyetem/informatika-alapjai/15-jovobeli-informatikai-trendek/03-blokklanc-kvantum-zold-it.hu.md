---
title: Blokklánc, kvantumszámítógép, zöld informatika
summary: A blokklánc működése és vállalati felhasználása, a kvantumszámítógép és a kvantumbiztos titkosítás, a fenntartható informatika.
minutes: 16
---

## Amit ebben a leckében megtanulsz

- hogyan működik a **blokklánc**, és mire jó a vállalatoknál,
- mi a **kvantumszámítógép**, és miért kell **kvantumbiztos titkosítás**,
- mit jelent a **zöld (fenntartható) informatika**.

## Blokklánc

A **blokklánc** egy **elosztott főkönyv**: sok számítógép (csomópont) őrzi ugyanannak az adatsornak a másolatát. Az adatok **blokkokba** kerülnek, és minden blokk tartalmazza az előző blokk **hash**-ét – így ha valaki egy régi blokkot megváltoztat, minden utána következő blokk hash-e elromlik, és a csalás azonnal kiderül.

```python run
# Pici blokklánc: minden blokk az előző hash-ét is tartalmazza
import hashlib

def hash_(szoveg):
    return hashlib.sha256(szoveg.encode()).hexdigest()[:12]

lanc = []
elozo = "0" * 12
for adat in ["Anna → Béla: 5", "Béla → Cili: 2", "Cili → Anna: 1"]:
    h = hash_(elozo + adat)
    lanc.append({"adat": adat, "elozo": elozo, "hash": h})
    elozo = h

for blokk in lanc:
    print(blokk)

# Hamisítás: az első blokk adatát átírjuk, és ellenőrizzük a láncot
lanc[0]["adat"] = "Anna → Béla: 500"
ervenyes = all(hash_(b["elozo"] + b["adat"]) == b["hash"] for b in lanc)
print("Érvényes a lánc?", ervenyes)
```

Felhasználás: kriptovaluták (Bitcoin), **okosszerződések** (automatikusan teljesülő szerződés), ellátási lánc nyomon követése (honnan jön az áru), digitális tanúsítványok és oklevelek hitelesítése. Hátrány: lassabb és drágább egy hagyományos adatbázisnál – csak ott éri meg, ahol a résztvevők **nem bíznak egymásban**, és nincs központi szereplő.

## Kvantumszámítógép

A hagyományos bit 0 vagy 1. A **kvantumbit (qubit)** a **szuperpozíció** miatt egyszerre lehet a kettő keveréke, és több qubit **összefonódhat**. Bizonyos feladatoknál (molekulák szimulációja, optimalizálás, egyes matematikai problémák) ez óriási gyorsulást hozhat. A mai gépek még kísérletiek: kevés, zajos qubittel dolgoznak, és a felhőből érhetők el (IBM, Google, Amazon, Microsoft).

**Biztonsági következmény:** egy elég nagy kvantumszámítógép **feltörné a mai nyilvános kulcsú titkosítás** (RSA, elliptikus görbék) nagy részét. Ezért a szabványügyi intézet (NIST) 2024-ben kiadta az első **kvantumbiztos** (posztkvantum) titkosítási szabványokat, és a böngészők, operációs rendszerek már át is álltak részben ezekre. A cégeknek érdemes most felmérni, hol használnak sérülékeny titkosítást – a ma ellopott titkosított adatot később is visszafejthetik („most gyűjtsd, később fejtsd”).

## Zöld informatika

Az informatika jelentős energiafogyasztó: az **adatközpontok** (különösen az MI-modellek tanítása és futtatása miatt) egyre több áramot és hűtővizet igényelnek, és az elektronikai hulladék is gyorsan nő.

Mit tehet egy cég – és egy mérnök?

- **hatékony kód** és architektúra: ami gyorsabb, az kevesebb energiát fogyaszt,
- a felhőben a terheléshez **méretezett** erőforrás, a felesleges gépek leállítása,
- **megújuló energiával** működő adatközpont-régió választása,
- az eszközök **hosszabb használata**, javítása, újrahasznosítása,
- a **PUE** mérőszám figyelése (adatközpont teljes energiafogyasztása / az informatikai eszközök fogyasztása; az ideális érték 1).

## Összefoglalás

- Blokklánc: elosztott főkönyv, hash-sel láncolt blokkok; ott jó, ahol nincs központi bizalom.
- Kvantumszámítógép: qubit, szuperpozíció; veszélyezteti az RSA-t → kvantumbiztos titkosítás (NIST, 2024).
- Zöld IT: hatékony kód, méretezett felhő, megújuló energia, hosszabb eszközhasználat, PUE.

## A lecke feladata

```quiz required
? Mit tartalmaz minden blokk a blokkláncban, ami miatt egy régi blokk meghamisítása kiderül?
+ az előző blokk hash-ét
- a felhasználó jelszavát
- egy képet
- a szerver IP-címét
! A lánc minden további hash-e elromlik.

? Mit ír ki a lecke blokklánc-példájának utolsó sora a hamisítás után?
- Érvényes a lánc? True
+ Érvényes a lánc? False
! Az első blokk hash-e már nem egyezik az adattal.

? Hogy hívják a kvantumszámítógép alapegységét?
= qubit
= kvantumbit
! Szuperpozícióban lehet.

? Mennyi az ideális PUE-érték egy adatközpontnál?
= 1
! Ekkor minden energia az informatikai eszközökre megy, semmi a hűtésre és veszteségre.
```
