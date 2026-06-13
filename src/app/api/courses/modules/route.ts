import { NextResponse } from "next/server";

import { connectToMongoDB } from "@/lib/mongodb";
import { requireAuth } from "@/lib/requireAuth";
import { createModuleSchema } from "@/lib/courseSchema";
import { CourseRegistry } from "@/Models/CourseRegistry";
import { getQuestionCollection } from "@/lib/questionCollection";

export async function POST(request: Request) {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth.response;

  await connectToMongoDB();

  try {
    const body = await request.json();
    const parsed = createModuleSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validation error", errors: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { courseCode, topic, module_id } = parsed.data;

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
    let doc = await Collection.findOne();

    if (!doc) {
      doc = await Collection.create({ modules: [] });
    }

    const moduleExists = doc.modules.some(
      (mod: { module_id: string }) => mod.module_id === module_id,
    );
    if (moduleExists) {
      return NextResponse.json(
        { message: `Module "${module_id}" already exists in ${courseCode} / ${topic}` },
        { status: 409 },
      );
    }

    doc.modules.push({ module_id, questions: [] });
    await doc.save();

    return NextResponse.json(
      { message: "Module created successfully", data: { module_id, questions: [] } },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to create module" }, { status: 500 });
  }
}
