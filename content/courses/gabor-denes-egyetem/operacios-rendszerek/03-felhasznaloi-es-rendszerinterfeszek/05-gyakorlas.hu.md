---
title: Gyakorlás – interfészek
summary: Ellenőrző kérdések, parancssori mini-feladatok és összefoglaló feladatlap.
minutes: 50
kind: practice
---

## Parancssori mini-feladatok (Ubuntu VM)

1. Hozz létre a saját mappádban egy `os-gyak` mappát, benne három fájlt (`a.txt`, `b.txt`, `c.txt`) egy paranccsal: `touch a.txt b.txt c.txt`.
2. Írd bele az `a.txt`-be a mai dátumot: `date > a.txt`, majd fűzd hozzá a gépnevet: `hostname >> a.txt`.
3. Számold meg, hány sor van benne: `wc -l a.txt` (2 kell legyen).
4. Listázd ki az `/etc` mappa `.conf` végű fájljait, és számold meg őket egy csővel: `ls /etc/*.conf | wc -l`.
5. Írd át a leckében látott szkriptet úgy, hogy a szabad memóriát is kiírja (`free -h`).

## Ellenőrző kérdések

<details>
<summary>1. Miért elterjedt a parancssor a szervereken?</summary>

Mert kevés erőforrást igényel, távolról (SSH-n) is jól használható, és a feladatok szkriptekkel automatizálhatók. Sok szerveren nincs is grafikus felület.

</details>

<details>
<summary>2. Mi a különbség a Bash és a PowerShell csöve között?</summary>

Bashben a cső szöveget (bájtfolyamot) ad tovább, amelyet a következő program értelmez. PowerShellben objektumok mennek át a csövön, tulajdonságokkal (pl. Name, CPU), így szűrni, rendezni közvetlenül lehet.

</details>

<details>
<summary>3. Miért biztonságosabb a Wayland az X11-nél?</summary>

X11 alatt bármely grafikus program olvashatja a többi program billentyűleütéseit és képernyőtartalmát. Waylandnél a kompozitor elszigeteli az ablakokat, egy program csak a saját bemenetét kapja.

</details>

<details>
<summary>4. Mi a különbség a `systemctl start` és a `systemctl enable` között?</summary>

A `start` most azonnal elindítja a szolgáltatást (újraindításig). Az `enable` beállítja, hogy minden rendszerindításkor elinduljon, de most nem indítja el (erre `enable --now` való).

</details>

## Összefoglaló feladatlap

```quiz required
? Melyik program értelmezi a terminálba begépelt parancsokat?
+ a shell
- a kernel
- a kompozitor
- a rendszerbetöltő
! Linuxon általában Bash, Windowson PowerShell.

? Hány sort ír ki a `wc -l` arra a fájlra, amelybe előbb `date >`, majd `hostname >>` írt?
= 2
! A > létrehozza az első sort, a >> hozzáfűzi a másodikat.

? Melyik paranccsal törölsz egy fájlt Linuxon?
= rm
! Vigyázz: nincs kuka, a törlés végleges.

? Melyik paranccsal látod egy systemd-szolgáltatás naplóját?
+ journalctl -u szolgáltatásnév
- systemctl enable szolgáltatásnév
- cat /dev/null
- service --log
! journalctl -u ssh --since today

? Melyik PowerShell cmdlet listázza a szolgáltatásokat?
= Get-Service
! Get-Service -Name Spooler

? Melyik asztali környezet a legkönnyebb (kevés erőforrás) a lecke példái közül?
- GNOME
- KDE Plasma
+ Xfce
- Aqua
! A Xubuntu ezt használja, régebbi gépekre is jó.
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **Saját `wc`.** Írd meg a `wc(szoveg)` függvényt, amely egy hármast ad vissza: a **sorok** száma (a `\n` karakterek száma, mint a valódi `wc -l`-nél), a **szavak** száma (szóközökkel és sorvégekkel elválasztva), és a **karakterek** száma.

```python starter
def wc(szoveg):
    return (0, 0, 0)
