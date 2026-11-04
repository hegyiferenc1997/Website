// A többi magyarországi egyetem, ahol mérnökinformatikus képzés indul: egyelőre csak helykitöltők
// (tárgyak és félévek nélkül), az Egyetemek oldalon „hamarosan” jelöléssel látszanak.
// A GDE nincs itt, mert annak teljes tanterve van (lásd gde-mernokinformatikus.ts és seed.ts).

/** Egy egyetem a listában, a képzési szintekkel, amelyeken a mérnökinformatikus szak elérhető. */
export type PlaceholderUniversity = {
  /** URL-azonosító (BSc); az MSc bejegyzés ugyanez „-msc” végződéssel. */
  slug: string;
  name: string;
  /** Angol név. */
  en: string;
  /** Rövidítés, pl. „BME”: ezen a néven ismerik a hallgatók. */
  short: string;
  city: string;
  website: string;
  levels: ("bsc" | "msc")[];
};

// Ábécérendben; a szintek az egyetemek által meghirdetett mérnökinformatikus képzések szerint.
export const placeholderUniversities: PlaceholderUniversity[] = [
  {
    slug: "budapesti-muszaki-es-gazdasagtudomanyi-egyetem",
    name: "Budapesti Műszaki és Gazdaságtudományi Egyetem",
    en: "Budapest University of Technology and Economics",
    short: "BME",
    city: "Budapest",
    website: "https://www.bme.hu",
    levels: ["bsc", "msc"],
  },
  {
    slug: "debreceni-egyetem",
    name: "Debreceni Egyetem",
    en: "University of Debrecen",
    short: "DE",
    city: "Debrecen",
    website: "https://unideb.hu",
    levels: ["bsc", "msc"],
  },
  {
    slug: "dunaujvarosi-egyetem",
    name: "Dunaújvárosi Egyetem",
    en: "University of Dunaújváros",
    short: "DUE",
    city: "Dunaújváros",
    website: "https://uniduna.hu",
    levels: ["bsc"],
  },
  {
    slug: "miskolci-egyetem",
    name: "Miskolci Egyetem",
    en: "University of Miskolc",
    short: "ME",
    city: "Miskolc",
    website: "https://www.uni-miskolc.hu",
    levels: ["bsc", "msc"],
  },
  {
    slug: "neumann-janos-egyetem",
    name: "Neumann János Egyetem",
    en: "John von Neumann University",
    short: "NJE",
    city: "Kecskemét",
    website: "https://www.nje.hu",
    levels: ["bsc"],
  },
  {
    slug: "nyiregyhazi-egyetem",
    name: "Nyíregyházi Egyetem",
    en: "University of Nyíregyháza",
    short: "NYE",
    city: "Nyíregyháza",
    website: "https://www.nye.hu",
    levels: ["bsc"],
  },
  {
    slug: "obudai-egyetem",
    name: "Óbudai Egyetem",
    en: "Óbuda University",
    short: "OE",
    city: "Budapest",
    website: "https://uni-obuda.hu",
    levels: ["bsc", "msc"],
  },
  {
    slug: "pannon-egyetem",
    name: "Pannon Egyetem",
    en: "University of Pannonia",
    short: "PE",
    city: "Veszprém",
    website: "https://uni-pannon.hu",
    levels: ["bsc", "msc"],
  },
  {
    slug: "pazmany-peter-katolikus-egyetem",
    name: "Pázmány Péter Katolikus Egyetem",
    en: "Pázmány Péter Catholic University",
    short: "PPKE",
    city: "Budapest",
    website: "https://ppke.hu",
    levels: ["bsc", "msc"],
  },
  {
    slug: "pecsi-tudomanyegyetem",
    name: "Pécsi Tudományegyetem",
    en: "University of Pécs",
    short: "PTE",
    city: "Pécs",
    website: "https://pte.hu",
    levels: ["bsc", "msc"],
  },
  {
    slug: "szegedi-tudomanyegyetem",
    name: "Szegedi Tudományegyetem",
    en: "University of Szeged",
    short: "SZTE",
    city: "Szeged",
    website: "https://u-szeged.hu",
    levels: ["bsc", "msc"],
  },
];
