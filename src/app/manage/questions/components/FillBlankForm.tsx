import React from "react";
import { useForm } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import { FillBlankSchema, ZodFillBlankSchema } from "@/lib/questionSchema";
import { FillBlankType } from "@/lib/questionTypes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useQuestionForm } from "@/context/QuestionFormContext";
import { FormActionButtons } from "./FormActionButtons";

interface FillBlankFormProps {
  question: FillBlankType;
}

export function FillBlankForm({ question }: FillBlankFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<ZodFillBlankSchema>({
    resolver: zodResolver(FillBlankSchema),
    defaultValues: {
      question_number: question.question_number,
      question_text: question.question_text,
      question_style: "fill_in_the_blank",
      correct_answer: question.correct_answer || [""],
      display_info: question.display_info || "",
      num_of_text_box: question.num_of_text_box || 1,
      placeholders: question.placeholders || [],
      capitalisation: question.capitalisation ?? false,
      hint: question.hint || "",
      question_label: question.question_label,
    },
  });
  const { onSave, onCancel, isSaving, saveLabel } = useQuestionForm();

  const answers = watch("correct_answer");
  const addAnswer = (answer: string) => {
    setValue("correct_answer", [...answers, answer]);
  };

  const removeAnswer = (index: number) => {
    setValue(
      "correct_answer",
      answers.filter((_, i) => i !== index),
    );
  };
  const capitalisation = watch("capitalisation");

  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-6 w-full">
      {/* Question Number */}
      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-700">Question Number</label>
        <Input
          {...register("question_number")}
          placeholder="e.g., Q1"
          className={errors.question_number ? "border-red-500" : ""}
        />
        {errors.question_number && (
          <p className="text-red-500 text-sm mt-1">{errors.question_number.message}</p>
        )}
      </div>

      {/* Question Text */}
      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-700">Question Text *</label>
        <Textarea
          {...register("question_text")}
          placeholder="Enter your question here..."
          rows={3}
          className={errors.question_text ? "border-red-500" : ""}
        />
        {errors.question_text && (
          <p className="text-red-500 text-sm mt-1">{errors.question_text.message}</p>
        )}
      </div>

      {/* Display Info */}
      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-700">Display Info *</label>
        <Input
          {...register("display_info")}
          placeholder="e.g., Fill in the blanks with the correct words"
          className={errors.display_info ? "border-red-500" : ""}
        />
        {errors.display_info && (
          <p className="text-red-500 text-sm mt-1">{errors.display_info.message}</p>
        )}
      </div>

      {/* Number of Text Boxes */}
      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-700">
          Number of Text Boxes *
        </label>
        <Input
          type="number"
          {...register("num_of_text_box", { valueAsNumber: true })}
          min={1}
          className={errors.num_of_text_box ? "border-red-500" : ""}
        />
        {errors.num_of_text_box && (
          <p className="text-red-500 text-sm mt-1">{errors.num_of_text_box.message}</p>
        )}
      </div>

      {/* Correct Answers */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="block text-sm font-semibold text-gray-700">Correct Answers *</label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
              addAnswer(e.currentTarget.value)
            }
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            Add Answer
          </Button>
        </div>

        <div className="space-y-3">
          {answers.map((answer, index) => (
            <div key={`answer-${index}`} className="flex items-center gap-3">
              <Input
                {...register(`correct_answer.${index}`)}
                placeholder={`Answer ${index + 1}`}
                className={errors.correct_answer?.[index] ? "border-red-500 flex-1" : "flex-1"}
              />
              {answer.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeAnswer(index)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 size={18} />
                </Button>
              )}
            </div>
          ))}
        </div>
        {errors.correct_answer && (
          <p className="text-red-500 text-sm mt-2">{errors.correct_answer.message}</p>
        )}
      </div>

      {/* Capitalisation */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={capitalisation}
          onChange={(e) => setValue("capitalisation", e.target.checked)}
          className="w-4 h-4"
        />
        <label className="text-sm font-semibold text-gray-700">Capitalisation matters</label>
      </div>

      {/* Hint */}
      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-700">Hint *</label>
        <Textarea
          {...register("hint")}
          placeholder="Provide a helpful hint..."
          rows={2}
          className={errors.hint ? "border-red-500" : ""}
        />
        {errors.hint && <p className="text-red-500 text-sm mt-1">{errors.hint.message}</p>}
      </div>

      <FormActionButtons
        isSaving={isSaving}
        saveLabel={saveLabel}
        onCancel={onCancel}
      />
    </form>
  );
}
