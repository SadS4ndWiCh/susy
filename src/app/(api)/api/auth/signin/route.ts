import { NextResponse } from "next/server";

import { eq } from "drizzle-orm";

import { db } from "@/db/connection";
import { signinSchema } from "@/lib/validations/auth";

import { userKeys } from "@/db/schemas";
import { validatePassword } from "@/lib/auth/password";
import { createSession, createSessionCookie } from "@/lib/auth/session";

export async function POST(req: Request) {
  const body = await req.json();
  const validatedSignin = signinSchema.safeParse(body);

  if (!validatedSignin.success) {
    return NextResponse.json(
      { success: false, error: "Invalid credentials" },
      { status: 400 }
    );
  }

  let key: { userId: string, hashedPassword: string | null }[];

  try {
    key = await db
      .select({
        userId: userKeys.userId,
        hashedPassword: userKeys.hashedPassword
      })
      .from(userKeys)
      .where(eq(userKeys.id, `email:${validatedSignin.data.email}`))
      .limit(1);
  } catch (err) {
    console.log(err);

    return NextResponse.json(
      { success: false, error: "Unexpected error occour" },
      { status: 500 }
    );
  }

  if (key.length === 0) {
    return NextResponse.json(
      { success: false, error: "Incorrect email or password" },
      { status: 404 }
    );
  }

  if (!validatePassword(key[0].hashedPassword!, validatedSignin.data.password)) {
    return NextResponse.json(
      { success: false, error: "Incorrect email or password" },
      { status: 404 }
    );
  }

  const session = await createSession(key[0].userId);
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