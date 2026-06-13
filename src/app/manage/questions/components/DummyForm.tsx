"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { DummySchema, ZodDummySchema } from "@/lib/questionSchema";
import { DummyType } from "@/lib/questionTypes";
import { useQuestionForm } from "@/context/QuestionFormContext";
import { FormActionButtons } from "./FormActionButtons";

interface DummyFormProps {
  question: DummyType;
}

export function DummyForm({ question }: DummyFormProps) {
  const { onSave, onCancel, isSaving, saveLabel } = useQuestionForm();

  const form = useForm<ZodDummySchema>({
    resolver: zodResolver(DummySchema),
    defaultValues: {
      question_number: question.question_number,
      question_text: question.question_text,
      question_style: "dummy",
      correct_answer: question.correct_answer || "",
      hint: question.hint || "",
      question_label: question.question_label,
      image: question.image,
    },
    mode: "onChange",
  });

  return (
    <form onSubmit={form.handleSubmit(onSave)} className="space-y-4">
      <FieldGroup>
        <Controller
          name="question_number"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Question Number *</FieldLabel>
              <Input {...field} aria-invalid={fieldState.invalid} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="question_text"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Question Text *</FieldLabel>
              <Input {...field} aria-invalid={fieldState.invalid} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="correct_answer"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Placeholder Answer *</FieldLabel>
              <Input {...field} aria-invalid={fieldState.invalid} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="hint"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Hint *</FieldLabel>
              <Input {...field} aria-invalid={fieldState.invalid} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
      <FormActionButtons isSaving={isSaving} saveLabel={saveLabel} onCancel={onCancel} />
    </form>
  );
}
