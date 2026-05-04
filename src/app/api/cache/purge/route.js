import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

/** Must match `tags` passed to `unstable_cache` in server pages. */
const DEFAULT_CACHE_TAGS = ["home-page", "category-page"];

function unauthorized() {
  return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
}

/**
 * On-demand cache invalidation for `unstable_cache` entries tagged on the server.
 *
 * GET /api/cache/purge?secret=YOUR_SECRET&tags=home-page,category-page
 *
 * Configure `CACHE_REVALIDATE_SECRET` in the environment (do not commit real secrets).
 */
export async function GET(request) {
  const expected = process.env.CACHE_REVALIDATE_SECRET;
  if (!expected) {
    return NextResponse.json(
      {
        ok: false,
        error: "Server misconfiguration: CACHE_REVALIDATE_SECRET is not set",
      },
      { status: 500 },
    );
  }

  const url = new URL(request.url);
  const secret = url.searchParams.get("secret") ?? "";
  if (secret !== expected) return unauthorized();

  const tagsParam = url.searchParams.get("tags");
  const tags = tagsParam
    ? tagsParam
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : DEFAULT_CACHE_TAGS;

  for (const tag of tags) {
    revalidateTag(tag, "max");
  }

  return NextResponse.json({
    ok: true,
    revalidatedTags: tags,
    profile: "max",
  });
}
