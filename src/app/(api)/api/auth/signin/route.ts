import { NextResponse } from "next/server";

import { signinSchema } from "@/lib/shared/validations/auth";

import { validatePassword } from "@/lib/server/auth/password";
import { getUserKey } from "@/lib/server/db/queries/user-keys";
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

  let key: { userId: string, hashedPassword: string | null }[];

  try {
    key = await getUserKey.all({ key: `email:${validatedSignin.data.email}` });
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