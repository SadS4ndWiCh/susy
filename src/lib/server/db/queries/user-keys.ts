import { eq, sql } from "drizzle-orm";

import { db } from "../connection";
import { userKeys } from "../schemas";

export const getUserKey = db
  .select()
  .from(userKeys)
  .where(eq(userKeys.id, sql.placeholder("keyId")))
  .limit(1)
  .prepare();