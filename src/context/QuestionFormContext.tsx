"use client";

import { createContext, useContext } from "react";

import { ZodQuestionSchema } from "@/lib/questionSchema";

export interface QuestionFormContextType {
  onSave: (updates: ZodQuestionSchema) => void;
  onCancel: () => void;
  isSaving: boolean;
  saveLabel?: string;
}

export const QuestionFormContext = createContext<QuestionFormContextType | undefined>(undefined);

export function useQuestionForm() {
  const context = useContext(QuestionFormContext);
  if (!context) {
    throw new Error("useQuestionForm must be used within a QuestionFormContext provider");
  }
  return context;
}
