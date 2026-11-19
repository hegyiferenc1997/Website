---
title: Mélyebben – a kommunikációs modell számokkal és esetekkel
summary: Mennyi információ vész el zajos csatornán, és mennyit ment meg egy visszakérdezés? Csatornaválasztás a feladat bonyolultsága szerint, egy kódellenőrzési megjegyzés elemzése Watzlawick öt axiómájával, három nézőpontból – kis programokkal és interaktív ábrával.
minutes: 35
---

## Amit ebben a leckében megtanulsz

- hogyan **számolható ki**, mennyi információ ér célba egy zajos csatornán,
- miért ér meg egy **visszacsatolási kör** szinte bármennyi időt,
- hogyan **válassz csatornát** (chat, e-mail, hívás, személyes) a helyzethez,
- hogyan elemezz egy valódi félreértést **több nézőpontból**.

## 1. Mennyi ér célba? A zaj mint valószínűség

Az alapleckében a zajt minőségileg írtuk le. Most számoljunk! Tegyük fel, hogy egy feladatkiosztás **5 fontos részletből** áll (határidő, felelős, hatókör, prioritás, átadás módja), és mindegyiket külön-külön $p$ valószínűséggel **érti félre vagy felejti el** a vevő. Ha a részletek egymástól függetlenek, annak esélye, hogy **mind az 5** hibátlanul célba ér:

$$P(\text{minden rendben}) = (1 - p)^5$$

Mi történik, ha a vevő **visszamondja** a feladatot („Jól értem, hogy…?”), és az adó kijavítja a hibás részt? Ekkor egy részlet csak akkor marad hibás, ha az első alkalommal félrement, **és** a visszakérdezésnél sem vette észre senki. Ha ez utóbbi is $p$ eséllyel történik, egy részlet hibájának esélye $p \cdot p = p^2$:

```python run
# Zajos csatorna: mekkora eséllyel ér célba minden részlet visszacsatolással és anélkül?
reszletek = 5
for p in [0.05, 0.10, 0.20, 0.30]:
    nelkule = (1 - p) ** reszletek          # egyirányú üzenet
    vele = (1 - p * p) ** reszletek         # egy visszakérdezési kör után
    print(f"p = {p:.0%}: visszacsatolás nélkül {nelkule:6.1%}, egy körrel {vele:6.1%}")
```

Már 10%-os részletenkénti hibánál is csak **kb. 59%** az esélye, hogy az egész feladat hibátlanul megérkezik – vagyis minden második-harmadik feladatkiosztásnál valami félremegy! Egyetlen visszakérdezés után ez **95%** fölé ugrik. Egy fél perces „Jól értem, hogy pénteken 10-re kell, és a jelszó-visszaállítás nem része?” sokszorosan megtérül, ha a másik út egy félreértett, három napig rossz irányba fejlesztett funkció.

```plot
title: Annak esélye, hogy minden részlet hibátlanul célba ér
x: 0, 15
y: 0, 1
param: p = 0.1, 0.01, 0.4, 0.01
f: (1 - p)^x # visszacsatolás nélkül
f: (1 - p^2)^x # egy visszakérdezési körrel
dash: 0.5 # 50%
```

Húzd a $p$ csúszkát, és figyeld, hány részletnél esik 50% alá a két görbe. Két tanulság:

- **Minél több részlet** van egy üzenetben, annál nagyobb a baj – a hosszú, sűrű üzeneteket érdemes pontokba szedni, és a lényeget írásban is megerősíteni.
- A visszacsatolás **nem lineárisan**, hanem négyzetesen csökkenti a hibát: $p = 0{,}2$ helyett $0{,}04$.

> Figyelem: ez egy egyszerűsített modell. A valóságban a részletek nem függetlenek (aki fáradt, minden részletet rosszabbul ért), és a visszakérdezés sem tökéletes. A tanulság ettől még érvényes: a visszacsatolás a legolcsóbb minőségbiztosítás.

## 2. Melyik csatornát válasszam?

