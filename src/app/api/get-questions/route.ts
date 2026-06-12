import { NextRequest, NextResponse } from "next/server";

import { connectToMongoDB } from "@/lib/mongodb";
import { getQuestionsByCourseAndTopic } from "./getQuestionsByCourseAndTopic";
import { Topic } from "@/enums/topics.enum";
import { Course } from "@/enums/courses.enum";
import { requireAuth } from "@/lib/requireAuth";

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth.response;

  await connectToMongoDB();

  const searchParams = request.nextUrl.searchParams;
  const topic = searchParams.get("topic") as Topic;
  const course = searchParams.get("course") as Course;

  if (!topic || !course) {
    return NextResponse.json({ error: "Missing topic or course parameter" }, { status: 400 });
  }

  try {
    const gameQuestions = await getQuestionsByCourseAndTopic(course, topic);

    if (!gameQuestions) {
      return NextResponse.json({ error: `Questions not found for ${topic}` }, { status: 404 });
    }

    return NextResponse.json({ data: gameQuestions });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: `Internal error occurred when fetching ${topic} questions` },
      { status: 500 },
    );
  }
}
