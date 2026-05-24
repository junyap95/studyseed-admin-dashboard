"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { useQuestions } from "@/context/QuestionsContext";
import { MatchingSchema, ZodMatchingSchema } from "@/lib/questionSchema";
import { MatchingType } from "@/lib/questionTypes";

import { FormActionButtons } from "./FormActionButtons";

interface MatchingFormProps {
  question: MatchingType;
}

type PairArray = [string, string][];

export const MatchingForm = ({ question }: MatchingFormProps) => {
  const { setEditingQuestion, isQuestionUpdating, handleUpdateQuestion } = useQuestions();

  // Use array of pairs for stable editing - no object key deletion issues
  const [pairs, setPairs] = useState<PairArray>(() =>
    Object.entries(question.correct_answer || { "": "" }),
  );

  const form = useForm<ZodMatchingSchema>({
    resolver: zodResolver(MatchingSchema),
    defaultValues: {
      question_number: question.question_number,
      question_text: question.question_text,
      question_style: "matching",
      hint: question.hint,
      correct_answer: question.correct_answer || { "": "" },
      question_label: question.question_label,
    },
  });

  // Custom submit handler that converts pairs array back to object
  const handleSubmit = (data: ZodMatchingSchema) => {
    // Trim all pairs before submission
    const trimmedPairs = pairs.map(([key, value]) => [key.trim(), value.trim()]);

    // Filter out empty keys and convert to object
    const pairsToSubmit = trimmedPairs.filter(([key]) => key.length > 0);

    if (pairsToSubmit.length === 0) {
      form.setError("correct_answer", { message: "At least one pair is required" });
      return;
    }

    const correctAnswer = Object.fromEntries(pairsToSubmit);

    // Update form state with the finalized object
    form.setValue("correct_answer", correctAnswer, { shouldDirty: true });

    // Submit the updated form data
    handleUpdateQuestion({ ...data, correct_answer: correctAnswer });
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
      <FieldGroup>
        {/* Question Text */}
        <Field>
          <FieldLabel>Question Text *</FieldLabel>
          <Input {...form.register("question_text")} className="text-sm" />
        </Field>

        {/* Matching Pairs */}
        <Field>
          <FieldLabel>Matching Pairs *</FieldLabel>
          <div className="space-y-3 mt-2">
            {pairs.map((pair, idx) => (
              <div key={idx} className="flex items-center gap-2">
                {/* Option input */}
                <Input
                  value={pair[0]}
                  onChange={(e) => {
                    const newPairs = [...pairs];
                    newPairs[idx][0] = e.target.value;
                    setPairs(newPairs);
                  }}
                  placeholder={`Type option ${idx + 1} text here`}
                  className="text-sm"
                />

                {/* Answer input */}
                {pair[0].length >= 1 && (
                  <Input
                    value={pair[1]}
                    onChange={(e) => {
                      const newPairs = [...pairs];
                      newPairs[idx][1] = e.target.value;
                      setPairs(newPairs);
                    }}
                    placeholder={`Type answer ${idx + 1} text here`}
                    className="text-sm"
                  />
                )}

                {/* Remove button */}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-xs text-red-600"
                  onClick={() => {
                    setPairs((prev) => prev.filter((_, i) => i !== idx));
                  }}
                  disabled={pairs.length <= 1}
                >
                  ✕
                </Button>
              </div>
            ))}

            {/* Add new pair */}
            {pairs.length < 4 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setPairs((prev) => [...prev, ["", ""]]);
                }}
              >
                + Add Pair
              </Button>
            )}
          </div>

          {form.formState.errors.correct_answer && (
            <FieldError errors={[form.formState.errors.correct_answer]} />
          )}
        </Field>

        {/* Label */}
        <Field>
          <FieldLabel>Question Label (Optional)</FieldLabel>
          <Input {...form.register("question_label")} className="text-sm" />
        </Field>

        {/* Hint */}
        <Field>
          <FieldLabel>Hint</FieldLabel>
          <Input {...form.register("hint")} className="text-sm" />
        </Field>
      </FieldGroup>

      <FormActionButtons
        isUpdating={isQuestionUpdating}
        onCancel={() => setEditingQuestion(null)}
      />
    </form>
  );
};
