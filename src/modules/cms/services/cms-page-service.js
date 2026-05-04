import {
  GET_HOME_OPTIONS,
  GET_PAGE_BY_URI,
  GET_PAGES,
  GET_POST_BY_SLUG,
  GET_POSTS,
  GET_ACHIEVEMENTS_POSTS,

} from "@/modules/cms/api/queries";
/**
 * @param {import('@apollo/client').ApolloClient} client
 * @param {string} uri e.g. "/about/" or "/legal/privacy/"
 */
export async function fetchPageByUri(client, uri) {
  const normalized = uri.startsWith("/") ? uri : `/${uri}`;
  const uriText = normalized.endsWith("/") ? normalized : `${normalized}/`;
  const { data, errors } = await client.query({
    query: GET_PAGE_BY_URI,
    variables: {
      uriId: uriText,
      uriText,
    },
    fetchPolicy: "no-cache",
  });

  if (errors?.length) throw new Error(errors.map((e) => e.message).join(", "));
  return data?.page ?? data?.nodeByUri ?? null;
}

/**
 * @param {import('@apollo/client').ApolloClient} client
 * @param {number} [first=12]
 */
export async function fetchPosts(client, first = 12) {
  const { data, errors } = await client.query({
    query: GET_POSTS,
    variables: { first },
    fetchPolicy: "no-cache",
  });
  if (errors?.length) throw new Error(errors.map((e) => e.message).join(", "));
  return data?.posts?.nodes ?? [];
}

/**
 * @param {import('@apollo/client').ApolloClient} client
 * @param {string} slug
 */
export async function fetchPostBySlug(client, slug) {
  const { data, errors } = await client.query({
    query: GET_POST_BY_SLUG,
    variables: { slug },
    fetchPolicy: "no-cache",
  });
  if (errors?.length) throw new Error(errors.map((e) => e.message).join(", "));
  return data?.post ?? null;
}

export async function fetchPages(client) {
  const { data, errors } = await client.query({
    query: GET_PAGES,
    fetchPolicy: "no-cache",
  });
  if (errors?.length) throw new Error(errors.map((e) => e.message).join(", "));
  return data?.pages?.nodes ?? [];
}

/**
 * Fetch home options from ACF Options page "Homepage ACF Fields"
 * @param {import('@apollo/client').ApolloClient} client
 */
export async function fetchHomeOptions(client) {
  try {
    const result = await client.query({
      query: GET_HOME_OPTIONS,
      fetchPolicy: "no-cache",
    });
    const { data, errors } = result;
    if (errors?.length) throw new Error(errors.map((e) => e.message).join(", "));
    return data?.homeSettings?.homepageAcfFields ?? null;
  } catch (error) {

    throw error;
  }
}
export async function fetchAchievementPost(client) {
  const { data, errors } = await client.query({
    query: GET_ACHIEVEMENTS_POSTS,
    variables: { first: 10 },
    fetchPolicy: "no-cache",
  });
  if (errors?.length) throw new Error(errors.map((e) => e.message).join(", "));
  return data?.allAchievementsPost?.nodes ?? [];
}