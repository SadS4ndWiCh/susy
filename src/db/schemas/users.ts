import { relations } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { links } from ".";

export const users = sqliteTable("users", {
  id: text("id", { length: 15 }).notNull().primaryKey(),
  username: text("username", { length: 64 }).notNull(),
  email: text("email", { length: 255 }).notNull().unique(),
  createdAt: text("created_at").notNull().default("CURRENT_TIMESTAMP")
});

export const usersRelations = relations(users, ({ many }) => ({
  links: many(links)
}));