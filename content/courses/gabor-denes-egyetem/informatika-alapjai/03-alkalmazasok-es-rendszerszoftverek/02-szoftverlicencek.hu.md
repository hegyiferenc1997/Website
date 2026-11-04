---
title: Szoftverlicencek
summary: Kereskedelmi, ingyenes, nyílt forráskódú és előfizetéses szoftver; GPL, MIT és társaik.
minutes: 15
---

## Amit ebben a leckében megtanulsz

- mi a **licenc**, és miért nem „veszed meg” a szoftvert,
- a fő licenctípusokat: **kereskedelmi**, **freeware**, **shareware**, **nyílt forráskódú**, **előfizetéses (SaaS)**,
- mi a különbség a **GPL** és az **MIT** licenc között.

## Mi a licenc?

Szoftver vásárlásakor általában nem a programot, hanem egy **felhasználási jogot** kapsz. A **licenc** (felhasználási szerződés, EULA) írja le, mit tehetsz: hány gépre telepítheted, használhatod-e cégben, módosíthatod-e, továbbadhatod-e.

## Licenctípusok

| Típus               | Ár                                 | Forráskód                  | Példa                                        |
| ------------------- | ---------------------------------- | -------------------------- | -------------------------------------------- |
| kereskedelmi (zárt) | fizetős                            | nem látható                | Windows, Photoshop                           |
| freeware            | ingyenes                           | nem látható                | Zoom alapcsomag, Adobe Reader                |
| shareware / próba   | ingyen kipróbálható, aztán fizetős | nem látható                | WinRAR, 30 napos próbaverziók                |
| nyílt forráskódú    | általában ingyenes                 | **nyilvános, módosítható** | Linux, Firefox, VS Code (Code – OSS), Python |
| előfizetéses (SaaS) | havi/éves díj                      | nem látható                | Microsoft 365, Adobe Creative Cloud          |

A **freeware** ingyenes, de nem nyílt: nem nézheted meg és nem módosíthatod a kódját. A **nyílt forráskódú** (open source) szoftver kódja bárki számára elérhető.

## Nyílt licencek: megengedő és copyleft

- **Megengedő** licencek (**MIT**, **Apache 2.0**, BSD): szinte bármit megtehetsz a kóddal, akár zárt termékbe is beépítheted, csak a szerzői jogi megjegyzést kell megtartanod.
- **Copyleft** licencek (**GPL**): ha módosított változatot terjesztesz, azt is **ugyanilyen licenccel, forráskóddal együtt** kell kiadnod. A Linux kernel GPL-es.

## Miért fontos ez egy mérnöknek?

Ha egy cég termékébe nyílt forráskódú könyvtárat építesz, a licence meghatározza, mit kell betartani. Egy GPL-es könyvtár beépítése egy zárt termékbe jogi kockázat lehet; egy MIT-es általában nem.

A **kalóz** (licenc nélküli) szoftver használata jogsértés, és gyakran kártevőt is tartalmaz.

## Összefoglalás

- A licenc felhasználási jogot ad, nem tulajdont.
- Freeware = ingyenes, de zárt; open source = nyilvános, módosítható kód.
- MIT/Apache: megengedő; GPL: copyleft, a módosítást is nyíltan kell kiadni.

## A lecke feladata

```quiz required
? Mi jellemző a **freeware** szoftverre?
+ Ingyenes, de a forráskódja nem elérhető.
- Fizetős, de a forráskódja nyilvános.
- Csak 30 napig használható.
- Bárki módosíthatja és továbbadhatja.
! A freeware nem azonos a nyílt forráskóddal.

? Melyik licenc **copyleft**, vagyis a módosított változatot is ugyanígy nyíltan kell kiadni?
- MIT
- Apache 2.0
+ GPL
- BSD
! GNU General Public License.

? Melyik licenc alatt fut a Linux kernel?
= GPL
= GPLv2
= GPL-2.0
! A Linux kernel GPLv2 licencű.

? Melyik **előfizetéses** szoftver (SaaS)?
- 7-Zip
- Linux
+ Microsoft 365
- Firefox
! Havi vagy éves díjért használható.
```
