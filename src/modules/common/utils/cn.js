/**
 * Minimal className join (replace with clsx/tailwind-merge if you add the deps).
 * @param {...(string | false | null | undefined)} parts
 * @returns {string}
 */
export function cn(...parts) {
  return parts.filter(Boolean).join(" ");
}
