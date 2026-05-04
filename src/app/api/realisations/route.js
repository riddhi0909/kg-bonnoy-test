import { NextResponse } from "next/server";
import { fetchAchievementPostsPage } from "@/modules/realisations/services/realisations-page-service";
import { ACHIEVEMENTS_LIST_PAGE_SIZE } from "@/modules/realisations/constants";

const MAX_FIRST = ACHIEVEMENTS_LIST_PAGE_SIZE;

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  let first = Number.parseInt(String(searchParams.get("first") ?? ""), 10);
  if (!Number.isFinite(first) || first < 1) first = ACHIEVEMENTS_LIST_PAGE_SIZE;
  if (first > MAX_FIRST) first = MAX_FIRST;

  const after = searchParams.get("after") || null;
  const tagSlugRaw = searchParams.get("tag");
  const tagSlug =
    typeof tagSlugRaw === "string" && tagSlugRaw.trim() ? tagSlugRaw.trim() : null;

  const offsetRaw = searchParams.get("offset");
  let offset = 0;
  if (typeof offsetRaw === "string" && offsetRaw.trim()) {
    const n = Number.parseInt(offsetRaw.trim(), 10);
    if (Number.isFinite(n) && n >= 0) offset = n;
  }

  try {
    const payload = await fetchAchievementPostsPage({ first, after, tagSlug, offset });
    return NextResponse.json(payload);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to load achievements";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
