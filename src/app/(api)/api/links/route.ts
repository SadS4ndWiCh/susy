import { NextResponse } from "next/server";

import { and, eq } from "drizzle-orm";
import { init } from "@paralleldrive/cuid2";
import { format } from "date-fns";

import { db } from "@/lib/server/db/connection";
import { links } from "@/lib/server/db/schemas";

import { createSusy } from "@/lib/server/susy";
import { deleteLinkSchema, newLinkSchema } from "@/lib/shared/validations/links";
import { validateRequest } from "@/lib/server/auth/request";

const createId = init({ length: 15 });
const DAYS_IN_SECONDS = 1000 * 60 * 60 * 24;

export async function POST(req: Request) {
  const session = await validateRequest(req);

  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await req.json();

  const validatedLink = newLinkSchema.safeParse(body);
  if (!validatedLink.success) return NextResponse.json(
    {
      success: false,
      error: validatedLink.error.flatten().fieldErrors
    },
    { status: 400 }
  );

  try {
    const susy = createSusy();
    const expiresAt = format(
      new Date(Date.now() + (DAYS_IN_SECONDS * 7)),
      "yyyy-MM-dd HH:mm:ss"
    );

    await db
      .insert(links)
      .values({
        id: createId(),
        url: validatedLink.data.url,
        susLink: susy,
        expiresAt,
        ownerId: session.userId,
      });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Unexpected error occour" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const session = await validateRequest(req);

  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const allLinks = await db
      .select()
      .from(links)
      .where(eq(links.ownerId, session.userId));
    
    return NextResponse.json(allLinks)
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Unexpected error occour" },
      { status: 500 }
    );
  }
 
}

export async function DELETE(req: Request) {
  const session = await validateRequest(req);
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await req.json();

  const validatedLink = deleteLinkSchema.safeParse(body);
  if (!validatedLink.success) return NextResponse.json(
    {
      success: false,
      error: validatedLink.error.flatten().fieldErrors
    },
    { status: 400 }
  );

  try {
    await db
      .delete(links)
      .where(
        and(
          eq(links.id, validatedLink.data.id),
          eq(links.ownerId, session.userId)
        )
      );
    
    return NextResponse.json({ success: true });
  } catch (err) {
    console.log("[DELETE_LINK]: Failed to delete a link: ", err);

    return NextResponse.json(
      { success: false, error: "Unexpected error occour" },
      { status: 500 }
    );
  }
}