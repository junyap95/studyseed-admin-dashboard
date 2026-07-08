import { getQuestionCollection } from "@/lib/questionCollection";
import { QuestionsPayload } from "@/lib/questionPayload";

export const getQuestionsByCourseAndTopic = async (
  courseCode: string,
  topic: string,
): Promise<QuestionsPayload> => {
  const Collection = getQuestionCollection(courseCode, topic);
  const doc = await Collection.findOne().lean();
  return (doc ?? { modules: [] }) as QuestionsPayload;
};
