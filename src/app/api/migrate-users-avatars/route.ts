import { NextResponse } from "next/server";

import { connectToMongoDB } from "@/lib/mongodb";
import { BASE_AVATAR } from "@/constants/constants";
import { User } from "@/Models/User";
import { requireAuth } from "@/lib/requireAuth";

export async function POST(request: Request) {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth.response;

  const migrationSecret = process.env.MIGRATION_SECRET;
  if (!migrationSecret) {
    return NextResponse.json({ message: "Migration is not configured" }, { status: 503 });
  }

  const providedSecret = request.headers.get("x-migration-secret");
  if (providedSecret !== migrationSecret) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToMongoDB();

    const result = await User.updateMany(
      {},
      {
        $set: {
          avatar: BASE_AVATAR,
          unlockedAvatars: [BASE_AVATAR],
        },
      },
      { upsert: false },
    );

    return NextResponse.json(
      {
        success: true,
        message: "Migration completed",
        modifiedCount: result.modifiedCount,
        matchedCount: result.matchedCount,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Migration error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
