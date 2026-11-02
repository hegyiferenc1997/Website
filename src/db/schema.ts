import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Az adatbázis szerkezete: táblák, mezők és kapcsolataik (Drizzle ORM).
// Módosítás után a `pnpm db:generate` készít hozzá új migrációt a drizzle/ mappába.

/**
 * Nyelvenként tárolt szöveg, pl. { hu: "Programozás alapjai", en: "Programming Basics" }.
 * A magyar kötelező, a többi nyelv később tölthető fel; hiányzó fordításnál a magyar jelenik meg.
 */
export type LocalizedText = { hu: string } & Partial<Record<string, string>>;

// Nyelvenkénti szöveg mező (JSON-ként tárolva).
const localized = (name: string) => jsonb(name).$type<LocalizedText>();

// Létrehozás és utolsó módosítás ideje; szinte minden táblában szerepel.
const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
};

// Választható értékek listái: képzési szint, kötelező / választható tárgy, forrás típusa.
export const degreeLevel = pgEnum("degree_level", ["bsc", "msc", "phd", "other"]);
export const courseRequirement = pgEnum("course_requirement", ["mandatory", "elective"]);
export const resourceType = pgEnum("resource_type", [
  "note",
  "video",
  "link",
  "exercise",
  "past_exam",
]);

/** Egyetemek. A slug az URL-ben szereplő azonosító (pl. gabor-denes-egyetem). */
export const universities = pgTable("universities", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: localized("name").notNull(),
  country: text("country").notNull(), // ISO 3166-1 kód, pl. "HU"
  city: text("city"),
  website: text("website"),
  ...timestamps,
});

