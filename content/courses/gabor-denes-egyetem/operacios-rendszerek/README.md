# Operációs rendszerek – tananyag

Ebben a mappában van az 1. féléves Operációs rendszerek (B-OPREND) tárgy tananyaga. Indításkor (és
`pnpm db:seed` futtatásakor) az oldal innen tölti be az adatbázisba a témaköröket és a leckéket.

A szerkezet a tantárgyleírás 16 témakörét követi, egy plusz **laborkörnyezet** témakörrel az elején:

- `01-laborkornyezet-virtualbox`: a VirtualBox 7.2, az Ubuntu 26.04 LTS és a Windows 11 telepítése
  lépésről lépésre (TPM, biztonságos rendszerindítás, Microsoft-fiók), vendégkiegészítők, pillanatképek.
  Azért van elöl, mert a leckék sorban nyílnak, és a későbbi témakörök kipróbálós feladatai erre a két
  virtuális gépre építenek.
- `02-felepites-es-funkciok` … `17-pelda-os-ek-es-osszehasonlitas`: a tantárgyleírás 16 témaköre.

Minden témakör végén egy `gyakorlas` lecke van ellenőrző kérdésekkel és összefoglaló feladatlappal; a 17. témakör gyakorló leckéje a tárgy záró összefoglalója. A mappák, a `topic.json` és a lecke fájlok
felépítése ugyanaz, mint a Programozási alapoknál (lásd `../programozas-alapjai/README.md`).

## Kötelező feladat: kvíz

A leckék kötelező feladata egy **kvízblokk**, mint a Digitális technikánál (a formátum leírása:
`../digitalis-technika/README.md`). Leckénként pontosan egy ` ```quiz required ` blokk kell; itt csak
begépelős (`=`) és feleletválasztós (`+` / `-`) kérdések vannak.

Szabályok:

- A magyar és az angol kvíz ugyanazokat a kérdéseket tartalmazza ugyanabban a sorrendben, a
  feleletválasztásnál a jó válasz ugyanazon a helyen van (a teszt ellenőrzi).
- A számolós feladatok eredményét Pythonnal ellenőriztük: ütemezés (FCFS, SJF, RR), lapcsere (FIFO,
  LRU, OPT), lemezütemezés (FCFS, SSTF, SCAN, C-SCAN), Amdahl-törvény, élő migráció. Ha egy példát
  módosítasz, a leckében és a gyakorló leckében is igazítsd hozzá.
- A ` ```python run ` blokkok futtatható szimulációk (a `tests/python-examples.test.ts` lefuttatja
  őket); a sima ` ```python ` blokk (pl. a socketes példa) nem fut a böngészőben.
- A Windows-parancsok ` ```powershell ` blokkban, a Linux-parancsok ` ```bash ` blokkban, a
  Dockerfile ` ```dockerfile ` blokkban vannak (a színezés mindhárom nyelvre be van töltve).
- A verziószámok (VirtualBox 7.2, Ubuntu 26.04 LTS, Linux 7.0 kernel, Windows 11) 2026 novemberi
  állapotot tükröznek; új kiadásnál az 1. témakört frissíteni kell.
