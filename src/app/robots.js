import { getPublicEnv } from "@/config/env";

export default function robots() {
  const { siteUrl } = getPublicEnv();
  const base = siteUrl.replace(/\/$/, "");
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${base}/sitemap.xml`,
    host: base.replace(/^https?:\/\//, ""),
  };
}
