import { OAuth2Client } from "oslo/oauth2";

import { env } from "@/lib/server/env";

const authorizeEndpoint = "https://github.com/login/oauth/authorize";
const tokenEndpoint = "https://github.com/login/oauth/access_token";

export const client = new OAuth2Client(
  env.GITHUB_CLIENT_ID,
  authorizeEndpoint,
  tokenEndpoint,
  { redirectURI: env.GITHUB_CALLBACK_URL }
);

export async function getGithubUser(accessToken: string) {
  const res = await fetch("https://api.github.com/user", {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${accessToken}`,
      "X-GitHub-Api-Version": "2022-11-28"
    }
  });

  if (!res.ok) {
    console.log("[GET_GITHUB_USER]: Failed to fetch user data");
    return null;
  }

  return await res.json() as { id: number, login: string };
}

export async function getGithubUserEmail(accessToken: string) {
  const res = await fetch("https://api.github.com/user/emails", {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${accessToken}`,
      "X-GitHub-Api-Version": "2022-11-28"
    }
  });

  if (!res.ok) {
    console.log("[GET_GITHUB_USER_EMAIL]: Failed to fetch user emails");
    return null;
  }

  const emails = await res.json() as { email: string, primary: boolean }[];

  return emails.find(email => email.primary);
}