import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
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
