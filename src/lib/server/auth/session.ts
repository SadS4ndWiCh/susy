import "server-only";

import { eq } from "drizzle-orm";
import { format, isBefore } from "date-fns";
import { TimeSpan } from "oslo";
import { serializeCookie } from "oslo/cookie";
import { init } from "@paralleldrive/cuid2";

import { env } from "@/lib/server/env";
import { db } from "@/lib/server/db/connection";
import { userSessions } from "@/lib/server/db/schemas";
import { createJWTBuilder } from "@/lib/server/auth/jwt";
import { getUserSession } from "@/lib/server/db/queries/session";

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
const ACTIVE_EXPIRES_DAYS = 4;
const ACTIVE_EXPIRES_DURATION = DAYS_IN_MILISECONDS * ACTIVE_EXPIRES_DAYS;
const IDLE_EXPIRES_DURATION = ACTIVE_EXPIRES_DURATION * 2;
export const SESSION_COOKIE_NAME = "susysession";

function formatTimestamp(date: Date) {
  return format(date, "yyyy-MM-dd HH:mm:ss");
}

export async function createSession(userId: string): Promise<Session | null> {
  const activeExpiresAt = new Date(Date.now() + ACTIVE_EXPIRES_DURATION);
  const idleExpiresAt = new Date(Date.now() + IDLE_EXPIRES_DURATION);

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
    console.log("[CREATE_SESSION] Failed to create session: ", err);

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
    payload = await createJWT(
      { sessionId: session.sessionId, userId: session.userId },
      {
        issuer: "susy",
        subject: session.userId,
        audiences: ["Susy's user"],
        expiresIn: new TimeSpan(ACTIVE_EXPIRES_DAYS, "d"),
      }
    );
  }

  return serializeCookie(SESSION_COOKIE_NAME, payload, {
    expires: session?.activeExpiresAt ?? new Date(0),
    maxAge: session?.activeExpiresAt ? IDLE_EXPIRES_DURATION / 1000 : 0,
    path: "/",
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
  });
}

export async function getSession(sessionId: string): Promise<Session | null> {
  try {
    const session = await getUserSession.all({ sessionId });
    
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

export async function validateSession(sessionId: string): Promise<Session | null> {
  let session = await getSession(sessionId);
  if (!session) return null;

  if (session.state === "dead") return null;
  if (session.state === "active") return session;

  const activeExpiresAt = new Date(Date.now() + ACTIVE_EXPIRES_DURATION);
  const idleExpiresAt = new Date(Date.now() + IDLE_EXPIRES_DURATION);

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