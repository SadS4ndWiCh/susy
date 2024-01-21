import "server-only";

import { parseCookies } from "oslo/cookie";
import { verifyRequestOrigin } from "oslo/request";

import { env } from "@/lib/server/env";

import { validateJWT } from "./jwt";
import { validateSession } from "./session";

const SAFE_METHODS = ["GET", "OPTIONS", "HEAD", "TRACE"];

export async function validateRequest(req: { headers: Headers, method: string }) {
  if (!SAFE_METHODS.includes(req.method)) {
    const origin = req.headers.get("origin");

    if (!origin || !verifyRequestOrigin(origin, [env.BASE_URL])) return null;
  }

  const headerCookies = req.headers.get("cookie");
  if (!headerCookies) return null;

  const session = parseCookies(headerCookies).get("susysession");
  if (!session) return null;

  const jwt = await validateJWT(session);
  if (!jwt) return null;

  // @ts-ignore
  return await validateSession(jwt.payload.sessionId);
}