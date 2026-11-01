// A Gábor Dénes Egyetem Mérnökinformatikus BSc mintatanterve: félévek, tárgyak, kreditek.
// Forrás: a GDE által közzétett mintatanterv (7 félév).

export type CurriculumCourse = {
  /** URL-ben használt azonosító; ha nincs megadva, a névből készül. */
  slug?: string;
  name: string;
  credits: number;
  /** Csak ezen a specializáción szerepel (lásd lent a specializations listát). */
  specialization?: string;
  elective?: boolean;
  /** Van-e már használható tananyag. */
  active?: boolean;
};

export const specializations = [
  {
    slug: "multimedia-es-digitalis-kepfeldolgozas",
    name: "Multimédia és digitális képfeldolgozás",
  },
  { slug: "szoftverfejlesztes", name: "Szoftverfejlesztés" },
] as const;

const MM = "multimedia-es-digitalis-kepfeldolgozas";
const SW = "szoftverfejlesztes";

/** Félévenként a tárgyak; a tömb első eleme az 1. félév. */
export const semesters: CurriculumCourse[][] = [
  // 1. félév
  [
    { name: "Informatika alapjai", credits: 8 },
    { name: "Közgazdaságtan alapjai", credits: 5 },
    { name: "Matematika", credits: 5 },
    { name: "Operációs rendszerek", credits: 4 },
    // A korábbi „Programozás alapjai” tárgy; a régi URL megmarad.
    { slug: "programozas-alapjai", name: "Programozási alapok", credits: 8, active: true },
    { name: "Személyes kompetencia és kommunikáció fejlesztése", credits: 3 },
  ],
  // 2. félév
  [
    { name: "Jogi ismeretek", credits: 3 },
    { name: "Lineáris algebra", credits: 3 },
    { name: "Objektumorientált programozás", credits: 4 },
    { name: "Problémamegoldás és algoritmusok", credits: 5 },
    { name: "Statisztikai alapok", credits: 5 },
    { name: "Valószínűségszámítás", credits: 5 },
    { name: "Villamosságtan és elektronika", credits: 5 },
  ],
  // 3. félév
  [
    { name: "Adatbázisok", credits: 6 },
    { name: "Digitális technika", credits: 4 },
    { name: "Innováció- és projektmenedzsment", credits: 5 },
    { name: "Numerikus analízis", credits: 5 },
    { name: "Mérés- és irányítástechnika", credits: 4 },
    { name: "Számítógép-architektúrák", credits: 4 },
    { name: "Vállalkozásmenedzsment", credits: 4 },
  ],
  // 4. félév
  [
    { name: "Adatbázis-szerverek", credits: 4 },
    { name: "Beágyazott rendszerek és IoT", credits: 4 },
    { name: "Hálózatok", credits: 5 },
    { name: "Informatikai biztonság", credits: 4 },
    { name: "Korszerű számítógép-rendszerek", credits: 4 },
    { name: "Számítógépes grafika", credits: 4 },
    { name: "Webprogramozás alapjai", credits: 4 },
  ],
  // 5. félév
  [
    { name: "DevOps", credits: 5 },
    { name: "Számítási felhő", credits: 4 },
    { name: "Informatikai rendszerek fejlesztése", credits: 5 },
    { name: "Mobil alkalmazások fejlesztése", credits: 4 },
    { name: "Multimédia", credits: 5, specialization: MM },
    { name: "Hang- és videotechnika", credits: 5, specialization: MM },
    { name: "Szoftvertervezés", credits: 5, specialization: SW },
    { name: "Webalkalmazás-fejlesztés", credits: 5, specialization: SW },
  ],
  // 6. félév
  [
    { name: "Mesterséges intelligencia", credits: 8 },
    { name: "Digitális képfeldolgozás", credits: 5, specialization: MM },
    { name: "Távérzékelés", credits: 5, specialization: MM },
    { name: "Térinformatikai rendszerek", credits: 5, specialization: MM },
    { name: "Multimédia projektfeladat", credits: 5, specialization: MM },
    { name: "Alkalmazásfejlesztési technológiák", credits: 5, specialization: SW },
    { name: "Mesterséges intelligencia alapú fejlesztés", credits: 5, specialization: SW },
    { name: "Szoftverfejlesztés projektfeladat", credits: 5, specialization: SW },
    { name: "Üzleti intelligencia", credits: 5, specialization: SW },
  ],
  // 7. félév
  [
    { name: "Idegen nyelv", credits: 3 },
    { name: "Szabadon választható tárgy 1.", credits: 4, elective: true },
    { name: "Szabadon választható tárgy 2.", credits: 4, elective: true },
    { name: "Szabadon választható tárgy 3.", credits: 4, elective: true },
    { name: "Szakdolgozat", credits: 15 },
    { name: "Szakmai gyakorlat", credits: 0 },
  ],
];

/** Névből URL-azonosító: ékezetek nélkül, kisbetűvel, kötőjelekkel. */
export function slugify(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
