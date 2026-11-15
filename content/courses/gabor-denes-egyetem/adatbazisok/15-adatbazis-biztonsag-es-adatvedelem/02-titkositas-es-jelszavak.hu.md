---
title: Titkosítás és jelszavak tárolása
summary: Titkosítás átvitel közben (TLS) és tároláskor, szimmetrikus és aszimmetrikus kulcsok, a kulcsok kezelése; miért nem szabad a jelszót titkosítani vagy sima hash-sel tárolni, mi a só és a lassú jelszó-hash (bcrypt, Argon2) – a hash-ek viselkedését a böngészőben kipróbálva.
minutes: 25
---

## Amit ebben a leckében megtanulsz

- mi a különbség a **titkosítás átvitel közben** és **tároláskor** között,
- mi a **titkosítás** és mi a **hash**, és miért nem ugyanaz,
- hogyan kell **jelszót** tárolni: **só** + **lassú hash** (bcrypt, Argon2).

## Titkosítás átvitel közben (in transit)

Az alkalmazás és az adatbázis között (és a böngésző és a szerver között) az adat a hálózaton utazik. Ha nincs titkosítva, aki „belehallgat” a hálózatba (pl. egy nyilvános Wi-Fi-n), mindent láthat: lekérdezéseket, jelszavakat, személyes adatokat.

A megoldás a **TLS** (a böngészőben ez a lakat és a `https://`). Adatbázisoknál a kapcsolatot is TLS-sel kell védeni – PostgreSQL-ben például a kapcsolati beállításban: `sslmode=verify-full`. Ez nemcsak titkosít, hanem azt is **ellenőrzi**, hogy tényleg a valódi szerverhez kapcsolódsz.

## Titkosítás tároláskor (at rest)

Mi van, ha valaki ellopja a szerver lemezét, vagy egy mentési fájlt? Ha az adat **tároláskor is titkosítva** van, a lopott fájl használhatatlan a kulcs nélkül.

| Szint                                 | Mit véd?                                           | Példa                                                |
| ------------------------------------- | -------------------------------------------------- | ---------------------------------------------------- |
| **Teljes lemez**                      | ellopott lemez, kidobott szerver                   | LUKS, BitLocker, felhős lemeztitkosítás              |
| **Adatbázis-fájlok** (TDE)            | ellopott adatfájl vagy mentés                      | SQL Server, Oracle TDE                               |
| **Oszlop szintű / alkalmazás oldali** | még az adatbázis-rendszergazda sem látja az adatot | bankkártyaszám, egészségügyi adat titkosítva tárolva |

A **mentéseket** is mindig titkosítva kell tárolni – egy titkosítatlan mentés egy objektumtárban (13. témakör) ugyanakkora kockázat, mint maga az adatbázis.

## Kulcsok: szimmetrikus és aszimmetrikus

- **Szimmetrikus** titkosítás (pl. AES): ugyanazzal a kulccsal titkosítunk és fejtünk vissza. Gyors – nagy adatmennyiséghez ez kell.
- **Aszimmetrikus** titkosítás (pl. RSA, elliptikus görbék): van egy **nyilvános** kulcs (bárki titkosíthat vele) és egy **titkos** kulcs (csak a tulajdonosa fejthet vissza). A TLS a kapcsolat elején ezzel egyezteti a szimmetrikus kulcsot.

A titkosítás csak annyit ér, amennyire a **kulcs** biztonságban van. A kulcs **soha ne legyen** a forráskódban, a git-tárolóban vagy az adatbázis mellett ugyanazon a lemezen. Erre valók a kulcskezelő szolgáltatások (_KMS_, pl. AWS KMS, Azure Key Vault, HashiCorp Vault).

## Titkosítás vagy hash?

| Titkosítás                                              | Hash (lenyomat)                                               |
| ------------------------------------------------------- | ------------------------------------------------------------- |
| **visszafordítható** (a kulccsal)                       | **egyirányú**: a lenyomatból nem számolható vissza az eredeti |
| a kimenet hossza az adattól függ                        | mindig ugyanakkora (pl. SHA-256: 256 bit)                     |
| akkor kell, ha később **vissza kell olvasni** az adatot | akkor kell, ha csak **ellenőrizni** kell, hogy egyezik-e      |

A hash ugyanarra a bemenetre mindig ugyanazt adja, de a legkisebb eltérésre is teljesen mást:

<details>
<summary>A mintaadatbázis létrehozása (SQL)</summary>

<!-- sql-setup: egyetem -->

</details>

```sql run
SELECT 'jelszo123' AS bemenet, encode(sha256('jelszo123'::bytea), 'hex') AS sha256
UNION ALL
SELECT 'jelszo124', encode(sha256('jelszo124'::bytea), 'hex')
UNION ALL
SELECT 'jelszo123', encode(sha256('jelszo123'::bytea), 'hex');
```

## Hogyan tároljunk jelszót?

**Soha ne** tárold a jelszót:

- **sima szövegként** – egy adatszivárgáskor mindenki jelszava azonnal ismert (és sokan máshol is ugyanazt használják!),
- **titkosítva** – akinek megvan a kulcs (vagy ellopja), mindet visszafejti.

