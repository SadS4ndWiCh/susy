import { NextRequest, NextResponse } from "next/server";

import { validateRequest } from "@/lib/server/auth/request";

export async function middleware(req: NextRequest) {
  const session = await validateRequest(req);

  const isAuth = !!session;
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