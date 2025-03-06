import { adminSchema } from "@/lib/adminSchema";
import { Admin, IAdmin } from "@/Models/Admin";
import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { connectToMongoDB } from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import { parse, serialize } from "cookie";

// import clientPromise from "@/app/lib/mongodb";

export async function GET(request: Request) {
  const cookies = parse(request.headers.get("cookie") || "");
  const token = cookies.authToken;

  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

  const data = {
    message: "Hello from the API!",
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json({ data, user: decoded });
}

export async function POST(request: Request) {
  await connectToMongoDB();

  try {
    const cookies = parse(request.headers.get("cookie") || "");
    const existingToken = cookies.authToken;

    // If token exists, verify it
    if (existingToken) {
      const decoded = jwt.verify(existingToken, process.env.JWT_SECRET as string);
      return NextResponse.json({ message: "User already logged in", user: decoded });
    }

    const requestBody: IAdmin = await request.json();

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
    const token = jwt.sign({ _email: adminUser.email }, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });

    const response = NextResponse.json({ message: `Login successful` }, { status: 201 });

    response.headers.set(
      "Set-Cookie",
      serialize("authToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60,
        path: "/",
      })
    );

    return response;
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 });
  }
}
