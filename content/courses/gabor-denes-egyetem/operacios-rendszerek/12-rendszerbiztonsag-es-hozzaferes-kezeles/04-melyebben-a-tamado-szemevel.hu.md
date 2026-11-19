---
title: Mélyebben – a támadó szemével: jelszavak, jogok és puffertúlcsordulás
summary: Mennyi idő feltörni egy jelszót (kulcstér, entrópia, gyors és lassú hash), miért kell só és lassú hash (Python-kísérlet), hogyan dönt a kernel a jogosultságról (tulajdonos–csoport–mások sorrend csapdája), az umask kiszámítása és a SUID, valamint egy puffertúlcsordulás szimulálva – és hogyan állítja meg a veremkanári, az NX és az ASLR.
minutes: 45
---

## Amit ebben a leckében megtanulsz

- **kiszámolni**, mennyi idő alatt törhető fel egy jelszó próbálgatással,
- miért tárol az OS **sózott** és szándékosan **lassú** hash-t – és kipróbálni Pythonban,
- lépésről lépésre, ahogy a kernel eldönti, **hozzáférhetsz-e** egy fájlhoz (és egy meglepő csapdát),
- kiszámolni az **umask** hatását, és megérteni a **SUID** bitet,
- **szimulálni** egy puffertúlcsordulást, és megnézni, hogyan véd ellene a **veremkanári**, az **NX** és az **ASLR**.

Fontos: amit itt tanulsz, azt csak a **saját** gépeden és virtuális gépeden próbáld ki. Más rendszerének engedély nélküli támadása bűncselekmény. A védekezéshez viszont ismerni kell a támadó gondolkodását.

## 1. Mennyi idő feltörni egy jelszót?

Ha a támadó megszerezte a hash-eket (pl. egy kiszivárgott adatbázisból), **próbálgatni** kezd: minden lehetséges jelszóból hash-t számol, és összehasonlítja. A lehetőségek száma a **kulcstér**:

**kulcstér = (jelkészlet mérete) ^ (hossz)**

Átlagosan a kulcstér **felét** kell végigpróbálni. A sebesség attól függ, milyen hash-t használ a rendszer:

- **gyors hash** (pl. MD5, SHA-1): egy videokártya másodpercenként kb. **10 milliárd** (10¹⁰) próbát tud,
- **lassú jelszó-hash** (bcrypt, scrypt, yescrypt, Argon2): szándékosan drága, kb. **10 000** (10⁴) próba másodpercenként.

```python run
# Átlagos feltörési idő próbálgatással, gyors és lassú hash mellett
import math

def ido(mp):
    # másodpercek olvasható formában
    for egyseg, hossz in [("év", 365 * 24 * 3600), ("nap", 24 * 3600), ("óra", 3600), ("perc", 60)]:
        if mp >= hossz:
            return f"{mp / hossz:,.0f} {egyseg}".replace(",", " ")
    return f"{mp:.3f} mp"

jelszavak = [
    ("6 kisbetű",         26, 6),
    ("8 kisbetű",         26, 8),
    ("8 vegyes jel",      94, 8),     # kis- és nagybetű, szám, írásjel
    ("12 vegyes jel",     94, 12),
    ("4 véletlen szó",  7776, 4),     # Diceware: 7776 szavas lista
]

print(f"{'jelszó':<15} {'entrópia':>9} {'gyors hash (10^10/s)':>22} {'lassú hash (10^4/s)':>22}")
for nev, jelek, hossz in jelszavak:
    ter = jelek ** hossz
    bitek = math.log2(ter)                     # entrópia bitben
    print(f"{nev:<15} {bitek:>7.1f} b {ido(ter / 2 / 1e10):>22} {ido(ter / 2 / 1e4):>22}")
```

Három tanulság:

1. A **hossz** a legfontosabb: minden új karakter megsokszorozza a kulcsteret (94-gyel!).
2. A **lassú hash** milliószor lassítja a támadót – ezért nem MD5-tel tárolják a jelszót.
3. Négy véletlen szó („ló-elem-tűzhely-kapocs”) nagyjából olyan erős, mint 8 vegyes jel – de **sokkal könnyebb megjegyezni**. (Csak ha a szavakat tényleg véletlenül választod, nem egy dalszövegből!)

Az **entrópia** (bitben) azt mondja meg, hány igen/nem kérdéssel lehetne kitalálni a jelszót: log₂(kulcstér). 40 bit alatt gyenge, 60 fölött erős, 80 fölött ma gyakorlatilag feltörhetetlen.

