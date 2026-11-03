# Bejelentkezés és fiókok

A bejelentkezést a [Better Auth](https://www.better-auth.com) végzi. Három belépési mód van:

| Mód             | Mi kell hozzá                                | Helyben (localhost) működik? |
| --------------- | -------------------------------------------- | ---------------------------- |
| E-mail + jelszó | semmi                                        | igen, rögtön                 |
| Google          | Google Cloud „OAuth client” (ingyenes)       | igen                         |
| Apple           | Apple Developer Program tagság (99 USD / év) | nem, csak éles HTTPS címen   |

Amíg egy módhoz nincs megadva kulcs, a gombja látszik, de kattintásra kiírja, hogy még nincs beállítva.

## Hogyan működik

- **Regisztráció**: név, e-mail, jelszó. A jelszónak legalább 8 karakterből kell állnia, és kell benne egy nagybetű,
  egy szám és egy speciális karakter (a böngésző és a szerver is ellenőrzi). A jelszót csak hash-ként (scrypt) tároljuk.
- **Jelszó megjegyzése**: ha be van pipálva, 30 napig bejelentkezve maradsz; ha nincs, a böngésző bezárásáig.
- **Elfelejtett jelszó**: e-mail küldő szolgáltatás még nincs bekötve. Fejlesztés közben a visszaállító link
  a `pnpm dev` terminálablakában jelenik meg, onnan kell megnyitni. Élesben (amíg nincs e-mail küldés) nem megy ki.
- **Haladás**: vendégként a böngészőben tárolódik. Bejelentkezéskor hozzáadódik a fiókhoz, utána minden
  változás a fiókba mentődik, így más eszközön is folytatható. Kijelentkezéskor a böngészőből törlődik.
- **Biztonság**: a munkamenet-süti `httpOnly` és `SameSite=Lax` (élesben `Secure`), a POST kéréseknél
  ellenőrizzük, hogy a saját oldalunkról jöttek-e (CSRF), élesben a próbálkozások száma korlátozott.
- **Adatbázis helyben**: a `pnpm dev` a fiókokat a `.data/pglite` mappába menti, így újraindítás után is
  megmaradnak. Ha mindent törölni akarsz, állítsd le a szervert, és töröld a `.data` mappát.

## Google belépés beállítása (kb. 10 perc)

1. Nyisd meg: <https://console.cloud.google.com>, és jelentkezz be a Google-fiókoddal.
2. Fent a projektválasztóban: **New project** → név: `Engineering Maxxing` → **Create**. Utána válaszd ki ezt a projektet.
3. Bal oldali menü (vagy keresd fent): **APIs & Services → OAuth consent screen**
   (újabban **Google Auth Platform** a neve) → **Get started**.
   - App name: `Engineering Maxxing`, User support email: a saját címed → **Next**
   - Audience: **External** → **Next**
   - Contact information: a saját címed → **Next** → pipáld be a feltételeket → **Create**
4. Ugyanitt **Audience → Test users → Add users**: add hozzá a saját Gmail címed.
   (Amíg az app „Testing” állapotú, csak a tesztfelhasználók tudnak belépni. Élesítéskor: **Publish app**.)
5. **Clients → Create client**
   - Application type: **Web application**, Name: `Engineering Maxxing (helyi)`
   - **Authorized JavaScript origins → Add URI**: `http://localhost:3000`
   - **Authorized redirect URIs → Add URI**: `http://localhost:3000/api/auth/callback/google`
   - **Create**. Megjelenik a **Client ID** és a **Client secret**: másold ki mindkettőt.
6. A projekt gyökerében (ahol a `package.json` van) hozd létre a `.env.local` fájlt. VS Code-ban: jobb klikk a
   fájllistában → **New File** → `.env.local`. Tartalma:

   ```
   GOOGLE_CLIENT_ID=ide-a-client-id
   GOOGLE_CLIENT_SECRET=ide-a-client-secret
   ```

7. Állítsd le a szervert (a terminálban `Ctrl + C`), és indítsd újra: `pnpm dev`. A Google gomb már működik.

Éles címhez ugyanitt adj hozzá egy új origint és redirect URI-t az éles domainnel
(pl. `https://engineeringmaxxing.hu` és `https://engineeringmaxxing.hu/api/auth/callback/google`).

## Apple belépés beállítása (élesítéskor)

Az Apple nem enged `localhost`-ot, ezért ezt akkor érdemes megcsinálni, amikor az oldal már fent van egy saját
HTTPS domainen. Kell hozzá Apple Developer Program tagság (<https://developer.apple.com/programs/>).

1. <https://developer.apple.com/account> → **Certificates, Identifiers & Profiles → Identifiers**.
2. **+** → **App IDs** → App → leírás és Bundle ID (pl. `hu.engineeringmaxxing.app`) → pipáld be a
   **Sign In with Apple** képességet → **Register**.
3. **+** → **Services IDs** → azonosító pl. `hu.engineeringmaxxing.web` (**ez lesz az `APPLE_CLIENT_ID`**) →
   **Register** → nyisd meg → pipáld be a **Sign In with Apple**-t → **Configure**:
   - Primary App ID: a 2. lépésben létrehozott
   - Domains: `engineeringmaxxing.hu`
   - Return URLs: `https://engineeringmaxxing.hu/api/auth/callback/apple`
4. **Keys → +** → név, pipáld be a **Sign In with Apple**-t → **Configure** → válaszd az App ID-t → **Register** →
   töltsd le a `.p8` kulcsfájlt (csak egyszer lehet!). Jegyezd fel a **Key ID**-t és a fejléc jobb felső sarkában
   látható **Team ID**-t.
5. Az `APPLE_CLIENT_SECRET` egy ezekből (Team ID, Key ID, `.p8`) aláírt token, ami legfeljebb 6 hónapig érvényes.
   Ha idáig eljutsz, szólj, és készítünk hozzá egy kis szkriptet, ami legenerálja.

## Élesítéskor beállítandó környezeti változók

| Változó                                    | Mire való                                               |
| ------------------------------------------ | ------------------------------------------------------- |
| `DATABASE_URL`                             | a Postgres adatbázis (pl. Neon) címe                    |
| `BETTER_AUTH_SECRET`                       | titkos kulcs, kötelező (generálás: lásd `.env.example`) |
| `BETTER_AUTH_URL`                          | az oldal címe, pl. `https://engineeringmaxxing.hu`      |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Google belépés                                          |
| `APPLE_CLIENT_ID`, `APPLE_CLIENT_SECRET`   | Apple belépés                                           |
| `ADMIN_EMAILS`                             | admin fiókok e-mail címei (god mode), lásd lent         |

## Admin „god mode”

Az `ADMIN_EMAILS` környezeti változóban (a `.env.local` fájlban) felsorolt e-mail címek admin fiókok,
pl. `ADMIN_EMAILS=valaki@gmail.com`. Ilyen fiókkal belépve a fiók menüben megjelenik a **God mode**
kapcsoló: bekapcsolva minden lecke nyitva van (nincs sorrendi zárolás, és nem kell megvenni a félévet).

- Az állapot fiókonként mentődik (`admin_settings` tábla), és mindig a szerver ellenőrzi.
- E-mail cím alapján működik, így e-mail + jelszavas belépéssel is, és a Google-belépéssel is,
  amint a Google kulcsai be vannak állítva (ugyanazzal az e-mail címmel).
- A `.env.local` módosítása után a `pnpm dev`-et újra kell indítani.
