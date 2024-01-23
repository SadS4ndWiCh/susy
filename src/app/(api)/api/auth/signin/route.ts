import { NextResponse } from "next/server";

import { signinSchema } from "@/lib/shared/validations/auth";

import { getKey } from "@/lib/server/auth/users";
import { createSession, createSessionCookie } from "@/lib/server/auth/session";

export async function POST(req: Request) {
  const body = await req.json();
  const validatedSignin = signinSchema.safeParse(body);

  if (!validatedSignin.success) {
    return NextResponse.json(
      { success: false, error: "Invalid credentials" },
      { status: 400 }
    );
  }

  const key = await getKey("email", validatedSignin.data.email, validatedSignin.data.password);
  if (!key) {
    return NextResponse.json(
      { success: false, message: "Incorrect email or password" },
      { status: 400 }
    );
  }

  const session = await createSession(key.userId);
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unexpected error occour" },
      { status: 500 }
    );
  }

  const sessionCookie = await createSessionCookie(session);

  return new NextResponse(null, {
    status: 302,
    headers: {
      Location: "/",
      "Set-Cookie": sessionCookie
    }
  });
}