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

  const { searchParams } = new URL(request.url); // how to get URL in route handlers
  const searchTerm = searchParams.get("searchTerm") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  const pageNumber = Math.max(page, 1);
  const limitNumber = Math.max(limit, 1);
  const skip = (pageNumber - 1) * limitNumber;

  const searchFilter = searchTerm
    ? {
        $or: [
          { userid: { $regex: searchTerm, $options: "i" } },
          { first_name: { $regex: searchTerm, $options: "i" } },
          { last_name: { $regex: searchTerm, $options: "i" } },
        ],
      }
    : {};

  const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

  const users = await User.find(searchFilter)
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limitNumber)
    .lean();

  const totalUsers = await User.countDocuments(searchFilter);

  const data = { users, totalUsers, pageNumber, limitNumber };

  return NextResponse.json({ data, user: decoded });
}
