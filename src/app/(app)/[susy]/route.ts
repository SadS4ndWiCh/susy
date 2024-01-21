import { NextResponse } from "next/server";

import { isBefore } from "date-fns";
import { eq } from "drizzle-orm";

import { db } from "@/db/connection";
import { links } from "@/db/schemas";

export async function GET(
  req: Request,
  { params }: { params: { susy: string } }
) {
  const susy = params.susy;

  try {
    const link = await db
      .select()
      .from(links)
      .where(eq(links.susLink, susy))
    
    if (link.length === 0) return new NextResponse(undefined, { status: 404 });

    if (isBefore(new Date(link[0].expiresAt), new Date())) {
      return new NextResponse(null, { status: 404 });
    }

    return new NextResponse(null, {
      status: 302,
      headers: {
        "Location": link[0].url
      }
    })
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Unexpected error occour" },
      { status: 500 }
    );
  }
}