import { env } from "@/env";
import type { Config } from "drizzle-kit";

export default {
  out: ".drizzle",
  schema: "src/db/schemas",
  driver: "turso",
  dbCredentials: {
    url: env.DATABASE_URL,
    authToken: env.DATABASE_AUTH_TOKEN
  }
} satisfies Config;