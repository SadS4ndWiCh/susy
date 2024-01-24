import { NextResponse } from "next/server";

import { generateState } from "oslo/oauth2";
import { serializeCookie } from "oslo/cookie";

import { env } from "@/lib/server/env";
import { client } from "@/lib/server/auth/oauth/github";

export async function GET() {
  const state = generateState();

  const url = await client.createAuthorizationURL({
    state,
    scopes: ["user:email"]
  });

  const cookie = serializeCookie("github_oauth_state", state, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60
  });

  return new NextResponse(null, {
    status: 302,
    headers: {
      Location: url.href,
      "Set-Cookie": cookie
    }
  });
}