import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getServerWpGraphqlUrl } from "@/config/env";

/**
 * BFF: forwards GraphQL to WordPress and attaches JWT from httpOnly cookie.
 * 
 */
export async function POST(request) {
  const body = await request.text();
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  const wcSession = cookieStore.get("wc_session")?.value;
  const upstream = getServerWpGraphqlUrl();

  function asWooSessionHeaderValue(rawToken) {
    if (!rawToken) return null;
    return rawToken.startsWith("Session ") ? rawToken : `Session ${rawToken}`;
  }

  async function forward(withSession) {
    const wcHeader = asWooSessionHeaderValue(withSession);
    const res = await fetch(upstream, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(wcHeader ? { "woocommerce-session": wcHeader } : {}),
      },
      body,
      cache: "no-store",
    });
    const text = await res.text();
    return { res, text };
  }

  let { res, text } = await forward(wcSession);
  let parsed = null;
  try {
    parsed = JSON.parse(text);
  } catch {
    parsed = null;
  }

  const hasSessionDecodeError = Boolean(
    parsed?.errors?.some((e) =>
      String(e?.message || "").toLowerCase().includes("failed to decode session token"),
    ),
  );

  // Recover automatically from stale/invalid Woo session token.
  if (hasSessionDecodeError) {
    ({ res, text } = await forward(undefined));
  }

  const response = new NextResponse(text, {
    status: res.status,
    headers: { "Content-Type": res.headers.get("Content-Type") || "application/json" },
  });
  const nextWcSession = res.headers.get("woocommerce-session");
  if (nextWcSession) {
    response.cookies.set("wc_session", nextWcSession, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
  } else if (hasSessionDecodeError) {
    response.cookies.delete("wc_session");
  }
  return response;
}
