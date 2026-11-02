---
title: Alfanumerikus kódok – ASCII és Unicode
summary: Betűk, számjegyek és vezérlőkarakterek kódolása: ASCII, EBCDIC, Hollerith, Unicode és UTF-8.
minutes: 15
---

## Amit ebben a leckében megtanulsz

- hogyan ábrázolja a gép a **betűket és írásjeleket**,
- az **ASCII** kódtábla felépítését és hasznos trükkjeit,
- a régebbi **EBCDIC** és **Hollerith** kódokat,
- mi a **Unicode** és az **UTF-8**, és miért lehet egy ékezetes betű 2 bájt.

## Az alfanumerikus kódok

Az **alfanumerikus kódok** nemcsak számokat, hanem **betűket, írásjeleket és vezérlőkaraktereket** is ábrázolnak. Minden karakterhez egy számot (kódpontot) rendelünk, és ezt a számot tároljuk binárisan.

## ASCII

Az **ASCII** (*American Standard Code for Information Interchange*, 1963) **7 bites** kód: 2<sup>7</sup> = **128** karaktert tartalmaz.

| Tartomány (dec) | hexa      | Tartalom                                       |
| --------------- | --------- | ---------------------------------------------- |
| 0–31, 127       | 00–1F, 7F | vezérlőkarakterek (pl. 10 = LF új sor, 13 = CR) |
| 32              | 20        | szóköz                                         |
| 48–57           | 30–39     | számjegyek `0`–`9`                             |
| 65–90           | 41–5A     | nagybetűk `A`–`Z`                              |
| 97–122          | 61–7A     | kisbetűk `a`–`z`                               |

**Megjegyzendő értékek:** `A` = 65 = 0x41 = 100 0001, `a` = 97 = 0x61, `0` = 48 = 0x30.

### Hasznos trükkök

- **Kis- és nagybetű** között pontosan **32** (0x20) a különbség, ami egyetlen bit (a 2<sup>5</sup> = 32 súlyú bit): `A` = 100 0001, `a` = 110 0001. Egy bit átbillentése vált a kettő között.
- Egy **számjegy-karakter** értéke: kód − 48. `'7'` (55) → 55 − 48 = 7. A számjegyek kódja 0011 xxxx, ahol az alsó 4 bit maga a BCD érték.
- A betűk **ábécésorrendben** követik egymást, ezért a rendezés egyszerű számösszehasonlítás.

A 8. bitet régen **paritásbitként** használták, később a „kiterjesztett ASCII” kódlapok (pl. Latin-2 a magyar ő, ű betűkhöz) erre építettek – ezek egymással nem voltak kompatibilisek, innen a „kódlap-káosz”.

## Régebbi kódok

- **EBCDIC** (*Extended Binary Coded Decimal Interchange Code*) – 8 bites, az IBM nagyszámítógépein (mainframe) használt kód; a betűi nem folytonosak, ma is él banki rendszerekben.
- **Hollerith-kód** – a lyukkártyás adatfeldolgozás korai kódja (Herman Hollerith, 1890-es amerikai népszámlálás). Az IBM elődcége ebből nőtt ki.

## Unicode és UTF-8

A **Unicode** a világ összes írásrendszerét egyetlen táblába foglalja: több mint 150 000 karakter, mindegyiknek egyedi **kódpontja** van (pl. U+0041 = `A`, U+0151 = `ő`, U+20AC = `€`). Az első 128 kódpont megegyezik az ASCII-val.

A kódpontot az **UTF-8** kódolás 1–4 bájton tárolja:

| Kódpont tartománya | Bájtok | Bitminta                              | Példa                 |
| ------------------ | ------ | ------------------------------------- | --------------------- |
| U+0000 – U+007F    | 1      | 0xxxxxxx                              | `A` → 41              |
| U+0080 – U+07FF    | 2      | 110xxxxx 10xxxxxx                     | `é` → C3 A9           |
| U+0800 – U+FFFF    | 3      | 1110xxxx 10xxxxxx 10xxxxxx            | `€` → E2 82 AC        |
| U+10000 –          | 4      | 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx   | 😀 → F0 9F 98 80      |

Az UTF-8 előnye, hogy **visszafelé kompatibilis** az ASCII-val, és a bájtokból mindig látszik, hol kezdődik egy karakter. Ma a weboldalak több mint 98%-a UTF-8 kódolású.

```python run
# Karakterkódok Pythonban
print(ord("A"), hex(ord("A")), format(ord("A"), "07b"))
print(chr(97), chr(0x4A))
print(chr(ord("k") - 32))          # kisbetűből nagybetű: −32
print(ord("7") - ord("0"))          # számjegy-karakter értéke
for jel in "Aé€":
    print(jel, "UTF-8 bájtjai:", jel.encode("utf-8").hex(" "))
```

## Összefoglalás

- ASCII: 7 bit, 128 karakter; `A` = 65, `a` = 97, `0` = 48.
- Kis- és nagybetű között 32 a különbség (egy bit).
- Unicode: minden karakter egyedi kódpontja; UTF-8: 1–4 bájt, ASCII-kompatibilis.

## A lecke feladata

```quiz required
? Mi a `C` betű ASCII-kódja tízesben?
= 67
! `A` = 65, és a betűk egymás után következnek.

? Mi a `G` betű ASCII-kódja hexadecimálisan?
= 47
= 0x47
! `A` = 0x41.

? Hány karaktert tartalmaz az eredeti, 7 bites ASCII?
= 128
! 2<sup>7</sup>.

? Mennyi a különbség az ASCII-ban egy kisbetű és a hozzá tartozó nagybetű kódja között?
= 32
! `a` = 97, `A` = 65.

? Hány bájton tárolja az UTF-8 a `ő` betűt (U+0151)?
= 2
! U+0080 és U+07FF között 2 bájt kell.

? Hány bájton tárolja az UTF-8 a `€` jelet (U+20AC)?
= 3
! U+0800 és U+FFFF között 3 bájt kell.
```
