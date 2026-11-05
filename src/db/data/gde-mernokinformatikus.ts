// A Gábor Dénes Egyetem Mérnökinformatikus BSc mintatanterve: félévek, tárgyak, kreditek.
// Forrás: a GDE által közzétett mintatanterv (7 félév).

/** Egy tárgy a mintatantervben. */
export type CurriculumCourse = {
  /** URL-ben használt azonosító; ha nincs megadva, a névből készül. */
  slug?: string;
  name: string;
  /** Angol név. */
  en: string;
  credits: number;
  /** Csak ezen a specializáción szerepel (lásd lent a specializations listát). */
  specialization?: string;
  elective?: boolean;
  /** Van-e már használható tananyag. */
  active?: boolean;
};

/** A szak specializációi (az 5–6. félévben választható irányok). */
export const specializations = [
  {
    slug: "multimedia-es-digitalis-kepfeldolgozas",
    name: "Multimédia és digitális képfeldolgozás",
    en: "Multimedia and Digital Image Processing",
  },
  { slug: "szoftverfejlesztes", name: "Szoftverfejlesztés", en: "Software Development" },
] as const;

// Rövid nevek a specializációkhoz a lenti listában.
const MM = "multimedia-es-digitalis-kepfeldolgozas";
const SW = "szoftverfejlesztes";

/** Félévenként a tárgyak; a tömb első eleme az 1. félév. */
export const semesters: CurriculumCourse[][] = [
  // 1. félév
  [
    {
      name: "Informatika alapjai",
      en: "Fundamentals of Computer Science",
      credits: 8,
      active: true,
    },
    {
      name: "Közgazdaságtan alapjai",
      en: "Principles of Economics",
      credits: 5,
      active: true,
    },
    { name: "Matematika", en: "Mathematics", credits: 5, active: true },
    { name: "Operációs rendszerek", en: "Operating Systems", credits: 4, active: true },
    // A korábbi „Programozás alapjai” tárgy; a régi URL megmarad.
    {
      slug: "programozas-alapjai",
      name: "Programozási alapok",
      en: "Programming Fundamentals",
      credits: 8,
      active: true,
    },
    {
      name: "Személyes kompetencia és kommunikáció fejlesztése",
      en: "Personal Competence and Communication Skills",
      credits: 3,
    },
  ],
  // 2. félév
  [
    { name: "Jogi ismeretek", en: "Introduction to Law", credits: 3 },
    { name: "Lineáris algebra", en: "Linear Algebra", credits: 3 },
    { name: "Objektumorientált programozás", en: "Object-Oriented Programming", credits: 4 },
    { name: "Problémamegoldás és algoritmusok", en: "Problem Solving and Algorithms", credits: 5 },
    { name: "Statisztikai alapok", en: "Fundamentals of Statistics", credits: 5 },
    { name: "Valószínűségszámítás", en: "Probability Theory", credits: 5 },
    {
      name: "Villamosságtan és elektronika",
      en: "Electrical Engineering and Electronics",
      credits: 5,
    },
  ],
  // 3. félév
  [
    { name: "Adatbázisok", en: "Databases", credits: 6 },
    { name: "Digitális technika", en: "Digital Electronics", credits: 4, active: true },
    {
      name: "Innováció- és projektmenedzsment",
      en: "Innovation and Project Management",
      credits: 5,
      active: true,
    },
    { name: "Numerikus analízis", en: "Numerical Analysis", credits: 5 },
    { name: "Mérés- és irányítástechnika", en: "Measurement and Control Engineering", credits: 4 },
    { name: "Számítógép-architektúrák", en: "Computer Architectures", credits: 4 },
    { name: "Vállalkozásmenedzsment", en: "Business Management", credits: 4 },
  ],
  // 4. félév
  [
    { name: "Adatbázis-szerverek", en: "Database Servers", credits: 4 },
    { name: "Beágyazott rendszerek és IoT", en: "Embedded Systems and IoT", credits: 4 },
    { name: "Hálózatok", en: "Computer Networks", credits: 5 },
    { name: "Informatikai biztonság", en: "IT Security", credits: 4 },
    { name: "Korszerű számítógép-rendszerek", en: "Modern Computer Systems", credits: 4 },
    { name: "Számítógépes grafika", en: "Computer Graphics", credits: 4 },
    { name: "Webprogramozás alapjai", en: "Fundamentals of Web Programming", credits: 4 },
  ],
  // 5. félév
  [
    { name: "DevOps", en: "DevOps", credits: 5 },
    { name: "Számítási felhő", en: "Cloud Computing", credits: 4 },
    { name: "Informatikai rendszerek fejlesztése", en: "IT Systems Development", credits: 5 },
    { name: "Mobil alkalmazások fejlesztése", en: "Mobile App Development", credits: 4 },
    { name: "Multimédia", en: "Multimedia", credits: 5, specialization: MM },
    {
      name: "Hang- és videotechnika",
      en: "Audio and Video Technology",
      credits: 5,
      specialization: MM,
    },
    { name: "Szoftvertervezés", en: "Software Design", credits: 5, specialization: SW },
    {
      name: "Webalkalmazás-fejlesztés",
      en: "Web Application Development",
      credits: 5,
      specialization: SW,
    },
  ],
  // 6. félév
  [
    { name: "Mesterséges intelligencia", en: "Artificial Intelligence", credits: 8 },
    {
      name: "Digitális képfeldolgozás",
      en: "Digital Image Processing",
      credits: 5,
      specialization: MM,
    },
    { name: "Távérzékelés", en: "Remote Sensing", credits: 5, specialization: MM },
    {
      name: "Térinformatikai rendszerek",
      en: "Geographic Information Systems",
      credits: 5,
      specialization: MM,
    },
    { name: "Multimédia projektfeladat", en: "Multimedia Project", credits: 5, specialization: MM },
    {
      name: "Alkalmazásfejlesztési technológiák",
      en: "Application Development Technologies",
      credits: 5,
      specialization: SW,
    },
    {
      name: "Mesterséges intelligencia alapú fejlesztés",
      en: "AI-Driven Development",
      credits: 5,
      specialization: SW,
    },
    {
      name: "Szoftverfejlesztés projektfeladat",
      en: "Software Development Project",
      credits: 5,
      specialization: SW,
    },
    { name: "Üzleti intelligencia", en: "Business Intelligence", credits: 5, specialization: SW },
  ],
  // 7. félév
  [
    { name: "Idegen nyelv", en: "Foreign Language", credits: 3 },
    { name: "Szabadon választható tárgy 1.", en: "Free Elective 1", credits: 4, elective: true },
    { name: "Szabadon választható tárgy 2.", en: "Free Elective 2", credits: 4, elective: true },
    { name: "Szabadon választható tárgy 3.", en: "Free Elective 3", credits: 4, elective: true },
    { name: "Szakdolgozat", en: "Thesis", credits: 15 },
    { name: "Szakmai gyakorlat", en: "Professional Internship", credits: 0 },
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
