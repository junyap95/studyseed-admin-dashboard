import { NextResponse } from "next/server";

import { requireAuth } from "@/lib/requireAuth";

export async function GET(request: Request) {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth.response;

  return NextResponse.json({ message: "Authenticated", user: auth.verified });
}
