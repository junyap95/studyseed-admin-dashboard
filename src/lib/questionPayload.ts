import { Question } from "@/lib/questionTypes";

export type Module = {
  module_id: string;
  questions: Question[];
};

export type QuestionsPayload = {
  modules: Module[];
};
