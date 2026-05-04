import { NextResponse } from "next/server";
import { getServerWpGraphqlUrl } from "@/config/env";

/**
 * Example mutation — align with WPGraphQL + WooCommerce Customer registration extension.
 */
const REGISTER_MUTATION = `
  mutation Register($email: String!, $username: String!, $password: String!) {
    registerUser(
      input: {
        username: $username
        email: $email
        password: $password
      }
    ) {
      user { id databaseId email username }
    }
  }
`;

export async function POST(request) {
  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { email, username, password } = payload;
  if (!email || !username || !password) {
    return NextResponse.json(
      { error: "email, username, password required" },
      { status: 400 },
    );
  }

  const gqlRes = await fetch(getServerWpGraphqlUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: REGISTER_MUTATION,
      variables: { email, username, password },
    }),
    cache: "no-store",
  });

  const gqlJson = await gqlRes.json();
  if (gqlJson?.errors?.length) {
    return NextResponse.json(
      { error: gqlJson.errors[0].message, graphql: gqlJson },
      { status: 400 },
    );
  }

  return NextResponse.json({ ok: true, data: gqlJson.data });
}
