"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { MCQSchema, ZodMCQSchema } from "@/lib/questionSchema";
import { MCQtype } from "@/lib/questionTypes";
import { useQuestionForm } from "@/context/QuestionFormContext";

import { FormActionButtons } from "./FormActionButtons";

interface MCQFormProps {
  question: MCQtype;
}

export const MCQForm = ({ question }: MCQFormProps) => {
  const { onSave, onCancel, isSaving, saveLabel } = useQuestionForm();

  const form = useForm<ZodMCQSchema>({
    resolver: zodResolver(MCQSchema),
    defaultValues: {
      question_number: question.question_number,
      question_text: question.question_text,
      question_style: "multiple_choice_question",
      possible_answers: question.possible_answers || ["", "", "", ""],
      correct_answer: question.correct_answer || "",
      hint: question.hint || "",
      question_label: question.question_label,
      image: question.image,
    },
    mode: "onChange",
  });

  const possibleAnswers = form.watch("possible_answers");
  const currentCorrect = form.watch("correct_answer");

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

                        // If this was the correct answer, update correct_answer too
                        if (prev === currentCorrect) {
                          form.setValue("correct_answer", newValue, {
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

        {/* Correct Answer */}
        <Controller
          name="correct_answer"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel className="text-sm font-medium text-green-600">
                Correct Answer *
              </FieldLabel>
              <NativeSelect
                {...field}
                className="border rounded px-2 py-1"
                aria-invalid={fieldState.invalid}
              >
                <NativeSelectOption value="">Select correct answer</NativeSelectOption>
                {possibleAnswers.map((ans: string, i: number) => (
                  <NativeSelectOption key={i} value={ans}>
                    {ans || `Option ${i + 1}`}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
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
      <FormActionButtons isSaving={isSaving} saveLabel={saveLabel} onCancel={onCancel} />
    </form>
  );
};
