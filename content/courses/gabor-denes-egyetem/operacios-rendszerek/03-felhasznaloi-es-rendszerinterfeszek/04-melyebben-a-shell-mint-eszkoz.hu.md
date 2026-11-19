---
title: Mélyebben – a shell mint programozási nyelv és szövegfeldolgozó gép
summary: Mi történik az Enter lenyomása után, idézőjelek és helyettesítő karakterek, kilépési kódok és feltételes végrehajtás, környezeti változók és a PATH, egy naplóelemző csővezeték lépésről lépésre (Bashben, PowerShellben és Pythonban), valamint egy valódi mentőszkript.
minutes: 45
---

## Amit ebben a leckében megtanulsz

- mi történik a háttérben, amikor egy parancs után **Entert** nyomsz,
- mi a különbség a `'…'` és a `"…"` között, és hogyan működik a `*` helyettesítő karakter,
- mit jelent a **kilépési kód**, és hogyan fűzhetsz össze parancsokat feltételesen (`&&`, `||`),
- mi a **PATH**, és miért „nem található” néha egy parancs,
- hogyan építs fel lépésről lépésre egy **szövegfeldolgozó csővezetéket** – háromféle szemlélettel,
- hogyan írj **feltétellel és ciklussal** működő szkriptet.

## 1. Mi történik az Enter után?

Írd be az Ubuntu terminálba: `ls -l *.txt`. A shell ekkor nem egyszerűen „átadja” a szöveget az operációs rendszernek, hanem több lépést végez:

1. **Feldarabolás:** szavakra bontja a sort: `ls`, `-l`, `*.txt`.
2. **Kifejtés** (_expansion_): a `*.txt` helyére beírja az illeszkedő fájlneveket (pl. `a.txt b.txt`), a `$USER` helyére a változó értékét, a `~` helyére a saját mappád útvonalát.
3. **Keresés:** megkeresi, hol van az `ls` nevű program – a **PATH** változóban felsorolt mappákban (pl. `/usr/bin/ls`).
4. **Új folyamat:** létrehoz egy gyerekfolyamatot (`fork`), és abban elindítja a programot (`exec`) a kifejtett argumentumokkal.
5. **Várakozás:** megvárja, míg a program befejeződik, eltárolja a **kilépési kódját**, és új promptot ír ki.

**Hasonlat:** a shell olyan, mint egy tolmács egy étteremben. Te azt mondod: „mindegyik levesből kérek”; a tolmács megnézi az étlapot, kifejti, hogy ez „gulyás, húsleves, gombaleves”, megkeresi, melyik szakács főzi, átadja neki a rendelést, és megvárja, míg elkészül.

Ezt ki is próbálhatod:

```bash
type ls          # mi az „ls”? (álnév, beépített parancs vagy program?)
which python3    # hol van a program a lemezen?
echo $PATH       # mely mappákban keres a shell, kettősponttal elválasztva
echo *.txt       # mivé fejti ki a shell a mintát (az echo csak kiírja)
```

A 4. lépés (fork + exec) a folyamatok témakörben kerül elő részletesen: minden parancs, amit beírsz, egy **új folyamat** lesz.

## 2. Idézőjelek és helyettesítő karakterek

A kifejtés hasznos, de meglepetéseket is okozhat. Az idézőjelekkel szabályozod:

| Írásmód          | Mi történik?                                               | Példa                         | Eredmény                  |
| ---------------- | ---------------------------------------------------------- | ----------------------------- | ------------------------- |
| idézőjel nélkül  | minden kifejtés megtörténik, a szóközök szavakat választanak el | `echo $HOME *.txt`        | `/home/anna a.txt b.txt`  |
| `"…"` (dupla)    | a változók kifejtődnek, a `*` és a szóközök nem            | `echo "$HOME *.txt"`          | `/home/anna *.txt`        |
| `'…'` (szimpla)  | **semmi** nem fejtődik ki, betű szerint marad              | `echo '$HOME *.txt'`          | `$HOME *.txt`             |

