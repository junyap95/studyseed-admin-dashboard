import React from "react";
import { Edit2, ChevronRight } from "lucide-react";

import { Topic } from "@/enums/topics.enum";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { useQuestions } from "@/context/QuestionsContext";
import { Course } from "@/enums/courses.enum";
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
    currentModule,
    editingQuestion,
    setEditingQuestion,
  } = useQuestions();

  if (isLoading) return <div>Loading</div>;

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <div className="bg-white shadow-sm border-b px-6 py-4">
        <h2 className="text-2xl font-bold text-gray-800">Select a course</h2>

        <NativeSelect
          value={selectedCourse}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            selectCourse(e.target.value as Course)
          }
        >
          <NativeSelectOption value="">Select A Course</NativeSelectOption>
          {Object.values(Course).map((course) => (
            <NativeSelectOption key={course} value={course}>
              {course}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </div>

      {/* Main Content */}
      <div className="flex overflow-hidden">
        {/* Left Sidebar - Topics & Modules */}
        {questions !== undefined && (
          <div className="flex-1 bg-white border-r overflow-y-auto">
            <div className="p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Topics & Modules</h3>
                {[Topic.LITERACY, Topic.NUMERACY].map((topic) => (
                  <div key={topic} className="border rounded-lg overflow-hidden">
                    <button
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

                    {!isLoading && selectedTopic === topic && (
                      <div className="bg-gray-50 p-2">
                        {questions.modules.length === 0 && (
                          <span className="text-xs">No questions available</span>
                        )}
                        {questions.modules?.map((module) => {
                          const { module_id, questions: moduleQuestions } = module;

                          return (
                            <button
                              key={`${module_id}—${selectedModuleId}`}
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

        {/* Right Content Area - Questions */}
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
