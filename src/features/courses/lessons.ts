import { lessonKey } from "@/features/progress/data";

type WithLessons = { topics: { slug: string; lessons: { slug: string }[] }[] };

/** Egy tárgy összes leckéjének azonosítója sorrendben ("témakör/lecke"), a haladás számításához. */
export function courseLessons(course: WithLessons): string[] {
  return course.topics.flatMap((t) => t.lessons.map((l) => lessonKey(t.slug, l.slug)));
}
