---
title: A web működése
summary: URL, kliens és szerver, HTTP-kérés és -válasz, állapotkódok, HTTPS és a böngésző lépései.
minutes: 16
---

## Amit ebben a leckében megtanulsz

- miből áll egy **URL**,
- mi történik, amikor beírsz egy címet a böngészőbe,
- mi a **HTTP**-kérés, a válasz és az **állapotkód**, és mitől biztonságos a **HTTPS**.

## Internet és web

Az **internet** a hálózat (kábelek, routerek, protokollok). A **web** (World Wide Web, Tim Berners-Lee, 1989) egy szolgáltatás az interneten: egymásra hivatkozó oldalak, amelyeket a böngésző HTTP-vel tölt le. Az e-mail, a videóhívás vagy egy online játék is az interneten fut, de nem „a web”.

## Az URL részei

```text
https://www.pelda.hu:443/targyak/matek?felev=1#temakor-2
└─┬─┘   └─────┬─────┘└┬┘└─────┬─────┘└──┬───┘└───┬────┘
 séma       domain   port   útvonal  lekérdezés  horgony
```

## Mi történik egy címbeírás után?

1. A böngésző a **DNS**-től megkérdezi a domain IP-címét.
2. **TCP**-kapcsolatot nyit a szerver 443-as portjára, és **TLS**-sel titkosítja.
3. Elküld egy **HTTP-kérést**: `GET /targyak/matek`.
4. A szerver **választ** küld: állapotkód + fejlécek + tartalom (HTML).
5. A böngésző feldolgozza a HTML-t, letölti a hozzá tartozó CSS-t, JavaScriptet, képeket, és **megjeleníti** az oldalt.

## HTTP-kérés és -válasz

```text
GET /targyak/matek HTTP/1.1          ← metódus, útvonal
Host: www.pelda.hu
Accept-Language: hu

HTTP/1.1 200 OK                      ← állapotkód
Content-Type: text/html; charset=utf-8

<!doctype html><html>…</html>
```

Gyakori **metódusok**: `GET` (lekérés), `POST` (adat küldése, pl. űrlap), `PUT`/`PATCH` (módosítás), `DELETE` (törlés).

| Állapotkód | Jelentése             |
| ---------- | --------------------- |
| 200        | OK, minden rendben    |
| 301 / 302  | átirányítás máshová   |
| 403        | tiltott (nincs jogod) |
| 404        | nem található         |
| 500        | belső szerverhiba     |

Szabály: **2xx** siker, **3xx** átirányítás, **4xx** a kliens hibája, **5xx** a szerver hibája.

## HTTPS

A **HTTPS** = HTTP + **TLS** titkosítás. Két dolgot ad: senki nem olvashatja vagy módosíthatja útközben az adatot (pl. egy nyilvános Wi-Fin), és a szerver **tanúsítvánnyal** igazolja, hogy tényleg ő a `pelda.hu`. Jelszót, bankkártyaszámot csak HTTPS-oldalon adj meg – de a lakat önmagában nem jelenti, hogy az oldal tisztességes, csak azt, hogy a kapcsolat titkosított.

## A web három nyelve

- **HTML**: a tartalom és a szerkezet (címsor, bekezdés, kép, link),
- **CSS**: a megjelenés (szín, betű, elrendezés),
- **JavaScript**: a viselkedés (kattintásra történő dolgok, dinamikus tartalom).

## Összefoglalás

- Internet = hálózat; web = HTTP-vel elért, hivatkozó oldalak az interneten.
- URL: séma, domain, port, útvonal, lekérdezés, horgony.
- HTTP-kérés (GET, POST…) → válasz állapotkóddal; HTTPS = HTTP + TLS.

## A lecke feladata

```quiz required
? Melyik HTTP-állapotkód jelenti azt, hogy a kért oldal **nem található**?
= 404
! 4xx: a kliens hibája.

? Melyik HTTP-metódussal küld adatot egy bejelentkező űrlap a szervernek?
- GET
+ POST
- DELETE
- HEAD
! A POST a kérés törzsében küld adatot.

? Mi az URL `https://www.pelda.hu/targyak?felev=1` címében a **domain**?
= www.pelda.hu
! A séma https, az útvonal /targyak, a lekérdezés felev=1.

? Melyik nyelv felel egy weboldal **megjelenéséért** (szín, betűtípus, elrendezés)?
- HTML
+ CSS
- JavaScript
- HTTP
! HTML = szerkezet, CSS = megjelenés, JS = viselkedés.
```
