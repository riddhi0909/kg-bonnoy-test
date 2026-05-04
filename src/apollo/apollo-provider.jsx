"use client";

import { ApolloNextAppProvider } from "@apollo/client-integration-nextjs";
import { createApolloClient } from "@/apollo/apollo-client-factory";

function makeClient() {
  return createApolloClient();
}

/**
 * @param {{ children: import('react').ReactNode }} props
 */
export function ApolloProvider({ children }) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}
