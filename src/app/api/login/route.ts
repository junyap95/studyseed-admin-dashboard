import { adminSchema } from "@/lib/adminSchema";
import { Admin, IAdmin } from "@/Models/Admin";
import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { connectToMongoDB } from "@/lib/mongodb";
import jwt, { Secret } from "jsonwebtoken";
import { PrivateKeyInput, JsonWebKeyInput } from "crypto";

// import clientPromise from "@/app/lib/mongodb";
await connectToMongoDB();

export async function GET() {
  const data = {
    message: "Hello from the API!",
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const requestBody: IAdmin = await request.json();
    // console.log(requestBody);

    const result = adminSchema.safeParse(requestBody);

    if (!result.success) {
      return NextResponse.json({ error: result }, { status: 400 });
    }

    const adminUser = await Admin.findOne({ email: requestBody.email });

    if (!adminUser) {
      return NextResponse.json({ error: "User does not exist!" }, { status: 404 });
    }

    const passwordValidation = await bcryptjs.compare(requestBody.password, adminUser.password);

    if (!passwordValidation) {
      return NextResponse.json({ error: "Incorrect password!" }, { status: 401 });
    }

    // if login successful, generate an auth token for user
    const token = jwt.sign(
      { _id: adminUser.email },
      process.env.JWT_SECRET as Buffer<ArrayBufferLike> | Secret | PrivateKeyInput | JsonWebKeyInput
    );

    const responseData = {
      message: `Login successful`,
      authToken: token,
    };

    return NextResponse.json(responseData, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 });
  }
}
