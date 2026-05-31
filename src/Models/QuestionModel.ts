import mongoose from "mongoose";
import { Question } from "@/lib/questionTypes";

const questionSubSchema = new mongoose.Schema(
  {
    question_number: {
      type: String,
      required: true,
    },
  },
  {
    strict: false, // ← allows different question types safely
    _id: false,
  },
);

const moduleSchema = new mongoose.Schema(
  {
    module_id: {
      type: String,
      required: true,
    },
    questions: {
      type: [questionSubSchema],
      default: [],
    },
  },
  {
    _id: false,
  },
);

export const questionSchema = new mongoose.Schema(
  {
    modules: {
      type: [moduleSchema],
      default: [],
    },
  },
  { strict: true },
);

export const GLPNumeracyQuestions =
  mongoose.models.GLPNumeracy || mongoose.model("GLPNumeracy", questionSchema, "glp_numeracy");

export const GLPLiteracyQuestions =
  mongoose.models.GLPLiteracy || mongoose.model("GLPLiteracy", questionSchema, "glp_literacy");

export const GES2NumeracyQuestions =
  mongoose.models.GES2Numeracy || mongoose.model("GES2Numeracy", questionSchema, "ges2_numeracy");

export const GES2LiteracyQuestions =
  mongoose.models.GES2Literacy || mongoose.model("GES2Literacy", questionSchema, "ges2_literacy");

export const GESNumeracyQuestions =
  mongoose.models.GESNumeracy || mongoose.model("GESNumeracy", questionSchema, "ges_numeracy");

export const GESLiteracyQuestions =
  mongoose.models.GESLiteracy || mongoose.model("GESLiteracy", questionSchema, "ges_literacy");

// MACKLE Literacy Only
export const MACKLELiteracyQuestions =
  mongoose.models.MACKLELiteracy ||
  mongoose.model("MACKLELiteracy", questionSchema, "mackle_literacy");

// Used for GET requests payload
export type QuestionsPayload = {
  modules: Module[];
};

export type Module = {
  module_id: string;
  questions: Question[];
};
