import { getMenuLocation } from "@/config/menu";
import {
  GET_HEADER_ANNOUNCEMENT,
  GET_MENU_BY_LOCATION_BASIC,
  GET_MENU_BY_LOCATION,
  GET_MENU_BY_NAME_BASIC,
  GET_MENU_BY_NAME,
} from "@/modules/menu/api/queries";

/**
 * Top-level items only.
 * @param {object[]} nodes
 */
function filterTopLevel(nodes) {
  if (!nodes?.length) return [];
  return nodes.filter((n) => {
    const p = n.parentId;
    return p == null || p === 0 || p === "0";
  });
}

/**
 * @param {import('@apollo/client').ApolloClient} client
 * @param {string} name
 */
async function fetchByName(client, name) {
  const common = {
    variables: { id: name },
    fetchPolicy: "no-cache",
  };
  try {
    const { data, errors } = await client.query({
      query: GET_MENU_BY_NAME,
      ...common,
    });
    if (errors?.length) throw new Error(errors.map((e) => e.message).join(", "));
    const nodes = data?.menu?.menuItems?.nodes ?? [];
    return filterTopLevel(nodes);
  } catch {
    const { data, errors } = await client.query({
      query: GET_MENU_BY_NAME_BASIC,
      ...common,
    });
    if (errors?.length) throw new Error(errors.map((e) => e.message).join(", "));
    const nodes = data?.menu?.menuItems?.nodes ?? [];
    return filterTopLevel(nodes);
  }
}

/**
 * @param {import('@apollo/client').ApolloClient} client
 * @param {string} location
 * @param {number} first
 */
async function fetchByLocation(client, location, first) {
  const common = {
    variables: { location, first },
    fetchPolicy: "no-cache",
  };
  try {
    const { data, errors } = await client.query({
      query: GET_MENU_BY_LOCATION,
      ...common,
    });
    if (errors?.length) throw new Error(errors.map((e) => e.message).join(", "));
    const nodes = data?.menuItems?.nodes ?? [];
    return filterTopLevel(nodes);
  } catch {
    const { data, errors } = await client.query({
      query: GET_MENU_BY_LOCATION_BASIC,
      ...common,
    });
    if (errors?.length) throw new Error(errors.map((e) => e.message).join(", "));
    const nodes = data?.menuItems?.nodes ?? [];
    return filterTopLevel(nodes);
  }
}

/**
 * Load header nav from WordPress (Appearance → Menus).
 * Prefer `WP_MENU_NAME` (e.g. Header Menu) or `WP_MENU_LOCATION` (GraphQL MenuLocationEnum).
 *
 * @param {import('@apollo/client').ApolloClient} client
 * @param {{ first?: number; menuName?: string | null; location?: string | null }} [opts]
 */
export async function fetchHeaderMenu(client, opts = {}) {
  const first = opts.first ?? 100;
  const menuName = opts.menuName ?? process.env.WP_MENU_NAME?.trim() ?? null;
  const locEnv = opts.location ?? process.env.WP_MENU_LOCATION?.trim() ?? null;
  // Strict behavior:
  // - if a menu name is configured, use only this exact name
  // - else if a location is configured, use only this exact location
  // - else use broad fallbacks
  if (menuName) {
    try {
      return await fetchByName(client, menuName);
    } catch {
      return [];
    }
  }

  if (locEnv) {
    try {
      return await fetchByLocation(client, locEnv, first);
    } catch {
      return [];
    }
  }

  /** @type {Array<() => Promise<object[]>>} */
  const attempts = [];
  for (const n of ["Header Menu", "header-menu"]) {
    attempts.push(() => fetchByName(client, n));
  }
  for (const loc of [getMenuLocation(), "PRIMARY", "HEADER_MENU", "MAIN", "HEADER"]) {
    if (loc) attempts.push(() => fetchByLocation(client, loc, first));
  }
  for (const run of attempts) {
    try {
      const items = await run();
      if (items.length) return items;
    } catch {
      /* next */
    }
  }
  return [];
}

/**
 * Load footer nav from WordPress menu (Appearance -> Menus).
 * Prefer `WP_FOOTER_MENU_NAME` or `WP_FOOTER_MENU_LOCATION`.
 *
 * @param {import('@apollo/client').ApolloClient} client
 * @param {{ first?: number; menuName?: string | null; location?: string | null }} [opts]
 */
export async function fetchFooterMenu(client, opts = {}) {
  const first = opts.first ?? 100;
  const menuName =
    opts.menuName ?? process.env.WP_FOOTER_MENU_NAME?.trim() ?? null;
  const locEnv = opts.location ?? process.env.WP_FOOTER_MENU_LOCATION?.trim() ?? null;
  // Strict behavior:
  // - if a menu name is configured, use only this exact name
  // - else if a location is configured, use only this exact location
  // - else use broad fallbacks
  if (menuName) {
    try {
      return await fetchByName(client, menuName);
    } catch {
      return [];
    }
  }

  if (locEnv) {
    try {
      return await fetchByLocation(client, locEnv, first);
    } catch {
      return [];
    }
  }

  /** @type {Array<() => Promise<object[]>>} */
  const attempts = [];
  for (const n of ["Footer Menu", "footer-menu", "Footer"]) {
    attempts.push(() => fetchByName(client, n));
  }
  for (const loc of ["FOOTER", "SECONDARY", "BOTTOM", "MENU_2"]) {
    attempts.push(() => fetchByLocation(client, loc, first));
  }
  for (const run of attempts) {
    try {
      const items = await run();
      if (items.length) return items;
    } catch {
      /* next */
    }
  }
  return [];
}

/**
 * Top bar text from a WP page (slug in WP_ANNOUNCEMENT_PAGE_SLUG), else NEXT_PUBLIC_TOP_BAR_TEXT.
 * Page can contain HTML; first image or paragraph text is used.
 *
 * @param {import('@apollo/client').ApolloClient} client
 */
export async function fetchHeaderAnnouncement(client) {
  const fallback = process.env.NEXT_PUBLIC_TOP_BAR_TEXT?.trim();
  const slug =
    process.env.WP_ANNOUNCEMENT_PAGE_SLUG?.trim() || "header-announcement";

  try {
    const { data, errors } = await client.query({
      query: GET_HEADER_ANNOUNCEMENT,
      variables: { id: slug },
      fetchPolicy: "no-cache",
    });
    if (errors?.length) return fallback || null;
    const html = data?.page?.content;
    if (!html || typeof html !== "string") return fallback || null;
    const text = html
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return text.slice(0, 200) || fallback || null;
  } catch {
    return fallback || null;
  }
}
