"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { DashboardAPIPath } from "@/enums/apiPaths.enum";
import { QuestionFormContext } from "@/context/QuestionFormContext";
import {
  createCourseFn,
  createModuleFn,
  createQuestionFn,
} from "@/lib/networkFunctions";
import { CourseRegistryItem } from "@/lib/types";
import { QuestionsPayload, Module } from "@/lib/questionPayload";
import { Question } from "@/lib/questionTypes";
import { ZodQuestionSchema } from "@/lib/questionSchema";
import { MAX_QUESTIONS_PER_MODULE } from "@/constants/constants";
import { CreatableQuestionStyle } from "@/lib/questionDefaults";

type CourseBuilderContextType = {
  courses: CourseRegistryItem[];
  coursesLoading: boolean;
  selectedCourseCode: string | undefined;
  selectedTopic: string | undefined;
  selectedModuleId: string | undefined;
  questions: QuestionsPayload | undefined;
  questionsLoading: boolean;
  currentModule: Module | undefined;
  draftQuestion: Question | null;
  isCreatingQuestion: boolean;
  selectCourse: (code: string | undefined) => void;
  selectTopic: (topic: string | undefined) => void;
  selectModule: (moduleId: string | undefined) => void;
  setDraftQuestion: (question: Question | null) => void;
  startNewQuestion: (style: CreatableQuestionStyle, question: Question) => void;
  cancelNewQuestion: () => void;
  createCourse: (input: { code: string; displayName: string; topics: string[] }) => Promise<void>;
  createModule: (moduleId: string) => Promise<void>;
  maxQuestionsPerModule: number;
};

const CourseBuilderContext = createContext<CourseBuilderContextType | undefined>(undefined);

const fetchCourses = async (): Promise<CourseRegistryItem[]> => {
  const response = await fetch(DashboardAPIPath.COURSES, { credentials: "include" });
  if (!response.ok) throw new Error("Failed to load courses");
  const resObj = await response.json();
  return resObj.data ?? [];
};

const fetchQuestions = async (
  courseCode: string,
  topic: string,
): Promise<QuestionsPayload> => {
  const response = await fetch(
    `${DashboardAPIPath.GET_QUESTIONS}?course=${courseCode}&topic=${topic}`,
    { credentials: "include" },
  );
  if (!response.ok) throw new Error("Failed to load modules");
  const resObj = await response.json();
  return resObj.data ?? { modules: [] };
};

export function CourseBuilderProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const [selectedCourseCode, setSelectedCourseCode] = useState<string | undefined>();
  const [selectedTopic, setSelectedTopic] = useState<string | undefined>();
  const [selectedModuleId, setSelectedModuleId] = useState<string | undefined>();
  const [draftQuestion, setDraftQuestion] = useState<Question | null>(null);

  const { data: courses = [], isLoading: coursesLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: fetchCourses,
  });

  const { data: questions, isLoading: questionsLoading } = useQuery({
    queryKey: ["questions-by-course-topic", selectedTopic, selectedCourseCode],
    queryFn: () => fetchQuestions(selectedCourseCode!, selectedTopic!),
    enabled: !!selectedCourseCode && !!selectedTopic,
  });

  const createCourseMutation = useMutation({
    mutationFn: createCourseFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success("Course created");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const createModuleMutation = useMutation({
    mutationFn: createModuleFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["questions-by-course-topic", selectedTopic, selectedCourseCode],
      });
      toast.success("Module created");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const createQuestionMutation = useMutation({
    mutationFn: createQuestionFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["questions-by-course-topic", selectedTopic, selectedCourseCode],
      });
      setDraftQuestion(null);
      toast.success("Question added");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const selectCourse = useCallback((code: string | undefined) => {
    setSelectedCourseCode(code);
    setSelectedTopic(undefined);
    setSelectedModuleId(undefined);
    setDraftQuestion(null);
  }, []);

  const selectTopic = useCallback((topic: string | undefined) => {
    setSelectedTopic(topic);
    setSelectedModuleId(undefined);
    setDraftQuestion(null);
  }, []);

  const selectModule = useCallback((moduleId: string | undefined) => {
    setSelectedModuleId(moduleId);
    setDraftQuestion(null);
  }, []);

  const createCourse = useCallback(
    async (input: { code: string; displayName: string; topics: string[] }) => {
      await createCourseMutation.mutateAsync(input);
      setSelectedCourseCode(input.code.toUpperCase());
      setSelectedTopic(input.topics[0]);
    },
    [createCourseMutation],
  );

  const createModule = useCallback(
    async (moduleId: string) => {
      if (!selectedCourseCode || !selectedTopic) return;
      await createModuleMutation.mutateAsync({
        courseCode: selectedCourseCode,
        topic: selectedTopic,
        module_id: moduleId,
      });
      setSelectedModuleId(moduleId);
    },
    [createModuleMutation, selectedCourseCode, selectedTopic],
  );

  const handleCreateQuestion = useCallback(
    (question: ZodQuestionSchema) => {
      if (!selectedCourseCode || !selectedTopic || !selectedModuleId) return;
      createQuestionMutation.mutate({
        courseCode: selectedCourseCode,
        topic: selectedTopic,
        module_id: selectedModuleId,
        question,
      });
    },
    [createQuestionMutation, selectedCourseCode, selectedModuleId, selectedTopic],
  );

  const startNewQuestion = useCallback((style: CreatableQuestionStyle, question: Question) => {
    void style;
    setDraftQuestion(question);
  }, []);

  const cancelNewQuestion = useCallback(() => setDraftQuestion(null), []);

  const currentModule = useMemo(() => {
    if (!questions || !selectedModuleId) return undefined;
    return questions.modules.find((m) => m.module_id === selectedModuleId);
  }, [questions, selectedModuleId]);

  const questionFormValue = useMemo(
    () => ({
      onSave: handleCreateQuestion,
      onCancel: cancelNewQuestion,
      isSaving: createQuestionMutation.isPending,
      saveLabel: "Add Question",
    }),
    [cancelNewQuestion, createQuestionMutation.isPending, handleCreateQuestion],
  );

  const value: CourseBuilderContextType = {
    courses,
    coursesLoading,
    selectedCourseCode,
    selectedTopic,
    selectedModuleId,
    questions,
    questionsLoading,
    currentModule,
    draftQuestion,
    isCreatingQuestion: createQuestionMutation.isPending,
    selectCourse,
    selectTopic,
    selectModule,
    setDraftQuestion,
    startNewQuestion,
    cancelNewQuestion,
    createCourse,
    createModule,
    maxQuestionsPerModule: MAX_QUESTIONS_PER_MODULE,
  };

  return (
    <CourseBuilderContext.Provider value={value}>
      <QuestionFormContext.Provider value={questionFormValue}>
        {children}
      </QuestionFormContext.Provider>
    </CourseBuilderContext.Provider>
  );
}

export function useCourseBuilder() {
  const context = useContext(CourseBuilderContext);
  if (!context) {
    throw new Error("useCourseBuilder must be used within CourseBuilderProvider");
  }
  return context;
}

export function useSelectedBuilderCourse() {
  const { courses, selectedCourseCode } = useCourseBuilder();
  return courses.find((c) => c.code === selectedCourseCode);
}
