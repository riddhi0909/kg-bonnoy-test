import { getClient } from "@/apollo/register-client";
import {
  GET_PRESS_PAGE_BY_URI,
} from "@/modules/presse/api/queries";

function normalizeUri(uri) {
  const value = String(uri || "").trim();
  if (!value) return "/";
  const withLeadingSlash = value.startsWith("/") ? value : `/${value}`;
  return withLeadingSlash.endsWith("/") ? withLeadingSlash : `${withLeadingSlash}/`;
}

export async function fetchPressPageByUri(uri) {
  const client = getClient();
  const normalizedUri = normalizeUri(uri);

  const [pageRes] = await Promise.all([
    client.query({
      query: GET_PRESS_PAGE_BY_URI,
      variables: { uriId: normalizedUri },
      fetchPolicy: "no-cache",
    }),
  ]);

  const data = pageRes?.data;
  const errors = [
    ...(pageRes?.errors ?? []),
  ];

  if (errors?.length) {
    throw new Error(errors.map((error) => error.message).join(", "));
  }

  return {
    acf: data?.page?.pressPageAcfField ?? null,
  };
}

export async function fetchPressPageConfigByUri(uri, fallback = {}) {
  const pageData = await fetchPressPageByUri(uri).catch(() => null);
  const acf = pageData?.acf ?? null;

  const showTalkingAboutSection =
    acf?.showTalkingAboutSection !== false &&
    acf?.showTalkingAboutSection !== "No";
  const showPressSection =
    acf?.showPressSection !== false &&
    acf?.showPressSection !== "No";
  const showTheBrandSection =
    acf?.showTheBrandSection !== false &&
    acf?.showTheBrandSection !== "No";
  const showTestimonialsSection =
    acf?.showTestimonialsSection !== false &&
    acf?.showTestimonialsSection !== "No";
  return {
    raw: acf,
    talkingAboutSection: {
      show: showTalkingAboutSection,
      title: acf?.talkingAboutTitle,
      subHeading: acf?.talkingAboutSubHeading,
      articleList: acf?.articleList,
    },
    pressSection: {
      show: showPressSection,
      title: acf?.pressTitle,
      subHeading: acf?.pressSubHeading,
      description: acf?.pressDescription,
      image: acf?.pressImage?.node?.sourceUrl,
      imageAlt: acf?.pressImage?.node?.altText,
    },
    theBrandSection: {
      show: showTheBrandSection,
      title: acf?.theBrandTitle,
      subHeading: acf?.theBrandSubHeading,
      description: acf?.theBrandDescription,
      image: acf?.theBrandImage?.node?.sourceUrl,
      imageAlt: acf?.theBrandImage?.node?.altText,
      buttonTitle: acf?.theBrandButton?.title,
      buttonLink: acf?.theBrandButton?.url,
    },
    testimonialsSection: {
      show: showTestimonialsSection,
    },
  };
}