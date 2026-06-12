import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { parse } from "cookie";
import { jwtVerify } from "jose";
import { DashboardPagePath } from "./enums/pagePaths.enum";
import { getSecret, verifyAuthToken } from "./lib/auth";

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const cookies = parse(req.headers.get("cookie") || "");
  const token = cookies.authToken;

  if (pathname === DashboardPagePath.LOGIN) {
    if (!token) {
      return NextResponse.next(); // not logged in → allow
    }

    try {
      await jwtVerify(token, getSecret());
      // logged in → redirect away from login
      return NextResponse.redirect(new URL(DashboardPagePath.MANAGE, req.url));
    } catch {
      // token invalid/expired → allow login
      return NextResponse.next();
    }
  }

  if (!token) {
    return NextResponse.redirect(new URL(DashboardPagePath.LOGIN, req.url));
  }

  try {
    await verifyAuthToken(token);
    return NextResponse.next();
  } catch (error) {
    console.error(error);
    return NextResponse.redirect(new URL(DashboardPagePath.LOGIN, req.url));
  }
}

export const config = {
  matcher: ["/manage/:path*", "/login"], // protected routes
};
