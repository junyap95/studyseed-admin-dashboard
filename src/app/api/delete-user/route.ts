import { NextResponse } from "next/server";
import { connectToMongoDB } from "@/lib/mongodb";
import { IUser, User } from "@/Models/User";
import { requireAuth } from "@/lib/requireAuth";

export async function DELETE(request: Request) {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth.response;

  await connectToMongoDB();

  try {
    const body = await request.json();
    const userid = body?.userid;

    if (!userid || typeof userid !== "string") {
      return NextResponse.json({ message: "Missing or invalid userid" }, { status: 400 });
    }

    const deletedUser = (await User.findOneAndDelete({ userid })) as IUser | null;

    if (!deletedUser) {
      return NextResponse.json({ message: `User with id: ${userid} not found` }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: `User ${deletedUser.first_name} ${deletedUser.last_name} deleted successfully. Userid: ${userid}`,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 });
  }
}
