import { NextResponse } from "next/server";
import { init } from "@paralleldrive/cuid2";

import { db } from "@/db/connection";
import { userKeys, users } from "@/db/schemas";
import { hashPassword } from "@/lib/auth/password";
import { signupSchema } from "@/lib/validations/auth";
import { createSession, createSessionCookie } from "@/lib/auth/session";

const createId = init({ length: 15 });

export async function POST(req: Request) {
  const body = await req.json();
  const validatedSignup = signupSchema.safeParse(body);

  if (!validatedSignup.success) {
    return NextResponse.json(
      { success: false, error: "Invalid credentials" },
      { status: 400 }
    );
  }

  const userId = createId();

  try {
    await db
      .insert(users)
      .values({
        id: userId,
        username: validatedSignup.data.username,
        email: validatedSignup.data.email
      });
  } catch (err) {
    console.log(err);

    return NextResponse.json(
      { success: false, error: "User already exists" },
      { status: 409 },
    );
  }

  try {
    await db
      .insert(userKeys)
      .values({
        id: `email:${validatedSignup.data.email}`,
        userId,
        hashedPassword: await hashPassword(validatedSignup.data.password)
      });
  } catch (err) {
    console.log(err);

    return NextResponse.json(
      { success: false, error: "Unexpected error occour" },
      { status: 500 }
    );
  }

  const session = await createSession(userId);
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