A **médiagazdagság-elmélet** (Daft és Lengel) szerint a csatornák abban különböznek, mennyi jelet visznek egyszerre (hang, arc, testbeszéd, azonnali visszacsatolás). Minél **bonyolultabb, kétértelműbb vagy érzelmesebb** a téma, annál gazdagabb csatorna kell; egyszerű, egyértelmű információhoz viszont a gazdag csatorna pazarlás (senki sem szeret egy félórás hívást egy dátumért).

```python run
# Csatornaválasztás: a téma bonyolultságához (1–5) a legkevésbé "drága", de elég gazdag csatorna
csatornak = [  # (név, gazdagság 1–5, időköltség percben, nyom marad-e írásban)
    ("chatüzenet", 1, 1, True),
    ("e-mail", 2, 5, True),
    ("videóhívás", 4, 20, False),
    ("személyes beszélgetés", 5, 30, False),
]

def valaszt(bonyolultsag, dokumentalni_kell):
    jo = [c for c in csatornak if c[1] >= bonyolultsag]       # elég gazdag-e
    nev, gazdagsag, ido, irasos = min(jo, key=lambda c: c[2])  # a legolcsóbb ezek közül
    if dokumentalni_kell and not irasos:
        return f"{nev}, utána rövid írásos összefoglaló"
    return nev

helyzetek = [
    ("a demó időpontja 14:00-ra módosul", 1, True),
    ("egy API-változás leírása a másik csapatnak", 2, True),
    ("két megoldási terv közti vita eldöntése", 4, True),
    ("egy kolléga teljesítményével kapcsolatos gond", 5, False),
]
for leiras, bony, dok in helyzetek:
    print(f"{leiras:<45} → {valaszt(bony, dok)}")
```

Figyeld meg a harmadik sort: a vitát érdemes **hívásban** eldönteni (gyorsabb, kevesebb a félreértés, látszanak az érzelmek), de a döntést utána **írásban** rögzíteni, különben két hét múlva mindenki másra emlékszik. Ez a két szempont – **gazdagság** és **nyomon követhetőség** – gyakran ellentétes, ezért kombináljuk a csatornákat.

Tipikus hibák a csatornaválasztásban:

- **Rossz hír chaten** („Holnaptól más projekten dolgozol 🙂”): túl szegény csatorna egy érzelmes témához.
- **Hosszú e-mail-lánc** egy vitáról, 14 válasszal: egy 10 perces hívás megoldotta volna.
- **Szóbeli döntés írásos nyom nélkül**: a megállapodás „elpárolog”.

## 3. Esettanulmány: egy kódellenőrzési megjegyzés három szemmel

Egy hallgatói csapatprojektben Bence pull requestet nyit, Anna ezt írja hozzá:

```text
Anna: Ez így nem fog működni. Miért nem használtál rendes validációt?
```

Bence egész délután rosszkedvű, és másnap nem szól Annához. Elemezzük Watzlawick öt axiómájával!

| Axióma                                   | Mi történt?                                                                                                                                                 |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Nem lehet nem kommunikálni**           | Bence hallgatása másnap is üzenet: „megsértődtem”. Anna talán észre sem veszi.                                                                              |
| **Tartalmi és kapcsolati szint**         | Tartalom: hiányzik a validáció. Kapcsolat: a „rendes” és a „miért nem” Bence fülében így szól: „hanyag vagy”.                                               |
| **Az események tagolása (pontozás)**     | Anna szerint: „ő hanyag, ezért vagyok szigorú”. Bence szerint: „ő bántó, ezért nem kérdezek tőle”. Mindkettő a másik viselkedését tartja a kiindulópontnak. |
| **Digitális és analóg kommunikáció**     | Írásban nincs hangsúly, arc, mosoly – az analóg jelek hiányát Bence a legrosszabb értelmezéssel tölti ki.                                                   |
| **Szimmetrikus és kiegészítő viszonyok** | Két egyenrangú csapattag (szimmetrikus viszony), de a megjegyzés tanár–diák (kiegészítő) hangot üt meg, ez feszültséget kelt.                               |

