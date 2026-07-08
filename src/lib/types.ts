import { ZodQuestionSchema } from "./questionSchema";

// course module name (EL1, L12...) is key and value is an array of tuples
// tuple's first element is the score and second element is the date
export type SubjectScores = Record<string, [number, string][]>;

export type ModuleTopic = Record<string, SubjectScores>;

export type ProgressModel = Record<string, ModuleTopic>;

export type UpdateQuestionPayload = {
  course?: string;
  topic: string;
  module_id?: string;
  question_number: string;
  updates: ZodQuestionSchema;
};

export type CourseRegistryItem = {
  code: string;
  displayName: string;
  topics: string[];
  createdAt?: string;
};