Gyakori hiba: egy szóközt tartalmazó fájlnév. A `rm Saját dokumentum.txt` **két** fájlt próbál törölni (`Saját` és `dokumentum.txt`)! Helyesen: `rm "Saját dokumentum.txt"`. Szkriptben a változókat mindig tedd dupla idézőjelbe: `"$fajl"`.

A helyettesítő karakterek (_glob_):

| Minta      | Jelentés                          | Példa                                  |
| ---------- | --------------------------------- | -------------------------------------- |
| `*`        | bármennyi (akár 0) karakter       | `*.log` – minden `.log` végű fájl      |
| `?`        | pontosan egy karakter             | `nap?.txt` – `nap1.txt`, `nap2.txt`    |
| `[abc]`    | egy karakter a felsoroltak közül  | `[ab]*.txt` – `a` vagy `b` kezdetű     |

Figyelem: a glob **nem** reguláris kifejezés! A `*` itt „bármi”, a regexben „az előző karakter akárhányszor”.

## 3. Kilépési kód és feltételes végrehajtás

Minden program egy **kilépési kóddal** (_exit code_) fejeződik be: **0 = siker**, bármi más = valamilyen hiba. Az utolsó parancs kódja a `$?` változóban van:

```bash
ls /etc > /dev/null ; echo $?        # 0 – sikerült
ls /nincs-ilyen     ; echo $?        # 2 – hiba (nincs ilyen mappa)
```

(A `/dev/null` egy „fekete lyuk”: ami beleírsz, eltűnik. Akkor hasznos, ha a kimenet nem érdekel.)

A kilépési kódra építve fűzhetsz össze parancsokat:

| Összekötés | Jelentés                                          | Példa                                           |
| ---------- | ------------------------------------------------- | ----------------------------------------------- |
| `a ; b`    | `a`, utána `b` mindenképp                         | `cd /tmp ; ls`                                  |
| `a && b`   | `b` csak akkor fut, ha `a` **sikerült**           | `sudo apt update && sudo apt upgrade`           |
| `a \|\| b` | `b` csak akkor fut, ha `a` **nem sikerült**       | `ping -c1 pelda.hu \|\| echo "Nincs net!"`       |

Az `apt update && apt upgrade` azért jó szokás, mert ha a csomaglista frissítése nem sikerül (pl. nincs internet), a frissítés el sem indul.

## 4. Környezeti változók és a PATH

A **környezeti változók** olyan név–érték párok, amelyeket minden elindított program megkap a szülőjétől:

```bash
echo $USER $HOME $SHELL      # néhány beépített változó
env | head                   # az összes környezeti változó (eleje)
export SZIN=kek              # saját változó, amit a gyerekfolyamatok is látnak
bash -c 'echo $SZIN'         # egy új shell (gyerekfolyamat) is látja: kek
```

A legfontosabb közülük a **PATH**: ha beírod, hogy `python3`, a shell sorban végignézi a PATH mappáit, és az **első** találatot indítja. Ha egy programot olyan mappába telepítesz, ami nincs a PATH-ban, a shell „command not found” hibát ad – pedig a program ott van. Megoldás: teljes útvonallal indítod (`./program` vagy `/opt/eszkoz/bin/program`), vagy hozzáadod a mappát a PATH-hoz:

```bash
export PATH="$PATH:$HOME/bin"     # a ~/bin mappát a lista végére tesszük
```

**Biztonsági megjegyzés:** soha ne tedd a PATH **elejére** az aktuális mappát (`.`)! Ha valaki egy `ls` nevű kártevőt hagy egy mappában, és te ott kiadod az `ls` parancsot, az ő programja futna a valódi helyett. (Ezért kell Linuxon a saját programot `./program` alakban indítani.)

Windowson is van PATH (`$env:Path` PowerShellben), és ugyanígy működik; a környezeti változókat a *Rendszer → Speciális rendszerbeállítások → Környezeti változók* ablakban is szerkesztheted.

## 5. Esettanulmány: naplóelemzés csővezetékkel

