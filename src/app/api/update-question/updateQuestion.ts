import { getQuestionCollection } from "@/lib/questionCollection";
import { UpdateQuestionPayload } from "@/lib/types";

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

  const Collection = getQuestionCollection(course, topic);

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
