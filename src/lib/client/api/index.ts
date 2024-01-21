import { env } from "@/lib/client/env";

export async function api(route: string, init: RequestInit | undefined) {
  const url = new URL(route, env.NEXT_PUBLIC_API_BASE_URL);

  return fetch(url, init);
}