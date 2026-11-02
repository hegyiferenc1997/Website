// A Next.js beállításai.

import { readFileSync } from "node:fs";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// A böngészős Python (Pyodide) verziója: a fájljai a public/pyodide/<verzió>/ mappában vannak.
const pyodideVersion = (
  JSON.parse(readFileSync("node_modules/pyodide/package.json", "utf8")) as { version: string }
).version;

// A next-intl bekötése (fordítások, nyelvi útvonalak).
const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // A böngészőbe kerülő kód is tudja, honnan töltse a Pythont.
  env: { NEXT_PUBLIC_PYODIDE_URL: `/pyodide/${pyodideVersion}/` },
  // A Pyodide fájljai verziózott mappában vannak, így a böngésző örökre eltárolhatja őket
  // (második látogatáskor már nem kell letölteni a ~13 MB-ot).
  async headers() {
    return [
      {
        source: "/pyodide/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
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
