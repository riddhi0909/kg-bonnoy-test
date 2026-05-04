import { ApolloLink, HttpLink } from "@apollo/client";
import { ApolloClient, InMemoryCache } from "@apollo/client-integration-nextjs";
import { getServerWpGraphqlUrl, getPublicEnv } from "@/config/env";

/** @returns {import('@apollo/client/cache').TypePolicies} */
function typePolicies() {
  return {
    Query: {
      fields: {
        products: {
          keyArgs: ["where", "orderby"],
          merge(_, incoming) {
            return incoming;
          },
        },
      },
    },
  };
}


/**
 * @param {object} [opts]
 * @param {string} [opts.uri] GraphQL HTTP endpoint
 * @param {Record<string, string>} [opts.headers]
 * @param {RequestCache} [opts.fetchCache] Next fetch cache mode for link
 * @returns {import('@apollo/client').ApolloClient}
 */
export function createApolloClient(opts = {}) {
  const publicEnv = getPublicEnv();
  const uri =
    opts.uri ??
    (typeof window === "undefined"
      ? getServerWpGraphqlUrl()
      : publicEnv.useGraphqlProxy
        ? "/api/graphql"
        : publicEnv.wpGraphqlUrl);


  const http = new HttpLink({
    uri,
    credentials: publicEnv.useGraphqlProxy ? "same-origin" : "omit",
    headers: opts.headers,
    fetchOptions:
      typeof window === "undefined" && opts.fetchCache
        ? { cache: opts.fetchCache }
        : undefined,
  });


  return new ApolloClient({
    cache: new InMemoryCache({ typePolicies: typePolicies() }),
    link: ApolloLink.from([http]),
    defaultOptions: {
      watchQuery: { fetchPolicy: "no-cache" },
      query: { fetchPolicy: "no-cache" },
    },
  });
}
