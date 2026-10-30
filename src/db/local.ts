import path from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import type { Database } from "./index";
import * as schema from "./schema";
import { seed } from "./seed";

/** Memóriában futó Postgres a migrációkkal és a kezdő adattal (fejlesztéshez és tesztekhez). */
export async function createLocalDb(): Promise<Database> {
  const db = drizzle(new PGlite(), { schema });
  await migrate(db, { migrationsFolder: path.join(process.cwd(), "drizzle") });
  // A PGlite és a node-postgres Drizzle API-ja ugyanaz, csak a típus neve más.
  const typed = db as unknown as Database;
  await seed(typed);
  return typed;
}
