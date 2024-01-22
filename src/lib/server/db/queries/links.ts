import { eq, sql } from "drizzle-orm";

import { db } from "../connection";
import { links } from "../schemas";

export const getUserLinks = db
  .select()
  .from(links)
  .where(eq(links.ownerId, sql.placeholder("userId")))
  .prepare();