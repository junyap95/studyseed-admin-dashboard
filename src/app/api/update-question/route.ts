import { NextResponse } from "next/server";

import { connectToMongoDB } from "@/lib/mongodb";
import { UpdateQuestionPayload } from "@/lib/types";
import { requireAuth } from "@/lib/requireAuth";
import { updateQuestion } from "./updateQuestion";

export async function PUT(request: Request) {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth.response;

  await connectToMongoDB();

  try {
    const requestBody: UpdateQuestionPayload = await request.json();

    const result = await updateQuestion(requestBody);

    return NextResponse.json({ message: "Question updated successfully", result }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to update question", error }, { status: 500 });
  }
}