```

<details>
<summary>Megoldás</summary>

```python solution
def wc(szoveg):
    sorok = szoveg.count("\n")        # a wc -l a sorvégeket számolja
    szavak = len(szoveg.split())      # split() argumentum nélkül: bármilyen szóköz mentén
    return (sorok, szavak, len(szoveg))
```

</details>

```python test
assert wc("szia kernel\nhello shell\n") == (2, 4, 24)
assert wc("") == (0, 0, 0)
assert wc("egy  két   három") == (0, 3, 16)
print("Minden ellenőrzés sikeres!")
```

**2.** **Saját `grep -c`.** Írd meg a `grep_c(sorok, minta, kisnagy=False)` függvényt: hány sor tartalmazza a mintát? Ha `kisnagy` igaz (mint a `grep -i`), ne számítson a kis- és nagybetű.

```python starter
def grep_c(sorok, minta, kisnagy=False):
    return 0
```

<details>
<summary>Megoldás</summary>

```python solution
def grep_c(sorok, minta, kisnagy=False):
    if kisnagy:
        minta = minta.lower()
        sorok = [s.lower() for s in sorok]
    return sum(1 for s in sorok if minta in s)
```

</details>

```python test
naplo = ["ERROR lemez", "info indulás", "error hálózat", "Warning", "ERROR memória"]
assert grep_c(naplo, "ERROR") == 2
assert grep_c(naplo, "error", kisnagy=True) == 3
assert grep_c(naplo, "nincs") == 0
print("Minden ellenőrzés sikeres!")
```

**3.** **Hol keresi a shell a parancsot?** A shell a `PATH` változó könyvtáraiban **sorban** keresi a programot, és az **első** találatot futtatja. Írd meg a `which(parancs, path, letezo)` függvényt: a `path` kettősponttal elválasztott könyvtárlista, a `letezo` a létező fájlok teljes útvonalainak halmaza. Add vissza az első találat útvonalát, vagy `None`-t!

```python starter
def which(parancs, path, letezo):
    return None
```

<details>
<summary>Megoldás</summary>

```python solution
def which(parancs, path, letezo):
    for konyvtar in path.split(":"):          # sorrendben, az első nyer
        jelolt = konyvtar.rstrip("/") + "/" + parancs
        if jelolt in letezo:
            return jelolt
    return None
```

</details>

```python test
fajlok = {"/usr/bin/python3", "/usr/local/bin/python3", "/bin/ls"}
assert which("python3", "/usr/local/bin:/usr/bin:/bin", fajlok) == "/usr/local/bin/python3"
assert which("python3", "/usr/bin:/usr/local/bin", fajlok) == "/usr/bin/python3"
assert which("ls", "/usr/bin:/bin", fajlok) == "/bin/ls"
assert which("nincs", "/usr/bin:/bin", fajlok) is None
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Mit ír ki az echo $? parancs, ha az előző parancs sikeresen lefutott?
= 0
! A 0 kilépési kód a sikert jelenti, minden más a hibát.

? Mit csinál a parancs1 && parancs2?
+ a parancs2 csak akkor fut, ha a parancs1 sikeres volt
- a parancs2 mindenképp lefut
- a két parancs párhuzamosan fut
! A || pont fordítva: csak hiba esetén futtatja a másodikat.

? Melyik fájlokra illeszkedik a *.txt minta?
+ minden .txt végű fájlra az aktuális könyvtárban (a ponttal kezdődő rejtettek kivételével)
- csak a txt nevű fájlra
- minden fájlra az alkönyvtárakban is
! A mintát a shell bontja ki, nem a program.

? Mi a különbség a > és a >> átirányítás között?
- nincs különbség
+ a > felülírja a fájlt, a >> a végéhez fűz
- a >> a hibakimenetet irányítja át
! A hibakimenet a 2>.

? Hogyan éred el, hogy egy grafikus felület nélküli szerveren is dolgozhass?
+ parancssori felülettel, például SSH-n keresztül
- csak monitor csatlakoztatásával
- sehogy
! A szerverek többsége grafikus felület nélkül fut.
```
