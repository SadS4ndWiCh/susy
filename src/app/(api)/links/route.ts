import { NextApiHandler } from "next";
import { NextResponse } from "next/server";

import { init } from "@paralleldrive/cuid2";
import { format } from "date-fns";

import { db } from "@/db/connection";
import { links } from "@/db/schemas";
import { createSusy } from "@/lib/susy";
import { newLinkSchema } from "@/lib/validations/links";

const createId = init({ length: 15 });
const DAYS_IN_SECONDS = 1000 * 60 * 60 * 24;

export async function POST(req: Request) {
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
        expiresAt
      });

    return NextResponse.json({ success: true, susy }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Unexpected error occour" },
      { status: 500 }
    );
  }
}

export const GET: NextApiHandler = async () => {
  try {
    const allLinks = await db
      .select()
      .from(links);
    
    return NextResponse.json(allLinks)
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Unexpected error occour" },
      { status: 500 }
    );
  }
 
}