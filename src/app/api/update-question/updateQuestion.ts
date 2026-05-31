import { Course } from "@/enums/courses.enum";
import { Topic } from "@/enums/topics.enum";

import { UpdateQuestionPayload } from "@/lib/types";

import {
  GES2LiteracyQuestions,
  GES2NumeracyQuestions,
  GESLiteracyQuestions,
  GESNumeracyQuestions,
  GLPLiteracyQuestions,
  GLPNumeracyQuestions,
  MACKLELiteracyQuestions,
} from "@/Models/QuestionModel";

const getCollection = (course: Course, topic: Topic) => {
  if (course === Course.GES) {
    return topic === Topic.NUMERACY ? GESNumeracyQuestions : GESLiteracyQuestions;
  }
  if (course === Course.GES2) {
    return topic === Topic.NUMERACY ? GES2NumeracyQuestions : GES2LiteracyQuestions;
  }
  if (course === Course.GLP) {
    return topic === Topic.NUMERACY ? GLPNumeracyQuestions : GLPLiteracyQuestions;
  }
  if (course === Course.MACKLE) {
    if (topic === Topic.LITERACY) return MACKLELiteracyQuestions;
    throw new Error("MACKLE only supports LITERACY topic");
  }
  throw new Error("Invalid course/topic");
};

export const updateQuestion = async ({
  course,
  topic,
  module_id,
  question_number,
  updates,
}: UpdateQuestionPayload) => {
  if (!course || !topic) {
    throw new Error("course and topic are required");
  }

  const Collection = getCollection(course, topic);

  const setObject = Object.fromEntries(
    Object.entries(updates).map(([key, value]) => [`modules.$[u].questions.$[q].${key}`, value]),
  );

  const result = await Collection.updateOne(
    {},
    { $set: setObject },
    {
      arrayFilters: [{ "u.module_id": module_id }, { "q.question_number": question_number }],
    },
  );

  return result;
};
