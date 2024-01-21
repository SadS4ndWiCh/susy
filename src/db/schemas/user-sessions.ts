import { relations } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { users } from ".";

export const userSessions = sqliteTable("user_sessions", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id", { length: 15 }).notNull(),
  activeExpires: text("active_expires").notNull(),
  idleExpires: text("idle_expires").notNull()
});

export const userSessionsRelations = relations(userSessions, ({ one }) => ({
  user: one(users, {
    fields: [userSessions.userId],
    references: [users.id]
  })
}));