**Három nézőpont:**

- **Anna** (az adó) szerint ő csak hatékony volt: a hibát jelezte, és kérdezett. Szándéka szerint _segített_.
- **Bence** (a vevő) a kapcsolati üzenetre reagált, nem a tartalomra: _megítélve_ érezte magát.
- **Egy külső megfigyelő** (pl. a csapat harmadik tagja) azt látja, hogy a tartalom jogos, de a forma miatt a csapat egy fél napot vesztett, és a következő PR-nál Bence talán nem mer majd kérdezni.

Hogyan lehetett volna jobban? Ugyanaz a tartalom, más kapcsolati üzenettel:

```text
Anna: Az üres e-mail címet most átengedi a regisztráció (kipróbáltam: 500-as hiba lesz).
      Szerintem a meglévő validáló függvénnyel meg lehetne fogni – ha kell, szívesen
      megmutatom, hogyan használtuk a bejelentkezésnél.
```

Ez **konkrét** (mi a hiba, honnan tudjuk), **javaslatot** tesz, és a kapcsolati szinten azt üzeni: „egy csapatban vagyunk”. Bence oldaláról pedig a visszacsatolás segített volna: „Úgy éreztem, a megjegyzésed szerint hanyag voltam – így gondoltad?” Egy ilyen mondat a **pontozási** csapdát töri meg.

## Összefoglalás

- Ha egy üzenet $k$ független részletből áll, és mindegyik $p$ eséllyel megy félre, mind hibátlan $(1 - p)^k$ eséllyel érkezik meg; egy visszakérdezési kör után $(1 - p^2)^k$ eséllyel.
- A csatornát a téma bonyolultsága és érzelmi töltete szerint válaszd; a gazdag csatornán hozott döntést írásban is rögzítsd.
- Egy félreértést érdemes az adó, a vevő és egy külső megfigyelő szemével is megnézni: a tartalmi és a kapcsolati szint gyakran mást üzen.

## A lecke feladata

```quiz required
? Egy üzenet 3 független részletből áll, mindegyik 20% eséllyel megy félre. Mekkora eséllyel érkezik meg mind a három hibátlanul? (tizedes törtként)
= 0,512
= 0.512
! $0{,}8^3 = 0{,}512$.

? Egy részlet 20% eséllyel megy félre, és a visszakérdezésnél is 20% eséllyel marad észrevétlen a hiba. Mekkora eséllyel lesz ez a részlet a végén helyes? (tizedes törtként)
= 0,96
= 0.96
! A hiba esélye $0{,}2 \cdot 0{,}2 = 0{,}04$, tehát $1 - 0{,}04 = 0{,}96$.

? Két csapattag hetek óta vitatkozik egy architektúra-döntésen, a vita feszült. Melyik a legjobb csatorna?
- egy újabb, részletes e-mail
- chatüzenetek a csapatcsatornán
+ videóhívás vagy személyes megbeszélés, utána írásos összefoglaló a döntésről
- egy kérdőív kiküldése
! Bonyolult, érzelmes téma → gazdag csatorna; a döntés írásban is kell.

? Egy kolléga két napja nem válaszol a kérdésedre, de a többiekkel beszélget. Melyik axióma illik ide a legjobban?
+ nem lehet nem kommunikálni
- digitális és analóg kommunikáció
- szimmetrikus és kiegészítő viszonyok
- minden kommunikáció kódolás
! A hallgatás is üzenet.

? Anna megjegyzése („Miért nem használtál rendes validációt?”) tartalmilag jogos volt. Mi okozta mégis a feszültséget?
- a csatorna fizikai zaja
+ a kapcsolati szint üzenete (minősítés, kioktató hang)
- hogy túl sok részletet tartalmazott
- hogy Bence nem tud olvasni
! A vevő a kapcsolati üzenetre reagált, nem a tartalomra.
```
