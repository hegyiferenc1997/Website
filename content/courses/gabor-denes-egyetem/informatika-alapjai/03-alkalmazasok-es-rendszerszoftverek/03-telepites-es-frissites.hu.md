---
title: Telepítés, frissítés, csomagkezelők
summary: Hogyan kerül egy program a gépre, miért fontos a frissítés, és mire jó a winget és az apt.
minutes: 15
---

## Amit ebben a leckében megtanulsz

- mi történik egy program **telepítésekor**,
- miért fontosak a **frissítések**, és mit jelent a **verziószám**,
- hogyan telepítesz programot **csomagkezelővel** (winget, apt, Homebrew).

## Mi történik telepítéskor?

A telepítő (Windowson `.exe` vagy `.msi`, macOS-en `.dmg`/`.pkg`, Linuxon `.deb`/`.rpm`) általában:

1. bemásolja a program fájljait (pl. `C:\Program Files\…`),
2. telepíti a szükséges **függőségeket** (könyvtárakat, futtatókörnyezetet),
3. beállításokat ír (Windowson a **beállításjegyzékbe**, a Registrybe),
4. parancsikont és fájltársítást hoz létre.

**Csak megbízható forrásból telepíts** (a gyártó oldala, hivatalos alkalmazásbolt). A „letöltőoldalakon” sokszor kártevő van a telepítőbe csomagolva.

## Verziószám és frissítés

A legtöbb szoftver **szemantikus verziózást** használ: `FŐ.MELLÉK.JAVÍTÁS`, pl. `3.14.2`.

| Lépés             | Jelentése                              |
| ----------------- | -------------------------------------- |
| `3.14.2 → 3.14.3` | hibajavítás, semmi nem romlik el       |
| `3.14.3 → 3.15.0` | új funkció, visszafelé kompatibilis    |
| `3.15.0 → 4.0.0`  | nagy változás, régi dolgok eltörhetnek |

A frissítés nem csak új funkció: a legtöbb frissítés **biztonsági hibákat** javít. A régi, nem frissített szoftver az egyik leggyakoribb behatolási pont. Sok termék **LTS** (Long Term Support) változatot is kínál: ezt évekig javítják, ezért szervereken és cégeknél ezt szeretik.

## Csomagkezelők

A **csomagkezelő** egy paranccsal megkeresi, letölti, telepíti és frissíti a programokat a függőségeikkel együtt, egy megbízható tárolóból.

```powershell
# Windows: winget
winget search vscode
winget install Microsoft.VisualStudioCode
winget upgrade --all
```

```bash
# Ubuntu/Debian: apt
sudo apt update              # a csomaglista frissítése
sudo apt install git         # telepítés
sudo apt upgrade             # minden csomag frissítése
```

macOS-en a **Homebrew** (`brew install git`), a programnyelveknél pedig saját csomagkezelők vannak: Pythonnál `pip`, JavaScriptnél `npm`/`pnpm`.

## Eltávolítás

Programot a rendszer saját eszközével távolíts el (Windows: Gépház → Alkalmazások; `winget uninstall`; Linux: `sudo apt remove`), ne a mappa törlésével, mert a beállítások és parancsikonok ott maradnak.

## Összefoglalás

- A telepítő bemásolja a fájlokat, a függőségeket, beállításokat ír.
- Szemantikus verzió: FŐ.MELLÉK.JAVÍTÁS; a frissítés főleg biztonsági okból fontos.
- Csomagkezelő: winget (Windows), apt (Debian/Ubuntu), Homebrew (macOS), pip/npm (nyelvek).

## A lecke feladata

```quiz required
? Melyik parancs telepíti a `git`-et Ubuntun?
- winget install git
+ sudo apt install git
- pip install git
- brew get git
! Ubuntun az apt a csomagkezelő.

? Szemantikus verziózásnál melyik szám nő, ha a változás **nem visszafelé kompatibilis**?
+ a fő verziószám (az első)
- a mellék verziószám (a második)
- a javítási szám (a harmadik)
- egyik sem
! Pl. 3.15.0 → 4.0.0.

? Mit jelent az LTS rövidítés?
= Long Term Support
= hosszú távú támogatás
! Évekig kap javításokat.

? Mi a frissítések legfontosabb célja?
- új ikonok
+ biztonsági hibák javítása
- a program lassítása
- a licenc meghosszabbítása
! A nem frissített szoftver gyakori támadási pont.
```
