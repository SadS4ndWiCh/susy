type Method = "GET" | "POST" | "PUT" | "DELETE";

async function baseApi(method: Method, route: string, init?: RequestInit) {
  const headers = new Headers(init?.headers);

  if (method !== "GET") headers.set("Content-Type", "application/json");

  return await fetch(route, {
    method,
    headers,
    ...init
  });
}

export const api = {
  get: baseApi.bind(null, "GET"),
  post: baseApi.bind(null, "POST"),
  put: baseApi.bind(null, "PUT"),
  delete: baseApi.bind(null, "DELETE")
}