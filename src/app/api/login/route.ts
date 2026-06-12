import { serialize } from "cookie";
import bcryptjs from "bcryptjs";
import { NextResponse } from "next/server";

import { adminSchema, SafeAdminUser, ZodAdminSchema } from "@/lib/adminSchema";
import { Admin } from "@/Models/Admin";
import { connectToMongoDB } from "@/lib/mongodb";
import { signAuthToken } from "@/lib/auth";

export interface LoginResponse {
  message: string;
  adminUser: SafeAdminUser;
}

export async function POST(request: Request) {
  await connectToMongoDB();

  try {
    const requestBody: ZodAdminSchema = await request.json();

    const result = adminSchema.safeParse(requestBody);

    if (!result.success)
      return NextResponse.json({ error: `Parsing error: ${result}` }, { status: 400 });

    const adminUser = (await Admin.findOne({ email: requestBody.email })) as ZodAdminSchema;

    if (!adminUser) {
      return NextResponse.json({ error: "Admin with this email does not exist!" }, { status: 404 });
    }

    const passwordValidation = await bcryptjs.compare(requestBody.password, adminUser.password);

    if (!passwordValidation) {
      return NextResponse.json({ error: "Incorrect password!" }, { status: 401 });
    }

    const token = await signAuthToken({
      email: adminUser.email,
    });

    const safeAdminUser: SafeAdminUser = {
      email: adminUser.email,
      username: adminUser.username,
    };

    const response = NextResponse.json(
      { message: `Login successful`, adminUser: safeAdminUser } satisfies LoginResponse,
      { status: 200 },
    );

    response.headers.set(
      "Set-Cookie",
      serialize("authToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 12,
        path: "/",
      }),
    );

    return response;
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 });
  }
}
