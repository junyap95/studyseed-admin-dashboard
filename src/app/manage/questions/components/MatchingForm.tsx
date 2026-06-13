"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { useQuestionForm } from "@/context/QuestionFormContext";
import { buildMatchingFieldsFromPairs } from "@/lib/matchingQuestionHelpers";
import { MatchingSchema, ZodMatchingSchema } from "@/lib/questionSchema";
import { MatchingType } from "@/lib/questionTypes";

import { FormActionButtons } from "./FormActionButtons";

interface MatchingFormProps {
  question: MatchingType;
}

type PairArray = [string, string][];

function initialPairs(question: MatchingType): PairArray {
  const entries = Object.entries(question.correct_answer ?? {}).filter(
    ([key, value]) => key.trim().length > 0 || value.trim().length > 0,
  );

  if (entries.length > 0) {
    return entries as PairArray;
  }

  return [
    ["", ""],
    ["", ""],
  ];
}

export const MatchingForm = ({ question }: MatchingFormProps) => {
  const { onSave, onCancel, isSaving, saveLabel } = useQuestionForm();
  const [pairs, setPairs] = useState<PairArray>(() => initialPairs(question));

  const form = useForm<ZodMatchingSchema>({
    defaultValues: {
      question_number: question.question_number,
      question_text: question.question_text,
      question_style: "matching",
      hint: question.hint,
      options: question.options ?? [],
      answers: question.answers ?? [],
      correct_answer: question.correct_answer ?? {},
      question_label: question.question_label,
    },
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    form.clearErrors();

    const matchingFields = buildMatchingFieldsFromPairs(pairs);
    if (!matchingFields) {
      form.setError("correct_answer", { message: "At least one matching pair is required" });
      return;
    }

    const payload = {
      ...form.getValues(),
      question_style: "matching" as const,
      ...matchingFields,
    };

    const result = MatchingSchema.safeParse(payload);
    if (!result.success) {
      for (const issue of result.error.issues) {
        const field = issue.path[0];
        if (typeof field === "string") {
          form.setError(field as keyof ZodMatchingSchema, { message: issue.message });
        }
      }
      return;
    }

    onSave(result.data);
  };

  const updatePair = (idx: number, side: 0 | 1, value: string) => {
    setPairs((prev) =>
      prev.map((pair, i) =>
        i === idx
          ? ([side === 0 ? value : pair[0], side === 1 ? value : pair[1]] as [string, string])
          : pair,
      ),
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <FieldGroup>
        <Field>
          <FieldLabel>Question Text *</FieldLabel>
          <Input {...form.register("question_text")} className="text-sm" />
          {form.formState.errors.question_text && (
            <FieldError errors={[form.formState.errors.question_text]} />
          )}
        </Field>

        <Field>
          <FieldLabel>Matching Pairs *</FieldLabel>
          <p className="text-xs text-muted-foreground mb-2">
            Fill in both the option and its matching answer for each pair.
          </p>
          <div className="space-y-3 mt-2">
            {pairs.map((pair, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Input
                  value={pair[0]}
                  onChange={(e) => updatePair(idx, 0, e.target.value)}
                  placeholder={`Option ${idx + 1}`}
                  className="text-sm"
                />

                <Input
                  value={pair[1]}
                  onChange={(e) => updatePair(idx, 1, e.target.value)}
                  placeholder={`Answer ${idx + 1}`}
                  className="text-sm"
                />

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

        <Field>
          <FieldLabel>Question Label (Optional)</FieldLabel>
          <Input {...form.register("question_label")} className="text-sm" />
        </Field>

        <Field>
          <FieldLabel>Hint *</FieldLabel>
          <Input {...form.register("hint")} className="text-sm" />
          {form.formState.errors.hint && <FieldError errors={[form.formState.errors.hint]} />}
        </Field>
      </FieldGroup>

      <FormActionButtons isSaving={isSaving} saveLabel={saveLabel} onCancel={onCancel} />
    </form>
  );
};
