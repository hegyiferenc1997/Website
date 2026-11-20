---
title: Mélyebben – online biztonság és figyelem számokkal
summary: Mennyibe kerülnek az értesítések (a megszakítások költsége), egy gyanús link árulkodó jeleinek ellenőrzése programmal, a jelszavak és jelmondatok erőssége bitekben és feltörési időben, és egy chatüzenet élete három nézőpontból – kis programokkal és interaktív ábrával.
minutes: 40
---

## Amit ebben a leckében megtanulsz

- mennyi **figyelmet** visz el egy-egy értesítés, és hogyan védekezz,
- hogyan ismerd fel egy **adathalász** link és üzenet árulkodó jeleit,
- hogyan számold ki egy jelszó **erősségét**, és miért jobb a jelmondat,
- miért **maradandó** minden, amit online leírsz.

## 1. A megszakítások ára

Minden értesítés (chat, e-mail, közösségi média) egy **megszakítás**. Maga az üzenet elolvasása csak néhány másodperc, de utána vissza kell találni a munkába – ezt **visszaállási időnek** nevezik. Kutatások szerint egy összetett feladatnál (programozás, tanulás) ez akár **10–20 perc** is lehet. Számoljunk:

```plot
title: Hatékony munkaidő egy órában a megszakítások számának függvényében
x: 0, 6
y: 0, 60
param: r = 10, 1, 25, 1
f: 60 - x*r # hatékony percek óránként
```

Ha egy megszakítás után 10 perc kell a visszaálláshoz, óránként **3 értesítés** már a fél órát viszi el; 15 perces visszaállásnál 4 értesítés gyakorlatilag az egész órát. Egy egész napra:

```python run
# A megszakítások ára egy munkanapon: elveszett idő és a legnagyobb egybefüggő blokk
nap_perc = 8 * 60
visszaallas = 12                                      # perc, egy megszakítás után

for ertesites_oranta in [0, 1, 2, 4]:
    db = ertesites_oranta * 8
    elveszett = min(nap_perc, db * visszaallas)
    blokk = 60 / ertesites_oranta if ertesites_oranta else nap_perc
    print(f"{ertesites_oranta} értesítés/óra: {db:>2} megszakítás, {elveszett:>3} perc elveszett "
          f"({elveszett / nap_perc:.0%}), leghosszabb nyugodt blokk ≈ {blokk:.0f} perc")
```

A számok egy egyszerű modellből jönnek, de a tanulság valódi: a mély munkához **hosszú, megszakítás nélküli blokkok** kellenek. Gyakorlati lépések:

- **Kötegelés**: az e-mailt és a chatet naponta néhány fix időpontban nézd meg, ne folyamatosan.
- **Ne zavarjanak mód** a telefonon és a gépen a tanulási blokkok alatt.
- A csapatban **állapotjelzés** („fókuszban vagyok 14-ig”) és közös szabály arról, mi számít sürgősnek (és annak legyen külön csatornája, pl. telefon).
- **Te se zavarj feleslegesen**: egyetlen, teljes üzenet („Szia! A login-tesztről kérdeznék: …”) jobb, mint a „Szia” – majd várakozás – majd a kérdés három részletben.

## 2. Adathalász link? Árulkodó jelek programmal

Az alapleckében láttuk az adathalászat (phishing) jeleit. A böngészők és levelezőprogramok szűrői hasonló **heurisztikákkal** (ökölszabályokkal) dolgoznak, mint ez a kis program:

