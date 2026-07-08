import React from "react";
import { Edit2, ChevronRight } from "lucide-react";

import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { useQuestions, useSelectedCourseTopics } from "@/context/QuestionsContext";
import QuestionRenderer from "./QuestionRenderer";
import QuestionEditor from "./QuestionEditor";

export default function QuestionManager() {
  const {
    selectedModuleId,
    selectedTopic,
    selectedCourse,
    selectTopic,
    selectModule,
    selectCourse,
    isLoading,
    questions,
    courses,
    coursesLoading,
    currentModule,
    editingQuestion,
    setEditingQuestion,
  } = useQuestions();

  const courseTopics = useSelectedCourseTopics();

  if (coursesLoading) return <div>Loading courses...</div>;
  if (isLoading) return <div>Loading</div>;

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <div className="bg-white shadow-sm border-b px-6 py-4">
        <h2 className="text-2xl font-bold text-gray-800">Select a course</h2>

        <NativeSelect
          value={selectedCourse ?? ""}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            selectCourse(e.target.value || undefined)
          }
        >
          <NativeSelectOption value="">Select A Course</NativeSelectOption>
          {courses.map((course) => (
            <NativeSelectOption key={course.code} value={course.code}>
              {course.displayName} ({course.code})
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </div>

      <div className="flex overflow-hidden">
        {questions !== undefined && selectedCourse && (
          <div className="flex-1 bg-white border-r overflow-y-auto">
            <div className="p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Topics & Modules</h3>
                {courseTopics.map((topic) => (
                  <div key={topic} className="border rounded-lg overflow-hidden">
                    <button
                      type="button"
                      onClick={() => {
                        if (selectedTopic === topic) {
                          selectTopic(undefined);
                          selectModule(undefined);
                        } else {
                          selectTopic(topic);
                        }
                      }}
                      className={`w-full text-left px-4 py-3 font-semibold transition flex items-center justify-between ${
                        selectedTopic === topic
                          ? "bg-blue-600 text-white"
                          : "bg-gray-50 text-gray-800 hover:bg-gray-100"
                      }`}
                    >
                      <span>{topic}</span>
                      <ChevronRight
                        size={20}
                        className={`transition-transform ${
                          selectedTopic === topic ? "rotate-90" : ""
                        }`}
                      />
                    </button>

                    {selectedTopic === topic && (
                      <div className="bg-gray-50 p-2">
                        {questions.modules.length === 0 && (
                          <span className="text-xs">No modules available</span>
                        )}
                        {questions.modules?.map((module) => {
                          const { module_id, questions: moduleQuestions } = module;

                          return (
                            <button
                              key={`${module_id}—${selectedModuleId}`}
                              type="button"
                              onClick={() => selectModule(module_id)}
                              className={`w-full text-left px-4 py-3 rounded-lg mb-1 transition flex items-center justify-between ${
                                selectedModuleId === module_id
                                  ? "bg-blue-100 text-blue-700 font-medium"
                                  : "text-gray-700 hover:bg-gray-100"
                              }`}
                            >
                              <span>{module_id}</span>
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  selectedModuleId === module_id
                                    ? "bg-blue-200 text-blue-800"
                                    : "bg-gray-200 text-gray-600"
                                }`}
                              >
                                {moduleQuestions.length}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex-2 space-y-4 overflow-y-auto py-5 px-5">
          {selectedModuleId &&
            currentModule &&
            currentModule.questions.map((question, index) => (
              <div
                key={`${index}—${question.question_number}`}
                className="bg-white rounded-lg p-5 shadow-sm border-2 border-transparent hover:border-blue-300 transition"
              >
                {editingQuestion && editingQuestion.question_number === question.question_number ? (
                  <QuestionEditor question={question} />
                ) : (
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3 justify-between">
                      <div className="flex items-center gap-3">
                        <p className="text-sm font-semibold text-gray-500 ">
                          {question.question_number}
                        </p>
                        <span className="px-3 py-1 text-xs font-medium bg-[#3380fc] text-white rounded-full">
                          {question.question_style}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEditingQuestion(question)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      >
                        <Edit2 size={20} />
                      </button>
                    </div>

                    <QuestionRenderer question={question} />
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
