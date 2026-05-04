import { getClient } from "@/apollo/register-client";
import {
  GET_THANKYOU_PAGE_BY_URI,
} from "@/modules/thankyou/api/queries";

function normalizeUri(uri) {
  const value = String(uri || "").trim();
  if (!value) return "/";
  const withLeadingSlash = value.startsWith("/") ? value : `/${value}`;
  return withLeadingSlash.endsWith("/") ? withLeadingSlash : `${withLeadingSlash}/`;
}

export async function fetchThankyouPageByUri(uri) {
  const client = getClient();
  const normalizedUri = normalizeUri(uri);

  const [pageRes] = await Promise.all([
    client.query({
      query: GET_THANKYOU_PAGE_BY_URI,
      variables: { uriId: normalizedUri },
      fetchPolicy: "no-cache",
    }),
  ]);

  const data = pageRes?.data;
  console.log(data , '---------------data');
  const errors = [
    ...(pageRes?.errors ?? []),
  ];

  if (errors?.length) {
    throw new Error(errors.map((error) => error.message).join(", "));
  }

  return {
    acf: data?.page?.thankYouPageAcfField ?? null,
  };


}

export async function fetchThankyouPageConfigByUri(uri, fallback = {}) {
  const pageData = await fetchThankyouPageByUri(uri).catch(() => null);
  const acf = pageData?.acf ?? null;
  
  const showThankYouSection =
    acf?.showThankYouSection !== false && acf?.showThankYouSection !== "No";

  const showTestimonialSection =
    acf?.showTestimonialSection !== false && acf?.showTestimonialSection !== "No";

    
  return {
    raw: acf,
    thankYouSection: {
      show: showThankYouSection,
      title: String(acf?.thankYouTitle ?? "").trim() || fallback.thankYouTitle || "",
      description: String(acf?.thankYouDescription ?? "").trim() || fallback.thankYouDescription || "",
      buttonTitle: String(acf?.thankYouButton?.title ?? "").trim() || fallback.thankYouButtonTitle || "",
      buttonLink: String(acf?.thankYouButton?.url ?? "").trim() || fallback.thankYouButtonLink || "",
      imageSrc: acf?.thankYouImage?.node?.sourceUrl || fallback.thankYouImage?.node?.sourceUrl || "",
      imageAlt: acf?.thankYouImage?.node?.altText || fallback.thankYouImage?.node?.altText || "",
    },
    testimonialSection: {
      show: showTestimonialSection,
    },
  };
}
