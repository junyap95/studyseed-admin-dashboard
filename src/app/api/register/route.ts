import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { connectToMongoDB } from "@/lib/mongodb";
import { IAdmin, Admin } from "@/Models/Admin";

await connectToMongoDB();

export async function POST(request: Request) {
  try {
    const requestBody: IAdmin = await request.json();

    const emailExists = await Admin.findOne({ email: requestBody.email });

    if (emailExists) {
      return NextResponse.json({ error: "User with this email already exists!" }, { status: 400 });
    }

    const salt = await bcryptjs.genSalt(5);
    const hashedPassword = await bcryptjs.hash(requestBody.password, salt);

    const newAdmin = new Admin({
      username: requestBody.username,
      email: requestBody.email,
      password: hashedPassword,
    });

    try {
      const saveUser = await newAdmin.save();
      return NextResponse.json(
        { message: `Successfully created an admin: ${requestBody.username}`, payload: saveUser },
        { status: 201 }
      );
    } catch (error) {
      return NextResponse.json({ error }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 });
  }
}
