import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // Új nyelv: ide kell felvenni, és létrehozni a messages/<nyelv>.json fájlt.
  locales: ["hu", "en"],
  defaultLocale: "hu",
  // A magyar URL-ek előtag nélküliek (/egyetemek), a többi nyelv kap előtagot (/en/...).
  localePrefix: "as-needed",
  // Mindig a cím dönti el a nyelvet (nincs átirányítás a böngésző nyelve alapján):
  // így a magyar a kiinduló nyelv, és az oldalak előre elkészítve, azonnal töltődnek.
  localeDetection: false,
  // A kódban angol útvonalnevek vannak, a böngészőben nyelvenként fordítottak.
  pathnames: {
    "/": "/",
    "/universities": {
      hu: "/egyetemek",
      en: "/universities",
    },
    "/universities/[university]": {
      hu: "/egyetemek/[university]",
      en: "/universities/[university]",
    },
    "/courses": {
      hu: "/targyak",
      en: "/courses",
    },
    "/reset-password": {
      hu: "/jelszo-visszaallitas",
      en: "/reset-password",
    },
    "/universities/[university]/courses/[course]": {
      hu: "/egyetemek/[university]/targyak/[course]",
      en: "/universities/[university]/courses/[course]",
    },
  },
});

export type Locale = (typeof routing.locales)[number];
