import { NextResponse } from "next/server";

import { connectToMongoDB } from "@/lib/mongodb";
import { requireAuth } from "@/lib/requireAuth";
import { createCourseSchema } from "@/lib/courseSchema";
import { ensureLegacyCoursesSeeded } from "@/lib/courseRegistrySeed";
import { CourseRegistry } from "@/Models/CourseRegistry";
import { ensureQuestionCollection } from "@/lib/questionCollection";

export async function GET(request: Request) {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth.response;

  await connectToMongoDB();
  await ensureLegacyCoursesSeeded();

  const courses = await CourseRegistry.find().sort({ code: 1 }).lean();

  return NextResponse.json({
    data: courses.map((course) => ({
      code: course.code,
      displayName: course.displayName,
      topics: course.topics,
      createdAt: course.createdAt,
    })),
  });
}

export async function POST(request: Request) {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth.response;

  await connectToMongoDB();

  try {
    const body = await request.json();
    const parsed = createCourseSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validation error", errors: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { code, displayName, topics } = parsed.data;

    const existing = await CourseRegistry.findOne({ code });
    if (existing) {
      return NextResponse.json({ message: `Course "${code}" already exists` }, { status: 409 });
    }

    const course = await CourseRegistry.create({ code, displayName, topics });

    for (const topic of topics) {
      await ensureQuestionCollection(code, topic);
    }

    return NextResponse.json(
      {
        message: "Course created successfully",
        data: {
          code: course.code,
          displayName: course.displayName,
          topics: course.topics,
          createdAt: course.createdAt,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to create course" }, { status: 500 });
  }
}