```python run
# Adathalászat gyanújelei egy üzenetben és linkben (egyszerű heurisztikák, nem teljes védelem)
import re

ismert_domainek = {"neptun.uni.hu", "github.com", "otpbank.hu"}

def gyanu(uzenet, link):
    jelek = []
    m = re.match(r"(https?)://([^/:]+)", link)
    protokoll, host = m.group(1), m.group(2).lower()
    if protokoll != "https":
        jelek.append("nem titkosított (http) kapcsolat")
    if re.fullmatch(r"[\d.]+", host):
        jelek.append("IP-cím domainnév helyett")
    for ismert in ismert_domainek:
        if ismert.split(".")[0] in host and not (host == ismert or host.endswith("." + ismert)):
            jelek.append(f"hasonlít a(z) {ismert} címre, de nem az")
    if re.search(r"azonnal|24 órán belül|felfüggeszt|utolsó figyelmeztetés", uzenet.lower()):
        jelek.append("sürgetés, fenyegetés")
    if re.search(r"jelszó|jelszav|kártyaszám|\bpin\b", uzenet.lower()):
        jelek.append("érzékeny adatot kér")
    return jelek

esetek = [
    ("Fiókja 24 órán belül felfüggesztésre kerül! Erősítse meg jelszavát.", "http://neptun-uni-hu.login-check.com/belepes"),
    ("Új bejelentkezés a fiókodba. Ha nem te voltál, nézd meg a beállításaidat.", "https://github.com/settings/security"),
    ("Utolsó figyelmeztetés: adja meg kártyaszámát a csomag kiszállításához.", "http://185.23.4.17/csomag"),
]
for uzenet, link in esetek:
    j = gyanu(uzenet, link)
    print(f"{link}\n   → {'GYANÚS: ' + '; '.join(j) if j else 'nincs gyanús jel (de ez nem garancia!)'}")
```

Figyeld meg az első linket: a „neptun-uni-hu” a cím **elején** van, de a valódi domain a végén áll: `login-check.com`. Ez a leggyakoribb trükk – mindig a **jobbról olvasott** domainnevet nézd meg (a `.com` előtti részt). A második üzenet is figyelmeztet, de nem sürget fenyegetéssel, és a link a valódi oldalra mutat – mégis a legbiztonságosabb, ha nem a linkre kattintasz, hanem **magad gépeled be** a címet.

> Egy heurisztika soha nem tökéletes: a profi támadók https-t és hihető szöveget használnak. A legjobb védelem a **kétlépcsős azonosítás** (2FA) és a megszokás: érzékeny adatot soha ne adj meg egy üzenetből nyitott linken.

## 3. Mennyire erős a jelszavad?

Egy véletlenszerűen választott jelszó erősségét **bitekben** (entrópiában) mérjük: ha $N$ féle karakterből $L$ hosszú jelszót választunk véletlenszerűen, a lehetőségek száma $N^L$, az entrópia $L \cdot \log_2 N$ bit. Minden további bit **megduplázza** a próbálgatások számát:

```python run
# Jelszó- és jelmondaterősség: entrópia bitekben és a feltörés várható ideje
from math import log2

probalkozas_mp = 1e10                        # egy erős támadó gép: 10 milliárd próbálkozás/másodperc
esetek = [
    ("8 karakter, csak kisbetű", 26, 8),
    ("8 karakter, kis- és nagybetű, szám, jel", 94, 8),
    ("12 karakter, kis- és nagybetű, szám, jel", 94, 12),
    ("4 véletlen szó egy 7776 szavas listából", 7776, 4),
    ("6 véletlen szó egy 7776 szavas listából", 7776, 6),
]
for nev, n, hossz in esetek:
    bit = hossz * log2(n)
    mp = 2 ** bit / 2 / probalkozas_mp                      # átlagosan a tér felét kell átnézni
    if mp < 3600:
        ido = f"{mp:.0f} másodperc"
    elif mp < 365 * 86400:
        ido = f"{mp / 86400:.1f} nap".replace(".", ",")
    else:
        ido = f"{mp / (365 * 86400):,.0f} év".replace(",", " ")
    print(f"{nev:<44} {bit:5.1f} bit → {ido}")
```

A csak kisbetűs 8 karakteres jelszó **másodpercek** alatt megvan, a 8 karakteres „bonyolult” jelszó pedig **néhány nap** alatt. Egy 4 véletlen szóból álló jelmondat (pl. „ló-elem-tűzhely-felhő”) nagyjából ugyanilyen erős – de sokkal **könnyebben megjegyezhető**. A 6 szavas jelmondat vagy a 12 karakteres véletlen jelszó már **több százezer évig** tartana. A hossz tehát többet ér a „bonyolultságnál”: egy jelmondatot könnyű hosszabbra venni. Két fontos kiegészítés:

