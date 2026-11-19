---
title: Mélyebben – folyamatok és szálak a boncasztalon
summary: Egy folyamat belülről a /proc fájlrendszerben, a fork költsége és a copy-on-write, zombi és árva folyamat előállítása saját kezűleg, munkakezelés jelzésekkel (Ctrl+Z, bg, fg, kill), szálak megszámolása Linuxon és Windowson, valamint az öt állapotú modell Python-szimulációja.
minutes: 45
---

## Amit ebben a leckében megtanulsz

- hogyan nézz bele egy futó folyamatba a **`/proc`** fájlrendszeren keresztül,
- miért olcsó a `fork()`: a **copy-on-write** trükk,
- hogyan állíts elő **saját kezűleg** egy zombi és egy árva folyamatot – és hogyan tűnnek el,
- hogyan **kezeld a futó programokat** jelzésekkel (Ctrl + Z, `bg`, `fg`, `kill`),
- hogyan számold meg egy program **szálait** Linuxon és Windowson,
- és hogyan „lépked” egy folyamat az **öt állapot** között – egy kis szimulációban.

## 1. Egy folyamat belülről: a /proc

Linuxon minden futó folyamatról van egy **mappa** a `/proc` alatt, a PID-jével elnevezve. Ezek nem valódi fájlok a lemezen: a kernel **menet közben generálja** a tartalmukat, amikor beleolvasol. A `/proc/self` mindig annak a folyamatnak a mappája, amelyik éppen olvassa.

Próbáld ki az Ubuntu VM-ben:

```bash
echo $$                          # a shelled PID-je
ls /proc/$$                      # a shelled „boncolt” adatai
grep -E 'Name|State|PPid|Threads|VmRSS' /proc/$$/status
                                 # név, állapot, szülő, szálak száma, valódi memóriahasználat
ls -l /proc/$$/fd                # a megnyitott fájlleírók: 0 = bemenet, 1 = kimenet, 2 = hibakimenet
cat /proc/$$/maps | head         # a címtér térképe: kód, könyvtárak, kupac, verem
cat /proc/$$/limits | head -5    # korlátok: max. megnyitott fájlok, verem mérete…
```

Ami itt látszik, az pontosan a **folyamatvezérlő blokk** (PCB) és a **címtér** egy része, amiről az első leckében tanultál:

| A PCB eleme              | Hol látod?                          |
| ------------------------ | ----------------------------------- |
| azonosító, szülő         | `status`: `Pid`, `PPid`             |
| állapot                  | `status`: `State` (R, S, D, Z, T)   |
| megnyitott fájlok        | `fd/` mappa                         |
| memória (címtér)         | `maps`, `status`: `VmRSS`, `VmSize` |
| ütemezési adatok         | `sched`, `stat`                     |

A `VmSize` a **virtuális** címtér mérete (amennyit a folyamat „lefoglalt”), a `VmRSS` (_resident set size_) az, ami **ténylegesen a RAM-ban** van. A kettő között gyakran nagy a különbség – ennek okáról a memóriakezelés témakörben lesz szó.

## 2. Miért olcsó a fork? – copy-on-write

Az előző leckében láttad, hogy a `fork()` **lemásolja** a folyamatot. Ha egy 2 GB memóriát használó program forkol, a kernel tényleg átmásol 2 GB-ot? Az lassú is lenne, és fölösleges is – a gyerek legtöbbször azonnal `exec()`-et hív, vagyis az egészet eldobja.

A megoldás a **copy-on-write** (írásra másolás): a fork után a szülő és a gyerek **ugyanazokat a fizikai memórialapokat** használja, csak mindkettőnél „csak olvasható”-nak jelölve. Amíg egyikük sem ír, nem kell másolni semmit. Ha valamelyikük **ír** egy lapra, a processzor jelez a kernelnek, és a kernel **csak azt az egy lapot** másolja le az író fél számára.

**Hasonlat:** két testvér közös tankönyvet kap. Amíg csak olvassák, egy példány elég. Ha valamelyikük jegyzetelni akar bele, kap egy saját fénymásolatot **arról az egy oldalról**, amelyre írni szeretne.

Ezért van az, hogy Linuxon egy folyamat létrehozása tipikusan csak **néhány tized milliszekundum**, és a shell nyugodtan forkolhat minden begépelt parancsnál.

## 3. Zombi és árva – saját kezűleg

### Zombi

Egy zombi akkor keletkezik, ha a gyerek befejeződik, de a szülő **nem hívja meg a `wait()`-et**. Előállítunk egyet:

```bash
bash -c 'sleep 2 & exec sleep 60' &
```