**Feladat:** egy webkiszolgáló naplójában minden sor egy kérés. Melyik IP-címről jött **a legtöbb** kérés? (Ez egy valódi rendszergazdai kérdés: így szúrható ki például egy támadó.)

Hozz létre egy mintanaplót az Ubuntu VM-ben:

```bash
cat > access.log << 'VEGE'
10.0.0.5 GET /index.html 200
10.0.0.7 GET /login 200
10.0.0.5 GET /kepek/logo.png 200
192.168.1.66 POST /login 401
192.168.1.66 POST /login 401
10.0.0.9 GET /index.html 200
192.168.1.66 POST /login 401
10.0.0.5 GET /rolunk 404
VEGE
```

(A `<< 'VEGE'` egy úgynevezett _here document_: a következő sorokat a `VEGE` sorig a parancs bemenetére küldi.)

Építsd fel a csővezetéket **lépésenként**, és minden lépés után nézd meg a kimenetet:

```bash
cut -d ' ' -f 1 access.log                                   # 1. csak az első mező (IP-cím)
cut -d ' ' -f 1 access.log | sort                            # 2. rendezve (az azonosak egymás mellé kerülnek)
cut -d ' ' -f 1 access.log | sort | uniq -c                  # 3. az egymás melletti azonosak megszámolva
cut -d ' ' -f 1 access.log | sort | uniq -c | sort -nr       # 4. darabszám szerint csökkenően
cut -d ' ' -f 1 access.log | sort | uniq -c | sort -nr | head -1   # 5. csak az első
```

Mindegyik program **egy dolgot** csinál, és a cső köti össze őket. A `uniq` csak az **egymás melletti** ismétlődéseket vonja össze – ezért kell előtte a `sort`.

Egy további kérdés: kik kaptak **401-es** (sikertelen bejelentkezés) választ?

```bash
grep ' 401$' access.log | cut -d ' ' -f 1 | sort -u          # -u: minden cím egyszer
```

### Ugyanez PowerShellben – objektumokkal

A PowerShell nem szövegsorokat, hanem objektumokat ad tovább, ezért a „mezők” nevet kapnak:

```powershell
Get-Content access.log |
  ForEach-Object { ($_ -split ' ')[0] } |        # az első mező minden sorból
  Group-Object |                                  # csoportosítás (sort + uniq -c egyben)
  Sort-Object Count -Descending |
  Select-Object -First 1 Count, Name
```

### Ugyanez Pythonban – programként

Ugyanazt a gondolatmenetet egy programozási nyelven is megírhatod. Futtasd és hasonlítsd össze a lépéseket!

```python run
# A csővezeték lépései Pythonban: mező kivágása → számlálás → rendezés → első.
from collections import Counter

naplo = """10.0.0.5 GET /index.html 200
10.0.0.7 GET /login 200
10.0.0.5 GET /kepek/logo.png 200
192.168.1.66 POST /login 401
192.168.1.66 POST /login 401
10.0.0.9 GET /index.html 200
192.168.1.66 POST /login 401
10.0.0.5 GET /rolunk 404"""

ip_cimek = [sor.split(" ")[0] for sor in naplo.splitlines()]   # cut -d ' ' -f 1
szamlalo = Counter(ip_cimek)                                    # sort | uniq -c
for ip, db in szamlalo.most_common():                           # sort -nr
    print(f"{db:3} {ip}")
print("A legtöbb kérés:", szamlalo.most_common(1)[0])           # head -1

sikertelen = sorted({sor.split(" ")[0] for sor in naplo.splitlines() if sor.endswith(" 401")})
print("Sikertelen bejelentkezés innen:", sikertelen)            # grep ' 401$' | cut | sort -u
```

**Három szemlélet, egy feladat:** a Bash szövegsorokat alakít kis programok láncán, a PowerShell objektumokat, a Python pedig adatszerkezeteket (lista, szótár). Gyors, egyszeri kérdésre a csővezeték a leggyorsabb; ha a logika bonyolódik (több feltétel, hibakezelés), érdemes programot írni.

## 6. Szkript feltétellel és ciklussal – egy valódi mentőszkript

