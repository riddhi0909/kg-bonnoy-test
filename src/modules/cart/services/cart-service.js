import { GET_CART } from "@/modules/cart/api/queries";

/**
 * @param {import('@apollo/client').ApolloClient} client
 */
export async function fetchCart(client) {
  const { data, errors } = await client.query({
    query: GET_CART,
    fetchPolicy: "network-only",
  });
  if (errors?.length) throw new Error(errors.map((e) => e.message).join(", "));
  return data?.cart ?? null;
}