- Ez csak **véletlenszerű** választásra igaz. A „Jelszo123!” vagy a kedvenc idézeted az első próbálkozások között van, mert a támadók szótárakkal és ismert jelszólistákkal kezdenek.
- A jelszó erőssége semmit sem ér, ha **több helyen** ugyanazt használod: egy kiszivárgott adatbázisból a támadó mindenhol kipróbálja. Ezért kell **jelszókezelő** és mindenhol **más** jelszó.

## 4. Egy chatüzenet élete – három nézőpontból

Péntek este fáradtan ezt írod a csapat csatornájába: „Ez a megrendelő teljesen hülye, már harmadszor változtatja meg a specifikációt.”

| Nézőpont                  | Hogyan látja?                                                                                                                                         |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Te, péntek este**       | Feszültséglevezetés egy „zárt” csatornán, a csapattársaid megértik.                                                                                   |
| **Egy csapattárs hétfőn** | Kínos: ha a megrendelő képviselője is tagja a csatornának (vagy később bekerül), ő is olvashatja. A hangnem a csapatkultúrát is rontja.               |
| **Valaki fél év múlva**   | Egy kereséssel előkerül; képernyőkép készülhet róla. Egy céges csatornában az üzenetek archiválódnak, és akár munkáltatói vizsgálat tárgyai lehetnek. |

Az online üzenetek **maradandók, kereshetők és továbbíthatók**. Egy jó ökölszabály: ne írj olyat, amit nem szeretnél a megrendelő szemébe mondani, vagy egy kivetítőn látni. A frusztrációt jobb négyszemközt, szóban megbeszélni – a tartalmi problémát pedig tényszerűen írni: „Harmadszor módosult a specifikáció; javaslom, hogy a változtatásokat egy változáskezelési folyamaton keresztül fogadjuk.”

## Összefoglalás

- Egy megszakítás után akár 10–20 perc kell a visszaálláshoz; a mély munkához kötegelt üzenetkezelés és megszakítás nélküli blokkok kellenek.
- Adathalászat gyanújelei: hasonló, de nem azonos domain (jobbról olvasva), http, IP-cím, sürgetés, érzékeny adat kérése; a 2FA és a cím kézi begépelése véd a legjobban.
- Egy véletlen jelszó erőssége $L \cdot \log_2 N$ bit; a hossz többet ér a bonyolultságnál, és egy 5–6 szavas véletlen jelmondat erős és könnyen megjegyezhető – és mindenhol más jelszó kell.
- Az online üzenetek maradandók és kereshetők: írj úgy, mintha a címzett és bárki más is olvashatná.

## A lecke feladata

```quiz required
? Egy 8 órás napon 6 megszakítás ér, mindegyik után 15 perc kell a visszaálláshoz. Hány perc vész el összesen?
= 90
! $6 \cdot 15 = 90$ perc.

? Egy jelmondat 4 véletlenszerűen választott szóból áll egy 2048 szavas listából. Hány bit az entrópiája?
= 44
! $4 \cdot \log_2 2048 = 4 \cdot 11 = 44$ bit.

? Melyik a valódi domain ebben a linkben: http://neptun-uni-hu.login-check.com/belepes ?
- neptun-uni-hu
+ login-check.com
- belepes
- uni.hu
! A domainnevet jobbról olvasd: a .com előtti rész a valódi tulajdonos.

? Miért gyenge a „Jelszo123!” jelszó, pedig van benne nagybetű, szám és jel?
- mert túl hosszú
+ mert nem véletlenszerű: a támadók szótárakkal és ismert jelszólistákkal kezdenek, és ez az elsők között van
- mert felkiáltójel van benne
- nem gyenge, nagyon erős
! Az entrópiaképlet csak véletlenszerű választásra érvényes.

? Melyik a legjobb gyakorlat egy kolléga megkeresésére chaten?
- „Szia” – majd várni a válaszra, és utána kérdezni
+ egyetlen, teljes üzenet a köszönéssel és a konkrét kérdéssel
- öt rövid üzenet egymás után
- azonnal videóhívást indítani bejelentés nélkül
! Így a másik egyszerre, egy megszakítással tud válaszolni.
```
