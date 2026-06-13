import { DashboardAPIPath } from "@/enums/apiPaths.enum";
import { CreateCourseInput } from "@/lib/courseSchema";
import { UpdateQuestionPayload } from "./types";
import { ZodQuestionSchema } from "./questionSchema";

async function parseJsonResponse(res: Response) {
  const text = await res.text();

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    throw new Error(text.slice(0, 200) || `Request failed with status ${res.status}`);
  }
}

export const updateQuestionFn = async (body: UpdateQuestionPayload) => {
  const res = await fetch(DashboardAPIPath.UPDATE_QUESTION, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    credentials: "include",
  });
  const data = await parseJsonResponse(res);
  if (!res.ok) {
    const err = new Error(String(data?.message || "Error updating question")) as Error & {
      status?: number;
    };
    err.status = res.status;
    throw err;
  }
  return data;
};

export const createCourseFn = async (body: CreateCourseInput) => {
  const res = await fetch(DashboardAPIPath.COURSES, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    credentials: "include",
  });
  const data = await parseJsonResponse(res);
  if (!res.ok) {
    throw new Error(String(data?.message || "Failed to create course"));
  }
  return data;
};

export const createModuleFn = async (body: {
  courseCode: string;
  topic: string;
  module_id: string;
}) => {
  const res = await fetch(DashboardAPIPath.COURSE_MODULES, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    credentials: "include",
  });
  const data = await parseJsonResponse(res);
  if (!res.ok) {
    throw new Error(String(data?.message || "Failed to create module"));
  }
  return data;
};

export const createQuestionFn = async (body: {
  courseCode: string;
  topic: string;
  module_id: string;
  question: ZodQuestionSchema;
}) => {
  const res = await fetch(DashboardAPIPath.COURSE_QUESTIONS, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    credentials: "include",
  });
  const data = await parseJsonResponse(res);
  if (!res.ok) {
    throw new Error(String(data?.message || "Failed to create question"));
  }
  return data;
};
