import { NextResponse } from "next/server";
import { parse } from "cookie";
import jwt from "jsonwebtoken";
import { User } from "@/Models/User";
import { connectToMongoDB } from "@/lib/mongodb";

export async function GET(request: Request) {
  await connectToMongoDB();

  const cookies = parse(request.headers.get("cookie") || "");
  const token = cookies.authToken;

  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

  const allUsers = await User.find().sort({ _id: -1 }).lean();

  const data = {
    message: "Hello from the API!",
    allUsers,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json({ data, user: decoded });
}
