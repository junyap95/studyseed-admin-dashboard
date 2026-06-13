import { TapAndDropStyle, Question } from "@/lib/questionTypes";

export type CreatableQuestionStyle = Exclude<Question["question_style"], never>;

export const CREATABLE_QUESTION_STYLES: { value: CreatableQuestionStyle; label: string }[] = [
  { value: "multiple_choice_question", label: "Multiple Choice" },
  { value: "multiple_selection", label: "Multiple Selection" },
  { value: "true_false", label: "True / False" },
  { value: "matching", label: "Matching" },
  { value: "fill_in_the_blank", label: "Fill in the Blank" },
  { value: "drag_and_drop", label: "Drag and Drop" },
  { value: "tnd", label: "Tap and Drop" },
  { value: "dummy", label: "Dummy" },
];

export function createDefaultQuestion(
  questionStyle: CreatableQuestionStyle,
  questionNumber: string,
  tndStyle?: TapAndDropStyle,
): Question {
  const base = {
    question_number: questionNumber,
    question_text: "",
    hint: "",
  };

  switch (questionStyle) {
    case "multiple_choice_question":
      return {
        ...base,
        question_style: "multiple_choice_question",
        possible_answers: ["", "", "", ""],
        correct_answer: "",
      };
    case "multiple_selection":
      return {
        ...base,
        question_style: "multiple_selection",
        possible_answers: ["", ""],
        correct_answer: [],
      };
    case "true_false":
      return {
        ...base,
        question_style: "true_false",
        correct_answer: true,
      };
    case "matching":
      return {
        ...base,
        question_style: "matching",
        options: ["", ""],
        answers: ["", ""],
        correct_answer: { "": "" },
      };
    case "fill_in_the_blank":
      return {
        ...base,
        question_style: "fill_in_the_blank",
        correct_answer: [""],
        display_info: "",
        num_of_text_box: 1,
        capitalisation: false,
      };
    case "drag_and_drop":
      return {
        ...base,
        question_style: "drag_and_drop",
        correct_answer: [""],
      };
    case "tnd":
      if (tndStyle === TapAndDropStyle.CATEGORIES) {
        return {
          ...base,
          question_style: "tnd",
          tndStyle: TapAndDropStyle.CATEGORIES,
          options: ["", ""],
          categories: ["Category A", "Category B"],
          correct_answer: { "Category A": [], "Category B": [] },
        };
      }
      return {
        ...base,
        question_style: "tnd",
        tndStyle: TapAndDropStyle.INDIVIDUAL,
        options: ["", ""],
        correct_answer: [],
      };
    case "dummy":
      return {
        ...base,
        question_style: "dummy",
        correct_answer: "",
      };
    default:
      return {
        ...base,
        question_style: "multiple_choice_question",
        possible_answers: ["", "", "", ""],
        correct_answer: "",
      };
  }
}

export function suggestQuestionNumber(existingCount: number): string {
  return String(existingCount + 1);
}