A jelszónak csak a **hash-ét** tároljuk. Belépéskor a beírt jelszót is hash-eljük, és a két lenyomatot hasonlítjuk össze. De a sima, gyors hash (pl. SHA-256) sem elég, két okból:

**1. Az egyforma jelszavaknak egyforma a hash-e.** Nézd meg:

```sql run
CREATE TABLE felhasznalok (nev TEXT, jelszo_hash TEXT);
INSERT INTO felhasznalok VALUES
  ('anna', encode(sha256('Tavasz2026'::bytea), 'hex')),
  ('bela', encode(sha256('123456'::bytea), 'hex')),
  ('cili', encode(sha256('123456'::bytea), 'hex'));
SELECT nev, LEFT(jelszo_hash, 16) || '…' AS jelszo_hash FROM felhasznalok;
```

Béla és Cili hash-e azonos – aki az egyiket kitalálja, a másikét is tudja. A támadók ráadásul előre kiszámolt táblázatokban tárolják a gyakori jelszavak hash-ét (_rainbow table_).

**Megoldás: só** (_salt_). Minden felhasználó kap egy **egyedi, véletlen** értéket, amelyet a jelszó elé teszünk hash-elés előtt, és a hash mellé eltárolunk (nem titok!):

```sql run
CREATE TABLE felhasznalok (nev TEXT, so TEXT, jelszo_hash TEXT);
INSERT INTO felhasznalok (nev, so) VALUES ('bela', 'k3J9xQ'), ('cili', 'Vb72pL');
UPDATE felhasznalok SET jelszo_hash = encode(sha256(convert_to(so || '123456', 'UTF8')), 'hex');
SELECT nev, so, LEFT(jelszo_hash, 16) || '…' AS jelszo_hash FROM felhasznalok;
```

Ugyanaz a jelszó, mégis teljesen más a hash – az előre kiszámolt táblázatok használhatatlanok.

**2. A gyors hash túl gyors.** Egy modern videokártya másodpercenként **milliárdnyi** SHA-256-ot számol, így egy ellopott hash-listán a rövid jelszavakat végig lehet próbálgatni. Ezért jelszóhoz **szándékosan lassú**, beállítható költségű függvény kell:

| Függvény               | Megjegyzés                                                                       |
| ---------------------- | -------------------------------------------------------------------------------- |
| **Argon2id**           | a mai ajánlás: lassú **és** sok memóriát igényel (nehéz videokártyán gyorsítani) |
| **bcrypt**             | régóta bevált, széles körben elérhető                                            |
| **scrypt**, **PBKDF2** | elfogadhatók, ha a fentiek nem érhetők el                                        |

Ezek a függvények a sót is maguk kezelik, és a költségparaméterrel évről évre lassíthatók, ahogy a gépek gyorsulnak. A gyakorlatban a jelszó-hash-elést az **alkalmazás** (egy bevált könyvtár) végzi, nem kézzel írjuk meg.

> Szabály: soha ne írj saját titkosító vagy jelszó-hash algoritmust. Használj bevált, karbantartott könyvtárat!

## Összefoglalás

- Átvitel közben: TLS (és a szerver ellenőrzése); tároláskor: lemez-, fájl- vagy oszlopszintű titkosítás, titkosított mentések.
- A kulcsok kulcskezelőben legyenek, ne a kódban.
- Titkosítás = visszafordítható; hash = egyirányú.
- Jelszó: só + lassú hash (Argon2id, bcrypt); soha nem sima szöveg, titkosítás vagy gyors hash.

## A lecke feladata

```quiz required
? Mi véd az ellen, hogy egy nyilvános Wi-Fi-n valaki lehallgassa az alkalmazás és az adatbázis közötti forgalmat?
+ TLS titkosítás a kapcsolaton
- a teljes lemez titkosítása
- a jelszavak sózása
- egy B-fa index
! Titkosítás átvitel közben.

? Miért nem szabad a jelszavakat visszafejthető módon titkosítva tárolni?
- mert a titkosítás túl lassú
+ mert aki megszerzi a kulcsot, minden jelszót visszafejthet
- mert a titkosított jelszó túl hosszú
- mert a TLS nem engedi
! A jelszót sosem kell visszaolvasni, csak ellenőrizni.

? Két felhasználó ugyanazt a jelszót választja. Mi biztosítja, hogy a tárolt hash-ük különbözzön?
- a TLS
+ a felhasználónként egyedi, véletlen só
- a gyorsabb hash-függvény
- az oszlop szintű jogosultság
! A só miatt a hash-elt bemenet különbözik.

? Melyik a mai ajánlás jelszavak hash-elésére?
- SHA-256 só nélkül
- MD5
+ Argon2id
- AES titkosítás
! Lassú és memóriaigényes, beállítható költséggel.

? Hol tároljuk az adatok titkosításához használt kulcsot?
- a forráskódban, egy konstansban
- a git-tárolóban, egy konfigurációs fájlban
+ egy kulcskezelő szolgáltatásban (KMS), az adatoktól elkülönítve
- az adatbázisban, a titkosított adatok mellett
! A kulcs csak akkor véd, ha nem kerül a támadó kezébe az adatokkal együtt.
```
