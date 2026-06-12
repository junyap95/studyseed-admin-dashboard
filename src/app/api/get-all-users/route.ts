import { NextResponse } from "next/server";

import { User } from "@/Models/User";
import { connectToMongoDB } from "@/lib/mongodb";
import { requireAuth } from "@/lib/requireAuth";

export async function GET(request: Request) {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth.response;

  await connectToMongoDB();

  const allUsers = await User.find().sort({ _id: -1 }).lean();

  const data = { allUsers };

  return NextResponse.json({ data, user: auth.verified });
}
