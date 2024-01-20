import { config } from "dotenv";
config({ path: ".env.local" });

import type { Config } from "drizzle-kit";

export default {
  out: ".drizzle",
  schema: "src/db/schemas",
  driver: "turso",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    authToken: process.env.DATABASE_AUTH_TOKEN!
  }
} satisfies Config;