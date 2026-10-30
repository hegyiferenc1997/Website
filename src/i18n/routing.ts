import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // Új nyelv: ide kell felvenni, és létrehozni a messages/<nyelv>.json fájlt.
  locales: ["hu"],
  defaultLocale: "hu",
  // A magyar URL-ek előtag nélküliek (/egyetemek), a többi nyelv kap előtagot (/en/...).
  localePrefix: "as-needed",
  // A kódban angol útvonalnevek vannak, a böngészőben nyelvenként fordítottak.
  pathnames: {
    "/": "/",
    "/universities": {
      hu: "/egyetemek",
    },
    "/universities/[university]": {
      hu: "/egyetemek/[university]",
    },
    "/universities/[university]/courses/[course]": {
      hu: "/egyetemek/[university]/targyak/[course]",
    },
  },
});

export type Locale = (typeof routing.locales)[number];
