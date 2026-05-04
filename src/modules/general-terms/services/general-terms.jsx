import { getClient } from "@/apollo/register-client";
import {
  GET_GENERAL_TERMS_PAGE_BY_URI,
  GET_GLOBAL_ACF_FIELDS
} from "@/modules/general-terms/api/queries";

function normalizeUri(uri) {
  const value = String(uri || "").trim();
  if (!value) return "/";
  const withLeadingSlash = value.startsWith("/") ? value : `/${value}`;
  return withLeadingSlash.endsWith("/") ? withLeadingSlash : `${withLeadingSlash}/`;
}

export async function fetchGeneralTermsPageByUri(uri) {
  const client = getClient();
  const normalizedUri = normalizeUri(uri);

  const [pageRes, globalAcfRes] = await Promise.all([
    client.query({
      query: GET_GENERAL_TERMS_PAGE_BY_URI,
      variables: { uriId: normalizedUri },
      fetchPolicy: "no-cache",
    }),
    client.query({
      query: GET_GLOBAL_ACF_FIELDS,
      variables: { uriId: normalizedUri },
      fetchPolicy: "no-cache",
    }),
  ]);

  const data = pageRes?.data;
  const globalAcf = globalAcfRes?.data?.themeSettings?.globalAcfFields ?? null;
    const errors = [
    ...(pageRes?.errors ?? []),
    ...(globalAcf?.errors ?? []),
  ];

  if (errors?.length) {
    throw new Error(errors.map((error) => error.message).join(", "));
  }

  return {
    acf: data?.page?.generalTermsPageAcfField ?? null,
    globalAcf: globalAcf,
  };
}

export async function fetchGeneralTermsPageConfigByUri(uri, fallback = {}) {
  const pageData = await fetchGeneralTermsPageByUri(uri).catch(() => null);
  const acf = pageData?.acf ?? null;
  const globalAcf = pageData?.globalAcf ?? null;
  console.log(globalAcf , '---------------globalAcf');
  const showGeneralTermsSection =
    acf?.showGeneralTermsSection !== false && acf?.showGeneralTermsSection !== "No";

  const showTestimonialsSection =
    acf?.showTestimonialsSection !== false && acf?.showTestimonialsSection !== "No";

  return {
    raw: acf,
    generalTermsSection: {
      show: showGeneralTermsSection,
      title: acf?.generalTermsTitle,
      description: acf?.generalTermsDescription,
    },
    testimonialsSection: {
      show: showTestimonialsSection,
    },
  };
}