Fontos megkötés: mindez csak **véletlen** jelszóra igaz. A támadók először **szótárakkal** és kiszivárgott jelszólistákkal próbálkoznak – a `Jelszo123!` 10 karakter, mégis másodpercek alatt megvan.

## 2. Só és lassú hash – kísérlet

Miért kell **só** (_salt_)? Só nélkül két azonos jelszó hash-e **ugyanaz** – a támadó egyszer kiszámolja a gyakori jelszavak hash-ét (**szivárványtábla**), és utána csak kikeres. A véletlen só miatt minden felhasználónál újra kell kezdenie.

```python run
# Só nélkül és sóval: azonos jelszó, más-más hash
import hashlib, os, time

jelszo = b"macska123"
print("só nélkül, Anna: ", hashlib.sha256(jelszo).hexdigest()[:24])
print("só nélkül, Béla: ", hashlib.sha256(jelszo).hexdigest()[:24], "← ugyanaz!")

for nev in ["Anna", "Béla"]:
    so = os.urandom(16)                                   # 16 véletlen bájt
    h = hashlib.sha256(so + jelszo).hexdigest()
    print(f"sóval, {nev}:     {h[:24]}  (só: {so.hex()[:8]}…)")

# Lassú hash: a PBKDF2 sokszor egymás után hash-el (iterációk)
hashlib.pbkdf2_hmac("sha256", jelszo, b"bemelegites", 1)    # első hívás: bemelegítés
for iteraciok in [1, 10000, 100000]:
    kezdet = time.perf_counter()
    hashlib.pbkdf2_hmac("sha256", jelszo, b"sosoSO16bajtsoso", iteraciok)
    eltelt = time.perf_counter() - kezdet
    print(f"PBKDF2 {iteraciok:>6} iteráció: {eltelt * 1000:9.3f} ms / próba")
```

A só **nem titkos** – a hash mellett tárolják (a `/etc/shadow` sorában a `$y$…$` részben). A dolga csak annyi, hogy minden hash egyedi legyen. A 100 000 iteráció a támadót is 100 000-szer lassítja. A felhasználó belépéskor észre sem veszi a néhány tized másodpercet, a milliárdnyi próbát végző támadónak viszont ez évek.

## 3. Hogyan dönt a kernel a hozzáférésről?

Amikor megnyitsz egy fájlt, a kernel ezt az algoritmust futtatja (egyszerűsítve):

1. Ha a folyamat **root** (UID 0) → szinte mindent szabad.
2. Ha a folyamat UID-je = a fájl **tulajdonosa** → a **tulajdonosi** (u) jogok döntenek, **és kész**.
3. Különben, ha a folyamat valamelyik csoportja = a fájl **csoportja** → a **csoport** (g) jogok döntenek, és kész.
4. Különben a **mások** (o) jogok döntenek.

A „és kész” a lényeg: a kernel **az első illeszkedő** kategóriánál megáll, nem keresi a legkedvezőbbet!

```python run
# A kernel jogosultság-ellenőrzése leegyszerűsítve
def szabad(felhasznalo, csoportjai, fajl, kert):
    tulaj, csoport, jogok = fajl                      # jogok pl. "rw-r--r--"
    if felhasznalo == "root":
        return True
    if felhasznalo == tulaj:
        resz = jogok[0:3]                             # első illeszkedés: tulajdonos
    elif csoport in csoportjai:
        resz = jogok[3:6]
    else:
        resz = jogok[6:9]
    return {"r": resz[0] == "r", "w": resz[1] == "w", "x": resz[2] == "x"}[kert]

fajl = ("anna", "hallgatok", "---r--rw-")             # furcsa, de lehetséges jogok
for ki, csoportok in [("anna", ["hallgatok"]), ("bela", ["hallgatok"]),
                      ("cili", ["vendegek"]), ("root", [])]:
    print(f"{ki:<5} olvashatja? {szabad(ki, csoportok, fajl, 'r')}")
```

Meglepő eredmény: Anna, a **tulajdonos**, nem olvashatja a saját fájlját, miközben Cili (mások) igen! Mert Annára a tulajdonosi `---` vonatkozik, és a kernel ott megáll. (Persze Anna mint tulajdonos a `chmod`-dal bármikor visszaadhatja magának a jogot.)

Könyvtáraknál a jogok mást jelentenek:

