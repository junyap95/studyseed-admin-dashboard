"use client";

import { useState } from "react";
import { ChevronRight, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import {
  useCourseBuilder,
  useSelectedBuilderCourse,
} from "@/context/CourseBuilderContext";
import {
  CREATABLE_QUESTION_STYLES,
  createDefaultQuestion,
  suggestQuestionNumber,
} from "@/lib/questionDefaults";
import { TapAndDropStyle } from "@/lib/questionTypes";
import QuestionEditor from "@/app/manage/questions/components/QuestionEditor";
import QuestionRenderer from "@/app/manage/questions/components/QuestionRenderer";
import { CreateCourseForm } from "./CreateCourseForm";

export default function CourseBuilder() {
  const {
    courses,
    coursesLoading,
    selectedCourseCode,
    selectedTopic,
    selectedModuleId,
    questions,
    questionsLoading,
    currentModule,
    draftQuestion,
    selectCourse,
    selectTopic,
    selectModule,
    startNewQuestion,
    cancelNewQuestion,
    createModule,
    maxQuestionsPerModule,
  } = useCourseBuilder();

  const selectedCourse = useSelectedBuilderCourse();
  const [showCreateCourse, setShowCreateCourse] = useState(false);
  const [newModuleId, setNewModuleId] = useState("");
  const [selectedQuestionStyle, setSelectedQuestionStyle] = useState("");
  const [tndStyle, setTndStyle] = useState<TapAndDropStyle>(TapAndDropStyle.INDIVIDUAL);
  const [isAddingModule, setIsAddingModule] = useState(false);

  const questionCount = currentModule?.questions.length ?? 0;
  const canAddQuestion = questionCount < maxQuestionsPerModule;

  const handleStartQuestion = () => {
    if (!selectedQuestionStyle || !currentModule) return;
    const style = selectedQuestionStyle as (typeof CREATABLE_QUESTION_STYLES)[number]["value"];
    const questionNumber = suggestQuestionNumber(questionCount);
    const question = createDefaultQuestion(
      style,
      questionNumber,
      style === "tnd" ? tndStyle : undefined,
    );
    startNewQuestion(style, question);
  };

  const handleCreateModule = async () => {
    if (!newModuleId.trim()) return;
    await createModule(newModuleId.trim());
    setNewModuleId("");
    setIsAddingModule(false);
  };

  if (coursesLoading) {
    return <div className="p-6">Loading courses...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="bg-white shadow-sm border-b px-6 py-4 flex flex-wrap items-end gap-4 justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Course Builder</h2>
          <p className="text-sm text-gray-600 mt-1">
            Create courses, modules, and up to {maxQuestionsPerModule} questions per module.
          </p>
        </div>
        <Button variant="outline" onClick={() => setShowCreateCourse((v) => !v)}>
          {showCreateCourse ? "Hide" : "New Course"}
        </Button>
      </div>

      {showCreateCourse && (
        <div className="px-6 py-4">
          <CreateCourseForm onCreated={() => setShowCreateCourse(false)} />
        </div>
      )}

      <div className="px-6 py-4">
        <NativeSelect
          value={selectedCourseCode ?? ""}
          onChange={(e) => selectCourse(e.target.value || undefined)}
          className="max-w-md"
        >
          <NativeSelectOption value="">Select a course</NativeSelectOption>
          {courses.map((course) => (
            <NativeSelectOption key={course.code} value={course.code}>
              {course.displayName} ({course.code})
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </div>

      {selectedCourse && (
        <div className="flex flex-1 overflow-hidden border-t">
          <div className="w-80 bg-white border-r overflow-y-auto p-4 space-y-4">
            <h3 className="font-semibold text-gray-800">Topics</h3>
            {selectedCourse.topics.map((topic) => (
              <div key={topic} className="border rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => selectTopic(selectedTopic === topic ? undefined : topic)}
                  className={`w-full text-left px-4 py-3 font-semibold flex items-center justify-between ${
                    selectedTopic === topic
                      ? "bg-blue-600 text-white"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  {topic}
                  <ChevronRight
                    size={18}
                    className={selectedTopic === topic ? "rotate-90" : ""}
                  />
                </button>

                {selectedTopic === topic && (
                  <div className="p-2 bg-gray-50 space-y-2">
                    {questionsLoading && <p className="text-xs px-2">Loading modules...</p>}
                    {!questionsLoading &&
                      questions?.modules.map((mod) => (
                        <button
                          key={mod.module_id}
                          type="button"
                          onClick={() => selectModule(mod.module_id)}
                          className={`w-full text-left px-3 py-2 rounded text-sm flex justify-between ${
                            selectedModuleId === mod.module_id
                              ? "bg-blue-100 text-blue-800 font-medium"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          <span>{mod.module_id}</span>
                          <span className="text-xs">{mod.questions.length}/{maxQuestionsPerModule}</span>
                        </button>
                      ))}

                    {isAddingModule ? (
                      <div className="flex gap-2 p-2">
                        <Input
                          value={newModuleId}
                          onChange={(e) => setNewModuleId(e.target.value)}
                          placeholder="Module ID e.g. EL1"
                        />
                        <Button size="sm" onClick={handleCreateModule}>
                          Add
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setIsAddingModule(false)}>
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => setIsAddingModule(true)}
                      >
                        <Plus size={16} className="mr-1" /> Add Module
                      </Button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {!selectedModuleId && (
              <p className="text-gray-600">Select a module to add or view questions.</p>
            )}

            {selectedModuleId && currentModule && (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">
                    {selectedModuleId}{" "}
                    <span className="text-sm font-normal text-gray-500">
                      ({questionCount}/{maxQuestionsPerModule} questions)
                    </span>
                  </h3>
                </div>

                {currentModule.questions.map((question) => (
                  <div
                    key={question.question_number}
                    className="bg-white rounded-lg p-4 border shadow-sm"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm font-semibold text-gray-500">
                        {question.question_number}
                      </span>
                      <span className="px-2 py-0.5 text-xs bg-[#3380fc] text-white rounded-full">
                        {question.question_style}
                      </span>
                    </div>
                    <QuestionRenderer question={question} />
                  </div>
                ))}

                {draftQuestion ? (
                  <QuestionEditor question={draftQuestion} title="Create Question" />
                ) : (
                  canAddQuestion && (
                    <div className="bg-white rounded-lg border-2 border-dashed border-blue-300 p-6 space-y-4">
                      <h4 className="font-semibold">Add Question</h4>
                      <NativeSelect
                        value={selectedQuestionStyle}
                        onChange={(e) => setSelectedQuestionStyle(e.target.value)}
                      >
                        <NativeSelectOption value="">Select question type</NativeSelectOption>
                        {CREATABLE_QUESTION_STYLES.map((item) => (
                          <NativeSelectOption key={item.value} value={item.value}>
                            {item.label}
                          </NativeSelectOption>
                        ))}
                      </NativeSelect>

                      {selectedQuestionStyle === "tnd" && (
                        <NativeSelect
                          value={tndStyle}
                          onChange={(e) => setTndStyle(e.target.value as TapAndDropStyle)}
                        >
                          <NativeSelectOption value={TapAndDropStyle.INDIVIDUAL}>
                            Individual
                          </NativeSelectOption>
                          <NativeSelectOption value={TapAndDropStyle.CATEGORIES}>
                            Categories
                          </NativeSelectOption>
                        </NativeSelect>
                      )}

                      <div className="flex gap-2">
                        <Button
                          onClick={handleStartQuestion}
                          disabled={!selectedQuestionStyle}
                        >
                          Start Question Form
                        </Button>
                      </div>
                    </div>
                  )
                )}

                {!canAddQuestion && !draftQuestion && (
                  <p className="text-amber-700 text-sm">
                    This module has reached the maximum of {maxQuestionsPerModule} questions.
                  </p>
                )}

                {draftQuestion && (
                  <Button variant="ghost" onClick={cancelNewQuestion}>
                    Cancel new question
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
