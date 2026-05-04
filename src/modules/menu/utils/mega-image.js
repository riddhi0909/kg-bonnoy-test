/**
 * @param {object} item MenuItem from WPGraphQL
 * @returns {{ src: string; alt: string } | null}
 */
export function megaMenuImageFromItem(item) {
  const co = item?.connectedObject;
  if (!co) return imageFromDescription(item?.description);

  if (co.sourceUrl) {
    return { src: co.sourceUrl, alt: co.altText || item.label || "" };
  }
  const img = co.featuredImage?.node;
  if (img?.sourceUrl) {
    return { src: img.sourceUrl, alt: img.altText || item.label || "" };
  }
  return imageFromDescription(item?.description);
}

/**
 * @param {string | null | undefined} description HTML or bare image URL
 */
function imageFromDescription(description) {
  if (!description || typeof description !== "string") return null;
  const m = description.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (m) return { src: m[1], alt: "" };
  const t = description.trim();
  if (/^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)(\?.*)?$/i.test(t)) {
    return { src: t, alt: "" };
  }
  return null;
}
