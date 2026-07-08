"use client";

import {
  createContext,
  useState,
  useCallback,
  useMemo,
  useContext,
  type ReactNode,
} from "react";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { DashboardAPIPath } from "@/enums/apiPaths.enum";
import { Topic } from "@/enums/topics.enum";
import { Question } from "@/lib/questionTypes";
import { QuestionsPayload, Module } from "@/lib/questionPayload";
import { updateQuestionFn } from "@/lib/networkFunctions";
import { UpdateQuestionPayload } from "@/lib/types";
import { ZodQuestionSchema } from "@/lib/questionSchema";
import { QuestionFormContext } from "@/context/QuestionFormContext";
import { CourseRegistryItem } from "@/lib/types";

export interface QuestionsContextType {
  selectedTopic: string;
  selectedCourse: string | undefined;
  selectedModuleId: string | undefined;
  modules?: Record<string, Question[]>;
  isLoading: boolean;
  questions: QuestionsPayload | undefined;
  courses: CourseRegistryItem[];
  coursesLoading: boolean;
  selectTopic: (topic: string | undefined) => void;
  selectCourse: (course: string | undefined) => void;
  selectModule: (module: string | undefined) => void;
  currentModule: Module | undefined;
  editingQuestion: Question | null;
  setEditingQuestion: (question: Question | null) => void;
  isQuestionUpdating: boolean;
  handleUpdateQuestion: (updates: ZodQuestionSchema) => void;
}

export const QuestionsContext = createContext<QuestionsContextType | undefined>(undefined);

const getQuestions = async (
  topic: string | undefined,
  course: string | undefined,
): Promise<QuestionsPayload | undefined> => {
  if (!topic || !course) return undefined;

  const response = await fetch(
    `${DashboardAPIPath.GET_QUESTIONS}?topic=${topic}&course=${course}`,
    { credentials: "include" },
  );

  if (!response.ok) return undefined;

  const resObj = await response.json();
  return resObj.data;
};

const fetchCourses = async (): Promise<CourseRegistryItem[]> => {
  const response = await fetch(DashboardAPIPath.COURSES, { credentials: "include" });
  if (!response.ok) return [];
  const resObj = await response.json();
  return resObj.data ?? [];
};

export const QuestionsProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();

  const [selectedTopic, setSelectedTopic] = useState<string>(Topic.LITERACY);
  const [selectedCourse, setSelectedCourse] = useState<string | undefined>(undefined);
  const [selectedModuleId, setSelectedModuleId] = useState<string | undefined>(undefined);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  const { data: courses = [], isLoading: coursesLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: fetchCourses,
    staleTime: 1000 * 60 * 5,
  });

  const { data: questions, isLoading } = useQuery<QuestionsPayload | undefined>({
    queryKey: ["questions-by-course-topic", selectedTopic, selectedCourse],
    queryFn: () => getQuestions(selectedTopic, selectedCourse),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
    enabled: !!selectedCourse && !!selectedTopic,
  });

  const { isPending: isQuestionUpdating, mutateAsync } = useMutation({
    mutationFn: updateQuestionFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["questions-by-course-topic", selectedTopic, selectedCourse],
      });
      setEditingQuestion(null);
    },
  });

  const handleUpdateQuestion = useCallback(
    (updates: ZodQuestionSchema) => {
      const updatePayload: UpdateQuestionPayload = {
        course: selectedCourse,
        topic: selectedTopic,
        module_id: selectedModuleId,
        question_number: updates.question_number,
        updates,
      };
      mutateAsync(updatePayload);
    },
    [mutateAsync, selectedCourse, selectedModuleId, selectedTopic],
  );

  const selectTopic = useCallback((topic: string | undefined) => {
    setSelectedTopic(topic ?? Topic.LITERACY);
    setSelectedModuleId(undefined);
  }, []);

  const selectCourse = useCallback((course: string | undefined) => {
    setSelectedCourse(course);
    setSelectedModuleId(undefined);
  }, []);

  const selectModule = useCallback((module: string | undefined) => {
    setSelectedModuleId(module);
  }, []);

  const currentModule = useMemo(() => {
    if (!questions || !selectedModuleId) return undefined;
    return questions.modules.find((module) => module.module_id === selectedModuleId);
  }, [questions, selectedModuleId]);

  const questionFormValue = useMemo(
    () => ({
      onSave: handleUpdateQuestion,
      onCancel: () => setEditingQuestion(null),
      isSaving: isQuestionUpdating,
      saveLabel: "Save",
    }),
    [handleUpdateQuestion, isQuestionUpdating],
  );

  return (
    <QuestionsContext.Provider
      value={{
        selectedTopic,
        selectedCourse,
        selectedModuleId,
        questions,
        isLoading,
        courses,
        coursesLoading,
        selectTopic,
        selectCourse,
        selectModule,
        currentModule,
        editingQuestion,
        setEditingQuestion,
        isQuestionUpdating,
        handleUpdateQuestion,
      }}
    >
      <QuestionFormContext.Provider value={questionFormValue}>
        {children}
      </QuestionFormContext.Provider>
    </QuestionsContext.Provider>
  );
};

export const useQuestions = () => {
  const context = useContext(QuestionsContext);

  if (!context) {
    throw new Error("useQuestions must be used within a QuestionsProvider");
  }

  return context;
};

export function useSelectedCourseTopics() {
  const { courses, selectedCourse } = useQuestions();
  const course = courses.find((c) => c.code === selectedCourse);
  return course?.topics ?? [];
}
