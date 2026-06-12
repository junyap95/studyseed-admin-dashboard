import { ZodUserSchema, userSchema } from "@/lib/adminSchema";
import { NextResponse } from "next/server";
import { connectToMongoDB } from "@/lib/mongodb";
import { IUser, User } from "@/Models/User";
import { requireAuth } from "@/lib/requireAuth";

export async function POST(request: Request) {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth.response;

  await connectToMongoDB();

  try {
    const requestBody: ZodUserSchema = await request.json();

    const result = userSchema.safeParse(requestBody);

    if (!result.success) {
      return NextResponse.json({ message: "Validation Error", result }, { status: 400 });
    }

    const existingUser = (await User.findOne({ userid: requestBody.userid })) as IUser;

    if (existingUser?.userid === requestBody.userid) {
      return NextResponse.json(
        { message: "User already exist. Try a different User ID" },
        { status: 409 },
      );
    }

    const updatedReqBody = {
      ...requestBody,
      enrolled_courses: requestBody.enrolled_courses.map((courseObj) => courseObj.course),
    };

    const newUser = new User(updatedReqBody);
    const savedResult = await newUser.save();

    return NextResponse.json(
      { message: `User Created successfully`, savedResult },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 });
  }
}
