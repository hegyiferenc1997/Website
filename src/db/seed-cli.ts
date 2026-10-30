// Kezdő adat betöltése a DATABASE_URL-ben megadott adatbázisba: pnpm db:seed
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";
import { seed } from "./seed";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("Hiányzik a DATABASE_URL (lásd .env.example).");
  process.exit(1);
}

const db = drizzle(url, { schema });
await seed(db);
await db.$client.end();
console.log("Kezdő adat betöltve.");
