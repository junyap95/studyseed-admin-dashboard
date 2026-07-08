import { z } from "zod";

import { Topic } from "@/enums/topics.enum";

const courseCodeSchema = z
  .string()
  .trim()
  .min(2, "Course code must be at least 2 characters")
  .max(20, "Course code must be at most 20 characters")
  .regex(/^[A-Za-z0-9_]+$/, "Course code can only contain letters, numbers, and underscores")
  .transform((value) => value.toUpperCase());

export const createCourseSchema = z.object({
  code: courseCodeSchema,
  displayName: z.string().trim().min(1, "Display name is required"),
  topics: z
    .array(z.string().trim().min(1))
    .min(1, "Select at least one topic")
    .transform((topics) => [...new Set(topics.map((t) => t.toUpperCase()))]),
});

export const createModuleSchema = z.object({
  courseCode: courseCodeSchema,
  topic: z.string().trim().min(1).transform((t) => t.toUpperCase()),
  module_id: z
    .string()
    .trim()
    .min(1, "Module ID is required")
    .max(32, "Module ID is too long"),
});

export const createQuestionSchema = z.object({
  courseCode: courseCodeSchema,
  topic: z.string().trim().min(1).transform((t) => t.toUpperCase()),
  module_id: z.string().trim().min(1),
  question: z.record(z.unknown()), // validated per-type below
});

export const KNOWN_TOPICS = [Topic.LITERACY, Topic.NUMERACY] as const;

export type CreateCourseInput = z.infer<typeof createCourseSchema>;
export type CreateModuleInput = z.infer<typeof createModuleSchema>;
export type CreateQuestionInput = z.infer<typeof createQuestionSchema>;