| Jog | Fájlon            | Könyvtáron                                            |
| --- | ----------------- | ----------------------------------------------------- |
| r   | tartalom olvasása | a könyvtár **listázása** (`ls`)                       |
| w   | tartalom írása    | fájlok **létrehozása, törlése, átnevezése** benne     |
| x   | futtatás          | **belépés** (`cd`), és a benne lévő fájlok elérése    |

Ebből fakad egy gyakori meglepetés: egy fájlt **törölhetsz**, ha a **könyvtárára** van írási jogod – akkor is, ha magára a fájlra nincs! (A `/tmp`-n ezért van a **sticky bit**, `drwxrwxrwt`: ott csak a saját fájljaidat törölheted.)

## 4. Az umask és a SUID

### Az umask kiszámítása

Az új fájl jogait a program kéri (fájlnál általában **666**, könyvtárnál **777**), az **umask** pedig **elvesz** belőle bitenként: jog = kért ÉS NEM umask.

```python run
# Az umask hatása az új fájlok és könyvtárak jogaira
def jog_szovegge(szam):
    jelek = ""
    for i in range(8, -1, -1):                    # 9 bit balról jobbra
        jelek += "rwx"[(8 - i) % 3] if szam >> i & 1 else "-"
    return jelek

for umask in [0o022, 0o002, 0o027, 0o077]:
    fajl = 0o666 & ~umask
    konyvtar = 0o777 & ~umask
    print(f"umask {umask:03o}: fájl {fajl:03o} ({jog_szovegge(fajl)}), "
          f"könyvtár {konyvtar:03o} ({jog_szovegge(konyvtar)})")
```

Az `077` umask a legszigorúbb: új fájljaidat csak te látod – érdemes például egy megosztott szerveren.

### A SUID bit – jogosultság kölcsönbe

A jelszavakat a `/etc/shadow` tárolja, amelyet csak a root írhat. Hogyan változtathatja meg mégis egy közönséges felhasználó a **saját** jelszavát a `passwd` paranccsal?

```bash
ls -l /usr/bin/passwd        # -rwsr-xr-x root root … ← az "s" a SUID bit
ls -l /etc/shadow            # -rw-r----- root shadow …
```

A **SUID** (_set user ID_) bittel jelölt program a **tulajdonosa** (itt a root) jogaival fut, bárki indítja. A `passwd` ezért írhatja a `/etc/shadow`-t – de a program maga ellenőrzi, hogy csak a **saját** jelszavadat változtathasd meg.

Ezért a SUID programok a támadók kedvenc célpontjai: ha egy SUID-root programban hiba van, azon keresztül **root** jogot lehet szerezni (_privilege escalation_). Rendszergazdaként érdemes időnként átnézni őket:

```bash
find / -perm -4000 -type f 2>/dev/null     # az összes SUID fájl a rendszeren
```

## 5. Puffertúlcsordulás – szimulálva

A klasszikus támadás: egy C program egy fix méretű tömbbe (**puffer**) másol be bemenetet, **hosszellenőrzés nélkül**. A veremben a puffer után közvetlenül a függvény **visszatérési címe** áll – ha a bemenet hosszabb, felülírja, és a függvény a támadó által megadott címre „tér vissza”.

Szimuláljuk a vermet egy bájttömbbel (a valóságban a verem lefelé nő, de az elv ugyanaz):

```python run
# Puffertúlcsordulás szimulálva: 8 bájtos puffer, utána a visszatérési cím
def fuggveny_hivas(bemenet, kanari_vedelem=False):
    verem = bytearray(16)
    PUFFER, KANARI, VISSZA = slice(0, 8), slice(8, 12), slice(12, 16)
    verem[VISSZA] = b"\x10\x20\x30\x40"            # a helyes visszatérési cím
    kanari = b"\xde\xad\xbe\xef"                    # véletlen érték (itt rögzített)
    verem[KANARI] = kanari

    # A hibás másolás: nincs hosszellenőrzés (mint a C strcpy-nál)
    for i, bajt in enumerate(bemenet):
        if i < len(verem):
            verem[i] = bajt

    if kanari_vedelem and verem[KANARI] != kanari:
        return "ÉSZLELVE: a kanári megsérült → a program leáll (stack smashing detected)"
    cim = bytes(verem[VISSZA]).hex()
    return "rendben, visszatér ide: " + cim if cim == "10203040" else "ELTÉRÍTVE, ugrás ide: " + cim

print("rövid bemenet:   ", fuggveny_hivas(b"Anna"))
tamadas = b"A" * 12 + b"\x66\x66\x66\x66"          # 12 bájt töltelék + hamis cím
print("hosszú bemenet:  ", fuggveny_hivas(tamadas))
print("kanárival:       ", fuggveny_hivas(tamadas, kanari_vedelem=True))
```

