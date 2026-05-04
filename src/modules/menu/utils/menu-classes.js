/**
 * @param {object} item
 * @param {string} token kebab-case class fragment
 */
export function menuItemHasClass(item, token) {
  const list = item?.cssClasses;
  if (!Array.isArray(list)) return false;
  return list.some((c) => typeof c === "string" && c.includes(token));
}
