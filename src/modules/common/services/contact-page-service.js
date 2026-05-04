import { getClient } from "@/apollo/register-client";
import { GET_CONTACT_PAGE_BY_URI } from "@/modules/common/api/queries";

function normalizeUri(uri) {
  const value = String(uri || "").trim();
  if (!value) return "/";
  const withLeadingSlash = value.startsWith("/") ? value : `/${value}`;
  return withLeadingSlash.endsWith("/") ? withLeadingSlash : `${withLeadingSlash}/`;
}

export async function fetchContactPageByUri(uri) {
  const client = getClient();
  const normalizedUri = normalizeUri(uri);

  const pageRes = await client.query({
    query: GET_CONTACT_PAGE_BY_URI,
    variables: { uriId: normalizedUri },
    fetchPolicy: "no-cache",
  });

  const data = pageRes?.data;
  const errors = [...(pageRes?.errors ?? [])];

  if (errors.length) {
    throw new Error(errors.map((error) => error.message).join(", "));
  }

  return {
    acf: data?.page?.contactPageAcfFiled ?? null,
  };
}

export async function fetchContactPageConfigByUri(uri) {
  const pageData = await fetchContactPageByUri(uri).catch(() => null);
  const acf = pageData?.acf ?? null;

  const showContactSection =
    acf?.showContactSection !== false && acf?.showContactSection !== "No";

  return {
    raw: acf,
    contactSection: {
      show: showContactSection,
      contactPrefix: acf?.contactPrefix,
      contactTitle: acf?.contactTitle,
      contactDescription: acf?.contactDescription,
      contactIframe: acf?.contactIframe,
    },
  };
}