Mi történik itt? Egy új `bash` elindít a háttérben egy `sleep 2` gyereket, majd **lecseréli magát** (`exec`) egy `sleep 60` programra. A `sleep 60` nem tudja, hogy gyereke van, ezért sosem hív `wait()`-et. Várj 3 másodpercet, majd:

```bash
ps -o pid,ppid,stat,cmd -C sleep      # az összes sleep folyamat
```

A `sleep 2` sorában (amelynek szülője, `PPID`-je a `sleep 60`) a `STAT` oszlopban **`Z`** áll, a parancs neve mellett pedig `<defunct>` („elhunyt”). A zombi már nem fut, nem eszik processzort, csak egy bejegyzést foglal a folyamattáblában. Ha a szülő (`sleep 60`) véget ér, a zombit örökli a rendszer, és eltakarítja – nézd meg egy perc múlva újra!

### Árva

Az árva fordított eset: a szülő hal meg előbb.

```bash
bash -c 'sleep 120 &' ; ps -o pid,ppid,cmd -C sleep
```

A belső `bash` elindítja a `sleep 120`-at, majd azonnal kilép. A `ps` kimenetében a `sleep` szülője (`PPID`) már **nem** az elhunyt bash, hanem egy „örökbefogadó” folyamat: a `systemd` (PID 1) vagy a bejelentkezésedhez tartozó `systemd --user`. Nézd meg, ki az: `ps -p <PPID> -o pid,cmd`.

**Tanulság:** az árva rendben van, a rendszer gondoskodik róla. A **sok** zombi viszont hibás szülőprogramra utal (nem hív `wait()`-et), és ha elfogynak a PID-ek, új folyamat nem indulhat.

## 4. Munkakezelés jelzésekkel

A shell egyszerre több programot is kezelhet: egy van **előtérben** (ez kapja a billentyűzetet), a többi a **háttérben** fut vagy **felfüggesztve** vár.

```bash
sleep 300            # előtérben fut – a terminál „foglalt”
# nyomd meg: Ctrl + Z  → SIGTSTP: felfüggesztve („Stopped”)
jobs                 # a munkák listája: [1]+ Stopped  sleep 300
bg %1                # folytatás a háttérben (SIGCONT)
jobs                 # [1]+ Running  sleep 300 &
fg %1                # vissza az előtérbe
# nyomd meg: Ctrl + C  → SIGINT: megszakítás
```

Jelzést bármelyik folyamatnak küldhetsz a PID-je alapján is:

```bash
sleep 300 &                  # a & azonnal a háttérbe teszi; a shell kiírja a PID-et
kill -STOP $!                # felfüggesztés ($! = az utolsó háttérfolyamat PID-je)
ps -o pid,stat,cmd -p $!     # STAT: T (stopped)
kill -CONT $!                # folytatás – STAT: S (alszik, vár az időre)
kill $!                      # udvarias leállítás (SIGTERM)
```

Ha egy programot úgy akarsz elindítani, hogy a terminál bezárása után is fusson, használd a `nohup` parancsot (`nohup ./hosszu_munka.sh &`): ez figyelmen kívül hagyatja a `SIGHUP` jelzést, amelyet a terminál bezárásakor kapna.

Windowson a Feladatkezelő **Részletek** lapján jobb gomb → **Folyamat befejezése** felel meg a `kill`-nek, PowerShellben pedig: `Stop-Process -Id 1234` (udvarias kérés nincs külön: a grafikus programok a „bezárás” üzenetet kapják, a `Stop-Process` azonnal leállít).

## 5. Szálak számolása

Melyik program hány szálon fut? Linuxon:

```bash
ps -eo pid,nlwp,comm --sort=-nlwp | head    # NLWP = szálak száma; a legtöbb szálú programok elöl
ls /proc/$(pgrep -n firefox)/task | wc -l   # a Firefox szálai (ha fut)
top -H -p $(pgrep -n firefox)               # szálanként mutatja a processzorhasználatot (kilépés: q)
```

Windowson a Feladatkezelő **Részletek** lapján jobb gomb az oszlopfejlécen → **Oszlopok kijelölése** → **Szálak**. PowerShellben:

```powershell
Get-Process | Sort-Object { $_.Threads.Count } -Descending |
  Select-Object -First 5 Name, @{ n = 'Szalak'; e = { $_.Threads.Count } }
```

Meglepő lehet, hogy egy böngésző vagy egy játék **tucatnyi–százas nagyságrendű** szálat használ: külön szál kezeli a hálózatot, a hangot, a lemez-I/O-t, a felületet, és több szál dolgozik a weboldalak JavaScriptjén vagy a grafikán. Egy szál létrehozása **olcsóbb**, mint egy folyamaté (nem kell új címtér), és a szálak **közös memórián** keresztül gyorsan kommunikálnak – cserébe egy szál hibája az egész folyamatot magával ránthatja. A modern böngészők ezért **kevert** megoldást használnak: minden lap külön **folyamat** (ha egy lap összeomlik, a többi él), és azon belül sok szál.

