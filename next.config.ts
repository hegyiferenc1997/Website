// A Next.js beállításai.

import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// A next-intl bekötése (fordítások, nyelvi útvonalak).
const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // A „use cache” gyorsítótár és az előre elkészített oldalváz bekapcsolása (gyors betöltés).
  cacheComponents: true,
  partialPrefetching: true,
  // A helyi, beépített Postgres (PGlite) WASM fájlokat tölt be, ezért nem csomagolható be.
  serverExternalPackages: ["@electric-sql/pglite"],
  // A tananyag fájljai futáskor töltődnek be (lásd src/db/content.ts), ezért kerüljenek a kimenetbe.
  outputFileTracingIncludes: { "/*": ["./content/**/*"] },
  experimental: {
    // Saját 404 oldal azokra az URL-ekre, amik egyik útvonalra sem illenek.
    globalNotFound: true,
  },
  // A Tailwind CSS feldolgozása a fejlesztői szerverben (Turbopack).
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default withNextIntl(nextConfig);
