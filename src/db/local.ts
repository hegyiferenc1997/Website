import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import type { Database } from "./index";
import * as schema from "./schema";
import { seed } from "./seed";

/**
 * Beépített Postgres (PGlite) a migrációkkal (fejlesztéshez és tesztekhez).
 * dataDir nélkül memóriában fut: leállításkor minden eltűnik. A kezdő adatot alapból betölti.
 */
export async function createLocalDb(
  options: { dataDir?: string; seed?: boolean } = {},
): Promise<Database> {
  const db = drizzle(new PGlite(options.dataDir), { schema });
  await migrate(db, { migrationsFolder: path.join(process.cwd(), "drizzle") });
  // A PGlite és a node-postgres Drizzle API-ja ugyanaz, csak a típus neve más.
  const typed = db as unknown as Database;
  if (options.seed ?? true) await seed(typed);
  return typed;
}

/**
 * Lemezre mentő PGlite a fiókoknak (pnpm dev). Egy mappát egyszerre csak egy folyamat nyithat meg,
 * különben megsérülhet, ezért egy zárolófájlba írjuk, melyik folyamat használja. Ha egy másik, még
 * futó folyamaté (pl. két `pnpm dev` egyszerre), figyelmeztetünk és memóriában futunk.
 */
export async function openLocalAccountDb(dataDir: string): Promise<Database> {
  const dir = path.resolve(dataDir);
  mkdirSync(path.dirname(dir), { recursive: true });
  const lockFile = `${dir}.lock`;
  const owner = readLockOwner(lockFile);
  if (owner !== null && owner !== process.pid && isAlive(owner)) {
    console.warn(
      `[adatbázis] A ${dataDir} mappát egy másik futó folyamat (${owner}) használja; ` +
        "a fiókok most csak a memóriában lesznek.",
    );
    return createLocalDb({ seed: false });
  }
  writeFileSync(lockFile, String(process.pid));
  return createLocalDb({ dataDir: dir, seed: false });
}

function readLockOwner(lockFile: string): number | null {
  try {
    const pid = Number(readFileSync(lockFile, "utf8"));
    return Number.isInteger(pid) && pid > 0 ? pid : null;
  } catch {
    return null;
  }
}

function isAlive(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch (e) {
    return (e as NodeJS.ErrnoException).code === "EPERM";
  }
}
