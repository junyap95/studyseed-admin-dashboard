"use client";

import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { DragAndDropSchema, ZodDragAndDropSchema } from "@/lib/questionSchema";
import { DndType } from "@/lib/questionTypes";
import { useQuestionForm } from "@/context/QuestionFormContext";

import { FormActionButtons } from "./FormActionButtons";

interface DndFormProps {
  question: DndType;
}

export const DndForm = ({ question }: DndFormProps) => {
  const { onSave, onCancel, isSaving, saveLabel } = useQuestionForm();

  const form = useForm<ZodDragAndDropSchema>({
    resolver: zodResolver(DragAndDropSchema),
    defaultValues: {
      question_number: question.question_number,
      question_text: question.question_text,
      question_style: "drag_and_drop",
      correct_answer: question.correct_answer.length ? question.correct_answer : [""],
      hint: question.hint || "",
      question_label: question.question_label,
      image: question.image,
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    // @ts-expect-error --expected as useFieldArray name field accepts array of objects only
    name: "correct_answer",
  });

  return (
    <form onSubmit={form.handleSubmit(onSave)} className="space-y-4">
      <FieldGroup>
        {/* Question Number */}
        <Field>
          <FieldLabel>Question Number *</FieldLabel>
          <Input {...form.register("question_number")} />
          {form.formState.errors.question_number && (
            <FieldError errors={[form.formState.errors.question_number]} />
          )}
        </Field>

        {/* Question Text */}
        <Field>
          <FieldLabel>Question Text *</FieldLabel>
          <Input {...form.register("question_text")} />
          {form.formState.errors.question_text && (
            <FieldError errors={[form.formState.errors.question_text]} />
          )}
        </Field>

        {/* Correct Order (Editable + Reorderable) */}
        <Field>
          <FieldLabel>Correct Order *</FieldLabel>

          <div className="space-y-2">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2">
                <span className="w-16 text-sm text-gray-500">#{index + 1}</span>

                <Input {...form.register(`correct_answer.${index}` as const)} />

                <div className="flex gap-1">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => move(index, index - 1)}
                    className="text-xs px-2 border rounded"
                  >
                    ↑
                  </button>

                  <button
                    type="button"
                    disabled={index === fields.length - 1}
                    onClick={() => move(index, index + 1)}
                    className="text-xs px-2 border rounded"
                  >
                    ↓
                  </button>

                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-xs text-red-600 px-2"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button type="button" className="mt-2 text-blue-600 text-sm" onClick={() => append("")}>
            + Add Item
          </button>

          {form.formState.errors.correct_answer && (
            <FieldError errors={[form.formState.errors.correct_answer]} />
          )}
        </Field>

        {/* Hint */}
        <Field>
          <FieldLabel>Hint *</FieldLabel>
          <Input {...form.register("hint")} />
          {form.formState.errors.hint && <FieldError errors={[form.formState.errors.hint]} />}
        </Field>
      </FieldGroup>

      {/* Question Label */}
      <Field>
        <FieldLabel>Question Label (Optional)</FieldLabel>
        <Input {...form.register("question_label")} />
      </Field>

      <FormActionButtons
        isSaving={isSaving}
        saveLabel={saveLabel}
        onCancel={onCancel}
      />
    </form>
  );
};
