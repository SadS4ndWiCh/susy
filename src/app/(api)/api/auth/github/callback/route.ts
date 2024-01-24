import { NextResponse } from "next/server";
import { parseCookies } from "oslo/cookie";

import { env } from "@/lib/server/env";
import { createUser, getKey } from "@/lib/server/auth/users";
import { createSession, createSessionCookie } from "@/lib/server/auth/session";
import { client, getGithubUser, getGithubUserEmail } from "@/lib/server/auth/oauth/github";

export async function GET(req: Request) {
  const cookies = parseCookies(req.headers.get("cookie") ?? "");
  const storedState = cookies.get("github_oauth_state");

  const url = new URL(req.url);
  const state = url.searchParams.get("state");
  const code = url.searchParams.get("code");

  if (!storedState || !state || !code || storedState !== state) {
    return new Response(null, { status: 400 });
  }

  let token: { access_token: string };

  try {
    token = await client.validateAuthorizationCode(code, {
      credentials: env.GITHUB_CLIENT_SECRET,
      authenticateWith: "request_body"
    });
  } catch (err) {
    console.log("[GITHUB_AUTH_CALLBACK]: Failed to validate authorization code: ", err);

    return NextResponse.json(
      { success: false, message: "Failed to validate" },
      { status: 500 }
    );
  }

  const [githubUser, githubEmail] = await Promise.all([
    getGithubUser(token.access_token),
    getGithubUserEmail(token.access_token)
  ]);

  if (!githubUser || !githubEmail) {
    console.log("[GITHUB_AUTH_CALLBACK] Failed to fetch user");
    return NextResponse.json(
      { success: false, message: "An unexpected error occour" },
      { status: 500 }
    );
  }

  let userId: string;

  const alreadyExists = await getKey("github", githubUser.login);

  if (alreadyExists) {
    userId = alreadyExists.userId;
  } else {
    const user = await createUser({
      key: {
        providerId: "github",
        providerUserId: githubUser.login
      },
      attributes: {
        username: githubUser.login,
        email: githubEmail.email
      }
    });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Failed to create user"},
        { status: 500 }
      );
    }

    userId = user.id;
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