import { eq, sql } from "drizzle-orm";

import { db } from "../connection";
import { userSessions } from "../schemas";

export const getUserSession = db
  .select()
  .from(userSessions)
  .where(eq(userSessions.id, sql.placeholder("sessionId")))
  .limit(1)
  .prepare();