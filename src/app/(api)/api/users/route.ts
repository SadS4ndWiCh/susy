import { NextResponse } from "next/server";

import { eq } from "drizzle-orm";

import { db } from "@/lib/server/db/connection";
import { users } from "@/lib/server/db/schemas";
import { validateRequest } from "@/lib/server/auth/request";
import { deleteUser, updateUserAttributes } from "@/lib/server/auth/users";

import { updatableAttributesSchema, type User } from "@/lib/shared/validations/users";

export async function GET(req: Request) {
  const session = await validateRequest(req);
  if (!session) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  let user: User[];
  try {
    user = await db
      .select()
      .from(users)
      .where(eq(users.id, session.userId))
      .limit(1);
  } catch (err) {
    console.log("Failed to get current user data: ", err);

    return NextResponse.json(
      { success: false, message: "Unexpect error occour" },
      { status: 500 }
    );
  }

  if (user.length === 0) {
    return NextResponse.json(
      { success: false, message: "User not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(user[0]);
}

export async function PUT(req: Request) {
  const session = await validateRequest(req);
  if (!session) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await req.json();

  const validatedAttributes = updatableAttributesSchema.safeParse(body);
  if (!validatedAttributes.success) {
    return NextResponse.json(
      { success: false, message: "Invalid request body" },
      { status: 400 }
    );
  }

  await updateUserAttributes(session.userId, validatedAttributes.data);

  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const session = await validateRequest(req);
  if (!session) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  await deleteUser(session.userId);

  return NextResponse.json({ success: true });
}