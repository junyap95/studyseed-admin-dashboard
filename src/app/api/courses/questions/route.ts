import { NextResponse } from "next/server";

import { connectToMongoDB } from "@/lib/mongodb";
import { requireAuth } from "@/lib/requireAuth";
import { createModuleSchema } from "@/lib/courseSchema";
import { QuestionSchema } from "@/lib/questionSchema";
import { CourseRegistry } from "@/Models/CourseRegistry";
import { getQuestionCollection, MAX_QUESTIONS_PER_MODULE } from "@/lib/questionCollection";
import { QuestionsPayload } from "@/lib/questionPayload";

const createQuestionPayloadSchema = createModuleSchema.extend({
  question: QuestionSchema,
});

export async function POST(request: Request) {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth.response;

  await connectToMongoDB();

  try {
    const body = await request.json();
    const parsed = createQuestionPayloadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validation error", errors: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { courseCode, topic, module_id, question } = parsed.data;

    const course = await CourseRegistry.findOne({ code: courseCode });
    if (!course) {
      return NextResponse.json({ message: `Course "${courseCode}" not found` }, { status: 404 });
    }

    if (!course.topics.includes(topic)) {
      return NextResponse.json(
        { message: `Topic "${topic}" is not configured for course "${courseCode}"` },
        { status: 400 },
      );
    }

    const Collection = getQuestionCollection(courseCode, topic);
    const doc = (await Collection.findOne().lean()) as QuestionsPayload | null;

    if (!doc) {
      return NextResponse.json(
        { message: `No question data found for ${courseCode} / ${topic}` },
        { status: 404 },
      );
    }

    const targetModule = doc.modules.find(
      (mod: { module_id: string }) => mod.module_id === module_id,
    );

    if (!targetModule) {
      return NextResponse.json({ message: `Module "${module_id}" not found` }, { status: 404 });
    }

    if (targetModule.questions.length >= MAX_QUESTIONS_PER_MODULE) {
      return NextResponse.json(
        { message: `Module already has the maximum of ${MAX_QUESTIONS_PER_MODULE} questions` },
        { status: 400 },
      );
    }

    const duplicateNumber = targetModule.questions.some(
      (q: { question_number: string }) => q.question_number === question.question_number,
    );
    if (duplicateNumber) {
      return NextResponse.json(
        { message: `Question number "${question.question_number}" already exists in this module` },
        { status: 409 },
      );
    }

    const result = await Collection.updateOne(
      {},
      { $push: { "modules.$[m].questions": question } },
      { arrayFilters: [{ "m.module_id": module_id }] },
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ message: "Failed to save question" }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Question created successfully", data: question },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "Failed to create question";
    return NextResponse.json({ message }, { status: 500 });
  }
}