Az előző leckében láttál egy egyszerű szkriptet. Most írjunk egy hasznosat: **mentsük el** a `~/labor` mappa összes `.txt` fájlját egy dátummal jelölt mappába.

```bash
nano mentes.sh
```

```bash
#!/bin/bash
# A ~/labor mappa .txt fájljainak mentése egy dátumozott mappába.
set -euo pipefail                      # hibánál álljon meg, ne használjon nem létező változót

forras="$HOME/labor"
cel="$HOME/mentesek/$(date +%Y-%m-%d_%H%M)"   # pl. mentesek/2026-11-19_1430

if [ ! -d "$forras" ]; then            # ha nincs forrásmappa, kilépünk hibakóddal
  echo "Nincs ilyen mappa: $forras" >&2
  exit 1
fi

mkdir -p "$cel"                        # -p: a szülőmappákat is létrehozza
db=0
for fajl in "$forras"/*.txt; do        # ciklus az összes .txt fájlon
  [ -e "$fajl" ] || continue           # ha egy sincs, a minta szó szerint marad – kihagyjuk
  cp "$fajl" "$cel/"
  db=$((db + 1))                       # aritmetika: $(( ... ))
done

echo "$db fájl mentve ide: $cel"
```

```bash
chmod +x mentes.sh
./mentes.sh
ls ~/mentesek
```

Néhány új elem:

- `if [ feltétel ]; then … fi` – elágazás; `-d` = létező mappa, `-e` = létező fájl, `!` = tagadás.
- `for x in lista; do … done` – ciklus.
- `>&2` – a hibaüzenet a hibakimenetre (_stderr_) megy, nem a normál kimenetre.
- `set -euo pipefail` – „biztonsági öv”: a szkript az első hibánál megáll, ahelyett hogy vakon folytatná.

## Összefoglalás

- Enter után a shell **feldarabol, kifejt, keres (PATH), új folyamatot indít, vár**.
- `"…"`-ben a változók kifejtődnek, `'…'`-ben semmi; a szóközös fájlneveket mindig tedd idézőjelbe.
- A **kilépési kód** 0 = siker; `&&` csak siker után, `||` csak hiba után futtatja a következő parancsot.
- A **PATH** mondja meg, hol keresi a shell a programokat; a `.` soha ne legyen az elején.
- Csővezeték: `cut | sort | uniq -c | sort -nr | head` – minden program egy dolgot csinál jól. Ugyanez PowerShellben objektumokkal, Pythonban adatszerkezetekkel.
- A szkriptekben `if`, `for`, változók és `set -euo pipefail` teszik a munkát megbízhatóvá.

## A lecke feladata

```quiz required
? Mit ír ki az `echo '$HOME'` parancs?
- a saját mappád útvonalát, pl. /home/anna
+ szó szerint azt, hogy $HOME
- semmit
! Szimpla idézőjelek között semmi sem fejtődik ki.

? Melyik parancs törli helyesen a „Saját dokumentum.txt” nevű fájlt?
- rm Saját dokumentum.txt
+ rm "Saját dokumentum.txt"
- rm Saját_dokumentum.txt
! Idézőjel nélkül a shell két külön fájlnévnek értené.

? Milyen kilépési kód jelenti azt, hogy egy program sikeresen lefutott?
= 0
! Minden más érték valamilyen hibát jelez.

? A `ping -c1 pelda.hu || echo "Nincs net!"` parancsban mikor fut le az echo?
- mindig
- ha a ping sikerült
+ ha a ping nem sikerült
! A || csak hiba esetén futtatja a jobb oldalt.

? Miért kell a `uniq -c` elé `sort` a csővezetékben?
+ mert a uniq csak az egymás melletti ismétlődéseket vonja össze
- mert a uniq csak rendezett számokkal működik
- mert a sort törli a duplikátumokat
! Rendezés után az azonos sorok egymás mellé kerülnek.

? Melyik környezeti változó sorolja fel azokat a mappákat, ahol a shell a programokat keresi?
= PATH
= $PATH
! Pl. /usr/local/bin:/usr/bin:/bin
```
