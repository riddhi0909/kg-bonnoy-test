/**
 * WPGraphQL `MenuLocationEnum` value for your theme (e.g. PRIMARY, SECONDARY).
 * Match what appears in GraphiQL under Menu Locations, or try PRIMARY first.
 */
export function getMenuLocation() {
  return (
    process.env.WP_MENU_LOCATION ||
    process.env.NEXT_PUBLIC_WP_MENU_LOCATION ||
    "PRIMARY"
  );
}
