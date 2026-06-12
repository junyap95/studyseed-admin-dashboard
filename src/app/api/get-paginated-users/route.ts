import { NextResponse } from "next/server";

import { User } from "@/Models/User";
import { connectToMongoDB } from "@/lib/mongodb";
import { requireAuth } from "@/lib/requireAuth";

export async function GET(request: Request) {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth.response;

  await connectToMongoDB();

  const { searchParams } = new URL(request.url);
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

  const users = await User.find(searchFilter)
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limitNumber)
    .lean();

  const totalUsers = await User.countDocuments(searchFilter);

  const data = { users, totalUsers, pageNumber, limitNumber };

  return NextResponse.json({ data, user: auth.verified });
}
