import { GET_CUSTOMER_ORDERS } from "@/modules/order/api/queries";

/**
 * @param {import('@apollo/client').ApolloClient} client
 * @param {number | string} customerDatabaseId
 * @param {number} [first]
 */
export async function fetchCustomerOrders(client, customerDatabaseId, first = 20) {
  const { data, errors } = await client.query({
    query: GET_CUSTOMER_ORDERS,
    variables: { customerId: String(customerDatabaseId), first },
    fetchPolicy: "network-only",
  });
  if (errors?.length) throw new Error(errors.map((e) => e.message).join(", "));
  return data?.customer?.orders?.nodes ?? [];
}
