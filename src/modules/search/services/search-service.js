import { SEARCH_PRODUCTS } from "@/modules/search/api/queries";

/**
 * @param {import('@apollo/client').ApolloClient} client
 * @param {string} term
 * @param {number} [first]
 */
export async function fetchProductSearch(client, term, first = 12) {
  const { data, errors } = await client.query({
    query: SEARCH_PRODUCTS,
    variables: { search: term, first },
    fetchPolicy: "no-cache",
  });
  if (errors?.length) throw new Error(errors.map((e) => e.message).join(", "));
  return data?.products?.nodes ?? [];
}
