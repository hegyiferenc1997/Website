// Az összes feldolgozott mintatanterv (a GDE BSc kivételével, az a gde-mernokinformatikus.ts-ben van).
// Egy egyetem+szint akkor kap tárgyakat, ha itt szerepel; a többi „hamarosan” helykitöltő marad.
import { bmeBsc } from "./bme-bsc";
import { bmeMsc } from "./bme-msc";
import { deBsc } from "./de-bsc";
import { deMsc } from "./de-msc";
import { dueBsc } from "./due-bsc";
import { meBsc } from "./me-bsc";
import { njeBsc } from "./nje-bsc";
import { nyeBsc } from "./nye-bsc";
import { oeBsc } from "./oe-bsc";
import { oeMsc } from "./oe-msc";
import { peBsc } from "./pe-bsc";
import { peMsc } from "./pe-msc";
import { ppkeBsc } from "./ppke-bsc";
import { ppkeMsc } from "./ppke-msc";
import { pteBsc } from "./pte-bsc";
import { pteMsc } from "./pte-msc";
import { szteBsc } from "./szte-bsc";
import type { Curriculum } from "./types";

export const curricula: Curriculum[] = [
  bmeBsc,
  bmeMsc,
  deBsc,
  deMsc,
  dueBsc,
  meBsc,
  njeBsc,
  nyeBsc,
  oeBsc,
  oeMsc,
  peBsc,
  peMsc,
  ppkeBsc,
  ppkeMsc,
  pteBsc,
  pteMsc,
  szteBsc,
];

/** Az egyetem+szint bejegyzés slugja: BSc-nél az alap slug, MSc-nél „-msc” végződéssel. */
export function curriculumSlug(c: Pick<Curriculum, "university" | "level">): string {
  return c.level === "bsc" ? c.university : `${c.university}-${c.level}`;
}

/** Egy egyetemoldal slugjához tartozó tanterv (a forrásokhoz és a megjegyzéshez), ha van. */
export function findCurriculum(slug: string): Curriculum | undefined {
  return curricula.find((c) => curriculumSlug(c) === slug);
}
