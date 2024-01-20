import { NextResponse } from "next/server";
import { parseCookies } from "oslo/cookie";

import { createSessionCookie, invalidateSession } from "@/lib/auth/session";
import { validateJWT } from "@/lib/auth/jwt";

export async function POST(req: Request) {
  const cookies = parseCookies(req.headers.get("cookie") ?? "");
  const jwt = await validateJWT(cookies.get("susysession") ?? "");

  if (!jwt) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  // @ts-ignore
  await invalidateSession(jwt.payload.sessionId);

  const cookie = await createSessionCookie(null);

  return new NextResponse(null, {
    status: 302,
    headers: {
      Location: "/signin",
      "Set-Cookie": cookie
    }
  });
}