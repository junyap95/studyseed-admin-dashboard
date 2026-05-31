import { Course } from "@/enums/courses.enum";
import { Topic } from "@/enums/topics.enum";

import {
  GES2LiteracyQuestions,
  GES2NumeracyQuestions,
  GLPLiteracyQuestions,
  GLPNumeracyQuestions,
  QuestionsPayload,
  GESLiteracyQuestions,
  GESNumeracyQuestions,
  MACKLELiteracyQuestions,
} from "@/Models/QuestionModel";

export const getQuestionsByCourseAndTopic = async (
  course: Course,
  topic: Topic,
): Promise<QuestionsPayload | { [error: string]: string }> => {
  switch (course) {
    case Course.GES:
      switch (topic.toUpperCase()) {
        case "NUMERACY":
          return (await GESNumeracyQuestions.findOne().lean()) as unknown as QuestionsPayload;
        case "LITERACY":
          return (await GESLiteracyQuestions.findOne().lean()) as unknown as QuestionsPayload;
        default:
          return { error: `Invalid topic: ${topic}` };
      }

    case Course.GES2:
      switch (topic.toUpperCase()) {
        case "NUMERACY":
          return (await GES2NumeracyQuestions.findOne().lean()) as unknown as QuestionsPayload;
        case "LITERACY":
          return (await GES2LiteracyQuestions.findOne().lean()) as unknown as QuestionsPayload;
        default:
          return { error: `Invalid topic: ${topic}` };
      }

    case Course.GLP:
      switch (topic.toUpperCase()) {
        case "NUMERACY":
          return (await GLPNumeracyQuestions.findOne().lean()) as unknown as QuestionsPayload;
        case "LITERACY":
          return (await GLPLiteracyQuestions.findOne().lean()) as unknown as QuestionsPayload;
        default:
          return { error: `Invalid topic: ${topic}` };
      }

    case Course.MACKLE:
      switch (topic.toUpperCase()) {
        case "LITERACY":
          return (await MACKLELiteracyQuestions.findOne().lean()) as unknown as QuestionsPayload;
        default:
          return { modules: [] } as unknown as QuestionsPayload;
      }
    default:
      return { error: `Invalid course: ${course}` };
  }
};