## 6. Az öt állapotú modell szimulációja

Az első leckében láttad az öt állapotot: **új → kész → fut → várakozik → kész → … → befejezett**. Nem minden átmenet megengedett: például egy várakozó folyamat nem kerülhet **közvetlenül** futó állapotba, előbb vissza kell állnia a kész sorba.

A szimuláció egy folyamat életét követi végig eseményekről eseményre, és szól, ha egy átmenet szabálytalan. Futtasd, majd próbálj ki saját eseménysorokat!

```python run
# Az öt állapotú folyamatmodell: melyik eseményre melyik állapotba lép a folyamat?
ATMENETEK = {
    ("új", "felvétel"): "kész",                 # az OS felveszi a kész sorba
    ("kész", "ütemező kiválasztja"): "fut",
    ("fut", "lejárt az időszelet"): "kész",     # időzítő-megszakítás
    ("fut", "I/O-ra vár"): "várakozik",         # pl. lemezolvasás
    ("várakozik", "I/O kész"): "kész",          # megszakítás: megjött az adat
    ("fut", "kilépés"): "befejezett",
}

def eletut(esemenyek):
    allapot = "új"
    print(f"kezdet: {allapot}")
    for e in esemenyek:
        uj = ATMENETEK.get((allapot, e))
        if uj is None:
            print(f"  ✗ szabálytalan: {allapot} állapotban nem történhet meg: „{e}”")
            return
        print(f"  {allapot:10} --[{e}]--> {uj}")
        allapot = uj
    print(f"vége: {allapot}")

eletut(["felvétel", "ütemező kiválasztja", "I/O-ra vár", "I/O kész",
        "ütemező kiválasztja", "lejárt az időszelet", "ütemező kiválasztja", "kilépés"])
print()
eletut(["felvétel", "ütemező kiválasztja", "I/O-ra vár", "ütemező kiválasztja"])
```

A második életút azért szabálytalan, mert a várakozó folyamatot az ütemező nem választhatja ki: amíg az adat meg nem jön, nincs mit futtatni.

## Összefoglalás

- A **`/proc/<PID>`** mappák a kernel által menet közben generált „ablakok” a folyamatok PCB-jére és címterére (`status`, `fd`, `maps`).
- A **copy-on-write** miatt a `fork()` gyors: csak az a lap másolódik, amelyre valaki ír.
- **Zombi**: befejeződött, de a szülő nem hívott `wait()`-et (`Z`, `<defunct>`); **árva**: a szülő hamarabb halt meg, a rendszer örökbe fogadja.
- **Munkakezelés:** Ctrl + Z (felfüggesztés), `bg`, `fg`, `jobs`, `kill -STOP/-CONT`, `nohup`.
- A modern programok sok szálon futnak; a böngészők a biztonság és a stabilitás miatt folyamatokat és szálakat is használnak.
- Az öt állapotú modellben nem minden átmenet megengedett – pl. várakozóból csak a kész állapotba lehet lépni.

## A lecke feladata

```quiz required
? Melyik mappában találod Linuxon a 1234-es PID-ű folyamat adatait?
= /proc/1234
= /proc/1234/
! A kernel menet közben generálja a tartalmát.

? Mit jelent a copy-on-write a fork() után?
- a kernel azonnal lemásolja a szülő teljes memóriáját
+ a szülő és a gyerek közösen használja a lapokat, és csak az írt lapról készül másolat
- a gyerek nem írhat a memóriába
! Így a fork gyors, és a gyakori fork + exec esetén szinte semmit nem kell másolni.

? A ps kimenetében egy folyamat STAT oszlopában Z áll, mellette <defunct>. Milyen folyamat ez?
- árva
+ zombi
- felfüggesztett
! Befejeződött, de a szülője még nem hívott wait()-et.

? Egy folyamat szülője meghalt, a folyamat tovább fut. Ki lesz az új szülője Linuxon?
+ egy örökbefogadó folyamat, pl. a systemd (PID 1)
- senki, a folyamat szülő nélkül fut tovább
- a kernel azonnal leállítja
! Az árvákat a rendszer örökbe fogadja.

? Egy előtérben futó programot a terminálban Ctrl + Z-vel felfüggesztettél. Melyik paranccsal folytatod a háttérben?
= bg
= bg %1
! A fg az előtérbe hozná vissza.

? Az öt állapotú modellben egy várakozó folyamat megkapja az I/O-adatot. Melyik állapotba kerül?
- fut
+ kész
- befejezett
! Előbb vissza kell állnia a kész sorba; az ütemező választja ki újra.
```