A három védelmi vonal, amely ma ezt megnehezíti:

| Védelem              | Mit csinál?                                                              | Mi ellen?                              |
| -------------------- | ------------------------------------------------------------------------ | -------------------------------------- |
| **veremkanári**      | véletlen érték a puffer és a visszatérési cím között; ha sérül, leáll    | a visszatérési cím felülírása          |
| **NX / DEP**         | a verem nem futtatható                                                   | a puffer helyére írt kártékony kód     |
| **ASLR**             | a verem, a könyvtárak, a program címe minden indításkor más              | a „hova ugorjak?” kérdés kitalálása    |

A **kanári** neve a bányászok kanárijából jön: a madár a mérges gázra hamarabb reagált, mint az ember – riasztott, mielőtt nagy lett volna a baj.

Az ASLR erejét is kiszámolhatjuk: ha a véletlen eltolás **28 bit**, a támadónak átlagosan 2²⁷ ≈ **134 millió** próbálkozás kell – és minden rossz tipp összeomlasztja a programot, ami feltűnik. A legjobb védelem persze az, ha eleve nincs hiba: ezért terjednek a **memóriabiztos** nyelvek (Rust, Go, Java, Python), amelyek nem engednek tömbhatáron túl írni. A Linux kernelben is egyre több Rust kód van.

```bash
# Ubuntu VM: az ASLR élőben – kétszer egymás után más címek
grep -m1 stack /proc/self/maps
grep -m1 stack /proc/self/maps
```

## Összefoglalás

- Kulcstér = jelkészlet^hossz; az entrópia log₂(kulcstér). A **hossz** számít a legtöbbet, és a **lassú hash** milliószor lassítja a próbálgatást.
- A **só** miatt azonos jelszavakból is különböző hash lesz, így a szivárványtáblák használhatatlanok.
- A kernel a jogosultságnál az **első illeszkedő** kategóriánál (tulajdonos → csoport → mások) megáll.
- Könyvtáron a `w` törlést, az `x` belépést jelent; a `/tmp` sticky bitje védi mások fájljait.
- jog = kért ÉS NEM umask (666 és 022 → 644). A **SUID** program a tulajdonosa jogaival fut – ezért kényes.
- Puffertúlcsordulás ellen: **veremkanári**, **NX/DEP**, **ASLR** – és a memóriabiztos nyelvek.

## A lecke feladata

```quiz required
? Hány lehetséges jelszó van, ha a jelszó pontosan 4 számjegyből áll (pl. PIN)?
= 10000
= 10 000
! 10⁴ = 10 000 – próbálgatással azonnal feltörhető, ezért korlátozza a telefon a próbálkozások számát.

? Mennyi lesz az új fájl joga oktálisan, ha a program 666-ot kér és az umask 027?
= 640
! 666 ÉS NEM 027 = 640: a tulajdonos rw, a csoport r, mások semmi.

? A jelentes.txt jogai: ----rw-r-- , tulajdonosa anna, csoportja hallgatok. Anna a hallgatok csoport tagja. Írhatja-e Anna a fájlt (chmod nélkül)?
- igen, mert a csoportnak van írási joga
+ nem, mert rá a tulajdonosi jogok vonatkoznak, és ott a kernel megáll
- igen, mert a tulajdonos mindig mindent írhat
! Az első illeszkedő kategória dönt.

? Miért használ az operációs rendszer sót (salt) a jelszó-hash-hez?
- hogy a jelszó visszafejthető legyen
+ hogy azonos jelszavakból is különböző hash legyen, és ne működjenek az előre kiszámolt táblák
- hogy a hash rövidebb legyen
! A só nem titkos, a hash mellett tárolják.

? Melyik védelem ismeri fel, hogy egy puffertúlcsordulás felülírta a verem visszatérési címe előtti területet?
- ASLR
- NX-bit
+ veremkanári
- tűzfal
! A kanári értékét a függvény visszatérés előtt ellenőrzi.

? Miért módosíthatja egy közönséges felhasználó a saját jelszavát a passwd paranccsal, ha a /etc/shadow-t csak a root írhatja?
+ mert a passwd SUID-root program, így a tulajdonosa, a root jogaival fut
- mert a jelszócseréhez a kernel ideiglenesen kikapcsolja a jogosultságokat
- mert a /etc/shadow-t mindenki írhatja
! ls -l /usr/bin/passwd → -rwsr-xr-x.
```
