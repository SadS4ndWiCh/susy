import { sql } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const links = sqliteTable("links", {
  id: text("id", { length: 15 }).notNull().primaryKey(),
  url: text("url", { length: 255 }).notNull(),
  susLink: text("sus_link", { length: 255 }).notNull(),
  expiresAt: text("expires_at").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`)
});