import { NextRequest, NextResponse } from "next/server";
import { parseCookies } from "oslo/cookie";

import { validateJWT } from "./lib/auth/jwt";

export async function middleware(req: NextRequest) {
  const cookies = parseCookies(req.headers.get("cookie") ?? "");
  const session = cookies.get("susysession");
  const jwt = await validateJWT(session ?? "");

  const isAuth = !!jwt;
  const isAuthPage = req.nextUrl.pathname.startsWith("/signup") ||
                     req.nextUrl.pathname.startsWith("/signin");

  if (isAuthPage) {
    if (isAuth) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return null;
  }

  if (!isAuth) {
    let from = req.nextUrl.pathname;
    if (req.nextUrl.search) {
      from += req.nextUrl.search;
    }

    return NextResponse.redirect(
      new URL(`/signin?from=${encodeURIComponent(from)}`, req.url)
    );
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"]
}