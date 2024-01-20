import "server-only";

import { eq } from "drizzle-orm";
import { format } from "date-fns";
import { TimeSpan } from "oslo";
import { serializeCookie } from "oslo/cookie";
import { init } from "@paralleldrive/cuid2";

import { db } from "@/db/connection";
import { userSessions } from "@/db/schemas";

import { env } from "@/lib/env/server";
import { createJWTBuilder } from "@/lib/auth/jwt";

export type Session = {
  userId: string;
  sessionId: string;
  activeExpiresAt: Date;
}

const createId = init({ length: 15 });
const DAYS_IN_MILISECONDS = 1000 * 60 * 60 * 24;

export async function createSession(userId: string): Promise<Session | null> {
  const activeExpiresDate = new Date(Date.now() + (DAYS_IN_MILISECONDS * 1));
  const activeExpires = format(
    activeExpiresDate,
    "yyyy-MM-dd HH:mm:ss"
  );

  const sessionId = createId();

  try {
    await db
      .insert(userSessions)
      .values({
        id: sessionId,
        userId: userId,
        activeExpires
      });
  } catch (err) {
    console.log(err);

    return null;
  }

  return {
    userId,
    sessionId,
    activeExpiresAt: activeExpiresDate,
  }
}

export async function createSessionCookie(session: Session | null) {
  let payload = "";

  if (session) {
    const createJWT = await createJWTBuilder();
    payload = await createJWT({ sessionId: session.sessionId }, {
      issuer: "susy",
      subject: session.userId,
      audiences: ["Susy's user"],
      expiresIn: new TimeSpan(1, "d"),
    });
  }

  return serializeCookie("susysession", payload, {
    expires: session?.activeExpiresAt ?? new Date(0),
    maxAge: 60 * 60 * 24,
    path: "/",
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
  });
}

export async function invalidateSession(sessionId: string) {
  try {
    await db
      .delete(userSessions)
      .where(eq(userSessions.id, sessionId));
    
    return true;
  } catch (err) {
    console.log("[INVALIDATE_SESSION]: Failed to invalidate session: ", err);

    return false;
  } 
}

export async function invalidateUserSessions(userId: string) {
  try {
    await db
      .delete(userSessions)
      .where(eq(userSessions.userId, userId));
    
    return true;
  } catch (err) {
    console.log("[INVALIDATE_USER_SESSIONS]: Failed to invalidate sessions: ", err);

    return false;
  }
}