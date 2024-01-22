import { eq, sql } from "drizzle-orm";

import { db } from "../connection";
import { userKeys } from "../schemas";

export const getUserKey = db
  .select({
    userId: userKeys.userId,
    hashedPassword: userKeys.hashedPassword
  })
  .from(userKeys)
  .where(eq(userKeys.id, sql.placeholder("key")))
  .limit(1)
  .prepare();