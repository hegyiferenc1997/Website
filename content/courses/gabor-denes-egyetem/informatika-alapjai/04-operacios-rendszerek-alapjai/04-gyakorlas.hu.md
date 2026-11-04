---
title: Gyakorlás – operációs rendszerek alapjai
summary: Ellenőrző kérdések és összefoglaló feladatlap az OS feladatairól, a fájlokról és a parancssorról.
minutes: 18
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Miért futtat a böngésző minden fület külön folyamatban?</summary>

Mert a folyamatok memóriája el van választva: ha egy oldal lefagy vagy összeomlik, csak az ő folyamata áll le, a többi fül működik tovább. Ez biztonsági előny is.

</details>

<details>
<summary>2. Mi a különbség a `C:\Users\anna\a.txt` és a `..\a.txt` út között?</summary>

Az első abszolút: a meghajtó gyökerétől indul, bárhonnan ugyanazt jelenti. A második relatív: az aktuális mappa szülőjében lévő `a.txt`-t jelenti, tehát attól függ, hol állsz.

</details>

<details>
<summary>3. Egy 6 GB-os videót nem tudsz rámásolni a pendrive-ra, pedig van rajta 20 GB szabad hely. Mi lehet az oka?</summary>

A pendrive valószínűleg FAT32-re van formázva, ahol egy fájl legfeljebb 4 GB lehet. exFAT-ra formázva (adatmentés után!) a gond megszűnik.

</details>

Próbáld ki a saját gépeden (PowerShell):

```powershell
pwd
mkdir proba
cd proba
"szia" > hello.txt
cat hello.txt
cd ..
Get-Process | Sort-Object CPU -Descending | Select-Object -First 5
```

## Összefoglaló feladatlap

```quiz required
? Melyik operációs rendszer fut a legtöbb webszerveren?
- Windows 11
+ Linux
- iOS
- macOS
! A felhő és a szerverek nagy része Linuxon fut.

? Melyik fájlrendszer a Windows alapértelmezett fájlrendszere?
= NTFS
! New Technology File System.

? Mi az a `PID`?
+ egy folyamat azonosító száma
- egy fájl kiterjesztése
- a processzor típusa
- a jelszó rövidítése
! Process ID.

? Melyik parancs hoz létre új mappát?
= mkdir
! make directory.

? Mit jelent a `-rw-r--r--` jogosultság a **tulajdonos** számára?
+ olvashatja és írhatja, de nem futtathatja
- csak olvashatja
- mindent megtehet
- semmit sem tehet
! Az első hármas (rw-) a tulajdonosé.

? Mi történik egy fájllal, amit Linuxon az `rm` paranccsal törölsz?
- a Lomtárba kerül
+ azonnal törlődik, a Lomtárba nem kerül
- csak elrejtődik
- átkerül a gyökérkönyvtárba
! A parancssori törlés végleges.
```
