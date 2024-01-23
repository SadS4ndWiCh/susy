import "server-only";

import { eq } from "drizzle-orm";
import { init } from "@paralleldrive/cuid2";

import { db } from "@/lib/server/db/connection";
import { getUserKey } from "@/lib/server/db/queries/user-keys";
import { userKeys, userSessions, users } from "@/lib/server/db/schemas";

import type { UpdatableAttributes, User, UserAttributes } from "@/lib/shared/validations/users";

import { hashPassword, validatePassword } from "./password";

type UserKey = {
  id: string;
  userId: string;
  hashedPassword?: string | null;
}

type CreateUserOptions = {
  key: {
    providerId: string;
    providerUserId: string;
    password?: string;
  },
  attributes: UserAttributes,
}

const createId = init({ length: 15 });

export async function createUser({ key, attributes }: CreateUserOptions) {
  const userId = createId();

  return await db.transaction(async tx => {
    let user: User[] = [];

    try {
      user = await tx
        .insert(users)
        .values({
          id: userId,
          username: attributes.username,
          email: attributes.email
        })
        .returning();
    } catch (err) {
      console.log("[CREATE_USER]: Failed to insert user in database: ", err);
      return null;
    }

    const keyValues = {
      id: `${key.providerId}:${key.providerUserId}`,
      userId,
    };

    if (key.password) {
      Object.assign(keyValues, {
        hashedPassword: await hashPassword(key.password)
      });
    }

    try {
      await tx
        .insert(userKeys)
        .values(keyValues);
    } catch (err) {
      console.log("[CREATE_USER]: Failed to insert user key in database: ", err);
      return null;
    }

    return user[0];
  });
}

export async function getKey(id: string, userId: string, password: string | null = null) { 
  let key: UserKey[] = [];

  try {
    key = await getUserKey.all({ keyId: `${id}:${userId}` });
  } catch (err) {
    console.log("[USE_KEY]: Failed to get user key: ", err);

    return null;
  }

  if (key.length === 0) {
    console.log("[USE_KEY]: Not found user key");

    return null;
  }

  if (!key[0].hashedPassword) return key[0];
  else if (!password) {
    console.log(`[USE_KEY]: Key ${id} requires password`);

    return null;
  }

  const isPasswordCorrect = await validatePassword(key[0].hashedPassword, password);
  if (!isPasswordCorrect) {
    console.log("[USE_KEY]: Invalid password");

    return null;
  }

  return key[0];
}

export async function deleteUser(userId: string) {
  await db.transaction(async tx => {
    try {
      await tx
        .delete(userSessions)
        .where(eq(userSessions.userId, userId));
    } catch (err) {
      console.log("[DELETE_USER]: Failed to delete user sessions: ", err);
      tx.rollback();

      return;
    }

    try {
      await tx
        .delete(userKeys)
        .where(eq(userKeys.userId, userId));
    } catch (err) {
      console.log("[DELETE_USER]: Failed to delete user keys: ", err);
      tx.rollback();

      return;
    }

    try {
      await tx
        .delete(users)
        .where(eq(users.id, userId));
    } catch (err) {
      console.log("[DELETE_USER]: Failed to delete user: ", err);
      tx.rollback();

      return;
    }
  });
}

export async function updateUserAttributes(userId: string, attributes: UpdatableAttributes) {
  try {
    const result = await db
      .update(users)
      .set(attributes)
      .where(eq(users.id, userId));
    
    if (result.rowsAffected === 0) {
      console.log(`[UPDATE_USER_ATTRIBUTES]: Not found user with id ${userId}`);
    }
  } catch (err) {
    console.log("[UPDATE_USER_ATTRIBUTES]: Failed to update user attributes: ", err);
  }
}