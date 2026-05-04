/** Initial SSR + first client fetch when changing filter */
export const ACHIEVEMENTS_LIST_PAGE_SIZE = 10;

/** Each infinite-scroll load-more request */
export const ACHIEVEMENTS_SCROLL_PAGE_SIZE = 5;

/** IntersectionObserver rootMargin — larger = AJAX fires farther before reaching list bottom */
export const ACHIEVEMENTS_SCROLL_PREFETCH_MARGIN = "500px";

/**
 * WPGraphQL may not expose `taxQuery` on this CPT — tag filter pools posts in chunks.
 * Raise if catalogue exceeds filtered window.
 */
export const ACHIEVEMENTS_TAG_FILTER_POOL_CAP = 1000;
