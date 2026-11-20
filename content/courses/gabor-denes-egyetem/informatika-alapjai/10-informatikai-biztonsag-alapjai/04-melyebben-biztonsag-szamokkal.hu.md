---
title: Mélyebben – biztonság számokkal
summary: Mennyi idő feltörni egy jelszót (entrópia és próbálkozások), miért kell a jelszavakat sóval és lassú hash-sel tárolni, hogyan töri fel a gyakoriságelemzés a régi titkosításokat, mennyire véd a 3-2-1 mentés, és hogyan rangsoroljuk a kockázatokat – kis programokkal és interaktív ábrával.
minutes: 45
---

## Amit ebben a leckében megtanulsz

- hogyan becsüld meg egy jelszó **erősségét** bitekben és feltörési időben,
- hogyan tárolja egy jó rendszer a jelszavakat (**só** és **lassú hash**),
- miért törhető fel egy egyszerű titkosítás **gyakoriságelemzéssel**,
- mennyit ér a **3-2-1 mentés** számokban, és hogyan rangsorold a **kockázatokat**.

## 1. Mennyi idő feltörni egy jelszót?

Az alapleckében láttuk, hogy a hosszú jelszó erősebb. De mennyivel? Ha a támadó minden lehetőséget végigpróbál (**nyers erő**), a lehetőségek száma $N^L$, ahol $N$ a felhasználható jelek száma, $L$ a hossz. Ezt bitekben is kifejezhetjük: $L \cdot \log_2 N$ bit (**entrópia**) – minden plusz bit **megduplázza** a próbálkozások számát.

```python run
# Jelszóerősség: entrópia és átlagos feltörési idő nyers erővel
from math import log2

def ido_szoveg(mp):
    for egyseg, hossz in [("év", 365 * 24 * 3600), ("nap", 24 * 3600), ("óra", 3600), ("perc", 60)]:
        if mp >= hossz:
            return f"{mp / hossz:,.0f} {egyseg}".replace(",", " ")
    return f"{mp:.2f} mp"

proba_mp = 1e10                                     # 10 milliárd próbálkozás másodpercenként (videokártyák)
esetek = [("8 kisbetű", 26, 8), ("8 jel (kis+nagy+szám)", 62, 8), ("12 jel (kis+nagy+szám)", 62, 12),
          ("4 véletlen szó (7776-ból)", 7776, 4), ("6 véletlen szó (7776-ból)", 7776, 6)]
for nev, n, hossz in esetek:
    bit = hossz * log2(n)
    atlag = n ** hossz / 2 / proba_mp                # átlagosan a lehetőségek felét kell kipróbálni
    print(f"{nev:<27} {bit:5.1f} bit → átlagosan {ido_szoveg(atlag)}")
```

```plot
title: Átlagos feltörési idő (10-es alapú logaritmus, másodperc) az entrópia (bit) függvényében
x: 20, 100
y: -5, 20
param: g = 10, 6, 14, 1
f: (x - 1)*log(2) - g # lg(2^(x−1) / 10^g): 10^g próbálkozás másodpercenként
dash: 7.5 # kb. egy év (10^7,5 s)
```

Az ábra függőleges tengelyén a **nagyságrend** van (a 7,5 kb. egy évet jelent, a 10 kb. 300 évet). A csúszkával a támadó sebességét állíthatod: egy ezerszer gyorsabb támadó csak 3 nagyságrenddel tolja el az egyenest – ezt 10 plusz bit (két-három plusz karakter) kiegyenlíti. **De** a számolás csak **véletlen** jelszóra igaz! A „Jelszo123!” formailag 10 jel kis-, nagybetűvel, számmal, jellel, mégis percek alatt feltörik, mert a támadók **szótárakkal** és gyakori mintákkal kezdenek. Ezért jó a jelszókezelő (valóban véletlen jelszavakat generál) és a véletlen szavakból álló jelmondat.

## 2. Hogyan tárol egy jó rendszer jelszót?

Egy weboldal **soha nem** tárolhatja a jelszavakat olvasható formában – ha az adatbázis kiszivárog, minden fiók veszélybe kerül (és sokan máshol is ugyanazt a jelszót használják). Az alapleckében láttuk a **hash**-t: egyirányú függvény, a jelszóból egy ujjlenyomatot csinál. Ez önmagában kevés, két okból:

