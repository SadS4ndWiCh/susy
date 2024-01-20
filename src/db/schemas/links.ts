import { relations, sql } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { users } from "./users";

export const links = sqliteTable("links", {
  id: text("id", { length: 15 }).notNull().primaryKey(),
  ownerId: text("owner_id", { length: 15 }).notNull(),
  url: text("url", { length: 255 }).notNull(),
  susLink: text("sus_link", { length: 255 }).notNull(),
  expiresAt: text("expires_at").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`)
});

export const linksRelations = relations(links, ({ one }) => ({
  owner: one(users, {
    fields: [links.ownerId],
    references: [users.id]
  })
}));