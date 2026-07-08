"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useQuestionForm } from "@/context/QuestionFormContext";
import {
  TndCategoriesSchema,
  TndIndividualSchema,
  ZodTndCategoriesSchema,
  ZodTndIndividualSchema,
} from "@/lib/questionSchema";
import { TapAndDropStyle, TndCategoriesQuestion, TndIndividualQuestion } from "@/lib/questionTypes";
import { FormActionButtons } from "./FormActionButtons";

type TndFormProps = {
  question: TndIndividualQuestion | TndCategoriesQuestion;
};

export const TndForm = ({ question }: TndFormProps) => {
  if (question.tndStyle === TapAndDropStyle.INDIVIDUAL) {
    return <TndIndividualForm question={question} />;
  }

  return <TndCategoryForm question={question} />;
};

const TndIndividualForm = ({ question }: { question: TndIndividualQuestion }) => {
  const { onSave, onCancel, isSaving, saveLabel } = useQuestionForm();

  const { watch, setValue, handleSubmit } = useForm<ZodTndIndividualSchema>({
    resolver: zodResolver(TndIndividualSchema),
    defaultValues: question,
    mode: "onChange",
  });

  const options = watch("options");
  const correct = watch("correct_answer");

  const addToCorrect = (opt: string) => {
    if (correct.includes(opt)) return;

    setValue("correct_answer", [...correct, opt], {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const moveCorrect = (from: number, to: number) => {
    if (to < 0 || to >= correct.length) return;

    const next = [...correct];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);

    setValue("correct_answer", next, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const removeCorrect = (index: number) => {
    setValue(
      "correct_answer",
      correct.filter((_, i) => i !== index),
      { shouldDirty: true, shouldValidate: true },
    );
  };

  const updateOption = (index: number, newValue: string) => {
    const prev = options[index];
    if (prev === newValue) return;

    // 1️⃣ update options
    const nextOptions = [...options];
    nextOptions[index] = newValue;

    // 2️⃣ update correct_answer references
    const nextCorrect = correct.map((v) => (v === prev ? newValue : v));

    setValue("options", nextOptions, { shouldDirty: true });
    setValue("correct_answer", nextCorrect, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-4">
      {/* Correct Order */}
      <Field>
        <FieldLabel>Correct Order</FieldLabel>

        {correct.length === 0 && (
          <p className="text-sm text-gray-500">Click options below to build the order</p>
        )}

        {correct.map((word, index) => (
          <div
            key={`${word}-${index}`}
            className="flex items-center gap-2 border rounded px-2 py-1"
          >
            <span className="w-5 text-sm">{index + 1}.</span>
            <span className="flex-1 text-sm">{word}</span>

            <div className="flex gap-1">
              <Button
                type="button"
                size="sm"
                variant="ghost"
                disabled={index === 0}
                onClick={() => moveCorrect(index, index - 1)}
              >
                ↑
              </Button>

              <Button
                type="button"
                size="sm"
                variant="ghost"
                disabled={index === correct.length - 1}
                onClick={() => moveCorrect(index, index + 1)}
              >
                ↓
              </Button>

              <Button type="button" size="sm" variant="ghost" onClick={() => removeCorrect(index)}>
                ✕
              </Button>
            </div>
          </div>
        ))}
      </Field>

      {/* Editable Options */}
      <Field>
        <FieldLabel>Available Options</FieldLabel>

        <div className="space-y-2">
          {options.map((opt, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                className="flex-1 border rounded px-2 py-1 text-sm"
                value={opt}
                onChange={(e) => updateOption(index, e.target.value)}
              />

              <Button
                type="button"
                size="sm"
                variant={correct.includes(opt) ? "secondary" : "default"}
                disabled={correct.includes(opt)}
                onClick={() => addToCorrect(opt)}
              >
                Add
              </Button>
            </div>
          ))}
        </div>
      </Field>

      <FormActionButtons
        isSaving={isSaving}
        saveLabel={saveLabel}
        onCancel={onCancel}
      />
    </form>
  );
};

const TndCategoryForm = ({ question }: { question: TndCategoriesQuestion }) => {
  const { onSave, onCancel, isSaving, saveLabel } = useQuestionForm();
  const { tndStyle } = question;

  const {
    handleSubmit,
    watch,
    setValue,
    register,
    formState: { errors },
  } = useForm<ZodTndCategoriesSchema>({
    resolver: zodResolver(TndCategoriesSchema),
    defaultValues: question,
  });

  const allCategories = watch("categories");
  const correct = watch("correct_answer");
  const allOptions = watch("options");

  const assignRadio = (opt: string, cat: string) => {
    const next = { ...correct };

    // Remove from all categories
    Object.keys(next).forEach((k) => {
      next[k] = next[k].filter((v) => v !== opt);
    });

    // Assign to the selected category
    next[cat]?.push(opt);

    setValue("correct_answer", next, { shouldDirty: true, shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(onSave)}>
      <p className="mb-3 px-3 py-1 text-xs font-medium bg-gray-100 rounded-full w-fit">
        {tndStyle} — place items in categories
      </p>

      <div className="grid grid-cols-2 gap-4">
        {allCategories.map((cat, index) => (
          <div
            className="border-1 border-studyseed-blue rounded-md"
            key={`heading-category—${index}`}
          >
            <Field className="p-1">
              <FieldLabel className="font-bold">
                <Input
                  className="border px-2 py-1 text-sm w-full"
                  value={cat}
                  onChange={(e) => {
                    const next = [...allCategories];
                    const newCat = e.target.value;

                    // Update categories
                    next[index] = newCat;
                    setValue("categories", next, { shouldDirty: true });

                    // Rename key in correct_answer
                    const nextCorrect = { ...correct };
                    nextCorrect[newCat] = nextCorrect[cat] ?? [];
                    delete nextCorrect[cat];

                    setValue("correct_answer", nextCorrect, {
                      shouldDirty: true,
                      shouldValidate: true,
                    });
                  }}
                />
              </FieldLabel>
              <hr />

              {correct[cat]?.map((item) => (
                <div className="text-sm" key={item}>
                  {item}
                </div>
              ))}
            </Field>
          </div>
        ))}

        <Field className="col-span-2">
          <FieldLabel className="font-bold">Options</FieldLabel>

          <ol className="list-decimal pl-5">
            {allOptions.map((opt, index) => (
              <li key={`option—${index}`} className="my-2">
                <div className="flex items-center justify-between gap-6">
                  <Input
                    className="border px-2 py-1 text-sm flex-1"
                    value={opt}
                    onChange={(e) => {
                      const newOpt = e.target.value;

                      // Update options array
                      const nextOptions = [...allOptions];
                      nextOptions[index] = newOpt;
                      setValue("options", nextOptions, { shouldDirty: true });

                      // Update correct_answer references
                      const nextCorrect = { ...correct };
                      Object.keys(nextCorrect).forEach((cat) => {
                        nextCorrect[cat] = nextCorrect[cat].map((v) => (v === opt ? newOpt : v));
                      });

                      setValue("correct_answer", nextCorrect, {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                    }}
                  />

                  <RadioGroup
                    value={allCategories.find((cat) => correct[cat]?.includes(opt)) || ""}
                    onValueChange={(cat) => assignRadio(opt, cat)}
                    className="flex gap-4"
                  >
                    {allCategories.map((cat, catIndex) => (
                      <div
                        key={`radio-item-category—${catIndex}`}
                        className="flex items-center gap-1"
                      >
                        <RadioGroupItem value={cat} id={`${opt}-${cat}`} />
                        <Label htmlFor={`${opt}-${cat}`}>{cat}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </li>
            ))}
          </ol>
        </Field>

        {/* Question Label */}
        <Field>
          <FieldLabel>Question Label (Optional)</FieldLabel>
          <Input {...register("question_label")} />
        </Field>

        {/* Question Hint */}
        <Field>
          <FieldLabel>Hint</FieldLabel>
          <Input {...register("hint")} className="text-sm" />
        </Field>
      </div>
      {Object.entries(errors.correct_answer || {}).map(([cat, arrErr], index) => (
        <div key={`error—${index}`}>
          {arrErr?.message && (
            <p className="text-red-500 text-sm mt-1">
              {cat}: {arrErr.message}
            </p>
          )}
        </div>
      ))}

      <FormActionButtons
        isSaving={isSaving}
        saveLabel={saveLabel}
        onCancel={onCancel}
      />
    </form>
  );
};