- ha két felhasználónak ugyanaz a jelszava, a hash-ük is ugyanaz – és a gyakori jelszavak hash-ét előre ki lehet számolni,
- egy gyors hash-függvényt (pl. SHA-256) másodpercenként milliárdszor lehet kiszámolni.

A megoldás: minden felhasználó kap egy véletlen **sót** (salt), amely a jelszó mellé kerül, és **szándékosan lassú** függvényt használunk (pl. PBKDF2, bcrypt, Argon2):

```python run
# Jelszó tárolása: só + lassú hash (PBKDF2), ellenőrzés időzítésbiztos összehasonlítással
import hashlib, os, hmac

def tarol(jelszo):
    so = os.urandom(16)                                  # felhasználónként más véletlen só
    h = hashlib.pbkdf2_hmac("sha256", jelszo.encode(), so, 100_000)   # 100 000 ismétlés: lassú
    return so, h

def ellenoriz(jelszo, so, tarolt):
    h = hashlib.pbkdf2_hmac("sha256", jelszo.encode(), so, 100_000)
    return hmac.compare_digest(h, tarolt)                # állandó idejű összehasonlítás

anna = tarol("macska123")
bela = tarol("macska123")                                # ugyanaz a jelszó...
print("Anna hash:", anna[1].hex()[:24], "...")
print("Béla hash:", bela[1].hex()[:24], "...  ← a só miatt más")
print("helyes jelszó:", ellenoriz("macska123", *anna))
print("rossz jelszó: ", ellenoriz("macska124", *anna))
```

A 100 000-szeres ismétlés egy bejelentkezésnél alig észrevehető (néhány tized másodperc), a támadót viszont **százezerszer lassabbá** teszi. Ez egy jó példa arra, amikor a **fejlesztő** és a **felhasználó** nézőpontja egybeesik: a felhasználónak semmit sem kell tennie, a rendszer mégis sokkal biztonságosabb.

## 3. Miért törhető fel egy egyszerű titkosítás?

Az egyik legrégebbi titkosítás a **Caesar-kód**: minden betűt ugyanannyival tolunk el az ábécében. 25-féle eltolás van, ezért egyszerűen mindet ki lehet próbálni. De egy okosabb módszer, a **gyakoriságelemzés** még bonyolultabb helyettesítéseket is feltör: minden nyelvben vannak gyakori betűk (angolban az `e`, magyarban az `e` és az `a`), és ezek a titkosított szövegben is gyakoriak maradnak.

```python run
# Caesar-kód és feltörése gyakoriságelemzéssel
from collections import Counter

ABC = "abcdefghijklmnopqrstuvwxyz"

def caesar(szoveg, eltolas):
    return "".join(ABC[(ABC.index(c) + eltolas) % 26] if c in ABC else c for c in szoveg)

titok = caesar("the meeting is at seven in the computer lab near the entrance", 7)
print("titkosított:", titok)

# a leggyakoribb betű valószínűleg az angol 'e'
leggyakoribb = Counter(c for c in titok if c in ABC).most_common(1)[0][0]
eltolas = (ABC.index(leggyakoribb) - ABC.index("e")) % 26
print(f"leggyakoribb betű: {leggyakoribb} → becsült eltolás: {eltolas}")
print("visszafejtve:", caesar(titok, -eltolas))
```

A modern titkosítások (pl. AES) ezért úgy működnek, hogy a titkosított szöveg **véletlenszerűnek** látsszon: nem marad benne gyakoriság vagy mintázat. A biztonságuk nem azon múlik, hogy titok az algoritmus (az AES nyilvános), hanem a **kulcs** hosszán: 128 bites kulcsnál $2^{128}$ lehetőség van – ez a nyers erővel elérhetetlen.

## 4. Mennyit ér a 3-2-1 mentés?

Az alapleckében láttuk a 3-2-1 szabályt: **3** másolat, **2** különböző adathordozón, **1** másik helyen. Számoljuk ki, mennyit javít! Tegyük fel, hogy egy adathordozó egy évben 5% eséllyel vész el (meghibásodik, ellopják, zsarolóvírus titkosítja):

```python run
# Adatvesztés esélye egy évben különböző mentési stratégiáknál (független hibákat feltételezve)
p = 0.05                                     # egy adathordozó éves vesztési esélye
print(f"csak a laptopon:              {p:.4%}")
print(f"laptop + külső lemez:         {p ** 2:.4%}")
print(f"laptop + külső lemez + felhő: {p ** 3:.4%}")

# de ha a külső lemez mindig a laptop mellett van, egy betörés vagy tűz mindkettőt viszi
kozos = 0.02                                 # közös esemény (tűz, lopás, zsarolóvírus a csatlakoztatott lemezen)
print(f"laptop + mindig csatlakoztatott lemez, közös kockázattal: {kozos + (1 - kozos) * p ** 2:.4%}")
```

