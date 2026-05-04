import { getClient } from "@/apollo/register-client";
import {
  GET_TERMS_OF_USE_PAGE_BY_URI,
} from "@/modules/terms-of-use/api/queries";

function normalizeUri(uri) {
  const value = String(uri || "").trim();
  if (!value) return "/";
  const withLeadingSlash = value.startsWith("/") ? value : `/${value}`;
  return withLeadingSlash.endsWith("/") ? withLeadingSlash : `${withLeadingSlash}/`;
}

export async function fetchTermsOfUsePageByUri(uri) {
  const client = getClient();
  const normalizedUri = normalizeUri(uri);

  const [pageRes] = await Promise.all([
    client.query({
      query: GET_TERMS_OF_USE_PAGE_BY_URI,
      variables: { uriId: normalizedUri },
      fetchPolicy: "no-cache",
    })
  ]);

  const data = pageRes?.data;
  const errors = [
    ...(pageRes?.errors ?? []),
  ];

  if (errors?.length) {
    throw new Error(errors.map((error) => error.message).join(", "));
  }

  return {
    acf: data?.page?.termsOfUsePageAcfField ?? null,
  };
}

export async function fetchTermsOfUsePageConfigByUri(uri, fallback = {}) {
  const pageData = await fetchTermsOfUsePageByUri(uri).catch(() => null);
  const acf = pageData?.acf ?? null;

  const showPageHeroSection =
    acf?.showPageHeroSection !== false && acf?.showPageHeroSection !== "No";

  const showTermsInfoSection =
    acf?.showTermsInfoSection !== false && acf?.showTermsInfoSection !== "No";

  return {
    raw: acf,
    pageHeroSection: {
      show: showPageHeroSection,
      title: acf?.pageHeroTitle,
      image: acf?.pageHeroImage?.node?.sourceUrl,
      backUrl: acf?.pageBackUrl,
    },
    termsInformationSection: {
      show: showTermsInfoSection,
      termsInformation: acf?.termsInformation,
      lastUpdateDate: acf?.lastUpdateDate,
    },
  };
}
