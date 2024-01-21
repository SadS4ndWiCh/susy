import { NextResponse } from "next/server";

import { validateRequest } from "@/lib/auth/request";
import { createSessionCookie, invalidateSession } from "@/lib/auth/session";

export async function POST(req: Request) {
  const session = await validateRequest(req);

  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  await invalidateSession(session.sessionId);

  const cookie = await createSessionCookie(null);

  return new NextResponse(null, {
    status: 302,
    headers: {
      Location: "/signin",
      "Set-Cookie": cookie
    }
  });
}