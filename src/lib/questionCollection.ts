import "server-only";

import mongoose from "mongoose";

import { questionSchema } from "@/Models/QuestionModel";

export { MAX_QUESTIONS_PER_MODULE } from "@/constants/constants";

export function getQuestionCollectionName(courseCode: string, topic: string): string {
  return `${courseCode.toLowerCase()}_${topic.toLowerCase()}`;
}

export function getQuestionCollection(courseCode: string, topic: string) {
  const collectionName = getQuestionCollectionName(courseCode, topic);
  const modelName = collectionName.replace(/[^a-zA-Z0-9]/g, "_");

  return (
    mongoose.models[modelName] || mongoose.model(modelName, questionSchema, collectionName)
  );
}

export async function ensureQuestionCollection(courseCode: string, topic: string) {
  const Collection = getQuestionCollection(courseCode, topic);
  const existing = await Collection.findOne().lean();
  if (!existing) {
    await Collection.create({ modules: [] });
  }
}
