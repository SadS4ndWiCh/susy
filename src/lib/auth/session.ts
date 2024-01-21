import "server-only";

import { eq } from "drizzle-orm";
import { format, isBefore } from "date-fns";
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
  idleExpiresAt: Date;
  state: "active" | "idle" | "dead";
  fresh: boolean;
}

const createId = init({ length: 15 });
const DAYS_IN_MILISECONDS = 1000 * 60 * 60 * 24;

function formatTimestamp(date: Date) {
  return format(date, "yyyy-MM-dd HH:mm:ss");
}

export async function createSession(userId: string): Promise<Session | null> {
  const activeExpiresAt = new Date(Date.now() + (DAYS_IN_MILISECONDS * 4));
  const idleExpiresAt = new Date(Date.now() + (DAYS_IN_MILISECONDS * 7));

  const sessionId = createId();

  try {
    await db
      .insert(userSessions)
      .values({
        id: sessionId,
        userId: userId,
        activeExpires: formatTimestamp(activeExpiresAt),
        idleExpires: formatTimestamp(idleExpiresAt)
      });
  } catch (err) {
    console.log(err);

    return null;
  }

  return {
    userId,
    sessionId,
    activeExpiresAt,
    idleExpiresAt,
    state: "active",
    fresh: false
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

export async function getSession(sessionId: string): Promise<Session | null> {
  try {
    const session = await db
      .select()
      .from(userSessions)
      .where(eq(userSessions.id, sessionId));
    
    if (session.length === 0) return null;
    
    const now = new Date();
    const activeExpiresAt = new Date(session[0].activeExpires);
    const idleExpiresAt = new Date(session[0].idleExpires);

    return {
      sessionId,
      userId: session[0].userId,
      activeExpiresAt,
      idleExpiresAt,
      state: isBefore(idleExpiresAt, now)
        ? "dead"
        : isBefore(activeExpiresAt, now)
          ? "idle"
          : "active",
      fresh: false
    }
  } catch (err) {
    return null;
  }
}

export async function invalidateSession(sessionId: string) {
  try {
    await db
      .delete(userSessions)
      .where(eq(userSessions.id, sessionId));
    
    console.log(`[INVALIDATE_SESSION]: Session ${sessionId} successfuly invalidated`);

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
    
    console.log("[INVALIDATE_USER_SESSIONS]: User sessions successfuly invalidated");

    return true;
  } catch (err) {
    console.log("[INVALIDATE_USER_SESSIONS]: Failed to invalidate sessions: ", err);

    return false;
  }
}

export async function validateSession(sessionId: string): Promise<Session | null> {
  let session = await getSession(sessionId);
  if (!session) return null;

  if (session.state === "dead") return null;
  if (session.state === "active") return session;

  const activeExpiresAt = new Date(Date.now() + (DAYS_IN_MILISECONDS * 4));
  const idleExpiresAt = new Date(Date.now() + (DAYS_IN_MILISECONDS * 7));

  try {
    const result = await db
      .update(userSessions)
      .set({
        activeExpires: formatTimestamp(activeExpiresAt),
        idleExpires: formatTimestamp(idleExpiresAt)
      })
      .where(eq(userSessions.id, sessionId));

    if (result.rowsAffected === 0) {
      console.log("[VALIDATE_SESSION]: Failed to fresh session.");

      return null
    };

    return {
      sessionId,
      userId: session.userId,
      activeExpiresAt,
      idleExpiresAt,
      state: "active",
      fresh: true
    }
  } catch (err) {
    console.log("[VALIDATE_SESSION]: Failed to validate session: ", err);

    return null;
  }
}