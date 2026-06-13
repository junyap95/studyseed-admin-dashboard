"use client";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { Textarea } from "@/components/ui/textarea";
import { ZodTrueFalseSchema, TrueFalseSchema } from "@/lib/questionSchema";
import { TrueFalseType } from "@/lib/questionTypes";
import { useQuestionForm } from "@/context/QuestionFormContext";

import { FormActionButtons } from "./FormActionButtons";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";

interface TrueFalseFormProps {
  question: TrueFalseType;
}

export function TrueFalseForm({ question }: TrueFalseFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<ZodTrueFalseSchema>({
    resolver: zodResolver(TrueFalseSchema),
    defaultValues: {
      question_number: question.question_number,
      question_text: question.question_text,
      question_style: "true_false",
      correct_answer: question.correct_answer,
      hint: question.hint || "",
      question_label: question.question_label,
      image: question.image,
    },
  });
  const { onSave, onCancel, isSaving, saveLabel } = useQuestionForm();

  const correctAnswer = watch("correct_answer");

  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-6 w-full">
      {/* Question Number */}
      <Field>
        <FieldLabel>Question Number</FieldLabel>
        <Input
          {...register("question_number")}
          placeholder="e.g., Q1"
          className={errors.question_number ? "border-red-500" : ""}
        />
        {errors.question_number && (
          <p className="text-red-500 text-sm mt-1">{errors.question_number.message}</p>
        )}
      </Field>

      {/* Question Text */}
      <Field>
        <FieldLabel>Question Text *</FieldLabel>
        <Textarea
          {...register("question_text")}
          placeholder="Enter your true/false statement..."
          rows={3}
          className={errors.question_text ? "border-red-500" : ""}
        />
        {errors.question_text && (
          <p className="text-red-500 text-sm mt-1">{errors.question_text.message}</p>
        )}
      </Field>

      {/* Correct Answer */}
      <Field>
        <FieldLabel className="block text-sm font-semibold mb-3 text-gray-700">
          Correct Answer *
        </FieldLabel>
        <div className="flex items-center gap-6">
          <FieldLabel>True</FieldLabel>
          <Input
            type="radio"
            checked={correctAnswer === true}
            onChange={() => setValue("correct_answer", true)}
            className="mr-3 w-4 h-4"
          />

          <FieldLabel>False</FieldLabel>
          <Input
            type="radio"
            checked={correctAnswer === false}
            onChange={() => setValue("correct_answer", false)}
            className="mr-3 w-4 h-4"
          />
        </div>
        {errors.correct_answer && (
          <p className="text-red-500 text-sm mt-2">{errors.correct_answer.message}</p>
        )}
      </Field>

      <Field>
        <FieldLabel>Question Label (Optional) *</FieldLabel>
        <Textarea
          {...register("question_label")}
          placeholder="Provide a helpful label..."
          rows={2}
          className={errors.hint ? "border-red-500" : ""}
        />
        {errors.hint && <p className="text-red-500 text-sm mt-1">{errors.hint.message}</p>}
      </Field>

      {/* Hint */}
      <Field>
        <FieldLabel>Hint *</FieldLabel>
        <Textarea
          {...register("hint")}
          placeholder="Provide a helpful hint..."
          rows={2}
          className={errors.hint ? "border-red-500" : ""}
        />
        {errors.hint && <p className="text-red-500 text-sm mt-1">{errors.hint.message}</p>}
      </Field>

      {/* Image URL (Optional) */}
      <Field>
        <FieldLabel>Image URL (Optional)</FieldLabel>
        <Input {...register("image")} placeholder="https://example.com/image.jpg" type="url" />
      </Field>

      <FormActionButtons
        isSaving={isSaving}
        saveLabel={saveLabel}
        onCancel={onCancel}
      />
    </form>
  );
}
