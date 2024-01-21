import "server-only";

import {
  createJWT as osloCreateJWT,
  validateJWT as osloValidateJWT,
  type JWTAlgorithm,
} from "oslo/jwt";

import { env } from "@/lib/server/env";

export async function createJWTBuilder() {
  const secret = new TextEncoder().encode(env.JWT_SECRET);

  return osloCreateJWT.bind(
    null,
    env.JWT_ALGORITHM as JWTAlgorithm,
    secret,
  );
}

export async function validateJWT(jwt: string) {
  const secret = new TextEncoder().encode(env.JWT_SECRET);

  try {
    return await osloValidateJWT(
      env.JWT_ALGORITHM as JWTAlgorithm,
      secret,
      jwt
    );
  } catch (err) {
    console.log("[JWTError] Failed to validate: ", err);

    return null;
  }
}