Két független másolatnál az esély 0,25%, háromnál 0,0125% – **négyszázszor** kisebb, mint egyetlen példánynál. A „független” szó azonban kulcsfontosságú: egy mindig csatlakoztatott külső lemezt a zsarolóvírus ugyanúgy titkosít, mint a laptopot. Ezért kell az egyik másolatnak **máshol** (és lehetőleg leválasztva) lennie.

## 5. Kockázatok rangsorolása

Egy cég nem védekezhet egyformán minden ellen – a pénz és az idő véges. Egy egyszerű módszer: minden kockázatnak becsüljük meg a **valószínűségét** (1–5) és a **hatását** (1–5), a kettő szorzata a kockázati pontszám:

```python run
# Kockázati mátrix: valószínűség × hatás, rangsorolva
kockazatok = {
    "adathalász e-mail egy munkatársnak": (5, 3),
    "zsarolóvírus a fájlszerveren": (2, 5),
    "elveszett céges laptop titkosítás nélkül": (3, 4),
    "áramszünet a szerverteremben": (2, 3),
    "meteor becsapódás": (1, 5),
}
for nev, (val, hatas) in sorted(kockazatok.items(), key=lambda k: -k[1][0] * k[1][1]):
    pont = val * hatas
    szint = "MAGAS" if pont >= 12 else "közepes" if pont >= 6 else "alacsony"
    print(f"{pont:>2} {szint:<9} {nev}")
```

| Nézőpont        | Mit lát a biztonságból?                           | Mit tehet?                                                    |
| --------------- | ------------------------------------------------- | ------------------------------------------------------------- |
| **felhasználó** | plusz lépés a belépésnél, „bosszantó” frissítések | jelszókezelő, MFA, frissítések, gyanakvás a sürgető levelekre |
| **fejlesztő**   | bemenet-ellenőrzés, jelszótárolás, jogosultságok  | só + lassú hash, paraméterezett lekérdezés, a legkisebb jog   |
| **cégvezetés**  | költség és kockázat                               | rangsorolás, mentés, oktatás, incidenskezelési terv           |
| **támadó**      | a leggyengébb láncszem – gyakran az ember         | ezért ér a legtöbbet az oktatás és az MFA                     |

## Összefoglalás

- Egy véletlen jelszó erőssége $L \cdot \log_2 N$ bit; minden plusz bit megduplázza a feltörési időt – de az ember által kitalált jelszavakat a szótáras támadás sokkal gyorsabban töri.
- A jelszavakat sóval és szándékosan lassú hash-sel (PBKDF2, bcrypt, Argon2) kell tárolni.
- Az egyszerű titkosításokat a gyakoriságelemzés feltöri; a modern titkosítás biztonsága a kulcs hosszán múlik.
- A független mentések az adatvesztés esélyét nagyságrendekkel csökkentik; a kockázatokat valószínűség × hatás alapján érdemes rangsorolni.

## A lecke feladata

```quiz required
? Hány bit egy 10 karakteres, véletlenszerűen, 64 féle jelből választott jelszó entrópiája?
= 60
! $10 \cdot \log_2 64 = 10 \cdot 6 = 60$ bit.

? Hányszorosára nő a nyers erős feltörés ideje, ha a jelszó entrópiája 10 bittel nő?
= 1024
! $2^{10} = 1024$.

? Miért kap minden felhasználó külön véletlen sót a jelszavához?
- hogy a jelszó rövidebb lehessen
+ hogy az azonos jelszavaknak is más legyen a hash-e, és ne lehessen előre kiszámolt táblázatot használni
- hogy a felhasználó elfelejthesse a jelszavát
- hogy gyorsabb legyen a bejelentkezés
! A só miatt minden hash egyedi.

? Egy adathordozó évente 10% eséllyel vész el. Mekkora az esélye, hogy két független másolat egyszerre vész el (százalékban)?
= 1
! $0{,}1^2 = 0{,}01 = 1\%$.

? Egy kockázat valószínűsége 4, hatása 3 (1–5-ös skálán). Mennyi a kockázati pontszám?
= 12
! $4 \cdot 3 = 12$.
```
