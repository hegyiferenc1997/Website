import "server-only";
import { drizzle as drizzlePg, type NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

export type Database = NodePgDatabase<typeof schema>;

/**
 * Adatbázis kapcsolat a tartalomhoz (egyetemek, tárgyak).
 * - Ha van DATABASE_URL (éles környezet, saját Postgres): oda csatlakozik.
 * - Ha nincs (helyi fejlesztés, build, CI): beépített, memóriában futó Postgrest (PGlite)
 *   indít, lefuttatja a migrációkat és betölti a kezdő adatot. Így semmit nem kell telepíteni.
 */
export function getDb(): Promise<Database> {
  globalForDb.db ??= connect();
  return globalForDb.db;
}

/**
 * Adatbázis a fiókokhoz (felhasználók, munkamenetek, haladás).
 * - DATABASE_URL esetén ugyanaz, mint a getDb().
 * - `pnpm dev` alatt a .data/pglite mappába ment, így a regisztrált fiókok újraindítás után is megmaradnak.
 *   Ez külön példány, mert a Next.js fejlesztői szervere több folyamatot is indít, egy lemezes PGlite
 *   mappát viszont egyszerre csak egy folyamat nyithat meg; a fiókokhoz csak a fő folyamat nyúl.
 * - Egyébként (build, `pnpm start` adatbázis nélkül) a memóriában futó getDb().
 */
export function getAccountDb(): Promise<Database> {
  if (process.env.DATABASE_URL || process.env.NODE_ENV !== "development") return getDb();
  globalForDb.accountDb ??= import("./local").then(({ openLocalAccountDb }) =>
    openLocalAccountDb(process.env.PGLITE_DATA_DIR ?? ".data/pglite"),
  );
  return globalForDb.accountDb;
}

const globalForDb = globalThis as unknown as {
  db?: Promise<Database>;
  accountDb?: Promise<Database>;
};

async function connect(): Promise<Database> {
  if (process.env.DATABASE_URL) {
    return drizzlePg(process.env.DATABASE_URL, { schema });
  }
  const { createLocalDb } = await import("./local");
  return createLocalDb();
}
