---
title: Termelés és költségek
summary: Fix és változó költség, átlag- és határköltség, rövid és hosszú táv, csökkenő hozadék, méretgazdaságosság, számviteli és gazdasági profit – egy szoftvercég példáján.
minutes: 30
---

## Amit ebben a leckében megtanulsz

- a **fix** és a **változó** költség különbségét,
- mi az **átlagköltség** és a **határköltség**,
- mit jelent a **csökkenő hozadék** és a **méretgazdaságosság**,
- miért más a **számviteli** és a **gazdasági profit**,
- miért különleges a szoftver költségszerkezete.

## Rövid és hosszú táv

- **Rövid táv:** legalább egy tényező (pl. az iroda, a gépek) **nem változtatható**.
- **Hosszú táv:** minden tényező változtatható – új irodát nyithatunk, új szervereket vehetünk.

## A költségek fajtái

| Fogalom         | Jele | Jelentés                                                         | Példa (szoftvercég)                                     |
| --------------- | ---- | ---------------------------------------------------------------- | ------------------------------------------------------- |
| fix költség     | FC   | nem függ a termelt mennyiségtől                                  | irodabérlet, licencek, a fejlesztés alapköltsége        |
| változó költség | VC   | a mennyiséggel együtt nő                                         | felhőszerver-használat, ügyfélszolgálat, fizetési díjak |
| teljes költség  | TC   | $TC = FC + VC$                                                   | –                                                       |
| átlagköltség    | AC   | $AC = TC / Q$ – egy egységre jutó költség                        | –                                                       |
| határköltség    | MC   | $MC = \Delta TC / \Delta Q$ – a következő egység többletköltsége | egy újabb felhasználó kiszolgálása                      |

**Példa:** egy app havi fix költsége 600 000 Ft, felhasználónként 200 Ft a szerver- és támogatási költség. 1000 felhasználónál:

- $TC = 600\,000 + 200 \cdot 1000 = 800\,000$ Ft,
- $AC = 800\,000 / 1000 = 800$ Ft,
- $MC = 200$ Ft.

10 000 felhasználónál az átlagköltség már csak $(600\,000 + 2\,000\,000)/10\,000 = 260$ Ft – a fix költség „szétterül”.

## Csökkenő hozadék és a költséggörbék

**A csökkenő hozadék törvénye:** ha egy tényezőt (pl. munkát) növelünk, a többit változatlanul hagyjuk, egy idő után az újabb egységek egyre kevesebb többletterméket hoznak. Egy 10 fős csapatba felvett 11. fejlesztő még sokat hozzátesz, a 40. ugyanabban a projektben már inkább lassít (több egyeztetés – Brooks törvénye: „egy késésben lévő szoftverprojekthez embert adni csak tovább késlelteti”).

Ezért a határköltség egy idő után **emelkedik**, az átlagköltség görbéje pedig **U alakú**.

```plot
title: Átlag- és határköltség
x: 0, 60
y: 0, 25
param: F = 100, 20, 300, 10
f: F/x + 2 + 0.1x # átlagköltség (AC)
f: 2 + 0.2x # határköltség (MC)
point: sqrt(10F), 2 + 0.2 sqrt(10F) # AC minimuma
value: a legkisebb átlagköltséghez tartozó mennyiség = sqrt(10F)
```

Figyeld meg: a **határköltség görbe az átlagköltség minimumpontjában metszi** az átlagköltséget. (Ha a következő egység olcsóbb az átlagnál, lehúzza az átlagot; ha drágább, felhúzza.) Az **F** csúszka a fix költséget változtatja.

## Méretgazdaságosság (hosszú táv)

- **Méretgazdaságosság** (_economies of scale_): nagyobb termelésnél **csökken** az átlagköltség (tömeges beszerzés, specializáció, a fix költség szétterül). Ezért nőnek nagyra a felhőszolgáltatók.
- **Méretgazdaságtalanság**: túl nagy méretnél nő az átlagköltség (bürokrácia, lassú döntések).

## Számviteli és gazdasági profit

- **Számviteli profit** = árbevétel − **explicit** (kifizetett) költségek.
- **Gazdasági profit** = árbevétel − explicit költségek − **implicit költségek** (alternatív költségek, pl. a tulajdonos kihagyott fizetése).

**Példa:** a saját startupod évi 12 millió Ft számviteli profitot hoz. Ha alkalmazottként évi 15 millió Ft-ot kereshetnél, a gazdasági profitod **−3 millió Ft** – közgazdaságilag jobb lenne elmenned alkalmazottnak (ha a pénz a fő szempont).

## A szoftver különleges költségszerkezete

A szoftvernek **nagyon magas a fix költsége** (fejlesztés) és **közel nulla a határköltsége** (egy újabb letöltés). Ezért:

- az átlagköltség a felhasználók számával szinte korlátlanul csökken,
- óriási a méretgazdaságosság → „a győztes mindent visz” piacok (12. témakör),
- az árat nem a határköltség, hanem a vevők fizetési hajlandósága határozza meg.

## Összefoglalás

- $TC = FC + VC$; $AC = TC/Q$; $MC$ = a következő egység többletköltsége.
- Csökkenő hozadék → emelkedő MC, U alakú AC; az MC az AC minimumában metszi.
- Méretgazdaságosság: nagyobb méret, kisebb átlagköltség.
- Gazdasági profit = számviteli profit − implicit (alternatív) költségek.
- Szoftver: magas fix, közel nulla határköltség.

## A lecke feladata

```quiz required
? Melyik **fix** költség egy webáruháznál?
+ az éves domain- és tárhelydíj
- a csomagküldés díja rendelésenként
- a bankkártyás fizetés jutaléka
- a csomagolóanyag
! Nem függ az eladott mennyiségtől.

? FC = 400 000 Ft, a változó költség egységenként 100 Ft. Mennyi a teljes költség 2000 egységnél (Ft)?
= 600000
! 400 000 + 100 · 2000.

? Mennyi ugyanitt az átlagköltség (Ft)?
= 300
! 600 000 / 2000.

? Hol metszi a határköltség-görbe az átlagköltség-görbét?
- az átlagköltség maximumában
+ az átlagköltség minimumában
- sehol
- a vízszintes tengelyen
! Ha MC < AC, az AC csökken; ha MC > AC, nő.

? A számviteli profitod 8 millió Ft, alkalmazottként 10 millió Ft-ot kereshetnél. Hány millió Ft a gazdasági profitod? (Előjellel.)
= -2
= −2
! 8 − 10.
```
