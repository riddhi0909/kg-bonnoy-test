import { NextResponse } from "next/server";
import { getServerWpGraphqlUrl } from "@/config/env";

const LOGIN_MUTATION = `
  mutation Login($username: String!, $password: String!) {
    login(input: { username: $username, password: $password }) {
      authToken
      refreshToken
      user { id databaseId username }
    }
  }
`;

/**
 * WordPress WPGraphQL JWT: adjust field names to match your plugin schema.
 * @param {import('next/server').NextRequest} request
 */
export async function POST(request) {
  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { username, password } = payload;
  if (!username || !password) {
    return NextResponse.json(
      { error: "username and password required" },
      { status: 400 },
    );
  }

  const gqlRes = await fetch(getServerWpGraphqlUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: LOGIN_MUTATION,
      variables: { username, password },
    }),
    cache: "no-store",
  });

  const gqlJson = await gqlRes.json();
  const token = gqlJson?.data?.login?.authToken;
  const errors = gqlJson?.errors;

  if (errors?.length || !token) {
    return NextResponse.json(
      { error: errors?.[0]?.message || "Login failed", graphql: gqlJson },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
