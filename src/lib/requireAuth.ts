import { parse } from "cookie";
import { NextResponse } from "next/server";
import type { JWTVerifyResult } from "jose";

import { verifyAuthToken } from "@/lib/auth";

export type RequireAuthResult =
  | { ok: true; verified: JWTVerifyResult }
  | { ok: false; response: NextResponse };

export async function requireAuth(request: Request): Promise<RequireAuthResult> {
  const cookies = parse(request.headers.get("cookie") || "");
  const token = cookies.authToken;

  if (!token) {
    return {
      ok: false,
      response: NextResponse.json({ message: "Unauthorized" }, { status: 401 }),
    };
  }

  try {
    const verified = await verifyAuthToken(token);
    return { ok: true, verified };
  } catch {
    return {
      ok: false,
      response: NextResponse.json({ message: "Invalid or expired token" }, { status: 401 }),
    };
  }
}
