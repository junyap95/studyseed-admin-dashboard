import { Course } from "@/enums/courses.enum";
import { Topic } from "@/enums/topics.enum";
import { CourseRegistry } from "@/Models/CourseRegistry";
import { ensureQuestionCollection } from "@/lib/questionCollection";

const LEGACY_COURSES = [
  { code: Course.GES, displayName: "GES", topics: [Topic.LITERACY, Topic.NUMERACY] },
  { code: Course.GES2, displayName: "GES2", topics: [Topic.LITERACY, Topic.NUMERACY] },
  { code: Course.GLP, displayName: "GLP", topics: [Topic.LITERACY, Topic.NUMERACY] },
  { code: Course.MACKLE, displayName: "MACKLE", topics: [Topic.LITERACY] },
];

export async function ensureLegacyCoursesSeeded() {
  for (const course of LEGACY_COURSES) {
    const existing = await CourseRegistry.findOne({ code: course.code });
    if (!existing) {
      await CourseRegistry.create(course);
    }
    for (const topic of course.topics) {
      await ensureQuestionCollection(course.code, topic);
    }
  }
}
