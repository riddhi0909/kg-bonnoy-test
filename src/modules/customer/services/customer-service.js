import { VIEWER } from "@/modules/customer/api/queries";

/**
 * @param {import('@apollo/client').ApolloClient} client
 */
export async function fetchViewer(client) {
  const { data, errors } = await client.query({
    query: VIEWER,
    fetchPolicy: "network-only",
  });
  if (errors?.length) return null;
  return data?.viewer ?? null;
}
