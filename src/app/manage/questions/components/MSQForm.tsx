"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { MSQSchema, ZodMSQSchema } from "@/lib/questionSchema";
import { MSQtype } from "@/lib/questionTypes";
import { useQuestionForm } from "@/context/QuestionFormContext";

import { FormActionButtons } from "./FormActionButtons";

interface MSQFormProps {
  question: MSQtype;
}

export const MSQForm = ({ question }: MSQFormProps) => {
  const { onSave, onCancel, isSaving, saveLabel } = useQuestionForm();

  const form = useForm<ZodMSQSchema>({
    resolver: zodResolver(MSQSchema),
    defaultValues: {
      question_number: question.question_number,
      question_text: question.question_text,
      question_style: "multiple_selection",
      possible_answers: question.possible_answers || ["", "", "", ""],
      correct_answer: question.correct_answer || [],
      hint: question.hint || "",
      question_label: question.question_label,
      image: question.image,
    },
    mode: "onChange",
  });

  const possibleAnswers = form.watch("possible_answers");
  const currentCorrectAnswers = form.watch("correct_answer");

  const handleCheckboxChange = (answer: string, checked: boolean) => {
    const current = currentCorrectAnswers || [];
    if (checked) {
      form.setValue("correct_answer", [...current, answer], {
        shouldValidate: true,
      });
    } else {
      form.setValue(
        "correct_answer",
        current.filter((a) => a !== answer),
        { shouldValidate: true },
      );
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSave)} className="space-y-4">
      <FieldGroup>
        {/* Question Number */}
        <Controller
          name="question_number"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Question Number *</FieldLabel>
              <Input {...field} placeholder="e.g., Q1" aria-invalid={fieldState.invalid} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Question Label (Optional) */}
        <Controller
          name="question_label"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Question Label (Optional)</FieldLabel>
              <Input
                {...field}
                value={field.value || ""}
                placeholder="e.g., Math - Addition"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Question Text */}
        <Controller
          name="question_text"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Question Text *</FieldLabel>
              <Input
                {...field}
                placeholder="Enter your question here..."
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Possible Answers */}
        <Controller
          name="possible_answers"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Answer Options * (minimum 2, maximum 4)</FieldLabel>
              <div className="space-y-2">
                {field.value.map((val, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Input
                      value={val}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        const prev = field.value[i];
                        const next = [...field.value];
                        next[i] = newValue;
                        field.onChange(next);

                        // If this was a correct answer, update it in correct_answer array
                        if (currentCorrectAnswers.includes(prev)) {
                          const updatedCorrect = currentCorrectAnswers.map((ans) =>
                            ans === prev ? newValue : ans,
                          );
                          form.setValue("correct_answer", updatedCorrect, {
                            shouldValidate: true,
                          });
                        }
                      }}
                      placeholder={`Option ${i + 1}`}
                      aria-invalid={fieldState.invalid}
                    />
                  </div>
                ))}
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Correct Answers */}
        <Controller
          name="correct_answer"
          control={form.control}
          render={({ fieldState }) => (
            <Field>
              <FieldLabel className="text-sm font-medium text-green-600">
                Correct Answers * (select all that apply)
              </FieldLabel>
              <div className="space-y-2">
                {possibleAnswers.map((ans: string, i: number) => (
                  <div key={i} className="flex items-center gap-2">
                    <Checkbox
                      checked={currentCorrectAnswers.includes(ans)}
                      onCheckedChange={(checked: boolean) => handleCheckboxChange(ans, checked)}
                      disabled={!ans}
                    />
                    <span className="text-sm">{ans || `Option ${i + 1}`}</span>
                  </div>
                ))}
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Hint */}
        <Controller
          name="hint"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Hint *</FieldLabel>
              <Input
                {...field}
                placeholder="Provide a helpful hint..."
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
      <FormActionButtons
        isSaving={isSaving}
        saveLabel={saveLabel}
        onCancel={onCancel}
      />
    </form>
  );
};
