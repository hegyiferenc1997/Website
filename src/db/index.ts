import "server-only";
import { drizzle as drizzlePg, type NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

export type Database = NodePgDatabase<typeof schema>;

/**
 * Adatbázis kapcsolat.
 * - Ha van DATABASE_URL (éles környezet, saját Postgres): oda csatlakozik.
 * - Ha nincs (helyi fejlesztés, build, CI): beépített, memóriában futó Postgrest (PGlite)
 *   indít, lefuttatja a migrációkat és betölti a kezdő adatot. Így semmit nem kell telepíteni.
 */
export function getDb(): Promise<Database> {
  globalForDb.db ??= connect();
  return globalForDb.db;
}

const globalForDb = globalThis as unknown as { db?: Promise<Database> };

async function connect(): Promise<Database> {
  if (process.env.DATABASE_URL) {
    return drizzlePg(process.env.DATABASE_URL, { schema });
  }
  const { createLocalDb } = await import("./local");
  return createLocalDb();
}
