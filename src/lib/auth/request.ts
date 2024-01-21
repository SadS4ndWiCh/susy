import { parseCookies } from "oslo/cookie";

import { validateJWT } from "./jwt";
import { validateSession } from "./session";

export async function validateRequest(req: { headers: Headers }) {
  const headerCookies = req.headers.get("cookie");
  if (!headerCookies) return null;

  const session = parseCookies(headerCookies).get("susysession");
  if (!session) return null;

  const jwt = await validateJWT(session);
  if (!jwt) return null;

  // @ts-ignore
  return await validateSession(jwt.payload.sessionId);
}