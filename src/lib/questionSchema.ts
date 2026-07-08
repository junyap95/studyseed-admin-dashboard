import { z } from "zod";

// Base schema shared by all question types
const BaseQuestionSchema = z.object({
  question_label: z.string().optional(),
  question_number: z.string().min(1, { message: "Question number is required" }),
  question_text: z.string().min(1, { message: "Question text is required" }),
  image: z.string().optional(),
  hint: z.string().min(1, { message: "Hint is required" }),
});

// MCQ Schema
export const MCQSchema = BaseQuestionSchema.extend({
  question_style: z.literal("multiple_choice_question"),
  possible_answers: z
    .array(z.string().min(1, { message: "Answer option cannot be empty" }))
    .min(2, { message: "At least 2 answer options required" })
    .max(6, { message: "Maximum 6 answer options allowed" }),
  correct_answer: z.string().min(1, { message: "Correct answer is required" }),
}).refine((data) => data.possible_answers.includes(data.correct_answer), {
  message: "Correct answer must be one of the possible answers",
  path: ["correct_answer"],
});

// Multiple Selection Schema (MSQ)
export const MSQSchema = BaseQuestionSchema.extend({
  question_style: z.literal("multiple_selection"),
  possible_answers: z
    .array(z.string().min(1, { message: "Answer option cannot be empty" }))
    .min(2, { message: "At least 2 answer options required" }),
  correct_answer: z
    .array(z.string().min(1))
    .min(1, { message: "At least one correct answer is required" }),
}).refine((data) => data.correct_answer.every((answer) => data.possible_answers.includes(answer)), {
  message: "All correct answers must be from possible answers",
  path: ["correct_answer"],
});

// True/False Schema
export const TrueFalseSchema = BaseQuestionSchema.extend({
  question_style: z.literal("true_false"),
  correct_answer: z.boolean({ required_error: "Please select true or false" }),
});

// Drag and Drop Schema
export const DragAndDropSchema = BaseQuestionSchema.extend({
  question_style: z.literal("drag_and_drop"),
  correct_answer: z
    .array(z.string().min(1, { message: "Answer cannot be empty" }))
    .min(1, { message: "At least one correct answer is required" }),
});

// Matching Schema
export const MatchingSchema = BaseQuestionSchema.extend({
  question_style: z.literal("matching"),
  options: z
    .array(z.string().trim().min(1, "Option cannot be empty"))
    .min(1, { message: "At least one matching pair is required" }),
  answers: z
    .array(z.string().trim().min(1, "Answer cannot be empty"))
    .min(1, { message: "At least one matching pair is required" }),
  correct_answer: z
    .record(
      z.string().trim().min(1, "Option cannot be empty"),
      z.string().trim().min(1, "Answer cannot be empty"),
    )
    .refine((val) => Object.keys(val).length > 0, {
      message: "At least one matching pair is required",
    }),
}).superRefine((data, ctx) => {
  const keys = Object.keys(data.correct_answer);

  if (keys.length !== data.options.length || keys.length !== data.answers.length) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Options, answers, and correct_answer must have the same number of pairs",
      path: ["correct_answer"],
    });
  }

  keys.forEach((key, index) => {
    if (data.options[index] !== key) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Options must match the matching pair keys",
        path: ["options"],
      });
    }
    if (data.correct_answer[key] !== data.answers[index]) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Answers must match the matching pair values",
        path: ["answers"],
      });
    }
  });
});

// Fill in the Blank Schema
export const FillBlankSchema = BaseQuestionSchema.extend({
  question_style: z.literal("fill_in_the_blank"),
  correct_answer: z
    .array(z.string().min(1, { message: "Answer cannot be empty" }))
    .min(1, { message: "At least one correct answer is required" }),
  display_info: z.string().min(1, { message: "Display info is required" }),
  num_of_text_box: z.number().int().positive({ message: "Must be a positive number" }),
  placeholders: z.array(z.string()).optional(),
  capitalisation: z.boolean(),
});

// Tap and Drop Schema
const baseTndSchema = BaseQuestionSchema.extend({
  question_style: z.literal("tnd"),
  options: z.array(z.string()).min(2),
});

export const TndIndividualSchema = baseTndSchema.extend({
  tndStyle: z.literal("INDIVIDUAL"),
  correct_answer: z.array(z.string()).min(1),
});

export const TndCategoriesSchema = baseTndSchema.extend({
  tndStyle: z.literal("CATEGORIES"),
  categories: z.array(z.string()).length(2),
  correct_answer: z.record(
    z.string(),
    z.array(z.string().min(1, { message: "Field cannot be empty" })).min(1, {
      message: "Each category must contain at least one option",
    })
  ),
});

// Dummy Schema
export const DummySchema = BaseQuestionSchema.extend({
  question_style: z.literal("dummy"),
  correct_answer: z.string().min(1, { message: "Correct answer is required" }),
});

// Union of all question schemas
export const QuestionSchema = z.union([
  MCQSchema,
  MSQSchema,
  TrueFalseSchema,
  DragAndDropSchema,
  MatchingSchema,
  FillBlankSchema,
  TndIndividualSchema,
  TndCategoriesSchema,
  DummySchema,
]);

// Type exports
export type ZodMCQSchema = z.infer<typeof MCQSchema>;
export type ZodMSQSchema = z.infer<typeof MSQSchema>;
export type ZodTrueFalseSchema = z.infer<typeof TrueFalseSchema>;
export type ZodDragAndDropSchema = z.infer<typeof DragAndDropSchema>;
export type ZodMatchingSchema = z.infer<typeof MatchingSchema>;
export type ZodFillBlankSchema = z.infer<typeof FillBlankSchema>;
export type ZodTndIndividualSchema = z.infer<typeof TndIndividualSchema>;
export type ZodTndCategoriesSchema = z.infer<typeof TndCategoriesSchema>;
export type ZodDummySchema = z.infer<typeof DummySchema>;
export type ZodQuestionSchema = z.infer<typeof QuestionSchema>;
