# Fizetés (félévenkénti hozzáférés)

Minden egyetemen félévenként lehet hozzáférést vásárolni; ez a félév összes tárgyának leckéit megnyitja.
Vásárlás nélkül (vendégként is) a témakörök és leckék címei láthatók, de a leckék nem nyithatók meg —
a lecke szövege ilyenkor el sem jut a böngészőbe (a szerver dönti el).

## Csomagok

`src/features/payments/plans.ts` — heti (7 nap), havi (30 nap), féléves (180 nap). Az árak ideiglenesek,
itt kell átírni őket. Ha már van aktív hozzáférés, az új vásárlás annak a végétől számít (meghosszabbítás).

## Hogyan működik

1. A félév melletti **Megvásárlás** gomb megnyitja a csomagválasztót (`BuyButton.tsx`).
2. A csomag kiválasztása a `startCheckoutAction`-t hívja, ami a beállított szolgáltatótól kér egy fizetési címet
   (`provider.ts`), és oda irányít.
3. Most csak a **próba-fizetés** (`mock.ts`) létezik: a saját `/fizetes` oldalunkra visz, ahol a
   „Fizetés (próba)” gomb valódi terhelés nélkül rögzíti a vásárlást (`grantSemesterAccess`).
4. A vásárlás a `course_purchases` táblába kerül, és megjelenik a **Tananyagaim** oldalon.

## Valódi szolgáltató (pl. Stripe) bekötése később

- Új fájl `src/features/payments/stripe.ts` a `PaymentProvider` felülettel: a `createCheckout` létrehoz egy
  Stripe Checkout Session-t (ár, `success_url` = a visszatérési cím), és visszaadja a címét.
- Új webhook útvonal (pl. `src/app/api/payments/stripe/route.ts`): a sikeres fizetés értesítésére a
  `grantSemesterAccess`-t hívja, `provider: "stripe"`, `providerRef` = a session azonosítója
  (ugyanazt a fizetést kétszer nem rögzíti).
- `PAYMENT_PROVIDER=stripe` a környezeti változókban; ekkor a próba fizetési oldal kikapcsol.