/** Karok egy egyetemen belül. */
export const faculties = pgTable(
  "faculties",
  {
    id: serial("id").primaryKey(),
    universityId: integer("university_id")
      .notNull()
      .references(() => universities.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    name: localized("name").notNull(),
    ...timestamps,
  },
  (t) => [uniqueIndex("faculties_university_slug").on(t.universityId, t.slug)],
);

/** Szak, pl. Mérnökinformatikus BSc. A kar opcionális, mert nem minden egyetem tagolódik karokra. */
export const programs = pgTable(
  "programs",
  {
    id: serial("id").primaryKey(),
    universityId: integer("university_id")
      .notNull()
      .references(() => universities.id, { onDelete: "cascade" }),
    facultyId: integer("faculty_id").references(() => faculties.id, { onDelete: "set null" }),
    slug: text("slug").notNull(),
    name: localized("name").notNull(),
    level: degreeLevel("level").notNull(),
    ...timestamps,
  },
  (t) => [uniqueIndex("programs_university_slug").on(t.universityId, t.slug)],
);

/** Tárgyak egy egyetemen. */
export const courses = pgTable(
  "courses",
  {
    id: serial("id").primaryKey(),
    universityId: integer("university_id")
      .notNull()
      .references(() => universities.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    name: localized("name").notNull(),
    description: localized("description"),
    code: text("code"), // az egyetem saját tárgykódja
    credits: integer("credits"),
    language: text("language"), // oktatási nyelv kódja, pl. "hu"
    /** Van-e már használható tananyag; a többi tárgy egyelőre csak helykitöltő („hamarosan”). */
    isActive: boolean("is_active").notNull().default(false),
    ...timestamps,
  },
  (t) => [uniqueIndex("courses_university_slug").on(t.universityId, t.slug)],
);

/** Specializáció egy szakon belül, pl. „Szoftverfejlesztés”. */
export const specializations = pgTable(
  "specializations",
  {
    id: serial("id").primaryKey(),
    programId: integer("program_id")
      .notNull()
      .references(() => programs.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    name: localized("name").notNull(),
    position: integer("position").notNull().default(0),
    ...timestamps,
  },
  (t) => [uniqueIndex("specializations_program_slug").on(t.programId, t.slug)],
);

/**
 * Melyik tárgy melyik szakon szerepel, hányadik félévben és milyen jelleggel.
 * Ha a specializáció ki van töltve, a tárgy csak azon a specializáción kötelező.
 */
export const programCourses = pgTable(
  "program_courses",
  {
    programId: integer("program_id")
      .notNull()
      .references(() => programs.id, { onDelete: "cascade" }),
    courseId: integer("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    recommendedSemester: integer("recommended_semester"),
    requirement: courseRequirement("requirement"),
    specializationId: integer("specialization_id").references(() => specializations.id, {
      onDelete: "set null",
    }),
  },
  (t) => [primaryKey({ columns: [t.programId, t.courseId] })],
);

/**
 * Egy tárgy témakörei sorrendben (pl. „Vezérlési szerkezetek”). Egy témakör leckékből áll.
 * A tananyag forrása a content/courses/<egyetem>/<tárgy>/ mappa; a seed tölti be az adatbázisba.
 */
export const topics = pgTable(
  "topics",
  {
    id: serial("id").primaryKey(),
    courseId: integer("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    position: integer("position").notNull(),
    title: localized("title").notNull(),
    description: localized("description"),
    ...timestamps,
  },
  (t) => [uniqueIndex("topics_course_slug").on(t.courseId, t.slug)],
);

/**
 * A lecke fajtája. Egyelőre csak „lesson” (olvasnivaló) van; a gyakorló feladatok és kvízek
 * ugyanebbe a sorrendbe kerülnek majd, saját megjelenítéssel.
 */
export const lessonKind = pgEnum("lesson_kind", ["lesson", "practice", "quiz"]);

/** Egy témakör leckéi sorrendben. A törzs nyelvenként Markdown (kódrészletekkel). */
export const lessons = pgTable(
  "lessons",
  {
    id: serial("id").primaryKey(),
    topicId: integer("topic_id")
      .notNull()
      .references(() => topics.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    position: integer("position").notNull(),
    kind: lessonKind("kind").notNull().default("lesson"),
    title: localized("title").notNull(),
    summary: localized("summary"),
    body: localized("body").notNull(),
    /** Becsült feldolgozási idő percben. */
    minutes: integer("minutes"),
    ...timestamps,
  },
  (t) => [uniqueIndex("lessons_topic_slug").on(t.topicId, t.slug)],
);

/** Forrás egy tárgyhoz, opcionálisan egy témakörhöz kötve. */
export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id")
    .notNull()
    .references(() => courses.id, { onDelete: "cascade" }),
  topicId: integer("topic_id").references(() => topics.id, { onDelete: "set null" }),
  type: resourceType("type").notNull(),
  title: localized("title").notNull(),
  url: text("url"),
  ...timestamps,
});

// Kapcsolatok a táblák között: ezek alapján tölti be a Drizzle a lekérdezések „with: {...}” részeit.
export const universitiesRelations = relations(universities, ({ many }) => ({
  faculties: many(faculties),
  programs: many(programs),
  courses: many(courses),
}));

export const facultiesRelations = relations(faculties, ({ one, many }) => ({
  university: one(universities, {
    fields: [faculties.universityId],
    references: [universities.id],
  }),
  programs: many(programs),
}));

export const programsRelations = relations(programs, ({ one, many }) => ({
  university: one(universities, {
    fields: [programs.universityId],
    references: [universities.id],
  }),
  faculty: one(faculties, { fields: [programs.facultyId], references: [faculties.id] }),
  programCourses: many(programCourses),
  specializations: many(specializations),
}));

export const specializationsRelations = relations(specializations, ({ one, many }) => ({
  program: one(programs, { fields: [specializations.programId], references: [programs.id] }),
  programCourses: many(programCourses),
}));

export const coursesRelations = relations(courses, ({ one, many }) => ({
  university: one(universities, {
    fields: [courses.universityId],
    references: [universities.id],
  }),
  programCourses: many(programCourses),
  topics: many(topics),
  resources: many(resources),
}));

export const programCoursesRelations = relations(programCourses, ({ one }) => ({
  program: one(programs, { fields: [programCourses.programId], references: [programs.id] }),
  course: one(courses, { fields: [programCourses.courseId], references: [courses.id] }),
  specialization: one(specializations, {
    fields: [programCourses.specializationId],
    references: [specializations.id],
  }),
}));

export const topicsRelations = relations(topics, ({ one, many }) => ({
  course: one(courses, { fields: [topics.courseId], references: [courses.id] }),
  lessons: many(lessons),
  resources: many(resources),
}));

export const lessonsRelations = relations(lessons, ({ one }) => ({
  topic: one(topics, { fields: [lessons.topicId], references: [topics.id] }),
}));

export const resourcesRelations = relations(resources, ({ one }) => ({
  course: one(courses, { fields: [resources.courseId], references: [courses.id] }),
  topic: one(topics, { fields: [resources.topicId], references: [topics.id] }),
}));

// ---------------------------------------------------------------------------
// Fiókok és bejelentkezés (Better Auth). A mezők nevét a Better Auth várja, ne nevezd át őket.
// ---------------------------------------------------------------------------

/** Felhasználók: név és e-mail (a jelszó az accounts táblában van, hash-ként). */
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  ...timestamps,
});

/** Bejelentkezett munkamenetek; a böngésző sütijében csak a véletlenszerű token van. */
export const sessions = pgTable(
  "sessions",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    token: text("token").notNull().unique(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    ...timestamps,
  },
  (t) => [index("sessions_user_id").on(t.userId)],
);

/**
 * Belépési módok egy felhasználóhoz: „credential” (e-mail + jelszó, a jelszó csak hash-ként),
 * vagy egy külső fiók (Google, Apple). Egy felhasználónak több is lehet.
 */
export const accounts = pgTable(
  "accounts",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true }),
    scope: text("scope"),
    password: text("password"),
    ...timestamps,
  },
  (t) => [index("accounts_user_id").on(t.userId)],
);

/** Egyszer használható, lejáró kódok (pl. jelszó-visszaállítás). */
export const verifications = pgTable(
  "verifications",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    ...timestamps,
  },
  (t) => [index("verifications_identifier").on(t.identifier)],
);

/** A felhasználó haladása (lenyitott félévek, utolsó tárgy, elvégzett leckék) egy JSON-ban. */
export const userProgress = pgTable("user_progress", {
  userId: text("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  data: jsonb("data").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// A fióktáblák kapcsolatai.
export const usersRelations = relations(users, ({ many, one }) => ({
  sessions: many(sessions),
  accounts: many(accounts),
  progress: one(userProgress),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  user: one(users, { fields: [userProgress.userId], references: [users.id] }),
}));
