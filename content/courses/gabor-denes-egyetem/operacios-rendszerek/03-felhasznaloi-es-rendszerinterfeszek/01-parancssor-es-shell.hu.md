---
title: A parancssor és a shell
summary: Mi a shell, mi a különbség a terminál és a shell között, és melyek a legfontosabb Bash és PowerShell parancsok.
minutes: 25
---

## Amit ebben a leckében megtanulsz

- mi a **parancssori felület** (CLI), a **terminál** és a **shell**,
- a legfontosabb **Bash** parancsokat a fájlok és mappák kezeléséhez,
- ugyanezeket **PowerShellben**, és mire jó a **cső** (`|`) és az **átirányítás** (`>`).

## Terminál, shell, parancs

- A **terminál** (terminálemulátor) az ablak, amelyben gépelsz (Ubuntu: _Terminál_, Windows: _Windows Terminal_).
- A **shell** (héj) a program, amely a begépelt parancsot **értelmezi** és végrehajtja. Linuxon általában **Bash**, Windowson **PowerShell** (vagy a régi `cmd.exe`).
- A shell azért „héj”, mert a kernel köré épülő külső réteg: a felhasználó rajta keresztül kéri az OS szolgáltatásait.

Miért érdemes megtanulni, ha van grafikus felület? Mert **gyorsabb**, **automatizálható** (parancsfájlba írható), és szervereken gyakran **nincs is** grafikus felület.

Egy parancs felépítése: `parancs -kapcsolók argumentumok`, pl. `ls -l /home`.

## Alapparancsok Bashben (próbáld ki az Ubuntu VM-ben!)

```bash
pwd                     # hol vagyok? (print working directory)
ls -la                  # a mappa tartalma, rejtett fájlokkal, részletesen
cd /etc                 # belépés egy mappába; cd ~ = saját mappa, cd .. = egy szinttel feljebb
mkdir labor             # új mappa
cd ~/labor
echo "hello OS" > a.txt # szöveg írása fájlba (felülírja)
echo "második sor" >> a.txt   # hozzáfűzés a fájl végéhez
cat a.txt               # a fájl tartalma
cp a.txt b.txt          # másolás
mv b.txt c.txt          # átnevezés / áthelyezés
rm c.txt                # törlés (nincs kuka!)
man ls                  # az ls kézikönyve (kilépés: q)
```

### Cső és átirányítás

- `>` a kimenetet fájlba írja, `>>` hozzáfűzi, `<` fájlból olvas.
- A **cső** (`|`) az egyik program kimenetét a következő bemenetére köti:

```bash
ls /etc | wc -l               # hány elem van az /etc mappában?
ps aux | grep firefox         # fut-e a Firefox?
history | tail -5             # az utolsó 5 parancsod
```

A UNIX-filozófia: **kis programok, amelyek egy dolgot csinálnak jól**, és csövekkel összeköthetők.

## Ugyanez PowerShellben

| Feladat             | Bash               | PowerShell (rövid alias)         |
| ------------------- | ------------------ | -------------------------------- |
| hol vagyok          | `pwd`              | `Get-Location` (`pwd`)           |
| listázás            | `ls -la`           | `Get-ChildItem -Force` (`ls`, `dir`) |
| mappaváltás         | `cd mappa`         | `Set-Location mappa` (`cd`)      |
| fájl tartalma       | `cat a.txt`        | `Get-Content a.txt` (`cat`)      |
| másolás             | `cp a b`           | `Copy-Item a b` (`cp`)           |
| törlés              | `rm a`             | `Remove-Item a` (`rm`, `del`)    |
| keresés szövegben   | `grep szó`         | `Select-String szó`              |
| súgó                | `man ls`           | `Get-Help Get-ChildItem`         |

A PowerShell parancsai (_cmdlet_) **Ige-Főnév** alakúak (`Get-Process`, `Stop-Service`), és a csövön nem szöveget, hanem **objektumokat** adnak tovább:

```powershell
# A 3 legtöbb memóriát használó folyamat.
Get-Process | Sort-Object WorkingSet -Descending | Select-Object -First 3 Name, WorkingSet
```

## Összefoglalás

- A terminál az ablak, a shell a parancsértelmező (Bash, PowerShell).
- Alapparancsok: `pwd`, `ls`, `cd`, `mkdir`, `cat`, `cp`, `mv`, `rm`, `man`.
- `>` felülír, `>>` hozzáfűz, `|` összeköti a programokat.
- A PowerShell Ige-Főnév parancsokat és objektumcsöveket használ.

## A lecke feladata

```quiz required
? Melyik Bash parancs írja ki az aktuális mappa teljes elérési útját?
= pwd
! print working directory

? Mi a különbség a `>` és a `>>` között?
- A `>` hozzáfűz, a `>>` felülír.
+ A `>` felülírja a fájlt, a `>>` a végéhez fűz.
- Nincs különbség.
- A `>>` két fájlba ír egyszerre.
! echo "x" >> a.txt a fájl végére írja az x-et.

? Melyik jel köti össze az egyik program kimenetét a másik bemenetével?
= |
! Ez a cső (pipe), pl. ls | wc -l

? Melyik PowerShell cmdlet felel meg a Bash `cat` parancsának?
+ Get-Content
- Get-ChildItem
- Set-Location
- Select-String
! Get-Content a.txt – aliasa a cat is.

? Melyik paranccsal nyitod meg az `ls` kézikönyvét Linuxon?
= man ls
! Kilépés a q billentyűvel.
```
