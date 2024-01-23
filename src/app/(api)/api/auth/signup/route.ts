import { NextResponse } from "next/server";

import { createUser } from "@/lib/server/auth/users";
import { signupSchema } from "@/lib/shared/validations/auth";
import { createSession, createSessionCookie } from "@/lib/server/auth/session";

export async function POST(req: Request) {
  const body = await req.json();
  const validatedSignup = signupSchema.safeParse(body);

  if (!validatedSignup.success) {
    return NextResponse.json(
      { success: false, error: "Invalid credentials" },
      { status: 400 }
    );
  }

  const user = await createUser({
    key: {
      providerId: "email",
      providerUserId: validatedSignup.data.email,
      password: validatedSignup.data.password,
    },
    attributes: {
      username: validatedSignup.data.username,
      email: validatedSignup.data.email
    }
  });
  if (!user) {
    return NextResponse.json(
      { success: false, message: "Failed to create user"},
      { status: 500 }
    );
  }

  const session = await createSession(user.id);
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unexpected error occour" },
      { status: 500 }
    );
  }

  const sessionCookie = await createSessionCookie(session);
  if (!sessionCookie) {
    return NextResponse.json(
      { success: false, error: "Unexpected error occour" },
      { status: 500 }
    );
  }

  return new NextResponse(null, {
    status: 302,
    headers: {
      Location: "/",
      "Set-Cookie": sessionCookie
    }
  });
}