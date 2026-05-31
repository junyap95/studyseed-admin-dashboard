import { NextResponse } from "next/server";

import { connectToMongoDB } from "@/lib/mongodb";
import { BASE_AVATAR } from "@/constants/constants";
import { User } from "@/Models/User";

export async function POST() {
  try {
    await connectToMongoDB();

    // Update all users to include avatar and unlockedAvatars fields
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
