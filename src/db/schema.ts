import {
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

/**
 * Nyelvenként tárolt szöveg, pl. { hu: "Programozás alapjai", en: "Programming Basics" }.
 * A magyar kötelező, a többi nyelv később tölthető fel; hiányzó fordításnál a magyar jelenik meg.
 */
export type LocalizedText = { hu: string } & Partial<Record<string, string>>;

const localized = (name: string) => jsonb(name).$type<LocalizedText>();

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
};

export const degreeLevel = pgEnum("degree_level", ["bsc", "msc", "phd", "other"]);
export const courseRequirement = pgEnum("course_requirement", ["mandatory", "elective"]);
export const resourceType = pgEnum("resource_type", [
  "note",
  "video",
  "link",
  "exercise",
  "past_exam",
]);

export const universities = pgTable("universities", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: localized("name").notNull(),
  country: text("country").notNull(), // ISO 3166-1 kód, pl. "HU"
  city: text("city"),
  website: text("website"),
  ...timestamps,
});

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
    ...timestamps,
  },
  (t) => [uniqueIndex("courses_university_slug").on(t.universityId, t.slug)],
);

/** Melyik tárgy melyik szakon szerepel, hányadik félévben és milyen jelleggel. */
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
  },
  (t) => [primaryKey({ columns: [t.programId, t.courseId] })],
);

/** Egy tárgy témakörei sorrendben; a tananyag MDX fájlban él a content/ mappában. */
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
    contentPath: text("content_path"),
    ...timestamps,
  },
  (t) => [uniqueIndex("topics_course_slug").on(t.courseId, t.slug)],
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
}));

export const topicsRelations = relations(topics, ({ one, many }) => ({
  course: one(courses, { fields: [topics.courseId], references: [courses.id] }),
  resources: many(resources),
}));

export const resourcesRelations = relations(resources, ({ one }) => ({
  course: one(courses, { fields: [resources.courseId], references: [courses.id] }),
  topic: one(topics, { fields: [resources.topicId], references: [topics.id] }),
}));
