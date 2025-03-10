import { ZodUserSchema, userSchema } from "@/lib/adminSchema";
import { NextResponse } from "next/server";
import { connectToMongoDB } from "@/lib/mongodb";
import { parse } from "cookie";
import { IUser, User } from "@/Models/User";

export async function POST(request: Request) {
  await connectToMongoDB();

  try {
    const cookies = parse(request.headers.get("cookie") || "");
    const existingToken = cookies.authToken;

    if (!existingToken) {
      return NextResponse.json(
        { message: "Your session has timed out. Please log in again!" },
        { status: 401 }
      );
    }

    const requestBody: ZodUserSchema = await request.json();

    const result = userSchema.safeParse(requestBody);

    if (!result.success) {
      return NextResponse.json({ message: "Validation Error", result }, { status: 400 });
    }

    const existingUser = (await User.findOne({ userid: requestBody.userid })) as IUser;

    if (existingUser?.userid === requestBody.userid) {
      return NextResponse.json(
        { message: "User already exist. Try a different User ID" },
        { status: 409 }
      );
    }

    const updatedReqBody = {
      ...requestBody,
      enrolled_courses: requestBody.enrolled_courses.map((courseObj) => courseObj.course),
    };

    const newUser = new User(updatedReqBody);
    const savedResult = await newUser.save();

    const response = NextResponse.json(
      { message: `User Created successfully`, savedResult },
      { status: 201 }
    );

    return response;
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 });
  }
}
