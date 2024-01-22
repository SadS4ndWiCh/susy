import { relations } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { users } from ".";

export const userKeys = sqliteTable("user_keys", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id", { length: 15 }).notNull(),
  hashedPassword: text("hashed_password"),
});

export const userKeysRelations = relations(userKeys, ({ one }) => ({
  user: one(users, {
    fields: [userKeys.userId],
    references: [users.id]
  })
}));